// components/FeedbackModal.jsx
"use client";

import { useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function FeedbackModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    type: "melhoria",
    feedback: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [errorSending, setErrorSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorSending(false);
    setFeedbackSent(false);

    try {
      const feedbackData = {
        ...formData,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "feedbacks"), feedbackData);

      setFeedbackSent(true);
    } catch (error) {
      console.error("Erro ao enviar feedback para o Firebase:", error);
      setErrorSending(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/75">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Enviar Feedback</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            {/* Usando <i> tag para o ícone de fechar */}
            <i className="fa-solid fa-xmark h-5 w-5"></i>
          </button>
        </div>

        {feedbackSent ? (
          <div className="text-center py-8">
            <i className="fa-solid fa-check-circle text-green-500 text-6xl mb-4"></i>
            <p className="text-xl font-semibold text-gray-800 mb-4">Feedback Recebido!</p>
            <p className="text-gray-600 mb-6">Agradecemos muito sua contribuição.</p>
            <button
              onClick={() => {
                onClose();
                setFeedbackSent(false);
                setFormData({
                  type: "melhoria",
                  feedback: "",
                  contact: "",
                });
              }}
              className="bg-palette-2 text-white px-6 py-2 rounded-md hover:bg-palette-3 transition-colors duration-200 cursor-pointer"
            >
              Fechar
            </button>
          </div>
        ) : errorSending ? (
          <div className="text-center py-8">
            <i className="fa-solid fa-times-circle text-red-500 text-6xl mb-4"></i>
            <p className="text-xl font-semibold text-gray-800 mb-4">Erro no Envio!</p>
            <p className="text-gray-600 mb-6">Não foi possível enviar seu feedback. Por favor, tente novamente.</p>
            <button
              onClick={() => {
                setErrorSending(false);
              }}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 cursor-pointer"
            >
              Tentar Novamente
            </button>
            <button
              onClick={() => {
                onClose();
                setErrorSending(false);
                setFormData({
                  type: "melhoria",
                  feedback: "",
                  contact: "",
                });
              }}
              className="ml-4 bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition-colors duration-200 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        ) : (
          // Formulário de feedback
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="type" className="block text-gray-700 font-semibold mb-2">
                Tipo de Feedback
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2"
              >
                <option value="melhoria">Melhoria</option>
                <option value="critica">Crítica</option>
                <option value="ideia">Ideia</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="feedback" className="block text-gray-700 font-semibold mb-2">
                Sua Mensagem
              </label>
              <textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                rows="4"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2 resize-none"
                placeholder="Descreva sua melhoria, crítica ou ideia aqui..."
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="contact" className="block text-gray-700 font-semibold mb-2">
                Seu Contato (Opcional)
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2"
                placeholder="Ex: seuemail@dominio.com"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-palette-2 text-white px-4 py-2 rounded-md hover:bg-palette-3 transition-colors duration-200 cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar Feedback"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
