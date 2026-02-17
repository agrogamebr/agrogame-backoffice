import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

interface PointTransaction {
  id: string;
  date: string;
  activity: string;
  points: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'canceled';
}

// Dados mockados do extrato de pontos
const mockPointsExtract: PointTransaction[] = [
  {
    id: '1',
    date: '2024-02-15',
    activity: 'Colheita de Café',
    points: 150,
    type: 'credit',
    status: 'completed',
  },
  {
    id: '2',
    date: '2024-02-14',
    activity: 'Plantio de Milho',
    points: 200,
    type: 'credit',
    status: 'completed',
  },
  {
    id: '3',
    date: '2024-02-12',
    activity: 'Aplicação de Defensivos',
    points: 100,
    type: 'credit',
    status: 'completed',
  },
  {
    id: '4',
    date: '2024-02-10',
    activity: 'Resgate de Prêmio',
    points: -50,
    type: 'debit',
    status: 'completed',
  },
  {
    id: '5',
    date: '2024-02-08',
    activity: 'Manutenção de Equipamentos',
    points: 80,
    type: 'credit',
    status: 'pending',
  },
];

// Dados mockados dos usuários
const mockUsers = [
  {
    id: '1',
    fullName: 'Marcos Guilherme',
    farm: 'Retiro Velho',
  },
  {
    id: '2',
    fullName: 'Rafael Santos',
    farm: 'Macaúbas',
  },
  {
    id: '3',
    fullName: 'Ricardo Oliveira',
    farm: 'Rancho Fundo',
  },
  {
    id: '4',
    fullName: 'André Ribeiro',
    farm: 'Lago Azul',
  },
  {
    id: '5',
    fullName: 'João Silva',
    farm: 'Vista Alegre',
  },
  {
    id: '6',
    fullName: 'Maria Oliveira',
    farm: 'Recanto Verde',
  },
];

export default async function UserExtractPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  // Busca o usuário mockado
  const user = mockUsers.find(u => u.id === id);
  
  if (!user) {
    return (
      <div className="max-w-8xl mx-4 space-y-4 pt-14">
        <p className="text-gray-600">Usuário não encontrado</p>
      </div>
    );
  }

  // Calcula o saldo total de pontos
  const totalPoints = mockPointsExtract.reduce((acc, transaction) => {
    if (transaction.status === 'completed') {
      return acc + transaction.points;
    }
    return acc;
  }, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-8xl mx-4 space-y-4 pt-14">
      <Link 
        href="/users" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para usuários</span>
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
        <p className="text-gray-600 mt-1">{user.farm}</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Saldo Total de Pontos</p>
            <p className="text-3xl font-bold text-blue-600">{totalPoints.toLocaleString('pt-BR')} pts</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Extrato de Pontos</h2>
        
        <div className="bg-white rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DATA</TableHead>
                <TableHead>ATIVIDADE</TableHead>
                <TableHead>TIPO</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="text-right">PONTOS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPointsExtract.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell className="font-medium">{transaction.activity}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === 'credit' ? 'enviado' : 'cancelado'}>
                      {transaction.type === 'credit' ? 'Crédito' : 'Débito'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        transaction.status === 'completed' 
                          ? 'completado' 
                          : transaction.status === 'pending' 
                            ? 'enviado' 
                            : 'cancelado'
                      }
                    >
                      {transaction.status === 'completed' 
                        ? 'Completado' 
                        : transaction.status === 'pending' 
                          ? 'Pendente' 
                          : 'Cancelado'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={transaction.points > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {transaction.points > 0 ? '+' : ''}{transaction.points.toLocaleString('pt-BR')}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
