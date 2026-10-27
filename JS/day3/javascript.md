# JavaScript 정리: DOM · Event · EventListener · 마우스 감지 · 화살표 함수

---

## 1. DOM(Document Object Model)이란?

**DOM**은 HTML 문서를 브라우저가 이해하고 조작할 수 있도록 **객체(Object) 형태의 트리 구조**로 표현한 것입니다.

- 브라우저는 HTML을 읽어서 각 태그를 **노드(Node)** 로 만들고, 부모-자식 관계로 연결된 트리를 구성합니다.
- JavaScript는 이 DOM을 통해 HTML 요소를 **읽고, 추가하고, 수정하고, 삭제**할 수 있습니다.
- 최상위 객체는 `document`입니다.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>예제</title>
  </head>
  <body>
    <h1 id="title">안녕하세요</h1>
    <p class="text">DOM 예제입니다.</p>
  </body>
</html>
```

위 HTML의 DOM 트리 구조:

```
document
 └─ html
     ├─ head
     │   └─ title
     │       └─ "예제"
     └─ body
         ├─ h1#title
         │   └─ "안녕하세요"
         └─ p.text
             └─ "DOM 예제입니다."
```

> 💡 HTML은 "문서(텍스트)"이고, DOM은 그 문서를 JS가 다룰 수 있게 만든 "객체 모델"입니다.
> JS로 DOM을 바꾸면 화면이 바로 바뀝니다.

---

## 2. Selector(선택자)로 DOM 요소 가져오기

DOM 요소를 조작하려면 먼저 **원하는 요소를 선택**해서 가져와야 합니다.

### 2-1. 주요 선택 메서드

| 메서드 | 설명 | 반환값 |
|---|---|---|
| `document.getElementById("id")` | id로 요소 1개 선택 | Element 또는 `null` |
| `document.getElementsByClassName("class")` | class로 여러 요소 선택 | HTMLCollection (유사 배열) |
| `document.getElementsByTagName("tag")` | 태그명으로 여러 요소 선택 | HTMLCollection |
| `document.querySelector("CSS선택자")` | CSS 선택자로 **첫 번째** 요소 선택 | Element 또는 `null` |
| `document.querySelectorAll("CSS선택자")` | CSS 선택자로 **모든** 요소 선택 | NodeList |

### 2-2. 예제

```html
<h1 id="title">제목</h1>
<ul>
  <li class="item">사과</li>
  <li class="item">바나나</li>
  <li class="item">포도</li>
</ul>
<button>클릭</button>
```

```javascript
// id로 선택
const title = document.getElementById("title");

// class로 선택 (여러 개)
const items = document.getElementsByClassName("item");

// 태그명으로 선택
const button = document.getElementsByTagName("button")[0];

// CSS 선택자로 선택 (가장 많이 사용)
const title2 = document.querySelector("#title");    // id → #
const firstItem = document.querySelector(".item");  // class → . (첫 번째만)
const allItems = document.querySelectorAll(".item"); // 전부
const btn = document.querySelector("button");       // 태그
```

### 2-3. 가져온 요소 조작하기

```javascript
const title = document.querySelector("#title");

// 텍스트 변경
title.textContent = "새로운 제목";

// HTML 내용 변경
title.innerHTML = "<span>강조된 제목</span>";

// 스타일 변경
title.style.color = "blue";
title.style.fontSize = "30px";

// 클래스 추가 / 제거 / 토글
title.classList.add("active");
title.classList.remove("active");
title.classList.toggle("active");

// 속성 변경
title.setAttribute("data-num", "1");
```

### 2-4. 여러 요소 반복 처리

```javascript
const allItems = document.querySelectorAll(".item");

