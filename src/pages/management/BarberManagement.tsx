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
import { toast } from "react-toastify";
import UpdateBarber from "../../components/management/UpdateBarber";

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

  const handleDeleteBarber = async (id: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/barber/delete/${id}`
      );
      toast.success(`Successfully Delete barber`, {
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

  const [openUpdateBarber, setOpenUpdateBarber] = useState<boolean>(false);
  const [paramsId, setParamsId] = useState<string>("");

  const toggleUpdateBarber = (id: string) => {
    setParamsId(id);
    setOpenUpdateBarber(true);
  };

  const toggleUpdateBarberClose = () => {
    setOpenUpdateBarber(false);
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
                <span>Barber's name</span>
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Schedule</span>
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
                  {item.fullname}
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  <div>
                    {dayjs(item.schedule?.[0]).format("YYYY-MM-DD HH:mm")} -{" "}
                    {dayjs(item.schedule?.[1]).format("YYYY-MM-DD HH:mm")}
                  </div>
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  {dayjs(item.createdAt).format("YYYY-MM-DD")}
                </TableCell>

                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  <button
                    style={{
                      width: "70px",
                      height: "30px",
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                    onClick={() => toggleUpdateBarber(item._id)}
                  >
                    Edit
                  </button>

                  <button
                    style={{
                      width: "70px",
                      height: "30px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDeleteBarber(item._id)}
                  >
                    Delete
                  </button>
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
      <Dialog open={openUpdateBarber} onClose={toggleUpdateBarberClose}>
        <DialogContent>
          <UpdateBarber
            toggleUpdateBarberClose={toggleUpdateBarberClose}
            paramsId={paramsId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BarberManagement;
