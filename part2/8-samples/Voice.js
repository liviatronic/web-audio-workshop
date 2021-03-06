class Voice {

  constructor(options) {

    this.audioContext = options.audioContext;

    this.output = this.audioContext.createGain();
    this.output.gain.setValueAtTime(0, this.audioContext.currentTime);

    //setup oscillator
    this.oscillator = audioContext.createOscillator();
    this.oscillator.start();

    //setup ADSR
    this.envelope = new ADSREnvelope({
      audioContext
    });
    this.envelope.attack = 1;
    this.envelope.decay = 1;
    this.envelope.sustain = .1;
    this.envelope.release = 3;
    this.envelope.connect(this.output.gain);

    //setup filter
    this.filter = this.audioContext.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.Q.setValueAtTime(30, this.audioContext.currentTime);
    this.filter.frequency.setValueAtTime(20000, this.audioContext.currentTime);
    this.filter.connect(this.output);

    // this.oscillator.connect( this.filter );

    //setup filter LFO
    this.lfo = new LFO({
      audioContext: this.audioContext
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

    this.buffers = null;

    this.bufferPlayer = new AudioBufferPlayer({
      audioContext: this.audioContext
    })

  }

  start(time = this.audioContext.currentTime) {

    if (this.buffers) {
      //this is where the sample gets called. Change second param for where the sample starts, or put random
      let bufferSource = this.bufferPlayer.start(this.buffers.get(0), 0);
      bufferSource.connect(this.filter);
    }

    this.envelope.start(time);

  }

  stop(time = this.audioContext.currentTime) {

    this.envelope.stop(time);

  }

}