allItems.forEach((item) => {
  item.style.color = "green";
});
```

> ⚠️ `getElementsByClassName`이 반환하는 **HTMLCollection**은 `forEach`를 바로 쓸 수 없습니다.
> `Array.from(items).forEach(...)` 처럼 배열로 바꿔서 사용하거나, `querySelectorAll`을 쓰세요.

---

## 3. Event(이벤트)란?

**이벤트(Event)** 는 웹 페이지에서 **사용자나 브라우저가 일으키는 동작이나 사건**을 말합니다.

### 자주 쓰는 이벤트 종류

| 분류 | 이벤트 | 발생 시점 |
|---|---|---|
| 마우스 | `click` | 클릭했을 때 |
| | `dblclick` | 더블클릭했을 때 |
| | `mouseover` / `mouseout` | 요소 위로 올라감 / 벗어남 |
| | `mouseenter` / `mouseleave` | 요소 진입 / 이탈 (자식 요소 버블링 X) |
| | `mousemove` | 마우스가 움직일 때 |
| | `mousedown` / `mouseup` | 버튼을 누를 때 / 뗄 때 |
| 키보드 | `keydown` / `keyup` | 키를 누를 때 / 뗄 때 |
| 폼 | `input` | 입력값이 바뀔 때마다 |
| | `change` | 값 변경 후 포커스를 잃을 때 |
| | `submit` | 폼 제출 시 |
| | `focus` / `blur` | 포커스 얻음 / 잃음 |
| 문서/창 | `load` | 페이지 로딩 완료 |
| | `DOMContentLoaded` | HTML 파싱 완료 |
| | `resize` | 창 크기 변경 |
| | `scroll` | 스크롤할 때 |

> 💡 이벤트가 발생했을 때 "무엇을 할지" 정해 주는 것이 다음에 나오는 **이벤트 리스너**입니다.

---

## 4. EventListener(이벤트 리스너)

### 4-1. EventListener란?

**이벤트 리스너**는 특정 요소에서 **특정 이벤트가 발생하는지 "듣고(listen)" 있다가**, 이벤트가 발생하면 **지정한 함수(이벤트 핸들러)를 실행**하는 기능입니다.

```
[요소] ──(이벤트 발생: click)──▶ [리스너가 감지] ──▶ [핸들러 함수 실행]
```

### 4-2. EventListener를 사용하는 목적과 이유

1. **사용자와의 상호작용(Interaction)**
   버튼 클릭, 입력, 마우스 이동 등 사용자 행동에 반응하는 **동적인 웹 페이지**를 만들 수 있습니다.
2. **HTML과 JavaScript의 분리**
   HTML 안에 `onclick="..."`을 직접 쓰지 않고 JS에서 관리하므로 **코드가 깔끔하고 유지보수가 쉽습니다.**
3. **하나의 요소에 여러 이벤트 처리 가능**
   `onclick` 속성은 하나의 함수만 등록되지만, `addEventListener`는 **같은 이벤트에 여러 함수**를 등록할 수 있습니다.
4. **이벤트 제거 가능**
   `removeEventListener`로 필요 없어진 이벤트를 해제할 수 있습니다.
5. **세밀한 제어**
   `once`(한 번만 실행), `capture`(캡처 단계 처리) 등 옵션을 줄 수 있습니다.

```javascript
// ❌ onclick 속성 방식: 마지막 것만 남음
btn.onclick = () => console.log("첫 번째");
btn.onclick = () => console.log("두 번째"); // 첫 번째 덮어씀

// ✅ addEventListener 방식: 둘 다 실행됨
btn.addEventListener("click", () => console.log("첫 번째"));
btn.addEventListener("click", () => console.log("두 번째"));
```

### 4-3. EventListener 정의하기

**기본 문법**

```javascript
요소.addEventListener("이벤트종류", 실행할함수, 옵션);
```

- **이벤트종류**: `"click"`, `"keydown"` 등 (앞에 `on` 붙이지 않음!)
- **실행할함수**: 이벤트 발생 시 실행될 콜백 함수 (이벤트 핸들러)
- **옵션** (선택): `{ once: true }`, `{ capture: true }` 등

**① 익명 함수로 정의**

```javascript
const btn = document.querySelector("button");

btn.addEventListener("click", function () {
  alert("버튼이 클릭되었습니다!");
});
```

**② 이름 있는 함수로 정의 (제거할 때 필요)**

```javascript
function handleClick() {
  alert("클릭!");
}

