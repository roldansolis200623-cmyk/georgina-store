import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Georgina Home | Muebles y Decoracion",
  description: "Descubre nuestra exclusiva coleccion de muebles, decoracion e iluminacion. Piezas unicas que transforman tu hogar.",
  keywords: ["muebles", "decoracion", "iluminacion", "hogar", "chile"],
  authors: [{ name: "Georgina Home" }],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "Georgina Home | Muebles y Decoracion",
    description: "Descubre nuestra exclusiva coleccion de muebles y decoracion.",
    type: "website",
    locale: "es_CL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="font-poppins antialiased bg-white text-primary">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}