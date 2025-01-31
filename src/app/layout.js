import { Montserrat } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const montserrat = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "MedPuls",
  description: "MedPuls",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <Sidebar>{children}</Sidebar>
      </body>
    </html>
  );
}
