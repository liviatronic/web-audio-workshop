//set AudioContext class for compatibility
let AudioContext = window.AudioContext || window.webkitAudioContext;

//create audio context
const audioContext = new AudioContext();

//setup oscillator
const oscillator = audioContext.createOscillator();
oscillator.type = "sine";
//440 is the frequency of an A key
oscillator.frequency.value = "440";
//every step is 100 cents, so this is two octaves down
oscillator.detune.value = "-2400"; //cents
oscillator.start();
//.connect kind of acts like a wire. the destination is the speakers
oscillator.connect(audioContext.destination);
//first argument is the frequency, second argument tells it to start playing in 5 seconds after loading
oscillator.frequency.setValueAtTime(1760, audioContext.currentTime + 5)

function setup() {

  //resume web audio on first click for Chrome autoplay rules
  function clickHandler() {
    audioContext.resume();
    document.body.removeEventListener("click", clickHandler);
  }
  document.body.addEventListener("click", clickHandler);

  //create p5 canvas
  createCanvas(windowWidth, windowHeight);

}