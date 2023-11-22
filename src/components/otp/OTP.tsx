import React, { useState, useRef } from "react";
import "./OTP.css";
import axios from "axios";
import { DialogContent, Dialog } from "@mui/material";
import { useLocation } from "react-router-dom";
import NewPassword from "../newPassword/NewPassword";

const OTP = () => {
  const location = useLocation();
  const email = location.pathname.split("/")[2];

  console.log(email);

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const toggleModal = () => {
    setOpen(!open);
  };

  const [otp, setOTP] = useState<string[]>(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (!isNaN(Number(value)) && value.length <= 1) {
      otp[index] = value;
      setOTP([...otp]);
      if (index < 3 && value) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleSubmit = async () => {
    const enteredOTP = otp.join("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/email/verify-otp`,
        {
          email: email,
          enteredOTP: enteredOTP,
        }
      );
      if (response.status === 200) {
        // OTP is valid, proceed with authentication
        alert("OTP is valid.");
        toggleModal();
      } else {
        // OTP is invalid, show an error message
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      alert("Invalid OTP. Please try again.");
      console.error("Error verifying OTP:", error);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);

    const countdownDuration = 60;

    const endTime = Date.now() + countdownDuration * 1000;

    const countdownInterval = setInterval(() => {
      const currentTime = Date.now();
      const timeLeft = Math.max(0, Math.ceil((endTime - currentTime) / 1000));
      setRemainingTime(timeLeft);

      if (timeLeft === 0) {
        // The countdown has ended. Clear the interval.
        clearInterval(countdownInterval);
        setLoading(false);
      }
    }, 1000);

    try {
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/email/send`, {
        email: email,
      });
    } catch (error) {
      console.log(error);
      clearInterval(countdownInterval); // Clear the interval in case of an error.
      setRemainingTime(0);
    }
  };

  return (
    <div className="otp">
      <div className="otp-container">
        <h1 className="otp-title">OTP Verification</h1>
        <span>We have sent a code to your email {email}</span>
        <div className="otp-code-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              className="otp-input"
              value={digit}
              ref={inputRefs[index]}
              onChange={(e) => handleInputChange(e, index)}
            />
          ))}
        </div>
        <button className="otp-submit" onClick={handleSubmit}>
          Submit
        </button>
        <span>
          Didn't receive the code?{" "}
          <a style={{ cursor: "pointer" }} onClick={handleResendCode}>
            {loading ? `Please wait (${remainingTime} seconds)` : "Resend"}
          </a>
        </span>
        <Dialog open={open} maxWidth="md">
          <DialogContent>
            <NewPassword email={email} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OTP;
