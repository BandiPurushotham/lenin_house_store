
import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "The Lenin House",
  description: "Premium men's shirts and pants crafted for power and presence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
