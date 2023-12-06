import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useQuery } from "react-query";
import { AppointmentInterface } from "../../Types";
import axios from "axios";
import useAuthStore from "../../zustand/AuthStore";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useState } from "react";
import ConfirmationModal from "../../components/confirmationModal/ConfirmationModal";
import "./Appointments.css";
import ConfirmationModalReschedule from "../../components/confirmationModal/ConfirmationModalReschedule";

const Appointments = () => {
  const user = useAuthStore((state) => state.user);

  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);

  const [openRescheduleConfirmation, setOpenRescheduleConfirmation] =
    useState<boolean>(false);

  const [paramsId, setParamsId] = useState<string>("");

  const { data } = useQuery<AppointmentInterface[]>({
    queryKey: ["UserAppointmentList"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/appointment/list/${user}`)
        .then((res) => res.data),
  });

  const toggleOpenConfirmation = (id: string) => {
    setParamsId(id);
    setOpenConfirmation(true);
  };

  const toggleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const toggleOpenRescheduleConfirmation = (id: string) => {
    setParamsId(id);
    setOpenRescheduleConfirmation(true);
  };

  const toggleCloseRescheduleConfirmation = () => {
    setOpenRescheduleConfirmation(false);
  };

  return (
    <div style={{ height: "calc(100vh - 100px)" }}>
      <TableContainer
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Table sx={{ maxWidth: "1100px", width: "100%", height: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Email</span>
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Appointment Date</span>
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Appointment Time</span>
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Contact Number</span>
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Reason</span>
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Created Date</span>
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Status</span>
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Action</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item) => (
              <TableRow key={item._id}>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  {item.email}
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  {dayjs(item.appointmentDate).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  {item.appointmentTime}
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  {item.contactNumber}
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  {item.reason}
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  {dayjs(item.createdAt).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", color: "white" }}
                  className={`${item.status}-appointment`}
                >
                  {item.status}
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Link to={`/appointments/${item._id}`}>
                      <button
                        style={{
                          padding: "10px",
                          backgroundColor: "green",
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                        }}
                      >
                        View Details
                      </button>
                    </Link>

                    <button
                      style={{
                        height: "50px",
                        padding: "10px",
                        backgroundColor: "green",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleOpenRescheduleConfirmation(item._id)}
                    >
                      Reschedule
                    </button>

                    <button
                      style={{
                        padding: "10px",
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleOpenConfirmation(item._id)}
                    >
                      Cancel Appointment
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openConfirmation} onClose={toggleCloseConfirmation}>
        <DialogContent>
          <ConfirmationModal
            paramsId={paramsId}
            toggleCloseConfirmation={toggleCloseConfirmation}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={openRescheduleConfirmation}
        onClose={toggleCloseRescheduleConfirmation}
      >
        <DialogContent>
          <ConfirmationModalReschedule
            paramsId={paramsId}
            toggleCloseConfirmation={toggleCloseRescheduleConfirmation}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;
