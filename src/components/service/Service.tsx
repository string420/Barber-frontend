import "./Service.css";
import pic1 from "../../assets/pic1.png";
import pic2 from "../../assets/pic2.png";
import pic3 from "../../assets/pic3.png";
import AnimatedSection from "../../AnimatedSection";

const Service = () => {
  return (
    <div className="service" id="service">
      <AnimatedSection className="service-container">
        <>
          <h2 className="service-title">WHAT WE DO</h2>
          <p className="service-description">
            We provide quality haircut at an affordable price. We make sure that
            each haircut that we give to everyone was made with love.
          </p>
          <div className="service-list-container">
            <div className="service-image-container-list">
              <img src={pic1} alt="" className="service-image" />
              <p className="service-image-description">
                All kinds of fade (with or without hardpart, Shape up included)
              </p>
              <span className="service-price">₱130</span>
            </div>
            <div className="service-image-container-list">
              <img src={pic2} alt="" className="service-image" />
              <p className="service-image-description">
                Regular Haircut Barbers, trim, etc
              </p>
              <span className="service-price">₱100</span>
            </div>
            <div className="service-image-container-list">
              <img src={pic3} alt="" className="service-image" />
              <p className="service-image-description">Shave up Hard Part</p>
              <span className="service-price">₱10</span>
            </div>
          </div>
        </>
      </AnimatedSection>
    </div>
  );
};

export default Service;
