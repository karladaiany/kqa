import React, { useState } from 'react';

const QACommentCardNovo = () => {
  const [comentario, setComentario] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(comentario);
  };

  const handleClear = () => {
    setComentario('');
  };

  return (
    <section className="card" id="qa" style={{ marginTop: 16, background: 'red', color: 'white' }}>
      <div style={{ fontWeight: 'bold', fontSize: 24, textAlign: 'center' }}>TESTE DE VISUALIZAÇÃO DO CARD QA</div>
      <div className="card-header">
        <h5>
          <i className="fas fa-comment"></i> Comentário QA (Novo)
        </h5>
      </div>
      <div className="card-body">
        <textarea
          className="form-control"
          placeholder="Digite seu comentário QA aqui..."
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          style={{ width: '100%', minHeight: 80, marginBottom: 12 }}
        />
        <button className="btn-copy" onClick={handleCopy} style={{ marginRight: 8 }}>
          <i className="fas fa-copy"></i> Copiar
        </button>
        <button className="btn-clear" onClick={handleClear}>
          <i className="fas fa-trash"></i> Limpar
        </button>
      </div>
    </section>
  );
};

export default QACommentCardNovo; 