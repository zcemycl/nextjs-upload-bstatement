import { NextResponse } from "next/server";
import Anthropic from '@anthropic-ai/sdk';

const prompt = `
You are a bank assistant.
- You must respond with ONLY a valid JSON object. 
- Do not include any text, explanations, or formatting outside of the JSON. 
- Your entire response should be parseable as JSON.
- The response must start with { and end with }.
Based on the given bank statement, can you extract the following informations, 
- Name and address of the account holder
- Latest Date of the document, if present
- A list of all of the transactions in the document
- The starting and ending balance of the statement. 
Answer this with ONLY a structured json of a given interface below, 
{
"name": string,
"address": string,
"date": string,
"transactions": string[],
"starting-balance": number,
"ending balance": number,
}
`

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  const data = await request.json();
  const base64 = data.payload;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: base64
            }
          },
          {
            type: 'text',
            text: prompt,
          }
        ]
      }
    ]
  });
  const jsonstring = (message.content[0] as any).text;
  return NextResponse.json(JSON.parse(jsonstring), { status: 200 });
}
