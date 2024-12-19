import { Vector2 } from './class.vector.js'

// параметры объекта Constuct по умолчанию
const defaultOptions = {
    position: { x: 0, y: 0 },
    name: 'construct',
    color: '#000',
    lineWidth: 2,

};

export class Constuct {

    constructor(options = {}) {
        Object.assign(this, { ...defaultOptions, ...options });

        this.components = {};
        this.add('base', undefined, 0, { x: 0, y: 0 }, { x: 0, y: 0 }, 0);
        this.base = this.components['base'];
        this.base.position = this.position = new Vector2(this.position.x, this.position.y);
    }

    get x() {
        return this.base.position.x;
    }

    set x(value) {
        this.base.position.x = typeof value === 'number' ? value : 0;
    }

    get y() {
        return this.base.position.y;
    }

    set y(value) {
        this.base.position.y = typeof value === 'number' ? value : 0;
    }

    add(name, parentName, connect = 0, offset = { x: 0, y: 0 }, vector = { x: 0, y: 0 }, display) {
        if (!name || typeof name !== 'string') throw `Сomponent name must be a non-empty string in construct '${this.name}'`;
        if (this.components[name]) throw `Component '${name}' already exists in construct '${this.name}'`;

        this.components[name] = {
            name: name,
            connectScalar: connect,
            connect: new Vector2(0, 0, 'grad'),
            childrens: {},
            display
        };

        if (typeof offset.x === 'number' && typeof offset.y === 'number') {
            this.components[name].offset = new Vector2(offset.x, offset.y);
        } else if (typeof offset.a === 'number' && typeof offset.l === 'number') {
            this.components[name].offset = new Vector2(offset.a, offset.l, 'grad');
        } else if (typeof offset.r === 'number' && typeof offset.l === 'number') {
            this.components[name].offset = new Vector2(offset.r, offset.l, 'rad');
        } else {
            this.components[name].offset = new Vector2(0, 0, 'grad');
        }

        if (typeof vector.x === 'number' && typeof vector.y === 'number') {
            this.components[name].vector = new Vector2(vector.x, vector.y);
        } else if (typeof vector.a === 'number' && typeof vector.l === 'number') {
            this.components[name].vector = new Vector2(vector.a, vector.l, 'grad');
        } else if (typeof vector.r === 'number' && typeof vector.l === 'number') {
            this.components[name].vector = new Vector2(vector.r, vector.l, 'rad');
        } else {
            this.components[name].vector = new Vector2(0, 0, 'grad');
        }

        if (!this.base) {
            this.base = this.components[name];
            return;
        }

        this.angle = this.base.vector.angle;

        if (!parentName || typeof parentName !== 'string') throw `Сomponent parentName must be a non-empty string in construct '${this.name}'`;
        if (parentName === name) throw `Parent '${parentName}' name cannot be the same as component name '${name}' in construct '${this.name}'`;
        if (!this.components[parentName]) throw `Parent component '${parentName}' is epsent in construct '${this.name}'`;

        this.components[name].connect = this.components[parentName].vector.multiply(connect);
        this.components[parentName].childrens[name] = this.components[name];
    }

    rotate(name, deltaAngle) {
        if (!name || typeof name !== 'string') throw `Сomponent name must be a non-empty string in construct '${this.name}'`;
        if (!this.components[name]) throw `Parent component '${name}' is epsent in construct '${this.name}'`;

        const rotate = (component) => {
            if (component.name !== name) component.offset.rotate(deltaAngle);
            component.vector.rotate(deltaAngle);

            Object.values(component.childrens).forEach(item => {
                if (component.name === item.name) return;
                rotate(item)
            });
        }

        rotate(this.components[name]);
        this.angle = this.base.vector.angle;
    }

    rotateRad(name, deltaAngle) {
        if (!name || typeof name !== 'string') throw `Сomponent name must be a non-empty string in construct '${this.name}'`;
        if (!this.components[name]) throw `Parent component '${name}' is epsent in construct '${this.name}'`;

        const rotate = (component) => {
            if (component.name !== name) component.offset.rotateRad(deltaAngle);
            component.vector.rotateRad(deltaAngle);


            Object.values(component.childrens).forEach(item => {
                if (component.name === item.name) return;
                rotate(item)
            });
        }

        rotate(this.components[name]);
        this.angle = this.base.vector.angle;
    }

    update(dt) {
        const update = (parent, component) => {
            component.connect = parent.vector.multiply(component.connectScalar);
            component.position = parent.position.add(component.connect).add(component.offset);

            if (!component.stop && component.name === 'spine3') {
                component.stop = true;
                console.log(component)
            }

            Object.values(component.childrens).forEach(item => {
                if (component.name === item.name) return;
                update(component, item)
            });
        }

        Object.values(this.base.childrens).forEach(component => update(this.base, component));

        this.draw();
    }

    draw() {
        const draw = (component) => {
            Object.values(component.childrens).forEach(item => {
                if (component.name === item.name) return;
                draw(item);
            });

            if (!component.display) return;

            if (component.display.lineWidth) this.context.lineWidth = component.display.lineWidth;
            if (component.display.fillStyle) this.context.fillStyle = component.display.fillStyle;
            if (component.display.strokeStyle) this.context.strokeStyle = component.display.strokeStyle;

            if (component.display.type === 'arc') {
                this.context.beginPath();
                this.context.arc(
                    component.position.x,
                    component.position.y,
                    component?.display?.radius ?? 10,
                    0,
                    2 * Math.PI
                );
                if (component.display.fillStyle) this.context.fill();
                if (component.display.strokeStyle) this.context.stroke();
            } else if (component.display.type === 'rect') {
                this.context.beginPath();

                this.context.translate(component.position.x, component.position.y);
                this.context.rotate(component.vector.angle);

                if (component.display.fillStyle) this.context.fillRect(-component.display.width / 2, -component.display.height / 2, component.display.width, component.display.height);
                if (component.display.strokeStyle) this.context.strokeRect(-component.display.width / 2, -component.display.height / 2, component.display.width, component.display.height);
                this.context.setTransform(1, 0, 0, 1, 0, 0);
            }
        }
        draw(this.base);
    }
}
