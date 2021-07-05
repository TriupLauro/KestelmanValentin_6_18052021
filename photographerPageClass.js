import PhotographerInfoObject from "./photographerInfoClass.js";
import MediaGallery from "./mediaGalleryClass.js";
import Lightbox from "./lightboxClass.js";
import SortingDropDown from "./sortFilterAnimateClass.js";
import ContactForm from "./contactFormClass.js";

//Class managing all the other classes on the photographer page
export default class PhotographerPage {
    constructor(currentPhotographerData, currentPhotographerMedias, mainPage) {
        this.photographerInfoObject = new PhotographerInfoObject(currentPhotographerData, currentPhotographerMedias);
        this.mediaGallery = new MediaGallery(currentPhotographerData, currentPhotographerMedias);
        this.lightBoxObject = new Lightbox(this.mediaGallery, mainPage);
        this.dropDownObject = new SortingDropDown(this.mediaGallery,
            this.lightBoxObject, this.photographerInfoObject);
        this.contactObject = new ContactForm(mainPage, currentPhotographerData);
    }

    //Set all the displayed information for the current photographer
    //Create the media gallery of said photographer
    //And adds all the event listeners for the interactive elements
    initializePage() {
        this.photographerInfoObject.setPhotographerHeader();
        this.photographerInfoObject.setPhotographerPrice();
        this.photographerInfoObject.setTotalLikes();

        this.mediaGallery.rememberSort();

        this.dropDownObject.rememberChoice();
        this.dropDownObject.attachListenerToLikeIcons();
        this.dropDownObject.attachListenerToSortBtn();
        this.dropDownObject.attachListenerClickOutside();
        this.dropDownObject.attachListenerToSortOptions();
        this.dropDownObject.attachListenersToKeyBoard();


        this.dropDownObject.tagNodeList =
            this.photographerInfoObject.headerContainer.querySelectorAll('.infos__tags__item');
        this.dropDownObject.attachListenerToMediaTags();

        this.lightBoxObject.attachListenersToKeyboard();
        this.lightBoxObject.attachListenerToControlBtns();
        this.lightBoxObject.attachListenerToThumbnails();

        this.contactObject.attachListenersToContactForm();
        this.contactObject.attachListenerToWindow();
        this.contactObject.setContactName();
    }

    //Useful for screen readers (go directly to relevant information)
    focusOnHeader() {
        this.photographerInfoObject.focusOnHeader();
    }
}