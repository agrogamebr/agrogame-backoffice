'use client';

import { useActionState, useState, useRef } from 'react';
import Image from 'next/image';
import { loginAction } from '@/app/actions/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {});
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleForgotPasswordClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsForgotPasswordModalOpen(true);
  };

  const handleForgotPasswordSuccess = () => {
    // Limpar o campo de senha
    if (passwordInputRef.current) {
      passwordInputRef.current.value = '';
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
        <div className="w-[375px] h-[667px] bg-transparent p-6 flex flex-col justify-center">
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

          <form action={formAction} className="space-y-6">
            <Input
              label="Email, CPF ou CNPJ"
              id="identifier"
              name="identifier"
              placeholder="Insira seu email, CPF ou CNPJ"
              defaultValue={state?.identifier}
              error={state?.errors?.identifier}
            />

            <Input
              ref={passwordInputRef}
              key={state?.errors?.password || state?.errors?.general}
              label="Senha"
              id="password"
              name="password"
              placeholder="Insira sua senha"
              isPassword
              error={state?.errors?.password}
            />

            {state?.errors?.general && (
              <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center">
                {state.errors.general}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isPending}
            >
              Entrar
            </Button>

            <div className="text-center">
              <a
                href="#"
                onClick={handleForgotPasswordClick}
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer"
              >
                Esqueci a senha
              </a>
            </div>
          </form>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
        onSuccess={handleForgotPasswordSuccess}
      />
    </div>
  );
}
