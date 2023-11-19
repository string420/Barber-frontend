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

  const convertedSchedule = convertStringArrayToDateArray(
    barberData?.schedule || []
  );

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
      const updatedData = {
        fullname: name ? name : barberData?.fullname,
        schedule:
          schedule && schedule[0] && schedule[1]
            ? formattedSchedule
            : convertedSchedule,
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

  // Function to convert string[] to [Date, Date]
  function convertStringArrayToDateArray(
    strings: string[]
  ): [Date, Date] | undefined {
    if (strings && strings.length === 2) {
      const dateArray: [Date, Date] = [
        new Date(strings[0]),
        new Date(strings[1]),
      ];
      return dateArray;
    }
    return undefined;
  }

  const maxDate =
    schedule && Array.isArray(schedule) && schedule.length === 2
      ? dayjs(schedule[0]).add(5, "day").toDate()
      : undefined;

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
      <label
        style={{ display: "flex", flexDirection: "column", width: "100%" }}
      >
        Schedule:
        <DateTimeRangePicker
          onChange={(newRange) => setSchedule(newRange)}
          value={convertedSchedule || [new Date(), new Date()]}
          minDate={new Date()}
          maxDate={maxDate}
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
