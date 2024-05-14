import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Store Man",
  description: "Create store managment with next and express",
};

type Props = Readonly<{
  children: React.ReactNode
}>

export default function RootLayout({ children }: Props) {
  return (
    <html lang="fa">
      <body>{children}</body>
    </html>
  );
}
