// Modal.js
import React from "react";
import guideImageFrontal from "../frente.png";
import guideImagePerfilIzquierdo from "../perfilizquierdo.png";
import guideImagePerfilDerecho from "../perfilderecho.png";
import guideImageTrasero from "../trasero.png";

const Modal = ({ type, showModal, handleContinue, handleRetry, handleWelcomeContinue, screenshot, currentPhase }) => {
  let guideImage;
  let message;

  // Determine the guide image and message based on the current phase
  switch(currentPhase) {
    case "front":
      guideImage = guideImageFrontal;
      message = "Toma una foto frontal de tu vehículo";
      break;
    case "leftSide":
      guideImage = guideImagePerfilIzquierdo;
      message = "Toma una foto del lado izquierdo del vehículo";
      break;
    case "rightSide":
      guideImage = guideImagePerfilDerecho;
      message = "Toma una foto del lado derecho del vehículo";
      break;
    case "trasero":
      guideImage = guideImageTrasero;
      message = "Toma una foto de la vista trasera del vehículo";
      break;
    default:
      guideImage = guideImageFrontal;
      message = "Toma una foto frontal de tu vehículo";
  }

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const contentStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    maxWidth: '80%',
    maxHeight: '80%',
    overflow: 'auto',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const buttonStyle = {
    padding: '10px 20px',
    margin: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    fontWeight: 'bold'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4CAF50'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f44336'
  };

  return (
    <>
      {type === 'detection' && showModal && (
        <div style={modalStyle}>
          <div style={contentStyle}>
            <h2>Fotografía capturada</h2>
            <img src={screenshot} alt="Capturada" style={{ width: '100%', marginBottom: '20px', borderRadius: '10px' }} />
            <div>
              <button style={primaryButtonStyle} onClick={handleContinue}>Continuar</button>
              <button style={secondaryButtonStyle} onClick={handleRetry}>Tomar de nuevo</button>
            </div>
          </div>
        </div>
      )}
      {type === 'welcome' && showModal && (
        <div style={modalStyle}>
          <div style={contentStyle}>
            <h2>Bienvenido a tu inspección digital</h2>
            <p>{message}</p>
            <img src={guideImage} alt="Guía" style={{ width: '100%', marginBottom: '20px', borderRadius: '10px' }} />
            <button style={primaryButtonStyle} onClick={handleWelcomeContinue}>Continuar</button>
          </div>
        </div>
      )}
      {type === 'side' && showModal && (
        <div style={modalStyle}>
          <div style={contentStyle}>
            <h2>{message}</h2>
            <img src={guideImage} alt="Guía" style={{ width: '100%', marginBottom: '20px', borderRadius: '10px' }} />
            <button style={primaryButtonStyle} onClick={handleContinue}>Continuar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