btn.addEventListener("click", handleClick);   // 등록
btn.removeEventListener("click", handleClick); // 제거
```

> ⚠️ `removeEventListener`는 **등록할 때와 같은 함수 참조**를 넘겨야 동작합니다. 익명 함수는 제거할 수 없습니다.

**③ 화살표 함수로 정의**

```javascript
btn.addEventListener("click", () => {
  console.log("클릭!");
});
```

**④ 이벤트 객체(event) 활용**

핸들러 함수의 첫 번째 매개변수로 **이벤트 객체**가 자동 전달됩니다.

```javascript
btn.addEventListener("click", (event) => {
  console.log(event.type);    // "click"
  console.log(event.target);  // 실제로 클릭된 요소
});
```

| 속성/메서드 | 설명 |
|---|---|
| `event.type` | 이벤트 종류 |
| `event.target` | 이벤트가 실제 발생한 요소 |
| `event.currentTarget` | 리스너가 등록된 요소 |
| `event.preventDefault()` | 기본 동작 막기 (예: 폼 제출, 링크 이동) |
| `event.stopPropagation()` | 이벤트 전파(버블링) 막기 |
| `event.key` | 누른 키 (키보드 이벤트) |
| `event.clientX`, `event.clientY` | 마우스 좌표 (마우스 이벤트) |

**⑤ 옵션 사용**

```javascript
// 한 번만 실행되고 자동으로 제거됨
btn.addEventListener("click", () => {
  console.log("딱 한 번만 실행");
}, { once: true });
```

### 4-4. EventListener 응용

**응용 1: 클릭할 때마다 숫자 증가 (카운터)**

```html
<p id="count">0</p>
<button id="plus">+1</button>
<button id="minus">-1</button>
```

```javascript
const countEl = document.querySelector("#count");
let count = 0;

document.querySelector("#plus").addEventListener("click", () => {
  count++;
  countEl.textContent = count;
});

document.querySelector("#minus").addEventListener("click", () => {
  count--;
  countEl.textContent = count;
});
```

**응용 2: 입력값 실시간 표시**

```html
<input id="nameInput" placeholder="이름 입력" />
<p id="preview"></p>
```

```javascript
const input = document.querySelector("#nameInput");
const preview = document.querySelector("#preview");

input.addEventListener("input", (e) => {
  preview.textContent = `안녕하세요, ${e.target.value}님!`;
});
```

**응용 3: 폼 제출 시 새로고침 막기**

```html
<form id="loginForm">
  <input id="userId" />
  <button type="submit">로그인</button>
</form>
```

```javascript
const form = document.querySelector("#loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // 페이지 새로고침 방지
  const userId = document.querySelector("#userId").value;

  if (userId.trim() === "") {
    alert("아이디를 입력하세요.");
    return;
  }
  console.log("로그인 시도:", userId);
});
```

**응용 4: Enter 키 감지**

```javascript
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    console.log("Enter 입력:", e.target.value);
  }
});
```

**응용 5: 다크모드 토글 (classList.toggle)**

```css
.dark {
  background-color: #222;
  color: #fff;
}
```

```javascript
const toggleBtn = document.querySelector("#themeBtn");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
```

**응용 6: 이벤트 위임 (Event Delegation)**

자식 요소가 많을 때, 각각에 리스너를 다는 대신 **부모 하나에만** 등록하고 `event.target`으로 구분합니다.
(이벤트가 자식 → 부모로 전파되는 **버블링** 특성을 이용)

```html
<ul id="fruitList">
  <li>사과</li>
  <li>바나나</li>
  <li>포도</li>
</ul>
```

```javascript
const list = document.querySelector("#fruitList");

list.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    alert(`${e.target.textContent}을(를) 선택했습니다.`);
  }
});
```

> 💡 이벤트 위임은 나중에 새로 추가된 `<li>`에도 자동으로 적용된다는 장점이 있습니다.

---

## 5. 마우스 감지

### 5-1. 마우스 감지란?

**마우스 감지**는 사용자의 마우스 동작(클릭, 이동, 올리기, 벗어나기, 버튼 누르기/떼기, 휠 등)을 **이벤트로 감지하여 반응**하는 것입니다.
마우스 이벤트 객체에는 **좌표**, **누른 버튼**, **보조키 상태** 등의 정보가 담겨 있습니다.

| 마우스 이벤트 | 설명 |
|---|---|
| `click` | 클릭 (누르고 뗐을 때) |
| `dblclick` | 더블클릭 |
| `mousedown` | 마우스 버튼을 누르는 순간 |
| `mouseup` | 마우스 버튼을 떼는 순간 |
| `mousemove` | 마우스가 움직일 때마다 |
| `mouseenter` | 요소 안으로 들어올 때 (버블링 X) |
| `mouseleave` | 요소 밖으로 나갈 때 (버블링 X) |
| `mouseover` | 요소 또는 자식 요소 위로 올라갈 때 (버블링 O) |
| `mouseout` | 요소 또는 자식 요소에서 벗어날 때 (버블링 O) |
| `contextmenu` | 우클릭 메뉴가 열릴 때 |
| `wheel` | 마우스 휠을 굴릴 때 |

| 마우스 이벤트 객체 속성 | 설명 |
|---|---|
| `clientX`, `clientY` | 브라우저 **보이는 화면(뷰포트)** 기준 좌표 |
| `pageX`, `pageY` | **문서 전체** 기준 좌표 (스크롤 포함) |
| `offsetX`, `offsetY` | **이벤트가 발생한 요소** 기준 좌표 |
| `screenX`, `screenY` | **모니터 화면** 기준 좌표 |
| `button` | 누른 버튼 (0: 왼쪽, 1: 휠, 2: 오른쪽) |
| `shiftKey`, `ctrlKey`, `altKey` | 보조키를 함께 눌렀는지 (true/false) |

### 5-2. 마우스 감지 사용

**① 마우스 좌표 실시간 표시**

```html
<p id="pos">X: 0, Y: 0</p>
```

```javascript
const pos = document.querySelector("#pos");

document.addEventListener("mousemove", (e) => {
  pos.textContent = `X: ${e.clientX}, Y: ${e.clientY}`;
});
```

**② 마우스를 올리면 색 변경 (hover 효과)**

```html
<div id="box" style="width:150px; height:150px; background:skyblue;"></div>
```

```javascript
const box = document.querySelector("#box");

box.addEventListener("mouseenter", () => {
  box.style.backgroundColor = "tomato";
});

box.addEventListener("mouseleave", () => {
  box.style.backgroundColor = "skyblue";
});
```

**③ 어떤 버튼을 눌렀는지 감지**

```javascript
box.addEventListener("mousedown", (e) => {
  if (e.button === 0) console.log("왼쪽 버튼");
  else if (e.button === 1) console.log("휠 버튼");
  else if (e.button === 2) console.log("오른쪽 버튼");
});

// 우클릭 메뉴 막기
box.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
```

**④ 마우스를 따라다니는 원**

```html
<div id="circle"></div>
```

```css
#circle {
  position: fixed;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: orange;
  pointer-events: none;      /* 원이 클릭을 가로채지 않게 */
  transform: translate(-50%, -50%);
}
```

```javascript
const circle = document.querySelector("#circle");

document.addEventListener("mousemove", (e) => {
  circle.style.left = `${e.clientX}px`;
  circle.style.top = `${e.clientY}px`;
});
```

**⑤ 드래그로 요소 옮기기 (mousedown + mousemove + mouseup 조합)**

```html
<div id="dragBox" style="position:absolute; width:100px; height:100px; background:purple; cursor:grab;"></div>
```

```javascript
const dragBox = document.querySelector("#dragBox");
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

dragBox.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.offsetX; // 박스 안에서 잡은 위치
  offsetY = e.offsetY;
  dragBox.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  dragBox.style.left = `${e.pageX - offsetX}px`;
  dragBox.style.top = `${e.pageY - offsetY}px`;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  dragBox.style.cursor = "grab";
});
```

> 💡 `mousemove`를 `document`에 다는 이유: 마우스를 빠르게 움직이면 박스 밖으로 벗어나도 계속 따라오게 하기 위해서입니다.

**⑥ 휠 감지**

```javascript
let size = 100;

box.addEventListener("wheel", (e) => {
  e.preventDefault();
  size += e.deltaY < 0 ? 10 : -10; // 위로 굴리면 커지고, 아래로 굴리면 작아짐
  box.style.width = `${size}px`;
  box.style.height = `${size}px`;
}, { passive: false });
```

---

## 6. 화살표 함수(Arrow Function)

### 6-1. 화살표 함수란?

**화살표 함수**는 ES6(2015)에서 도입된 문법으로, `function` 키워드 대신 **`=>`(화살표)** 를 사용해 함수를 **더 짧고 간결하게** 표현하는 방법입니다.

```javascript
// 일반 함수
function add(a, b) {
  return a + b;
}

// 함수 표현식
const add2 = function (a, b) {
  return a + b;
};

