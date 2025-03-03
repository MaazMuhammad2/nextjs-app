// THIS CODE WON'T WORK BCZ WE DON'T HAVE APIKEY
import OpenAI from "openai";
import { OpenAiStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

// create an open ai client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // const { message } = await req.json();
    const prompt = ""
  
    // ASK OPENAI FOR A STREAMING CHAT COMPLETION GIVEN THE PROMPT
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      message,
    });
  
    // Convert a response into a friendly text-stream
    const stream = OpenAiStream(response);
  
    // Respond with stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
        const {name, status, headers, message} = error
        return NextResponse.json({
            name, status, headers, message
        }, {status})
    }else{
        console.log("an unepexted error occured")
        throw error
    }
  }
}
