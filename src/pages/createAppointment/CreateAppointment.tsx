import "./CreateAppointment.css";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect, useMemo } from "react";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import useAuthStore from "../../zustand/AuthStore";
import { toast } from "react-toastify";
import {
  AppointmentInterface,
  BarberInterface,
  CutInterface,
} from "../../Types";
import { useLocation, useNavigate } from "react-router-dom";
import RenderFilter from "../../components/face_detection/RenderFilter";
import { Dialog, DialogContent } from "@mui/material";
import QRCode from "../../assets/qr-code.jpg";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const CreateAppointment = () => {
  const user = useAuthStore((state) => state.user);

  const location = useLocation();
  const selectedDate = location.pathname.split("/")[2];
  const navigate = useNavigate();

  // added

  const [reservedTimeSlots, setReservedTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<AppointmentInterface[]>(
        `${import.meta.env.VITE_APP_API_URL}/api/appointment`
      );

      // Filter reserved time slots for the selected date
      const selectedDateAppointments = response.data?.filter(
        (appointment) =>
          dayjs(appointment.appointmentDate).format("YYYY-MM-DD") ===
          selectedDate
      );

      const reservedSlots = selectedDateAppointments.map(
        (appointment) => appointment?.appointmentTime
      );

      setReservedTimeSlots(reservedSlots);
    };
    fetchData();
  }, []);

  // added

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
  const [imageFile, setImageFile] = useState<string>("");

  const roundedTime =
    Number(time?.minute()) < 1
      ? time?.startOf("hour")
      : Number(time?.add(1, "hour").startOf("hour")) + 1;

  const handleCloseBtn = () => {
    setIsOpenQRModal(false);
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

  const userSelectedDate = dayjs(selectedDate);
  const userSelectedTime = dayjs(roundedTime);

  const availableBarberList = useMemo(() => {
    return barberList.filter((barber) => {
      const schedule = barber.schedule;

      console.log("schedule", schedule);

      if (schedule.length === 2) {
        const [start, end] = schedule;
        const startDateTime = dayjs(start, "YYYY-MM-DD HH:mm");
        const endDateTime = dayjs(end, "YYYY-MM-DD HH:mm");

        return (
          userSelectedDate.isBetween(startDateTime, endDateTime, "day", "[]") &&
          // @ts-ignore
          userSelectedTime.isBetween(startDateTime, endDateTime, "[]") // use [] for time comparison
        );
      }

      return false;
    });
  }, [barberList, userSelectedDate, userSelectedTime]);

  console.log(availableBarberList);

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

  const handleSubmitAppointment = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("file", imageFile);
      data.append("upload_preset", "upload");
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/alialcantara/image/upload",
        data
      );
      const { url } = uploadRes.data;

      const appointmentData = {
        email: user,
        contactNumber: contactNumber,
        appointmentDate: dayjs(selectedDate).format("YYYY-MM-DD"),
        appointmentTime: dayjs(roundedTime).format("hh:mmA"),
        barberName: selectedBarber,
        cutStyle: selectedCutStyle,
        reason: reason,
        receipt: url,
        base64ImageUrl: base64Image,
      };

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
        printAppointmentDetails();
        navigate("/");
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

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

  const toggleQRModal = () => {
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
    setIsOpenQRModal(true);
  };

  const handleNavigateCalendar = () => {
    navigate("/calendar");
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
            minTime={dayjs().startOf("day").add(8, "hour")}
            maxTime={dayjs().startOf("day").add(20, "hour")}
            shouldDisableTime={(time) =>
              reservedTimeSlots.includes(dayjs(time).format("hh:mmA"))
            }
          />
        </LocalizationProvider>

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
      <button className="create-appointment-btn" onClick={toggleQRModal}>
        {loading ? "Please wait..." : "Proceed to Payment"}
      </button>
      <button
        className="create-appointment-btn"
        style={{ backgroundColor: "red", color: "white" }}
        onClick={handleNavigateCalendar}
      >
        Go back to Calendar
      </button>
      <Dialog open={isOpenQRModal} onClose={toggleQRModal}>
        <DialogContent>
          <div className="shipping-modal">
            <img src={QRCode} alt="" className="qr-image" />

            <span style={{ fontSize: "20px", textAlign: "center" }}>
              To proceed to appointment please pay the ₱ 50 payment then upload
              the receipt on the button below. Note: No refund policy upon
              cancellation of appointment.
            </span>

            <label htmlFor="file-upload" className="update-product-input-image">
              Upload Receipt Here...
              <input
                type="file"
                id="file-upload"
                onChange={fileTypeChecking}
                style={{ display: "none" }}
              />
            </label>

            <button
              className="shipping-btn-close"
              style={{ backgroundColor: "red", padding: "10px 70px" }}
              onClick={handleCloseBtn}
            >
              Close
            </button>
          </div>
          {imageFile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <button
                className="create-appointment-btn"
                onClick={handleSubmitAppointment}
              >
                {loading ? "Please wait.." : "Submit Appointment"}
              </button>
              <div className="update-product-image-container">
                <h3>Receipt</h3>
                <img
                  src={
                    imageFile
                      ? URL.createObjectURL(
                          new Blob([imageFile], { type: "image/jpeg" })
                        )
                      : ""
                  }
                  alt="AddImage"
                  className="addcategory-img"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateAppointment;
