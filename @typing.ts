
export interface Options {

    // 출력할 텍스트
    sections: string[]
    // 타이핑 사이 시간 간격, ms
    intervalType: number
    // 색션 타이핑이 끝났을경우 딜레이 시간
    sectionIntervalType: number
    // 사람이 타이핑하는 것처럼 intervalType를 랜덤화
    humanize?: number | ((intervalType: number) => number)
    // 타이핑 이후 지워지는 스탭이 있음.
    hasEraseStep: boolean,
    // 색션들을 반복함
    repeat: boolean
}

export type TypingTaskEvent = {
    target: HTMLElement,
    options: Options,
};
export type TypingEachTextEvent = TypingTaskEvent & {
    typeChar: string,
    progress: string;
}
export type EventRecord = {
    'th.endType': TypingTaskEvent,
    'th.startType': TypingTaskEvent,
    'th.beforeType': TypingEachTextEvent,
    'th.afterType': TypingEachTextEvent,
}

// observer
export type TypingObserver = |
    ((text: string, step: string) => void)

// typing

type TextProcessState<Prefix extends string> = Prefix | `${Prefix}-start` | `${Prefix}-end`
export type TextProcessResult = {
    type: TextProcessState<'typing'> | TextProcessState<'erase'>,
    text: string,
    step: string
}