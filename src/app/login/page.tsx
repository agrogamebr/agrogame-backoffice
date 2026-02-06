'use client';

import { useState, useActionState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { loginAction } from '@/app/actions/auth';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
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
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email, CPF ou CNPJ
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                placeholder="Insira seu email, CPF ou CNPJ"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Insira sua senha"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {state?.error && (
              <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#007BFF] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#0056b3] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? 'Entrando...' : 'Entrar'}
            </button>

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
