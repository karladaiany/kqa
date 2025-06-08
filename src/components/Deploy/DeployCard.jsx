import React, { useState, useEffect } from 'react';
import { FaRocket, FaTimes, FaCopy, FaBroom } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DeployCard = () => {
  const [fields, setFields] = useState(() => {
    const savedFields = localStorage.getItem('deployFields');
    return savedFields ? JSON.parse(savedFields) : [];
  });

  const [fieldValues, setFieldValues] = useState(() => {
    const savedValues = localStorage.getItem('deployFieldValues');
    return savedValues ? JSON.parse(savedValues) : {};
  });

  useEffect(() => {
    localStorage.setItem('deployFields', JSON.stringify(fields));
  }, [fields]);

  useEffect(() => {
    localStorage.setItem('deployFieldValues', JSON.stringify(fieldValues));
  }, [fieldValues]);

  const formatDeployText = () => {
    let plainText = 'Gerar versão para deploy\n';

    let htmlText = `<div style="font-family: Verdana;">
      <p style="text-align: center; color: #9C27B0; font-family: Verdana;"><b>Gerar versão para deploy</b></p>`;

    // Primeiro bloco - Branch, PR principal, Feature flag e Runner
    const branchPrincipal = fields.find(f => f.label === 'Branch principal');
    const prPrincipal = fields.find(f => f.label === 'PR principal');
    const featureFlag = fields.find(f => f.label === 'Feature flag');
    const runner = fields.find(f => f.label === 'Runner');

    let firstBlockContent = '';
    if (branchPrincipal && fieldValues[branchPrincipal.id]) {
      firstBlockContent += `<b>Branch principal:</b> ${
        fieldValues[branchPrincipal.id]
      }<br>`;
      plainText += `Branch principal: ${fieldValues[branchPrincipal.id]}\n`;
    }
    if (prPrincipal && fieldValues[prPrincipal.id]) {
      firstBlockContent += `<b>PR principal:</b> <a href="${
        fieldValues[prPrincipal.id]
      }" style="color: #0000FF;">${fieldValues[prPrincipal.id]}</a><br>`;
      plainText += `PR principal: ${fieldValues[prPrincipal.id]}\n`;
    }
    if (featureFlag && fieldValues[featureFlag.id]) {
      firstBlockContent += `<b>Feature flag:</b> ${
        fieldValues[featureFlag.id]
      }<br>`;
      plainText += `Feature flag: ${fieldValues[featureFlag.id]}\n`;
    }
    if (runner && fieldValues[runner.id]) {
      firstBlockContent += `<b>Runner:</b> ${fieldValues[runner.id]}`;
      plainText += `Runner: ${fieldValues[runner.id]}\n`;
    }

    if (firstBlockContent) {
      // Remove o último <br> se o último item for o Runner
      if (runner && fieldValues[runner.id]) {
        htmlText += `<p>${firstBlockContent}</p>`;
      } else {
        // Remove o último <br> se o Runner não estiver presente
        htmlText += `<p>${firstBlockContent.replace(/<br>$/, '')}</p>`;
      }

      // Separador com linha horizontal mais grossa
      plainText += '━'.repeat(70) + '\n';
      htmlText += `<p>${'━'.repeat(70)}</p>`;
    }

    // Blocos de Título, Link e PR
    const titulos = fields.filter(f => f.label === 'Título');
    const links = fields.filter(f => f.label === 'Link');
    const prs = fields.filter(f => f.label === 'PR');

    for (
      let i = 0;
      i < Math.max(titulos.length, links.length, prs.length);
      i++
    ) {
      let blockContent = '';

      if (titulos[i] && fieldValues[titulos[i].id]) {
        blockContent += `<b>Título:</b> ${fieldValues[titulos[i].id]}<br>`;
        plainText += `Título: ${fieldValues[titulos[i].id]}\n`;
      }
      if (links[i] && fieldValues[links[i].id]) {
        blockContent += `<b>Link:</b> <a href="${
          fieldValues[links[i].id]
        }" style="color: #0000FF;">${fieldValues[links[i].id]}</a><br>`;
        plainText += `Link: ${fieldValues[links[i].id]}\n`;
      }
      if (prs[i] && fieldValues[prs[i].id]) {
        blockContent += `<b>PR:</b> <a href="${
          fieldValues[prs[i].id]
        }" style="color: #0000FF;">${fieldValues[prs[i].id]}</a>`;
        plainText += `PR: ${fieldValues[prs[i].id]}\n`;
      }

      if (blockContent) {
        // Remove o último <br> do bloco
        htmlText += `<p>${blockContent.replace(/<br>$/, '')}</p>`;
        if (i < Math.max(titulos.length, links.length, prs.length) - 1) {
          plainText += '\n';
        }
      }
    }

    htmlText += '</div>';
    return { plainText, htmlText };
  };

  const handleCopy = async () => {
    const { plainText, htmlText } = formatDeployText();

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([plainText], { type: 'text/plain' }),
          'text/html': new Blob([htmlText], { type: 'text/html' }),
        }),
      ]);
      toast.success('Texto copiado com formatação!');
    } catch (err) {
      try {
        await navigator.clipboard.writeText(plainText);
        toast.success('Texto copiado (sem formatação)');
      } catch (err) {
        toast.error('Erro ao copiar texto. Tente novamente.');
      }
    }
  };

  const addBranchAndPRFields = () => {
    const newFields = [
      {
        type: 'text',
        label: 'Branch principal',
        id: `branch-principal-${Date.now()}`,
      },
      {
        type: 'text',
        label: 'PR principal',
        id: `pr-principal-${Date.now()}`,
      },
    ];
    setFields([...fields, ...newFields]);
  };

  const addFeatureFlagField = () => {
    const newField = {
      type: 'text',
      label: 'Feature flag',
      id: `feature-flag-${Date.now()}`,
    };
    setFields([...fields, newField]);
  };

  const addRunnerField = () => {
    const newField = {
      type: 'text',
      label: 'Runner',
      id: `runner-${Date.now()}`,
    };
    setFields([...fields, newField]);
  };

  const addTitleLinkPRFields = () => {
    const newFields = [
      { type: 'text', label: 'Título', id: `titulo-${Date.now()}` },
      { type: 'text', label: 'Link', id: `link-${Date.now()}` },
      { type: 'text', label: 'PR', id: `pr-${Date.now()}` },
    ];
    setFields([...fields, ...newFields]);
  };

  const handleInputChange = (id, value) => {
    setFieldValues(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const removeField = idToRemove => {
    setFields(fields.filter(field => field.id !== idToRemove));
    setFieldValues(prev => {
      const newValues = { ...prev };
      delete newValues[idToRemove];
      return newValues;
    });
    toast.success('Campo removido com sucesso!');
  };

  const handleClearAll = () => {
    setFields([]);
    setFieldValues({});
    localStorage.removeItem('deployFields');
    localStorage.removeItem('deployFieldValues');
    toast.success('Todos os campos foram limpos!');
  };

  return (
    <section className='card' id='deploy'>
      <div className='card-header'>
        <h2>
          <FaRocket className='header-icon' /> Deploy
        </h2>
        <div className='card-filters'>
          <button className='generate-all-btn' onClick={addBranchAndPRFields}>
            + Branch e PR
          </button>
          <button className='generate-all-btn' onClick={addFeatureFlagField}>
            + Feature flag
          </button>
          <button className='generate-all-btn' onClick={addRunnerField}>
            + Runner
          </button>
          <button className='generate-all-btn' onClick={addTitleLinkPRFields}>
            + Título, Link e PR
          </button>
        </div>
      </div>
      <div className='card-content'>
        {fields.map(field => (
          <div key={field.id} className='campo-item'>
            <div className='campo-valor'>
              <input
                value={fieldValues[field.id] || ''}
                onChange={e => handleInputChange(field.id, e.target.value)}
                className='copyable'
                placeholder=' '
              />
              <label>{field.label}</label>
              {fieldValues[field.id] && (
                <FaTimes
                  className='clear-icon'
                  onClick={() => removeField(field.id)}
                />
              )}
            </div>
          </div>
        ))}
        <div className='card-actions'>
          {fields.length > 0 && (
            <>
              <button className='generate-all-btn' onClick={handleCopy}>
                <FaCopy /> Copiar
              </button>
              <button className='generate-all-btn' onClick={handleClearAll}>
                <FaBroom /> Limpar tudo
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default DeployCard;
