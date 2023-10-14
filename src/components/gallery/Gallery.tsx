import "./Gallery.css";
import designLine1 from "../../assets/design-line1.png";
import galleryImage1 from "../../assets/gallery-image1.png";
import galleryImage2 from "../../assets/gallery-image2.png";
import galleryImage3 from "../../assets/gallery-image3.png";
import galleryImage4 from "../../assets/gallery-image4.png";
import galleryImage5 from "../../assets/gallery-image5.png";
import galleryImage6 from "../../assets/gallery-image6.png";
import galleryImage7 from "../../assets/gallery-image7.png";
import galleryImage8 from "../../assets/gallery-image8.png";
import AnimatedSection from "../../AnimatedSection";

interface Props {
  imageUrl: string;
  title: string;
}

const galleryImageArray: Props[] = [
  { imageUrl: galleryImage1, title: "Clean Barbers Cut" },
  { imageUrl: galleryImage2, title: "Burst Fade" },
  { imageUrl: galleryImage3, title: "Buzz Cut" },
  { imageUrl: galleryImage4, title: "Clean Cut" },
  { imageUrl: galleryImage5, title: "Clean Fade" },
  { imageUrl: galleryImage6, title: "Classic Pompador" },
  { imageUrl: galleryImage7, title: "Clean Taper Fade" },
  { imageUrl: galleryImage8, title: "Exotic Cut" },
];

const Gallery = () => {
  return (
    <div className="gallery" id="gallery">
      <AnimatedSection className="gallery-container">
        <>
          <h2 className="gallery-title">Gallery</h2>
          <img src={designLine1} alt="" className="gallery-design-line" />
          <div className="gallery-image-container">
            {galleryImageArray.map((item, key) => (
              <div className="gallery-image-box" key={key}>
                <img
                  src={item.imageUrl}
                  alt=""
                  key={key}
                  className="gallery-image"
                />
                <span className="gallery-image-description">{item.title}</span>
              </div>
            ))}
          </div>
        </>
      </AnimatedSection>
    </div>
  );
};

export default Gallery;
