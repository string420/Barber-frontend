import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { RegistrationInterface } from "../../Types";
import "./Registration.css";

const Registration = ({ toggleRegistrationModal }: any) => {
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const onChangeFullname = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const regex = /^[a-zA-Z0-9\s]*$/;

    // Check if the input matches the allowed pattern
    if (regex.test(inputValue)) {
      setFullname(inputValue);
      setError(""); // Clear any previous error messages
    } else {
      setError("Only alphanumeric characters and spaces are allowed.");
    }
  };

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const sendEmail = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/email/send`, {
        recipient: email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const registrationInfo: RegistrationInterface = {
      fullname,
      email,
      password,
    };

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
            setError("Email already exists.");
          } else {
            setError("An error occurred.");
          }
        }
      } else {
        setError((err as Error).message);
      }
    }
  };

  useEffect(() => {
    const keyDownHandler = (event: any) => {
      console.log("sample");
      if (event.key === "Enter") {
        handleSubmit(event);
      }
    };
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

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
          value={fullname}
          onChange={onChangeFullname}
        />
      </div>
      <div className="registration-input-container">
        <input
          className="registration-input"
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={onChangeEmail}
        />
      </div>
      <div className="registration-input-container">
        <input
          className="registration-input"
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChangePassword}
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
