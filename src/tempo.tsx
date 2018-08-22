import React, { PureComponent } from "react";

interface TempoProps {
  onTick: () => void;
  frequency: number;
  bpm: number;
  looping: boolean;
}

interface TempoState {
  intervalId: number;
}

export default class Tempo extends PureComponent<TempoProps, TempoState> {
  state = {
    intervalId: 0
  };

  static defaultProps = {
    bpm: 100,
    frequency: 500,
    looping: false
  };

  private audioContext: AudioContext | undefined;
  private oscillator: OscillatorNode | undefined;

  componentDidMount() {
    this.audioContext = new AudioContext();
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.connect(this.audioContext.destination);
    this.props.looping && this.play();
  }

  componentWillUnmount() {
    this.stop();
    this.audioContext = undefined;
    this.oscillator = undefined;
  }

  componentDidUpdate({
    frequency: prevFrequency,
    bpm: prevBpm,
    looping: isLoopingAlready
  }: TempoProps) {
    const {
      frequency: newFrequency,
      bpm: newBpm,
      looping: shouldLoop
    } = this.props;

    const shouldReset = newFrequency !== prevFrequency || newBpm !== prevBpm;

    !isLoopingAlready && shouldLoop && this.play();

    isLoopingAlready && !shouldLoop && this.stop();

    if (isLoopingAlready && shouldReset) {
      clearInterval(this.state.intervalId);
      this.loop();
    }
  }

  loop = () => {
    const intervalId = setInterval(this.play, bpmToMs(this.props.bpm));

    this.setState({
      intervalId
    });
  };

  play = (): void => {
    if (this.audioContext && this.oscillator) {
      this.oscillator.frequency.value = this.props.frequency;
      this.oscillator.start;
      this.oscillator.stop(this.audioContext.currentTime + 0.03);
      this.props.onTick && this.props.onTick();
    }
  };

  stop = (): void => {
    this.oscillator!.stop();
    clearInterval(this.state.intervalId);
  };

  render() {
    return null;
  }
}

function bpmToMs(bpm: number): number {
  return Math.floor(60000 / bpm);
}
