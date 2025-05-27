import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prompt } from "@/constants";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  const data = await request.json();
  const base64 = data.payload;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: base64,
            },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
  });
  const jsonstring = (message.content[0] as { text: string }).text;
  return NextResponse.json(JSON.parse(jsonstring), { status: 200 });
}
