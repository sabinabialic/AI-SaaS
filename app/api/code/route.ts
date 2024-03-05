import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAIApi from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAIApi ({
    apiKey: process.env.OPEN_API_KEY
});

const instructionMessage: ChatCompletionMessageParam = {
    role: "system",
    content: "You are a code generator. You must answer using code snippets and code comments. Give a detailed explanation after the code snippet."
}

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!openai.apiKey) {
            return new NextResponse("OpenAI Api Key not configured", { status: 500 });
        }

        if (!messages) {
            return new NextResponse("Message is required", { status: 400 });
        }

        const response =  await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages]
        });

        console.log(response.choices[0].message);

        return NextResponse.json(response.choices[0].message);

    } catch (error) {
        console.log("[CODE_ERROR", error);
        return new NextResponse("Internal error", { status: 500 });
    }
    
}
