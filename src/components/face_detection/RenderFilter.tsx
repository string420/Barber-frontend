import { useState } from "react";
import FaceImageFilter from "./FaceImageFilter";

interface Prop {
  setBase64Image: (base64Image: string) => void;
}

const RenderFilter = ({ setBase64Image }: Prop) => {
  const [showComponent, setShowComponent] = useState<boolean>(false);

  const handleRadioChange = (e: any) => {
    if (e.target.value === "yes") {
      setShowComponent(true);
    } else {
      setShowComponent(false);
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <div className="create-appoitment-yes-no-container">
        <span>
          Do you want to try our virtual filter that will apply your desired
          haircut?{" "}
        </span>
        <label>
          Yes
          <input
            type="radio"
            name="virtualFilter"
            value="yes"
            onChange={handleRadioChange}
          />
        </label>
        <label>
          No
          <input
            type="radio"
            name="virtualFilter"
            value="no"
            onChange={handleRadioChange}
            defaultChecked
          />
        </label>
      </div>

      {showComponent && (
        <div>
          <FaceImageFilter setBase64Image={setBase64Image} />
        </div>
      )}
    </div>
  );
};

export default RenderFilter;
