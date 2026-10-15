// ====== Edit products here. Add photo: set "img" to a file in /assets and it replaces the jar. ======
const WHATSAPP = "917868933348";
const PRODUCTS = [
  { id: "mango",  cat: "Pickles",    name: "Mango Pickle (Avakkai)", ta: "மாங்காய் ஊறுகாய்", price: 120, size: "250 g", jar: "j-red",   desc: "Raw mango, hand-ground spices and sesame oil." },
  { id: "garlic", cat: "Pickles",    name: "Garlic Pickle",          ta: "பூண்டு ஊறுகாய்",   price: 130, size: "250 g", jar: "j-deep",  desc: "Slow-marinated in tamarind and red chilli oil." },
  { id: "sambar", cat: "Podis",      name: "Sambar Powder",          ta: "சாம்பார் பொடி",    price: 90,  size: "200 g", jar: "j-gold",  desc: "Coriander, cumin and chillies, stone-ground fresh." },
  { id: "rasam",  cat: "Podis",      name: "Rasam Powder",           ta: "ரசப் பொடி",        price: 70,  size: "100 g", jar: "j-red",   desc: "Tangy, peppery and made with traditional spices." },
  { id: "coconut",cat: "Podis",      name: "Coconut Chutney Powder", ta: "தேங்காய் பொடி",    price: 80,  size: "150 g", jar: "j-brown", desc: "Dry chutney podi for idli, dosa and hot rice." },
  { id: "puli",   cat: "Rice mixes", name: "Puliyodharai Mix",       ta: "புளியோதரை மிக்ஸ்", price: 110, size: "200 g", jar: "j-green", desc: "Tamarind rice paste. Stir into cooked rice." }
];
// ====================================================================================================

const $ = s => document.querySelector(s);
const inr = n => "₹" + n.toLocaleString("en-IN");
let cart = {}, filter = "All";

try { cart = JSON.parse(localStorage.getItem("narpavi-cart")) || {}; } catch (e) { cart = {}; }
const save = () => { try { localStorage.setItem("narpavi-cart", JSON.stringify(cart)); } catch (e) {} };

function renderFilters() {
  const cats = ["All", ...new Set(PRODUCTS.map(p => p.cat))];
  $("#filters").innerHTML = cats.map(c => `<button aria-pressed="${c === filter}" data-cat="${c}">${c}</button>`).join("");
}

function renderGrid() {
  const list = PRODUCTS.filter(p => filter === "All" || p.cat === filter);
  $("#grid").innerHTML = list.map(p => `
    <article class="card">
      <div class="stage">${p.img ? `<img src="${p.img}" alt="${p.name}" height="200">` : `<div class="jar ${p.jar}" aria-hidden="true"><i lang="ta">${p.ta}</i></div>`}</div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="row"><span class="price">${inr(p.price)} <small>/ ${p.size}</small></span>
      <button class="add" data-add="${p.id}" aria-label="Add ${p.name} to basket">Add</button></div>
    </article>`).join("");
}

function renderCart() {
  const items = Object.entries(cart).map(([id, q]) => ({ p: PRODUCTS.find(x => x.id === id), q })).filter(i => i.p);
  const count = items.reduce((s, i) => s + i.q, 0);
  const total = items.reduce((s, i) => s + i.q * i.p.price, 0);
  $("#cart-count").textContent = count;
  $("#total").textContent = inr(total);
  $("#empty").hidden = items.length > 0;
  $("#drawer").classList.toggle("empty-state", items.length === 0);
  $("#lines").innerHTML = items.map(({ p, q }) => `
    <li><span class="nm">${p.name}</span>
    <span class="sub">${p.size} · ${inr(p.price)} each</span>
    <span class="qty"><button data-dec="${p.id}" aria-label="Remove one ${p.name}">−</button><b>${q}</b><button data-inc="${p.id}" aria-label="Add one ${p.name}">+</button></span></li>`).join("");
}

function change(id, d) {
  cart[id] = (cart[id] || 0) + d;
  if (cart[id] <= 0) delete cart[id];
  save(); renderCart();
}

function toggleDrawer(open) {
  $("#drawer").classList.toggle("open", open);
  $("#drawer").setAttribute("aria-hidden", String(!open));
  $("#scrim").hidden = !open;
  if (open) $("#close-cart").focus(); else $("#open-cart").focus();
}

document.addEventListener("click", e => {
  const t = e.target;
  if (t.dataset.cat) { filter = t.dataset.cat; renderFilters(); renderGrid(); }
  if (t.dataset.add) { change(t.dataset.add, 1); t.textContent = "Added"; setTimeout(() => (t.textContent = "Add"), 900); }
  if (t.dataset.inc) change(t.dataset.inc, 1);
  if (t.dataset.dec) change(t.dataset.dec, -1);
});
$("#open-cart").onclick = () => toggleDrawer(true);
$("#close-cart").onclick = $("#scrim").onclick = () => toggleDrawer(false);
document.addEventListener("keydown", e => { if (e.key === "Escape") toggleDrawer(false); });

$("#order-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#f-name").value.trim(), phone = $("#f-phone").value.trim(), addr = $("#f-address").value.trim();
  if (!name || !phone || !addr) { $("#err").textContent = "Please fill in your name, phone and address."; return; }
  $("#err").textContent = "";
  const lines = Object.entries(cart).map(([id, q]) => { const p = PRODUCTS.find(x => x.id === id); return p ? `- ${p.name} (${p.size}) x ${q} = ${inr(p.price * q)}` : ""; }).filter(Boolean);
  const total = Object.entries(cart).reduce((s, [id, q]) => s + q * (PRODUCTS.find(x => x.id === id)?.price || 0), 0);
  const msg = `Hello Narpavi Home Foods, I would like to order:\n${lines.join("\n")}\nItems total: ${inr(total)}\n\nName: ${name}\nPhone: ${phone}\nAddress: ${addr}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});

$("#year").textContent = new Date().getFullYear();
renderFilters(); renderGrid(); renderCart();
