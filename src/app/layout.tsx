import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from '../../lib/AuthContext';
import FloatingButton from './components/FloatingButton';
import '@fortawesome/fontawesome-free/css/all.min.css';

export const metadata: Metadata = {
  title: "Apoio UFU",
  description: "Apoio à comunidade da UFU",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

};

const montserrat = Montserrat({
  subsets: ["latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <head>
        <meta name="description" content="Apoio à comunidade da UFU" />
      </head>
      <body>
        <AuthProvider>
          <Header />
          <main className="pt-40 flex flex-col items-center justify-between min-h-screen">
            {children}
            <Footer />
          </main>
          <FloatingButton />
        </AuthProvider>
      </body>
    </html>
  );
}

