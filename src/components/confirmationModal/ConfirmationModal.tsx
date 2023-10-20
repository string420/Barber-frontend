import "./ConfirmationModal.css";
import axios from "axios";
import { toast } from "react-toastify";

interface Props {
  paramsId: string;
  toggleCloseConfirmation: () => void;
}

const ConfirmationModal = ({ paramsId, toggleCloseConfirmation }: Props) => {
  const handleCancelAppointment = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/appointment/delete/${paramsId}`
      );
      toast(`Successful Cancelled your appointment with ID: ${paramsId}!`, {
        type: "success",
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="orderConfirmationModal">
      <div className="orderConfirmBtns">
        <button className="orderProceedBtn" onClick={handleCancelAppointment}>
          Proceed to Cancel Appointment
        </button>
        <button className="orderCancelBtn" onClick={toggleCloseConfirmation}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
