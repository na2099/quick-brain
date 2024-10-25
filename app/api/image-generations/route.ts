import { NextResponse } from 'next/server';
import OpenAI from 'openai'; // Assuming you are using OpenAI

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const data = await req.json(); // Expecting JSON input from the client
    const prompt = data.prompt; // Assuming 'prompt' is the key for the text input

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Generate image based on the prompt using the OpenAI API (or any other service)
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: '512x512',
    });

    const imageUrl = response.data[0].url;

    if (!imageUrl) {
      throw new Error('Failed to generate image');
    }

    // Return the generated image URL to the client
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
