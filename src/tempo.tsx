import React, { PureComponent } from "react";

import bpm2ms from "./bpm-to-ms";

interface TempoProps {
  onTick: (counter: number) => any;
}

export default class Tempo extends PureComponent<TempoProps> {
  state = {
    bpm: 100,
    frequency: 500,
    counter: 0,
    isPlaying: false
  };

  private audioContext = new AudioContext();

  private oscillator: OscillatorNode = this.audioContext.createOscillator();

  ping = (): void => {
    this.setState({ counter: this.state.counter++ });
    this.props.onTick(this.state.counter);
  };

  play = (): void => {
    this.oscillator.connect(this.audioContext.destination);
    this.oscillator.frequency.value = this.state.frequency;
    this.oscillator.start;
    this.oscillator.stop(this.audioContext.currentTime + 0.03);
    this.ping();
    this.state.isPlaying && setTimeout(this.play, bpm2ms(this.state.bpm));
  };

  stop = (): void => this.setState({ isPlaying: false, counter: 0 });

  setBpm = (bpm: number): void => this.setState({ bpm });

  setFrequency = (frequency: number): void => this.setState({ frequency });

  render() {
    return React.Children.map(this.props.children, child => {
      React.cloneElement(child as React.ReactElement<any>, {
        startTempo: this.play,
        stopTempo: this.stop,
        setBpm: this.setBpm,
        setFrequency: this.setFrequency,
        bpm: this.state.bpm
      });
    });
  }
}
