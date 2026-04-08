const SHEET_URL = "https://opensheet.elk.sh/174bSqnxryAuErbXF13a4d2djlSzFT3Lg304vwWDeAXc/Sheet1";

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
const statusMessage = document.getElementById("statusMessage");

let allProducts = [];

function showStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.remove("hidden", "error");

  if (isError) {
    statusMessage.classList.add("error");
  }
}

function hideStatus() {
  statusMessage.classList.add("hidden");
  statusMessage.classList.remove("error");
}

function createProductCard(product) {
  return `
    <article class="product-card">
      <img class="product-image" src="${product.image}" alt="${product.title}">
      <div class="product-body">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-description">${product.description}</p>
        <a class="product-button" href="${product.link}" target="_blank" rel="noopener noreferrer">
          View on Amazon
        </a>
      </div>
    </article>
  `;
}

function updateResultsCount(total) {
  resultsCount.textContent = `${total} product${total === 1 ? "" : "s"}`;
}

function renderProducts(products) {
  productGrid.innerHTML = products.map(createProductCard).join("");
  updateResultsCount(products.length);
  emptyState.style.display = products.length === 0 ? "block" : "none";
}

function filterProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filteredProducts = allProducts.filter((product) =>
    product.title.toLowerCase().includes(query)
  );

  renderProducts(filteredProducts);
}

function cleanProduct(item) {
  return {
    title: item.title ? item.title.trim() : "Untitled Product",
    image: item.image ? item.image.trim() : "https://via.placeholder.com/600x450?text=No+Image",
    description: item.description ? item.description.trim() : "No description available.",
    link: item.link ? item.link.trim() : "#"
  };
}

async function fetchProducts() {
  showStatus("Loading products...");
  updateResultsCount(0);
  emptyState.style.display = "none";

  try {
    const response = await fetch(SHEET_URL);

    if (!response.ok) {
      throw new Error("Could not fetch sheet data.");
    }

    const data = await response.json();

    allProducts = data.map(cleanProduct);
    renderProducts(allProducts);

    if (allProducts.length === 0) {
      showStatus("No products were found in the sheet.");
    } else {
      hideStatus();
    }
  } catch (error) {
    productGrid.innerHTML = "";
    showStatus("Failed to load products. Check the sheet URL and try again.", true);
    updateResultsCount(0);
  }
}

searchInput.addEventListener("input", filterProducts);

fetchProducts();
