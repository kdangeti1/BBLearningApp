import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bluebonnet Quest Grade 3 | Texas TEKS Learning Platform",
  description:
    "Interactive Grade 3 Learning Platform powered by the Texas Bluebonnet Learning Curriculum (Mathematics Modules 1–7, Reading Language Arts Units 1–10, Foundational Skills Units 1–10). Built for the Firebase Free Tier.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

