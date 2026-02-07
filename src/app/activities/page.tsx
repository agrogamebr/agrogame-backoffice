'use client';

import { Button } from '@/components/ui/Button';
import { ActivitiesFilter } from '@/components/activities/ActivitiesFilter';
import { EmptyState } from '@/components/activities/EmptyState';
import { ActivityCard, Activity } from '@/components/activities/ActivityCard';

// Mock data for visualization
const mockActivities: Activity[] = [
  { id: '1', name: 'Fiscalizar estoque', status: 'Enviado' },
  { id: '2', name: 'Fiscalizar estoque', status: 'Rascunho' },
  { id: '3', name: 'Fiscalizar estoque', status: 'Excluída' },
  { id: '4', name: 'Fiscalizar estoque', status: 'Completado' },
  { id: '5', name: 'Fiscalizar estoque', status: 'Cancelado' },
];

export default function ActivitiesPage() {
  const hasActivities = mockActivities.length > 0;

  return (
    <div className="max-w-[1337px] mx-auto space-y-4 pt-[54px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-[20px]">
        <h1 className="w-[288px] h-[44px] text-2xl font-bold text-gray-900 flex items-center">
          Cadastro de atividades
        </h1>

        <div className="flex items-center gap-3">
          <Button
            className="w-[227px] h-[44px] bg-[#0B63E5] hover:bg-[#0951bd] text-white gap-[12px] rounded-[4px] p-[12px] text-sm font-medium"
          >
            Cadastrar nova atividade
          </Button>

          <div className="w-[187px] h-[44px]">
            <ActivitiesFilter />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Title Card */}
        <div className="flex items-center h-[54px] bg-white px-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">
            Atividades
          </h2>
        </div>

        {/* List / Empty State Card */}
        {hasActivities ? (
          <div className="space-y-3">
            {mockActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onEdit={(id) => console.log('Edit', id)}
                onDelete={(id) => console.log('Delete', id)}
                onSend={(id) => console.log('Send', id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[372px] flex items-center justify-center p-8">
            <EmptyState
              title="Sem atividades"
              description="Você ainda não tem nenhuma atividade cadastrada"
            />
          </div>
        )}
      </div>
    </div>
  );
}
