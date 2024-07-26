// FinalModal.js
import React from 'react';

const FinalModal = ({ images, onClose, showModal }) => {
  if (!showModal) return null;

  // Labels for each image phase
  const imageLabels = {
    front: "Imagen frontal",
    leftSide: "Imagen lateral izquierda",
    rightSide: "Imagen lateral derecha",
    trasero: "Imagen vista trasera"
  };

  return (
    <div className="modal" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '90%',
        maxHeight: '90%',
        overflow: 'auto'
      }}>
        <h2>Resumen de la inspección</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Display each captured image with its label */}
          {Object.entries(images).map(([key, image]) => (
            <div key={key} style={{ margin: '10px', textAlign: 'center' }}>
              <h3>{imageLabels[key] || key}</h3>
              <img src={image} alt={imageLabels[key] || key} style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          ))}
        </div>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default FinalModal;
