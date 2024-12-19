export class Rerandom {
	#seed = 0;
	#p1 = 2654435761;
	#p2 = 2246822519;
	#p3 = 3266489917;
	#p4 = 668265263;
	#p5 = 374761393;

	constructor(seed=0){
		this.#seed = seed;
		this.p=[this.#p1,this.#p2,this.#p3,this.#p4,this.#p5];
		this.random = this._GetXxHash;
	}
	
	_RotateLeft(value, count) {
		return (value << count) | (value >>> (32 - count));
	};

	_CalcSubHash(value, read_value) {
		value += read_value * this.#p2;
		value = this._RotateLeft (value, 13);
		value *= this.#p1;
		return value;
	};

	_GetXxHash(...buf) {
		let h32;
		let index = 0;
		let len = buf.length;

		if (len >= 4) {
			let limit = len - 4;
			let v1 = this.#seed + this.#p1 + this.#p2;
			let v2 = this.#seed + this.#p2;
			let v3 = this.#seed + 0;
			let v4 = this.#seed - this.#p1;

			while (index <= limit) {
				v1 = this._CalcSubHash (v1, buf[index]);
				index++;
				v2 = this._CalcSubHash (v2, buf[index]);
				index++;
				v3 = this._CalcSubHash (v3, buf[index]);
				index++;
				v4 = this._CalcSubHash (v4, buf[index]);
				index++;
			}

			h32 = this._RotateLeft (v1, 1) + this._RotateLeft (v2, 7) + this._RotateLeft (v3, 12) + this._RotateLeft (v4, 18);
		}
		else {
			h32 = this.#seed + this.#p5;
		}

		h32 += len * 4;

		while (index < len) {
			h32 += buf[index] * this.#p3;
			h32 = this._RotateLeft (h32, 17) * this.#p4;
			index++;
		}

		h32 ^= h32 >>> 15;
		h32 *= this.#p2;
		h32 ^= h32 >>> 13;
		h32 *= this.#p3;
		h32 ^= h32 >>> 16;

		return (h32>>>0)/4294967295.0;
	};
}


