import React from "react";
import "./App.css";
import IconPNG from "./images/monkeys.png";
import IconSVG from "./images/stories.svg";

function App() {
  function myFunct() {
    console.log("Clicked");
  }

  return (
    <div className="App">
      <h1>Testing...</h1>
      <img src={IconSVG}></img>
      <img src={IconPNG}></img>
      <button onClick={() => myFunct()}>CLICK</button>
    </div>
  );
}

export default App;
