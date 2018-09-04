![alt text](https://user-images.githubusercontent.com/16524839/44939852-1c368b80-ad91-11e8-8e8f-d15a196f4c2e.png)

[![npm version](https://badge.fury.io/js/react-looper.svg)](https://badge.fury.io/js/react-looper)

Web Audio API based Looper component for React

- [x] - Connect your own `AudioContext` (or use the default one :robot:)
- [x] - Built-in oscillator as metronome (tick, tick, tick...:bomb:)
- [x] - Provide your own audio file as arrayBuffer (nsync_-_bye_bye_bye.mp3 :see_no_evil:)
- [x] - Loop your sound each X bars (cowbell each 4 bars :cow:)

# Installation and usage

```
yarn add react-looper
```

Simple metronome

```jsx
<Looper looping />
```

Different BPM and Frequency

```jsx
<Looper looping bpm={85} frequency={600} />
```
Play each 4 bars

```jsx
<Looper looping bpm={85} frequency={600} playEach={4} />
```

Play arrayBuffer

```jsx
<Looper looping bpm={85} playEach={4} source={MyLovelyAudioFile} />
```

Compose your loop

```jsx
<Looper looping bpm={85} source={kick} />
<Looper looping bpm={85} playEach={2} source={snare} />
<Looper looping bpm={85} playEach={0.5} source={hihat} />
```

## Props

| Name           | Type           | Default              | Description                          |
| :------------- | :------------- | :------------------- | :----------------------------------- |
| `audioContext` | `AudioContext` | `new AudioContext()` | AudioContext object                  |
| `looping`      | `boolean`      | false                | starts or stops your loop            |
| `source`       | `ArrayBuffer`  | undefined            | array buffer to play each iteration  |
| `bpm`          | `number`       | 120                  | sets the tempo of your loop          |
| `frequency`    | `number`       | 500                  | sets the frequency of the oscillator |
| `playEach`     | `number`       | undefined            | play sound each number bars          |
| `onIteration`  | `function`     | () => {}             | function to invoke each iteration    |

If `source` is not provided, Looper will play a short sine that can be used as a metronome

## License

MIT Licensed. Copyright (c) Peter Sherhsov 2018.
