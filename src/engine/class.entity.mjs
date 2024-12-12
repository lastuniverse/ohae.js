import { Collider } from './class.collider.mjs'

// параметры объекта Entity по умолчанию
const defaultEntityOptions = {
    x: 10,
    y: 10,
    direction: Math.PI / 4,
    rotation: Math.PI / 4,
    speed: 80,
    size: 20,
    color: '#f00',
    lineWidth: 3,
};

export class Entity {

    constructor(options = {}) {
        Object.assign(this, { ...defaultEntityOptions, ...options });
        this.collider = new Collider({
            radius: Math.hypot(this.size / 2, this.size / 2),
        });

    }

    update(deltatime) {
        var mx = this.speed * Math.cos(this.direction);
        var my = this.speed * Math.sin(this.direction);
        this.x = this.x + mx * (deltatime / 1000);
        this.y = this.y + my * (deltatime / 1000);
        this.draw();
    }

    draw() {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
}

