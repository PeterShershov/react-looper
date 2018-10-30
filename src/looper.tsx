import { PureComponent } from "react";

import { ILooperProps, ILooperState } from "./types";

const bpmToMs = (bpm: number) => Math.floor(60000 / bpm);
const noop = () => undefined;

export default class Looper extends PureComponent<ILooperProps> {
  public static defaultProps = {
    bpm: 120,
    frequency: 500,
    looping: false,
    onIteration: noop,
  };

  public state: ILooperState = {
    oscillator: {
      detune: 0,
      duration: 0.03,
      frequency: 500,
      type: "sine",
    },
  };

  private audioBuffer: AudioBuffer | undefined;
  private audioBufferSourceNode: AudioBufferSourceNode | undefined;
  private audioContext: AudioContext | undefined;
  private oscillator: OscillatorNode | undefined;
  private timeoutId: NodeJS.Timer | undefined;

  public async componentDidMount() {
    const { audioContext, looping, oscillator } = this.props;

    this.audioContext = audioContext || new AudioContext();

    if (oscillator) {
      await this.updateOscillator();
    }

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
    oscillator: prevoscillator,
  }: ILooperProps) {
    const { looping: shouldLoop, oscillator, source } = this.props;
    const { audioContext } = this;

    if (source !== previousSource) {
      this.audioBuffer = await audioContext!.decodeAudioData(source!);
    }

    if (oscillator !== prevoscillator) {
      this.updateOscillator();
    }

    if (shouldLoop && !loppingAlready) {
      this.loop();
    } else if (!shouldLoop && loppingAlready) {
      this.stop();
    }
  }

  public render() {
    return null;
  }

  private playOscillator = () => {
    const { oscillator } = this.state;
    const { audioContext } = this;

    if (this.oscillator) {
      this.oscillator.stop();
    }

    this.oscillator = audioContext!.createOscillator();
    this.oscillator.connect(audioContext!.destination);
    this.oscillator.frequency.value = oscillator.frequency!;
    this.oscillator.detune.value = oscillator.detune!;
    this.oscillator.type = oscillator.type!;
    this.oscillator.start();
    this.oscillator.stop(audioContext!.currentTime + oscillator.duration!);
  }

  private updateOscillator = () => {
    this.setState({
      oscillator: {
        ...this.state.oscillator,
        ...this.props.oscillator,
      },
    });

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
