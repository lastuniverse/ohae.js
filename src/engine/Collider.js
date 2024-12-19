// параметры объекта Collider по умолчанию
const defaultColliderOptions = {
    type: 'circle',
    x: 0,
    y: 0,
    radius: 0,
};

export class Collider {
    
    constructor(options = {}) {
        Object.assign(this, { ...defaultColliderOptions, ...options });
    }
}
