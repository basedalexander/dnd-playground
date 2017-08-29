import { EventData, EventHandler, IEventSubscription, IEventEmitter } from './event-emitter.interface';
import { EventSubscribtion } from './event-subscribtion';

export class EventEmitter implements IEventEmitter {
    private subs: Map<string, EventHandler[]> = new Map();

    public on(eventName: string, handler: EventHandler): IEventSubscription {
        let eventSubs: EventHandler[] = this.subs.get(eventName);

        if (!eventSubs) {
            eventSubs = [];
        }

        eventSubs.push(handler);
        this.subs.set(eventName, eventSubs);

        return new EventSubscribtion(eventName, handler, this);
    }

    public off(eventName: string, handler: EventHandler): void {
        let subs: EventHandler[] = this.subs.get(eventName);

        if (subs) {
            let index: number = subs.indexOf(handler);
            subs.splice(index, 1);
        }
    }

    public emit(eventName: string, data: EventData): void {
        let subs: EventHandler[] = this.subs.get(eventName);

        if (subs) {
            subs.forEach(s => s(data));
        }
    }
}