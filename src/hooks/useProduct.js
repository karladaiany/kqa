/**
 * Hook para gerenciamento de produto
 * @author KQA Team
 * @description Extrai lógica de produto mantendo comportamento original idêntico
 */

import { useState, useCallback } from 'react';
import { useDataGenerator } from './useDataGenerator';

/**
 * Hook para gerenciar produto
 * Mantém comportamento idêntico ao código original do DataGenerator
 */
export const useProduct = () => {
  const { generateProduct } = useDataGenerator();

  // Estado idêntico ao original
  const [product, setProduct] = useState(generateProduct());

  // Função idêntica ao original do DataGenerator
  const regenerateProductField = useCallback(
    field => {
      const newProduct = { ...product };
      const tempProduct = generateProduct();

      switch (field) {
        case 'nome':
          newProduct.nome = tempProduct.nome;
          break;
        case 'descricao':
          newProduct.descricao = tempProduct.descricao;
          break;
        case 'categorias':
          newProduct.categorias = tempProduct.categorias;
          break;
        default:
          return;
      }

      setProduct(newProduct);
    },
    [product, generateProduct]
  );

  // Função para regenerar todos os dados do produto
  const regenerateAllProduct = useCallback(() => {
    setProduct(generateProduct());
  }, [generateProduct]);

  return {
    product,
    regenerateProductField,
    regenerateAllProduct,
  };
};
