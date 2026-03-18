'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export function ProducerDataForm() {
  const [documentType, setDocumentType] = useState<'CPF' | 'CNPJ'>('CPF');

  return (
    <div className="space-y-6">
      {/* Seção de Documentos */}
      <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Documentos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Tipo de documento */}
          <div className="md:col-span-3">
            <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de documento
            </label>
            <select
              id="documentType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as 'CPF' | 'CNPJ')}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all duration-200 text-gray-900 bg-gray-50 cursor-not-allowed"
            >
              <option value="CPF">CPF</option>
              <option value="CNPJ">CNPJ</option>
            </select>
          </div>

          {/* Número do documento */}
          <div className="md:col-span-6">
            <Input
              label={documentType}
              id="documentNumber"
              placeholder={documentType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
              defaultValue="770.581.440-44"
              readOnly
            />
          </div>

          {/* Imagem do documento */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem do documento
            </label>
            <div className="flex justify-start items-center h-12.5">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 cursor-pointer"
                title="Visualizar documento"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Contato */}
      <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Contato</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email 1 */}
          <div>
            <Input
              label="Email"
              id="email1"
              type="email"
              placeholder="email@exemplo.com"
              defaultValue="0,222542"
              readOnly
            />
          </div>

          {/* Email 2 */}
          <div>
            <Input
              label="Email"
              id="email2"
              type="email"
              placeholder="email@exemplo.com"
              defaultValue="0,222542"
              readOnly
            />
          </div>

          {/* Telefone */}
          <div>
            <Input
              label="Telefone com DDD"
              id="phone"
              type="tel"
              placeholder="(00) 00000-0000"
              defaultValue="34 3241 9874"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Seção de Endereço */}
      <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Endereço</h2>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Primeira linha: Endereço, Número, CEP */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6">
              <Input
                label="Endereço"
                id="address"
                placeholder="Nome da rua"
                defaultValue="Avenida São Paulo"
                readOnly
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Número"
                id="number"
                placeholder="000"
                defaultValue="46"
                readOnly
              />
            </div>
            <div className="md:col-span-4">
              <Input
                label="CEP"
                id="cep"
                placeholder="00000-000"
                defaultValue="38.442-000"
                readOnly
              />
            </div>
          </div>

          {/* Segunda linha: Cidade e Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Cidade"
                id="city"
                placeholder="Nome da cidade"
                defaultValue="Uberaba"
                readOnly
              />
            </div>
            <div>
              <Input
                label="Estado"
                id="state"
                placeholder="Nome do estado"
                defaultValue="Minas Gerais"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
