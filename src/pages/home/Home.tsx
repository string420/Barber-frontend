import Footer from "../../components/footer/Footer";
import Gallery from "../../components/gallery/Gallery";
import Header from "../../components/header/Header";
import ScrollToTheTop from "../../components/scroll/ScrollToTheTop";
import Service from "../../components/service/Service";
import Story from "../../components/story/Story";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <Header />
      <Story />
      <ScrollToTheTop />
      <Gallery />
      <div className="home-separator"></div>
      <Service />
      <Footer />
    </div>
  );
};

export default Home;
