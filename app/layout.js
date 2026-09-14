import "./globals.css";
import Providers from "@/components/providers";
export const metadata = {
  title: "Elevate Basketball | Physical literacy through basketball",
  description:
    "Developing physical literacy through basketball: movement skills, confidence and enjoyment that help young people build a lasting relationship with being active.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
