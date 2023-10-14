import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useQuery } from "react-query";
import { AppointmentInterface } from "../../Types";
import axios from "axios";
import dayjs from "dayjs";

const AppointmentManagement = () => {
  const { data } = useQuery<AppointmentInterface[]>({
    queryKey: ["Appointments"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/appointment`)
        .then((res) => res.data),
  });

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
          <TableHead className="bg-[#374151]">
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
                <span>Appointment Reason</span>
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Contact Number</span>
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Created Date</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="assessment-tablebody">
            {data?.map((item) => (
              <TableRow key={item._id}>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  {item.email}
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  {dayjs(item.appointmentDate).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  <span className="capitalize">{item.appointmentTime}</span>
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  {item.reason}
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  {item.contactNumber}
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  {dayjs(item.createdAt).format("YYYY-MM-DD")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AppointmentManagement;
