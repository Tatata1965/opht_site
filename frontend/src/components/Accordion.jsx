import React, { useState } from 'react';

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion">
      <h3
        className="accordion-title"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>▼</span>
      </h3>
      {isOpen && (
        <div className="accordion-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;