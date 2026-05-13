import OpenAI from "openai";
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

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ fallback: true, items: getFallbackItems(mode, domain, difficulty, count) });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: [
        {
          role: "system",
          content:
            "You are generating pronunciation practice material. Return valid JSON only. The top-level object must contain an items array.",
        },
        {
          role: "user",
          content: JSON.stringify({
            requirements: [
              "Generate content that is difficult to pronounce.",
              "Match the requested domain, difficulty, and mode.",
              "Include readable pronunciation breakdowns.",
              "IPA is optional and should be included only when confident.",
              "Include a short example sentence when useful.",
              "Avoid obscure dictionary-only vocabulary.",
              "Prioritize words and phrases commonly spoken in real life.",
            ],
            schema: {
              items: [
                {
                  text: "string",
                  breakdown: "string",
                  ipa: "optional string",
                  sentence: "optional string",
                },
              ],
            },
            mode,
            difficulty,
            domain,
            count,
          }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "practice_items",
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
    });

    const parsed = JSON.parse(response.output_text) as { items: Array<Omit<PracticeItem, "id" | "mode" | "domain" | "difficulty">> };
    const items = parsed.items.map((item, index) => ({
      ...item,
      id: `${mode}-${domain}-${difficulty}-${index}-${item.text.toLowerCase().replaceAll(" ", "-")}`,
      mode,
      domain,
      difficulty,
    }));

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ fallback: true, items: getFallbackItems(mode, domain, difficulty, count) });
  }
}
