import ExtendEventEmitter from '../../tools/class.extend.event.emitter.mjs'

export class Mouse extends ExtendEventEmitter {
    x = 0;
    y = 0;
    buttons = {};
    touth = false;

    constructor(canvas) {
        super();
        this.canvas = canvas;

        const buttons = ['left', 'center', 'right'];

        window.oncontextmenu = e => false;

        this.canvas.addEventListener('mousedown', e => {
            this.buttons[buttons[e.button]] = true
            this.emit('down', buttons[e.button]);
        });

        this.canvas.addEventListener('mouseup', e => {
            this.buttons[buttons[e.button]] = false
            this.emit('up', buttons[e.button]);
        });

        this.canvas.addEventListener('mousemove', e => {
            this.x = e.pageX - e.target.offsetLeft;
            this.y = e.pageY - e.target.offsetTop;
            this.emit('move', this);
        });

        const toushStartHandle = e => {
            e = e.changedTouches[0];
            this.x = e.pageX - e.target.offsetLeft;
            this.y = e.pageY - e.target.offsetTop;
            this.touth = true;
            this.buttons.left = true;
            this.emit('down', 'left');
            this.emit('move', this);
        }

        this.canvas.addEventListener("touchstart", toushStartHandle, false);
        this.canvas.addEventListener("touchmove", toushStartHandle, false);
        this.canvas.addEventListener("touchend", e => {
            this.touth = false;
            this.buttons.left = false;
            this.emit('up', 'left');
        }, false);
        
        this.canvas.addEventListener("touchcancel", e => {
            this.touth = false;
            this.buttons.left = false;
            this.emit('up', 'left');
        }, false);
    }
}
