import axios from "axios";
import { useEffect, useState } from "react";
import { BarberInterface } from "../../Types";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import dayjs from "dayjs";

interface Prop {
  paramsId: string;
  toggleUpdateBarberClose: () => void;
}

const UpdateBarber = ({ paramsId, toggleUpdateBarberClose }: Prop) => {
  console.log(paramsId);
  const [name, setName] = useState<string>("");
  const [barberData, setBarberData] = useState<BarberInterface>();
  const [schedule, setSchedule] = useState<any>([null, null]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/barber/${paramsId}`
      );
      setBarberData(res.data);
    };
    fetch();
  }, [paramsId]);

  console.log(barberData);

  const handleUpdateBarber = async () => {
    const formattedSchedule: [string | null, string | null] = [
      (schedule?.[0] as Date | null)?.toISOString() || null,
      (schedule?.[1] as Date | null)?.toISOString() || null,
    ];

    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/barber/update/${paramsId}`,
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
        flexDirection: "column",
      }}
    >
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
