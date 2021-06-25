import {lockScroll, toggleVideoPlay, unlockScroll} from "./photographersFunctions.js";

export default class Lightbox {
    constructor(mediaGallery, mainPageDOM,
                lightboxBgDOM = document.querySelector('div.lightbox-bg'),
                lightboxCloseDOM = document.querySelector('button.lightbox__close'),
                lightboxTitleDOM = document.querySelector('p.lightbox__title'),
                lightboxPreviousDOM = document.querySelector('a.lightbox__previous'),
                lightboxNextDOM = document.querySelector('a.lightbox__next'),
                lightboxElt = document.querySelector('.lightbox'),
                displayedMediaDOM = document.querySelector('.lightbox__img')) {
        this.lightboxBg = lightboxBgDOM;
        this.lightboxCloseBtn = lightboxCloseDOM;
        this.lightboxTitle = lightboxTitleDOM;
        this.lightboxPreviousBtn = lightboxPreviousDOM;
        this.lightboxNextBtn = lightboxNextDOM;
        this.lightboxElt = lightboxElt;
        this.displayedMediaDOM = displayedMediaDOM;
        this.lightboxDisplayed = false;
        this.mediaGallery = mediaGallery;
        this.mainPage = mainPageDOM;
    }

    closeLightbox() {
        this.mainPage.setAttribute('aria-hidden', 'false');
        const mediaDataHolder = this.lightboxElt;
        const lastIndex = mediaDataHolder.dataset.index;
        const eltToFocus = document.querySelector(`.photo-container[data-index='${lastIndex}'] .js-thumbnail`);
        eltToFocus.focus();
        this.lightboxBg.style.display = 'none';
        this.lightboxDisplayed = false;
        unlockScroll();
    }

    goToMediaIndex(index) {
        const newElt = document.querySelector(`.photo-container[data-index='${index}'] > .js-thumbnail`);
        const newMediaHolderElt = document.querySelector(`.photo-container[data-index='${index}']`);

        this.lightboxTitle.innerText = newMediaHolderElt.dataset.title;

        if (newElt.tagName === 'IMG') {

            const newImage = document.createElement('img')
            newImage.setAttribute('src', newElt.dataset.fullPath);
            newImage.setAttribute('alt', newElt.alt);
            newImage.classList.add('lightbox__img');
            newImage.setAttribute('tabindex','0');
            this.lightboxElt.removeChild(this.displayedMediaDOM);
            this.lightboxElt.insertBefore(newImage, this.lightboxElt.firstChild);
            this.lightboxElt.dataset.index = index;
            newImage.focus();
            this.displayedMediaDOM = newImage;
        }

        if (newElt.tagName === 'VIDEO') {

            const newVideoElt = document.createElement('video');
            const newVideoSourceElt = document.createElement('source')
            newVideoSourceElt.setAttribute('src',newElt.firstChild.src);
            newVideoElt.classList.add('lightbox__img','pointer');
            newVideoElt.appendChild(newVideoSourceElt);
            newVideoElt.addEventListener('click', toggleVideoPlay);
            this.lightboxElt.removeChild(this.displayedMediaDOM);
            this.lightboxElt.insertBefore(newVideoElt, this.lightboxElt.firstChild);
            this.lightboxElt.dataset.index = index;
            newVideoElt.focus();
            this.displayedMediaDOM = newVideoElt;
        }
    }

    goToPreviousMedia() {
        const mediaEltsList = document.querySelectorAll('div.photo-container');

        let previousIndex;
        if (this.lightboxElt.dataset.index === '0') {
            previousIndex = mediaEltsList.length - 1;
        }else{
            previousIndex = this.lightboxElt.dataset.index - 1;
        }
        this.goToMediaIndex(previousIndex);
    }

    goToNextMedia() {
        const mediaEltsList = document.querySelectorAll('div.photo-container');

        let nextIndex;
        if (parseInt(this.lightboxElt.dataset.index,10) === (mediaEltsList.length - 1)) {
            nextIndex = 0;
        }else{
            nextIndex = parseInt(this.lightboxElt.dataset.index,10) + 1;
        }
        this.goToMediaIndex(nextIndex);
    }

