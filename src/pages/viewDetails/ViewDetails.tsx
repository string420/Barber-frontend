import "./ViewDetails.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// , useRef, useCallback
import axios from "axios";
import { AppointmentInterface } from "../../Types";
import Rating from "@mui/material/Rating";
import { toast } from "react-toastify";
// import Webcam from "react-webcam";

// const videoConstraints = {
//   width: 1280,
//   height: 720,
//   facingMode: "user",
// };

const ViewDetails = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  //   const webcamRef = useRef<Webcam | null>(null);

  //   const capture = useCallback(() => {
  //     if (webcamRef.current) {
  //       const imageSrc = webcamRef.current.getScreenshot();

  //       console.log(imageSrc);
  //     }
  //   }, [webcamRef]);

  const [appointmentData, setAppointmentData] =
    useState<AppointmentInterface>();
  const [ImageFile, setImageFile] = useState<string>("");
  const [rating, setRating] = useState<number>(0);

  const fileTypeChecking = (e: any) => {
    var fileInput = document.getElementById("file-upload") as HTMLInputElement;
    var filePath = fileInput.value;

    // Allowing file type
    var allowedExtensions = /(\.png|\.jpg|\.jpeg)$/i;
    // |\.pdf|\.tex|\.txt|\.rtf|\.wps|\.wks|\.wpd

    if (!allowedExtensions.exec(filePath)) {
      alert("Invalid file type");
      fileInput.value = "";
      return false;
    }

    setImageFile(e.target.files[0]);
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/appointment/${id}`
      );
      setAppointmentData(res.data);
      setRating(res.data.barberRating);
    };
    fetch();
  }, [id]);

  const navigate = useNavigate();

  const updateBarberRating = async (barberName: string) => {
    try {
      await axios.put(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/barbers/updateRating/${barberName}`
      );
      console.log("Average rating updated successfully.");
    } catch (error) {
      console.error("Error updating average rating:", error);
    }
  };

  const updateRating = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/appointment/update/${id}`,
        {
          barberRating: rating,
        }
      );
      updateBarberRating(appointmentData?.barberName || "");
      toast("Successful Submitted the rating!", {
        type: "success",
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="viewdetails">
      <div className="viewdetails-container">
        <h1 className="viewdetails-item">
          Barber's name: {appointmentData?.barberName}
        </h1>

        <div className="upload-image-container">
          <h1>Compare your current haircut to your picked filter</h1>
          {appointmentData?.base64ImageUrl && (
            <img
              src={appointmentData?.base64ImageUrl}
              alt="Past-self-image"
              className="base-64-image"
            />
          )}

          <img
            src={
              ImageFile
                ? URL.createObjectURL(
                    new Blob([ImageFile], { type: "image/jpeg" })
                  )
                : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
            }
            alt="AddImage"
            className="placeholder-image"
          />
          <label htmlFor="file-upload" className="receipt-input-image">
            Upload your new look here..
            <input
              type="file"
              id="file-upload"
              onChange={fileTypeChecking}
              style={{ display: "none" }}
            />
          </label>
          {ImageFile && (
            <label className="viewdetails-item">
              Barber's Rating:
              {appointmentData?.barberRating === undefined ? (
                "loading"
              ) : (
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(event, newValue) => {
                    console.log(event);
                    setRating(newValue || 0);
                  }}
                />
              )}
              <button onClick={updateRating}>Submit Rating</button>
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
