"use client";

import { Heading } from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import TypingAnimation from "@/components/typing-animation";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ImageIcon, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ImagePage = () => {
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            amount: "1",
            resolution: "512x512"
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setImages([]);

            const response = await axios.post("/api/image", values);

            const urls = response.data.map((image: { url: string }) => image.url);

            setImages(urls);

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
                title="Image Generation"
                description="Generate an image from a text prompt"
                icon={ImageIcon}
                iconColor="text-pink-700"
                bgColor="bg-pink-700/10" />
            {/* <div className="mx-auto px-4 lg:px-8">
                <div className="flex flex-col-reverse h-[calc(100vh-275px)] overflow-auto">
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
            </div> */}
            <div className="mx-auto py-4 px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
                            <FormField name="prompt" render={({ field }) => (
                                <FormItem className="lg:col-span-7 col-span-10">
                                    <FormControl className="m-0 p-0">
                                        <Input
                                            className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                            disabled={isLoading}
                                            placeholder="A picture of a dog on the beach"
                                            {...field} />
                                    </FormControl>
                                </FormItem>
                            )} />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem className="lg:col-span-2 col-span-5">
                                        <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {amountOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                            <FormField
                                control={form.control}
                                name="resolution"
                                render={({ field }) => (
                                    <FormItem className="lg:col-span-2 col-span-5">
                                        <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {resolutionOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
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

export default ImagePage;