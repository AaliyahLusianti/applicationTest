export const products = [
    {
        id: "tote",
        name: "Canvas Tote",
        category: "Everyday carry",
        price: 100000,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=85",
    },
    {
        id: "headphone",
        name: "Studio Headphones",
        category: "Audio essentials",
        price: 350000,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=85",
    },
    {
        id: "camera",
        name: "Pocket Camera",
        category: "Capture the everyday",
        price: 750000,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=85",
    },
];

export function searchProducts(query, bugs) {
    return products.filter((product) =>
        bugs.search
            ? product.name.includes(query.trim())
            : product.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
}

export function calculateCart(price, inputQuantity, promo, bugs) {
    const parsed = Number(inputQuantity);
    const quantity = Number.isFinite(parsed)
        ? bugs.quantity
            ? Math.trunc(parsed)
            : Math.max(1, Math.trunc(parsed))
        : 1;
    const subtotal = price * quantity;
    const discount =
        promo.trim().toUpperCase() === "HEMAT10" ? (bugs.discount ? 10 : subtotal * 0.1) : 0;
    const freeShipping = bugs.shipping ? subtotal > 200000 : subtotal >= 200000;
    const shipping = freeShipping ? 0 : 15000;
    return { quantity, subtotal, discount, shipping, total: subtotal - discount + shipping };
}

export function validateCheckout(email, bugs) {
    return bugs.checkout || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function applyPromo(code) {
    if (code.trim().toUpperCase() !== "HEMAT10") {
        throw new Error("PROMO_NOT_FOUND: Kode promo tidak tersedia.");
    }
    throw new TypeError(
        "PROMO_PROCESS_FAILED: Gagal membaca persentase diskon dari data promo yang undefined.",
    );
}

export function createOrder(email) {
    if (!validateCheckout(email, {})) {
        throw new Error("EMAIL_INVALID: Email wajib diisi dengan format yang benar.");
    }
    throw new Error(
        "ORDER_CREATE_FAILED: Proses penyimpanan pesanan gagal. Data pesanan tidak berhasil dibuat.",
    );
}
