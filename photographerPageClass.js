import PhotographerGlobalObject from "./globalPhotographerClass.js";
import MediaGallery from "./mediaGalleryClass.js";
import Lightbox from "./lightboxClass.js";
import SortingDropDown from "./sortFilterAnimateClass.js";
import ContactForm from "./contactFormClass.js";

export default class PhotographerPage {
    constructor(currentPhotographerData, currentPhotographerMedias, mainPage) {
        this.photographerObject = new PhotographerGlobalObject(currentPhotographerData, currentPhotographerMedias);
        this.mediaGallery = new MediaGallery(currentPhotographerData, currentPhotographerMedias);
        this.lightBoxObject = new Lightbox(this.mediaGallery, mainPage);
        this.dropDownObject = new SortingDropDown(this.mediaGallery,
            this.lightBoxObject, this.photographerObject);
        this.contactObject = new ContactForm(mainPage);
    }

    initializePage() {
        this.photographerObject.setPhotographerHeader();
        this.photographerObject.setPhotographerPrice();
        this.photographerObject.setTotalLikes();

        this.mediaGallery.rememberSort();

        this.dropDownObject.rememberChoice();
        this.dropDownObject.attachListenerToLikeIcons();
        this.dropDownObject.attachListenerToSortBtn();
        this.dropDownObject.attachListenerClickOutside();
        this.dropDownObject.attachListenerToSortOptions();
        this.dropDownObject.attachListenersToKeyBoard();


        this.dropDownObject.tagNodeList =
            this.photographerObject.headerContainer.querySelectorAll('.infos__tags__item');
        this.dropDownObject.attachListenerToMediaTags();

        this.lightBoxObject.attachListenersToKeyboard();
        this.lightBoxObject.attachListenerToControlBtns();
        this.lightBoxObject.attachListenerToThumbnails();

        this.contactObject.attachListenersToContactForm();
    }

}