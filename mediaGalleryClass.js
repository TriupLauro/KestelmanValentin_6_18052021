import {removeChildTags, sortingChoice} from "./photographersFunctions.js";
import {Photograph, Video} from "./mediaClasses.js";

export default class MediaGallery {
    constructor(photographerData, mediaData,
                containerDOM = document.querySelector('.photo-wrapper')) {
        this.mediaContainer = containerDOM;
        this.photographerData = photographerData;
        this.mediaData = mediaData;
    }

    sortMedias(sortOption, mediaArray = this.mediaData) {
        const  resArray = sortingChoice(mediaArray, sortOption, this.photographerData.id);
        this.mediaData = resArray;
        return resArray;
    }

    rememberSort(option = 'Popularité', mediaArray = this.mediaData) {
        if (!localStorage.getItem(`photographer${this.photographerData.id}SortOption`)) {
            localStorage.setItem(`photographer${this.photographerData.id}SortOption`, 'Popularité');
        }else{
            option = localStorage.getItem(`photographer${this.photographerData.id}SortOption`);
        }
        const sortedArray = this.sortMedias(option, mediaArray);
        this.addMediaListToGallery(sortedArray);
        return sortedArray;
    }

    addMediaToGallery(mediaObject, index, container = this.mediaContainer) {
        mediaObject.appendMedia(container, index);
    }

    addMediaListToGallery(mediaArray = this.mediaData, container = this.mediaContainer, currentPhotographerData = this.photographerData) {
        removeChildTags(container);
        for (let currentMediaIndex in mediaArray) {
            let mediaObject = this.mediaFactory(mediaArray[currentMediaIndex], currentPhotographerData);
            this.addMediaToGallery(mediaObject, currentMediaIndex, container);
        }
    }

    mediaFactory(mediaObject, photographerObject) {
        let media;

        if (Object.prototype.hasOwnProperty.call(mediaObject, 'image')) {
            media = new Photograph(mediaObject, photographerObject);
        }

        if (Object.prototype.hasOwnProperty.call(mediaObject, 'video')) {
            media = new Video(mediaObject, photographerObject);
        }

        return media;
    }

}