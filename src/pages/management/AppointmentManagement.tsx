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
import { AppointmentInterface } from "../../Types";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useEffect, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import { Search } from "@mui/icons-material";
import moment from "moment";

const AppointmentManagement = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [paramsId, setParamsId] = useState<string>("");
  const [appointmentSingleData, setAppointmentSingleData] =
    useState<AppointmentInterface>();
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data } = useQuery<AppointmentInterface[]>({
    queryKey: ["AppointmentManagement"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/appointment`)
        .then((res) => res.data),
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/appointment/${paramsId}`
      );
      setAppointmentSingleData(res.data);
    };
    fetch();
  }, [paramsId]);

  const onChangeHandleStatus = async () => {
    try {
      await axios.put(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/appointment/update/${paramsId}`,
        {
          status: selectedStatus,
          userNotification: true,
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

  const toggleOpenView = (id: string) => {
    setParamsId(id);
    setIsOpen(true);
  };

  const toggleOpenViewClose = () => {
    setIsOpen(false);
  };

  const toggleConfirmation = (id: string, status: string) => {
    setSelectedStatus(status);
    setParamsId(id);
    setOpenConfirmation(true);
  };

  const toggleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const filteredData = useMemo(() => {
    return data?.filter((item) => {
      const orderDate = moment(item.appointmentDate, "YYYY-MM-DD hh:mm A");

      // Check if the orderDate falls within the selected date range
      const isDateInRange =
        startDate &&
        endDate &&
        orderDate.isBetween(
          moment(startDate).startOf("day"),
          moment(endDate).endOf("day"),
          "day",
          "[]"
        );

      // Check if the search term matches the first name or last name
      const isSearchMatch =
        item?.barberName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        item?.fullName?.toLowerCase()?.includes(searchTerm?.toLowerCase());

      // Return true if either date or search term matches
      return isDateInRange && isSearchMatch;
    });
  }, [data, startDate, endDate, searchTerm]);

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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ color: "white" }}>Start Date: </span>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="yyyy-MM-dd"
              isClearable
              className="datepicker"
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ color: "white" }}>End Date: </span>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="yyyy-MM-dd"
              isClearable
              className="datepicker"
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ color: "white" }}>Search Barber Name: </span>
            <div
              style={{
                border: "2px solid black",
                width: "100%",
                display: "flex",
                alignItems: "center",
                paddingLeft: "20px",
                borderRadius: "20px",
              }}
            >
              <Search />
              <input
                style={{
                  borderRadius: "20px",
                  width: "80%",
                  border: "none",
                  outline: "none",
                  padding: "20px",
                }}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <Table sx={{ maxWidth: "1100px", width: "100%", height: "100%" }}>
          <TableHead className="bg-[#374151]">
            <TableRow>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Name</span>
              </TableCell>
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
                <span>Barber Name</span>
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Status</span>
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                <span>Receipt</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="assessment-tablebody">
            {filteredData?.map((item) => (
              <TableRow key={item._id}>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  {item.fullName}
                </TableCell>
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
                  {item.barberName}
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
                        toggleConfirmation(item._id, e.target.value)
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
                <TableCell>
                  <button onClick={() => toggleOpenView(item._id)}>
                    View Receipt
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div
          style={{
            marginTop: "20px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "white", fontWeight: "bold" }}>
            TOTAL APPOINTMENT SHOWN: {filteredData?.length}
          </span>
        </div>
      </TableContainer>
      {/* status confirmation */}
      <Dialog open={openConfirmation} onClose={toggleCloseConfirmation}>
        <DialogContent>
          <div className="orderConfirmationModal">
            <div className="orderConfirmBtns">
              <button
                className="orderProceedBtn"
                onClick={onChangeHandleStatus}
              >
                Change status to {selectedStatus}?
              </button>
              <button
                className="orderCancelBtn"
                onClick={toggleCloseConfirmation}
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* payment */}
      <Dialog open={isOpen} onClose={toggleOpenViewClose}>
        <DialogContent>
          <h3 style={{ marginBottom: "10px" }}>Proof of Payment (Receipt)</h3>
          <img
            src={appointmentSingleData?.receipt}
            alt=""
            className="proofOfPaymentImage"
          />
          <button
            style={{
              border: "none",
              borderRadius: "10px",
              padding: "5px",
              width: "150px",
              fontSize: "20px",
              marginTop: "10px",
              backgroundColor: "#0071c2",
              color: "white",
              cursor: "pointer",
            }}
            onClick={toggleOpenViewClose}
          >
            Close
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentManagement;
