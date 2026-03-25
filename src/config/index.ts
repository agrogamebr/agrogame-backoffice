/**
 * Arquivo de configuração centralizado para variáveis de ambiente
 * Este arquivo facilita o acesso a variáveis de ambiente em todo o projeto
 */

export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://agrogame-api-dev-1017408486443.us-central1.run.app',
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Agrogame Backoffice',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    env: process.env.NODE_ENV || 'development',
  },
  debug: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
  },
} as const;

export default config;
