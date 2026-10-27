/**
 * 실시간 암호화폐 시세 (Binance 24hr Ticker API)
 * ----------------------------------------------
 * 1. 1초마다 API에 GET 요청 → USDT 마켓만 골라 목록 구성
 * 2. 행을 매번 새로 그리지 않고, 바뀐 값만 업데이트 (깜빡임 효과)
 * 3. 검색: 코인 이름으로 목록 필터링
 * 4. 관심항목: ☆ 클릭 → LocalStorage에 저장 (새로고침해도 유지)
 * 5. 탭: 전체보기 / 관심항목 보기
 */

// ================================================
// 0. 설정과 상태
// ================================================
const API_URL = "https://api4.binance.com/api/v3/ticker/24hr";
const QUOTE = "USDT";
const INTERVAL_MS = 1000;
const STORAGE_KEY = "crypto-favorites";

const listEl = document.getElementById("coin-list");
const searchEl = document.getElementById("search");
const emptyEl = document.getElementById("empty-message");
const countAllEl = document.getElementById("count-all");
const countFavEl = document.getElementById("count-fav");
const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");
const tabButtons = document.querySelectorAll(".tab");

let currentTab = "all";            // "all" | "favorites"
let searchKeyword = "";
let favorites = loadFavorites();   // Set { "BTCUSDT", ... }
const rows = new Map();            // symbol → { tr, cells, lastPrice }

// ================================================
// 1. LocalStorage (관심항목)
// ================================================
function loadFavorites() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return new Set(Array.isArray(saved) ? saved : []);
    } catch {
        return new Set();
    }
}

function saveFavorites() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
}

function toggleFavorite(symbol) {
    if (favorites.has(symbol)) {
        favorites.delete(symbol);
    } else {
        favorites.add(symbol);
    }
    saveFavorites();

    const row = rows.get(symbol);
    if (row) {
        const on = favorites.has(symbol);
        row.cells.star.classList.toggle("on", on);
        row.cells.star.textContent = on ? "★" : "☆";
        row.cells.star.setAttribute("aria-label", on ? "관심항목 해제" : "관심항목 추가");
    }
    applyFilter();
}

// ================================================
// 2. 숫자 표시 형식
// ================================================

// 가격: 큰 값은 소수 2자리, 아주 작은 값(밈코인 등)은 유효숫자 4자리까지
function formatPrice(value) {
    const num = Number(value);
    if (num >= 1) {
        return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    }
    return num.toLocaleString("en-US", { maximumSignificantDigits: 4 });
}

function formatPercent(value) {
    const num = Number(value);
    return `${num > 0 ? "+" : ""}${num.toFixed(2)}%`;
}

// 거래대금: 1,234,567,890 → 1.23B
function formatVolume(value) {
    const num = Number(value);
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toFixed(2);
}

// ================================================
// 3. 행 만들기 / 업데이트
// ================================================
function createRow(coin) {
    const tr = document.createElement("tr");
    tr.dataset.symbol = coin.symbol;

    const base = coin.symbol.slice(0, -QUOTE.length);   // BTCUSDT → BTC
    const isFav = favorites.has(coin.symbol);

    tr.innerHTML = `
        <td><button class="star ${isFav ? "on" : ""}"
                    aria-label="${isFav ? "관심항목 해제" : "관심항목 추가"}">${isFav ? "★" : "☆"}</button></td>
        <td><span class="symbol">${base}</span><span class="quote">/${QUOTE}</span></td>
        <td class="col-num price"></td>
        <td class="col-num change"></td>
        <td class="col-num hide-mobile high"></td>
        <td class="col-num hide-mobile low"></td>
        <td class="col-num hide-tablet volume"></td>
    `;

    const cells = {
        star: tr.querySelector(".star"),
        price: tr.querySelector(".price"),
        change: tr.querySelector(".change"),
        high: tr.querySelector(".high"),
        low: tr.querySelector(".low"),
        volume: tr.querySelector(".volume"),
    };

    cells.star.addEventListener("click", () => toggleFavorite(coin.symbol));

    const row = { tr, cells, base, lastPrice: null };
    rows.set(coin.symbol, row);
    listEl.appendChild(tr);
    return row;
}

