export type PropertyValue = string | number | boolean;
export type Properties = { [key: string]: PropertyValue | PropertyValue[] };

export interface Tracker {
    track(eventName: string, properties: Properties): void;
}
