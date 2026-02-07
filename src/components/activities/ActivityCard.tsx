import { Pencil, Trash2, Send } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export type ActivityStatus = 'Enviado' | 'Rascunho' | 'Excluída' | 'Completado' | 'Cancelado';

export interface Activity {
  id: string;
  name: string;
  status: ActivityStatus;
}

interface ActivityCardProps {
  activity: Activity;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSend?: (id: string) => void;
}

const statusBadgeVariant: Record<ActivityStatus, "enviado" | "rascunho" | "excluida" | "completado" | "cancelado"> = {
  'Enviado': 'enviado',
  'Rascunho': 'rascunho',
  'Excluída': 'excluida',
  'Completado': 'completado',
  'Cancelado': 'cancelado',
};

export function ActivityCard({ activity, onEdit, onDelete, onSend }: ActivityCardProps) {
  const showSendButton = activity.status !== 'Enviado' && activity.status !== 'Completado';

  return (
    <div className="group flex items-center justify-between px-6 bg-white rounded-lg border border-[#3A35411F] h-[74px] transition-all hover:bg-gray-50">
      <div className="flex items-center gap-6">
        <Badge variant={statusBadgeVariant[activity.status]}>
          {activity.status}
        </Badge>
        <span className="text-sm font-medium text-gray-900">{activity.name}</span>
      </div>

      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit?.(activity.id)}
          className="p-2 transition-transform hover:scale-110"
          title="Editar"
        >
          <Pencil className="w-5 h-5 text-[#0B63E5]" />
        </button>

        <button
          onClick={() => onDelete?.(activity.id)}
          className="p-2 transition-transform hover:scale-110"
          title="Excluir"
        >
          <Trash2 className="w-5 h-5 text-[#FF383C]" />
        </button>

        {showSendButton && (
          <button
            onClick={() => onSend?.(activity.id)}
            className="p-2 transition-transform hover:scale-110"
            title="Enviar"
          >
            <Send className="w-5 h-5 text-[#00C448]" />
          </button>
        )}
      </div>
    </div>
  );
}
