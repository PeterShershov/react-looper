# React-Looper

[![npm version](https://badge.fury.io/js/react-looper.svg)](https://badge.fury.io/js/react-looper)

Play an audio source or a sine wave in a loop

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

  render() {
    const { bpm, frequency, isPlaying } = this.state;

    return (
      <Fragment>
        <PlayButton onClick={this.play}>PLAY</PlayButton>
        <StopButton onClick={this.stop}>STOP</StopButton>
        <FrequencyInput onChange={this.changeBpm} value={bpm} />
        <BPMInput onChange={this.changeFrequency} value={frequency} />
        
        <Looper
          onIteration={this.onIteration}
          frequency={frequency}
          looping={isPlaying}
          bpm={bpm}
        />

      </Fragment>
    );
  }
}
```

## Available Props

| Name          | Type          | Default   | Description                                               |
| :------------ | :------------ | :-------- | :-------------------------------------------------------- |
| `looping`     | `boolean`     | false     | starts or stops your loop                                 |
| `source`      | `AudioBuffer` | undefined | audio buffer to play each iteration - NOT IMPLEMENTED YET |
| `bpm`         | `number`      | 120       | sets the tempo of your loop                               |
| `frequency`   | `number`      | 500       | sets the frequency of the oscillator                      |
| `onIteration` | `function`    | () => {}  | function to invoke each iteration                         |

If `source` is not provided, Looper will play a short sine that can be used as a metronome

## License

MIT Licensed. Copyright (c) Peter Sherhsov 2018.
