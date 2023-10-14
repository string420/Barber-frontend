import "./CreateAppointment.css";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect } from "react";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import useAuthStore from "../../zustand/AuthStore";
import { toast } from "react-toastify";
import { BarberInterface, CutInterface } from "../../Types";
import { useLocation, useNavigate } from "react-router-dom";
import RenderFilter from "../../components/face_detection/RenderFilter";
import { Dialog, DialogContent } from "@mui/material";
import QRCode from "../../assets/qr-code.jpg";

const CreateAppointment = () => {
  const user = useAuthStore((state) => state.user);

  const location = useLocation();
  const selectedDate = location.pathname.split("/")[2];
  const navigate = useNavigate();

  const [contactNumber, setContactNumber] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const [barberList, setBarberList] = useState<BarberInterface[]>([]);
  const [cutStyleList, setCutStyleList] = useState<CutInterface[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [selectedCutStyle, setSelectedCutStyle] = useState<string>("");
  const [base64Image, setBase64Image] = useState<string>("");
  const [isOpenQRModal, setIsOpenQRModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [time, setTime] = useState<Dayjs | null>(dayjs(new Date()));

  const roundedTime =
    Number(time?.minute()) < 1
      ? time?.startOf("hour")
      : Number(time?.add(1, "hour").startOf("hour")) + 1;

  // const addMinutes = time?.add(45, "minute");

  // const roundedTime = addMinutes?.hour();

  // const theNextHour = time?.set({
  //   hour: roundedTime,
  //   minute: 0,
  //   second: 0,
  //   millisecond: 0,
  // });

  // setTime(theNextHour);

  // console.log(roundedTime);

  const handleCloseBtn = () => {
    setIsOpenQRModal(false);
    navigate("/");
  };

  const toggleQRModal = () => {
    setIsOpenQRModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/barber`
      );
      setBarberList(response.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/cut`
      );
      setCutStyleList(response.data);
    };
    fetchData();
  }, []);

  const availableBarberList = barberList?.filter(
    (item) => item.status === "available"
  );

  const handleSubmitAppointment = async () => {
    setLoading(true);
    if (contactNumber === "") {
      setLoading(false);
      return alert("Please put contact number on the field");
    }

    if (selectedBarber === "") {
      setLoading(false);
      return alert("Please select your barber");
    }

    if (selectedCutStyle === "") {
      setLoading(false);
      return alert("Please select your cut style");
    }

    const appointmentData = {
      email: user,
      contactNumber: contactNumber,
      appointmentDate: dayjs(selectedDate).format("YYYY-MM-DD"),
      appointmentTime: dayjs(time).format("hh:mmA"),
      barberName: selectedBarber,
      cutStyle: selectedCutStyle,
      base64ImageUrl: base64Image,
      reason: reason,
    };
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/appointment/create`,
        appointmentData
      );
      toast("Successful Registration!", {
        type: "success",
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
      setTimeout(() => {
        toggleQRModal();
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const printAppointmentDetails = () => {
    const htmlContent = `
      <html>
        <head>
          <title>Appointment Details</title>
        </head>
        <body>
          <div class="calendar-container-item">
            <label>Selected Date: </label>
            <span>${dayjs(selectedDate).format("YYYY-MM-DD")}</span>
          </div>
          <div>
            <label>Selected Time: </label>
            <span>${time}</span>
          </div>
          <div>
            <label>Barber's Name: </label>
            <span>${selectedBarber}</span>
          </div>
          <div>
            <label>Cut Style: </label>
            <span>${selectedCutStyle}</span>
          </div>
          <div>
            <label>Contact Number: </label>
            <span>${contactNumber}</span>
          </div>
          <div>
            <label>Additional Instruction: </label>
            <span>${reason}</span>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow?.document.write(htmlContent);
    printWindow?.document.close();
    printWindow?.print();
    printWindow?.close();
  };

  return (
    <div className="calendar-modal">
      <h1 style={{ color: "white" }}>Create Appointment</h1>
      <div className="create-appointment-container">
        <div className="calendar-container-item">
          <label>Selected Date: </label>
          <span id="create-appointment-selected-date">
            {dayjs(selectedDate).format("YYYY-MM-DD")}
          </span>
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopTimePicker
            value={dayjs(roundedTime)}
            onChange={(newValue) => setTime(newValue)}
            timeSteps={{ hours: 1, minutes: 60, seconds: 60 }}
            sx={{ color: "white", backgroundColor: "white" }}
            disablePast
          />
        </LocalizationProvider>

        {/* <div className="calendar-container-item">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Fullname"
            className="calendar-modal-input"

          />
        </div> */}

        <div className="calendar-container-item">
          <label>Pick your Barber</label>
          <select
            className="calendar-modal-select"
            onChange={(e) => setSelectedBarber(e.target.value)}
          >
            <option value="">Pick your Barber</option>
            {availableBarberList.map((item, key) => (
              <option value={item.fullname} key={key}>
                {item.fullname}
              </option>
            ))}
          </select>
        </div>

        <div className="calendar-container-item">
          <label>Pick your cut style</label>
          <select
            className="calendar-modal-select"
            onChange={(e) => setSelectedCutStyle(e.target.value)}
          >
            <option value="">Pick your cut Style</option>
            {cutStyleList.map((item, key) => (
              <option value={item.cutName} key={key}>
                {item.cutName}
              </option>
            ))}
          </select>
        </div>

        <div className="calendar-container-item">
          <label>Contact Number</label>
          <input
            type="text"
            maxLength={11}
            minLength={11}
            placeholder="Contact Number"
            className="calendar-modal-input"
            onChange={(e) => {
              const inputValue = e.target.value;
              const numericValue = inputValue.replace(/\D/g, "");
              setContactNumber(numericValue);
            }}
          />
        </div>

        <div className="calendar-container-item">
          <label>Additional Instruction</label>
          <textarea
            cols={30}
            rows={5}
            placeholder="Additional Instruction"
            className="calendar-modal-textarea"
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
        </div>
      </div>
      <RenderFilter setBase64Image={setBase64Image} />
      <button
        className="create-appointment-btn"
        onClick={handleSubmitAppointment}
      >
        {loading ? "Please wait..." : "Submit Appointment"}
      </button>
      <Dialog open={isOpenQRModal} onClose={toggleQRModal}>
        <DialogContent>
          <div className="shipping-modal">
            <img src={QRCode} alt="" className="qr-image" />

            <span style={{ fontSize: "20px" }}>
              Please scan it or save it then print the receipt before closing.
            </span>
            <button
              className="shipping-btn-close"
              onClick={printAppointmentDetails}
            >
              Print Receipt
            </button>
            <button
              className="shipping-btn-close"
              style={{ backgroundColor: "red", padding: "10px 70px" }}
              onClick={handleCloseBtn}
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* <Dialog open={isOpenQRModal} onClose={toggleQRModal}>
        <DialogContent>
          <div className="shipping-modal">
            <img src={QRCode} alt="" className="qr-image" />

            <span style={{ fontSize: "20px" }}>
              Please scan it or save it before closing.
            </span>
            <button className="shipping-btn-close" onClick={handleCloseBtn}>
              Print Receipt
            </button>
          </div>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default CreateAppointment;
