'use server';

import { listProductionUnitsFiltered, listFarmsByCropTypes } from '@/services/activity-create.service';

export async function getProductionUnitsAction(farmIds: number[], cropTypeIds: number[]) {
  try {
    const units = await listProductionUnitsFiltered(farmIds, cropTypeIds);
    return { success: true, data: units };
  } catch (error: unknown) {
    console.error('Error in getProductionUnitsAction:', error);
    return { success: false, error: 'Failed to fetch production units', data: [] };
  }
}

export async function getFarmsByCropTypesAction(cropTypeIds: number[]) {
  try {
    const farms = await listFarmsByCropTypes(cropTypeIds);
    return { success: true, data: farms };
  } catch (error: unknown) {
    console.error('Error in getFarmsByCropTypesAction:', error);
    return { success: false, error: 'Failed to fetch farms', data: [] };
  }
}
