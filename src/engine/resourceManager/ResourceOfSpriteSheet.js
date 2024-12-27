import { Resource } from "./Resource.js";
import { SpriteFrames } from "../SpriteFrames.js";

export class ResourceOfSpriteSheet extends Resource {
	
	async _load(){
		return await new Promise(async (resolve, reject) => {
			const data = await this._loadSpriteSheetData();
			const image = await this._loadSpriteSheetImage(data);
			resolve(image);
		});
	}

	async _loadSpriteSheetData() {
		console.log("start spritesheet data load", this.url);
		return await fetch(this.url)
			.then(response => {
				console.log("done spritesheet data load", this.url);
				return response.json();
			});
	}

	async _loadSpriteSheetImage(data) {
		return await new Promise((resolve, reject) => {
			console.log("start spritesheet image load", this._getImageURL(data));
			const img = new Image();
			img.addEventListener('load', () => {
				console.log("done spritesheet image load", img.src);
				const frames = new SpriteFrames(img);
				frames.setAtlasData(data);
				resolve(frames);
			}, false);
			img.src = this._getImageURL(data);
		});
		
	}

	_getImageURL(atlasData) {
		if (!atlasData?.meta?.image) {
			throw new Error(`The atlas '${url}' does not contain information about the name of the image file.`);
		}
		const url = new URL(this.url);
		const list = url.pathname.split('/');
		list.pop();
		list.push(atlasData.meta.image)
		url.pathname = list.join('/');
		return url.href;
	}
}
