// GuideImage.js
import React from "react";
import guideImageFrontal from "../frente.png";
import guideImagePerfilIzquierdo from "../perfilizquierdo.png";
import guideImagePerfilDerecho from "../perfilderecho.png";
import guideImageTrasero from "../trasero.png";

const GuideImage = ({ currentPhase }) => {
  let guideImage;

  // Determine the guide image based on the current phase
  switch(currentPhase) {
    case "front":
      guideImage = guideImageFrontal;
      break;
    case "leftSide":
      guideImage = guideImagePerfilIzquierdo;
      break;
    case "rightSide":
      guideImage = guideImagePerfilDerecho;
      break;
    case "trasero":
      guideImage = guideImageTrasero;
      break;
    default:
      guideImage = guideImageFrontal;
  }

  return (
    <img
      src={guideImage}
      alt="Guide"
      style={{
        position: "absolute",
        left: "15%",
        top: "25%",
        width: "70%",
        height: "50%",
        zIndex: 10,
        objectFit: "contain"
      }}
    />
  );
};

export default GuideImage;
