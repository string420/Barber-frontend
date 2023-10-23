import axios from "axios";
import { useState } from "react";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import dayjs from "dayjs";

const AddBarber = () => {
  const [name, setName] = useState<string>("");
  const [schedule, setSchedule] = useState<any>([null, null]);

  const handleAddBarber = async () => {
    try {
      const formattedSchedule: [string | null, string | null] = [
        (schedule?.[0] as Date | null)?.toISOString() || null,
        (schedule?.[1] as Date | null)?.toISOString() || null,
      ];

      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/barber/create`,
        {
          fullname: name,
          schedule: formattedSchedule,
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
        width: "300px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "300px",
      }}
    >
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
      <label
        style={{ display: "flex", flexDirection: "column", width: "100%" }}
      >
        Schedule:
        <DateTimeRangePicker
          onChange={(newRange) => setSchedule(newRange)}
          value={schedule}
          minDate={new Date()}
          maxDate={
            schedule && Array.isArray(schedule)
              ? dayjs(schedule[0]).add(5, "day").toDate()
              : undefined
          }
        />
      </label>
      <button
        style={{
          width: "100%",
          height: "30px",
          marginTop: "5px",
          marginBottom: "5px",
        }}
        onClick={handleAddBarber}
      >
        Add Barber
      </button>
    </div>
  );
};

export default AddBarber;
