import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { RegistrationInterface } from "../../Types";
import "./Registration.css";

const Registration = ({ toggleRegistrationModal }: any) => {
  const [registrationInfo, setRegistrationInfo] =
    useState<RegistrationInterface>({
      fullname: "",
      email: "",
      password: "",
    });

  const [error, setError] = useState<string>("");

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setRegistrationInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const sendEmail = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/email/send`, {
        recipient: registrationInfo.email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/user/register`,
        registrationInfo
      );

      sendEmail();
      toast.success("Please check your email to verify your registration!", {
        type: "success",
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        toggleRegistrationModal();
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response) {
          const responseStatus = axiosError.response.status;
          if (responseStatus === 409) {
            setError("Email already exist.");
          } else {
            setError("An error occured.");
          }
        }
      } else {
        setError((err as Error).message);
      }
    }
  };

  return (
    <div className="registration">
      <h2 className="registration-title">Registration</h2>
      <hr className="registration-horizontal-line" />
      <div className="registration-input-container">
        <input
          className="registration-input"
          type="text"
          placeholder="Full name"
          name="fullname"
          onChange={onChangeHandler}
        />
      </div>
      <div className="registration-input-container">
        <input
          className="registration-input"
          type="email"
          placeholder="Email"
          name="email"
          onChange={onChangeHandler}
        />
      </div>
      <div className="registration-input-container">
        <input
          className="registration-input"
          type="password"
          placeholder="Password"
          name="password"
          onChange={onChangeHandler}
        />
      </div>
      {error && <span className="error-message">{error}</span>}
      <div className="registration-button-container">
        <button className="registration-button" onClick={handleSubmit}>
          Register
        </button>
        <button
          className="registration-cancel-button"
          onClick={toggleRegistrationModal}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Registration;
