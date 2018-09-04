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

  /**
   * Initializes audioContext if its not provided in props
   * Loops if the looping prop if provided
   *
   * @memberof Looper
   */
  public componentDidMount() {
    const { audioContext, looping } = this.props;

    this.audioContext = audioContext || new AudioContext();

    if (looping) {
      this.loop();
    }
  }

  /**
   * Resets Looper's properties and clears the timeout
   *
   * @memberof Looper
   */
  public componentWillUnmount() {
    this.oscillator = undefined;
    this.audioBuffer = undefined;
    this.audioContext = undefined;
    this.audioBufferSourceNode = undefined;
    this.stop();
  }

  /**
   * Decodes an arrayBuffer to an audioBuffer if a new source is provided
   * Loops if there's no loop running and if the looping prop is provided
   * Stops if there's a loop running and if the looping prop is set to false
   *
   * @param {ILooperProps} { looping: loppingAlready }
   * @memberof Looper
   */
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

  /**
   * Creates an oscillator
   * Sets its frequency via the frequency prop
   * Starts and stops it after 300 milliseconds to act a metronome
   *
   * @private
   * @memberof Looper
   */
  private playOscillator = () => {
    const { audioContext } = this;

    this.oscillator = audioContext!.createOscillator();
    this.oscillator.connect(audioContext!.destination);
    this.oscillator!.frequency.value = this.props.frequency;
    this.oscillator!.start();
    this.oscillator!.stop(audioContext!.currentTime + SINE_DURATION);
  }

  /**
   * Creates an audioBufferSourceNode and starts it
   * Stops an audioBufferSourceNode if it already exists
   *
   * @private
   * @memberof Looper
   */
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

  /**
   * Plays a source or an oscillator at a provided bpm
   * Invokes the onIteration method each iteration
   * Skips the first iteration if the playEach prop is provided
   * Sets a new timeoutId to clear it later
   *
   * @private
   * @memberof Looper
   */
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

  /**
   * Stops an audioBufferSourceNode if exists
   * Clears the timeout and sets timeoutId to undefined
   *
   * @private
   * @memberof Looper
   */
  private stop = () => {
    if (this.audioBufferSourceNode) {
      this.audioBufferSourceNode.stop();
    }

    clearTimeout(this.timeoutId!);
    this.timeoutId = undefined;
  }
}
