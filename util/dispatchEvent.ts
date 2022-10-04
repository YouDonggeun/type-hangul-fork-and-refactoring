import { EventRecord } from "../@typing";

export function _dispatchEvent<
    EventName extends keyof EventRecord,
>(
    target: HTMLElement, name: EventName, data: EventRecord[EventName]
) {
    return target.dispatchEvent(new CustomEvent(name, {
        detail: data
    }));
}