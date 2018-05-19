class Voice {

  constructor(options) {

    this.audioContext = options.audioContext;

    this.output = this.audioContext.createGain();
    this.output.gain.setValueAtTime(0, this.audioContext.currentTime);

    //setup oscillator
    this.oscillator = audioContext.createOscillator();
    this.oscillator.start();

    //setup oscillator2
    this.oscillator2 = audioContext.createOscillator();
    //detune to make a lower pitch
    this.oscillator2.detune.setValueAtTime(-2400, 0);
    //make a square wave so you can hear it better
    this.oscillator2.type = "square";
    this.oscillator2.start();

    //setup ADSR
    this.envelope = new ADSREnvelope({
      audioContext
    });
    this.envelope.attack = 1;
    this.envelope.decay = 1;
    this.envelope.sustain = .1;
    this.envelope.release = 1;
    this.envelope.connect(this.output.gain);

    // //setup filter
    // this.filter = this.audioContext.createBiquadFilter();
    // this.filter.type = "lowpass";
    // this.filter.Q.setValueAtTime(30, this.audioContext.currentTime);
    // this.filter.frequency.setValueAtTime(20000, this.audioContext.currentTime);
    // this.filter.connect(this.output);

    //setup a second filter
    this.filter = this.audioContext.createBiquadFilter();
    this.filter.type = "lowshelf";
    this.filter.Q.setValueAtTime(30, this.audioContext.currentTime);
    this.filter.frequency.setValueAtTime(20000, this.audioContext.currentTime);
    this.filter.connect(this.output);

    this.oscillator.connect(this.filter);
    this.oscillator2.connect(this.filter);


    //setup filter LFO
    this.lfo = new LFO({
      audioContext: this.audioContext,
      frequency: .125
    });
    this.lfo.connect(this.filter.detune, -4800);
    this.lfo.start();
    this.lfo.depth.gain.setValueAtTime(0, this.audioContext.currentTime);

    this.envelope.connect(this.lfo.depth.gain);

    //listen for oscillator waveform selection
    const oscWaveformElement = document.querySelector("#osc-waveform");
    oscWaveformElement.addEventListener("change", (event) => {
      event.preventDefault();
      this.oscillator.type = event.target.value;
    });

    //listen for low frequency oscillator waveform selection
    const lfoWaveformElement = document.querySelector("#lfo-waveform");
    lfoWaveformElement.addEventListener("change", (event) => {
      event.preventDefault();
      this.lfo.oscillator.type = event.target.value;
    });

  }

  start(time = this.audioContext.currentTime) {

    this.envelope.start(time);
    this.lfo.start();

  }

  stop(time = this.audioContext.currentTime) {

    this.envelope.stop(time);
    this.lfo.start();

  }

}