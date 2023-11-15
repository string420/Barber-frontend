import { useState, useRef } from "react";

interface Props {
  setBase64Image: (image: string) => void;
}

const RenderFilter = ({ setBase64Image }: Props) => {
  const [showUploadButton, setShowUploadButton] = useState<boolean>(false);
  const [showTakePhotoButton, setShowTakePhotoButton] =
    useState<boolean>(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [showRadioButtons, setShowRadioButtons] = useState<boolean>(false);
  const [showGenerate, setShowGenerate] = useState<boolean>(false);
  const [showReset, setShowReset] = useState<boolean>(false);
  const [showOr, setShowOr] = useState<boolean>(false);
  const [fileimg, setFile] = useState<File | null>(null);

  const handleRadioChange = (e: any) => {
    if (e.target.value === "yes") {
      setShowUploadButton(true);
      setShowTakePhotoButton(true);
      setCapturedPhoto(null);
      setUploadedPhoto(null);
      setShowRadioButtons(true);
      setShowOr(true);
    } else {
      setShowUploadButton(false);
      setShowTakePhotoButton(false);
      setCapturedPhoto(null);
      setUploadedPhoto(null);
      setShowRadioButtons(false);
      setShowOr(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      const mediaStream = new MediaStream();
      mediaStream.addTrack(stream.getVideoTracks()[0]);
      video.srcObject = mediaStream;
      await video.play();
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        ?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photo = canvas.toDataURL("image/png");
      setCapturedPhoto(photo);
      setShowTakePhotoButton(true);
      setShowGenerate(true);
      setShowReset(true);
      setShowUploadButton(false);
      setShowOr(false);
      const blob = dataURLtoBlob(photo);
      const file = new File([blob], "image.png", { type: "image/png" });
      setFile(file);
      stream.getVideoTracks()[0].stop();
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  //convert Data URL to Blob
  function dataURLtoBlob(dataURL: string): Blob {
    const byteString = atob(dataURL.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/png" });
  }

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const uploadedImage = event.target?.result as string;
        setUploadedPhoto(uploadedImage);
        setShowTakePhotoButton(false);
        setCapturedPhoto(null);
        setShowGenerate(true);
        setShowReset(true);
        setShowOr(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const radioRef = useRef(null);
  const [responseImage, setResponseImage] = useState("");
  // const [showLoading, setShowLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const generateHaircut = async () => {
    if (radioRef.current) {
      const radioContainer = radioRef.current as HTMLElement;
      const selectedOption = radioContainer.querySelector(
        "input:checked"
      ) as HTMLInputElement;
      if (selectedOption) {
        const haircut = selectedOption.value.toString();
        const image = uploadedPhoto || capturedPhoto;

        if (fileimg) {
          console.log("Haircut: ", haircut);
          console.log("Image: ", image);

          const payload = new FormData();
          payload.append("haircut", haircut);
          payload.append("image", fileimg);

          try {
            setProcessing(true);
            const response = await fetch(
              "https://flask-production-f2d6.up.railway.app/generate-haircut",
              {
                method: "POST",
                body: payload,
              }
            );

            if (response.ok) {
              console.log("Request successful");
              const data = await response.json();

              console.log("Response Data:", data);
              if (data.image_data) {
                setResponseImage(data.image_data);
                setBase64Image(data.image_data); // TODO: added by me
                setProcessing(false);
              } else {
                console.error("Image generation failed:", data.error_msg);
                setProcessing(false);
              }
            } else {
              console.error("Request failed");
              setProcessing(false);
            }
          } catch (error) {
            console.error("Error:", error);
            setProcessing(false);
          }
        } else {
          console.error("No image selected.");
          setProcessing(false);
        }
      } else {
        console.error("No radio button selected.");
        setProcessing(false);
      }
    } else {
      console.error("Radio container not found.");
      setProcessing(false);
    }
  };

  const retryAgain = () => {
    setResponseImage("");
    setUploadedPhoto("");
    setCapturedPhoto(null);
    setShowRadioButtons(true);
    setShowTakePhotoButton(true);
    setShowOr(true);
    setShowUploadButton(true);
    setShowGenerate(false);
    setShowReset(false);
  };

  return (
    <div
      style={{
        marginTop: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="create-appoitment-yes-no-container">
        <span>
          Do you want to try our virtual filter that will apply your desired
          haircut?{" "}
        </span>
        <label>
          Yes
          <input
            type="radio"
            name="virtualFilter"
            value="yes"
            onChange={handleRadioChange}
          />
        </label>
        <label>
          No
          <input
            type="radio"
            name="virtualFilter"
            value="no"
            onChange={handleRadioChange}
            defaultChecked
          />
        </label>
      </div>

      <div
        style={{
          marginTop: "30px",
          borderRadius: "25px",
          border: "5px solid #1a1919",
          padding: "10px",
        }}
        className="radio-buttons-container"
      >
        {showRadioButtons && (
          <div
            style={{ marginTop: "10px" }}
            className="radio-buttons-container"
            ref={radioRef}
          >
            <label style={{ color: "white", fontSize: "20px" }}>
              Select your Haircut:
            </label>
            <br></br>
            <br></br>
            <label>
              <input type="radio" name="options" checked={true} value="1" />
              <span style={{ color: "white" }}>Buzz Cut</span>
            </label>
            <label style={{ marginLeft: "15px" }}>
              <input type="radio" name="options" value="2" />
              <span style={{ color: "white" }}>Low Fade</span>
            </label>
            <label style={{ marginLeft: "15px" }}>
              <input type="radio" name="options" value="3" />
              <span style={{ color: "white" }}>Textured Fringe</span>
            </label>
            <label style={{ marginLeft: "15px" }}>
              <input type="radio" name="options" value="4" />
              <span style={{ color: "white" }}>Pompadour</span>
            </label>
            <label style={{ marginLeft: "15px" }}>
              <input type="radio" name="options" value="5" />
              <span style={{ color: "white" }}>Undercut</span>
            </label>
          </div>
        )}
        {showTakePhotoButton && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              className="create-appointment-btn"
              onClick={handleTakePhoto}
            >
              Take a Photo
            </button>
          </div>
        )}
        {showOr && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <label htmlFor="" style={{ textAlign: "center", color: "white" }}>
              - or -
            </label>
          </div>
        )}
        ;
        {capturedPhoto && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              style={{ width: "400px" }}
              src={responseImage ? responseImage : capturedPhoto}
              alt="Captured Photo"
            />
          </div>
        )}
        {showUploadButton && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "-60px",
            }}
          >
            <label
              className="create-appointment-btn"
              style={{ cursor: "pointer" }}
            >
              Upload Photo
              <input
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleUploadPhoto}
              />
            </label>
            {uploadedPhoto && (
              <img
                src={responseImage ? responseImage : uploadedPhoto}
                alt="Uploaded Photo"
                style={{ marginTop: "10px", width: "400px" }}
              />
            )}
          </div>
        )}
        ;
        {showReset && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "-60px",
            }}
          >
            <button className="create-appointment-btn" onClick={retryAgain}>
              Reset Image
            </button>
          </div>
        )}
        ;
        {showGenerate && !responseImage && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "-60px",
            }}
          >
            {processing ? (
              <button className="create-appointment-btn">Processing...</button>
            ) : (
              <button
                className="create-appointment-btn"
                onClick={generateHaircut}
              >
                Generate Haircut
              </button>
            )}
          </div>
        )}
        ;
      </div>
    </div>
  );
};

export default RenderFilter;
