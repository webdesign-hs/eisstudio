import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/shop";

const montserrat = localFont({
  src: [
    {
      path: "../public/fonts/Montserrat-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Montserrat-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Montserrat-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-montserrat",
  display: "swap",
});

const lato = localFont({
  src: [
    {
      path: "../public/fonts/Lato-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Lato-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Lato-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "sitNeis – Wo Eis zur Story wird",
  description: "sitNeis – Die investigative Eismanufaktur. Investigativer Genuss seit 2024.",
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${montserrat.variable} ${lato.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${montserrat.variable} ${lato.variable} antialiased`}>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
