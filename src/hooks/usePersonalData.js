/**
 * Hook para gerenciamento de dados pessoais
 * @author KQA Team
 * @description Extrai lógica de dados pessoais mantendo comportamento original idêntico
 */

import { useState, useCallback } from 'react';
import { useDataGenerator } from './useDataGenerator';

/**
 * Hook para gerenciar dados pessoais
 * Mantém comportamento idêntico ao código original do DataGenerator
 */
export const usePersonalData = () => {
  const { generatePerson, gerarCEPValido } = useDataGenerator();

  // Estado idêntico ao original
  const [person, setPerson] = useState(generatePerson());

  // Função idêntica ao original do DataGenerator
  const regenerateField = useCallback(
    field => {
      const newPerson = { ...person };

      switch (field) {
        case 'nome':
          const { nome, email } = generatePerson();
          newPerson.nome = nome;
          newPerson.email = email; // Atualiza email junto com nome pois são relacionados
          break;
        case 'telefone':
          newPerson.telefone = generatePerson().telefone;
          break;
        case 'endereco':
          newPerson.endereco = {
            ...newPerson.endereco,
            rua: generatePerson().endereco.rua,
          };
          break;
        case 'numero':
          newPerson.endereco = {
            ...newPerson.endereco,
            numero: generatePerson().endereco.numero,
          };
          break;
        case 'complemento':
          newPerson.endereco = {
            ...newPerson.endereco,
            complemento: generatePerson().endereco.complemento,
          };
          break;
        case 'bairro':
          newPerson.endereco = {
            ...newPerson.endereco,
            bairro: generatePerson().endereco.bairro,
          };
          break;
        case 'cidade':
          newPerson.endereco = {
            ...newPerson.endereco,
            cidade: generatePerson().endereco.cidade,
          };
          break;
        case 'estado':
          const novaPessoa = generatePerson();
          newPerson.endereco = {
            ...newPerson.endereco,
            estado: novaPessoa.endereco.estado,
            cep: novaPessoa.endereco.cep, // Atualiza CEP junto com estado pois são relacionados
          };
          break;
        case 'cep':
          // Gera um novo CEP baseado no estado atual
          newPerson.endereco = {
            ...newPerson.endereco,
            cep: gerarCEPValido(newPerson.endereco.estado),
          };
          break;
        default:
          return;
      }

      setPerson(newPerson);
    },
    [person, generatePerson, gerarCEPValido]
  );

  // Função para regenerar todos os dados pessoais
  const regenerateAllPersonData = useCallback(() => {
    setPerson(generatePerson());
  }, [generatePerson]);

  return {
    person,
    regenerateField,
    regenerateAllPersonData,
  };
};
