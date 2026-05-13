import { NextResponse } from "next/server";
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
                "The breakdown must be readable for non-IPA users.",
                "Use an empty string for ipa when unsure.",
                "Use an example sentence that helps pronunciation practice.",
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
                    required: ["text", "breakdown", "ipa", "sentence"],
                    properties: {
                      text: { type: "string" },
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
