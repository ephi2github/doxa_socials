import type { Metadata, Viewport } from "next";
import { Georama } from "next/font/google";
import "./globals.css";

const georama = Georama({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-georama",
});

export const metadata: Metadata = {
  title: "DOXA Social — share every link from one scan",
  description: "One scan. All your links. Everything lives in the URL — no signup, no database.",
};

export const viewport: Viewport = {
  themeColor: "#19003a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${georama.variable} font-sans antialiased min-h-screen`}>
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#19003a] via-[#2a0d5e] to-[#3d1487]" />
          <div className="absolute top-[-10%] left-[12%] w-[900px] h-[500px] bg-[#b277d335] blur-[120px] rounded-full" />
          <div className="absolute top-[10%] right-[-10%] w-[700px] h-[400px] bg-[#7851a930] blur-[100px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[50%] -translate-x-1/2 w-[600px] h-[400px] bg-[#b277d320] blur-[100px] rounded-full" />
        </div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
