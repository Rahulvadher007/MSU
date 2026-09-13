"use client";
import { usePathname } from "next/navigation";
import { TopNav } from "./TopNav";

export function ConditionalNavs({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChat = pathname.startsWith("/chat");

  return (
    <>
      {!isChat && <TopNav />}
      <main>{children}</main>
    </>
  );
}
