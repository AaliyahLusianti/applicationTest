import { createIcons, ShoppingBag, Search, Check, ArrowRight, RotateCcw } from "lucide";
import { products, searchProducts, calculateCart, applyPromo, createOrder } from "./domain.js";
import "./style.css";

const icons = { ShoppingBag, Search, Check, ArrowRight, RotateCcw };
const bugs = { search: true, quantity: true, discount: true, shipping: true };
const app = document.querySelector("#app");
const money = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
let selectedProduct = products[0].id;
let quantity = 1;
let appliedPromo = "";
let search = "";

function showProcessError(selector, error) {
    const feedback = document.querySelector(selector);
    feedback.classList.add("error");
    feedback.setAttribute("role", "alert");
    feedback.textContent = `Error! ${error.message}`;
    console.error(error);
}

function renderProducts() {
    const matches = searchProducts(search, bugs);
    document.querySelector("#products").innerHTML = matches.length
        ? matches
              .map(
                  (product) =>
                      `<button class="product ${selectedProduct === product.id ? "selected" : ""}" data-product="${product.id}" aria-pressed="${selectedProduct === product.id}"><div class="product-image"><img src="${product.image}" alt="${product.name}" referrerpolicy="no-referrer"><span class="product-check">${icon("check")}</span></div><small>${product.category}</small><strong>${product.name}</strong><span>${money(product.price)}</span></button>`,
              )
              .join("")
        : '<p class="empty">Produk tidak ditemukan.</p>';
    createIcons({ icons });
}

function updateCart() {
    const product = products.find((item) => item.id === selectedProduct);
    const cart = calculateCart(product.price, quantity, appliedPromo, bugs);
    document.querySelector("#selected-product").textContent = product.name;
    document.querySelector("#cart-summary").innerHTML =
        `<div class="cart-line"><span>Subtotal (${cart.quantity} barang)</span><strong>${money(cart.subtotal)}</strong></div><div class="cart-line"><span>Diskon</span><strong>-${money(cart.discount)}</strong></div><div class="cart-line"><span>Ongkir</span><strong>${cart.shipping ? money(cart.shipping) : "Gratis"}</strong></div><div class="cart-total"><span>Total</span><strong>${money(cart.total)}</strong></div>`;
}

function render() {
    app.innerHTML = `<header class="topbar"><a class="brand" href="/">${icon("shopping-bag")} everyday<span>store</span></a><span class="demo-tag">DEMO</span></header><main><section class="catalog"><div class="catalog-heading"><div><span class="eyebrow">THE EVERYDAY COLLECTION</span><h1>Pilihan sederhana.</h1><p>Barang favorit untuk keseharian.</p></div><span class="edition">EDISI 001</span></div><label class="search-field">${icon("search")}<input id="search" placeholder="Cari produk..." aria-label="Cari produk"></label><div id="products" class="products"></div><div class="store-policy"><span>Promo <strong>HEMAT10</strong> : diskon 10%</span><span>Gratis ongkir mulai Rp200.000</span></div></section><section class="checkout"><div class="checkout-heading"><h2>Pesanan kamu</h2><button type="button" id="reset" class="icon-button" title="Reset pesanan" aria-label="Reset pesanan">${icon("rotate-ccw")}</button></div><div class="selected-product"><span>Produk dipilih</span><strong id="selected-product"></strong></div><form id="checkout-form" novalidate><label>Jumlah barang<input id="quantity" type="number" step="1" value="1"></label><label>Kode promo<div class="input-action"><input id="promo" placeholder="HEMAT10"><button type="button" id="apply-promo" class="button secondary">Terapkan</button></div></label><p id="promo-result" class="feedback" role="status"></p><label>Email pembeli<input id="email" type="email" placeholder="nama@email.com"></label><div id="cart-summary" class="cart-summary"></div><button type="submit" class="button primary">Buat pesanan ${icon("arrow-right")}</button><p id="checkout-result" class="feedback" role="status"></p></form></section></main><footer><span>everyday store</span><span>Sandbox / Tidak ada transaksi nyata</span></footer>`;
    renderProducts();
    updateCart();
}

app.addEventListener("input", (event) => {
    if (event.target.id === "search") {
        search = event.target.value;
        renderProducts();
    }
    if (event.target.id === "quantity") {
        quantity = event.target.value;
        updateCart();
        document.querySelector("#checkout-result").textContent = "";
    }
});

app.addEventListener("click", (event) => {
    const product = event.target.closest("[data-product]");
    if (product) {
        selectedProduct = product.dataset.product;
        renderProducts();
        updateCart();
        document.querySelector("#checkout-result").textContent = "";
    }
    if (event.target.closest("#apply-promo")) {
        try {
            applyPromo(document.querySelector("#promo").value);
        } catch (error) {
            showProcessError("#promo-result", error);
        }
    }
    if (event.target.closest("#reset")) {
        selectedProduct = products[0].id;
        quantity = 1;
        appliedPromo = "";
        search = "";
        render();
    }
});

app.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
        createOrder(document.querySelector("#email").value);
    } catch (error) {
        showProcessError("#checkout-result", error);
    }
});

render();
