'use client';

import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  fullName: string;
  farm: string;
  cpf: string;
  phone: string;
  email: string;
}

interface UsersTableProps {
  users: User[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export function UsersTable({
  users,
  currentPage,
  pageSize,
  totalElements,
  totalPages,
}: UsersTableProps) {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handlePageChange = (page: number) => {
    router.push(`/users?page=${page}&size=${pageSize}`);
  };

  const handlePageSizeChange = (size: number) => {
    router.push(`/users?page=0&size=${size}`);
  };

  const handleViewExtract = (userId: string) => {
    router.push(`/users/${userId}/extrato`);
    setOpenMenuId(null);
  };

  const toggleMenu = (userId: string) => {
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NOME COMPLETO</TableHead>
            <TableHead>FAZENDA</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>TELEFONE</TableHead>
            <TableHead>EMAIL</TableHead>
            <TableHead className="text-right">AÇÕES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.fullName}</TableCell>
              <TableCell>{user.farm}</TableCell>
              <TableCell>{user.cpf}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-right">
                <div className="relative inline-block">
                  <Button
                    onClick={() => toggleMenu(user.id)}
                    variant="ghost"
                    size="icon"
                    className="hover:scale-110"
                    title="Ações"
                    aria-label="Ações"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </Button>

                  {openMenuId === user.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <div className="py-1">
                          <button
                            onClick={() => handleViewExtract(user.id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            Ver extrato de pontos
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalElements={totalElements}
        totalPages={totalPages}
        hasActivitiesOnPage={users.length > 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
