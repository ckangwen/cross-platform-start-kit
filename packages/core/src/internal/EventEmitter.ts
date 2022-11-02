// ported from: https://github.com/developit/mitt/blob/main/src/index.ts
export type Keyof<T> = keyof T;

export type ValueOf<T> = T[keyof T];

// 监听的事件名的类型
export type EventType = string | symbol;
export type OriginEventPayloadMapping = Record<EventType, unknown>;

/**
 * 一般事件触发后调用的回调函数
 * @param event - 事件名
 * @example
 *  emitter.emit("foo", { a: "b" })
 *  emitter.on("foo", (e) => { console.log(e) }) // { a: "b" }
 */
export type Handler<T = unknown> = (payload?: T) => void;

/**
 * 通配事件`*`引起的回调函数
 * @param { string } type - 事件名
 * @param { any } payload - 事件参数
 */
export type WildcardHandler<T = Record<string, unknown>> = (
  type: Keyof<T>,
  payload?: ValueOf<T>,
) => void;

export type EventHandlerList<T = unknown> = Handler<T>[];
export type WildCardEventHandlerList<T = Record<string, unknown>> = WildcardHandler<T>[];
export type EventHandlerMap<EventPayloadMapping extends OriginEventPayloadMapping> = Map<
  Keyof<EventPayloadMapping> | "*",
  EventHandlerList<ValueOf<EventPayloadMapping>> | WildCardEventHandlerList<EventPayloadMapping>
>;

type GenericEventHandler<T> = Handler<ValueOf<T>> | WildcardHandler<T>;

export class EventEmitter<EventPayloadMapping extends OriginEventPayloadMapping> {
  all: EventHandlerMap<EventPayloadMapping> = new Map();

  constructor(eventMap?: EventHandlerMap<EventPayloadMapping>) {
    this.all = eventMap || new Map();
  }

  /**
   * 监听指定事件
   * @param { string } type - 需要监听的事件类型。该事件名属于EventEmitter泛型的键名之一。
   * @param { function } handler - 事件触发后的回调函数
   */
  on<T extends Keyof<EventPayloadMapping>>(
    type: T,
    handler: GenericEventHandler<EventPayloadMapping>,
  ) {
    if (!this.all.has(type)) {
      this.all.set(type, []);
    }
    const handlers: GenericEventHandler<EventPayloadMapping>[] = this.all.get(type)!;
    handlers.push(handler);
  }

  /**
   * 移除指定事件的监听
   * @param { string } type - 需要移除的事件类型
   * @param { function } handler - 需要移除的事件监听函数
   */
  off<Key extends keyof EventPayloadMapping>(
    type: Key,
    handler?: GenericEventHandler<EventPayloadMapping>,
  ) {
    const handlers: GenericEventHandler<EventPayloadMapping>[] | undefined = this.all.get(type);
    if (handlers) {
      if (handler) {
        const index = handlers.indexOf(handler);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
      } else {
        this.all.set(type, []);
      }
    }
  }

  /**
   * 触发指定事件
   * @param { string } type - 需要触发的事件名
   * @param { string } payload - 需要传递的数据
   */
  emit<Key extends keyof EventPayloadMapping>(type: Key, payload?: EventPayloadMapping[Key]) {
    let handlers = this.all.get(type);
    // 遍历执行此事件的所有监听函数
    if (handlers) {
      (handlers as EventHandlerList<EventPayloadMapping[keyof EventPayloadMapping]>)
        .slice()
        .forEach((handler) => {
          handler(payload);
        });
    }

    handlers = this.all.get("*");
    if (handlers) {
      (handlers as WildCardEventHandlerList<EventPayloadMapping>).slice().forEach((handler) => {
        handler(type, payload);
      });
    }
  }
}
