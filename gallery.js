import { galleryItems } from "./app.js";

const galleryContainerEl = document.querySelector(".js-gallery");
const modalLightboxEl = document.querySelector(".js-lightbox");
const modalLightboxOverlay = document.querySelector(".lightbox__overlay");
const modalLightboxImageEl = document.querySelector(".lightbox__image");
const modalCloseBtn = document.querySelector('[data-action="close-lightbox"]');
let currentImgParent;

function createGallery(arr) {
  return arr
    .map(
      (e) =>
        `
    <li class="gallery__item">
  <a
    loading="lazy"
    class="gallery__link"
    href="${e.original}"
    rel="noreferrer nofollow" 
  >
    <img
      class="gallery__image"
      src="${e.preview}"
      data-source="${e.original}"
      alt="${e.description}"
    />
  </a>
</li>
    `
    )
    .join("");
}

galleryContainerEl.innerHTML = createGallery(galleryItems);

galleryContainerEl.addEventListener("click", onImageClick);

function onImageClick(e) {
  e.preventDefault();
  if (e.target.nodeName !== "IMG") {
    return;
  }
  currentImgParent = e.target.parentNode.parentNode;
  openModal(e);
}

function openModal(e) {
  modalLightboxEl.classList.add("is-open");
  modalLightboxImageEl.setAttribute(
    "src",
    e.target.getAttribute("data-source")
  );
  modalLightboxImageEl.setAttribute("alt", e.target.getAttribute("alt"));
  window.addEventListener("keydown", onKeyPress);
  modalLightboxOverlay.addEventListener("click", onCloseBtnClick);
}

modalCloseBtn.addEventListener("click", onCloseBtnClick);

function onCloseBtnClick() {
  modalLightboxEl.classList.remove("is-open");
  modalLightboxImageEl.setAttribute("src", "");
  modalLightboxImageEl.setAttribute("alt", "");
  window.removeEventListener("keydown", onKeyPress);
}

function onKeyPress(e) {
  if (e.code === "Escape") {
    onCloseBtnClick();
  }
  arrowControl(e);
}

function arrowControl(e) {
  let nextImage = currentImgParent.nextElementSibling?.querySelector("img");

  if (nextImage === undefined)
    nextImage =
      currentImgParent.parentNode.firstElementChild.querySelector("img");

  let previousImage =
    currentImgParent.previousElementSibling?.querySelector("img");

  if (previousImage === undefined)
    previousImage =
      currentImgParent.parentNode.lastElementChild.querySelector("img");

  if (e.code === "ArrowRight" && nextImage !== undefined) {
    modalLightboxImageEl.setAttribute(
      "src",
      nextImage.getAttribute("data-source")
    );
    modalLightboxImageEl.setAttribute("alt", nextImage.getAttribute("alt"));
    currentImgParent = nextImage.closest("li");
  }

  if (e.code === "ArrowLeft" && previousImage !== undefined) {
    modalLightboxImageEl.setAttribute(
      "src",
      previousImage.getAttribute("data-source")
    );
    modalLightboxImageEl.setAttribute("alt", previousImage.getAttribute("alt"));
    currentImgParent = previousImage.closest("li");
  }
}
