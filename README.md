![alt text](https://user-images.githubusercontent.com/16524839/44939852-1c368b80-ad91-11e8-8e8f-d15a196f4c2e.png)

[![npm version](https://badge.fury.io/js/react-looper.svg)](https://badge.fury.io/js/react-looper)

Web Audio API based Looper component for React

- [x] - Connect your own `AudioContext` (or use the default one 🤖)
- [x] - Built-in tweakable oscillator as metronome (tick, tick, tick...💣)
- [x] - Loop your audio file each X bars (just provide the arrayBuffer 👍)

# Installation and usage

```
yarn add react-looper
```

Metronome

```jsx
import Looper from "react-looper"

<Looper playing />
```

99 BPM

```jsx
<Looper bpm={99} playing />
```

Play each 4 bars

```jsx
<Looper bpm={99} playEach={4} playing />
```


## Props

| Name           | Type           | Default              | Description                          |
| :------------- | :------------- | :------------------- | :----------------------------------- |
| `audioContext` | `AudioContext` | `new AudioContext()` | AudioContext object                  |
| `bpm`          | `number`       | `120`                  | sets the tempo of your loop          |
| `looping`      | `boolean`      | `false`                | starts or stops your loop            |
| `onIteration`  | `function`     | `() => {}`             | function to invoke each iteration    |
| `playEach`     | `number`       | `undefined`            | play sound each number bars          |
| `source`       | `ArrayBuffer`  | `undefined`            | array buffer to play each iteration  |

## Additional props

`oscillator`

This object can be provided in order to configure Looper's oscillator and its duration (ms).

| Name           | Type           | Default              | Description                          |
| :------------- | :------------- | :------------------- | :----------------------------------- |
| `detune`       | `number`       | `0`                    | [OscillatorNode.detune](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/detune)                |
| `duration` 	 | `number` 	  | `0` 				     | duration of the tone in milliseconds |
| `frequency`      | `number`      | `false`                | [OscillatorNode.frequency](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/frequency)                         |
| `type`      | `string`      | `"sine"`                | [OscillatorNode.type](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/type)                    |


```jsx
const oscillatorConfig = {
	duration: 0.05,
	detune: 1,
	frequency: 555,
	type: "square",
}

<Looper playing oscillator={oscillatorConfig} />
```

Notice that these properties are passed as primitive values and not as an object like native oscillator properties.

e.g. `frequency` is a number instead of an object with a `value` property.

[Click here](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode) for more information about Web Audio API Oscillator.

## License

MIT Licensed. Copyright (c) Peter Sherhsov 2018.
