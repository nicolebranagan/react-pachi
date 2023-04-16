import * as React from "react";

import CrowdImage from "../img/crowd.png";

const CROWD_IMAGE_WIDTH = 852;
const CROWD_IMAGE_HEIGHT = 162;

export function Crowd() {
  const [top, setTop] = React.useState(0);
  const [left, setLeft] = React.useState(() => {
    return window.innerWidth;
  });

  const topRef = React.useRef(top);
  const leftRef = React.useRef(left);

  topRef.current = top;
  leftRef.current = left;

  React.useEffect(() => {
    let animationFrame;

    const action = () => {
      if (leftRef.current < -CROWD_IMAGE_WIDTH) {
        setLeft(window.innerWidth);
        setTop(Math.random() * (window.innerHeight - CROWD_IMAGE_HEIGHT));
      } else {
        const deltaX = -3;
        const deltaY = leftRef.current % 2 ? -3 : +3;

        setLeft((l) => l + deltaX);
        setTop((t) => t + deltaY);
      }
      animationFrame = requestAnimationFrame(action);
    };
    animationFrame = requestAnimationFrame(action);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <img
      className="crowd-image"
      src={CrowdImage}
      alt="Crowd"
      style={{ top, left }}
    />
  );
}
