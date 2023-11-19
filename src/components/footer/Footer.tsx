import "./Footer.css";

import { Facebook } from "@mui/icons-material";
import logo from "../../assets/logo.png";
import tiktok from "../../assets/tik-tok.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <img src={logo} alt="logo" className="footer-logo" />
          <p>&copy; 2023 Mangubat Barbershop</p>
        </div>
        <div className="footer-right">
          <p>
            #118 LRT Sunflower Street, Western Bicutan, Taguig City, Taguig,
            Philippines
          </p>
          <p>Contact Number: 0927 898 9738</p>
          <div className="footer-social-container">
            <a
              href="https://www.tiktok.com/@mangubat.barber"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "white",
                textDecoration: "none",
                height: "20px",
                width: "20px",
                padding: "5px",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={tiktok} alt="" style={{ width: "20px" }} />
            </a>
            <a
              href="https://www.facebook.com/MangubatsBarbershop"
              target="_blank"
              style={{
                backgroundColor: "white",
                color: "black",
                textDecoration: "none",
                height: "20px",
                width: "20px",
                padding: "5px",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              rel="noopener noreferrer"
            >
              <Facebook />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
