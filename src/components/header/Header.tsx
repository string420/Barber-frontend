import "./Header.css";
import designLine from "../../assets/design-line.png";
import appointmentBtn from "../../assets/appointment-button.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <div className="header-container">
        <img
          src={designLine}
          alt="design-line"
          className="header-design-line"
        />
        <h1 className="header-title">MANGUBAT'S BARBERSHOP</h1>
        <h2 className="header-secondary-title">THE HOUSE OF FADE</h2>
        <Link to="/calendar" style={{ textDecoration: "none" }}>
          <img src={appointmentBtn} alt="" className="header-appointment-btn" />
        </Link>
        <img
          src={designLine}
          alt="design-line"
          className="header-design-line"
        />
      </div>
    </div>
  );
};

export default Header;
