import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProducerDataFilter } from '@/components/producers/ProducerDataFilter';
import { ProducerDataForm } from '@/components/producers/ProducerDataForm';
import { getUserInfo } from '@/services/producers.service';

export default async function ManageProducerPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ 
    name?: string;
    status?: string;
  }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const userId = resolvedParams.id;
  const userName = resolvedSearchParams.name || 'Usuário';
  const status = resolvedSearchParams.status || 'Ativo';

  let userData = null;
  let userError = null;
  try {
    userData = await getUserInfo(userId);
  } catch (error) {
    console.error('[ManageProducerPage] Erro ao buscar dados do usuário:', error);
    userError = 'Erro ao carregar informações do produtor';
  }

  type ProducerStatus = 'Ativo' | 'Inativo' | 'Pendente' | 'Aprovado' | 'Rejeitado' | 'Suspenso';

  const statusBadgeVariant: Record<ProducerStatus, "enviado" | "rascunho" | "excluida"> = {
    'Ativo': 'enviado',
    'Aprovado': 'enviado',
    'Inativo': 'excluida',
    'Rejeitado': 'excluida',
    'Pendente': 'rascunho',
    'Suspenso': 'rascunho',
  };

  return (
    <div className="max-w-8xl mx-4 space-y-4 pt-14 pb-8 overflow-y-auto max-h-screen">
      <div className="flex items-center justify-between gap-5 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/users" className="text-gray-600 hover:text-gray-900 cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Gerenciar produtores &gt; {userName}
            </h1>
            <Badge variant={statusBadgeVariant[status as ProducerStatus]}>
              {status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Button
            variant="outline"
            className="h-11 px-5 font-medium"
          >
            Criar Vínculos
          </Button>

          <div className="w-48 h-11">
            <ProducerDataFilter userId={userId} />
          </div>
        </div>
      </div>

      <ProducerDataForm userData={userData} error={userError} />
    </div>
  );
}
