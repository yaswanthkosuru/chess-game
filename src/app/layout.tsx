import type { Metadata } from "next";
import { Play } from "next/font/google";
import "./globals.css";
import Ablyprovider from "./components/Ablyprovider";

const PlayFont = Play({
  variable: "--font-play",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Chess",
  description: "Play chess against a friend or random opponent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${PlayFont.className} antialiased`}>
        <Ablyprovider>{children}</Ablyprovider>
      </body>
    </html>
  );
}
