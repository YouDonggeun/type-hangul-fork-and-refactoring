import type { Options } from "../../@typing";
import { defaultHumanizeDealy } from "./defaultDelay";


// intervalType 계산 함수
export function calucateIntervalDelay(options: Options) {
    if (!options.humanize) {
        return options.intervalType;
    }
    if (typeof options.humanize === 'number') {
        return defaultHumanizeDealy(options.intervalType, options.humanize);
    }
    if (typeof options.humanize === 'function') {
        return options.humanize(options.intervalType);
    }
    throw new Error("'humanize' cannnot be " + typeof options.humanize);
}