import { ProducersFilter } from '@/components/producers/ProducersFilter';
import { EmptyState } from '@/components/activities/EmptyState';
import { ProducersTable, Producer, ProducerStatus } from '@/components/producers/ProducersTable';
import { listProducers } from '@/services/producers.service';
import { redirect } from 'next/navigation';

const statusMapping: Record<string, ProducerStatus> = {
  'Aprovado': 'Ativo',
  'Reprovado': 'Inativo',
  'Pendente': 'Pendente',
};

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ page?: string; size?: string; name?: string; cpf?: string; status?: string }> }) {

  const params = await searchParams;
  const page = Number(params?.page) || 0;
  const size = Number(params?.size) || 10;

  // Build filters object from query params
  const filters = {
    name: params?.name,
    cpf: params?.cpf,
    status: params?.status,
  };

  let producers: Producer[] = [];
  let totalElements = 0;
  let totalPages = 0;

  try {
    const producersResponse = await listProducers(page, size, filters);

    producers = producersResponse.content.map(p => ({
      userId: p.userId,
      name: p.fullName,
      cpf: p.cpf || 'N/A',
      status: statusMapping[p.statusName] || 'Pendente',
      statusCode: p.statusName.toLowerCase() as 'active' | 'inactive' | 'pending',
      createdAt: p.createdAt,
    }));

    totalElements = producersResponse.totalElements;
    totalPages = producersResponse.totalPages;
  } catch (e: unknown) {
    const err = e as { message?: string; status?: number };
    if (err.message === 'Token JWT ausente ou inválido' || err.message === 'Unauthorized' || err.status === 401) {
      redirect(`/api/auth/logout?error=${encodeURIComponent(err.message || 'Erro desconhecido')}`);
    }
    console.error(err);
    // Don't set error - just show empty state
  }

  const hasProducers = producers.length > 0;

  return (
    <div className="max-w-8xl mx-4 space-y-4 pt-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <h1 className="w-92 h-11 text-2xl font-bold text-gray-900 flex items-center">
          Gerenciar Produtores Rurais
        </h1>

        <div className="w-48 h-11">
          <ProducersFilter />
        </div>
      </div>

      <div className="space-y-4">
        {hasProducers ? (
          <ProducersTable
            producers={producers}
            currentPage={page}
            pageSize={size}
            totalElements={totalElements}
            totalPages={totalPages}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 flex items-center justify-center p-8">
            <EmptyState
              title="Nenhum produtor associado"
              description="Não há produtores rurais cadastrados na sua empresa ainda"
            />
          </div>
        )}
      </div>
    </div>
  );
}
