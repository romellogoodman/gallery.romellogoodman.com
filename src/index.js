import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import { useP5, useScaledCanvas } from "./hooks";
import "./styles.css";

const Controls = (props) => {
  return (
    <div className="controls">
      <div>
        <label>Course</label>
        <select>
          <option>Option A</option>
          <option>Option B</option>
          <option>Option C</option>
        </select>
      </div>
      <div>
        <label>Student</label>
        <select>
          <option>Option A</option>
          <option>Option B</option>
          <option>Option C</option>
        </select>
      </div>
      <button>Generate</button>
      <button>Capture</button>
      <a href="/about">
        <p>About</p>
      </a>
    </div>
  );
};

const Sketch = (props) => {
  const { draw, setup, ...restOfP5Functions } = props;
  const {
    height,
    width,
    ref: responsiveRef,
  } = useScaledCanvas(props.width, props.height);
  const canvasRef = useRef();

  useP5({
    ...restOfP5Functions,
    draw,
    setup,
    height,
    width,
    ref: canvasRef,
  });

  return (
    <div className="page" ref={responsiveRef}>
      <div
        className="container"
        ref={canvasRef}
        style={{ height: "100vh", width: "100vw" }}
      />
    </div>
  );
};

const App = () => {
  const sketch = {
    draw: (p5) => {
      p5.circle(p5.width / 2, p5.height / 2, 100);
    },
    height: 500,
    width: 500,
  };

  return (
    <div>
      <Controls />
      <Sketch {...sketch} />
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App tab="home" />);
