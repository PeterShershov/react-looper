export interface IOscillator {
  duration?: number;
  detune?: number;
  frequency?: number;
  type?: OscillatorType;
  onEnded?: (audioScheduledSourceNode: AudioScheduledSourceNode, e: Event) => void;
}

export interface ILooperProps {
  audioContext?: AudioContext;
  bpm: number;
  looping: boolean;
  oscillator?: IOscillator;
  onIteration: () => void;
  playEach?: number;
  source?: ArrayBuffer;
}

export interface ILooperState {
  oscillator: IOscillator;
}
