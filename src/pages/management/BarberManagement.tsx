import {
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useQuery } from "react-query";
import { BarberInterface } from "../../Types";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import AddBarber from "../../components/management/AddBarber";

const BarberManagement = () => {
  const [open, setOpen] = useState<boolean>(false);

  const { data } = useQuery<BarberInterface[]>({
    queryKey: ["BarberManagement"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/barber`)
        .then((res) => res.data),
  });

  const toggleOpen = () => {
    setOpen(!open);
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
        <div
          style={{
            width: "100%",
            maxWidth: "1100px",
            justifyContent: "flex-start",
          }}
        >
          <button onClick={toggleOpen}>Add Barber</button>
        </div>
        <Table sx={{ maxWidth: "1100px", width: "100%", height: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>ID</span>
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Barber's name</span>
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Status</span>
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Created Date</span>
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
                  {item._id}
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  {item.fullname}
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  <span className="capitalize">{item.status}</span>
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  {dayjs(item.createdAt).format("YYYY-MM-DD")}
                </TableCell>

                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  <button style={{ marginRight: "10px" }}>Edit</button>
                  <button>Delete</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={toggleOpen}>
        <DialogContent>
          <AddBarber />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BarberManagement;
