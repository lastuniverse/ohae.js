const coloredFrames = {};

export class Frames {
    #frame;
    #frameName = 'default';
    _tint;
    _brightness;
    _tintImage;

    constructor(image, data) {
        this.image = image;

        if (data) {
            this.setAtlasData(data);
        } else {
            this.#frame = this.getDefaultFrameData(this.image);

            this.frameDataHash = {
                default: this.#frame
            };

            this.frameDataList = [
                this.#frame
            ];

            this.width = this.image.width;
            this.height = this.image.height;
        }
    }

    getDefaultFrameData(image){
        return {
            name: 'default',
            frame: {
                x: 0,
                y: 0,
                w: image.width,
                h: image.height
            },
            rotated: false,
            trimmed: false,
            spriteSourceSize: {
                x: 0,
                y: 0,
                w: image.width,
                h: image.height
            },
            sourceSize: {
                w: image.width,
                h: image.height
            },
            pivot: {
                x: 0.5,
                y: 0.5
            }
        };
    }

    get tint() {
        return this._tint;
    }

    set tint(value) {
        if (this._tint == value) return;
        this._tint = value;
    }

    get brightness() {
        return this._brightness ?? 0.5;
    }

    set brightness(value) {
        if (!isFinite(value)) {
            this._brightness = undefined
            return;
        }
        value = Math.min(1, Math.max(0, value));
        if (this._brightness == value) return;
        this._brightness = value;
    }

    get frame() {
        return this.#frame;
    }

    set frame(value) {
        if (typeof value === 'number') {
            const frame = this.frameDataList[value];
            if (!frame) return;
            if (this.#frame === frame) return;
            this.#frame = frame;
            this.#frameName = frame.name;
            this.width = frame.frame.w;
            this.height = frame.frame.h;
        } else {
            this.frameName = value;
        }
    }

    get frameName() {
        return this.#frameName;
    }

    set frameName(value) {
        if (typeof value !== 'string') return;
        if (this.#frameName === value) return;
        const frame = this.frameDataHash[value];
        if (!frame) return;
        this.#frame = frame;
        this.#frameName = value;
        this.width = frame.frame.w;
        this.height = frame.frame.h;
    }

    setAtlasData(data) {
        this.frameDataHash = data.frames ?? data.frameDataHash;
        this.frameDataList = Object.keys(this.frameDataHash).map(key => {
            this.frameDataHash[key].name = key;
            return this.frameDataHash[key];
        });
        this.frame = 0;
    }

    draw(context, x, y, w, h) {
        const frame = this.#frame.frame;
        const isTinted = this._tint || isFinite(this._brightness);
        context.drawImage(
            this.getFrameImage(),
            isTinted ? 0 : frame.x,
            isTinted ? 0 : frame.y,
            frame.w, frame.h,
            x, y,
            w, h
        );
    }

    getFrameImage() {
        if (!this._tint && !this._brightness) return this.image;

        let tintedFrame = coloredFrames[this.image.src]?.[this.#frameName];
        if (tintedFrame && tintedFrame.tint === this._tint && tintedFrame.brightness === this._brightness) return tintedFrame.image;

        // Создаем временный холст
        const image = tintedFrame?.image ?? document.createElement('canvas');
        const context = tintedFrame?.context ?? image.getContext('2d');

        this._tintImage = image;

        tintedFrame = {
            image,
            context,
            tint: this._tint,
            brightness: this._brightness
        };


        coloredFrames[this.image.src] = coloredFrames[this.image.src] ?? {};
        coloredFrames[this.image.src][this.#frameName] = tintedFrame;

        // Рисуем изображение на временном холсте
        const frame = this.#frame.frame;
        image.width = frame.w;
        image.height = frame.h;

        context.drawImage(this.image,
            frame.x, frame.y,
            frame.w, frame.h,
            0, 0,
            frame.w, frame.h
        );

        // Накладываем цветовой оттенок
        if (this._tint) {
            context.globalCompositeOperation = 'source-atop';
            // context.globalCompositeOperation = 'multiply';
            context.fillStyle = this._tint;
            context.fillRect(0, 0, frame.w, frame.h);
        }

        // Определяем цвет и прозрачность для эффекта освещения
        if (this._brightness) {
            let overlayColor;
            if (this._brightness > 0.5) {
                // Для осветления используем белый цвет с прозрачностью, пропорциональной яркости
                overlayColor = `rgba(255, 255, 255, ${2 * (this._brightness - 0.5)})`;
            } else {
                // Для затемнения используем черный цвет с прозрачностью, пропорциональной обратной яркости
                overlayColor = `rgba(0, 0, 0, ${1 - this._brightness * 2})`;
            }

            // Накладываем цвет освещения
            context.globalCompositeOperation = 'source-atop';
            context.fillStyle = overlayColor;
            context.fillRect(0, 0, frame.w, frame.h);
        }

        return image;
    }
}
