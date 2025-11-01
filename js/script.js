console.log("script.js loaded");

const endpoint =
  "https://api.giphy.com/v1/gifs/search?api_key=7pjas0f6FtfAOWLryxZIZG0D6FvoCeLg&q=memes&limit=25&offset=0&rating=g&lang=en&bundle=messaging_non_clips";

const API_KEY = "7pjas0f6FtfAOWLryxZIZG0D6FvoCeLg";
const LIMIT = 25;
const RATING = "g";
const DEFAULT_QUERY = "memes";
function buildEndpoint(query) {
  const base = "https://api.giphy.com/v1/gifs/search";
  const params = new URLSearchParams({
    api_key: API_KEY,
    q: query,
    limit: LIMIT,
    offset: 0,
    rating: RATING,
    lang: "en",
    bundle: "messaging_non_clips",
  });
  return `${base}?${params.toString()}`;
}

const gifContainer = document.querySelector("#gif-container");
const fetchBtn = document.querySelector("#fetch-gif-btn");
const searchInput = document.querySelector("#search-input"); 
const statusEl = document.querySelector("#status");
const clearBtn = document.querySelector("#clear-btn"); 

function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
}

async function fetchGifsByUrl(url) {
  try {
    setStatus("Fetching GIFs...");
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const json = await res.json();
    console.log("[DEBUG] Full JSON:", json); 

    const images = json.data.map((item) => item.images.original.url);
    console.log("[DEBUG] images:", images); 
    setStatus(`Found ${images.length} GIFs.`);
    return images;
  } catch (err) {
    console.error(err);
    setStatus(`Error: ${err.message}`);
    return [];
  }
}

function renderGifs(images, { replace = true } = {}) {
  if (!gifContainer) return;
  const html = images
    .map(
      (url) => `
        <div class="col-6 col-md-4 col-lg-3 mb-3">
          <img src="${url}" alt="GIF result" loading="lazy" class="w-100 rounded-3" />
        </div>`
    )
    .join("");

  if (replace) {
    gifContainer.innerHTML = html;
  } else {
    gifContainer.innerHTML += html; 
  }
}

if (fetchBtn) {
  fetchBtn.addEventListener("click", async () => {
    const term = (searchInput?.value || DEFAULT_QUERY).trim();
    const urlToUse = searchInput ? buildEndpoint(term) : endpoint;

    const prev = fetchBtn.textContent;
    fetchBtn.disabled = true;
    fetchBtn.textContent = "Loading...";

    const images = await fetchGifsByUrl(urlToUse);
    renderGifs(images, { replace: true });

    fetchBtn.disabled = false;
    fetchBtn.textContent = prev;
  });
}

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    if (gifContainer) gifContainer.innerHTML = "";
    setStatus("Cleared.");
    if (searchInput) searchInput.value = "";
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  const initialUrl = searchInput ? buildEndpoint(DEFAULT_QUERY) : endpoint;
  const images = await fetchGifsByUrl(initialUrl);
  renderGifs(images, { replace: true });
});

