
const tops = [
  { id: "top1", name: "White T-Shirt", detail: "Casual", color: "#e5e7eb", type: "top" },
  { id: "top2", name: "Black Hoodie", detail: "Streetwear", color: "#111827", type: "top" },
  { id: "top3", name: "Denim Jacket", detail: "Layer", color: "#3b82f6", type: "top" },
  { id: "top4", name: "Beige Sweater", detail: "Cozy", color: "#d6c098", type: "top" }
];

const bottoms = [
  { id: "bottom1", name: "Blue Jeans", detail: "Slim fit", color: "#1d4ed8", type: "bottom" },
  { id: "bottom2", name: "Black Joggers", detail: "Relaxed", color: "#030712", type: "bottom" },
  { id: "bottom3", name: "Khaki Chinos", detail: "Smart casual", color: "#b59b6a", type: "bottom" },
  { id: "bottom4", name: "Grey Shorts", detail: "Summer", color: "#9ca3af", type: "bottom" }
];

const shoes = [
  { id: "shoes1", name: "White Sneakers", detail: "Everyday", color: "#f3f4f6", type: "shoes" },
  { id: "shoes2", name: "Black Boots", detail: "Chunky", color: "#020617", type: "shoes" },
  { id: "shoes3", name: "Running Shoes", detail: "Sport", color: "#22c55e", type: "shoes" },
  { id: "shoes4", name: "Brown Loafers", detail: "Formal", color: "#92400e", type: "shoes" }
];

const accessories = [
  { id: "acc1", name: "Black Cap", detail: "Street", color: "#020617", type: "accessory" },
  { id: "acc2", name: "Silver Watch", detail: "Minimal", color: "#9ca3af", type: "accessory" },
  { id: "acc3", name: "Tote Bag", detail: "Canvas", color: "#d1d5db", type: "accessory" },
  { id: "acc4", name: "Gold Chain", detail: "Statement", color: "#facc15", type: "accessory" }
];


let selected = {
  top: null,
  bottom: null,
  shoes: null,
  accessory: null
};

let savedOutfits = [];

function $(selector) {
  return document.querySelector(selector);
}

function createItemCard(item) {
  const card = document.createElement("div");
  card.className = "item-card";
  card.dataset.id = item.id;
  card.dataset.type = item.type;

  const swatch = document.createElement("div");
  swatch.className = "item-swatch";
  swatch.style.backgroundColor = item.color;

  const info = document.createElement("div");
  info.className = "item-info";

  const nameEl = document.createElement("span");
  nameEl.className = "item-name";
  nameEl.textContent = item.name;

  const detailEl = document.createElement("span");
  detailEl.className = "item-detail";
  detailEl.textContent = item.detail;

  info.appendChild(nameEl);
  info.appendChild(detailEl);

  card.appendChild(swatch);
  card.appendChild(info);

  card.addEventListener("click", () => {
    handleSelect(item);
  });

  return card;
}

function renderCatalog() {
  const topsList = $("#tops-list");
  const bottomsList = $("#bottoms-list");
  const shoesList = $("#shoes-list");
  const accessoriesList = $("#accessories-list");

  tops.forEach((item) => topsList.appendChild(createItemCard(item)));
  bottoms.forEach((item) => bottomsList.appendChild(createItemCard(item)));
  shoes.forEach((item) => shoesList.appendChild(createItemCard(item)));
  accessories.forEach((item) => accessoriesList.appendChild(createItemCard(item)));
}

function handleSelect(item) {
  selected[item.type] = item;
  updateSelectedCards();
  updatePreview();
}

function updateSelectedCards() {
  const cards = document.querySelectorAll(".item-card");
  cards.forEach((card) => {
    const type = card.dataset.type;
    const id = card.dataset.id;
    const isSelected =
      selected[type] && selected[type].id === id;
    card.classList.toggle("selected", isSelected);
  });
}

function updatePreview() {
  const mapping = [
    { type: "top", id: "preview-top" },
    { type: "bottom", id: "preview-bottom" },
    { type: "shoes", id: "preview-shoes" },
    { type: "accessory", id: "preview-accessory" }
  ];

  mapping.forEach(({ type, id }) => {
    const part = document.getElementById(id);
    const nameEl = part.querySelector(".preview-name");
    const item = selected[type];

    if (item) {
      nameEl.textContent = item.name;
      part.style.background = "#020617";
      part.style.borderColor = item.color;
      part.classList.add("has-item");
    } else {
      nameEl.textContent = "None";
      part.style.background = "#020617";
      part.style.borderColor = "#1f2937";
      part.classList.remove("has-item");
    }
  });
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildRandomOutfit() {
  selected.top = randomChoice(tops);
  selected.bottom = randomChoice(bottoms);
  selected.shoes = randomChoice(shoes);
  selected.accessory = randomChoice(accessories);
  updateSelectedCards();
  updatePreview();
}

function clearOutfit() {
  selected = { top: null, bottom: null, shoes: null, accessory: null };
  updateSelectedCards();
  updatePreview();
}


const STORAGE_KEY = "outfitBuilder_savedOutfits";

function loadSavedOutfits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    savedOutfits = raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load outfits", e);
    savedOutfits = [];
  }
  renderSavedOutfits();
}

function persistSavedOutfits() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedOutfits));
}

function saveCurrentOutfit() {
  if (!selected.top || !selected.bottom || !selected.shoes) {
    alert("Please choose at least a top, bottom, and shoes before saving.");
    return;
  }

  const outfit = {
    id: Date.now(),
    name: `Outfit #${savedOutfits.length + 1}`,
    parts: { ...selected }
  };

  savedOutfits.unshift(outfit);
  persistSavedOutfits();
  renderSavedOutfits();
}

function renderSavedOutfits() {
  const container = $("#saved-list");
  container.innerHTML = "";

  if (savedOutfits.length === 0) {
    const p = document.createElement("p");
    p.className = "empty-message";
    p.textContent =
      'No outfits saved yet. Build one and hit "Save Outfit".';
    container.appendChild(p);
    return;
  }

  savedOutfits.forEach((outfit) => {
    const card = document.createElement("div");
    card.className = "saved-card";

    const main = document.createElement("div");
    main.className = "saved-main";

    const name = document.createElement("div");
    name.className = "saved-name";
    name.textContent = outfit.name;

    const summary = document.createElement("div");
    summary.className = "saved-summary";
    const p = outfit.parts;
    summary.textContent = [
      p.top?.name || "–",
      p.bottom?.name || "–",
      p.shoes?.name || "–",
      p.accessory?.name || "–"
    ]
      .filter((x) => x !== "–")
      .join(" • ");

    main.appendChild(name);
    main.appendChild(summary);

    const actions = document.createElement("div");
    actions.className = "saved-actions";

    const loadBtn = document.createElement("button");
    loadBtn.textContent = "Load";
    loadBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      loadOutfit(outfit);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteOutfit(outfit.id);
    });

    actions.appendChild(loadBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(main);
    card.appendChild(actions);

    card.addEventListener("click", () => {
      loadOutfit(outfit);
    });

    container.appendChild(card);
  });
}

function loadOutfit(outfit) {
  selected = { ...outfit.parts };
  updateSelectedCards();
  updatePreview();
}

function deleteOutfit(id) {
  savedOutfits = savedOutfits.filter((o) => o.id !== id);
  persistSavedOutfits();
  renderSavedOutfits();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  loadSavedOutfits();
  updatePreview();

  $("#random-btn").addEventListener("click", buildRandomOutfit);
  $("#clear-btn").addEventListener("click", clearOutfit);
  $("#save-btn").addEventListener("click", saveCurrentOutfit);
});