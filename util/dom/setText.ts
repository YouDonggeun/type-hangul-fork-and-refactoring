
// target DOM에 텍스트를 text로 설정
export function _setText(target: HTMLInputElement | HTMLElement, text: string) {
    if (target.nodeName === 'INPUT' && target instanceof HTMLInputElement) {
        target.value = text;
    } else {
        target.textContent = text;
    }
}