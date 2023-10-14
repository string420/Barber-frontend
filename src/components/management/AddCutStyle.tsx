import axios from "axios";
import { useState } from "react";

const AddCutStyle = () => {
  const [cutName, setCutName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const onSubmit = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/cut/create`, {
        cutName: cutName,
        description: description,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <div>
        <label style={{ display: "flex", flexDirection: "column" }}>
          Cut Name
          <input type="text" onChange={(e) => setCutName(e.target.value)} />
        </label>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "10px",
          }}
        >
          Description
          <input type="text" onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button onClick={onSubmit} style={{ marginTop: "10px" }}>
          Add Cut Style
        </button>
      </div>
    </div>
  );
};

export default AddCutStyle;
