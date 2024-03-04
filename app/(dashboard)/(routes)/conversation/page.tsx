"use client";

import { Heading } from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { MessageCircleIcon, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

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

            const response = await axios.post("/api/conversation", {
                messages: newMessages
            });

            setMessages((current) => [...current, userMessage, response.data]);

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
                bgColor="bg-violet-500/10"/>
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
                            <FormField name="prompt" render={({ field }) => (
                                <FormItem className="col-span-11">
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
                                className="col-span-1 w-full" 
                                disabled={isLoading}>
                                <ArrowRight />
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message, index) => (
                            <div key={index}>
                                <div className={`${ message.role === 'user' ? 'text-gray-500' : 'text-gray-800'}`} >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConversationPage;