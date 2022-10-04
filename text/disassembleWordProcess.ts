import { disassemble } from "hangul-js";

/** 
 * 뛰어쓰기를 기준으로 타이핑 되는 순간 합치기
 * @example
 * in = "안녕 하세요"
 * disassembled = [
 *      ['ㅇ', 'ㅏ', 'ㄴ'],
 *      ['ㄴ', 'ㅕ', 'ㅇ'],
 *      [' '],
 *      ['ㅎ', 'ㅏ'],
 *      ['ㅅ', 'ㅔ'],
 *      'ㅇ', 'ㅛ']
 * ]
 * result = [
 *      ['ㅇ', 'ㅏ', 'ㄴ','ㄴ', 'ㅕ', 'ㅇ'],
 *      [' '],
 *      ['ㅎ', 'ㅏ', 'ㅅ', 'ㅔ', 'ㅇ', 'ㅛ']
 * ]
 */
export function disassembleWordProcess(text: string): string[][] {

    // Hangul로 text의 자모음 분리
    let disassembled = disassemble(text, true);
    return disassembled.reduce<string[][]>((accr, value) => {
        const isSpacing = value.length === 1 && value[0] === " ";
        const lastIndex = accr.length > 0 ? accr.length - 1 : accr.length;
        let currentNestedRef = (
            Array.isArray(accr[lastIndex]) ?
                accr[lastIndex] :
                accr[lastIndex] = []
        );
        if (isSpacing) {
            currentNestedRef = [' '];
            accr.push(currentNestedRef, []);
        } else {
            currentNestedRef.push(...value)
        }

        return accr;
    }, []);
}