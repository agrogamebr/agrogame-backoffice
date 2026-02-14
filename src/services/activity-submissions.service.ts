import { apiFetch } from '@/lib/api';

export interface SubmissionFile {
  fileId: number;
  fileName: string;
  fileUrl: string;
  gsutilUri: string;
  uploadedAt: string;
}

export interface ActivitySubmission {
  userActivityId: number;
  activityId: number;
  activityName: string;
  farmId: number;
  farmName: string;
  producerId: number;
  producerName: string;
  producerDocument: string;
  submittedAt: string;
  filesCount: number;
  status: string;
  files: SubmissionFile[];
  points: number;
  description: string;
}

export interface ActivitySubmissionsResponse {
  size: number;
  success: boolean;
  submissions: ActivitySubmission[];
  totalPages: number;
  page: number;
  message: string;
  totalElements: number;
}

export async function listActivitySubmissions(
  page: number = 0,
  size: number = 10
): Promise<ActivitySubmissionsResponse> {
  const response = await apiFetch(
    `/api/backoffice/activities/submissions?page=${page}&size=${size}`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(
      errorData.message || 'Erro ao listar atividades realizadas'
    ) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return response.json();
}

