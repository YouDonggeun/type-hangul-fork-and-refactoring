/**
 * type-hangul
 * https://github.com/SDuck4/type-hangul
 *
 * MIT License
 * Copyright (c) 2020 Chae SeungWoo
 */

import { generateTextProcess } from './text/generateTextProcess';
import type { Options, TypingTaskEvent, TypingEachTextEvent, TypingObserver, TextProcessResult } from './@typing';
import { merge } from './util/deepMerge';
import { dispatchEvent } from './util/dispatchEvent';
import { setDomValue } from './util/dom/setDomValue';
import { calucateIntervalDelay } from './util/humanize/calucateIntervalDelay';
import { interruptableDelay } from './util/interruptableDealy';
import { noop } from './util/noop';



// 기본 옵션
const DEFAULT_OPTIONS: Options = {
    sections: [],
    intervalType: 120,
    sectionIntervalType: 1000,
    humanize: undefined,
    hasEraseStep: true,
    repeat: true,
};

async function* generateTextWithInterrupt(options: Options) {
    let isInterrupted = false;
    let interruptHandler = noop;

    const mergeResponse = (
        data: TextProcessResult,
        type: TextProcessResult['type'] | 'before-typing' | 'after-typing' | 'before-erase' | 'after-erase',
    ) => {
        return {
            ...data,
            type,
            interrupt: () => {
                isInterrupted = true;
                interruptHandler()
            }
        }
    }
    for await (const response of generateTextProcess(options.sections, options.hasEraseStep)) {
        const { type } = response;
        if (isInterrupted) {
            return response;
        }
        switch (type) {
            case "typing":
            case "erase":
                const intervalDealy = calucateIntervalDelay(options);
                const dealyObject = interruptableDelay(intervalDealy);
                interruptHandler = dealyObject.interrupt;
                yield mergeResponse(response, `before-${type}`);
                await dealyObject.promise;
                yield mergeResponse(response, type);
                yield mergeResponse(response, `after-${type}`);
                break;
            case "typing-end":
                const inputEndDealy = interruptableDelay(options.sectionIntervalType);
                interruptHandler = inputEndDealy.interrupt;
                yield mergeResponse(response, type);
                await inputEndDealy.promise;
            default:
                yield mergeResponse(response, type);
        }
    }
}

async function* generateTextWithRepeat(
    options: Options
) {
    yield* generateTextWithInterrupt(options);
    if (options.repeat) {
        yield* (generateTextWithInterrupt(options) as ReturnType<typeof generateTextWithInterrupt>);
    }
}
// text가 타이핑되는 과정을 selector로 선택한 DOM의 텍스트로 출력함
export function type(target: HTMLElement, optionPayload: Partial<Options>) {

    // 기본 옵션 적용
    const options = merge(DEFAULT_OPTIONS, optionPayload) as Options;

    // 타이핑 인터벌 시작
    const startOption: TypingTaskEvent = {
        target,
        options,
    };
    //@TODO: side effect 로 변수가 강제로 있는게 사실 그리 보기좋진않은데... 흠...
    let interruptHandler = noop;
    const typingAction = async () => {
        dispatchEvent(target, 'th.startType', startOption)
        for await (const { type, text, step, interrupt, } of generateTextWithRepeat(options)) {
            const eventObject: TypingEachTextEvent = {
                ...startOption,
                typeChar: step,
                progress: text
            }
            interruptHandler = interrupt;
            switch (type) {
                case "typing":
                case "erase":
                    setDomValue(target, text);
                    break;
                case "before-typing":
                    dispatchEvent(target, 'th.beforeType', eventObject);
                    break;
                case "after-typing":
                    dispatchEvent(target, 'th.afterType', eventObject);
                    break;
            }
        }
        dispatchEvent(target, 'th.endType', startOption)
    }
    typingAction()
    return () => {
        interruptHandler();
    }
}

// 리엑트 를 위한 observe추가 및 loop기능 구현
export function observe(
    observer: TypingObserver,
    optionPayload: Partial<Options>
) {
    let interruptHandler = noop;
    const options = merge(DEFAULT_OPTIONS, optionPayload) as Options;
    const runner = async () => {
        for await (const { type, text, step, interrupt } of generateTextWithRepeat(options)) {
            interruptHandler = interrupt;
            switch (type) {
                case "typing":
                case "erase":
                    observer(text, step);
                    break;
            }
        }
    }
    runner();
    return () => {
        interruptHandler()
    }
}
export const TypeHangul = {
    type,
    observe
};

export default TypeHangul;
