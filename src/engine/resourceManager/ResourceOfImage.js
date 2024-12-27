import { Resource } from "./Resource.js";

export class ResourceOfImage extends Resource {

	async _load() {
		return await new Promise((resolve, reject) => {
			console.log("start image load", this.url);

			const img = new Image();
			img.addEventListener('load', () => {
				console.log("done image load", this.url);
				resolve(img);
			}, false);
			img.src = this.url;
		});
	}
}
