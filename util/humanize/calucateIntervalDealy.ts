import type { Options } from "../../@typing";
import { _defaultHumanizeDealy } from "./defaultDealy";


// intervalType 계산 함수
export function _calucateIntervalDealy(options: Options) {
    if (!options.humanize) {
        return options.intervalType;
    }
    if (typeof options.humanize === 'number') {
        return _defaultHumanizeDealy(options.intervalType, options.humanize);
    }
    if (typeof options.humanize === 'function') {
        return options.humanize(options.intervalType);
    }
    throw new Error("'humanize' cannnot be " + typeof options.humanize);
}