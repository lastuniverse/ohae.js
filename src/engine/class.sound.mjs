const AudioContext = window.AudioContext || window.webkitAudioContext;
if (AudioContext === undefined) throw 'AudioContext not supported in your browser'

export const audioContext = new AudioContext();

class GlobalAudio {
    #volume = 1;
    #mute = false;

    constructor() {
        this.gainNode = audioContext.createGain();
        this.gainNode.connect(audioContext.destination);
        this.volume = 0.05;
    }

    mute() {
        if (this.#mute) return;
        this.gainNode.gain.value = 0;
    }

    unmute() {
        if (!this.#mute) return;
        this.gainNode.gain.value = this.#volume;
    }

    get volume() {
        return this.gainNode.gain.value;
    }
    
    set volume(value) {
        this.#volume = value;
        if (this.#mute) return;
        this.gainNode.gain.value = value;
    }

}
export const audio = new GlobalAudio();

export class Sound {

    constructor(buffer) {
        this.buffer = buffer;
        this.gainNode = audioContext.createGain();
        this.gainNode.connect(audio.gainNode);
    }

    play(volume = 1) {
        this.source = audioContext.createBufferSource();
        this.source.buffer = this.buffer;

        this.source.connect(this.gainNode);

        this.gainNode.gain.value = volume;

        this.source.start();
    }

    stop() {
        this.source.stop();
    }
}
