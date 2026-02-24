import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next + zod-envkit example",
  description: "Minimal Next.js app with type-safe env validation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
