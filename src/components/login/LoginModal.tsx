import "./Login.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent } from "@mui/material";
import useAuthStore from "../../zustand/AuthStore";
import { LoginInterface, Transition, UserInterface } from "../../Types";
import Registration from "../registration/RegistrationModal";
import logo from "../../assets/logo.png";

const Login = ({ toggleLoginModal }: any) => {
  const setUser = useAuthStore((state) => state.setUser);

  const [credentials, setCredentials] = useState<LoginInterface>({
    email: "",
    password: "",
  });
  const [regIsOpen, setRegIsOpen] = useState<boolean>(false);

  const [errors, setErrors] = useState<string>("");
  const [userData, setUserData] = useState<UserInterface>();
  const [loading, setLoading] = useState<boolean>(false);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleRegistrationModal = () => {
    setRegIsOpen(!regIsOpen);
    toggleLoginModal();
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/api/user/${credentials.email}`
      );
      setUserData(response.data);
    };
    fetchData();
  }, [credentials.email]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (userData?.isEnable === false) {
        setLoading(false);
        return alert("Please verify your account in your email first");
      }

      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/user/login`,
        credentials
      );

      setUser(credentials.email);
      setLoading(false);
      toggleLoginModal();
    } catch (err) {
      console.log(err);
      setLoading(false);
      setErrors("Incorrect email or password.");
    }
  };

  return (
    <div className="login">
      <img src={logo} alt="logo" className="login-logo" />
      <p className="login-title">Welcome to Mangubat's Barbershop</p>
      <hr className="login-horizontal-line" />
      <div className="login-input-container">
        <input
          className="login-input"
          type="text"
          placeholder="Email"
          name="email"
          onChange={onChangeHandler}
        />
      </div>
      <div className="login-input-container">
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          name="password"
          onChange={onChangeHandler}
        />
        {errors && (
          <div style={{ padding: "5px 0" }}>
            <span style={{ color: "red" }}>{errors}</span>
          </div>
        )}
        <button className="login-btn" onClick={handleLogin}>
          {loading ? "Please wait..." : "Login"}
        </button>

        <p className="login-text">
          No account? Register{" "}
          <a onClick={toggleRegistrationModal}>
            <u style={{ cursor: "pointer" }}>here</u>
          </a>
        </p>
      </div>
      <Dialog
        open={regIsOpen}
        onClose={toggleRegistrationModal}
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogContent>
          <Registration toggleRegistrationModal={toggleRegistrationModal} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
