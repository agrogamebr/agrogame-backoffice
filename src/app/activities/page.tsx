'use client';

import { Button } from '@/components/ui/Button';
import { ActivitiesFilter } from '@/components/activities/ActivitiesFilter';
import { EmptyState } from '@/components/activities/EmptyState';

export default function ActivitiesPage() {
  return (
    <div className="max-w-[1337px] mx-auto space-y-4 pt-[54px]">
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

      <div className="space-y-4">
        <div className="flex items-center h-[54px] bg-white px-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">
            Atividades
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[372px] flex items-center justify-center p-8">
          <EmptyState
            title="Sem atividades"
            description="Você ainda não tem nenhuma atividade cadastrada"
          />
        </div>
      </div>
    </div>
  );
}
