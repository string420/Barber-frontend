import "./Navbar.css";
import logo from "../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../zustand/AuthStore";
import { Person, Menu } from "@mui/icons-material";
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
  const [isNavMobile, setIsNavMobile] = useState<boolean>(false);
  const [showManagementDropdown, setShowManagementDropdown] =
    useState<boolean>(false);

  const location = useLocation();

  const toggleManagementDropdown = () => {
    setShowManagementDropdown(!showManagementDropdown);
  };

  const toggleNavMobile = () => {
    setIsNavMobile(!isNavMobile);
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

        <div
          className={
            isNavMobile
              ? "navbar-mobile-link-container"
              : "navbar-links-container"
          }
        >
          <a
            className="navbar-links"
            href={location.pathname === "/" ? "#" : "/"}
          >
            HOME
          </a>

          <a className="navbar-links" href="#story">
            ABOUT
          </a>
          <a className="navbar-links" href="#gallery">
            GALLERY
          </a>
          <a className="navbar-links" href="#service">
            WHAT WE DO
          </a>
          <a className="navbar-links" href="/reviews">
            REVIEWS
          </a>
          {/* {userData?.role === "user" && ( */}
          <a className="navbar-links" href="/appointments">
            APPOINTMENTS
          </a>
          {/* )} */}
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
                  >
                    <span>APPOINTMENT MANAGEMENT</span>
                  </Link>
                  <Link style={{ textDecoration: "none" }} to="/admin/barbers">
                    <span>BARBER MANAGEMENT</span>
                  </Link>
                  <Link style={{ textDecoration: "none" }} to="/admin/cuts">
                    <span>CUT MANAGEMENT</span>
                  </Link>
                </div>
              )}
            </div>
          )}
          <a className="navbar-links" href="/try-filter-camera">
            TRY OUR FILTER
          </a>
        </div>

        <div
          className={
            isNavMobile
              ? "navbar-mobile-login-container"
              : "navbar-login-container"
          }
        >
          {user ? (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Person sx={{ color: "white" }} />
                <span style={{ color: "white", fontSize: "18px" }}>{user}</span>
                <NotificationBadge />
              </div>
              <button className="navbar-login-btn" onClick={clearUser}>
                LOGOUT
              </button>
            </div>
          ) : (
            <button className="navbar-login-btn" onClick={() => setOpen(true)}>
              LOGIN
            </button>
          )}
        </div>

        <div className="navbar-burger-menu" onClick={toggleNavMobile}>
          <Menu sx={{ color: "white", fontSize: "35px" }} />
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
