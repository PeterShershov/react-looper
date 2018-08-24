import React, { PureComponent } from "react";

interface LooperProps {
  looping: boolean;
  source?: AudioBuffer;
  bpm: number;
  frequency: number;
  onIteration?: () => void;
}

interface LooperState {
  intervalId: number;
}

const SINE_DURATION = 0.03;

const bpmToMs = (bpm: number) => Math.floor(60000 / bpm);

export default class Looper extends PureComponent<LooperProps, LooperState> {
  state = {
    intervalId: 0
  };

  static defaultProps = {
    looping: false,
    bpm: 120,
    frequency: 500
  };

  private audioContext: AudioContext | undefined;
  private oscillator: OscillatorNode | undefined;

  componentDidMount() {
    this.audioContext = new AudioContext();
    this.props.looping && this.loop();
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
  }: LooperProps) {
    const {
      frequency: newFrequency,
      bpm: newBpm,
      looping: shouldLoop
    } = this.props;
    const shouldReset = newFrequency !== prevFrequency || newBpm !== prevBpm;

    !isLoopingAlready && shouldLoop && this.loop();
    isLoopingAlready && !shouldLoop && this.stop();

    if (isLoopingAlready && shouldReset) {
      clearInterval(this.state.intervalId);
      this.loop();
    }
  }

  private createOscillator = () => {
    if (this.audioContext) {
      this.oscillator = this.audioContext.createOscillator();
      this.oscillator.connect(this.audioContext.destination);
    }
  };

  private loop = () => {
    this.play();
    const intervalId = setInterval(this.play, bpmToMs(this.props.bpm));

    this.setState({
      intervalId
    });
  };

  private play = () => {
    if (this.audioContext && !this.props.source) {
      // creating an oscillator each iteration is necessary
      // as oscillator.stop disconnects automatically 
      this.createOscillator();  
      this.oscillator!.frequency.value = this.props.frequency;
      this.oscillator!.start();
      this.oscillator!.stop(this.audioContext.currentTime + SINE_DURATION);

      this.props.onIteration && this.props.onIteration();
    }
  };

  private stop = () => {
    clearInterval(this.state.intervalId);
  };

  render() {
    return null;
  }
}
