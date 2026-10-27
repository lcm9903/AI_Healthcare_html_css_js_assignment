/**
 * 콘솔 사칙연산 계산기
 * ----------------------------------------------
 * 사용법 (브라우저 개발자도구 Console 탭)
 *   1) 이 파일 전체를 복사해 콘솔에 붙여넣고 Enter
 *   2) calculate("3 + 4 * 2 - 10 / 5")   → 9
 *   3) startCalculator()                 → 입력창(prompt)으로 반복 계산
 *
 * 특징
 *   - eval()을 쓰지 않고 직접 식을 분석해서 계산
 *   - 곱셈·나눗셈을 덧셈·뺄셈보다 먼저 계산 (연산자 우선순위)
 *   - 길이 제한 없는 긴 식, 소수, 음수, 괄호 지원
 */

// ================================================
// 1단계. 토큰화: 문자열 → [숫자, 연산자, 괄호] 배열
//   "12 + 3.5*2"  →  [12, "+", 3.5, "*", 2]
// ================================================
function tokenize(expression) {
    const tokens = [];
    let i = 0;

    while (i < expression.length) {
        const char = expression[i];

        // 공백은 건너뛰기
        if (char === " ") {
            i++;
            continue;
        }

        // 숫자(소수 포함) 읽기
        if (/[0-9.]/.test(char)) {
            let numStr = "";
            while (i < expression.length && /[0-9.]/.test(expression[i])) {
                numStr += expression[i];
                i++;
            }
            const num = Number(numStr);
            if (Number.isNaN(num)) {
                throw new Error(`잘못된 숫자입니다: "${numStr}"`);
            }
            tokens.push(num);
            continue;
        }

        // 연산자와 괄호 (×, ÷ 기호도 허용)
        if ("+-*/()×÷".includes(char)) {
            const op = char === "×" ? "*" : char === "÷" ? "/" : char;
            tokens.push(op);
            i++;
            continue;
        }

        throw new Error(`사용할 수 없는 문자입니다: "${char}"`);
    }

    return tokens;
}

// ================================================
// 2단계. 계산: 우선순위를 단계별 함수로 나눠서 처리
//
//   식(expression) = 항 (+|- 항)*        ← 우선순위 낮음
//   항(term)       = 인수 (*|/ 인수)*    ← 우선순위 높음
//   인수(factor)   = 숫자 | -인수 | ( 식 )
//
//   expression이 term을 먼저 끝까지 계산해 온 다음 더하고 빼기 때문에
//   * 와 / 가 + 와 - 보다 항상 먼저 계산된다.
// ================================================
function evaluate(tokens) {
    let pos = 0;                       // 지금 읽고 있는 토큰 위치

    const peek = () => tokens[pos];    // 현재 토큰 보기
    const next = () => tokens[pos++];  // 현재 토큰 꺼내고 다음으로

    // 식: 덧셈, 뺄셈
    function parseExpression() {
        let result = parseTerm();
        while (peek() === "+" || peek() === "-") {
            const op = next();
            const right = parseTerm();
            result = op === "+" ? result + right : result - right;
        }
        return result;
    }

    // 항: 곱셈, 나눗셈
    function parseTerm() {
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

    // 인수: 숫자, 음수 부호, 괄호
    function parseFactor() {
        const token = peek();

        if (typeof token === "number") {
            next();
            return token;
        }
        if (token === "-") {           // 음수: -5, -(3+2)
            next();
            return -parseFactor();
        }
        if (token === "+") {           // 양수 부호: +5
            next();
            return parseFactor();
        }
        if (token === "(") {
            next();
            const value = parseExpression();
            if (next() !== ")") {
                throw new Error("괄호가 닫히지 않았습니다.");
            }
            return value;
        }
        if (token === undefined) {
            throw new Error("식이 연산자로 끝났습니다.");
        }
        throw new Error(`"${token}" 위치에 숫자가 와야 합니다.`);
    }

    const result = parseExpression();
    if (pos < tokens.length) {
        throw new Error(`"${tokens[pos]}" 부분을 해석할 수 없습니다.`);
    }
    return result;
}

// ================================================
// 3단계. 외부에서 쓰는 함수
// ================================================

// 부동소수점 오차 정리: 0.1 + 0.2 = 0.30000000000000004 → 0.3
function cleanNumber(num) {
    return Number.isInteger(num) ? num : Number(num.toPrecision(12));
}

function calculate(expression) {
    if (typeof expression !== "string" || expression.trim() === "") {
        console.error("❌ 계산식을 문자열로 입력하세요. 예: calculate(\"1 + 2 * 3\")");
        return;
    }
    try {
        const tokens = tokenize(expression);
        const result = cleanNumber(evaluate(tokens));
        console.log(`✅ ${expression.trim()} = ${result}`);
        return result;
    } catch (error) {
        console.error(`❌ ${error.message}`);
    }
}

// 입력창으로 반복 계산 (취소 또는 빈칸 입력 시 종료)
function startCalculator() {
    console.log("🧮 계산기를 시작합니다. 취소를 누르면 종료돼요.");
    while (true) {
        const input = prompt("계산식을 입력하세요 (예: 3 + 4 * 2)");
        if (input === null || input.trim() === "") {
            console.log("👋 계산기를 종료합니다.");
            break;
        }
        calculate(input);
    }
}

console.log(
    "🧮 사칙연산 계산기 준비 완료!\n" +
    '  calculate("3 + 4 * 2 - 10 / 5")  → 한 번 계산\n' +
    "  startCalculator()                 → 입력창으로 반복 계산"
);