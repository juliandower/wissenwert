import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wissenswert",
  description: "Test your knowledge with AI-generated quizzes",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

