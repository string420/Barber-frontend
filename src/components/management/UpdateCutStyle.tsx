import axios from "axios";
import { useState, useEffect } from "react";
import { CutInterface } from "../../Types";

interface Prop {
  paramsId: string;
}

const UpdateCutStyle = ({ paramsId }: Prop) => {
  const [cutName, setCutName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [cutData, setCutData] = useState<CutInterface>();

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/cut/${paramsId}`
      );
      setCutData(res.data);
    };
    fetch();
  }, [paramsId]);

  console.log("Cut Data", cutData);

  const onSubmit = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/cut/update/${paramsId}`,
        {
          cutName: cutName === "" ? cutData?.cutName : cutName,
          description: description === "" ? cutData?.description : description,
        }
      );
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
          <input
            type="text"
            defaultValue={cutData?.cutName}
            onChange={(e) => setCutName(e.target.value)}
          />
        </label>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "10px",
          }}
        >
          Description
          <input
            type="text"
            defaultValue={cutData?.description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button onClick={onSubmit} style={{ marginTop: "10px" }}>
          Update Cut Style
        </button>
      </div>
    </div>
  );
};

export default UpdateCutStyle;
