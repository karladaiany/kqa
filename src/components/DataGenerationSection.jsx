import React from 'react';
import { PersonalData } from './PersonalData/PersonalData';
import { CreditCard } from './CreditCard/CreditCard';
import { Documents } from './Documents/Documents';
import { Products } from './Products/Products';
import { CharCounter } from './CharCounter/CharCounter';

export const DataGenerationSection = () => {
  return (
    <section className="data-generation-section mb-5">
      <h2 className="section-title">Geração de Dados</h2>
      <div className="row g-4">
        {/* Coluna 1 */}
        <div className="col-12 col-lg-6">
          <div className="d-flex flex-column gap-4">
            <PersonalData />
            <CreditCard />
          </div>
        </div>
        {/* Coluna 2 */}
        <div className="col-12 col-lg-6">
          <div className="d-flex flex-column gap-4">
            <Documents />
            <Products />
            <CharCounter />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataGenerationSection;