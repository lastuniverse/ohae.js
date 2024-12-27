import { ResourceManager } from './resourceManager/ResourceManager.js'
import ExtendEventEmitter from './events/ExtendEventEmitter.js'
import bus from '../../tools/EventsBus.js'
import { Loader } from './class.loader.js'
import { Timer } from './Timer.js'
import { ImageLoader } from './class.loader.image.js'
import { AudioLoader } from './class.loader.audio.js'
import { Mouse } from './Mouse.js'
import { Point } from './Point.js'
import { Group } from './Group.js'


export class GameCore extends ExtendEventEmitter {
    #scenes = {};
    #scenesList = [];

    constructor(width, height) {
        super();

        // общая шина событий
        this.bus = bus;

        // инициализация холста
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.context.scale(1, 1);

        this.canvas.id = 'canvas';
        this.canvas.style.zIndex = 8;
        this.canvas.style.position = 'absolute';

        var body = document.getElementsByTagName('body')[0];
        body.appendChild(this.canvas)

        this.resize(width, height);

        // инициализация мышки
        this.mouse = new Mouse(this.canvas);

        // инициализация мышки
        this.timer = new Timer();

        // инициализация лоадеров
        this.loader = new Loader();
        new ImageLoader(this.loader);
        new AudioLoader(this.loader);

        // инициализация менеджера ресурсов (потихоньку заменяем лоадеры])
        this.resourceManager = new ResourceManager();
        
        // инициализация сцены
        this.addScene('main');
        
        setTimeout(() => this.#onMustInit(), 0);
    }

    #onMustInit() {
        // this.loader.once('load', async (progress) => {
        //     await this.resourceManager.ready();
        //     this.#onLoad(progress)
        // });

        this.bus.emit('engine.init', this);
        this.emit('engine.init', this);

        this.bus.emit('engine.preload', this);
        this.emit('engine.preload', this);

        this.resourceManager.ready().then(()=>{
            this.#onLoad();
        });
    }

    #onLoad() {
        this.bus.emit('engine.create', this);
        this.emit('engine.create', this);
        this.ready = true;

        this.timer.create('engine.timer', 60);
        this.timer.on('engine.timer', timer => {
            this.#loop(timer);
        });
    }

    addScene(name, isActive = true) {
        if (typeof name !== 'string') throw `Name of scene must be a string`;
        if (this.#scenes[name]) throw `Scene whith name ${name} allready exists`;
        const scene = new Group(this, 0, 0);
        scene.name = name;
        this.#scenes[name] = scene;
        this.#scenesList.push(scene);
        if (isActive) this.setScene('main');

    }

    setScene(name) {
        if (typeof name !== 'string') throw `Name of scene must be a string`;
        if (!this.#scenes[name]) throw `Scene whith name ${name} is epsent`;
        this.scene = this.#scenes[name];
    }

    deleteScene(name) {
        if (typeof name !== 'string') throw `Name of scene must be a string`;
        if (!this.#scenes[name]) throw `Scene whith name ${name} is epsent`;
        if (this.#scenes[name] === this.scene) throw `Scene whith name ${name} is active now`;
        delete this.#scenes[name];
        this.#scenesList = Object.values(this.#scenes);
    }

    resize(width = Math.floor(window.innerWidth), height = Math.floor(window.innerHeight)) {
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    #loop(timer, time, frame) {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.width, this.height);

        this.emit('engine.update', timer);
        this.bus.emit('engine.update', this, timer);
        if (this.scene) {
            this.scene.update(timer);
            const state = {
                position: new Point(0),
                scale: new Point(1),
                pivot: new Point(0.5),
                rotate: 0,
            }
            this.scene.render(state);
        }
    }

    drawTest(color, x, y) {
        this.context.lineWidth = 3;
        this.context.fillStyle = '#000';
        this.context.strokeStyle = color;

        this.context.beginPath();
        this.context.arc(
            x, y,
            10,
            0, 2 * Math.PI
        );
        this.context.fill();
        this.context.stroke();

    }
}
