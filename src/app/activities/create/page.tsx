import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ActivityImageUpload } from '@/components/activities/ActivityImageUpload';
import { SelectableCheckboxList } from '@/components/activities/SelectableCheckboxList';
import { listCropTypes, listFarms, listProductionUnits } from '@/services/activity-create.service';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {title}
        </h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

export default async function CreateActivityPage() {
  let cropTypes: { id: number; label: string }[] = [];
  let farms: { id: number; label: string }[] = [];
  let productionUnits: { id: number; label: string }[] = [];

  try {
    const [cropTypesResponse, farmsResponse, productionUnitsResponse] = await Promise.all([
      listCropTypes(),
      listFarms(),
      listProductionUnits(),
    ]);

    cropTypes = cropTypesResponse.map((item) => ({
      id: item.id,
      label: item.name,
    }));

    farms = farmsResponse.map((item) => ({
      id: item.id,
      label: item.name,
    }));

    productionUnits = productionUnitsResponse.map((item) => ({
      id: item.id,
      label: item.name,
    }));
  } catch (e: unknown) {
    const error = e as { message?: string; status?: number };
    if (error.message === 'Token JWT ausente ou inválido' || error.message === 'Unauthorized' || error.status === 401) {
      const cookieStore = await cookies();
      cookieStore.delete('token');
      cookieStore.delete('user_info');
      redirect(`/login?error=${encodeURIComponent(error.message || 'Erro desconhecido')}`);
    }
    console.error(error);
  }

  return (
    <div className="max-w-8xl mx-4 space-y-6 pt-10 pb-16">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/activities" className="font-semibold text-gray-700 hover:text-[#0B63E5]">
            Gerenciamento de atividades
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="font-semibold text-gray-900">Criar atividade</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Criar atividade</h1>
      </div>

      <SectionCard title="Informações da atividade">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_1.2fr_180px] gap-6 items-start">
          <ActivityImageUpload
            label="Imagem da atividade"
            helperText="A imagem deve ser em png 180x180px"
            name="activityImage"
          />

          <Input id="activity-name" label="Nome da atividade" placeholder="Desmatamento - Corte Raso" />

          <div className="space-y-2">
            <label htmlFor="activity-description" className="block text-sm font-medium text-gray-700">
              Descrição da atividade
            </label>
            <textarea
              id="activity-description"
              rows={4}
              placeholder="Descreva a atividade"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            />
          </div>

          <Input id="activity-points" label="Pontuação" type="number" placeholder="0" />
        </div>
      </SectionCard>

      <SectionCard title="Informações de cultura, fazendas e unidade produtiva">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_220px] gap-6">
          <SelectableCheckboxList
            title="Cultura"
            filterPlaceholder="Filtrar cultura"
            items={cropTypes}
            inputName="cropTypeIds"
          />
          <SelectableCheckboxList
            title="Fazendas"
            filterPlaceholder="Filtrar fazendas"
            items={farms}
            inputName="farmIds"
          />
          <SelectableCheckboxList
            title="Unidades produtivas"
            filterPlaceholder="Filtrar unidades"
            items={productionUnits}
            inputName="productionUnitIds"
          />
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                Data início
              </label>
              <Input id="start-date" type="date" />
            </div>
            <div className="space-y-2">
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                Data fim
              </label>
              <Input id="end-date" type="date" />
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
        <Link href="/activities" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
          Cancelar
        </Link>
        <Button variant="secondary" className="sm:min-w-45">
          Salvar rascunho
        </Button>
        <Button className="sm:min-w-55">
          Salvar e enviar atividade
        </Button>
      </div>
    </div>
  );
}
