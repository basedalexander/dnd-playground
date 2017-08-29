import { EventHandler, IEventEmitter, IEventSubscription } from './event-emitter.interface';

export class EventSubscribtion implements IEventSubscription {
    constructor(
        private eventName: string,
        private handler: EventHandler,
        private eventEmitter: IEventEmitter) {

    }

    public unsubscribe(): void {
        this.eventEmitter.off(this.eventName, this.handler);
    }
}