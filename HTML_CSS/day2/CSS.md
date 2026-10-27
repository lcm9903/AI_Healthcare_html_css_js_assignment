# CSS 기초 정리

## 1. CSS란?

**CSS(Cascading Style Sheets)** 는 HTML 요소가 화면에 **어떻게 보일지**(색, 크기, 위치, 여백 등)를 정하는 언어입니다.

| 역할 | 담당 |
|---|---|
| 내용과 구조 (제목, 문단, 목록, 표) | HTML |
| 모양과 배치 (색, 글꼴, 여백, 정렬) | CSS |
| 동작 (클릭, 데이터 전송) | JavaScript |

**기본 문법**

```css
선택자 {
    속성: 값;
    속성: 값;
}
```

```css
h1 {
    color: navy;        /* 글자색 */
    font-size: 32px;    /* 글자 크기 */
}
```

- **선택자(selector)**: 스타일을 적용할 대상 (`h1`)
- **선언(declaration)**: `속성: 값;` 한 쌍. 끝에 세미콜론(`;`)을 붙입니다.
- **주석**: `/* ... */`

**Cascading(폭포처럼 내려오는)의 의미**: 같은 요소에 여러 스타일이 겹치면 정해진 우선순위에 따라 하나가 적용됩니다. 그리고 `color`, `font-size` 같은 일부 속성은 부모에게서 자식으로 **상속**됩니다.

---

## 2. CSS를 적용하는 세 가지 방식

### 2-1. Inline CSS

HTML 태그에 **`style` 속성**으로 직접 씁니다.

```html
<p style="color: red; font-size: 18px;">안녕하세요!</p>
```

| 장점 | 단점 |
|---|---|
| 특정 요소 하나만 빠르게 바꿀 수 있음 | 같은 스타일을 여러 곳에 반복해서 써야 함 |
| 우선순위가 가장 높음 | HTML과 디자인이 섞여 코드가 지저분해짐 |
| | 수정할 때 하나하나 찾아 고쳐야 함 |

### 2-2. Internal CSS

`<head>` 안에 **`<style>` 태그**를 넣고 그 안에 씁니다.

```html
<head>
    <style>
        p {
            color: red;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <p>안녕하세요!</p>
    <p>모든 p 태그에 적용됩니다.</p>
</body>
```

| 장점 | 단점 |
|---|---|
| 한 페이지 안의 여러 요소에 한 번에 적용 | 다른 HTML 파일에서는 재사용할 수 없음 |
| 파일 하나로 끝나서 간단한 페이지에 편함 | 페이지가 많아지면 같은 코드를 복사해야 함 |

### 2-3. External CSS

스타일을 **별도의 `.css` 파일**에 쓰고, HTML에서 `<link>`로 연결합니다.

```css
/* style.css */
p {
    color: red;
    font-size: 18px;
}
```

```html
<!-- index.html -->
<head>
    <link rel="stylesheet" href="style.css">
</head>
```

| 장점 | 단점 |
|---|---|
| 여러 페이지가 CSS 파일 하나를 공유 | 파일이 하나 더 필요함 |
| CSS 파일 하나만 고치면 전체 사이트에 반영 | 파일 경로가 틀리면 스타일이 적용되지 않음 |
| HTML(구조)과 CSS(디자인)가 깔끔하게 분리됨 | |
| 브라우저가 CSS 파일을 저장해두어 로딩이 빨라짐 | |

### 세 방식 비교

| | Inline | Internal | External |
|---|---|---|---|
| 작성 위치 | 태그의 `style` 속성 | `<head>` 안 `<style>` | 별도 `.css` 파일 |
| 적용 범위 | 그 요소 하나 | 그 페이지 전체 | 연결한 모든 페이지 |
| 재사용성 | 낮음 | 중간 | 높음 |
| 실무 사용 | 테스트, 예외 처리 | 작은 단일 페이지 | **가장 권장** |

**우선순위**: 같은 요소에 같은 속성이 겹치면 **Inline > Internal ≈ External** 순으로 적용됩니다. Internal과 External끼리는 **나중에 읽힌 쪽**이 이깁니다.

---

## 3. CSS Selector (선택자)

스타일을 **어떤 요소에** 적용할지 고르는 방법입니다.

### 기본 선택자

| 선택자 | 문법 | 예시 | 선택 대상 |
|---|---|---|---|
| 전체 | `*` | `* { margin: 0; }` | 모든 요소 |
| 태그 | `태그명` | `p { }` | 모든 `<p>` |
| 클래스 | `.클래스명` | `.title { }` | `class="title"`인 요소 (여러 개 가능) |
| 아이디 | `#아이디명` | `#header { }` | `id="header"`인 요소 (페이지에 하나) |
| 속성 | `[속성]` | `input[type="email"] { }` | `type="email"`인 `<input>` |

