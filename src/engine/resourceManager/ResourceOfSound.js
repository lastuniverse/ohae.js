import { Resource } from "./Resource.js";
import { audioContext, Sound } from "../Sound.js";

export class ResourceOfSound extends Resource {

	async _load() {
		if (this._isDataInited) return this._data;
		this._data = await this._loadSound();
		return this._data;		
	}

	async _loadSound() {
		const data = new Promise((resolve, reject) => {
			console.log("start sound load", this._url);
			fetch(this._url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(async audioBuffer => {
				console.log("done sound load", this._url);
				const sound = new Sound(audioBuffer);
				resolve(sound);
            });
		});
		return data;
	}
}
