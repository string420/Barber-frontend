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

  const onChangeHandleStatus = async (id: string, status: string) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/barber/update/${id}`,
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
                  <div>
                    <select
                      style={{ padding: "10px", border: "1px solid #ccc" }}
                      defaultValue={item.status}
                      onChange={(e) =>
                        onChangeHandleStatus(item._id, e.target.value)
                      }
                    >
                      <option style={{ fontSize: "16px" }} value="available">
                        Available
                      </option>
                      <option
                        style={{ fontSize: "16px" }}
                        value="not available"
                      >
                        Not available
                      </option>
                    </select>
                  </div>
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
