import "@babel/polyfill";
import React, { Fragment } from "react";
import ReactDOM from "react-dom";

import Looper from "../src/looper";

const App = () => {
	return (
		<Fragment>
			<Looper looping playEach={4} oscillator={{ frequency: 600, duration: 0.9 }} />
		</Fragment>
	);
};

ReactDOM.render(<App />, document.querySelector(".root"));
