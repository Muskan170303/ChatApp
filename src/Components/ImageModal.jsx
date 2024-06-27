import React from 'react';
import "../style.scss"

const ImageModal = ({ info, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content">
      
        <img src={info.img} alt="" />
        <p style={{color:"white"}}>{info.text}</p>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }}>X</button>
      </div>
    </div>
  );
};

export default ImageModal;