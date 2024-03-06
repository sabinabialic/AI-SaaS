"use client";

import { Heading } from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import TypingAnimation from "@/components/typing-animation";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { MessageCircleIcon, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { cn } from "@/lib/utils";

const ConversationPage = () => {
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

            const response = await axios.post("/api/conversation", {
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
                title="Conversation"
                description="Our most advanced conversation model"
                icon={MessageCircleIcon}
                iconColor="text-violet-500"
                bgColor="bg-violet-500/10" />
            <div className="mx-auto px-4 lg:px-8">
                <div className="flex flex-col-reverse h-[calc(100vh-275px)] overflow-auto">
                    {/* <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">ChatGPT</h1> */}
                    <div className="flex-grow p-6">
                        <div className="flex flex-col space-y-4">
                            {
                                messages.map((message, index) => (
                                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}>
                                        <div className={ cn("whitespace-pre-line rounded-lg p-4 text-white min-w-md max-w-xl",
                                            message.role === 'user' ? 'bg-violet-500' : 'bg-gray-800')}>
                                            {message.content}
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
            <div className="mx-auto py-4 lg:py-6 px-4 lg:px-8">
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
                                            placeholder="How do I find the slope of a line?"
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

export default ConversationPage;