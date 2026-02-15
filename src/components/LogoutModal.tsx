'use client';

import { X } from 'lucide-react';
import { Button } from './ui/Button';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] transform transition-all scale-100 opacity-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Sair da conta</h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="rounded-full p-1 h-auto"
            >
              <X className="w-5 h-5 text-gray-400" />
            </Button>
          </div>

          <p className="text-gray-600 mb-8">
            Tem certeza que deseja sair? Você precisará fazer login novamente para acessar o sistema.
          </p>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1 rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={onConfirm}
              className="flex-1 rounded-xl"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
