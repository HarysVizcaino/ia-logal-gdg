import type { Metadata } from "next";
import { Google_Sans, Roboto_Mono } from "next/font/google";
import "./globals.css";
import "./_presentation/scenes/opening.css";
import "./_presentation/scenes/section-two.css";
import "./_presentation/scenes/section-three.css";
import "./_presentation/scenes/section-four.css";
import "./_presentation/scenes/section-five.css";
import "./_presentation/scenes/section-six.css";
import "./_presentation/devfest-theme.css";

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'IA local, home labs y tokens “infinitos”',
  description:
    "Una presentación interactiva sobre modelos locales, hardware propio y el lugar correcto para cada problema.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${googleSans.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