```html
<h1 id="main-title">Self Introduction.</h1>
<p class="intro">안녕하세요!</p>
<p class="intro highlight">클래스는 여러 개 붙일 수 있어요.</p>
```

```css
#main-title { color: navy; }
.intro      { font-size: 18px; }
.highlight  { background-color: yellow; }
```

### 조합 선택자

| 선택자 | 문법 | 의미 |
|---|---|---|
| 그룹 | `h1, h2` | `h1`과 `h2` 모두 |
| 자손 | `ul li` | `ul` 안에 있는 모든 `li` (깊이 상관없음) |
| 자식 | `ul > li` | `ul` 바로 아래의 `li`만 |
| 인접 형제 | `h1 + p` | `h1` 바로 다음에 오는 `p` 하나 |
| 일반 형제 | `h1 ~ p` | `h1` 뒤에 오는 모든 형제 `p` |

### 가상 클래스 (상태에 따라 선택)

| 선택자 | 의미 |
|---|---|
| `a:hover` | 마우스를 올렸을 때 |
| `input:focus` | 입력칸을 클릭해 커서가 있을 때 |
| `li:first-child` | 첫 번째 자식 |
| `li:last-child` | 마지막 자식 |
| `li:nth-child(2)` | 두 번째 자식 (`odd`, `even`도 가능) |

```css
a:hover { color: orange; }
tr:nth-child(even) { background-color: #f2f2f2; }  /* 표 줄무늬 */
```

### 선택자 우선순위 (명시도, Specificity)

여러 선택자가 같은 요소를 가리키면 **더 구체적인 선택자**가 이깁니다.

```
!important  >  inline style  >  #id  >  .class / :hover / [속성]  >  태그  >  *
```

```css
p        { color: black; }   /* 약함 */
.intro   { color: blue; }    /* 더 강함 */
#first   { color: red; }     /* 가장 강함 → 빨간색 적용 */
```

명시도가 같으면 **나중에 작성한 규칙**이 적용됩니다. `!important`는 모든 규칙을 무시하고 덮어쓰기 때문에 꼭 필요할 때만 씁니다.

---

## 4. style 속성

HTML 태그 안에 직접 CSS를 쓰는 속성으로, Inline CSS를 쓸 때 사용합니다.

```html
<태그 style="속성1: 값1; 속성2: 값2;">
```

```html
<h1 style="color: navy; text-align: center;">Self Introduction.</h1>
<img src="profile.jpg" style="width: 200px; border-radius: 50%;">
```

- 선택자와 중괄호 없이 `속성: 값;`만 나열합니다.
- 여러 속성은 세미콜론(`;`)으로 구분합니다.
- 우선순위가 매우 높아서 외부 CSS로 덮어쓰기 어렵습니다. 그래서 테스트용이나 한 군데만 바꿀 때 주로 씁니다.

> **HTML 속성과 헷갈리지 않기**: `<img width="200">`의 `width`는 HTML 속성이고, `style="width: 200px;"`는 CSS입니다. 둘 다 있으면 CSS가 우선합니다.

---

## 5. 텍스트 관련 속성

### font-size: 글자 크기

```css
p { font-size: 16px; }
```

| 단위 | 기준 | 특징 |
|---|---|---|
| `px` | 화면 픽셀 | 고정 크기, 가장 직관적 |
| `em` | **부모** 요소의 글자 크기 | `2em` = 부모의 2배. 중첩되면 계속 곱해짐 |
| `rem` | **최상위(`html`)** 글자 크기 (기본 16px) | `2rem` = 32px. 중첩 영향 없어 실무에서 많이 씀 |
| `%` | 부모 요소의 글자 크기 | `150%` = 부모의 1.5배 |

### font-weight: 글자 굵기

```css
h1 { font-weight: bold; }
p  { font-weight: 400; }
```

| 값 | 의미 |
|---|---|
| `normal` | 보통 (= 400) |
| `bold` | 굵게 (= 700) |
| `100` ~ `900` | 100 단위 숫자로 세밀하게 조절 |
| `lighter` / `bolder` | 부모보다 얇게 / 굵게 |

> 폰트에 해당 굵기가 없으면 숫자를 바꿔도 차이가 보이지 않을 수 있습니다.

### text-align: 가로 정렬

```css
h1 { text-align: center; }
```

| 값 | 의미 |
|---|---|
| `left` | 왼쪽 정렬 (기본) |
| `center` | 가운데 정렬 |
| `right` | 오른쪽 정렬 |
| `justify` | 양쪽 정렬 (줄 끝을 맞춤) |

> `text-align`은 요소 **안의 글자와 인라인 요소**를 정렬합니다. 블록 요소 자체를 가운데로 옮기려면 `margin: 0 auto;`를 씁니다.

### 자주 함께 쓰는 텍스트 속성

