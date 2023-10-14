import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useAnimation, motion } from "framer-motion";

interface Props {
  children: JSX.Element;
  className: string;
}

const variantsFramerMotion = {
  visible: {
    opacity: 1,
    transform: "translateY(0)",
  },
  hidden: {
    opacity: 0,
    transform: "translateY(50px)",
  },
};

const AnimatedSection = ({ children, className }: Props) => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={variantsFramerMotion}
      transition={{ ease: "easeOut", duration: 1.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
