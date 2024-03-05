"use client";

import { Heading } from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import TypingAnimation from "@/components/typing-animation";
import { cn } from "@/lib/utils";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Code2Icon, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const CodePage = () => {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionMessageParam = {
                role: "user",
                content: values.prompt
            };

            const newMessages = [...messages, userMessage];

            setMessages((current) => [...current, userMessage]);

            const response = await axios.post("/api/code", {
                messages: newMessages
            });

            setMessages((current) => [...current, response.data]);
            form.reset();
        } catch (error: any) {
            console.log(error);
        } finally {
            router.refresh();
        }
    };

    return (
        <div>
            <Heading
                title="Code Generation"
                description="Generate code using descriptive text"
                icon={Code2Icon}
                iconColor="text-blue-700"
                bgColor="bg-blue-700/10" />
            <div className="container mx-auto">
                <div className="flex flex-col-reverse h-[calc(100vh-260px)] overflow-auto">
                    <div className="flex-grow p-6">
                        <div className="flex flex-col space-y-4">
                            {
                                messages.map((message, index) => (
                                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}>
                                        <div className={cn("rounded-lg p-4 text-white min-w-md max-w-full",
                                            message.role === 'user' ? 'bg-blue-700' : 'bg-gray-800')}>
                                            <ReactMarkdown components={{
                                                pre: ({ node, ...props }) => (
                                                    <div className="overflow-auto w-full my-2 bg-white/10 p-2 rounded-lg">
                                                        <pre {...props} />
                                                    </div>
                                                ),
                                                code: ({ node, ...props }) => (
                                                    <code className="bg-black/10 rounded-lg p-1" {...props} />
                                                )
                                            }} className="text-sm overflow-hidden leading-7">
                                                {message.content || ""}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                isLoading &&
                                <div key={messages.length} className="flex justify-start">
                                    <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                                        <TypingAnimation />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-4 px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
                            <FormField name="prompt" render={({ field }) => (
                                <FormItem className="lg:col-span-11 col-span-10">
                                    <FormControl className="m-0 p-0">
                                        <Input
                                            className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                            disabled={isLoading}
                                            placeholder="Simple toggle button using react"
                                            {...field} />
                                    </FormControl>
                                </FormItem>
                            )}>
                            </FormField>
                            <Button
                                className="lg:col-span-1 col-span-2 w-full"
                                disabled={isLoading}>
                                <ArrowRight />
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default CodePage;