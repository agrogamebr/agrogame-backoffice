'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useToast } from './ui/Toast';
import { forgotPassword } from '@/services/auth.service';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Por favor, insira seu email');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await forgotPassword(email);
      setSuccess(true);
      addToast(response.message, 'success', 5000);
      // Fechar modal após 1.5 segundos
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao recuperar senha';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all scale-100 opacity-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-center justify-end mb-4">
            <Button
              onClick={handleClose}
              variant="ghost"
              size="icon"
              className="rounded-full p-1 h-auto"
              aria-label="Fechar"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5 text-gray-400" />
            </Button>
          </div>

          <div className="flex justify-center mb-6">
            <Image
              src="/logoagrogame.svg"
              alt="AgroGame Logo"
              width={200}
              height={60}
              priority
              className="w-auto h-auto"
            />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
            Esqueci minha senha
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="Email"
                id="forgot-email"
                name="email"
                type="email"
                placeholder="Insira seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center font-medium">
                    {error}
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting || success}
            >
              Recuperar senha
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
