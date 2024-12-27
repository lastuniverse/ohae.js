import { Resource } from "./Resource.js";

export class ResourceOfImage extends Resource {

	async _load() {
		return this._data = this._data ?? this._loadImage();
	}

	async _loadImage() {
		const data = new Promise((resolve, reject) => {
			console.log("start image load", this._url);

			const img = new Image();
			img.addEventListener('load', () => {
				console.log("done image load", this._url);
				resolve(img);
			}, false);
			img.src = this._url;
		});
		return data;
	}
}
