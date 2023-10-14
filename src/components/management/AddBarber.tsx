import axios from "axios";
import { useState } from "react";

const AddBarber = () => {
  const [name, setName] = useState<string>("");

  const handleAddBarber = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/barber/create`,
        {
          fullname: name,
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
        height: "350px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <label>
        Barber's Name:
        <input type="text" onChange={(e) => setName(e.target.value)} />
      </label>
      <button onClick={handleAddBarber}>Add Barber</button>
    </div>
  );
};

export default AddBarber;
