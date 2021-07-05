import {removeChildTags, sortingChoice} from "./photographersFunctions.js";
import {Photograph, Video} from "./mediaClasses.js";

// Class used to manage and update the display of the medias displayed in the gallery of the current photographer

export default class MediaGallery {
    constructor(photographerData, mediaData,
                containerDOM = document.querySelector('.photo-wrapper')) {
        this.mediaContainer = containerDOM;
        this.photographerData = photographerData;
        this.mediaData = mediaData;
    }

    // The sortingChoice function sort the medias the way it was specified by sortOption
    // 'Popularité' -> Decreasing number of likes
    // 'Date' -> By chronological order from recent to ancient
    // 'Titre' -> By alphabetical order
    sortMedias(sortOption, mediaArray = this.mediaData) {
        const  resArray = sortingChoice(mediaArray, sortOption, this.photographerData.id);
        this.mediaData = resArray;
        return resArray;
    }

    // Check the localStorage for the last sorting option chosed by the user
    // Then sort the media gallery accordingly
    // Default to the first choice
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

    // Method called to update the media gallery
    // Removes all the content in the container
    // Go through each item of the mediaArray passed as argument (be it filtered and/or sorted)
    // Uses the mediaFactory to create the appropriate object (video or image)
    // Then call the appendMedia of the instance created to add it to the gallery
    addMediaListToGallery(mediaArray = this.mediaData, container = this.mediaContainer, currentPhotographerData = this.photographerData) {
        removeChildTags(container);
        for (let currentMediaIndex in mediaArray) {
            let mediaObject = this.mediaFactory(mediaArray[currentMediaIndex], currentPhotographerData);
            this.addMediaToGallery(mediaObject, currentMediaIndex, container);
        }
    }

    // Check if the object contain the key image or video and then create the instance of the appropriate class
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