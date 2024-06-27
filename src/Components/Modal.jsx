import React from 'react';
import "../style.scss"

const Modal = ({ imageUrl, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content">
      
        <img src={imageUrl} alt="" />
        <button onClick={(e) => { e.stopPropagation(); onClose(); }}>X</button>
      </div>
    </div>
  );
};

export default Modal;
