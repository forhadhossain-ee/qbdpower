/*
  QBD POWER — GALLERY SCRIPT

  Behaviour:
  - "All" filter: progressive loading
      1st view  → 12 photos
      Load More → 40 photos
      Load More → all remaining photos
  - Any specific filter (Plumbing / Mechanical / Electrical / Manpower):
      shows ALL photos of that category at once
  - URL param support: gallery.html?filter=plumbing
  - Lightbox with prev / next / esc / arrow keys
*/

document.addEventListener("DOMContentLoaded", () => {

  const galleryGrid   = document.getElementById("galleryGrid");
  const galleryEmpty  = document.getElementById("galleryEmpty");
  const galleryLoadWrap = document.getElementById("galleryLoadWrap");
  const loadMoreButton  = document.getElementById("galleryLoadMore");
  const filterButtons   = document.querySelectorAll(".gallery-filter");

  if (!galleryGrid) return;

  // -----------------------------------------------------
  // PROGRESSIVE PAGE SIZES
  // -----------------------------------------------------
  const PAGE_SIZES = [12, 40, Infinity];
  let pageIndex = 0;

  let currentCategory = "all";
  let filteredGallery = [];

  // Lightbox state
  let lightbox;
  let lightboxImage;
  let lightboxCaption;
  let lightboxProject;
  let lightboxCurrentIndex = 0;

  // -----------------------------------------------------
  // URL PARAM SUPPORT — gallery.html?filter=plumbing
  // -----------------------------------------------------
  const urlParams = new URLSearchParams(window.location.search);
  const urlFilter = urlParams.get("filter");
  const validCategories = ["plumbing", "mechanical", "electrical", "manpower"];
  if (urlFilter && validCategories.includes(urlFilter)) {
    currentCategory = urlFilter;
  }

  // -----------------------------------------------------
  // DATA ACCESS
  // -----------------------------------------------------
  function getGalleryData() {
    return (typeof QBD_GALLERY !== "undefined" && Array.isArray(QBD_GALLERY))
      ? QBD_GALLERY
      : [];
  }

  function getVisibleLimit() {
    return PAGE_SIZES[Math.min(pageIndex, PAGE_SIZES.length - 1)];
  }

  // -----------------------------------------------------
  // LIGHTBOX
  // -----------------------------------------------------
  function createLightbox() {
    lightbox = document.createElement("div");
    lightbox.className = "gallery-lightbox";

    lightbox.innerHTML = `
      <button class="gallery-lightbox__close" type="button" aria-label="Close gallery">&times;</button>
      <button class="gallery-lightbox__prev" type="button" aria-label="Previous image">&#10094;</button>
      <div class="gallery-lightbox__figure">
        <img class="gallery-lightbox__image" src="" alt="">
        <div class="gallery-lightbox__caption">
          <strong></strong>
          <span></span>
        </div>
      </div>
      <button class="gallery-lightbox__next" type="button" aria-label="Next image">&#10095;</button>
    `;

    document.body.appendChild(lightbox);

    lightboxImage   = lightbox.querySelector(".gallery-lightbox__image");
    lightboxCaption = lightbox.querySelector(".gallery-lightbox__caption strong");
    lightboxProject = lightbox.querySelector(".gallery-lightbox__caption span");

    lightbox.querySelector(".gallery-lightbox__close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".gallery-lightbox__prev").addEventListener("click", showPreviousImage);
    lightbox.querySelector(".gallery-lightbox__next").addEventListener("click", showNextImage);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  function openLightbox(index) {
    if (!filteredGallery.length) return;
    if (!lightbox) createLightbox();
    lightboxCurrentIndex = index;
    updateLightbox();
    lightbox.classList.add("is-open");
    document.body.classList.add("gallery-lightbox-open");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.classList.remove("gallery-lightbox-open");
  }

  function updateLightbox() {
    const item = filteredGallery[lightboxCurrentIndex];
    if (!item || !lightboxImage) return;
    lightboxImage.src = item.src;
    lightboxImage.alt = item.caption || "QBD Power project image";
    lightboxCaption.textContent = item.caption || "";
    lightboxProject.textContent = item.project || "";
  }

  function showNextImage() {
    if (!filteredGallery.length) return;
    lightboxCurrentIndex = (lightboxCurrentIndex + 1) % filteredGallery.length;
    updateLightbox();
  }

  function showPreviousImage() {
    if (!filteredGallery.length) return;
    lightboxCurrentIndex = (lightboxCurrentIndex - 1 + filteredGallery.length) % filteredGallery.length;
    updateLightbox();
  }

  document.addEventListener("keydown", (event) => {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") showNextImage();
    if (event.key === "ArrowLeft") showPreviousImage();
  });

  // -----------------------------------------------------
  // FILTER + FORMAT HELPERS
  // -----------------------------------------------------
  function getFilteredGallery() {
    const data = getGalleryData();
    if (currentCategory === "all") return data;
    return data.filter(item => item.category === currentCategory);
  }

  function formatCategory(category) {
    const labels = {
      plumbing: "Plumbing",
      mechanical: "Mechanical / HVAC",
      electrical: "Electrical",
      manpower: "Manpower / Workforce"
    };
    return labels[category] || "";
  }

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------
  function renderGallery() {

    filteredGallery = getFilteredGallery();
    galleryGrid.innerHTML = "";

    const isAllView = currentCategory === "all";
    const limit = isAllView ? getVisibleLimit() : filteredGallery.length;
    const itemsToShow = filteredGallery.slice(0, limit);

    // Empty state
    if (!itemsToShow.length) {
      if (galleryEmpty) galleryEmpty.hidden = false;
      if (galleryLoadWrap) galleryLoadWrap.hidden = true;
      return;
    }
    if (galleryEmpty) galleryEmpty.hidden = true;

    // Build cards
    itemsToShow.forEach((item, index) => {

      const card = document.createElement("article");
      card.className = "gallery-card";
      card.dataset.category = item.category || "";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", "Open " + (item.caption || "gallery image"));

      card.innerHTML = `
        <div class="gallery-card__media">
          <img src="${item.src}" alt="${item.caption || "QBD Power project image"}" loading="lazy">
        </div>
        <span class="gallery-card__overlay">
          <span class="gallery-card__category">${formatCategory(item.category)}</span>
          <span class="gallery-card__caption">${item.caption || ""}</span>
          ${item.project ? `<span class="gallery-card__project">${item.project}</span>` : ""}
        </span>
      `;

      const image = card.querySelector("img");
      image.addEventListener("error", () => card.remove());

      card.addEventListener("click", () => openLightbox(index));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(index);
        }
      });

      galleryGrid.appendChild(card);

    });

    // Load More visibility — only in "All" view AND when cards exist
    if (galleryLoadWrap) {
      const visibleCards = galleryGrid.querySelectorAll(".gallery-card").length;
      if (!isAllView || visibleCards === 0) {
        galleryLoadWrap.hidden = true;
      } else {
        galleryLoadWrap.hidden = limit >= filteredGallery.length;
      }
    }

  }

  // -----------------------------------------------------
  // APPLY URL FILTER TO ACTIVE BUTTON STATE
  // -----------------------------------------------------
  if (urlFilter && validCategories.includes(urlFilter)) {
    filterButtons.forEach(btn => {
      btn.classList.remove("is-active");
      btn.setAttribute("aria-selected", "false");
    });
    const matchBtn = [...filterButtons].find(b => b.dataset.galleryFilter === urlFilter);
    if (matchBtn) {
      matchBtn.classList.add("is-active");
      matchBtn.setAttribute("aria-selected", "true");
    }
  }

  // -----------------------------------------------------
  // FILTER BUTTONS
  // -----------------------------------------------------
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {

      currentCategory = button.dataset.galleryFilter || "all";
      pageIndex = 0;

      filterButtons.forEach(item => {
        item.classList.remove("is-active");
        item.setAttribute("aria-selected", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-selected", "true");

      // Update URL param
      const newUrl = currentCategory === "all"
        ? window.location.pathname
        : `${window.location.pathname}?filter=${currentCategory}`;
      window.history.replaceState({}, "", newUrl);

      renderGallery();

    });
  });

  // -----------------------------------------------------
  // LOAD MORE
  // -----------------------------------------------------
  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", () => {
      pageIndex++;
      renderGallery();
    });
  }

  // Initial render
  renderGallery();

});