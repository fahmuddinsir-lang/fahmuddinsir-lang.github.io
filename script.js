// ANIMASI CARD
const cards = document.querySelectorAll(".card");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
});
cards.forEach(card => observer.observe(card));

/* ================= CART ================= */
// ================= CART MODERN =================
const cart = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const openCartBtn = document.getElementById("open-cart");
const closeCartBtn = document.getElementById("close-cart");
const checkoutBtn = document.getElementById("checkout");

let cartArray = JSON.parse(localStorage.getItem("cart")) || [];

// buka tutup cart
openCartBtn.onclick = () => cart.classList.add("open");
closeCartBtn.onclick = () => cart.classList.remove("open");

// tambah ke cart
document.querySelectorAll(".btn-beli").forEach(btn => {
  btn.onclick = () => {
    const card = btn.closest(".card");
    addToCart(card);
  };
});

function addToCart(card) {
  const name = card.querySelector("h3").textContent;
  const price = parseInt(card.querySelector(".price").textContent.replace(/\D/g,""));

  const existing = cartArray.find(item => item.name === name);
  if(existing){
    existing.qty++;
  } else {
    cartArray.push({name, price, qty: 1});
  }

  saveCart();
  updateCart();
  cart.classList.add("open");
}

// simpan ke localStorage
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cartArray));
}

// update tampilan
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cartArray.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>${item.name}</b><br>
      Rp ${item.price.toLocaleString()} x ${item.qty}
      <div class="qty-btn">
        <button class="minus">−</button>
        <button class="plus">+</button>
        <button class="remove">🗑</button>
      </div>
    `;

    // tombol +
    li.querySelector(".plus").onclick = () => {
      item.qty++;
      saveCart();
      updateCart();
    };

    // tombol -
    li.querySelector(".minus").onclick = () => {
      if(item.qty > 1) item.qty--;
      saveCart();
      updateCart();
    };

    // hapus
    li.querySelector(".remove").onclick = () => {
      cartArray.splice(i,1);
      saveCart();
      updateCart();
    };

    cartItems.appendChild(li);
    total += item.price * item.qty;
  });

  cartTotal.textContent = "Rp " + total.toLocaleString();
  openCartBtn.setAttribute("data-count", cartArray.length);
}

// checkout WhatsApp
checkoutBtn.onclick = () => {
  if(cartArray.length === 0) return alert("Keranjang kosong!");

  let msg = "Halo, saya mau pesan:%0A";
  cartArray.forEach(item => {
    msg += `- ${item.name} (${item.qty}x) Rp ${item.price.toLocaleString()}%0A`;
  });
  msg += `%0ATotal: ${cartTotal.textContent}`;

  window.open("https://wa.me/6281376167831?text=" + msg, "_blank");
};

// load saat buka web
updateCart();

/* ================= MODAL PRODUK ================= */
const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-img");
const modalName = document.getElementById("modal-name");
const modalDesc = document.getElementById("modal-desc");
const modalPrice = document.getElementById("modal-price");
const closeModal = document.getElementById("close-modal");
const modalBuy = document.getElementById("modal-beli");

// klik gambar produk buka modal
document.querySelectorAll(".card img").forEach(img => {
  img.onclick = () => {
    const card = img.closest(".card");
    modalImg.src = img.src;
    modalName.textContent = card.querySelector("h3").textContent;
    modalDesc.textContent = card.querySelector("p").textContent;
    modalPrice.textContent = card.querySelector(".price").textContent;
    modal.classList.add("show");
  };
});

// tutup modal
closeModal.onclick = () => modal.classList.remove("show");
window.onclick = e => { if(e.target === modal) modal.classList.remove("show"); };

// beli dari modal
modalBuy.onclick = () => {
  const name = modalName.textContent;
  const price = parseInt(modalPrice.textContent.replace(/\D/g,""));
  updateCart();
  modal.classList.remove("show");
  cart.classList.add("open");
};