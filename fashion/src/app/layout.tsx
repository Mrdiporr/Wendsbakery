import type { Metadata } from "next";
import { CartProvider } from "../context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wardrobe Sensation | Modern Minimalist Fashion",
  description: "Curated collection of essential and premium clothing for the modern individual.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
