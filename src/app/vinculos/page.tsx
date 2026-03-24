import { redirect } from 'next/navigation';
import { ProducerLinksTable } from '@/components/producers/ProducerLinksTable';
import { ProducerLinksFilter } from '@/components/producers/ProducerLinksFilter';
import { listProducerLinks } from '@/services/producers.service';

export default async function ProducerLinksPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ 
    page?: string;
    size?: string;
    name?: string;
    cpf?: string;
    statusId?: string;
  }>
}) {
  const resolvedSearchParams = await searchParams;
  
  const page = parseInt(resolvedSearchParams.page || '0', 10);
  const size = parseInt(resolvedSearchParams.size || '5', 10);

  const filters = {
    name: resolvedSearchParams.name,
    cpf: resolvedSearchParams.cpf,
    statusId: resolvedSearchParams.statusId ? Number(resolvedSearchParams.statusId) : undefined,
  };

  let linksData = null;
  let error = null;

  try {
    linksData = await listProducerLinks(page, size, filters);
  } catch (e: unknown) {
    const err = e as { message?: string; status?: number };
    console.error('[ProducerLinksPage] Erro ao buscar vínculos:', err);
    
    if (err.message === 'Token JWT ausente ou inválido' || err.message === 'Unauthorized' || err.status === 401) {
      redirect(`/api/auth/logout?error=${encodeURIComponent(err.message || 'Erro desconhecido')}`);
    }
    
    error = 'Erro ao carregar vínculos';
  }

  return (
    <div className="max-w-8xl mx-4 space-y-4 pt-14 pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <h1 className="w-92 h-11 text-2xl font-bold text-gray-900 flex items-center">
          Gerenciamento de Vínculos
        </h1>

        <div className="w-48 h-11">
          <ProducerLinksFilter />
        </div>
      </div>

      <div className="mt-6">
        {error ? (
          <div className="bg-white rounded-lg border border-gray-100 p-8 shadow-sm">
            <p className="text-center text-red-600">{error}</p>
          </div>
        ) : (
          <ProducerLinksTable 
            links={linksData?.content || []}
            currentPage={page}
            pageSize={size}
            totalElements={linksData?.totalElements || 0}
            totalPages={linksData?.totalPages || 0}
          />
        )}
      </div>
    </div>
  );
}
