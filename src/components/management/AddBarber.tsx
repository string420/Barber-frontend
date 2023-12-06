import axios from "axios";
import { useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const AddBarber = () => {
  const [name, setName] = useState<string>("");
  const [scheduleFrom, setScheduleFrom] = useState<Dayjs | null>(dayjs());
  const [scheduleTo, setScheduleTo] = useState<Dayjs | null>(dayjs());

  const handleAddBarber = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/barber/create`,
        {
          fullname: name,
          scheduleFrom: dayjs(scheduleFrom).format("YYYY-MM-DD hh:mm A"),
          scheduleTo: dayjs(scheduleTo).format("YYYY-MM-DD hh:mm A"),
        }
      );
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        width: "450px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "column",
        height: "300px",
      }}
    >
      <h2>Add Barber</h2>
      <label
        style={{ display: "flex", flexDirection: "column", width: "100%" }}
      >
        Barber's Name:
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          style={{ width: "98%", height: "30px", paddingLeft: "5px" }}
        />
      </label>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "5px",
          marginTop: "5px",
          marginBottom: "5px",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <label
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            Start of Schedule:
            <DateTimePicker
              defaultValue={scheduleFrom}
              onChange={setScheduleFrom}
              minTime={dayjs(new Date(0, 0, 0, 8))}
              maxTime={dayjs(new Date(0, 0, 0, 20))}
              views={["year", "month", "day", "hours"]}
            />
          </label>
          <label
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            End of Schedule:
            <DateTimePicker
              defaultValue={scheduleTo}
              onChange={setScheduleTo}
              minTime={dayjs(new Date(0, 0, 0, 8))}
              maxTime={dayjs(new Date(0, 0, 0, 20))}
              views={["year", "month", "day", "hours"]}
            />
          </label>
        </LocalizationProvider>
      </div>
      <button
        style={{
          width: "100%",
          height: "50px",
          marginTop: "5px",
          marginBottom: "5px",
          padding: "10px 0",
          borderRadius: "10px",
        }}
        onClick={handleAddBarber}
      >
        Add Barber
      </button>
    </div>
  );
};

export default AddBarber;
