"use client";

import { Heading } from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { MessageCircleIcon, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";

const ConversationPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // TODO - Connect to an API
        console.log(values);
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
                    Message Content
                </div>
            </div>
        </div>
    );
}

export default ConversationPage;