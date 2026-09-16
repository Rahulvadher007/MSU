"use client";
import { usePathname } from "next/navigation";
import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import { FloatingChatWidget } from "@/components/FloatingChatWidget";

export function ConditionalNavs({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChat = pathname.startsWith("/chat");

  return (
    <>
      {!isChat && <TopNav />}
      <main id="content">{children}</main>
      {!isChat && <Footer />}
      {!isChat && <FloatingChatWidget />}
    </>
  );
}
