'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { ActivitySubmission } from '@/services/activity-submissions.service';
import { submitDecisionAction } from '@/app/actions/activity-decision';
import { getFileUrl } from '@/lib/file-utils';
import { FilePreview } from './FilePreview';
import { Button } from '@/components/ui/Button';

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
  const [decision, setDecision] = useState<'approved' | 'rejected' | ''>('');
  const [justification, setJustification] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when submission changes or modal opens
  useEffect(() => {
    if (isOpen) {
      // Map existing status to decision if activity already has a decision
      if (submission.status === 'approved') {
        setDecision('approved');
      } else if (submission.status === 'rejected') {
        setDecision('rejected');
      } else {
        setDecision('');
      }
      setJustification('');
      setError(null);
    }
  }, [isOpen, submission]);

  if (!isOpen) return null;

  const isReadOnly = submission.status !== 'submitted';
  const isValid = decision === 'approved' || (decision === 'rejected' && justification.trim().length > 0);

  const handleSave = async () => {
    if (!isValid || isReadOnly) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await submitDecisionAction(submission.userActivityId, {
        decision: decision as 'approved' | 'rejected',
        reason: decision === 'rejected' ? justification : undefined
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      onSave();
      onClose();
    } catch (err: unknown) {
      console.error('Error submitting decision:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao salvar a decisão. Tente novamente.');
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
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">
              {submission.activityName}
            </h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 h-8 w-8 rounded-full bg-gray-50 p-0"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          </div>
          <Badge variant="fazenda">
            {submission.farmName}
          </Badge>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div>
            <h3 className="text-sm font-normal text-gray-500 mb-2 leading-none tracking-[0.02em] font-sans">
              Descrição da atividade
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {submission.description}
              </p>
            </div>
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

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-normal text-gray-500 mb-3 leading-none tracking-[0.02em] font-sans">
                Decisão
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      name="decision"
                      value="approved"
                      checked={decision === 'approved'}
                      onChange={(e) => setDecision(e.target.value as 'approved')}
                      disabled={isReadOnly || isSubmitting}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-green-500 peer-checked:border-green-500 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                      {decision === 'approved' && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700">Aprovar atividade</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      name="decision"
                      value="rejected"
                      checked={decision === 'rejected'}
                      onChange={(e) => setDecision(e.target.value as 'rejected')}
                      disabled={isReadOnly || isSubmitting}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-red-500 peer-checked:border-red-500 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                      {decision === 'rejected' && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700">Rejeitar atividade</span>
                </label>
              </div>
            </div>

            {decision === 'rejected' && (
              <div>
                <label htmlFor="justification" className="block text-sm font-normal text-gray-500 mb-2 leading-none tracking-[0.02em] font-sans">
                  Justificativa <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="justification"
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  disabled={isReadOnly || isSubmitting}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20 bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                  rows={3}
                  placeholder="Informe o motivo da rejeição"
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button
            onClick={onClose}
            disabled={isSubmitting}
            variant="secondary"
            size="sm"
            className="border border-gray-300"
          >
            Cancelar
          </Button>
          {!isReadOnly && (
            <Button
              onClick={handleSave}
              disabled={!isValid || isSubmitting}
              variant="primary"
              size="sm"
              className="bg-[#0B63E5] hover:bg-[#0951bd]"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
