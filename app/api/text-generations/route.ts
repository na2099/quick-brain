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

export async function POST(req: Request) {
    const data = await req.text();

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: data }
            ],
        });
        
        const content = completion.choices[0].message.content;

        if (!content) {
            return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
        }

        const flashcards = JSON.parse(content);
        return NextResponse.json( flashcards.flashcards );
    } catch (error) {
        console.error("Error creating chat completion:", error);
        return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
    }
}