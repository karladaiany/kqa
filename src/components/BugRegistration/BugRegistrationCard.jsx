import React, { useState, useMemo } from 'react';
import { FaBug, FaInfoCircle, FaCamera, FaPaperclip, FaTimes, FaCopy, FaBroom, FaEye, FaPlus } from 'react-icons/fa';
import { useBugRegistration } from '../../hooks/useBugRegistration';

const hasAnyData = (bugData) => {
  return Object.keys(bugData).some(
    (key) => {
      if (key === 'hasAttachment') return bugData[key];
      return !!bugData[key];
    }
  );
};

const BugRegistrationCard = () => {
  const {
    bugData,
    showPassword,
    setShowPassword,
    handleInputChange,
    handleClearField,
    handleToggleAttachment,
    handleCopyAll
  } = useBugRegistration();

  // Estado para controlar expansão dos campos
  const [expanded, setExpanded] = useState(false);

  // Sempre que limpar tudo, fecha os campos
  const handleClearAll = () => {
    handleClearField('all');
    setExpanded(false);
  };

  // Exibe campos se houver dados ou se estiver expandido
  const showFields = useMemo(() => expanded || hasAnyData(bugData), [expanded, bugData]);

  return (
    <section className="card" id="bug">
      <div className="card-header">
        <h2><FaBug className="header-icon" /> Registro de BUG</h2>
        {!showFields && (
          <button
            className="generate-all-btn"
            onClick={() => setExpanded(true)}
            title="Novo registro de BUG"
          >
          ➕ Novo
          </button>
        )}
      </div>
      {showFields && (
        <div className="card-content">
          <div className="campo-item">
            <label htmlFor="field-incident">Descrição do BUG</label>
            <div className="campo-valor">
              <textarea
                id="field-incident"
                value={bugData.incident}
                onChange={(e) => handleInputChange('incident', e.target.value)}
                className="copyable"
              />
              {bugData.incident && (
                <FaTimes
                  className="clear-icon"
                  onClick={() => handleClearField('incident')}
                />
              )}
            </div>
          </div>

          <div className="campo-item">
            <div className="campo-valor">
              <textarea
                value={bugData.steps}
                onChange={(e) => handleInputChange('steps', e.target.value)}
                className="copyable"
                placeholder=" "
              />
              <label>Passo a passo para reprodução</label>
              {bugData.steps && (
                <FaTimes
                  className="clear-icon"
                  onClick={() => handleClearField('steps')}
                />
              )}
            </div>
          </div>

          <div className="campo-item">
            <div className="campo-valor">
              <textarea
                value={bugData.expectedBehavior}
                onChange={(e) => handleInputChange('expectedBehavior', e.target.value)}
                className="copyable"
                placeholder=" "
              />
              <label>Comportamento esperado</label>
              {bugData.expectedBehavior && (
                <FaTimes
                  className="clear-icon"
                  onClick={() => handleClearField('expectedBehavior')}
                />
              )}
            </div>
          </div>

          <div className="section-divider">
            <FaInfoCircle /> Informações
          </div>

          <div className="campo-item">
            <div className="campo-valor">
              <input
                type="text"
                value={bugData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                className="copyable"
                placeholder=" "
              />
              <label>URL</label>
              {bugData.url && (
                <FaTimes
                  className="clear-icon"
                  onClick={() => handleClearField('url')}
                />
              )}
            </div>
          </div>

          <div className="campo-item">
            <div className="campo-valor">
              <input
                type="text"
                value={bugData.login}
                onChange={(e) => handleInputChange('login', e.target.value)}
                className="copyable"
                placeholder=" "
              />
              <label>Login</label>
              {bugData.login && (
                <FaTimes
                  className="clear-icon"
                  onClick={() => handleClearField('login')}
                />
              )}
            </div>
          </div>

          <div className="campo-item">
            <div className="campo-valor">
              <input
                type={showPassword ? 'text' : 'password'}
                value={bugData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="copyable"
                placeholder=" "
              />
              <label>Senha</label>
              <FaEye
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              />
              {bugData.password && (
                <FaTimes
                  className="clear-icon"
                  onClick={() => handleClearField('password')}
                />
              )}
            </div>
          </div>

          <div className="campo-item">
            <div className="campo-valor">
              <input
                type="number"
                value={bugData.envId}
                onChange={(e) => handleInputChange('envId', e.target.value)}
                className="copyable"
                placeholder=" "
              />
              <label>ID do ambiente</label>
              {bugData.envId && (
                <FaTimes
                  className="clear-icon"
                  onClick={() => handleClearField('envId')}
                />
              )}
            </div>
          </div>

          <div className="campo-item">
            <div className="campo-valor">
              <textarea
                value={bugData.others}
                onChange={(e) => handleInputChange('others', e.target.value)}
                className="copyable"
                placeholder=" "
              />
              <label>Outros</label>
              {bugData.others && (
                <FaTimes
                  className="clear-icon"
                  onClick={() => handleClearField('others')}
                />
              )}
            </div>
          </div>

          <div className="section-divider">
            <FaCamera /> Evidências
          </div>

          <div className="campo-item">
            <div className="campo-valor">
              <textarea
                value={bugData.evidenceDescription}
                onChange={(e) => handleInputChange('evidenceDescription', e.target.value)}
                className="copyable"
                placeholder=" "
              />
              <label>Descrição da evidência</label>
              {bugData.evidenceDescription && (
                <FaTimes
                  className="clear-icon"
                  onClick={() => handleClearField('evidenceDescription')}
                />
              )}
            </div>
          </div>

          <div className="campo-item">
            <div className="campo-valor">
              <input
                type="text"
                value={bugData.evidenceLink}
                onChange={(e) => handleInputChange('evidenceLink', e.target.value)}
                className="copyable"
                placeholder=" "
              />
              <label>Link da evidência</label>
              {bugData.evidenceLink && (
                <FaTimes
                  className="clear-icon"
                  onClick={() => handleClearField('evidenceLink')}
                />
              )}
            </div>
          </div>

          <div className="campo-item">
            <div 
              className={`attachment-toggle ${bugData.hasAttachment ? 'active' : ''}`}
              onClick={handleToggleAttachment}
            >
              <FaPaperclip /> Evidência em anexo na atividade
            </div>
          </div>

          <div className="card-actions">
            <button 
              className="generate-all-btn" 
              onClick={handleCopyAll}
            >
              <FaCopy /> Copiar
            </button>
            <button 
              className="generate-all-btn" 
              onClick={handleClearAll}
            >
              <FaBroom /> Limpar tudo
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default BugRegistrationCard; 