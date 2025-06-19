import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FaComment,
  FaCamera,
  FaPaperclip,
  FaTimes,
  FaCopy,
  FaBroom,
  FaClipboardCheck,
  FaRobot,
  FaEllipsisH,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTestStatus } from '../../../hooks/useTestStatus';
import useTextareaResizeActions from '../../../hooks/useTextareaResizeActions';

// Componente dinâmico para campo (textarea ou input)
const CampoDinamico = ({
  id,
  label,
  value,
  onChange,
  onClear,
  type = 'textarea',
  placeholder,
}) => (
  <div className='campo-item'>
    <label htmlFor={id}>{label}</label>
    <div className='campo-valor'>
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          className='copyable'
          placeholder={placeholder}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={onChange}
          className='copyable'
          type={type}
          placeholder={placeholder}
        />
      )}
      {value && <FaTimes className='clear-icon' onClick={onClear} />}
    </div>
  </div>
);

CampoDinamico.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
};

const TestStatusCard = () => {
  const {
    activityType,
    testStatus,
    environment,
    formData,
    handleActivityTypeChange,
    handleStatusChange,
    handleEnvironmentChange,
    handleInputChange,
    handleClearField,
    handleToggleAttachment,
    handleClear,
  } = useTestStatus();

  const { clearCardTextareaSizes } = useTextareaResizeActions();

  // Estado para controlar expansão dos campos
  const [expanded, setExpanded] = useState(false);

  // Função para verificar se há dados preenchidos
  const hasAnyData = useCallback(() => {
    return (
      testStatus ||
      environment ||
      Object.values(formData).some(value => value && value !== '')
    );
  }, [testStatus, environment, formData]);

  // Exibe campos se houver dados ou se estiver expandido
  const showFields = useMemo(
    () => expanded || hasAnyData(),
    [expanded, hasAnyData]
  );

  // Opções de tipo de atividade
  const activityTypeOptions = [
    { value: 'manual', label: '📝 Diversos', icon: <FaEllipsisH /> },
    {
      value: 'execution',
      label: '🔍 Execução de Testes',
      icon: <FaClipboardCheck />,
    },
    { value: 'automation', label: '🤖 Automação de Testes', icon: <FaRobot /> },
  ];

  // Status options baseados no tipo de atividade
  const getStatusOptions = () => {
    if (activityType === 'manual') {
      return [
        { value: 'waiting', label: '‼️   Aguardando' },
        { value: 'blocked', label: '🚫   Bloqueado' },
        { value: 'cancelled', label: '🗑️   Cancelado' },
        { value: 'passed', label: '✅   Passou' },
        { value: 'failed', label: '❌   Reprovado' },
        { value: 'returned', label: '↩️   Retornado' },
      ];
    } else {
      // Para execução e automação de testes
      return [
        { value: 'completed', label: '✅   Concluído' },
        { value: 'waiting', label: '⏳   Aguardando' },
        { value: 'blocked', label: '🚫   Bloqueado' },
        { value: 'cancelled', label: '🗑️   Cancelado' },
      ];
    }
  };

  const environmentOptions = [
    { value: 'alpha', label: '🔮   Alpha' },
    { value: 'prod', label: '⚙️   Produção' },
    { value: 'stage', label: '🧪   Stage' },
  ];

  // Configuração dinâmica dos campos por tipo de atividade e status
  const getCamposPorStatus = () => {
    if (activityType === 'manual') {
      return {
        waiting: [
          { id: 'observation', label: 'Observação', type: 'textarea' },
          { id: 'waiting', label: 'Aguardando', type: 'textarea' },
        ],
        blocked: [
          { id: 'observation', label: 'Observação', type: 'textarea' },
          {
            id: 'blockReason',
            label: 'Motivo do bloqueio',
            type: 'textarea',
          },
        ],
        cancelled: [
          { id: 'observation', label: 'Observação', type: 'textarea' },
        ],
        passed: [
          { id: 'validation', label: 'Validação', type: 'textarea' },
          { id: 'observation', label: 'Observação', type: 'textarea' },
        ],
        failed: [{ id: 'observation', label: 'Observação', type: 'textarea' }],
        returned: [
          { id: 'validation', label: 'Validação', type: 'textarea' },
          { id: 'observation', label: 'Observação', type: 'textarea' },
          { id: 'information', label: 'Informações', type: 'textarea' },
          {
            id: 'returnReason',
            label: 'Motivo do retorno',
            type: 'textarea',
          },
        ],
      };
    } else if (activityType === 'execution') {
      return {
        completed: [
          {
            id: 'testPlan',
            label: 'Plano de Teste',
            type: 'input',
            placeholder: 'Ex: Plano de Teste Modo de uso',
          },
          {
            id: 'build',
            label: 'Build',
            type: 'input',
            placeholder: 'Ex: Baseline Outro ambiente / Ambiente interno',
          },
          {
            id: 'testCaseIds',
            label: "ID's dos CT",
            type: 'textarea',
            placeholder: 'Ex: T-1 a 4 / 10 a 19 / 34 e 35',
          },
          { id: 'observation', label: 'Obs', type: 'textarea' },
        ],
        waiting: [
          {
            id: 'testPlan',
            label: 'Plano de Teste',
            type: 'input',
            placeholder: 'Ex: Plano de Teste Modo de uso',
          },
          {
            id: 'build',
            label: 'Build',
            type: 'input',
            placeholder: 'Ex: Baseline Outro ambiente / Ambiente interno',
          },
          {
            id: 'testCaseIds',
            label: "ID's dos CT",
            type: 'textarea',
            placeholder: 'Ex: T-1 a 4 / 10 a 19 / 34 e 35',
          },
          { id: 'waiting', label: 'Aguardando', type: 'textarea' },
          { id: 'observation', label: 'Obs', type: 'textarea' },
        ],
        blocked: [
          {
            id: 'testPlan',
            label: 'Plano de Teste',
            type: 'input',
            placeholder: 'Ex: Plano de Teste Modo de uso',
          },
          {
            id: 'build',
            label: 'Build',
            type: 'input',
            placeholder: 'Ex: Baseline Outro ambiente / Ambiente interno',
          },
          {
            id: 'testCaseIds',
            label: "ID's dos CT",
            type: 'textarea',
            placeholder: 'Ex: T-1 a 4 / 10 a 19 / 34 e 35',
          },
          { id: 'blockReason', label: 'Motivo do bloqueio', type: 'textarea' },
          { id: 'observation', label: 'Obs', type: 'textarea' },
        ],
        cancelled: [{ id: 'observation', label: 'Obs', type: 'textarea' }],
      };
    } else if (activityType === 'automation') {
      return {
        completed: [
          {
            id: 'pullRequest',
            label: 'PR',
            type: 'input',
            placeholder: 'Ex: #123 ou link do PR',
          },
          { id: 'observation', label: 'Obs', type: 'textarea' },
        ],
        waiting: [
          {
            id: 'pullRequest',
            label: 'PR',
            type: 'input',
            placeholder: 'Ex: #123 ou link do PR',
          },
          { id: 'waiting', label: 'Aguardando', type: 'textarea' },
          { id: 'observation', label: 'Obs', type: 'textarea' },
        ],
        blocked: [
          {
            id: 'pullRequest',
            label: 'PR',
            type: 'input',
            placeholder: 'Ex: #123 ou link do PR',
          },
          { id: 'blockReason', label: 'Motivo do bloqueio', type: 'textarea' },
          { id: 'observation', label: 'Obs', type: 'textarea' },
        ],
        cancelled: [{ id: 'observation', label: 'Obs', type: 'textarea' }],
      };
    }
    return {};
  };

  const camposEvidencia = [
    {
      id: 'evidenceDescription',
      label: 'Descrição da evidência',
      type: 'textarea',
    },
    {
      id: 'evidenceLink',
      label: 'Link da evidência',
      type: 'input',
      placeholder: 'https://jam.dev/',
    },
  ];

  const generateTemplate = () => {
    const selectedStatusOption = getStatusOptions().find(
      option => option.value === testStatus
    );
    const selectedEnvironmentOption = environmentOptions.find(
      option => option.value === environment
    );
    const formatLabel = label => label.replace(/\s+/g, ' ').trim();

    let template = '⇝ QA ⇜\n\n';

    if (activityType === 'manual') {
      // Template para teste manual (original)
      template += ':: Teste ::\n';
      template += `${formatLabel(selectedStatusOption.label)}\n\n`;
      if (
        environment &&
        ['passed', 'failed', 'blocked', 'returned'].includes(testStatus)
      ) {
        template += ':: Ambiente ::\n';
        template += `${formatLabel(selectedEnvironmentOption.label)}\n\n`;
      }
      if (['passed', 'returned'].includes(testStatus) && formData.validation) {
        template += ':: Validação ::\n';
        template += `${formData.validation}\n\n`;
      }
      if (formData.observation) {
        template += ':: Obs ::\n';
        template += `${formData.observation}\n\n`;
      }
      if (testStatus === 'waiting' && formData.waiting) {
        template += ':: Aguardando ::\n';
        template += `${formData.waiting}\n\n`;
      }
      if (testStatus === 'blocked' && formData.blockReason) {
        template += ':: Motivo do bloqueio ::\n';
        template += `${formData.blockReason}\n\n`;
      }
      if (testStatus === 'returned' && formData.information) {
        template += ':: Informações ::\n';
        template += `${formData.information}\n\n`;
      }
      if (testStatus === 'returned' && formData.returnReason) {
        template += ':: Motivo retorno ::\n';
        template += `${formData.returnReason}\n\n`;
      }
      if (
        formData.evidenceDescription ||
        formData.evidenceLink ||
        formData.hasAttachment
      ) {
        template += ':: Evidência(s) ::\n';
        if (formData.evidenceDescription) {
          template += `${formData.evidenceDescription}\n`;
        }
        if (formData.evidenceLink) {
          template += `Evidência no link: ${formData.evidenceLink}\n`;
        }
        if (formData.hasAttachment) {
          template += '📎 Evidência em anexo na atividade\n';
        }
        template += '\n';
      }
    } else if (activityType === 'execution') {
      // Template para execução de testes
      template += ':: 🔎 Teste 🔎 ::\n';
      template += `${formatLabel(selectedStatusOption.label)}\n\n`;

      if (environment) {
        template += ':: 📍 Ambiente 📍 ::\n';
        template += `${formatLabel(selectedEnvironmentOption.label)}\n\n`;
      }

      // Verificar se há dados na seção de validação
      const hasValidationData =
        formData.testPlan || formData.build || formData.testCaseIds;
      if (hasValidationData) {
        template += ':: 📑 Validação 📑 ::\n';
        if (formData.testPlan) {
          template += `Plano de Teste ${formData.testPlan}\n`;
        }
        if (formData.build) {
          template += `Baseline ${formData.build}\n`;
        }
        if (formData.testCaseIds) {
          template += `Execução dos casos de testes: ${formData.testCaseIds}\n`;
        }
        template += '\n';
      }

      if (testStatus === 'waiting' && formData.waiting) {
        template += ':: ⏳ Aguardando ⏳ ::\n';
        template += `${formData.waiting}\n\n`;
      }

      if (testStatus === 'blocked' && formData.blockReason) {
        template += ':: 🚫 Motivo do bloqueio 🚫 ::\n';
        template += `${formData.blockReason}\n\n`;
      }

      if (formData.observation) {
        template += ':: 🚩 Obs 🚩 ::\n';
        template += `${formData.observation}\n\n`;
      }
    } else if (activityType === 'automation') {
      // Template para automação de testes
      template += ':: 🤖 Automação 🤖 ::\n';
      template += `${formatLabel(selectedStatusOption.label)}\n\n`;

      if (environment) {
        template += ':: 📍 Ambiente 📍 ::\n';
        template += `${formatLabel(selectedEnvironmentOption.label)}\n\n`;
      }

      if (formData.pullRequest) {
        template += ':: 🔗 PR 🔗 ::\n';
        template += `${formData.pullRequest}\n\n`;
      }

      if (testStatus === 'waiting' && formData.waiting) {
        template += ':: ⏳ Aguardando ⏳ ::\n';
        template += `${formData.waiting}\n\n`;
      }

      if (testStatus === 'blocked' && formData.blockReason) {
        template += ':: 🚫 Motivo do bloqueio 🚫 ::\n';
        template += `${formData.blockReason}\n\n`;
      }

      if (formData.observation) {
        template += ':: 🚩 Obs 🚩 ::\n';
        template += `${formData.observation}\n\n`;
      }
    }

    return template.trim();
  };

  const handleCopy = () => {
    // Validação específica por tipo de atividade (removida obrigatoriedade do evidenceLink)
    const template = generateTemplate();
    navigator.clipboard.writeText(template);
    toast.success('Comentário copiado!');
  };

  const renderEnvironmentField = () => {
    if (activityType === 'manual') {
      if (!['passed', 'failed', 'blocked', 'returned'].includes(testStatus))
        return null;
    }
    // Para execução e automação, sempre mostrar ambiente quando houver status
    if (!testStatus) return null;

    return (
      <div className='campo-item'>
        <label htmlFor='environment'>Ambiente</label>
        <div className='campo-valor'>
          <select
            id='environment'
            value={environment}
            onChange={handleEnvironmentChange}
            className='copyable'
          >
            <option value=''>Selecione um ambiente</option>
            {environmentOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const renderCamposDinamicos = campos =>
    campos.map(({ id, label, type, placeholder }) => (
      <CampoDinamico
        key={id}
        id={id}
        label={label}
        value={formData[id] || ''}
        onChange={handleInputChange(id)}
        onClear={() => handleClearField(id)}
        type={type === 'input' ? 'text' : 'textarea'}
        placeholder={placeholder}
      />
    ));

  const renderEvidenceSection = () => {
    // Seção de evidências apenas para teste manual
    if (activityType !== 'manual' || !testStatus) return null;
    return (
      <>
        <div className='section-divider'>
          <FaCamera /> Evidências
        </div>
        {renderCamposDinamicos(camposEvidencia)}
        <div className='campo-item'>
          <div
            className={`attachment-toggle ${
              formData.hasAttachment ? 'active' : ''
            }`}
            onClick={handleToggleAttachment}
          >
            <FaPaperclip /> Evidência em anexo na atividade
          </div>
        </div>
      </>
    );
  };

  const shouldDisableCopy = () => {
    // Removida validação obrigatória do evidenceLink
    return false; // Sempre permitir copiar se houver status selecionado
  };

  const getCopyTooltip = () => {
    return 'Copiar';
  };

  const handleClearWithResize = () => {
    handleClear();
    setExpanded(false);
    // Limpar tamanhos dos textareas do localStorage
    clearCardTextareaSizes('test-status');
  };

  const statusOptions = getStatusOptions();
  const camposPorStatus = getCamposPorStatus();

  return (
    <section className='card' id='test-status'>
      <div className='card-header'>
        <h2>
          <FaComment className='header-icon' /> Comentário QA
        </h2>
        {!showFields && (
          <button
            className='generate-all-btn'
            onClick={() => setExpanded(true)}
            title='Novo comentário QA'
          >
            +
          </button>
        )}
      </div>
      {showFields && (
        <div className='card-content'>
          <div className='campo-item'>
            <label htmlFor='activityType'>Tipo de atividade</label>
            <div className='campo-valor'>
              <select
                id='activityType'
                value={activityType}
                onChange={handleActivityTypeChange}
                className='copyable'
              >
                {activityTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='campo-item'>
            <label htmlFor='testStatus'>
              {activityType === 'manual'
                ? 'Status do teste'
                : 'Status da execução'}
            </label>
            <div className='campo-valor'>
              <select
                id='testStatus'
                value={testStatus}
                onChange={handleStatusChange}
                className='copyable'
              >
                <option value=''>Selecione um status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {renderEnvironmentField()}
          {testStatus &&
            renderCamposDinamicos(camposPorStatus[testStatus] || [])}
          {renderEvidenceSection()}

          {testStatus && (
            <div className='card-actions'>
              <button
                className='generate-all-btn'
                onClick={handleCopy}
                disabled={shouldDisableCopy()}
                title={getCopyTooltip()}
              >
                <FaCopy /> Copiar
              </button>
              <button
                className='generate-all-btn'
                onClick={handleClearWithResize}
              >
                <FaBroom /> Limpar tudo
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default TestStatusCard;
