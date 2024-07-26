// App.js
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import WebcamComponent from "./components/WebcamComponent";
import GuideImage from "./components/GuideImage";
import ConfidenceDisplay from "./components/ConfidenceDisplay";
import Modal from "./components/Modal";
import FinalModal from "./components/FinalModal";
import Timer from "./components/Timer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const LabelMap = {
  1: { name: 'frente', color: 'orange' },
  2: { name: 'perfil', color: 'blue' },
  3: { name: 'trasero', color: 'red' }
};

const App = () => {
  const webcamRef = useRef(null);
  const [confidence, setConfidence] = useState({ 1: 0, 2: 0, 3: 0 });
  const [facingMode, setFacingMode] = useState("environment");
  const [showModal, setShowModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showSideModal, setShowSideModal] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [detectedLabel, setDetectedLabel] = useState("");
  const [message, setMessage] = useState("Centra el vehículo en el área indicada");
  const [loading, setLoading] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("front");
  const [images, setImages] = useState({
    front: null,
    leftSide: null,
    rightSide: null,
    trasero: null
  });
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [inspectionComplete, setInspectionComplete] = useState(false);
  const isCapturing = useRef(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  // Callback to handle detection results from the webcam
  const handleDetected = (scores, classes, webcamRef) => {
    const confidences = { 1: 0, 2: 0, 3: 0 };
    let targetClass;
    
    switch(currentPhase) {
      case "front":
        targetClass = 1;
        break;
      case "leftSide":
      case "rightSide":
        targetClass = 2;
        break;
      case "trasero":
        targetClass = 3;
        break;
      default:
        targetClass = 1;
    }
  
    scores[0].forEach((score, i) => {
      const classId = classes[0][i];
      if (classId in confidences) {
        confidences[classId] = Math.max(confidences[classId], score);
      }
    });
  
    setConfidence(confidences);
  
    const currentConfidence = confidences[targetClass];
  
    console.log(`Confidence: ${currentConfidence}, Phase: ${currentPhase}, IsCapturing: ${isCapturing.current}`);

    // Manage UI messages and capture logic based on confidence score
    if (currentConfidence < 0.5) {
      if (message !== "Asegúrate de que el vehículo esté centrado en el área indicada") {
        setMessage("Asegúrate de que el vehículo esté centrado en el área indicada");
        clearTimeout(debounceTimer);
        setDebounceTimer(null);
      }
      setTimerActive(false);
    } else if (currentConfidence >= 0.995) {  // Confidence threshold for capturing
      if (!timerActive) {
        setTimerActive(true);
        setTimerKey(prev => prev + 1);
      }
      isCapturing.current = true;
      setLoading(true);
      setMessage("Mantente quieto, se está procesando la imagen...");  // Updated message
      
      if (debounceTimer) clearTimeout(debounceTimer);
      
      const newDebounceTimer = setTimeout(() => {
        if (webcamRef.current && webcamRef.current.getScreenshot) {
          console.log("Attempting to take screenshot");
          try {
            const screenshot = webcamRef.current.getScreenshot();
            if (screenshot) {
              console.log("Screenshot taken successfully");
              setScreenshot(screenshot);
              setDetectedLabel(LabelMap[targetClass].name);
              setShowModal(true);
              setTimerActive(false);
            } else {
              console.error("Screenshot is null or undefined");
            }
          } catch (error) {
            console.error("Error taking screenshot:", error);
          }
        } else {
          console.error("Webcam reference or getScreenshot function is not available");
        }
        setLoading(false);
        isCapturing.current = false;
      }, 5000);  // Changed from 2000 to 5000 (5 seconds)
      
      setDebounceTimer(newDebounceTimer);
    } else {
      if (message !== "Centra el vehículo en el área indicada") {
        setMessage("Centra el vehículo en el área indicada");
        clearTimeout(debounceTimer);
        setDebounceTimer(null);
        setLoading(false);
      }
      setTimerActive(false);
    }
  };

  // Function to toggle the camera facing mode
  const toggleFacingMode = () => {
    setFacingMode((prevFacingMode) => (prevFacingMode === "user" ? "environment" : "user"));
  };

  // Function to handle the continuation after a successful capture
  const handleContinue = () => {
    setImages(prevImages => ({
      ...prevImages,
      [currentPhase]: screenshot
    }));

    setScreenshot(null);
    setDetectedLabel("");

    if (currentPhase === "front") {
      setCurrentPhase("leftSide");
      setShowSideModal(true);
    } else if (currentPhase === "leftSide") {
      setCurrentPhase("rightSide");
      setShowSideModal(true);
    } else if (currentPhase === "rightSide") {
      setCurrentPhase("trasero");
      setShowSideModal(true);
    } else if (currentPhase === "trasero") {
      setInspectionComplete(true);
      setShowFinalModal(true);
      setMessage("Inspección completada");
    }

    setShowModal(false);
    setTimerActive(false);
  };

  // Function to handle retry action after a failed capture
  const handleRetry = () => {
    setShowModal(false);
    setMessage("Centra el vehículo en el área indicada");
    setScreenshot(null);
    setTimerActive(false);
  };

  // Function to handle the welcome modal continue action
  const handleWelcomeContinue = () => {
    setShowWelcomeModal(false);
  };

  // Function to handle timer expiration
  const handleTimeUp = () => {
    setShowTimeUpModal(true);
    setTimerActive(false);
  };

  // Function to manually capture an image
  const handleManualCapture = () => {
    if (webcamRef.current && webcamRef.current.getScreenshot) {
      const screenshot = webcamRef.current.getScreenshot();
      setScreenshot(screenshot);
      setShowModal(true);
      setShowTimeUpModal(false);
    }
  };

  // Reset confidence and timer when the phase changes
  useEffect(() => {
    setConfidence({ 1: 0, 2: 0, 3: 0 });
    setTimerActive(false);
  }, [currentPhase]);

  // Log webcam ref availability
  useEffect(() => {
    if (webcamRef.current) {
      console.log("Webcam ref is available");
    } else {
      console.log("Webcam ref is not available");
    }
  }, [webcamRef.current]);

  return (
    <div className="App">
      <header className="App-header">
        {!showModal && !showWelcomeModal && !showSideModal && !showFinalModal && !showTimeUpModal && (
          <>
            <WebcamComponent
              facingMode={facingMode}
              onDetected={handleDetected}
              showModal={showModal}
              webcamRef={webcamRef}
              screenshotFormat="image/jpeg"
            />
            {timerActive && <Timer key={timerKey} duration={15} onTimeUp={handleTimeUp} />}
          </>
        )}
        <button 
          onClick={toggleFacingMode} 
          style={{ 
            position: 'absolute', 
            top: 10, 
            right: 10, 
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.7)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <FontAwesomeIcon icon={faCamera} size="lg" />
        </button>
        <ConfidenceDisplay confidence={confidence} currentPhase={currentPhase} />
        <div style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          background: "rgba(0, 0, 0, 0.5)",
          padding: "10px",
          borderRadius: "5px",
          color: "white",
          zIndex: 10
        }}>
          {message}
        </div>
        {loading && (
          <div style={{
            position: "absolute",
            left: "15%",
            top: "25%",
            width: "70%",
            height: "50%",
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0, 0, 0, 0.5)",
            color: "white",
            borderRadius: "5px",
            fontSize: "24px"
          }}>
            Tomando fotografía...
          </div>
        )}
        <GuideImage currentPhase={currentPhase} />
        <div style={{
          position: "absolute",
          left: "15%",
          top: "25%",
          width: "70%",
          height: "50%",
          border: "2px dashed red",
          zIndex: 10
        }}></div>
        <Modal
          type="detection"
          showModal={showModal}
          handleContinue={handleContinue}
          handleRetry={handleRetry}
          detectedLabel={detectedLabel}
          screenshot={screenshot}
          currentPhase={currentPhase}
        />
        <Modal
          type="welcome"
          showModal={showWelcomeModal}
          handleWelcomeContinue={handleWelcomeContinue}
        />
        <Modal
          type="side"
          showModal={showSideModal}
          handleContinue={() => {
            setShowSideModal(false);
          }}
          currentPhase={currentPhase}
        />
        <FinalModal 
          images={images} 
          onClose={() => setShowFinalModal(false)} 
          showModal={showFinalModal}
        />
        {showTimeUpModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <h2>¿Quieres capturar la imagen manualmente?</h2>
              <button onClick={handleManualCapture} style={{
                padding: '10px 20px',
                fontSize: '16px',
                margin: '10px',
                cursor: 'pointer'
              }}>
                Capturar Manualmente
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default App;
