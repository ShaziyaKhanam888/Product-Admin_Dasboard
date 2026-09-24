import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Product Admin Dashboard",
  description:
    "A responsive product management dashboard built with Next.js, Tailwind CSS, and Axios.",
  icons: {
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoz5J9pnoAbuDQooZwFybuFTmqNG3ZweuoQh2sGUBegg&s=10",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
