'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { ActivitySubmission } from '@/services/activity-submissions.service';
import { submitDecisionAction } from '@/app/actions/activity-decision';
import { getFileUrl } from '@/lib/file-utils';
import { FilePreview } from './FilePreview';

interface ActivityDecisionModalProps {
  submission: ActivitySubmission;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function ActivityDecisionModal({
  submission,
  isOpen,
  onClose,
  onSave
}: ActivityDecisionModalProps) {
  const [status, setStatus] = useState<string>(submission.status === 'submitted' ? '' : submission.status);
  const [justification, setJustification] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when submission changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus(submission.status === 'submitted' ? '' : submission.status);
      setJustification('');
      setError(null);
    }
  }, [isOpen, submission]);

  if (!isOpen) return null;

  const isReadOnly = submission.status !== 'submitted';
  const isValid = status === 'approved' || (status === 'rejected' && justification.trim().length > 0);

  const handleSave = async () => {
    if (!isValid || isReadOnly) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await submitDecisionAction(submission.userActivityId, {
        decision: status as 'approved' | 'rejected',
        reason: status === 'rejected' ? justification : undefined
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      onSave();
      onClose();
    } catch (err: any) {
      console.error('Error submitting decision:', err);
      setError(err.message || 'Ocorreu um erro ao salvar a decisão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">
            Atividade | {submission.activityName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div>
            <Badge variant="fazenda">
              Fazenda {submission.farmName}
            </Badge>
          </div>

          <div>
            <h3 className="text-sm font-normal text-gray-500 mb-2 leading-none tracking-[0.02em] font-sans">
              Descrição da atividade
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Campo ausente
            </p>
          </div>

          {submission.files && submission.files.length > 0 && (
            <div>
              <h3 className="text-sm font-normal text-gray-500 mb-3 leading-none tracking-[0.02em] font-sans">
                Registro de atividades do usuário
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {submission.files.slice(0, 6).map((file) => (
                  <a
                    key={file.fileId}
                    href={getFileUrl(file.gsutilUri)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer"
                    title={file.fileName}
                  >
                    <FilePreview file={file} />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-normal text-gray-500 mb-2 leading-none tracking-[0.02em] font-sans">
                Status da atividade
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isReadOnly || isSubmitting}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="submitted">Pendente</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Rejeitado</option>
              </select>
            </div>

            <div>
              <label htmlFor="justification" className="block text-sm font-normal text-gray-500 mb-2 leading-none tracking-[0.02em] font-sans">
                Justificativa {status === 'rejected' && <span className="text-red-500">*</span>}
              </label>
              <textarea
                id="justification"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                disabled={isReadOnly || isSubmitting}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-[80px] bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                rows={3}
                placeholder={status === 'rejected' ? 'Informe o motivo da rejeição' : ''}
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancelar
          </button>
          {!isReadOnly && (
            <button
              onClick={handleSave}
              disabled={!isValid || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0B63E5] rounded-md hover:bg-[#0951bd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
