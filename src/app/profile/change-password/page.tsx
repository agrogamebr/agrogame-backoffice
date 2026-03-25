'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { changePasswordVoluntaryAction } from '@/app/actions/auth';

interface PasswordValidation {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export default function ProfileChangePasswordPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calcula a validação da senha diretamente
  const validation: PasswordValidation = {
    minLength: newPassword.length >= 8,
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasLowerCase: /[a-z]/.test(newPassword),
    hasNumber: /\d/.test(newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  // Verifica se as senhas coincidem
  const passwordsMatch = confirmPassword.length > 0 ? newPassword === confirmPassword : null;

  const isPasswordValid = Object.values(validation).every((v) => v === true);
  const canSubmit = isPasswordValid && passwordsMatch === true && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('newPassword', newPassword);

      const result = await changePasswordVoluntaryAction(formData);

      if (result.success) {
        addToast(result.message || 'Senha alterada com sucesso!', 'success', 3000);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        addToast(result.error || 'Erro ao alterar senha', 'error');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      addToast('Erro ao alterar senha', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Trocar Senha
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Crie uma nova senha para sua conta
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                label="Nova senha"
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Digite sua nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                isPassword
              />
            </div>
            <div className="flex items-center justify-center w-10 h-11 mb-0">
              {isPasswordValid && newPassword.length > 0 && (
                <Check className="w-6 h-6 text-green-500" />
              )}
            </div>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                label="Digite a senha novamente"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Digite novamente sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                isPassword
              />
            </div>
            <div className="flex items-center justify-center w-10 h-11 mb-0">
              {passwordsMatch !== null && (
                <>
                  {passwordsMatch ? (
                    <Check className="w-6 h-6 text-green-500" />
                  ) : (
                    <X className="w-6 h-6 text-red-500" />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Regras de validação */}
          <div className="mt-6 space-y-2 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-3">
              A senha deve conter:
            </p>
            
            <ValidationItem
              label="Pelo menos 8 caracteres"
              isValid={validation.minLength}
            />
            <ValidationItem
              label="Pelo menos uma letra maiúscula"
              isValid={validation.hasUpperCase}
            />
            <ValidationItem
              label="Pelo menos uma letra minúscula"
              isValid={validation.hasLowerCase}
            />
            <ValidationItem
              label="Pelo menos um número"
              isValid={validation.hasNumber}
            />
            <ValidationItem
              label="Pelo menos um caractere especial (!@#$%^&*...)"
              isValid={validation.hasSpecialChar}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="flex-1"
              onClick={() => router.push('/dashboard')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="lg"
              className="flex-1"
              isLoading={isSubmitting}
              disabled={!canSubmit}
            >
              Confirmar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ValidationItemProps {
  label: string;
  isValid: boolean;
}

function ValidationItem({ label, isValid }: ValidationItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
          isValid
            ? 'bg-green-500 border-green-500'
            : 'bg-white border-gray-300'
        }`}
      >
        {isValid && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
      <span
        className={`text-sm transition-colors ${
          isValid ? 'text-green-700 font-medium' : 'text-gray-600'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
