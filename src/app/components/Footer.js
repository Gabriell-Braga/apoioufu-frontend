// components/Footer.js
"use client";

const Footer = () => {
    return (
        <footer className="w-full bg-palette-2 text-palette-5 py-8 justify-self-end">
            <div className="size-control mx-auto flex md:flex-row flex-col gap-5 items-center justify-between">
                <p className="text-sm text-palette-5">© 2025 Apoio UFU. Todos os direitos reservados.</p>
                <div className="flex items-center gap-4">
                    <a href="#" className="text-gray-200 hover:text-palette-1">Política de Privacidade</a>
                    <a href="#" className="text-gray-200 hover:text-palette-1">Termos de Uso</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;