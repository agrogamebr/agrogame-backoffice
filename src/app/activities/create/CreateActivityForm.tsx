'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { ActivityImageUpload } from '@/components/activities/ActivityImageUpload';
import { SelectableCheckboxList } from '@/components/activities/SelectableCheckboxList';
import { saveActivityDraft, saveAndSendActivity, saveActivityDraftEdit, saveAndSendActivityEdit } from '@/app/actions/activity';
import { useToast } from '@/components/ui/Toast';
import { ActivityDetail, ProductionUnitResponse, FarmResponse } from '@/services/activity-create.service';
import { getProductionUnitsAction, getFarmsByCropTypesAction } from '@/app/actions/production-units';
import { Button } from '@/components/ui/Button';

interface CreateActivityFormProps {
  cropTypes: { id: number; label: string }[];
  farms: { id: number; label: string }[];
  productionUnits: { id: number; label: string }[];
  isEditing?: boolean;
  initialActivity?: ActivityDetail | null;
  isViewMode?: boolean;
}

function ErrorAlert({ errors }: { errors: Record<string, string> | null }) {
  if (!errors || Object.keys(errors).length === 0) return null;

  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6">
      <div className="flex gap-3">
        <div className="shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-2">Erro ao validar formulário</h3>
          <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
            {Object.entries(errors).map(([_field, message]) => (
              <li key={_field}>{message}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

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

function RequiredIndicator() {
  return <span className="text-red-600 font-semibold">*</span>;
}

interface FormState {
  errors?: Record<string, string>;
  isValidationError?: boolean;
  previousValues?: {
    name: string;
    description: string;
    points: string;
    validFrom: string;
    validTo: string;
  };
}

export function CreateActivityForm({
  cropTypes,
  farms,
  productionUnits, // initial list
  isEditing = false,
  initialActivity = null,
  isViewMode = false,
}: CreateActivityFormProps) {
  const { addToast } = useToast();

  // Determine which action to use based on mode
  const draftAction = isEditing ? saveActivityDraftEdit : saveActivityDraft;
  const sendAction = isEditing ? saveAndSendActivityEdit : saveAndSendActivity;

  // Local state for tracking selections to filter production units
  const [selectedFarmIds, setSelectedFarmIds] = useState<number[]>(isEditing && initialActivity?.farmIds ? initialActivity.farmIds : []);
  const [selectedCropTypeIds, setSelectedCropTypeIds] = useState<number[]>(isEditing && initialActivity?.cropTypeIds ? initialActivity.cropTypeIds : []);
  const [availableFarms, setAvailableFarms] = useState<{ id: number; label: string }[]>(farms);
  const [loadingFarms, setLoadingFarms] = useState(false);
  const [availableProductionUnits, setAvailableProductionUnits] = useState<{ id: number; label: string }[]>(productionUnits);
  const [loadingProductionUnits, setLoadingProductionUnits] = useState(false);

  const [stateDraft, formActionDraft, isPendingDraft] = useActionState<FormState | undefined, FormData>(
    async (_, formData) => {
      try {
        await draftAction(formData);
      } catch (error: unknown) {
        const err = error as Error & { message?: string };
        const previousValues = {
          name: (formData.get('activityName') as string) || '',
          description: (formData.get('activityDescription') as string) || '',
          points: (formData.get('activityPoints') as string) || '',
          validFrom: (formData.get('startDate') as string) || '',
          validTo: (formData.get('endDate') as string) || '',
        };
        
        if (err?.message) {
          try {
            const errors = JSON.parse(err.message);
            return {
              errors,
              isValidationError: true,
              previousValues,
            };
          } catch {
            return {
              errors: { general: err.message },
              isValidationError: true,
              previousValues,
            };
          }
        }
        
        // Erro sem mensagem - retornar erro genérico
        return {
          errors: { general: 'Erro ao salvar rascunho. Por favor, tente novamente.' },
          isValidationError: false,
          previousValues,
        };
      }
    },
    undefined,
  );

  const [stateSend, formActionSend, isPendingSend] = useActionState<FormState | undefined, FormData>(
    async (_, formData) => {
      try {
        await sendAction(formData);
      } catch (error: unknown) {
        const err = error as Error & { message?: string };
        const previousValues = {
          name: (formData.get('activityName') as string) || '',
          description: (formData.get('activityDescription') as string) || '',
          points: (formData.get('activityPoints') as string) || '',
          validFrom: (formData.get('startDate') as string) || '',
          validTo: (formData.get('endDate') as string) || '',
        };
        
        if (err?.message) {
          try {
            const errors = JSON.parse(err.message);
            return {
              errors,
              isValidationError: true,
              previousValues,
            };
          } catch {
            return {
              errors: { general: err.message },
              isValidationError: true,
              previousValues,
            };
          }
        }
        
        // Erro sem mensagem - retornar erro genérico
        return {
          errors: { general: 'Erro ao enviar atividade. Por favor, tente novamente.' },
          isValidationError: false,
          previousValues,
        };
      }
    },
    undefined,
  );

  const errors = stateDraft?.errors || stateSend?.errors;
  const previousValues = stateDraft?.previousValues || stateSend?.previousValues;
  const isLoading = isPendingDraft || isPendingSend;

  // Show error toast when validation errors occur
  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      addToast(firstError || 'Erro ao validar formulário', 'error');
    }
  }, [errors, addToast]);

  // Fetch farms when crop types change
  useEffect(() => {
    async function fetchFarms() {
      if (selectedCropTypeIds.length === 0) {
        setAvailableFarms(farms);
        setSelectedFarmIds([]);
        return;
      }

      setLoadingFarms(true);
      try {
        const response = await getFarmsByCropTypesAction(selectedCropTypeIds);
        if (response.success && response.data) {
          setAvailableFarms(response.data.map((f: FarmResponse) => ({ id: f.id, label: f.name })));
          // Clear selected farms that are not in the new filtered list
          const newFarmIds = response.data.map((f: FarmResponse) => f.id);
          setSelectedFarmIds(prev => prev.filter(id => newFarmIds.includes(id)));
        } else {
          console.error("Action returned error or empty data");
          setAvailableFarms([]);
          setSelectedFarmIds([]);
        }
      } catch (error) {
        console.error("Failed to fetch farms", error);
        addToast("Erro ao carregar fazendas", "error");
        setAvailableFarms([]);
        setSelectedFarmIds([]);
      } finally {
        setLoadingFarms(false);
      }
    }

    fetchFarms();
  }, [selectedCropTypeIds, farms, addToast]);

  // Fetch production units when farms or crops change
  useEffect(() => {
    async function fetchUnits() {
      if (selectedFarmIds.length === 0) {
        setAvailableProductionUnits([]);
        return;
      }

      setLoadingProductionUnits(true);
      try {
        const response = await getProductionUnitsAction(selectedFarmIds, selectedCropTypeIds);
        if (response.success && response.data) {
          setAvailableProductionUnits(response.data.map((u: ProductionUnitResponse) => ({ id: u.id, label: u.name })));
        } else {
          // If action failed but didn't throw, we handle it as empty/error
          console.error("Action returned error or empty data");
          setAvailableProductionUnits([]);
        }
      } catch (error) {
        console.error("Failed to fetch production units", error);
        addToast("Erro ao carregar unidades produtivas", "error");
        setAvailableProductionUnits([]);
      } finally {
        setLoadingProductionUnits(false);
      }
    }

    fetchUnits();
  }, [selectedFarmIds, selectedCropTypeIds, addToast]);


  const pageTitle = isEditing ? 'Editar atividade' : 'Criar atividade';

  // Set up default values for form fields
  const defaultName = previousValues?.name || initialActivity?.name || '';
  const defaultDescription = previousValues?.description || initialActivity?.description || '';
  const defaultPoints = previousValues?.points || initialActivity?.points?.toString() || '';
  const defaultValidFrom = previousValues?.validFrom || initialActivity?.validFrom || '';
  const defaultValidTo = previousValues?.validTo || initialActivity?.validTo || '';

  return (
    <div className="max-w-8xl mx-4 space-y-6 pt-10 pb-16">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/activities" className="font-semibold text-gray-700 hover:text-[#0B63E5]">
            Gerenciamento de atividades
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="font-semibold text-gray-900">{pageTitle}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{isViewMode ? 'Visualizar atividade' : pageTitle}</h1>
      </div>

      <ErrorAlert errors={errors || null} />

      <form className="space-y-6">
        {isEditing && initialActivity && (
          <input type="hidden" name="activityId" value={initialActivity.id} />
        )}

        <SectionCard title="Informações da atividade">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_1.2fr_180px] gap-6 items-start">
            <ActivityImageUpload
              label="Imagem da atividade"
              helperText="A imagem deve ser em png 180x180px"
              name="activityImage"
              initialImageGsUri={initialActivity?.thumbnailGsutilUri}
              disabled={isViewMode}
            />

            <Input
              id="activity-name"
              label={
                <span>
                  Nome da atividade <RequiredIndicator />
                </span>
              }
              placeholder="Desmatamento - Corte Raso"
              name="activityName"
              defaultValue={defaultName}
              error={errors?.activityName}
              required
              disabled={isViewMode}
            />

            <div className="space-y-2">
              <label htmlFor="activity-description" className="block text-sm font-medium text-gray-700">
                Descrição da atividade <RequiredIndicator />
              </label>
              <textarea
                id="activity-description"
                name="activityDescription"
                rows={4}
                placeholder="Descreva a atividade"
                defaultValue={defaultDescription}
                required
                disabled={isViewMode}
                aria-invalid={!!errors?.activityDescription}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${isViewMode ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'} ${errors?.activityDescription ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
              />
              {errors?.activityDescription && (
                <p className="text-sm text-red-600">{errors.activityDescription}</p>
              )}
            </div>

            <Input
              id="activity-points"
              label={
                <span>
                  Pontuação <RequiredIndicator />
                </span>
              }
              type="number"
              placeholder="0"
              name="activityPoints"
              defaultValue={defaultPoints}
              error={errors?.activityPoints}
              required
              disabled={isViewMode}
            />
          </div>
        </SectionCard>

        <SectionCard title="Informações de cultura, fazendas e unidade produtiva">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_220px] gap-6">
            <div>
              <SelectableCheckboxList
                title={
                  <span>
                    Cultura <RequiredIndicator />
                  </span>
                }
                filterPlaceholder="Filtrar cultura"
                items={cropTypes}
                inputName="cropTypeIds"
                defaultSelectedIds={selectedCropTypeIds}
                onSelectionChange={setSelectedCropTypeIds}
                disabled={isViewMode}
              />
              {errors?.cropTypeIds && (
                <p className="mt-2 text-sm text-red-600">{errors.cropTypeIds}</p>
              )}
            </div>

            <div className={selectedCropTypeIds.length === 0 ? "opacity-50 pointer-events-none" : ""}>
              <SelectableCheckboxList
                title={loadingFarms ? "Fazendas (Carregando...)" : "Fazendas"}
                filterPlaceholder="Filtrar fazendas"
                items={availableFarms}
                inputName="farmIds"
                defaultSelectedIds={selectedFarmIds}
                onSelectionChange={setSelectedFarmIds}
                disabled={isViewMode}
              />
              {selectedCropTypeIds.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">Selecione uma cultura para ver as fazendas</p>
              )}
            </div>

            <div className={selectedFarmIds.length === 0 ? "opacity-50 pointer-events-none" : ""}>
              <SelectableCheckboxList
                title={loadingProductionUnits ? "Unidades produtivas (Carregando...)" : "Unidades produtivas"}
                filterPlaceholder="Filtrar unidades"
                items={availableProductionUnits}
                inputName="productionUnitIds"
                defaultSelectedIds={isEditing && initialActivity?.productionUnitIds ? initialActivity.productionUnitIds : undefined}
                disabled={isViewMode}
              />
              {selectedFarmIds.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">Selecione uma fazenda para ver as unidades</p>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <Input
                  id="start-date"
                  type="date"
                  label={
                    <span>
                      Data início <RequiredIndicator />
                    </span>
                  }
                  name="startDate"
                  defaultValue={defaultValidFrom}
                  error={errors?.startDate}
                  required
                  disabled={isViewMode}
                />
              </div>

              <div>
                <Input
                  id="end-date"
                  type="date"
                  label={
                    <span>
                      Data fim <RequiredIndicator />
                    </span>
                  }
                  name="endDate"
                  defaultValue={defaultValidTo}
                  error={errors?.endDate}
                  required
                  disabled={isViewMode}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
          <Link
            href="/activities"
            className="text-sm font-semibold text-gray-600 hover:text-gray-900"
            tabIndex={isLoading ? -1 : undefined}
          >
            {isViewMode ? 'Voltar' : 'Cancelar'}
          </Link>
          {!isViewMode && (
            <>
              <Button
                formAction={formActionDraft}
                disabled={isLoading}
                variant="ghost"
                className="px-6 py-2.5 rounded-lg border-2 border-[#0B63E5] bg-white text-[#0B63E5] font-semibold hover:bg-blue-50 sm:min-w-45"
              >
                {isPendingDraft ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Salvar rascunho'}
              </Button>
              <Button
                formAction={formActionSend}
                disabled={isLoading}
                variant="primary"
                className="px-6 py-2.5 rounded-lg border-2 border-[#0B63E5] bg-[#0B63E5] text-white font-semibold hover:bg-[#0951bd] sm:min-w-55"
              >
                {isPendingSend ? 'Salvando...' : 'Salvar e enviar atividade'}
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
