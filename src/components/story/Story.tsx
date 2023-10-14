import "./Story.css";
import storyImage from "../../assets/story-image.png";
import AnimatedSection from "../../AnimatedSection";

const Story = () => {
  return (
    <div className="story" id="story">
      <AnimatedSection className="story-container">
        <>
          <div className="story-left">
            <h1 className="story-left-title">MANGUBAT'S STORY</h1>
            <p className="story-left-description">
              Mangubat’s Barbershop is established in 2010. The owner’s name is
              Albert Mangubat, inspired by his father who was a barber. When
              Albert was young in the 1980s, he developed a passion for starting
              his own barbershop... Albert Mangubat also participated in haircut
              competitions to enhance and showcase his talent as a barber. Over
              time, their business grew, and by 2019, they were proud to have
              established a signature haircut...
            </p>
          </div>
          <div className="story-right">
            <img src={storyImage} alt="" className="story-image" />
          </div>
        </>
      </AnimatedSection>
    </div>
  );
};

export default Story;
