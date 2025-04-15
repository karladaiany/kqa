import React from 'react';
import BugReportCard from './components/BugReportCard';
import QACommentCard from './components/QACommentCard';

function App() {
  return (
    <div className="row g-4">
      <div className="col-md-6">
        <BugReportCard />
      </div>
      <div className="col-md-6">
        <QACommentCard />
      </div>
    </div>
  );
}

export default App; 