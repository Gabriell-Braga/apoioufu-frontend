import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from './components/Header';

export const metadata: Metadata = {
  title: "Apoio UFU",
  description: "Apoio à comunidade da UFU",
};

const montserrat = Montserrat({
  subsets: ["latin-ext"], // Inclua o subset para suporte a caracteres estendidos (útil para português)
  variable: "--font-montserrat", // Defina uma variável CSS para usar no CSS e Tailwind
  display: "swap", // Opcional: Garante que o texto fique visível durante o carregamento da fonte
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body>
        <Header /> {/* Adicione seu componente Header aqui */}
        <main className="pt-16"> {/* Adicione um padding-top para o conteúdo não ficar por baixo do header fixo */}
          {children} {/* Isso renderiza o conteúdo da sua page.tsx e outras rotas */}
        </main>
      </body>
    </html>
  );
}

