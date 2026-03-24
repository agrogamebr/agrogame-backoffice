import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ProducerLinksTable } from '@/components/producers/ProducerLinksTable';
import { listProducerLinks } from '@/services/producers.service';
import { redirect } from 'next/navigation';

export default async function ManageProducerLinksPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ 
    name?: string;
    page?: string;
    size?: string;
  }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const producerId = resolvedParams.id;
  const producerName = resolvedSearchParams.name || 'Produtor';
  const page = parseInt(resolvedSearchParams.page || '0', 10);
  const size = parseInt(resolvedSearchParams.size || '5', 10);

  let linksData = null;
  let error = null;

  try {
    linksData = await listProducerLinks(producerId, page, size);
  } catch (e: unknown) {
    const err = e as { message?: string; status?: number };
    console.error('[ManageProducerLinksPage] Erro ao buscar vínculos:', err);
    
    if (err.message === 'Token JWT ausente ou inválido' || err.message === 'Unauthorized' || err.status === 401) {
      redirect(`/api/auth/logout?error=${encodeURIComponent(err.message || 'Erro desconhecido')}`);
    }
    
    error = 'Erro ao carregar vínculos';
  }

  return (
    <div className="max-w-8xl mx-4 space-y-4 pt-14 pb-8">
      <div className="flex items-center justify-between gap-5 mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href={`/users/${producerId}?name=${encodeURIComponent(producerName)}`} 
            className="text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {producerName} &gt; Gerenciar Vínculos
          </h1>
        </div>

        <div className="flex items-center gap-5">
          <button
            className="h-11 px-5 font-medium bg-white hover:bg-gray-50 border border-gray-200 rounded-sm flex items-center gap-2 text-sm text-gray-700 transition-colors cursor-pointer"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
              />
            </svg>
            Filtros
          </button>
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
            producerId={producerId}
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
