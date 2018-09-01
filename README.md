![alt text](https://user-images.githubusercontent.com/16524839/44939852-1c368b80-ad91-11e8-8e8f-d15a196f4c2e.png)
[![npm version](https://badge.fury.io/js/react-looper.svg)](https://badge.fury.io/js/react-looper)
Web Audio API based Looper component for React

- [x] - Connect your own `AudioContext` (or use the default one 🤖)
- [x] - Built-in oscillator as metronome (tick, tick, tick...💣)
- [x] - Loop your audio file each X bars (just provide the arrayBuffer 👍)

# Installation and usage

```
yarn add react-looper
```

```jsx
import Looper from "react-looper";

class MyPlayer extends PureComponent {
  state = {
    bpm: 120,
    frequency: 500,
    isPlaying: false
  };

  play = () =>
    this.setState({
      isPlaying: true
    });

  stop = () =>
    this.setState({
      isPlaying: false
    });

  changeBpm = e => {
    const bpm = e.target.value;
    this.setState({ bpm });
  };

  changeFrequency = e => {
    const frequency = e.target.value;
    this.setState({ frequency });
  };

  onIteration = () => {
    // do stuff
  };

  setSource = source => this.setState({ source });

  render() {
    const { bpm, source, isPlaying, frequency } = this.state;

    return (
      <Fragment>
        <AudioUpload onChange={this.setSource} />
        <FrequencyInput onChange={this.changeFrequency} value={frequency} />
        <BPMInput onChange={this.changeBpm} value={bpm} />

        <PlayButton onClick={this.play}>PLAY</PlayButton>
        <StopButton onClick={this.stop}>STOP</StopButton>

        <Looper
          bpm={bpm}
          playEach={4}
          source={source}
          looping={isPlaying}
          frequency={frequency}
          onIteration={this.onIteration}
        />
      </Fragment>
    );
  }
}
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