| 속성 | 예시 | 설명 |
|---|---|---|
| `color` | `color: #333;` | 글자색 |
| `font-family` | `font-family: "Noto Sans KR", sans-serif;` | 글꼴. 앞의 글꼴이 없으면 다음 글꼴 사용 |
| `line-height` | `line-height: 1.6;` | 줄 간격 |
| `text-decoration` | `text-decoration: none;` | 밑줄 제거 (링크에 자주 사용) |
| `letter-spacing` | `letter-spacing: 1px;` | 글자 간격 |

---

## 6. Box Model (박스 모델)

모든 HTML 요소는 **네모난 상자**로 취급됩니다. 상자는 안쪽부터 네 겹으로 이루어집니다.

```
┌─────────────── margin (바깥 여백) ───────────────┐
│  ┌──────────── border (테두리) ───────────────┐  │
│  │  ┌───────── padding (안쪽 여백) ────────┐  │  │
│  │  │                                      │  │  │
│  │  │          content (내용)              │  │  │
│  │  │       width × height                 │  │  │
│  │  │                                      │  │  │
│  │  └──────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

| 영역 | 설명 | 배경색 적용 |
|---|---|---|
| **content** | 글자, 이미지 등 실제 내용이 들어가는 영역 | O |
| **padding** | 내용과 테두리 사이의 **안쪽** 여백 | O |
| **border** | 상자의 테두리 선 | 테두리 색 따로 지정 |
| **margin** | 테두리 바깥, 다른 요소와의 **바깥쪽** 여백 | X (항상 투명) |

### content, width, height

`width`와 `height`는 기본적으로 **content 영역의 크기**를 정합니다.

```css
.box {
    width: 300px;
    height: 150px;
}
```

- `auto`(기본값): 블록 요소의 너비는 부모 너비를 꽉 채우고, 높이는 내용만큼 늘어납니다.
- `%`: 부모 요소 크기를 기준으로 합니다.
- `max-width`, `min-height` 등으로 최대·최소 크기를 제한할 수 있습니다.

### padding: 안쪽 여백

```css
.box { padding: 20px; }
```

### border: 테두리

```css
.box { border: 2px solid navy; }    /* 굵기 스타일 색 */
```

| 스타일 | 모양 |
|---|---|
| `solid` | 실선 |
| `dashed` | 점선 (긴 선) |
| `dotted` | 점 |
| `double` | 이중선 |
| `none` | 없음 |

`border-radius: 10px;`로 모서리를 둥글게, `50%`로 원형을 만들 수 있습니다.

### margin: 바깥 여백

```css
.box { margin: 20px; }
.center { width: 600px; margin: 0 auto; }   /* 블록 요소 가운데 정렬 */
```

> **마진 상쇄(margin collapsing)**: 위아래로 붙은 두 블록 요소의 세로 margin은 더해지지 않고, **둘 중 큰 값 하나만** 적용됩니다. (위 요소 `margin-bottom: 30px`, 아래 요소 `margin-top: 20px` → 간격은 50px이 아니라 30px)

### 값 적는 순서 (margin, padding 공통)

값 개수에 따라 적용되는 방향이 달라집니다. **위에서 시작해 시계 방향**으로 기억하면 쉽습니다.

| 작성 | 적용 |
|---|---|
| `margin: 10px;` | 네 방향 모두 10px |
| `margin: 10px 20px;` | 위아래 10px, 좌우 20px |
| `margin: 10px 20px 30px;` | 위 10px, 좌우 20px, 아래 30px |
| `margin: 10px 20px 30px 40px;` | 위, 오른쪽, 아래, 왼쪽 (시계 방향) |

한 방향만 지정할 때는 `margin-top`, `padding-left`처럼 씁니다.

### box-sizing: 크기 계산 기준

`width`에 padding과 border를 포함할지 정합니다.

| 값 | width가 가리키는 범위 | 실제 차지하는 너비 (`width: 300px; padding: 20px; border: 5px;`) |
|---|---|---|
| `content-box` (기본값) | content만 | 300 + 20×2 + 5×2 = **350px** |
| `border-box` | content + padding + border | **300px** (content가 250px로 줄어듦) |

```css
* {
    box-sizing: border-box;   /* 실무에서 거의 항상 처음에 넣는 설정 */
}
```

`border-box`를 쓰면 padding이나 border를 바꿔도 요소 전체 크기가 그대로라서 레이아웃을 계산하기 훨씬 쉽습니다.

---

## 전체 예시

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>CSS 예시</title>
    <link rel="stylesheet" href="style.css">   <!-- External -->
    <style>                                     /* Internal */
        .card {
            width: 300px;
            padding: 20px;
            border: 2px solid navy;
            margin: 20px auto;
            box-sizing: border-box;
        }
        .card h2 {
            font-size: 1.5rem;
            font-weight: 700;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="card">
        <h2>이채민</h2>
        <p style="color: gray;">Medical AI에 관심 있어요.</p>   <!-- Inline -->
    </div>
</body>
</html>
```