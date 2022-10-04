
// 기본 humanize 함수, number를 ratio 비율로 랜덤화해서 반환
export function defaultHumanizeDealy(number: number, ratio: number) {
    let min = number - number * ratio;
    let max = number + number * ratio;
    return Math.round(Math.random() * (max - min) + min);
}