// 화살표 함수
const add3 = (a, b) => {
  return a + b;
};

// 화살표 함수 (축약형)
const add4 = (a, b) => a + b;
```

### 화살표 함수의 특징

| 특징 | 설명 |
|---|---|
| 간결한 문법 | `function`, `return`, `{}` 생략 가능 |
| `this` 바인딩 없음 | 자신만의 `this`를 갖지 않고, **바깥(상위) 스코프의 `this`** 를 그대로 사용 |
| `arguments` 없음 | `arguments` 객체를 사용할 수 없음 → 나머지 매개변수 `...args` 사용 |
| 생성자로 사용 불가 | `new` 키워드로 호출할 수 없음 |
| 호이스팅 X | `const`/`let` 변수에 담기므로 선언 전에 호출할 수 없음 |

### 6-2. 화살표 함수 사용

**① 문법 축약 규칙**

```javascript
// 매개변수가 없을 때 → 괄호 필수
const sayHi = () => console.log("Hi");

// 매개변수가 1개일 때 → 괄호 생략 가능
const double = x => x * 2;
const double2 = (x) => x * 2; // 괄호를 써도 OK

// 매개변수가 2개 이상 → 괄호 필수
const multiply = (a, b) => a * b;

// 본문이 한 줄(표현식) → {}와 return 생략 가능 (암묵적 반환)
const square = n => n * n;

// 본문이 여러 줄 → {}와 return 필수
const getGrade = (score) => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  return "C";
};

// 객체를 바로 반환할 때 → 소괄호로 감싸기
const makeUser = (name, age) => ({ name, age });
console.log(makeUser("채민", 24)); // { name: "채민", age: 24 }
```

> ⚠️ `() => { name: "a" }` 처럼 쓰면 `{}`를 함수 본문으로 인식해서 `undefined`가 반환됩니다. 객체 반환 시 반드시 `({ ... })`!

**② 배열 메서드와 함께 사용 (가장 많이 쓰는 경우)**

```javascript
const numbers = [1, 2, 3, 4, 5];

// map: 각 요소 변환
const doubled = numbers.map(n => n * 2);           // [2, 4, 6, 8, 10]

// filter: 조건에 맞는 요소만
const evens = numbers.filter(n => n % 2 === 0);   // [2, 4]

// reduce: 누적 계산
const sum = numbers.reduce((acc, n) => acc + n, 0); // 15

// forEach: 반복
numbers.forEach((n, i) => console.log(`${i}번째: ${n}`));

// find: 조건에 맞는 첫 요소
const firstBig = numbers.find(n => n > 3);         // 4

// sort: 정렬
const desc = [...numbers].sort((a, b) => b - a);   // [5, 4, 3, 2, 1]
```

**③ 이벤트 리스너에서 사용**

```javascript
const btn = document.querySelector("button");

btn.addEventListener("click", (e) => {
  console.log("클릭된 요소:", e.target);
});
```

**④ `this` 차이 — 이벤트 리스너에서 주의!**

```javascript
const btn = document.querySelector("button");

// 일반 함수: this = 이벤트가 등록된 요소(btn)
btn.addEventListener("click", function () {
  console.log(this);        // <button>...</button>
  this.style.color = "red"; // ✅ 동작
});

// 화살표 함수: this = 바깥 스코프의 this (전역에서는 window)
btn.addEventListener("click", () => {
  console.log(this);        // window
  // this.style.color = "red"; ❌ 동작 안 함
});

// 화살표 함수에서 요소에 접근하려면 → event 객체 사용
btn.addEventListener("click", (e) => {
  e.currentTarget.style.color = "red"; // ✅ 동작
});
```

**⑤ `this`가 유용한 경우 — 객체 메서드 안의 콜백**

```javascript
const timer = {
  seconds: 0,
  start() {
    // 화살표 함수는 start()의 this(= timer)를 그대로 사용
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  },
};

