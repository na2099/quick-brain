import { NextResponse } from "next/server"; 
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are a flashcard creator. Create exactly 10 flashcards from the provided queries, you are free to make whatever you like.
Each flashcard should have a question on the front and an answer on the back.
Both front and back should be one sentence long.
Return the result in a JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

function splitTextIntoChunks(text: string, maxTokens: number): string[] {
    const chunks = [];
    let currentChunk = '';

    const sentences = text.split('. ');

    sentences.forEach(sentence => {
        if ((currentChunk + sentence).length < maxTokens) {
            currentChunk += sentence + '. ';
        } else {
            chunks.push(currentChunk);
            currentChunk = sentence + '. ';
        }
    });

    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
}

export async function POST(req: Request) {
    const data = await req.text();

    try {
        const chunks = splitTextIntoChunks(data, 8000);
        const flashcards = [];

        for (const chunk of chunks) {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: chunk }
                ],
            });

            const content = completion.choices[0].message.content;

            if (!content) {
                continue; 
            }

            const result = JSON.parse(content);
            flashcards.push(...result.flashcards);
        }

        if (flashcards.length === 0) {
            return NextResponse.json({ error: "Failed to generate flashcards (Flashcards length is zero)" }, { status: 500 });
        }

        return NextResponse.json({ flashcards });
    } catch (error) {
        console.error("Error creating chat completion:", error);
        return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
    }
}