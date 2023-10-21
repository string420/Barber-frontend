import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { MediaPipeFaceMesh } from "@tensorflow-models/face-landmarks-detection/dist/types";
import Webcam from "react-webcam";
import { useRef, useEffect, useState } from "react";
import "./FaceFilter.css";
import hair1ImagePath from "/hair1.png";
import hair2ImagePath from "/hair2.png";
import hair3ImagePath from "/hair3.png";
import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import { Coords3D } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/util";

const hairImages: { [key: string]: string } = {
  "Hair 1": hair1ImagePath,
  "Hair 2": hair2ImagePath,
  "Hair 3": hair3ImagePath,
};

interface Prop {
  setBase64Image: (base64Image: string) => void;
}

const FaceImageFilter = ({ setBase64Image }: Prop) => {
  const webcam = useRef<Webcam>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const captureButton = useRef<HTMLButtonElement>(null);

  const [selectedHair, setSelectedHair] = useState(() => {
    // Use local storage to persist the selectedHair state
    const storedSelectedHair = localStorage.getItem("selectedHair");
    return storedSelectedHair || "Hair 1";
  });

  console.log(setSelectedHair);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<AnnotatedPrediction[] | []>(
    []
  );
  let hairImage = new Image();
  hairImage.src = hairImages[selectedHair];

  const runFaceDetect = async () => {
    const model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
    );
    detect(model);
  };

  const drawHair = (
    ctx: CanvasRenderingContext2D,
    keypoints: Coords3D,
    hairImage: HTMLImageElement
  ) => {
    const foreheadPoint = keypoints[10];
    const hairWidth = 2 * Math.abs(keypoints[120][0] - keypoints[300][0]);
    const hairHeight = 2 * Math.abs(keypoints[15][1] - keypoints[130][1]);
    const hairX = foreheadPoint[0] - hairWidth / 2;
    const hairY = foreheadPoint[1] - hairHeight / 2;

    ctx.drawImage(hairImage, hairX, hairY, hairWidth, hairHeight);
  };

  const draw = (
    predictions: AnnotatedPrediction[],
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    hairImage: HTMLImageElement
  ) => {
    if (webcam.current && predictions.length > 0) {
      predictions.forEach((prediction: AnnotatedPrediction) => {
        const keypoints = prediction.scaledMesh;
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.beginPath();

        // Draw the video feed first
        const videoElement = webcam.current!.video;
        if (videoElement) {
          ctx.drawImage(videoElement, 0, 0, width, height);
        }

        // Draw the hair filter
        drawHair(ctx, keypoints as Coords3D, hairImage);

        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
    }
  };

  const detect = async (model: MediaPipeFaceMesh) => {
    if (webcam.current && canvas.current) {
      const webcamCurrent = webcam.current as any;
      if (webcamCurrent.video.readyState === 4) {
        const video = webcamCurrent.video;
        const videoWidth = webcamCurrent.video.videoWidth;
        const videoHeight = webcamCurrent.video.videoHeight;
        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;
        const newPredictions = await model.estimateFaces({
          input: video,
        });
        setPredictions(newPredictions); // Update the predictions in the state
        const ctx = canvas.current.getContext("2d") as CanvasRenderingContext2D;
        requestAnimationFrame(() => {
          draw(newPredictions, ctx, videoWidth, videoHeight, hairImage);
        });
        detect(model);
      }
    }
  };

  const captureImage = () => {
    if (canvas.current) {
      const canvasElement = canvas.current;
      const context = canvasElement.getContext("2d");

      if (context) {
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
        draw(
          predictions,
          context,
          canvasElement.width,
          canvasElement.height,
          hairImage
        );
        const capturedImageUrl = canvasElement.toDataURL("image/jpeg");
        setCapturedImage(capturedImageUrl);
        setBase64Image(capturedImageUrl);
      } else {
        console.error("2D context is not available.");
      }
    } else {
      console.error("Canvas element not found.");
    }
  };

  useEffect(() => {
    runFaceDetect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHair]);

  const changeSelectedHair = (newHair: string) => {
    setSelectedHair(newHair);
    localStorage.setItem("selectedHair", newHair);
  };

  return (
    <div className="face-filter">
      <div className="face-filter-container">
        {capturedImage ? (
          <></>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Webcam
              id="canvasId"
              audio={false}
              ref={webcam}
              style={{
                textAlign: "center",
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 2,
              }}
            />
            <canvas
              id="canvasId"
              ref={canvas}
              style={{
                textAlign: "center",
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 3,
              }}
            />

            <button
              ref={captureButton}
              onClick={captureImage}
              style={{ position: "absolute", bottom: 0, left: 0, zIndex: 5 }}
            >
              Capture Image
            </button>

            {/* <select
              value={selectedHair}
              style={{ position: "absolute", bottom: 0, right: 0, zIndex: 5 }}
              onChange={(e) => setSelectedHair(e.target.value)}
            >
              {Object.keys(hairImages).map((hairOption) => (
                <option key={hairOption} value={hairOption}>
                  {hairOption}
                </option>
              ))}
            </select> */}
            <div
              className="hair-buttons"
              style={{ position: "absolute", bottom: 0, right: 0, zIndex: 5 }}
            >
              {Object.keys(hairImages).map((hairOption) => (
                <button
                  key={hairOption}
                  className={selectedHair === hairOption ? "selected" : ""}
                  onClick={() => changeSelectedHair(hairOption)}
                >
                  {hairOption}
                </button>
              ))}
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="captured-image">
            <img
              src={capturedImage}
              alt="Captured"
              className="image-captured"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceImageFilter;
