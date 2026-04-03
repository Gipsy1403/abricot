import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

config.autoAddCss = false;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata = {
  title: "Abricot",
  description: "Un outil SaaS de gestion de projet innovant, utilisant de l’IA pour optimiser les flux de travail des freelances",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning className={`${inter.variable} ${manrope.variable}`}>
        {children}
      </body>
    </html>
  );
}
