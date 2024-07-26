// ConfidenceDisplay.js
import React from "react";

// Map to convert class IDs to human-readable labels and colors
const LabelMap = {
  1: { name: 'frente', color: 'orange' },
  2: { name: 'perfil', color: 'blue' },
  3: { name: 'trasero', color: 'red' }
};

const ConfidenceDisplay = ({ confidence, currentPhase }) => {
  let targetClass;
  
  // Determine the target class based on the current phase
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

  return (
    <div style={{
      position: "absolute",
      top: 10,
      left: 10,
      background: "rgba(0, 0, 0, 0.5)",
      padding: "10px",
      borderRadius: "5px",
      color: "white",
      zIndex: 10
    }}>
      {/* Display the confidence level for the current target class */}
      <div style={{ color: LabelMap[targetClass].color }}>
        {LabelMap[targetClass].name}: {(confidence[targetClass] * 100).toFixed(2)}%
      </div>
    </div>
  );
};

export default ConfidenceDisplay;
