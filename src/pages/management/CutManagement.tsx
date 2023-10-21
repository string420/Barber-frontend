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
import { CutInterface } from "../../Types";
import { useQuery } from "react-query";
import axios from "axios";
import dayjs from "dayjs";
import AddCutStyle from "../../components/management/AddCutStyle";
import { useState } from "react";
import UpdateCutStyle from "../../components/management/UpdateCutStyle";

const CutManagement = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [paramsId, setParamsId] = useState<string>("");

  const toggleModalUpdate = (id: string) => {
    setParamsId(id);
    setOpenUpdate(true);
  };

  const toggleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  console.log(paramsId);

  const { data } = useQuery<CutInterface[]>({
    queryKey: ["CutManagement"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/cut`)
        .then((res) => res.data),
  });

  const toggleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/api/cut/delete/${id}`
      );
      window.location.reload();
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
          <button onClick={() => setOpen(true)}>Add Cut Style</button>
        </div>
        <Table sx={{ maxWidth: "1100px", width: "100%", height: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Cut Style Name</span>
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Description</span>
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
                  {item.cutName}
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  <span className="capitalize">{item.description}</span>
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  {dayjs(item.createdAt).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  <button
                    style={{ marginRight: "10px", cursor: "pointer" }}
                    onClick={() => toggleModalUpdate(item._id)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ marginRight: "10px", cursor: "pointer" }}
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={toggleClose}>
        <DialogContent>
          <AddCutStyle />
        </DialogContent>
      </Dialog>
      <Dialog open={openUpdate} onClose={toggleCloseUpdate}>
        <DialogContent>
          <UpdateCutStyle paramsId={paramsId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CutManagement;
