/**
 * JS 사칙연산 계산기 v2
 * ----------------------------------------------
 * HTML 버튼의 onclick과 연결되는 함수
 *   togglePower()        ON/OFF
 *   clearDisplay()       C (지우기)
 *   appendNumber(n)      숫자, 소수점 입력
 *   appendOperator(op)   + - * / 입력
 *   performCalculate()   Enter (계산)
 *
 * 특징
 *   - eval() 없이 직접 식을 분석해서 계산
 *   - 곱셈·나눗셈을 덧셈·뺄셈보다 먼저 계산 (연산자 우선순위)
 *   - 길이 제한 없는 긴 식 계산
 *   - 키보드 입력 지원 (숫자, + - * /, Enter, Backspace, Esc)
 */

// ================================================
// 0. 상태와 화면 요소
// ================================================
const display = document.getElementById("display");
const powerButton = document.querySelector(".on-off");

let isOn = true;            // 전원 상태
let expression = "0";       // 화면에 보이는 계산식
let justCalculated = false; // 방금 Enter로 결과를 낸 상태인지

const OPERATORS = ["+", "-", "*", "/"];

// 화면 갱신: 긴 식은 항상 끝부분이 보이도록 오른쪽으로 스크롤
function updateDisplay() {
    display.value = isOn ? expression : "";
    display.scrollLeft = display.scrollWidth;
}

// ================================================
// 1. 버튼 함수
// ================================================

// ON/OFF
function togglePower() {
    isOn = !isOn;
    powerButton.classList.toggle("on", isOn);   // 켜지면 초록색
    expression = "0";
    justCalculated = false;
    updateDisplay();
}

// C: 처음 상태로
function clearDisplay() {
    if (!isOn) return;
    expression = "0";
    justCalculated = false;
    updateDisplay();
}

// 숫자와 소수점
function appendNumber(num) {
    if (!isOn) return;

    // 결과가 나온 뒤 숫자를 누르면 새 계산 시작
    if (justCalculated || expression === "Error") {
        expression = "0";
        justCalculated = false;
    }

    // 지금 입력 중인 숫자 (마지막 연산자 뒤의 부분)
    const currentNumber = expression.split(/[+\-*/]/).pop();

    if (num === ".") {
        if (currentNumber.includes(".")) return;          // 소수점은 숫자당 한 번만
        if (currentNumber === "") {                       // 연산자 바로 뒤의 . → 0.
            expression += "0.";
        } else {
            expression += ".";
        }
    } else if (currentNumber === "0") {
        // 맨 앞의 0을 새 숫자로 바꾸기 (05 → 5)
        expression = expression.slice(0, -1) + num;
    } else {
        expression += num;
    }

    updateDisplay();
}

// 연산자
function appendOperator(op) {
    if (!isOn) return;
    if (expression === "Error") expression = "0";
    justCalculated = false;   // 결과 뒤에 연산자를 누르면 그 결과로 이어서 계산

    const lastChar = expression.slice(-1);

    // 연산자를 연달아 누르면 마지막 연산자를 바꿈 (3 + * → 3 *)
    if (OPERATORS.includes(lastChar)) {
        expression = expression.slice(0, -1) + op;
    } else if (lastChar === ".") {
        // "3." 뒤에 연산자 → "3" 으로 정리
        expression = expression.slice(0, -1) + op;
    } else {
        expression += op;
    }

    updateDisplay();
}

// Enter: 계산
function performCalculate() {
    if (!isOn || expression === "Error") return;

    // 식이 연산자로 끝나면 그 연산자는 무시 (3 + 4 * → 3 + 4)
    let expr = expression;
    while (OPERATORS.includes(expr.slice(-1))) {
        expr = expr.slice(0, -1);
    }

    try {
        const result = calculate(expr);
        expression = String(result);
        console.log(`${expr} = ${result}`);
    } catch (error) {
        console.error(error.message);
        expression = "Error";
    }

    justCalculated = true;
    updateDisplay();
}

// 한 글자 지우기 (키보드 Backspace)
function deleteLast() {
    if (!isOn || justCalculated || expression === "Error") return;
    expression = expression.length > 1 ? expression.slice(0, -1) : "0";
    updateDisplay();
}

// ================================================
// 2. 계산 엔진 (연산자 우선순위 적용)
//
//   식(expression) = 항 (+|- 항)*        ← 우선순위 낮음
//   항(term)       = 인수 (*|/ 인수)*    ← 우선순위 높음
//   인수(factor)   = 숫자 | -인수
//
//   더하기·빼기를 하기 전에 항(곱하기·나누기)을 먼저 끝까지
//   계산하므로 * 와 / 가 + 와 - 보다 항상 먼저 계산된다.
// ================================================

// 문자열 → [숫자, 연산자] 배열.  "12+3.5*2" → [12, "+", 3.5, "*", 2]
function tokenize(expr) {
    const tokens = expr.match(/\d+\.?\d*|\.\d+|[+\-*/]/g) || [];
    return tokens.map(t => (OPERATORS.includes(t) ? t : Number(t)));
}

function calculate(expr) {
    const tokens = tokenize(expr);
    let pos = 0;
    const peek = () => tokens[pos];
    const next = () => tokens[pos++];

    function parseExpression() {          // + -
        let result = parseTerm();
        while (peek() === "+" || peek() === "-") {
            const op = next();
            const right = parseTerm();
            result = op === "+" ? result + right : result - right;
        }
        return result;
    }

    function parseTerm() {                // * /
        let result = parseFactor();
        while (peek() === "*" || peek() === "/") {
            const op = next();
            const right = parseFactor();
            if (op === "/" && right === 0) {
                throw new Error("0으로 나눌 수 없습니다.");
            }
            result = op === "*" ? result * right : result / right;
        }
        return result;
    }

    function parseFactor() {              // 숫자, 음수
        const token = next();
        if (typeof token === "number") return token;
        if (token === "-") return -parseFactor();
        throw new Error("올바르지 않은 계산식입니다.");
    }

    const result = parseExpression();
    if (pos < tokens.length) {
        throw new Error("올바르지 않은 계산식입니다.");
    }

    // 부동소수점 오차 정리: 0.1+0.2 = 0.30000000000000004 → 0.3
    return Number.isInteger(result) ? result : Number(result.toPrecision(12));
}

// ================================================
// 3. 키보드 입력
// ================================================
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
        appendNumber(key);
    } else if (OPERATORS.includes(key)) {
        appendOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();   // 포커스된 버튼이 한 번 더 눌리는 것 방지
        performCalculate();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape") {
        clearDisplay();
    }
});

// ================================================
// 4. 시작 상태: 전원 ON
// ================================================
powerButton.classList.add("on");
updateDisplay();