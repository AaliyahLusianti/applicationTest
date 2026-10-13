import test from "node:test";
import assert from "node:assert/strict";
import {
    searchProducts,
    calculateCart,
    validateCheckout,
    applyPromo,
    createOrder,
} from "./domain.js";

test("pencarian normal tidak peka huruf besar, bug dapat direproduksi", () => {
    assert.equal(searchProducts("canvas", {}).length, 1);
    assert.equal(searchProducts("canvas", { search: true }).length, 0);
});

test("kuantitas normal dibatasi, bug menerima jumlah negatif", () => {
    assert.equal(calculateCart(100000, -2, "", {}).quantity, 1);
    assert.equal(calculateCart(100000, -2, "", { quantity: true }).subtotal, -200000);
    assert.equal(calculateCart(100000, "invalid", "", {}).quantity, 1);
});

test("diskon normal 10%, bug hanya memotong 10 rupiah", () => {
    assert.equal(calculateCart(100000, 1, "hemat10", {}).discount, 10000);
    assert.equal(calculateCart(100000, 1, "HEMAT10", { discount: true }).discount, 10);
});

test("batas ongkir gratis inklusif dalam mode normal", () => {
    assert.equal(calculateCart(100000, 2, "", {}).shipping, 0);
    assert.equal(calculateCart(100000, 2, "", { shipping: true }).shipping, 15000);
});

test("checkout normal memvalidasi email, bug melewati validasi", () => {
    assert.equal(validateCheckout("", {}), false);
    assert.equal(validateCheckout("qa@example.com", {}), true);
    assert.equal(validateCheckout("", { checkout: true }), true);
});

test("proses promo valid sengaja melempar error yang dapat dilaporkan", () => {
    assert.throws(() => applyPromo("HEMAT10"), {
        name: "TypeError",
        message: /PROMO_PROCESS_FAILED/,
    });
    assert.throws(() => applyPromo("LAIN"), /PROMO_NOT_FOUND/);
});

test("checkout gagal pada proses penyimpanan meski email valid", () => {
    assert.throws(() => createOrder("qa@example.com"), /ORDER_CREATE_FAILED/);
    assert.throws(() => createOrder(""), /EMAIL_INVALID/);
});
