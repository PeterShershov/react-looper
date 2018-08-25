import { PureComponent } from "react";

interface LooperProps {
  looping: boolean;
  bpm: number;
  frequency: number;
  onIteration?: () => void;
  source?: ArrayBuffer;
}

interface LooperState {
  timeoutId: number;
}

const SINE_DURATION = 0.03;

const bpmToMs = (bpm: number) => Math.floor(60000 / bpm);

export default class Looper extends PureComponent<LooperProps, LooperState> {
  state = {
    timeoutId: 0
  };

  static defaultProps = {
    looping: false,
    bpm: 120,
    frequency: 500
  };

  private audioContext: AudioContext | undefined;
  private oscillator: OscillatorNode | undefined;
  private audioBufferSource: AudioBufferSourceNode | undefined;

  componentDidMount() {
    this.audioContext = new AudioContext();

    if (this.props.source) {
      this.createAudioSourceBuffer();
    }

    this.props.looping && this.loop();
  }

  componentWillUnmount() {
    this.stop();
    this.audioContext = undefined;
    this.oscillator = undefined;
  }

  componentDidUpdate({ looping: loppingAlready }: LooperProps) {
    const { looping: shouldLoop } = this.props;

    shouldLoop && !loppingAlready && this.loop();
    !shouldLoop && loppingAlready && this.stop();
  }

  private createOscillator = () => {
    this.oscillator = this.audioContext!.createOscillator();
    this.oscillator.connect(this.audioContext!.destination);
    this.oscillator!.frequency.value = this.props.frequency;
  };

  private createAudioSourceBuffer = () => {
    this.audioContext!.decodeAudioData(this.props.source!, buffer => {
      this.audioBufferSource = this.audioContext!.createBufferSource();
      this.audioBufferSource.buffer = buffer;
    });
  };

  private loop = () => {
    if (this.props.source) {
      this.audioBufferSource!.start();
    } else {
      // creating an oscillator each iteration is necessary
      // as oscillator.stop disconnects automatically
      this.createOscillator();
      this.oscillator!.start();
      this.oscillator!.stop(this.audioContext!.currentTime + SINE_DURATION);
      this.props.onIteration && this.props.onIteration();
		}

    this.props.looping &&
      this.setState({
        // saves the timeout id to clear it on stop
        timeoutId: setTimeout(this.loop, bpmToMs(this.props.bpm))
      });
  };

  private stop = () => clearTimeout(this.state.timeoutId);

  render() {
    return null;
  }
}
