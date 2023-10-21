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
import { toast } from "react-toastify";

const AppointmentManagement = () => {
  const { data } = useQuery<AppointmentInterface[]>({
    queryKey: ["Appointments"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/appointment`)
        .then((res) => res.data),
  });

  const onChangeHandleStatus = async (id: string, status: string) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/appointment/update/${id}`,
        {
          status: status,
        }
      );
      toast.success(`Successfully change the status`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
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
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Status</span>
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
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  <div>
                    <select
                      style={{
                        padding: "10px",
                        border: "none",
                        color: "white",
                      }}
                      className={item.status}
                      defaultValue={item.status}
                      onChange={(e) =>
                        onChangeHandleStatus(item._id, e.target.value)
                      }
                    >
                      <option
                        style={{
                          fontSize: "16px",
                          backgroundColor: "#FFBF00",
                          color: "white",
                        }}
                        value="Pending"
                      >
                        Pending
                      </option>
                      <option
                        style={{
                          fontSize: "16px",
                          backgroundColor: "#039487",
                          color: "white",
                        }}
                        value="Approved"
                      >
                        {item.status === "Approved" ? "Approved" : "Approve"}
                      </option>
                      <option
                        style={{
                          fontSize: "16px",
                          backgroundColor: "#ff0000",
                          color: "white",
                        }}
                        value="Rejected"
                      >
                        {item.status === "Rejected" ? "Rejected" : "Reject"}
                      </option>
                    </select>
                  </div>
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
