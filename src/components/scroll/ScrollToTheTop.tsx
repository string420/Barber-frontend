import "./ScrollToTheTop.css";
import { useState, useEffect } from "react";

const ScrollToTheTop = () => {
  const [backToTop, setBackToTop] = useState<boolean>(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setBackToTop(true);
      } else {
        setBackToTop(false);
      }
    });
  }, []);

  const scrollup = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div>
      {backToTop && (
        <button className="scroll-btn" onClick={scrollup}>
          ^
        </button>
      )}
    </div>
  );
};

export default ScrollToTheTop;
