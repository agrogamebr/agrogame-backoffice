'use client';

import { useActionState } from 'react';
import Image from 'next/image';
import { loginAction } from '@/app/actions/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {});

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

      {/* Container do formulário */}
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
              required
            />

            <Input
              label="Senha"
              id="password"
              name="password"
              placeholder="Insira sua senha"
              isPassword
              required
            />

            {state?.error && (
              <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center">
                {state.error}
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

            {/* Link Esqueci a senha */}
            <div className="text-center">
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Esqueci a senha
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
