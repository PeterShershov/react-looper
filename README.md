![alt text](https://user-images.githubusercontent.com/16524839/44940038-b4814000-ad92-11e8-94d8-d1ff31d8944c.png)

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

| Name          | Type          | Default   | Description                          |
| :------------ | :------------ | :-------- | :----------------------------------- |
| `looping`     | `boolean`     | false     | starts or stops your loop            |
| `source`      | `ArrayBuffer` | undefined | array buffer to play each iteration  |
| `bpm`         | `number`      | 120       | sets the tempo of your loop          |
| `frequency`   | `number`      | 500       | sets the frequency of the oscillator |
| `playEach`    | `number`      | undefined | play sound each number bars          |
| `onIteration` | `function`    | () => {}  | function to invoke each iteration    |

If `source` is not provided, Looper will play a short sine that can be used as a metronome

## License

MIT Licensed. Copyright (c) Peter Sherhsov 2018.