    openLightBoxImage(e) {
        const mediaSrc = e.target.dataset.fullPath;
        const altText = e.target.alt;
        const dataHolder = e.target.parentElement;
        const imageObject = this.mediaGallery.mediaData.find(media => media.id ===
            parseInt(dataHolder.dataset.mediaId,10));

        const imageElt = document.createElement('img');
        imageElt.setAttribute('src', mediaSrc);
        imageElt.setAttribute('alt', altText);
        imageElt.classList.add('lightbox__img');
        imageElt.setAttribute('tabindex','0');
        this.lightboxElt.removeChild(this.displayedMediaDOM);

        this.lightboxElt.dataset.index = dataHolder.dataset.index;
        this.lightboxElt.insertBefore(imageElt, this.lightboxElt.firstChild);
        this.displayedMediaDOM = imageElt;

        this.lightboxTitle.innerText = imageObject.title;
        this.lightboxBg.style.display = 'block';
        this.lightboxDisplayed = true;
        imageElt.focus();
        this.mainPage.setAttribute('aria-hidden', 'true');
        lockScroll();

    }

    openLightBoxVideo(e) {
        this.lightboxBg.style.display = 'block';
        this.lightboxDisplayed = true;
        const dataHolder = e.target.parentElement;
        const videoObject = this.mediaGallery.mediaData.find(media => media.id ===
            parseInt(dataHolder.dataset.mediaId,10));

        this.lightboxElt.removeChild(this.displayedMediaDOM);
        const videoMedia = document.createElement('video');
        videoMedia.classList.add('lightbox__img','pointer');
        this.lightboxElt.insertBefore(videoMedia, this.lightboxTitle);

        const videoSource = document.createElement('source');
        videoSource.setAttribute('src', dataHolder.dataset.src);
        videoMedia.appendChild(videoSource);
        this.displayedMediaDOM = videoMedia;

        this.lightboxTitle.innerText = videoObject.title;
        this.lightboxElt.dataset.index = dataHolder.dataset.index;
        videoMedia.focus();
        this.mainPage.setAttribute('aria-hidden','true');

        lockScroll();
        videoMedia.addEventListener('click',toggleVideoPlay);
    }

    attachListenerToControlBtns() {
        this.lightboxCloseBtn.addEventListener('click', this.closeLightbox.bind(this));
        this.lightboxNextBtn.addEventListener('click', this.goToNextMedia.bind(this));
        this.lightboxPreviousBtn.addEventListener('click', this.goToPreviousMedia.bind(this));
    }

    lightboxKeyboardEvents(e) {
        if (this.lightboxDisplayed) {
            if (e.key === 'ArrowLeft') {
                this.goToPreviousMedia();
            }
            if (e.key === 'ArrowRight') {
                this.goToNextMedia();
            }
            if (e.key === 'Escape') {
                this.closeLightbox();
            }
            //Toggle the play state of the video element
            //const displayedMedia = document.querySelector('.lightbox__img');
            if (this.displayedMediaDOM.tagName === 'VIDEO') {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (this.displayedMediaDOM.paused) {
                        this.displayedMediaDOM.play();
                    }else{
                        this.displayedMediaDOM.pause();
                    }
                }
            }
        }
        //Let enter the lightbox with the keyboard
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('js-thumbnail')) {
            if (e.key === 'Enter') {
                focusedElement.click();
            }
        }
    }

    attachListenersToKeyboard() {
        window.addEventListener('keydown', this.lightboxKeyboardEvents.bind(this));
    }

    attachListenerToThumbnails() {
        const allThumbnailsElts = this.mediaGallery.mediaContainer.querySelectorAll('.js-thumbnail');
        allThumbnailsElts.forEach(elt => {
            if (elt.tagName ==='IMG') {
                elt.addEventListener('click', this.openLightBoxImage.bind(this));
            }
            if (elt.tagName === 'VIDEO') {
                elt.addEventListener('click', this.openLightBoxVideo.bind(this));
            }
        });
    }
}