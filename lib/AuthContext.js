// lib/context/AuthContext.js

'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase"; // Importa as instâncias de auth e db do seu arquivo firebase.js

const AuthContext = createContext();

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Adiciona um console.log para depurar o UID do usuário logado
                console.log("UID do usuário logado:", currentUser.uid);
                
                // Busca os dados do usuário no Firestore, na coleção 'users' na raiz
                const userDocRef = doc(db, 'users', currentUser.uid);
                try {
                    const docSnap = await getDoc(userDocRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        setUserData(null);
                        console.log("Documento de usuário não encontrado no Firestore para o UID:", currentUser.uid);
                    }
                } catch (error) {
                    console.error("Erro ao buscar dados do usuário no Firestore:", error);
                    setUserData(null);
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);
    
    // Novo useEffect para monitorar e imprimir os dados do usuário
    useEffect(() => {
        if (userData) {
            console.log("Dados do usuário logado:", userData);
        } else {
            console.log("Nenhum usuário logado ou dados não encontrados.");
        }
    }, [userData]);

    return (
        <AuthContext.Provider value={{ user, userData, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

