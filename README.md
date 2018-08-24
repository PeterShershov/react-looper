# React-Looper

Web Audio API based looper for React.js

[DEMO](looper-shmooper.com)

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
    isLooping: false
  };

  play = () =>
    this.setState({
      playing: !this.state.playing
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
    const { bpm, frequency, isLooping } = this.state;

    return (
      <Fragment>
        <PlayButton onClick={this.play}>PLAY</PlayButton>
        <FrequencyInput onChange={this.changeBpm} value={bpm} />
        <BPMInput onChange={this.changeFrequency} value={frequency} />
        <Looper
          onIteration={this.onIteration}
          bpm={bpm}
          frequency={frequency}
          looping={isLooping}
        />
      </Fragment>
    );
  }
}
```

## Available Props

| Name        | Type          | Default   | Description                          |
| :---------- | :------------ | :-------- | :----------------------------------- |
| `looping`   | `boolean`     | false     | Starts or stops your loop            |
| `source`    | `AudioBuffer` | undefined | Audio buffer to play each iteration  |
| `bpm`       | `number`      | 100       | Sets the tempo of your loop          |
| `frequency` | `number`      | 500       | Sets the frequency of the oscillator |
| `onIteration`    | `function`    | () => {}  | Function to invoke each iteration    |

If `source` is not provided, Looper will play a short sine that can be used as a metronome.

## License

MIT Licensed. Copyright (c) Peter Sherhsov 2018.
