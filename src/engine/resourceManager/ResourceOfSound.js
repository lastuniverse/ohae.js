import { Resource } from "./Resource.js";
import { audioContext, Sound } from "../Sound.js";

export class ResourceOfSound extends Resource {

	async _load(){
		return await new Promise((resolve, reject) => {
			console.log("start sound load", this.url);
			fetch(this.url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(async audioBuffer => {
				console.log("done sound load", this.url);
				const sound = new Sound(audioBuffer);
				resolve(sound);
            });
		});
	}
}