timer.start(); // 1, 2, 3, ...
```

```javascript
// 일반 함수를 쓰면 this가 timer가 아니게 되어 오류
const timerBad = {
  seconds: 0,
  start() {
    setInterval(function () {
      this.seconds++; // ❌ this는 timerBad가 아님 → NaN
    }, 1000);
  },
};
```

**⑥ 객체 메서드 자체로는 화살표 함수를 피하기**

```javascript
const user = {
  name: "채민",
  // ❌ 화살표 함수: this가 user가 아님
  sayHiBad: () => console.log(`안녕, ${this.name}`), // "안녕, undefined"

  // ✅ 일반 메서드 축약형
  sayHi() {
    console.log(`안녕, ${this.name}`); // "안녕, 채민"
  },
};
```

**⑦ 나머지 매개변수 사용 (arguments 대신)**

```javascript
const sumAll = (...nums) => nums.reduce((a, b) => a + b, 0);
console.log(sumAll(1, 2, 3, 4)); // 10
```

### 일반 함수 vs 화살표 함수 언제 쓸까?

| 상황 | 추천 |
|---|---|
| 배열 메서드 콜백 (`map`, `filter` 등) | ✅ 화살표 함수 |
| 짧은 유틸 함수 | ✅ 화살표 함수 |
| `setTimeout`/`setInterval` 안에서 바깥 `this` 유지 | ✅ 화살표 함수 |
| 이벤트 리스너에서 `this`로 요소 접근 | 일반 함수 (또는 화살표 + `e.currentTarget`) |
| 객체의 메서드 정의 | 일반 함수(메서드 축약형) |
| 생성자 함수 (`new`) | 일반 함수 / `class` |

---

## 7. 종합 예제

지금까지 배운 **선택자 + 이벤트 리스너 + 마우스 감지 + 화살표 함수**를 모두 활용한 예제입니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>종합 예제</title>
  <style>
    #board {
      width: 400px;
      height: 250px;
      border: 2px solid #333;
      position: relative;
      margin-top: 10px;
    }
    .dot {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: crimson;
      transform: translate(-50%, -50%);
    }
  </style>
</head>
<body>
  <h2 id="info">보드를 클릭해서 점을 찍어 보세요</h2>
  <p id="coord">좌표: -</p>
  <button id="clearBtn">모두 지우기</button>
  <div id="board"></div>

  <script>
    const board = document.querySelector("#board");
    const coord = document.querySelector("#coord");
    const info = document.querySelector("#info");
    const clearBtn = document.querySelector("#clearBtn");
    let dotCount = 0;

    // 마우스 이동 → 보드 기준 좌표 표시
    board.addEventListener("mousemove", (e) => {
      coord.textContent = `좌표: (${e.offsetX}, ${e.offsetY})`;
    });

    board.addEventListener("mouseleave", () => {
      coord.textContent = "좌표: -";
    });

    // 클릭 → 점 생성
    board.addEventListener("click", (e) => {
      if (e.target !== board) return; // 점 위를 클릭한 경우 무시
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.style.left = `${e.offsetX}px`;
      dot.style.top = `${e.offsetY}px`;
      board.appendChild(dot);
      dotCount++;
      info.textContent = `찍은 점: ${dotCount}개`;
    });

    // 이벤트 위임 → 점 우클릭 시 삭제
    board.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (e.target.classList.contains("dot")) {
        e.target.remove();
        dotCount--;
        info.textContent = `찍은 점: ${dotCount}개`;
      }
    });

    // 모두 지우기
    clearBtn.addEventListener("click", () => {
      board.querySelectorAll(".dot").forEach(dot => dot.remove());
      dotCount = 0;
      info.textContent = "보드를 클릭해서 점을 찍어 보세요";
    });
  </script>
</body>
</html>
```

---

## 📌 한눈에 요약

| 개념 | 핵심 |
|---|---|
| **DOM** | HTML을 JS가 다룰 수 있게 만든 객체 트리 (`document`가 시작점) |
| **선택자** | `querySelector`(1개), `querySelectorAll`(전부) 가 가장 범용적 |
| **Event** | 사용자/브라우저가 일으키는 사건 (`click`, `input`, `keydown` …) |
| **EventListener** | `요소.addEventListener("이벤트", 함수)` 로 이벤트 발생 시 함수 실행 |
| **이벤트 객체** | `e.target`, `e.preventDefault()`, `e.key`, `e.clientX` 등 정보 제공 |
| **마우스 감지** | `mousemove`, `mouseenter/leave`, `mousedown/up`, `wheel` + 좌표 속성 |
| **화살표 함수** | `(매개변수) => 결과` / 자신만의 `this` 없음 → 바깥 `this` 사용 |