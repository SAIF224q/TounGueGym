import { NextResponse } from "next/server";
import { normalizeChunks } from "@/lib/chunks";
import { getFallbackItems } from "@/lib/sample-data";
import type { Difficulty, PracticeItem, PracticeMode, SessionSettings } from "@/lib/types";

const validModes = new Set<PracticeMode>(["word", "phrase", "tongue_twister"]);
const validDifficulties = new Set<Difficulty>(["easy", "medium", "hard"]);

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<SessionSettings>;
  const mode = validModes.has(body.mode as PracticeMode) ? (body.mode as PracticeMode) : "word";
  const difficulty = validDifficulties.has(body.difficulty as Difficulty) ? (body.difficulty as Difficulty) : "medium";
  const domain = typeof body.domain === "string" && body.domain.trim() ? body.domain.trim() : "Everyday";
  const count = typeof body.count === "number" ? Math.min(Math.max(body.count, 5), 30) : 12;

  const apiKey = process.env.INCEPTION_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      fallback: true,
      message: "Using built-in practice set because INCEPTION_API_KEY is not loaded. Set INCEPTION_API_KEY in .env.local and restart the server.",
      items: getFallbackItems(mode, domain, difficulty, count),
    });
  }

  try {
    const response = await fetch("https://api.inceptionlabs.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mercury-2",
        messages: [
          {
            role: "system",
            content:
              "You generate pronunciation practice material. Return only data that matches the requested JSON schema.",
          },
          {
            role: "user",
            content: JSON.stringify({
              task: "Generate pronunciation practice items.",
              mode,
              difficulty,
              domain,
              count,
              requirements: [
                "Generate content that is difficult to pronounce.",
                "Match the requested domain, difficulty, and mode.",
                "Use real-life words and phrases rather than obscure dictionary-only vocabulary.",
                "chunks: 2-6 short parts to practice in order for articulation (orthographic or morpheme-style when helpful, e.g. hemoglobin -> [\"hemo\", \"globin\"], entrepreneurial -> [\"en\", \"tre\", \"pre\", \"neur\"]). Must be substrings of text in order; do not use phonetic spellings in chunks.",
                "breakdown: separate readable pronunciation guide with hyphens and stress caps (e.g. HEE-muh-GLOH-bin). Do not derive chunks from breakdown hyphen splits.",
                "Use an empty string for ipa when unsure.",
                "Use an example sentence that helps pronunciation practice.",
              ],
              examples: [
                {
                  text: "hemoglobin",
                  chunks: ["hemo", "globin"],
                  breakdown: "HEE-muh-GLOH-bin",
                },
                {
                  text: "Entrepreneurial",
                  chunks: ["en", "tre", "pre", "neur"],
                  breakdown: "on-truh-pruh-NUR-ee-ul",
                },
              ],
            }),
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "practice_items",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["items"],
              properties: {
                items: {
                  type: "array",
                  minItems: count,
                  maxItems: count,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["text", "chunks", "breakdown", "ipa", "sentence"],
                    properties: {
                      text: { type: "string" },
                      chunks: {
                        type: "array",
                        items: { type: "string" },
                        minItems: 2,
                        maxItems: 8,
                      },
                      breakdown: { type: "string" },
                      ipa: { type: "string" },
                      sentence: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        reasoning_effort: "medium",
        temperature: 0.75,
        max_tokens: 8192,
        stream: false,
      }),
    });

    const completion = (await response.json()) as {
      error?: { message?: string };
      choices?: Array<{ message?: { content?: string } }>;
    };

    if (!response.ok) {
      throw new Error(completion.error?.message ?? `Inception API returned ${response.status}`);
    }

    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Inception API returned an empty response.");
    }

    const parsed = JSON.parse(content) as { items?: Array<Omit<PracticeItem, "id" | "mode" | "domain" | "difficulty">> };

    if (!parsed.items?.length) {
      throw new Error("Inception API response did not include any practice items.");
    }

    const items = parsed.items.slice(0, count).map((item, index) => ({
      ...item,
      chunks: normalizeChunks(item.text, item.chunks),
      id: `${mode}-${domain}-${difficulty}-${index}-${item.text.toLowerCase().replaceAll(/\s+/g, "-")}`,
      mode,
      domain,
      difficulty,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : "AI generation failed.";
    const message = rawMessage.replace(/[A-Za-z0-9_-]*sk[-_][A-Za-z0-9_*.-]+/g, "[redacted API key]");
    return NextResponse.json({
      fallback: true,
      message: `Using built-in practice set because AI generation failed: ${message}`,
      items: getFallbackItems(mode, domain, difficulty, count),
    });
  }
}
