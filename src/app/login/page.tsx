// src/app/login/page.tsx

import React from 'react';

export default function LoginPage() {
    return (
        <div className="size-control flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-sm w-full">
                <h1 className="text-3xl font-bold text-center mb-6">Entrar</h1>
                <p className="text-center text-gray-600 mb-6">Bem-vindo de volta! Por favor, insira suas credenciais para continuar.</p>
                <form>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                        <input type="password" id="password" className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2" required />
                    </div>
                    <button type="submit" className="w-full bg-palette-3 text-palette-5 py-2 rounded-md hover:bg-palette-2 transition-colors duration-200">Entrar</button>
                    <div className="mt-4 text-center">
                        <span>Não tem uma conta? <a href="/registrar" className="text-palette-1 hover:text-palette-4">Registre-se</a></span>
                    </div>
                </form>
            </div>
        </div>
    );
}