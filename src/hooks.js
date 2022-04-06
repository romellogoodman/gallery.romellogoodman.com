import _debounce from "lodash/debounce";
import { useEffect, useRef, useState } from "react";

export const useScaledCanvas = (canvasWidth, canvasHeight, margin = 32) => {
  const container = useSize();
  const containerWidth = container.width || 400;
  const containerHeight = container.height || 400;
  const scaleX = (containerWidth - margin) / canvasWidth;
  const scaleY = (containerHeight - margin) / canvasHeight;
  const smallerScale = scaleX < scaleY ? scaleX : scaleY;
  const height = canvasHeight * smallerScale;
  const width = canvasWidth * smallerScale;

  return { height, width, ref: container.ref };
};

export const useSize = () => {
  const ref = useRef();
  const [size, setSize] = useState({ height: null, width: null });
  const handleResize = _debounce(() => {
    const { height, width } = ref?.current?.getBoundingClientRect() || {};

    if (height && width) {
      setSize({ height, width });
    }
  }, 10);
  // const handleResize = () => {
  //   const { height, width } = ref?.current?.getBoundingClientRect() || {};

  //   if (height && width) {
  //     setSize({ height, width });
  //   }
  // };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { ...size, ref };
};

const events = [
  "deviceMoved",
  "deviceShaken",
  "deviceTurned",
  "doubleClicked",
  "keyPressed",
  "keyReleased",
  "keyTyped",
  "mouseClicked",
  "mouseDragged",
  "mouseMoved",
  "mousePressed",
  "mouseReleased",
  "mouseWheel",
  "preload",
  "touchEnded",
  "touchMoved",
  "touchStarted",
  "windowResized",
];

export const useP5 = (config) => {
  const {
    draw,
    setup,
    events: propsEvents,
    input,
    isWEBGL,
    height,
    width,
    ref,
  } = config;

  const [sketch, setSketch] = useState();

  useEffect(() => {
    const sketch = new window.p5((p5) => {
      window.PFIVE = p5;

      p5.setup = () => {
        let can;

        if (isWEBGL) {
          can = p5.createCanvas(width, height, p5.WEBGL);
        } else {
          can = p5.createCanvas(width, height);

          // console.log("can", can, width, height);
        }

        can.parent(ref.current);

        if (propsEvents?.preload) {
          propsEvents.preload(null, p5);
        }

        if (setup) {
          setup(p5, input);
        }
      };

      if (draw) {
        p5.draw = () => {
          draw(p5, input);
        };
      }

      events.forEach((event) => {
        if (config[event]) {
          p5[event] = (ev) => {
            if (config[event]) config[event](ev, p5);
          };
        }
      });
    });

    setSketch(sketch);
  }, []);

  useEffect(() => {
    if (sketch?.resizeCanvas && width && height) {
      sketch.resizeCanvas(width, height);
    } else {
      console.log("sketch.resizeCanvas no resize");
    }
  }, [height, width]);

  useEffect(() => {
    if (sketch) {
      sketch.draw = () => {
        draw(window.PFIVE, input);
      };
    }
  }, [input]);
};
