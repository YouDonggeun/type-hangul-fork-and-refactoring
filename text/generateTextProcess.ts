import { assemble } from "hangul-js";
import type { TextProcessResult } from "../@typing";
import { disassembleWordProcess } from "./disassembleWordProcess";

export const generatorResult = (
    type: TextProcessResult['type'],
    text: TextProcessResult['text'],
    step: TextProcessResult['step']
): TextProcessResult => {
    return {
        type,
        text,
        step
    }
}
export function* generateTextProcess(
    sections: string[],
    hasEraseStep: boolean
) {
    for (let sectionKey = 0; sectionKey < sections.length; sectionKey++) {
        const text = sections[sectionKey];
        const textProcess = disassembleWordProcess(text);

        const currentTextStack: string[] = [];
        yield generatorResult('typing-start', '', '');
        for (let runningKey = 0; runningKey < textProcess.length; runningKey++) {
            const running = textProcess[runningKey];
            for (let eachStep = 0; eachStep < running.length; eachStep++) {
                const step = running[eachStep];
                currentTextStack.push(step);
                yield generatorResult(
                    'typing',
                    assemble(currentTextStack),
                    step
                )
            }
        }
        yield generatorResult('typing-end', text, '');
        yield generatorResult('erase-start', text, '');
        if (hasEraseStep) {
            while (currentTextStack.length > 0) {
                //@TODO : 
                // null일 경우에 정말로 값이 없을수 있는가, 
                // 만약 null이나와서 공백이되면 스탭이 이상할탠데 어떻하는가
                const step = currentTextStack.pop() ?? '';
                yield generatorResult(
                    'erase',
                    assemble(currentTextStack),
                    step,
                )
            }
        } else {
            yield generatorResult('erase', '', '')
        }
        yield generatorResult('erase-end', '', '')

    }
}
