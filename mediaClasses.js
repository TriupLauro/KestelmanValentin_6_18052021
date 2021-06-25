import {createMediaFrame} from "./photographersFunctions.js";

export class Photograph {
    constructor(photoObject, photographerObject) {
        this.name = photoObject.name;
        this.folderName = photographerObject.name.slice(0,photographerObject.name.indexOf(' '));
        this.id = photoObject.id;
        this.likes = photoObject.likes;
        this.tags = photoObject.tags;
        this.fileName = photoObject.image;
        this.price = photoObject.price;
        this.title = photoObject.title;
        this.alt = photoObject.altDescription;
        this.localLiked = photoObject.localLiked;
    }

    appendMedia(container, index) {
        const mediaContainerElt = createMediaFrame(this.title, this.likes, this.localLiked);

        const imageElt = document.createElement('img');
        this.fullPath = `images/Sample_Photos/${this.folderName}/${this.fileName}`;
        imageElt.dataset.fullPath = this.fullPath;
        this.thumbnailPath = `images/Sample_Photos/${this.folderName}/thumbnails/mini_${this.fileName}`;
        imageElt.setAttribute('src', this.thumbnailPath);
        imageElt.setAttribute('alt', this.alt);
        imageElt.classList.add('js-thumbnail');
        imageElt.setAttribute('tabindex','0');
        mediaContainerElt.insertBefore(imageElt, mediaContainerElt.firstChild);
        mediaContainerElt.dataset.index = index;
        mediaContainerElt.dataset.title = this.title;
        mediaContainerElt.dataset.mediaId = this.id;

        container.appendChild(mediaContainerElt);
    }
}

export class Video {
    constructor(videoObject, photographerObject) {
        this.name = videoObject.name;
        this.folderName = photographerObject.name.slice(0,photographerObject.name.indexOf(' '));
        this.id = videoObject.id;
        this.likes = videoObject.likes;
        this.tags = videoObject.tags;
        this.fileName = videoObject.video;
        this.price = videoObject.price;
        this.title = videoObject.title;
        this.localLiked = videoObject.localLiked;
    }

    appendMedia(container, index) {
        const mediaContainerElt = createMediaFrame(this.title, this.likes, this.localLiked);

        this.fullPath = `images/Sample_Photos/${this.folderName}/${this.fileName}`
        mediaContainerElt.dataset.src = this.fullPath;

        const videoElt = document.createElement('video');
        const videoSourceElt = document.createElement('source');
        videoSourceElt.setAttribute('src', this.fullPath);
        videoElt.setAttribute('tabindex','0');
        videoElt.classList.add('js-thumbnail');
        videoElt.appendChild(videoSourceElt);

        mediaContainerElt.insertBefore(videoElt, mediaContainerElt.firstChild);
        mediaContainerElt.dataset.index = index;
        mediaContainerElt.dataset.title = this.title;
        mediaContainerElt.dataset.mediaId = this.id;

        container.appendChild(mediaContainerElt);
    }
}