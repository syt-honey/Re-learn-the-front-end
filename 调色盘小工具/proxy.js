let callbacks = new Map();
let reactives = new Map();
// 每个对象去调用 proxy 时会给它加一个缓存

let usedReactive = [];

// 如果要做一个完整的 reactive 需要将 proxy 中的所有的 hook 都要完整的考虑进去。
// Global_Objects/Proxy
// 还可以通过 defineProperty 实现

// 实现监听
// 目前的实现有着明显的性能问题：因为 callbacks 是一个全局的数组，每次去监听的时候都需要重新遍历一下这个全局的监听列表
// 实现深层的监听

function effect(callback) {
    usedReactive = [];
    callback();

    for(let reactivity of usedReactive) {
        let [obj, prop] = reactivity;
        if (!callbacks.has(obj)) {
            callbacks.set(obj, new Map());
        }

        if (!callbacks.get(obj).has(prop)) {
            callbacks.get(obj).set(prop, [])
        }

        callbacks.get(obj).get(prop).push(callback);
    }
}

function reactive(obj) {

    if (reactives.has(obj)) {
        return reactives.get(obj);
    }
    let proxy =  new Proxy(obj, {
        set(obj, prop, val) {
            console.log(obj, prop, val);
            obj[prop] = val;
            if (callbacks.get(obj) && callbacks.get(obj).get(prop)) {
                for(let callback of callbacks.get(obj).get(prop)) {
                    callback();
                }
            }
            return obj[prop];
        },
        get(obj, prop) {
            // 每次调用依赖过的 reactive 对象都将它们收集起来
            let has = false
            for(let [temObj, temProp] of usedReactive) {
                if (temProp === prop) {
                    has = true;
                }
            }

            if (!has) {
                usedReactive.push([obj, prop]);
            }

            if (typeof obj[prop] === 'object') {
                return reactive(obj[prop])
            }
            return obj[prop];
        }
    });

    reactives.set(obj, proxy);
    return proxy;
}
