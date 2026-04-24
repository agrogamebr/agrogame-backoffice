import { ArrowLeft, UserCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { ProducerDataForm } from '@/components/producers/ProducerDataForm';
import { FarmsTable } from '@/components/producers/FarmsTable';
import { ProductionUnitsTable } from '@/components/producers/ProductionUnitsTable';
import { WorkersTable } from '@/components/producers/WorkersTable';
import { getUserInfo, listFarms, listProductionUnits, listWorkers } from '@/services/producers.service';
import { getBadgeVariant } from '@/types/producer-status';

export default async function ManageProducerPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ 
    name?: string;
    status?: string;
    farmsPage?: string;
    farmsSize?: string;
    unitsPage?: string;
    unitsSize?: string;
    workersPage?: string;
    workersSize?: string;
  }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const userId = resolvedParams.id;
  const userName = resolvedSearchParams.name || 'Usuário';
  const status = resolvedSearchParams.status || 'Ativo';
  const farmsPage = parseInt(resolvedSearchParams.farmsPage || '0', 10);
  const farmsSize = parseInt(resolvedSearchParams.farmsSize || '5', 10);
  const unitsPage = parseInt(resolvedSearchParams.unitsPage || '0', 10);
  const unitsSize = parseInt(resolvedSearchParams.unitsSize || '5', 10);
  const workersPage = parseInt(resolvedSearchParams.workersPage || '0', 10);
  const workersSize = parseInt(resolvedSearchParams.workersSize || '5', 10);

  let userData = null;
  let userError = null;
  try {
    userData = await getUserInfo(userId);
  } catch (error) {
    console.error('[ManageProducerPage] Erro ao buscar dados do usuário:', error);
    userError = 'Erro ao carregar informações do produtor';
  }

  const thumbnailUrl = userData?.thumbnail_gs_url
    ? `/api/files/proxy?url=${encodeURIComponent(userData.thumbnail_gs_url)}`
    : null;

  let farmsData = null;
  let farmsError = null;
  try {
    farmsData = await listFarms(userId, farmsPage, farmsSize);
  } catch (error) {
    console.error('[ManageProducerPage] Erro ao buscar fazendas:', error);
    farmsError = 'Erro ao carregar fazendas';
  }

  let productionUnitsData = null;
  let productionUnitsError = null;
  try {
    productionUnitsData = await listProductionUnits(userId, unitsPage, unitsSize);
  } catch (error) {
    console.error('[ManageProducerPage] Erro ao buscar unidades produtivas:', error);
    productionUnitsError = 'Erro ao carregar unidades produtivas';
  }

  let workersData = null;
  let workersError = null;
  try {
    workersData = await listWorkers(userId, workersPage, workersSize);
  } catch (error) {
    console.error('[ManageProducerPage] Erro ao buscar funcionários:', error);
    workersError = 'Erro ao carregar funcionários';
  }

  const displayName = userData?.fullName || userName;

  return (
    <div className="max-w-8xl mx-4 space-y-4 pt-14 pb-8">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/users" className="text-gray-600 hover:text-gray-900 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Gerenciar produtores
        </h1>
      </div>

      {/* Profile Header */}
      <div className="relative bg-white rounded-xl border border-gray-100 shadow-sm px-4 sm:px-8 pb-6 pt-10 flex items-center gap-4 mt-10">
        <div className="shrink-0 absolute -top-10 left-4 sm:left-8">
          {thumbnailUrl ? (
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
              <Image
                src={thumbnailUrl}
                alt={displayName}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-md">
              <UserCircle className="w-20 h-20 sm:w-24 sm:h-24 text-gray-400" />
            </div>
          )}
        </div>
        <div className="pl-32 sm:pl-40 space-y-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 truncate">{displayName}</h2>
          <Badge variant={getBadgeVariant(status)}>{status}</Badge>
        </div>
      </div>

      <ProducerDataForm userData={userData} error={userError} />

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Fazendas Cadastradas</h2>
        {farmsError ? (
          <div className="bg-white rounded-lg border border-gray-100 p-8 shadow-sm">
            <p className="text-center text-red-600">{farmsError}</p>
          </div>
        ) : (
          <FarmsTable 
            farms={farmsData?.content || []}
            userId={userId}
            currentPage={farmsPage}
            pageSize={farmsSize}
            totalElements={farmsData?.totalElements || 0}
            totalPages={farmsData?.totalPages || 0}
          />
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Unidades Produtivas</h2>
        {productionUnitsError ? (
          <div className="bg-white rounded-lg border border-gray-100 p-8 shadow-sm">
            <p className="text-center text-red-600">{productionUnitsError}</p>
          </div>
        ) : (
          <ProductionUnitsTable 
            productionUnits={productionUnitsData?.content || []}
            userId={userId}
            currentPage={unitsPage}
            pageSize={unitsSize}
            totalElements={productionUnitsData?.totalElements || 0}
            totalPages={productionUnitsData?.totalPages || 0}
          />
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Funcionários Cadastrados</h2>
        {workersError ? (
          <div className="bg-white rounded-lg border border-gray-100 p-8 shadow-sm">
            <p className="text-center text-red-600">{workersError}</p>
          </div>
        ) : (
          <WorkersTable 
            workers={workersData?.content || []}
            userId={userId}
            currentPage={workersPage}
            pageSize={workersSize}
            totalElements={workersData?.totalElements || 0}
            totalPages={workersData?.totalPages || 0}
          />
        )}
      </div>
    </div>
  );
}
