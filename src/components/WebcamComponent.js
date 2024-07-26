// WebcamComponent.js
import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";

const WebcamComponent = ({ facingMode, onDetected, showModal, webcamRef }) => {
  useEffect(() => {
    const runCoco = async () => {
      // Load the TensorFlow model
      const net = await tf.loadGraphModel('https://5f8x5pdm-8080.brs.devtunnels.ms/model.json');
      setInterval(() => {
        if (!showModal) detect(net);
      }, 16.7);
    };

    const detect = async (net) => {
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        // Define the region of interest for detection
        const startX = Math.floor(videoWidth * 0.15);
        const startY = Math.floor(videoHeight * 0.25);
        const width = Math.floor(videoWidth * 0.7);
        const height = Math.floor(videoHeight * 0.5);

        const img = tf.browser.fromPixels(video);
        const cropped = img.slice([startY, startX, 0], [height, width, 3]);
        const resized = tf.image.resizeBilinear(cropped, [320, 320]);
        const casted = resized.cast('int32');
        const expanded = casted.expandDims(0);
        const obj = await net.executeAsync(expanded);

        const scores = await obj[1].array();
        const classes = await obj[3].array();
        onDetected(scores, classes, webcamRef);

        // Dispose of intermediate tensors to free memory
        tf.dispose(img);
        tf.dispose(cropped);
        tf.dispose(resized);
        tf.dispose(casted);
        tf.dispose(expanded);
        tf.dispose(obj);
      }
    };

    runCoco();
  }, [showModal]);

  return (
    <Webcam
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      videoConstraints={{ facingMode: facingMode }}
      muted={true}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: "auto",
        textAlign: "center",
        zIndex: 9,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  );
};

export default WebcamComponent;
