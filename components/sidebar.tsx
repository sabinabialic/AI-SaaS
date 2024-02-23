"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";

import { cn } from "@/lib/utils";
import { Code2Icon, CodeSquare, ImagesIcon, LayoutDashboard, LucideSettings, MessageCircle, Music2Icon, Settings2Icon, SettingsIcon, VideoIcon, VideotapeIcon } from "lucide-react";

const montserrat = Montserrat({weight: "600", subsets: ["latin"]});

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-[#00fefb]"
    },
    {
        label: "Conversation",
        icon: MessageCircle,
        href: "/dashboard",
        color: "text-[#00fefb]"
    },
    {
        label: "Image Generation",
        icon: ImagesIcon,
        href: "/dashboard",
        color: "text-[#00fefb]"
    },
    {
        label: "Video Generation",
        icon: VideoIcon,
        href: "/dashboard",
        color: "text-[#00fefb]"
    },
    {
        label: "Music Generation",
        icon: Music2Icon,
        href: "/dashboard",
        color: "text-[#00fefb]"
    },
    {
        label: "Code Generation",
        icon: Code2Icon,
        href: "/dashboard",
        color: "text-[#00fefb]"
    },
    {
        label: "Image Generation",
        icon: ImagesIcon,
        href: "/dashboard",
        color: "text-[#00fefb]"
    },
    {
        label: "Settings",
        icon: SettingsIcon,
        href: "/dashboard",
        color: "text-white"
    },
];

const Sidebar = () => {
    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-12 h-12 mr-4">
                        <Image
                            fill
                            alt="Logo"
                            src="/logo.png" />
                    </div>
                    <h1 className={cn("text-3xl font-bold", montserrat.className)}>Genius</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            href={route.href}
                            key={route.href}
                            className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer 
                                hover:text=white hover:bg-white/10 rounded-lg transition">
                            
                            <div className="flex items-center items-1">
                                <route.icon className={cn("h-4 w-4 mr-4", route.color)} />
                                {route.label}
                            </div>

                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;