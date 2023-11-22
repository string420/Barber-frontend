import "./App.css";
import "@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/navbar/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Calendar from "./components/calendar/Calendar";
// import FaceDetection from "./components/face_detection/FaceFilter";
import BarberManagement from "./pages/management/BarberManagement";
import AppointmentManagement from "./pages/management/AppointmentManagement";
import Appointments from "./pages/appointments/Appointments";
import CutManagement from "./pages/management/CutManagement";
import ViewDetails from "./pages/viewDetails/ViewDetails";
// import FaceImageFilter from "./components/face_detection/FaceImageFilter";
import CreateAppointment from "./pages/createAppointment/CreateAppointment";
import ForTryFilter from "./components/face_detection/ForTryFilter";
import Reviews from "./pages/reviews/Reviews";
import useAuthStore from "./zustand/AuthStore";
import OTP from "./components/otp/OTP";

function App() {
  const user = useAuthStore((state) => state.user);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/calendar"
          element={user ? <Calendar /> : <Navigate to="/" />}
        />
        <Route
          path="/appointments"
          element={user ? <Appointments /> : <Navigate to="/" />}
        />
        <Route
          path="/appointments/:id"
          element={user ? <ViewDetails /> : <Navigate to="/" />}
        />
        <Route
          path="/appointment/:date"
          element={user ? <CreateAppointment /> : <Navigate to="/" />}
        />
        <Route path="/try-filter-camera" element={<ForTryFilter />} />
        <Route path="/reviews" element={<Reviews />} />
        {/* admin */}
        <Route
          path="/admin/appointment"
          element={user ? <AppointmentManagement /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/barbers"
          element={user ? <BarberManagement /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/cuts"
          element={user ? <CutManagement /> : <Navigate to="/" />}
        />
        <Route path="/otp/:email" element={<OTP />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
