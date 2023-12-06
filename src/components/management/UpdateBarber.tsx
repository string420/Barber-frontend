import axios from "axios";
import { useEffect, useState } from "react";
import { BarberInterface } from "../../Types";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface Prop {
  paramsId: string;
  toggleUpdateBarberClose: () => void;
}

const UpdateBarber = ({ paramsId, toggleUpdateBarberClose }: Prop) => {
  console.log(paramsId);
  const [name, setName] = useState<string>("");
  const [barberData, setBarberData] = useState<BarberInterface>();
  const [scheduleFrom, setScheduleFrom] = useState<Dayjs | null>(dayjs());
  const [scheduleTo, setScheduleTo] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get<BarberInterface>(
        `${import.meta.env.VITE_APP_API_URL}/api/barber/${paramsId}`
      );
      setBarberData(res.data);

      setScheduleFrom(dayjs(res.data.scheduleFrom, "YYYY-MM-DD hh:mm A"));
      setScheduleTo(dayjs(res.data.scheduleTo, "YYYY-MM-DD hh:mm A"));
    };

    fetch();
  }, [paramsId]);

  const handleUpdateBarber = async () => {
    try {
      const updatedData = {
        fullname: name ? name : barberData?.fullname,
        scheduleFrom: dayjs(scheduleFrom).format("YYYY-MM-DD hh:mm A"),
        scheduleTo: dayjs(scheduleTo).format("YYYY-MM-DD hh:mm A"),
      };

      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/barber/update/${paramsId}`,
        updatedData
      );

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("Component rerendered with updated data:", barberData);
  }, [barberData]);

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
      <h2>Update Barber</h2>
      <label
        style={{ display: "flex", flexDirection: "column", width: "100%" }}
      >
        Barber's Name:
        <input
          type="text"
          defaultValue={barberData?.fullname}
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
              value={scheduleFrom}
              onChange={setScheduleFrom}
              views={["year", "month", "day", "hours"]}
            />
          </label>
          <label
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            End of Schedule:
            <DateTimePicker
              value={scheduleTo}
              onChange={setScheduleTo}
              views={["year", "month", "day", "hours"]}
            />
          </label>
        </LocalizationProvider>
      </div>
      <button
        style={{
          width: "100%",
          height: "30px",
          marginTop: "5px",
          marginBottom: "5px",
        }}
        onClick={handleUpdateBarber}
      >
        Update Barber
      </button>
      <button
        style={{
          width: "100%",
          height: "30px",
          marginTop: "5px",
          marginBottom: "5px",
        }}
        onClick={toggleUpdateBarberClose}
      >
        Cancel
      </button>
    </div>
  );
};

export default UpdateBarber;
