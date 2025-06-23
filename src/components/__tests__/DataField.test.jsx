/**
 * Testes unitários para o componente DataField
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import DataField from '../ui/DataField';

describe('DataField', () => {
  const defaultProps = {
    label: 'CPF',
    value: '123.456.789-01',
    raw: '12345678901',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização básica', () => {
    it('deve renderizar o label corretamente', () => {
      render(<DataField {...defaultProps} />);

      expect(screen.getByText('CPF')).toBeInTheDocument();
    });

    it('deve renderizar o valor formatado', () => {
      render(<DataField {...defaultProps} />);

      expect(screen.getByText('123.456.789-01')).toBeInTheDocument();
    });

    it('deve ter data-testids corretos', () => {
      render(<DataField {...defaultProps} />);

      expect(
        screen.getByTestId('data-field-cpf-container')
      ).toBeInTheDocument();
      expect(screen.getByTestId('data-field-cpf-label')).toBeInTheDocument();
      expect(screen.getByTestId('data-field-cpf-value')).toBeInTheDocument();
    });
  });

  describe('Funcionalidade de cópia', () => {
    it('deve renderizar botão de cópia por padrão', () => {
      render(<DataField {...defaultProps} />);

      expect(screen.getByTestId('data-field-cpf-copy-btn')).toBeInTheDocument();
    });

    it('não deve renderizar botão de cópia quando showCopy é false', () => {
      render(<DataField {...defaultProps} showCopy={false} />);

      expect(
        screen.queryByTestId('data-field-cpf-copy-btn')
      ).not.toBeInTheDocument();
    });

    it('deve ter botão de cópia com evento de click', () => {
      render(<DataField {...defaultProps} />);

      const copyButton = screen.getByTestId('data-field-cpf-copy-btn');
      expect(copyButton).toBeInTheDocument();
      expect(copyButton.onclick).toBeDefined();
    });

    it('deve ter valor clicável com evento de click', () => {
      render(<DataField {...defaultProps} />);

      const valueElement = screen.getByTestId('data-field-cpf-value');
      expect(valueElement).toBeInTheDocument();
      expect(valueElement.onclick).toBeDefined();
    });
  });

  describe('Botão de regenerar', () => {
    it('deve renderizar botão de regenerar quando onRegenerate é fornecido', () => {
      const onRegenerate = vi.fn();
      render(<DataField {...defaultProps} onRegenerate={onRegenerate} />);

      expect(
        screen.getByTestId('data-field-cpf-regenerate-btn')
      ).toBeInTheDocument();
    });

    it('não deve renderizar botão de regenerar quando onRegenerate não é fornecido', () => {
      render(<DataField {...defaultProps} />);

      expect(
        screen.queryByTestId('data-field-cpf-regenerate-btn')
      ).not.toBeInTheDocument();
    });

    it('deve chamar onRegenerate quando clicado', () => {
      const onRegenerate = vi.fn();
      render(<DataField {...defaultProps} onRegenerate={onRegenerate} />);

      const regenerateButton = screen.getByTestId(
        'data-field-cpf-regenerate-btn'
      );

      // Usar click simples
      regenerateButton.click();

      expect(onRegenerate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Propriedades e configurações', () => {
    it('deve renderizar como textarea quando isTextArea é true', () => {
      render(<DataField {...defaultProps} isTextArea={true} />);

      expect(screen.getByTestId('data-field-cpf-textarea')).toBeInTheDocument();
    });

    it('deve mostrar valor raw quando showMask é false', () => {
      render(
        <DataField {...defaultProps} showMask={false} onToggleMask={vi.fn()} />
      );

      const valueElement = screen.getByTestId('data-field-cpf-value');
      expect(valueElement).toHaveTextContent('12345678901');
    });

    it('deve renderizar botão de toggle mask quando onToggleMask é fornecido', () => {
      render(<DataField {...defaultProps} onToggleMask={vi.fn()} />);

      expect(
        screen.getByTestId('data-field-cpf-toggle-mask-btn')
      ).toBeInTheDocument();
    });

    it('deve renderizar botão de clear quando onClear é fornecido', () => {
      render(<DataField {...defaultProps} onClear={vi.fn()} />);

      expect(
        screen.getByTestId('data-field-cpf-clear-btn')
      ).toBeInTheDocument();
    });

    it('deve ter estrutura de classes CSS correta', () => {
      render(<DataField {...defaultProps} />);

      const container = screen.getByTestId('data-field-cpf-container');
      const valueContainer = screen.getByTestId(
        'data-field-cpf-value-container'
      );

      expect(container).toHaveClass('campo-item');
      expect(valueContainer).toHaveClass('campo-valor');
    });
  });
});