function updateRow(row, coin) {
    const { cells } = row;
    const price = Number(coin.lastPrice);
    const change = Number(coin.priceChangePercent);

    // 가격이 바뀌었을 때만 화면 갱신 + 깜빡임
    if (row.lastPrice !== null && price !== row.lastPrice) {
        const cls = price > row.lastPrice ? "flash-up" : "flash-down";
        cells.price.classList.remove("flash-up", "flash-down");
        void cells.price.offsetWidth;   // 애니메이션을 다시 시작하기 위한 리플로우
        cells.price.classList.add(cls);
    }
    row.lastPrice = price;

    // 24h 변동률 기준 색: 상승 빨강, 하락 파랑
    [cells.price, cells.change].forEach((cell) => {
        cell.classList.toggle("up", change > 0);
        cell.classList.toggle("down", change < 0);
    });

    cells.price.textContent = formatPrice(coin.lastPrice);
    cells.change.textContent = formatPercent(coin.priceChangePercent);
    cells.high.textContent = formatPrice(coin.highPrice);
    cells.low.textContent = formatPrice(coin.lowPrice);
    cells.volume.textContent = formatVolume(coin.quoteVolume);
}

// ================================================
// 4. 검색 · 탭 필터
// ================================================
function applyFilter() {
    const keyword = searchKeyword.trim().toUpperCase();
    let visible = 0;

    rows.forEach((row, symbol) => {
        const matchTab = currentTab === "all" || favorites.has(symbol);
        const matchSearch = keyword === "" || row.base.includes(keyword);
        const show = matchTab && matchSearch;
        row.tr.classList.toggle("hidden", !show);
        if (show) visible++;
    });

    countAllEl.textContent = rows.size;
    countFavEl.textContent = [...favorites].filter(s => rows.has(s)).length;

    // 결과가 없을 때 안내 문구
    if (visible === 0 && rows.size > 0) {
        emptyEl.textContent =
            currentTab === "favorites" && favorites.size === 0
                ? "관심항목이 없어요. 전체보기에서 ☆를 눌러 추가해 보세요."
                : `"${searchKeyword}"에 해당하는 코인이 없어요.`;
        emptyEl.classList.remove("hidden");
    } else {
        emptyEl.classList.add("hidden");
    }
}

searchEl.addEventListener("input", (e) => {
    searchKeyword = e.target.value;
    applyFilter();
});

tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentTab = btn.dataset.tab;
        applyFilter();
    });
});

// ================================================
// 5. API 요청 (1초마다)
// ================================================
function setStatus(state, text) {
    statusDot.className = `dot ${state}`;
    statusText.textContent = text;
}

async function fetchTickers() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        // USDT 마켓만, 거래가 있는 코인만
        const usdtCoins = data.filter(
            coin => coin.symbol.endsWith(QUOTE) && Number(coin.lastPrice) > 0
        );

        // 처음 받을 때는 거래대금 큰 순서로 정렬해서 행 생성
        // (매초 다시 정렬하면 행이 계속 위아래로 움직여서 보기 어려움)
        if (rows.size === 0) {
            usdtCoins.sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume));
        }

        let added = false;
        usdtCoins.forEach((coin) => {
            const row = rows.get(coin.symbol) || ((added = true), createRow(coin));
            updateRow(row, coin);
        });
        if (added) applyFilter();

        const time = new Date().toLocaleTimeString("ko-KR");
        setStatus("live", `실시간 · ${time}`);
    } catch (error) {
        console.error("시세를 불러오지 못했어요:", error);
        setStatus("error", "연결 오류 · 재시도 중");
    } finally {
        // 응답을 받은 뒤 1초 후 다음 요청 (요청이 겹치지 않게 setInterval 대신 사용)
        setTimeout(fetchTickers, INTERVAL_MS);
    }
}

fetchTickers();