import "@babel/polyfill";
import React, { Fragment } from "react";
import ReactDOM from "react-dom";

import Looper from "../src/looper";

const App = () => {
  return (
    <Fragment>
      <Looper looping />
    </Fragment>
  );
};

ReactDOM.render(<App />, document.querySelector(".root"));
