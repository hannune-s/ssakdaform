import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "꽃육점 - HANOOK",
  description: "정성을 다듬어 온기를 내어놓는 곳, 꽃육점-HANOOK",
  manifest: "/hanook-manifest.json",
};

export default function HanookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
