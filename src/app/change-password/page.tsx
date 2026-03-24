'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { changePasswordAction, logoutAction } from '@/app/actions/auth';

interface PasswordValidation {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export default function ChangePasswordPage() {
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

      const result = await changePasswordAction(formData);

      if (result.success) {
        addToast(result.message || 'Senha alterada com sucesso!', 'success', 3000);
        // Aguarda um momento para o toast ser visível, então faz logout completo
        setTimeout(async () => {
          await logoutAction();
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
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      {/* SVG de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[65%] left-[51%] -translate-x-1/2 -translate-y-1/2 w-[108%] h-[108%] max-w-none flex items-center justify-center">
          <Image
            src="/wind.svg"
            alt=""
            width={1440}
            height={712}
            className="w-full h-auto object-contain opacity-100"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
        <div className="w-full max-w-md bg-transparent p-6 flex flex-col justify-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/logoagrogame.svg"
              alt="AgroGame Logo"
              width={280}
              height={80}
              priority
              className="w-auto h-auto"
            />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
            Crie uma nova senha
          </h2>

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

            <Button
              type="submit"
              size="lg"
              className="w-full mt-6"
              isLoading={isSubmitting}
              disabled={!canSubmit}
            >
              Confirmar
            </Button>
          </form>
        </div>
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
