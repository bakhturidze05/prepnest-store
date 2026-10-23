const products = [
  {
    id: "peeler",
    name: "Everyday Vegetable Peeler",
    price: 12.00,
    tag: "Kitchen essential",
    description: "A simple prep helper for potatoes, carrots, and more.",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "chopper",
    name: "Compact Prep Helper",
    price: 18.00,
    tag: "Prep made simple",
    description: "A concept pick for making everyday prep feel easier.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "strainer",
    name: "Sink-Side Kitchen Tool",
    price: 9.00,
    tag: "Small space",
    description: "A practical idea for a tidier, more useful kitchen.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80"
  }
];

const cart = new Map();
const productGrid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

const money = amount => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

function renderProducts() {
  productGrid.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.style.display='none'">
        <span class="product-tag">${product.tag}</span>
      </div>
      <div class="product-info">
        <div class="product-title-row"><h3>${product.name}</h3><span class="price">${money(product.price)}</span></div>
        <p class="product-description">${product.description}</p>
        <button class="add-button" data-add="${product.id}">Add to bag +</button>
      </div>
    </article>`).join("");
}

function updateCart() {
  const count = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
  const total = [...cart.entries()].reduce((sum, [id, quantity]) => {
    const product = products.find(item => item.id === id);
    return sum + (product ? product.price * quantity : 0);
  }, 0);
  cartCount.textContent = count;
  cartTotal.textContent = money(total);

  if (cart.size === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your bag is empty for now.</p>';
    return;
  }

  cartItems.innerHTML = [...cart.entries()].map(([id, quantity]) => {
    const product = products.find(item => item.id === id);
    return `<div class="cart-item">
      <div><strong>${product.name}</strong><span>${money(product.price)} × ${quantity}</span><br><button data-remove="${id}">Remove one</button></div>
      <strong>${money(product.price * quantity)}</strong>
    </div>`;
  }).join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  overlay.classList.add("visible");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  overlay.classList.remove("visible");
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const id = button.dataset.add;
  cart.set(id, (cart.get(id) || 0) + 1);
  updateCart();
  showToast("Added to your demo bag");
});
cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  const id = button.dataset.remove;
  const quantity = cart.get(id) || 0;
  if (quantity <= 1) cart.delete(id);
  else cart.set(id, quantity - 1);
  updateCart();
});
document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.getElementById("checkoutButton").addEventListener("click", () => {
  showToast("Demo only — payment checkout is not connected.");
});
document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
updateCart();
