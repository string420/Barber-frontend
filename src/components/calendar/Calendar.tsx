import "./Calendar.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import designLine from "../../assets/design-line.png";
import Login from "../login/LoginModal";
import { AppointmentInterface, Transition } from "../../Types";
import useAuthStore from "../../zustand/AuthStore";
import { useQuery } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const Calendar = () => {
  const user = useAuthStore((state) => state.user);

  const { data } = useQuery<AppointmentInterface[]>("Calendar", async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/appointment/list/${user}`
    );
    return response.data.map((appointment: any) => ({
      title: appointment.appointmentTime,
      date: appointment.appointmentDate,
      appointmentDate: appointment.appointmentDate,
    }));
  });

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleClose = () => {
    setIsOpen(false);
  };

  const toggleIsOpen = (date: any) => {
    if (!user) {
      setIsOpen(true);
    } else {
      navigate(`/appointment/${dayjs(date).format("YYYY-MM-DD")}`);
    }
  };

  const date = new Date();

  const validDate = {
    start: date.setDate(date.getDate() + 1),
  };

  return (
    <div className="calendar" id="calendar">
      <div className="calendar-container">
        <div className="calendar-title-container">
          <img src={designLine} alt="" className="calendar-design-line" />
          <h2 className="calendar-title">Book an appointment here..</h2>
          <p className="calendar-description">
            Click on your desired date for the appointment and submit your
            inquiry.
          </p>
          <img src={designLine} alt="" className="calendar-design-line" />
        </div>

        <div>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={(info) => toggleIsOpen(info.date)}
            events={data}
            validRange={validDate}
          />
          <Dialog
            open={isOpen}
            onClose={toggleClose}
            maxWidth="sm"
            TransitionComponent={Transition}
            keepMounted
          >
            <DialogContent>
              <Login />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
