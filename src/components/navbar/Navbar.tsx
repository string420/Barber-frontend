import "./Navbar.css";
import logo from "../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../zustand/AuthStore";
import { Person, Menu, Close } from "@mui/icons-material";
import { Dialog, DialogContent } from "@mui/material";
import Login from "../login/LoginModal";
import { Transition, UserInterface } from "../../Types";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NotificationBadge from "../NotificationBadge/NotificationBadge";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [open, setOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserInterface>();

  const [showManagementDropdown, setShowManagementDropdown] =
    useState<boolean>(false);

  const location = useLocation();

  //
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  //

  const toggleManagementDropdown = () => {
    setShowManagementDropdown(!showManagementDropdown);
  };

  const toggleLoginModal = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/user/${user}`
      );
      setUserData(res.data);
    };
    fetchData();
  }, []);

  console.log(userData);

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <img
            src={logo}
            alt="Mangubat's Barbershop logo"
            className="navbar-logo"
            onClick={navigateToHome}
          />
        </div>

        {/* <div
          className={
            isNavMobile
              ? "navbar-mobile-link-container"
              : "navbar-links-container"
          }
        > */}
        <div className={click ? "nav-menu active" : "nav-menu"}>
          <div className="nav-link-container">
            <a
              className="navbar-links"
              href={location.pathname === "/" ? "#" : "/"}
              onClick={handleClick}
            >
              HOME
            </a>

            <a className="navbar-links" href="#story" onClick={handleClick}>
              ABOUT
            </a>
            <a className="navbar-links" href="#gallery" onClick={handleClick}>
              GALLERY
            </a>
            <a className="navbar-links" href="#service" onClick={handleClick}>
              WHAT WE DO
            </a>
            <a className="navbar-links" href="/reviews" onClick={handleClick}>
              REVIEWS
            </a>
            {userData?.role === "user" && (
              <a
                className="navbar-links"
                href="/appointments"
                onClick={handleClick}
              >
                APPOINTMENTS
              </a>
            )}

            <a className="navbar-links" href="/try-filter-camera">
              TRY OUR FILTER
            </a>

            {userData?.role === "admin" && (
              <div className="nav-dropdown" onClick={toggleManagementDropdown}>
                <span className="nav-link">MANAGEMENT</span>
                {showManagementDropdown && (
                  <div
                    className="dropdown-content"
                    style={
                      showManagementDropdown
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/admin/appointment"
                      onClick={handleClick}
                    >
                      <span>APPOINTMENT MANAGEMENT</span>
                    </Link>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/admin/barbers"
                      onClick={handleClick}
                    >
                      <span>BARBER MANAGEMENT</span>
                    </Link>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/admin/cuts"
                      onClick={handleClick}
                    >
                      <span>CUT MANAGEMENT</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            {user ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  gap: "5px",
                }}
                className="navbar-user-log-container"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Person sx={{ color: "white" }} className="navbar-icon" />
                  <span style={{ color: "white", fontSize: "18px" }}>
                    {user}
                  </span>
                  <NotificationBadge />
                </div>
                <button className="navbar-login-btn" onClick={clearUser}>
                  LOGOUT
                </button>
              </div>
            ) : (
              <button
                className="navbar-login-btn"
                onClick={() => setOpen(true)}
              >
                LOGIN
              </button>
            )}
          </div>
        </div>

        {/* <div className="navbar-burger-menu" onClick={toggleNavMobile}>
          <Menu sx={{ color: "white", fontSize: "35px" }} />
        </div> */}

        <div className="nav-icon" onClick={handleClick}>
          {/* <i className={click ? "fas fa-times" : "fas fa-bars"}></i> */}

          {click ? (
            <span className="icon">
              <Close sx={{ color: "white" }} />
            </span>
          ) : (
            <span className="icon">
              <Menu sx={{ color: "white" }} />
            </span>
          )}
        </div>
      </div>
      <Dialog
        open={open}
        onClose={toggleLoginModal}
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogContent>
          <Login toggleLoginModal={toggleLoginModal} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Navbar;
