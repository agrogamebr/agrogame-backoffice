import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center w-[80px] h-[20px] rounded-[7px] text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-white shadow-[0px_0px_4px_0px_#00000040]',
  {
    variants: {
      variant: {
        default: 'bg-gray-500',
        enviado: 'bg-[#34C759]',
        rascunho: 'bg-[#FF7300]',
        excluida: 'bg-[#C8272A]',
        completado: 'bg-[#0B63E5]',
        cancelado: 'bg-[#FFCC00]',
        pendente: 'bg-[#635DFF]',
        aprovado: 'bg-[#25A259]',
        rejeitado: 'bg-[#FF383C]'
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
