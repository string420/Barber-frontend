import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/navbar/Navbar";
import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/appointments/:id" element={<ViewDetails />} />
        <Route path="/appointment/:date" element={<CreateAppointment />} />
        <Route path="/try-filter-camera" element={<ForTryFilter />} />
        <Route path="/reviews" element={<Reviews />} />
        {/* admin */}
        <Route path="/admin/appointment" element={<AppointmentManagement />} />
        <Route path="/admin/barbers" element={<BarberManagement />} />
        <Route path="/admin/cuts" element={<CutManagement />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
