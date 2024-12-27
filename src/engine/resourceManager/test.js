import { ResourceNamespace } from "./ResourceNameSpace.js";
import { ResourceManager } from "./ResourceManager.js";
import { Resource } from './Resource.js';
import { ResourceOfImage } from "./ResourceOfImage.js";
import { ResourceOfSpriteSheet } from "./ResourceOfSpriteSheet.js";
import { ResourceOfSound } from "./ResourceOfSound.js";

const url = new URL(window.location);
url.pathname = url.pathname.replace(/\/[^\/]*$/,'');

ResourceManager.setBaseURL(url.href);
ResourceManager.addResourceType(ResourceManager.DEFAULT_RESOURCE_TYPE, Resource);
ResourceManager.addResourceType('image', ResourceOfImage);
ResourceManager.addResourceType('spritesheet', ResourceOfSpriteSheet);
ResourceManager.addResourceType('sound', ResourceOfSound);

const resourceManager = new ResourceManager();


resourceManager.addNamespace('preloader', true, false);
resourceManager.addResource('preloader','clouds', '/sprites/preloader/atlas.clouds.v2.json', 'spritesheet');
resourceManager.addResource('preloader','bar', '/sprites/preloader/bar.png', 'image');
resourceManager.addResource('preloader','background', '/sprites/preloader/preloader.background.jpg', 'image');
resourceManager.addResource('preloader','logo', '/sprites/preloader/preloader.logo.png', 'image');
resourceManager.addResource('preloader','ambient', '/sounds/snd_main_bgm_v1.mp3', 'sound');

const sound = await resourceManager.getResource('preloader', 'ambient');
sound.play();

console.log('\n>>> start loading resources for preloader');
await resourceManager.ready('preloader');
console.log('>>> done loading resources for preloader');


resourceManager.addNamespace('game_field', false, false);
resourceManager.addResource('game_field','desert', '/sprites/game/desert.json', 'spritesheet');

resourceManager.addNamespace('tanks', true, false);
resourceManager.addResource('tanks','explode', '/sprites/game/assets.explode.json', 'spritesheet');
resourceManager.addResource('tanks','tank_01', '/sprites/game/tanks/tank_01.json', 'spritesheet');
resourceManager.addResource('tanks','gunflash', '/sprites/game/assets.gunflash.json', 'spritesheet');
resourceManager.addResource('tanks','shoot', '/sounds/shoot.mp3', 'sound');

resourceManager.addNamespace('game_resources', true, false);
resourceManager.addNamespaceResources('game_resources', 'game_field');
resourceManager.addNamespaceResources('game_resources', 'tanks');

console.log("\n>>> start loading resources for game");
await resourceManager.ready('game_resources');
console.log(">>> done loading resources for game");

