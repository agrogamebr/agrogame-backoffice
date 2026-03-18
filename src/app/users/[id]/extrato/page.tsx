import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PointsStatementTable } from '@/components/producers/PointsStatementTable';
import { PointsStatementFilter } from '@/components/producers/PointsStatementFilter';
import { getPointsStatement, PointsStatementItem } from '@/services/points-statement.service';
import { listFarms, listProductionUnitsBackoffice } from '@/services/activity-create.service';
import { redirect } from 'next/navigation';
import { EmptyState } from '@/components/activities/EmptyState';

export default async function PointsStatementPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ 
    page?: string; 
    size?: string; 
    name?: string;
    farmId?: string;
    productionUnitId?: string;
    operationType?: string;
    startDate?: string;
    endDate?: string;
  }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const userId = resolvedParams.id;
  const userName = resolvedSearchParams.name || 'Usuário';
  const page = Number(resolvedSearchParams.page) || 0;
  const size = Number(resolvedSearchParams.size) || 5;

  // Extract filter parameters
  const filters = {
    farmId: resolvedSearchParams.farmId ? Number(resolvedSearchParams.farmId) : undefined,
    productionUnitId: resolvedSearchParams.productionUnitId ? Number(resolvedSearchParams.productionUnitId) : undefined,
    operationType: resolvedSearchParams.operationType,
    startDate: resolvedSearchParams.startDate,
    endDate: resolvedSearchParams.endDate,
  };

  let items: PointsStatementItem[] = [];
  let totalElements = 0;
  let totalPages = 0;
  let currentBalance = 0;
  let farms: { id: number; name: string }[] = [];
  let productionUnits: { id: number; name: string }[] = [];

  try {
    const [farmsResponse, productionUnitsResponse, statementResponse] = await Promise.all([
      listFarms().catch(() => []),
      listProductionUnitsBackoffice().catch(() => []),
      getPointsStatement(Number(userId), page, size, filters),
    ]);

    farms = farmsResponse.map(f => ({
      id: f.id,
      name: f.name,
    }));

    productionUnits = productionUnitsResponse.map(pu => ({
      id: pu.id,
      name: pu.name,
    }));

    items = statementResponse.items;
    totalElements = statementResponse.totalElements;
    totalPages = statementResponse.totalPages;
    currentBalance = statementResponse.currentBalance;
  } catch (e: unknown) {
    const err = e as { message?: string; status?: number };
    if (err.message === 'Token JWT ausente ou inválido' || err.message === 'Unauthorized' || err.status === 401) {
      redirect(`/api/auth/logout?error=${encodeURIComponent(err.message || 'Erro desconhecido')}`);
    }
    console.error(err);
  }

  const hasItems = items.length > 0;

  return (
    <div className="max-w-8xl mx-4 space-y-4 pt-14">
      <div className="flex items-center justify-between gap-5 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/users" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Extrato de pontos &gt; {userName}
          </h1>
        </div>

        <div className="flex items-center gap-5">
          <div className="w-[347px] h-12 bg-[#25A259] border border-[#25A259] rounded-2xl py-6 px-4 flex items-center justify-center gap-4 text-white" style={{ boxShadow: '1px 1px 4px 0px rgba(0, 0, 0, 0.2)' }}>
            <span className="text-sm font-medium whitespace-nowrap">Total de pontos acumulados</span>
            <span className="text-xl font-bold whitespace-nowrap">{currentBalance.toLocaleString('pt-BR')} pts</span>
          </div>

          <div className="w-48 h-11">
            <PointsStatementFilter
              userId={userId}
              farms={farms}
              productionUnits={productionUnits}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {hasItems ? (
          <PointsStatementTable
            items={items}
            currentPage={page}
            pageSize={size}
            totalElements={totalElements}
            totalPages={totalPages}
            userId={userId}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 flex items-center justify-center p-8">
            <EmptyState
              title="Nenhum registro encontrado"
              description="Não há transações de pontos para este produtor ainda"
            />
          </div>
        )}
      </div>
    </div>
  );
}
