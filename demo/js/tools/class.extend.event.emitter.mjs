import comparePaths from './tool.compare.path.mjs'

/**
 * класс ExtendEventEmitter - упрощенный вариант EventEmitter-а из NodeJs но имеющий 
 * при этом существенное дополнение - в именах событий поддерживаются простые шаблоны,
 * что позволяет более гибко устанавливать обработчики событий, и вызывать их.
 * Пример ниже дает представление о возможностях использования данных шаблонов:
 * ```
 *  'aaa'       === 'aaa'
 *  'aaa'       !== 'bbb'
 *  'aaa.bbb'   === 'aaa.bbb'
 *  'aaa.bbb'   !== 'aaa.ccc'
 *  'aaa.*'     === 'aaa'
 *  'aaa.*'     === 'aaa.*'
 *  'aaa.*'     === 'aaa.bbb'
 *  'aaa.*.ccc' !== 'aaa'
 *  'aaa.*.ccc' === 'aaa.*'
 *  'aaa.*.ccc' !== 'aaa.bbb'
 *  'aaa.*.*'   === 'aaa.bbb'
 *  'aaa.*.ccc' === 'aaa.bbb.*'
 *  'aaa.*.ccc' === 'aaa.bbb.ccc'
 *  '*'         === 'aaa'
 *  '*'         === 'aaa.bbb'
 *  '*'         === 'aaa.bbb.ccc'
 * ```
 */
export default class ExtendEventEmitter {
    /**
     * This callback is displayed as part of the MyClass class.
     * @callback ExtendEventEmitter~FuncCallback
     * @param {any} params любые аргументы (функция примет те аргументы, которые были переданы методу {@link ExtendEventEmitter#emit ExtendEventEmitter.emit()} начиная со второго параметра)
     */

    /**
     * @constructor
     * @param {boolean} isAsync - принимет значения true и false. По умолчанию false
     */
    constructor(isAsync) {
        this.__isAsync = isAsync;
        this.__e = {};
        this.splitter = /[\\\/\.]/;//'.'
    }

    /**
     * Производит поиск обработчиков с соответсвующим шаблоном пути.
     * Принцип сравнения шаблонов раскрывает следующий пример
     * ```
     *  'aaa'       === 'aaa'
     *  'aaa'       !== 'bbb'
     *  'aaa.bbb'   === 'aaa.bbb'
     *  'aaa.bbb'   !== 'aaa.ccc'
     *  'aaa.*'     === 'aaa'
     *  'aaa.*'     === 'aaa.*'
     *  'aaa.*'     === 'aaa.bbb'
     *  'aaa.*.ccc' !== 'aaa'
     *  'aaa.*.ccc' === 'aaa.*'
     *  'aaa.*.ccc' !== 'aaa.bbb'
     *  'aaa.*.*'   === 'aaa.bbb'
     *  'aaa.*.ccc' === 'aaa.bbb.*'
     *  'aaa.*.ccc' === 'aaa.bbb.ccc'
     *  '*'         === 'aaa'
     *  '*'         === 'aaa.bbb'
     *  '*'         === 'aaa.bbb.ccc'
     * ```
     * @param {string} eventName 
     * @returns {array} список обработчиков событий, положительно прошедших проверку
     */
    getListeners(eventName) {
        const path1 = eventName.split(this.splitter).filter(a => a);

        const list = Object.values(this.__e).reduce((acc, item) => {
            if (comparePaths(path1, item.path)) acc.push(...item.listeners);
            return acc;
        }, []);
        return list;
    }

    /** @lends ExtendEventEmitter.prototype */
    /**
     * Устанавливает постоянный обработчик `listener` события `eventName`
     * @param  {String}   eventName    название события
     * @param  {ExtendEventEmitter~FuncCallback} listener обработчик события
     * @param  {object} context контекст, в котором будет вызван обработчик события
     * 
     * @returns {Function} установленный обработчик события
     */
    on(eventName, listener, context) {
        if (typeof listener !== 'function') return;
        if (!context) context = null;

        if (typeof this.__e[eventName] !== 'object') {
            this.__e[eventName] = {
                path: eventName.split(this.splitter).filter(a => a),
                listeners: [],
            };
        }
        this.__e[eventName].listeners.push({ listener: listener, context: context });
        return listener;
    }

    /**
     * Удаляет обработчик listener события eventName
     *
     * @param  {String}   eventName    название события
     * @param  {Function} listener обработчик события
     */
    removeListener(eventName, listener) {
        const list = this.getListeners(eventName);

        if (!Array.isArray(list))
            return;

        const idx = list.findIndex(function (item) {
            return listener === item.listener;
        }, this);

        if (idx < 0)
            return;

        list.splice(idx, 1);

        if (!list.length)
            delete this.__e[eventName];
    }

    /**
     * Создает событие event вызывая все зарегестрированные для него обработчики
     *
     * @param  {String}   eventName    название события
     * @param  {any} arguments  аргументы для обработчиков событий
     */
    emit(eventName, ...args) {
        const list = this.getListeners(eventName);

        if (!Array.isArray(list))
            return;

        if (this.__isAsync) {
            list.slice(0).forEach(function (item) {
                setImmediate(function () {
                    item.listener.apply(item.context, args);
                });
            });
        } else {
            list.slice(0).forEach(function (item) {
                item.listener.apply(item.context, args);
            });
        }
    }

    /**
     * Устанавливает одноразовый обработчик listener события eventName
     *
     * @param  {String}   eventName    название события
     * @param  {ExtendEventEmitter~FuncCallback} listener обработчик события
     * @param  {object} context контекст, в котором будет вызван обработчик события
     * 
     * @returns {Function} установленный обработчик события
     */
    once(eventName, listener, context) {
        if (!context) context = null;
        const g = (...args) => {
            this.removeListener(eventName, g);
            listener.apply(context, args);
        };
        this.on(eventName, g);
        return listener;
    }
}
