import React from 'react';
import './Modal.css';

function Modal({ show, onClose, children }) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        {children}
        <button className="modal-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Modal;