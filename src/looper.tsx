import { PureComponent } from "react";

export interface ILooperProps {
  audioContext?: AudioContext;
  bpm: number;
  frequency: number;
  looping: boolean;
  onIteration: () => void;
  playEach?: number;
  source?: ArrayBuffer;
}

const bpmToMs = (bpm: number) => Math.floor(60000 / bpm);
const noop = () => undefined;
const SINE_DURATION = 0.03;

export default class Looper extends PureComponent<ILooperProps> {
  public static defaultProps = {
    bpm: 120,
    frequency: 500,
    looping: false,
    onIteration: noop,
  };

  private audioBuffer: AudioBuffer | undefined;
  private audioBufferSourceNode: AudioBufferSourceNode | undefined;
  private audioContext: AudioContext | undefined;
  private oscillator: OscillatorNode | undefined;
  private timeoutId: NodeJS.Timer | undefined;

  public componentDidMount() {
    const { audioContext, looping } = this.props;

    this.audioContext = audioContext || new AudioContext();

    if (looping) {
      this.loop();
    }
  }

  public componentWillUnmount() {
    this.oscillator = undefined;
    this.audioBuffer = undefined;
    this.audioContext = undefined;
    this.audioBufferSourceNode = undefined;
    this.stop();
  }

  public async componentDidUpdate({
    looping: loppingAlready,
    source: previousSource,
  }: ILooperProps) {
    const { looping: shouldLoop, source } = this.props;
    const { audioContext } = this;

    if (source !== previousSource) {
      this.audioBuffer = await audioContext!.decodeAudioData(source!);
    }

    if (shouldLoop && !loppingAlready) {
      this.loop();
    }

    if (!shouldLoop && loppingAlready) {
      this.stop();
    }
  }

  public render() {
    return null;
  }

  private playOscillator = () => {
    const { audioContext } = this;

    this.oscillator = audioContext!.createOscillator();
    this.oscillator.connect(audioContext!.destination);
    this.oscillator!.frequency.value = this.props.frequency;
    this.oscillator!.start();
    this.oscillator!.stop(audioContext!.currentTime + SINE_DURATION);
  }

  private playAudioBufferSourceNode = () => {
    const { audioContext } = this;

    if (this.audioBufferSourceNode) {
      this.audioBufferSourceNode.stop();
    }

    this.audioBufferSourceNode = audioContext!.createBufferSource();
    this.audioBufferSourceNode.buffer = this.audioBuffer!;
    this.audioBufferSourceNode.connect(audioContext!.destination);
    this.audioBufferSourceNode!.start(0);
  }

  private loop = () => {
    const { bpm, source, playEach, looping, onIteration } = this.props;

    if (!this.timeoutId && playEach) {
      onIteration();
    } else {
      source ? this.playAudioBufferSourceNode() : this.playOscillator();
      onIteration();
    }

    if (looping) {
      const ms = playEach ? bpmToMs(bpm) * playEach : bpmToMs(bpm);
      this.timeoutId = setTimeout(this.loop, ms);
    }
  }

  private stop = () => {
    if (this.audioBufferSourceNode) {
      this.audioBufferSourceNode.stop();
    }

    clearTimeout(this.timeoutId!);
    this.timeoutId = undefined;
  }
}
