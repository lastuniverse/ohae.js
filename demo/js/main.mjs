import { Game, Keyboard } from './src/engine/index.mjs'
import { World } from './game/class.world.mjs'
import { Tank } from './game/class.tank.mjs'

const game = new Game();
game.pause = false;

// инициализация
game.once('engine.init', () => {
    console.log('engine.init');
    game.loader.baseURL = window.location.href;
});

// предзагрузка
game.once('engine.preload', () => {
    console.log('engine.preload');

    game.loader.on('progress', progress => {
        console.log('progress', `${progress.count}/${progress.amount}`);
    });

    game.loader.once('load', progress => {
        console.log('load', `${progress.count}/${progress.amount}`);
    });
});

// создание игровых объектов
game.once('engine.create', () => {
    console.log('engine.create');

    game.world = new World(game, 256, 256);
    game.tank = new Tank(game, game.world, 200, 0);

    game.world.setFocus(game.tank);

    window.addEventListener("wheel", e => {
        e = e || window.event;

        var delta = e.deltaY || e.detail || e.wheelDelta;

        const minScale = 0.5;
        const maxScale = 2.0;
        if (delta > 0 && game.world.scale.x > minScale) {
            const ds = game.world.scale.x - minScale;
            game.world.scale.add(-(ds > 0.05 ? 0.05 : ds));
        } else if (delta < 0 && game.world.scale.x < maxScale) {
            game.world.scale.add(0.05);
        }

    });

    game.keyboard = new Keyboard({
        'W': (status, key) => {
            if (status === 'press') game.tank.moving = 1;
            else if (status === 'up') game.tank.moving = 0;
        },
        'S': (status, key) => {
            if (status === 'press') game.tank.moving = -1;
            else if (status === 'up') game.tank.moving = 0;
        },
        'A': (status, key, timer) => {
            if (status !== 'press') return
            game.tank.rotate -= game.tank.options.bodyRotateSpeed * timer.deltaTime;
        },
        'D': (status, key, timer) => {
            if (status !== 'press') return
            game.tank.rotate += game.tank.options.bodyRotateSpeed * timer.deltaTime;
        }
    }, this);

    game.keyboard.start();
});

// обновление
game.on('engine.update', (timer) => {
    if (game.pause) return;
    if (!game.tank) return;
    game.keyboard.update(timer);

    game.tank.target = {
        x: game.mouse.x,
        y: game.mouse.y,
    };

    if (game.mouse.buttons.left) {
        game.tank.fire();
    }
});
