export interface IEventSubscription {
    unsubscribe(): void;
}
export type EventData = {
    [key: string]: any;
}
export type EventHandler = (eventData: EventData) => void;

export interface IEventEmitter {
    on(eventName: string, handler: EventHandler): IEventSubscription;
    off(eventName: string, EventHandler): void;
    emit(eventName: string, data: EventData): void;
}