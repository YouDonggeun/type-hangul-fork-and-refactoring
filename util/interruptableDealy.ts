
export const _interruptableDealy = (ms: number) => {
    let timer: null | number = null;
    const promise = new Promise((resolve) => {
        timer = window.setTimeout(resolve, ms)
    })
    return {
        promise,
        interrupt() {
            if (timer) {
                window.clearTimeout(timer);
            }
        }
    }
};