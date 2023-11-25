import { useState, useRef } from "react";

interface Prop {
  setBase64Image: (base64Image: string) => void;
}

const RenderFilter = ({ setBase64Image }: Prop) => {
  const [showUploadButton, setShowUploadButton] = useState<boolean>(false);
  const [showTakePhotoButton, setShowTakePhotoButton] = useState<boolean>(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [showSelectBox, setShowSelectBox] = useState<boolean>(false);
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
      setShowSelectBox(true);
      setShowOr(true);
    } else {
      setShowUploadButton(false);
      setShowTakePhotoButton(false);
      setCapturedPhoto(null);
      setUploadedPhoto(null);
      setShowSelectBox(false);
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
      canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
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

  const selectRef = useRef(null);
  const [responseImage, setResponseImage] = useState('');
  const [processing, setProcessing] = useState(false);

  const generateHaircut = async () => {
    if (selectRef.current) {
      const selectContainer = selectRef.current as HTMLElement;
      const selectedOption = selectContainer.querySelector("select") as HTMLSelectElement;
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
            const response = await fetch("http://3.106.125.140/generate-haircut", {
              method: "POST",
              body: payload,
            });

            if (response.ok) {
              console.log("Request successful");
              const data = await response.json();

              console.log("Response Data:", data);
              if (data.image_data) {
                setResponseImage(data.image_data);
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
        console.error("No option selected.");
        setProcessing(false);
      }
    } else {
      console.error("Select container not found.");
      setProcessing(false);
    }
  };

  const retryAgain = () => {
    setResponseImage("");
    setUploadedPhoto("");
    setCapturedPhoto(null);
    setShowSelectBox(true);
    setShowTakePhotoButton(true);
    setShowOr(true);
    setShowUploadButton(true);
    setShowGenerate(false);
    setShowReset(false);
  };


  return (
    <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
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

      <div style={{ marginTop: '30px', borderRadius: "25px", border: '5px solid #1a1919', padding: '10px' }} className="radio-buttons-container">

        {showSelectBox && (
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="select-box-container" ref={selectRef}>
            <label style={{ color: 'white', fontSize: '20px' }}>
              Select your Haircut:
            </label><br /><br />
            <select name="haircutOptions" style={{ width: '150px', height: '35px', fontSize: '15px' }} >
              <option value="1">Buzz Cut</option>
              <option value="2">Low Fade</option>
              <option value="3">Textured Fringe</option>
              <option value="4">Pompadour</option>
              <option value="5">Undercut</option>
              {/* <option value="6">Slingback</option> */}
            </select>
          </div>
        )}

        {showTakePhotoButton && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button className="create-appointment-btn" onClick={handleTakePhoto}>Take a Photo</button>
          </div>
        )}
        {showOr && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "10px" }}>
            <label htmlFor="" style={{ textAlign: "center", color: "white" }}>- or -</label>
          </div>
        )};

        {capturedPhoto && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
              style={{ width: "400px" }}
              src={responseImage ? responseImage : capturedPhoto}
              alt="Captured Photo"
            />
          </div>
        )}

        {showUploadButton && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "-60px" }}>
            <label className="create-appointment-btn" style={{ cursor: "pointer" }}>
              Upload Photo
              <input type="file" style={{ display: "none" }} accept="image/*" onChange={handleUploadPhoto} />
            </label>
            {uploadedPhoto && (
              <img
                src={responseImage ? responseImage : uploadedPhoto}
                alt="Uploaded Photo" style={{ marginTop: "10px", width: "400px" }} />

            )}

          </div>
        )};

        {showReset && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "-60px" }}>
            <button className="create-appointment-btn" onClick={retryAgain}>Reset Image</button>
          </div>
        )};
        {showGenerate && !responseImage && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "-60px" }}>
            {processing ? (
              <button className="create-appointment-btn">Processing...</button>
            ) : (
              <button className="create-appointment-btn" onClick={generateHaircut}>Generate Haircut</button>
            )}
          </div>
        )};
      </div>
    </div>
  );
};

export default RenderFilter;
