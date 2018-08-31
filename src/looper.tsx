import { PureComponent } from "react";

interface LooperProps {
  bpm: number;
  looping: boolean;
  frequency: number;
  source?: ArrayBuffer;
  onIteration?: () => void;
  audioContext: AudioContext;
}

interface LooperState {
  timeoutId: number;
}

const SINE_DURATION = 0.03;
const DEFAULT_AUDIO_CONTEXT = new AudioContext();

const bpmToMs = (bpm: number) => Math.floor(60000 / bpm);

export default class Looper extends PureComponent<LooperProps, LooperState> {
  state = {
    timeoutId: 0
  };

  static defaultProps = {
    bpm: 120,
    frequency: 500,
    looping: false,
    audioContext: DEFAULT_AUDIO_CONTEXT
  };

  private oscillator: OscillatorNode | undefined;
  private audioBuffer: AudioBuffer | undefined;
  private audioBufferSourceNode: AudioBufferSourceNode | undefined;

  componentDidMount() {
    this.props.looping && this.loop();
  }

  componentWillUnmount() {
    this.oscillator = undefined;
    this.audioBuffer = undefined;
    this.audioBufferSourceNode = undefined;
    this.stop();
  }

  async componentDidUpdate({ looping: loppingAlready }: LooperProps) {
    const { looping: shouldLoop, source, audioContext } = this.props;

    // TODO: replace !this.audioBuffer with old/new arrayBuffer comparison
    //       to support auto update when source changes
    if (source && !this.audioBuffer) {
      this.audioBuffer = await audioContext.decodeAudioData(source!);
    }

    shouldLoop && !loppingAlready && this.loop();
    !shouldLoop && loppingAlready && this.stop();
  }

  private playOscillator = () => {
    const { audioContext } = this.props;

    this.oscillator = audioContext.createOscillator();
    this.oscillator.connect(audioContext.destination);
    this.oscillator!.frequency.value = this.props.frequency;
    this.oscillator!.start();
    this.oscillator!.stop(this.props.audioContext.currentTime + SINE_DURATION);
  };

  private playAudioBufferSourceNode = () => {
    const { audioContext } = this.props;

    if (this.audioBufferSourceNode) {
      this.audioBufferSourceNode.stop();
    }

    this.audioBufferSourceNode = audioContext.createBufferSource();
    this.audioBufferSourceNode.buffer = this.audioBuffer!;
    this.audioBufferSourceNode.connect(audioContext.destination);
    this.audioBufferSourceNode!.start(0);
  };

  private loop = () => {
    const { source } = this.props;

    source ? this.playAudioBufferSourceNode() : this.playOscillator();
    this.props.onIteration && this.props.onIteration();
    this.props.looping &&
      this.setState({
        // saves the timeout id to clear it on stop
        timeoutId: setTimeout(this.loop, bpmToMs(this.props.bpm))
      });
  };

  private stop = () => {
    if (this.audioBufferSourceNode) {
      this.audioBufferSourceNode.stop();
    }

    clearTimeout(this.state.timeoutId);
  };

  render() {
    return null;
  }
}
