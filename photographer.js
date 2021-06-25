//DOM element of the page without the modals
const mainPage = document.querySelector('div.photographer-page');

// Dom of the media container
//const mediaWrapper = document.querySelector('div.photo-wrapper');

function lockScroll() {
    document.body.style.overflow = 'hidden';
}

function unlockScroll() {
    document.body.style.overflow = '';
}
// Media classes, used by the media factory
// Each of the two classes have their respective appendMedia method to add the corrects DOM elements
// given a container

class Photograph {
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



class Video {
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

function toggleVideoPlay(e) {
    if (e.target.paused) {
        e.target.play();
    }else{
        e.target.pause();
    }
}

// Create, without adding it to the page, the frame with the titles and the likes
// Ready but without the media itself
function createMediaFrame(title, likes, localLiked = false) {
    const mediaFrameElt = document.createElement('div');
    mediaFrameElt.classList.add('photo-container');

    const mediaDescriptionElt = document.createElement('p');
    mediaDescriptionElt.classList.add('photo-description');
    mediaDescriptionElt.textContent = title;
    const mediaLikesElt = document.createElement('span');
    mediaLikesElt.classList.add('photo-likes');
    mediaLikesElt.textContent = likes + ' ';
    const likeIconElt = createLikeIcon();
    likeIconElt.classList.add('js-clickable-like');
    likeIconElt.dataset.likesNumber = likes;
    likeIconElt.dataset.localLiked = localLiked.toString();
    //makeLikeIconClickable(likeIconElt, localLiked);
    //preventClickOnParent(mediaDescriptionElt);

    mediaFrameElt.appendChild(mediaDescriptionElt);
    mediaDescriptionElt.appendChild(mediaLikesElt);
    mediaLikesElt.appendChild(likeIconElt);

    return mediaFrameElt;
}

// The factory that create the appropriate media object, just by checking the presence
// of a video or image key in the object extracted from the JSON file
/*function mediaFactory(mediaObject, photographerObject) {
    let media;
    
    if (Object.prototype.hasOwnProperty.call(mediaObject, 'image')) {
        media = new Photograph(mediaObject, photographerObject);
    }

    if (Object.prototype.hasOwnProperty.call(mediaObject, 'video')) {
        media = new Video(mediaObject, photographerObject);
    }
    
    return media;
}*/

// Remove all the content inside a container element
function removeChildTags(container) {
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

// Adds all the media to the specified container using the factory
/*function addMediaList(container, currentPhotographerData, mediaArray) {
    
    for (let currentMediaIndex in mediaArray) {
        let mediaObject = mediaFactory(mediaArray[currentMediaIndex], currentPhotographerData);
        
        mediaObject.appendMedia(container, currentMediaIndex);
    }
}*/


//Part relative to the modal form
const contactBtn = document.querySelector('button.contact');

function isNotEmptyString (value) {
    return value !== '';
}

function validEmailRegex(value) {
    return /[a-zA-Z0-9.-]+@[a-zA-Z0-9]+.[a-z]+/.test(value);
}

// Moving the contact button on mobile resolution

let scrollingHappens;

window.addEventListener('scroll', () => {
    if(window.innerWidth <= 1100) {
        window.clearTimeout(scrollingHappens);
        hideContactBtn();
        scrollingHappens = setTimeout(showContactBtn, 500);
    }
})

function hideContactBtn() {
    contactBtn.style.transform = 'translate(-50%, 200%)'
}

function showContactBtn () {
    contactBtn.style.transform = ''
}

// Three sorting functions

function sortAlphabeticalOrder(mediaArray) {
    let titleArray = mediaArray.map((mediaItem) => mediaItem.title.toLowerCase());  
    let titleArrayWithIndex = [];
    for (let title of titleArray) {
        titleArrayWithIndex.push({index : titleArray.indexOf(title), title});
    }
    
    let sortedList = titleArrayWithIndex.sort((a,b) => {
        if (a.title < b.title) {
            return -1;
        }
        if (a.title > b.title) {
            return 1;
        }
        return 0;
    });
    
    return sortedList.map((mediaItem) => mediaArray[mediaItem.index]);
}

function sortDate(mediaArray) {
    let dateArray = mediaArray.map((mediaItem) => new Date(mediaItem.date));

    let dateArrayWithIndex = [];
    for (let date of dateArray) {
        dateArrayWithIndex.push({index : dateArray.indexOf(date), date});
    }
    
    let sortedList = dateArrayWithIndex.sort((a,b) => b.date - a.date);
    
    return sortedList.map((mediaItem) => mediaArray[mediaItem.index]);
}

function sortPopularity(mediaArray) {
    return mediaArray.sort((a,b) => b.likes - a.likes);
}

function sortingChoice(mediaArray, choice, photographerId) {
    let newSortedList;
    switch(choice) {

        case 'Popularité' :
            newSortedList = sortPopularity(mediaArray);
            localStorage.setItem(`photographer${photographerId}SortOption`, 'Popularité');

            break;

        case 'Date' :
            newSortedList = sortDate(mediaArray);
            localStorage.setItem(`photographer${photographerId}SortOption`, 'Date');

            break;


        case 'Titre' :
            newSortedList = sortAlphabeticalOrder(mediaArray);
            localStorage.setItem(`photographer${photographerId}SortOption`, 'Titre');

            break;

    }
    const selectedSorting = document.querySelector('.sort-selected');
    selectedSorting.textContent = choice;
    return newSortedList;
}

function countLikes(accumulator, currentValue) {
    return accumulator + currentValue;
}

function createLikeIcon() {
    const likeIcon = document.createElement('span');
    likeIcon.classList.add('fas', 'fa-heart');
    likeIcon.setAttribute('aria-label','likes');
    return likeIcon
}

// Incrementing likes

//let filteredMedias;

/*function makeLikeIconClickable(likeIcon, localLiked) {
    if (!localLiked) {
        likeIcon.addEventListener('click', addOneLike);
    }else{
        likeIcon.addEventListener('click', removeOneLike);
    }
}*/

/*function addOneLike(e) {
    e.stopPropagation();
    let likes = e.target.dataset.likesNumber;
    const likedMediaContainer = e.target.parentElement.parentElement.parentElement;
    const currentSortOption = document.querySelector('.sort-selected').textContent;
    // Function for the challenge
    if (currentSortOption === 'Popularité') checkDrawLiking(likes, likedMediaContainer);
    likes++;
    const likedMediaObject = filteredMedias.find(media => media.id === parseInt(likedMediaContainer.dataset.mediaId,10));
    updateMediaObject(likedMediaObject, likes, true);
    const likesContainer = e.target.parentElement;
    likesContainer.textContent = `${likes} `;
    const likeIcon = createLikeIcon();
    likeIcon.dataset.likesNumber = likes;
    likeIcon.dataset.localLiked = "true";
    likeIcon.addEventListener('click', removeOneLike);
    likesContainer.appendChild(likeIcon);
    updateTotalLikes(1);
}

function removeOneLike(e) {
    e.stopPropagation();
    let likes = e.target.dataset.likesNumber;
    const unlikedMediaContainer = e.target.parentElement.parentElement.parentElement;
    const currentSortOption = document.querySelector('.sort-selected').textContent;
    if (currentSortOption === 'Popularité') checkDrawUnliking(likes, unlikedMediaContainer);
    likes--;
    const unlikedMediaObject = filteredMedias.find(media => media.id === parseInt(unlikedMediaContainer.dataset.mediaId,10));
    updateMediaObject(unlikedMediaObject, likes, false);
    const likesContainer = e.target.parentElement;
    likesContainer.textContent = `${likes} `;
    const likeIcon = createLikeIcon();
    likeIcon.dataset.likesNumber = likes;
    likeIcon.dataset.localLiked = "false";
    likeIcon.addEventListener('click', addOneLike);

    likesContainer.appendChild(likeIcon);
    updateTotalLikes(-1);
}*/

/*function preventClickOnParent(elt) {
    elt.addEventListener('click', (e) => {
        e.stopPropagation();
    })
}*/

/*function updateTotalLikes(difference) {
    const likesElt = document.querySelector('div.stats__likes');
    let totalLikes = parseInt(likesElt.dataset.totalLikes,10);
    totalLikes += difference;

    const likeIcon = createLikeIcon();
    likesElt.innerText = `${totalLikes} `;
    likesElt.dataset.totalLikes = totalLikes.toString(10);
    likesElt.appendChild(likeIcon);
}*/

// When one media becomes more popular after incrementing its likes

/*function checkDrawLiking(likes, clickedMedia) {
    const drawsList = filteredMedias.filter(media => media.likes === parseInt(likes,10));
    if (drawsList.length > 1) {
        getReadyToAnimateDrawLiking(drawsList, clickedMedia);
    }
}*/

//let movingHappens;

/*function getReadyToAnimateDrawLiking(drawMediaArray, clickedMedia,
                                     growFactor = 1.25, totalTime = 800) {
    const drawMediaArrayElt = drawMediaArray.map(media => document.querySelector(`div.photo-container[data-media-id="${media.id}"]`));
    const positionArray = getPositionArray(drawMediaArrayElt);
    const firstPosition = positionArray[0];
    const clickedMediaCoords = getPosition(clickedMedia);
    const distanceFromFirst = subtractCoords(firstPosition, clickedMediaCoords);
    if (distanceFromFirst.x === 0 && distanceFromFirst.y === 0) return false;

    AnimateDecideBetweenLike(drawMediaArrayElt,clickedMedia,positionArray,distanceFromFirst,
        growFactor, totalTime);
    const photographerId = getPhotographerId();
    window.clearTimeout(movingHappens);
    reloadPhotographerData(photographerId).then(data => {
        movingHappens = setTimeout(updateDOMAfterAnimateDraw, totalTime+300, data);
    });
}*/

/*function updateDOMAfterAnimateDraw(photographerData) {
    filteredMedias = sortPopularity(filteredMedias);
    removeChildTags(mediaWrapper);
    addMediaList(mediaWrapper, photographerData, filteredMedias);
}

function getPosition(elt) {
    const boundingObject = elt.getBoundingClientRect() ;
    return {
        x : boundingObject.x,
        y : boundingObject.y
    }
}

function getPositionArray(mediaEltArray) {
    return mediaEltArray.map(mediaElt => getPosition(mediaElt));
}

function subtractCoords(coords1, coords2) {
    const difference = {};
    // Fix if both coordinates are the same
    if (coords1 === undefined) return {x:0,y:0}
    const coordKeys = Object.keys(coords1);
    coordKeys.forEach(key => difference[key] = coords1[key] - coords2[key]);
    return difference;
}

function addTranslation(elt,x,y) {
    elt.style.transform += ` translate(${x}px,${y}px)`;
}

function AnimateDecideBetweenLike(
    mediaEltArray, clickedMediaElt, positionArray, distanceForClickedElt,
    growFactor = 1.25, totalTime = 800
) {
    const shrinkFactor = 1/growFactor;
    const step2Time = totalTime*0.4;
    const indexOfLikedElt = mediaEltArray.indexOf(clickedMediaElt);
    mediaEltArray.forEach((elt,index) => {
        if (elt === clickedMediaElt) {
            elt.style.transform = `scale(${growFactor})`;
            setTimeout(addTranslation, step2Time, elt, distanceForClickedElt.x*shrinkFactor, distanceForClickedElt.y*shrinkFactor);
            setTimeout(endAnimationDraw, totalTime, elt, distanceForClickedElt.x, distanceForClickedElt.y);
        }else{
            if (index < indexOfLikedElt) {
                elt.style.transform = `scale(${shrinkFactor})`;
                const distanceToTarget = subtractCoords(positionArray[index+1], positionArray[index]);
                setTimeout(addTranslation, step2Time, elt, distanceToTarget.x*growFactor, distanceToTarget.y*growFactor);
                setTimeout(endAnimationDraw, totalTime, elt, distanceToTarget.x, distanceToTarget.y);
            }
        }
    })
} 

// Animate the going back after unliking

function checkDrawUnliking(likes, clickedMedia) {
    const drawsList = filteredMedias.filter(media => media.likes === parseInt(likes,10));
    if (drawsList.length > 1) {
        getReadyToAnimateDrawUnliking(drawsList,clickedMedia);
    }
}

function getReadyToAnimateDrawUnliking(drawMediaArray, clickedMedia,
                                     growFactor = 1.25, totalTime = 800) {
    const drawMediaArrayElt = drawMediaArray.map(media => document.querySelector(`div.photo-container[data-media-id="${media.id}"]`));
    const positionArray = getPositionArray(drawMediaArrayElt);
    const lastPosition = positionArray[positionArray.length - 1];
    const clickedMediaCoords = getPosition(clickedMedia);
    const distanceFromLast = subtractCoords(lastPosition, clickedMediaCoords);
    if (distanceFromLast.x === 0 && distanceFromLast.y === 0) return false;

    AnimateDecideBetweenUnlike(drawMediaArrayElt,clickedMedia,positionArray,distanceFromLast,
        growFactor, totalTime);
    const photographerId = getPhotographerId();
    window.clearTimeout(movingHappens);
    reloadPhotographerData(photographerId).then(data => {
        movingHappens = setTimeout(updateDOMAfterAnimateDraw, totalTime+300, data);
    });
}

function AnimateDecideBetweenUnlike(
    mediaEltArray, clickedMediaElt, positionArray, distanceForClickedElt,
    growFactor = 1.25, totalTime = 800
) {
    const shrinkFactor = 1/growFactor;
    const step2Time = totalTime*0.4;
    const indexOfLikedElt = mediaEltArray.indexOf(clickedMediaElt);
    mediaEltArray.forEach((elt,index) => {
        if (elt === clickedMediaElt) {
            elt.style.transform = `scale(${shrinkFactor})`;
            setTimeout(addTranslation, step2Time, elt, distanceForClickedElt.x*growFactor, distanceForClickedElt.y*growFactor);
            setTimeout(endAnimationDraw, totalTime, elt, distanceForClickedElt.x, distanceForClickedElt.y);
        }else{
            if (index > indexOfLikedElt) {
                elt.style.transform = `scale(${growFactor})`;
                const distanceToTarget = subtractCoords(positionArray[index - 1], positionArray[index]);
                setTimeout(addTranslation, step2Time, elt, distanceToTarget.x*shrinkFactor, distanceToTarget.y*shrinkFactor);
                setTimeout(endAnimationDraw, totalTime, elt, distanceToTarget.x, distanceToTarget.y);
            }
        }
    })
}

function endAnimationDraw(mediaAnimated,x,y) {
    mediaAnimated.style.transform = `translate(${x}px,${y}px)`;
}

// Returns a promise
function reloadPhotographerData(photographerId) {
    return readJsonData()
        .then((fishEyeData) => {
            return fishEyeData.photographers.find(photographer => photographer.id === parseInt(photographerId,10));
        })
}*/

function getPhotographerId() {
    const queryString = window.location.search;
    return new URLSearchParams(queryString).get('id');
}

// This function returns a promise, so we need to use .then after we call it
function readJsonData () {
    return fetch('database/FishEyeData.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
}

// Refactoring with OOP
class PhotographerGlobalObject {
    constructor(photographerData, photographerMedia,
                headerDOM = document.querySelector('div.photograph-header'),
                statsDOM = document.querySelector('.stats') ) {

        this.headerContainer = headerDOM;
        this.displayedInfos = this.headerContainer.querySelector('div.infos');
        this.photographerTitleDOM = this.displayedInfos.querySelector('h1');
        this.photographerLocalisation = this.displayedInfos.querySelector('p.infos__text__localisation');
        this.photographerLine = this.displayedInfos.querySelector('p.infos__text__slogan');
        this.photographerDisplayedTags = this.displayedInfos.querySelector('div.infos__tags');
        this.photographerDisplayedPortrait = this.headerContainer.querySelector('img.avatar');

        this.statsContainer = statsDOM;
        this.priceContainer = this.statsContainer.querySelector('.stats__price');
        this.likesContainer = this.statsContainer.querySelector('.stats__likes');

        this.photographerData = photographerData;
        this.mediaArray = photographerMedia;
    }

    setPhotographerHeader() {

        document.title = `Page du photographe ${this.photographerData.name}`;
        this.photographerTitleDOM.innerText = this.photographerData.name;
        this.photographerLocalisation.innerText = `${this.photographerData.city}, ${this.photographerData.country}`;
        this.photographerLine.innerText = this.photographerData.tagline;

        removeChildTags(this.photographerDisplayedTags);

        for (let tag of this.photographerData.tags) {
            let currentTagElement = document.createElement('div');
            currentTagElement.classList.add('infos__tags__item');
            currentTagElement.innerText = `#${tag}`;
            currentTagElement.dataset.tag = tag;
            const tagLabel = document.createElement('span');
            tagLabel.innerText = 'Tag';
            tagLabel.classList.add('sr-only');
            this.photographerDisplayedTags.appendChild(tagLabel);
            this.photographerDisplayedTags.appendChild(currentTagElement);
        }

        this.photographerDisplayedPortrait.setAttribute('src',
            `images/Sample_Photos/Photographers_ID_Photos/thumbnails/mini_${this.photographerData.portrait}`);
    }

    setPhotographerPrice () {
        this.priceContainer.innerText = `${this.photographerData.price}€ / jour`;
    }

    setTotalLikes() {
        const likesArray = this.mediaArray.map((mediaItem) => mediaItem.likes);
        const totalLikes = likesArray.reduce(countLikes);
        const likeIcon = createLikeIcon();

        this.likesContainer.innerText = `${totalLikes} `;
        this.likesContainer.dataset.totalLikes = totalLikes;
        this.likesContainer.appendChild(likeIcon);
    }

    updateTotalLikes(difference) {
        const likesElt = this.likesContainer;
        let totalLikes = parseInt(likesElt.dataset.totalLikes,10);
        totalLikes += difference;

        const likeIcon = createLikeIcon();
        likesElt.innerText = `${totalLikes} `;
        likesElt.dataset.totalLikes = totalLikes.toString(10);
        likesElt.appendChild(likeIcon);
    }

    focusOnHeader() {
        this.headerContainer.focus();
    }

}

//Media Gallery
class MediaGallery {
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

// Lightbox class
class Lightbox {
    constructor(mediaGallery,
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
    }

    closeLightbox() {
        mainPage.setAttribute('aria-hidden', 'false');
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
        mainPage.setAttribute('aria-hidden', 'true');
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
        mainPage.setAttribute('aria-hidden','true');

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
        const allThumbnailsElts = document.querySelectorAll('.js-thumbnail');
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

//Sorting menu
class SortingDropDown {
    constructor(mediaGallery, lightboxObject, photographerObject, activeTag = '',
                filterTagsDOM = document.querySelectorAll('div.infos__tags__item')) {
        this.sortBtn = document.querySelector('.sort-button');
        this.sortMenu = document.querySelector('ul.sort-dropdown');
        this.sortOptions = document.querySelectorAll('li.sort-dropdown__item');
        this.selectedSorting = document.querySelector('.sort-selected');
        this.sortMenuIcon = document.querySelector('.sort-container .fa-chevron-down');
        this.menuExpanded = false;
        this.mediaGallery = mediaGallery;
        this.lightboxObject = lightboxObject;
        this.photographerObject = photographerObject;
        this.activeTag = activeTag;
        this.tagNodeList = filterTagsDOM;
        this.filteredMedias = this.mediaGallery.mediaData;

        //Remembers last option to display and sort
        if (!localStorage.getItem(`photographer${this.photographerObject.photographerData.id}SortOption`)) {
            localStorage.setItem(`photographer${this.photographerObject.photographerData.id}SortOption`, 'Popularité');
            this.currentOption = 'Popularité';
        }else{
            this.currentOption = localStorage.getItem(`photographer${this.photographerObject.photographerData.id}SortOption`);
        }
    }

    // Part relative to filter

    updateTagDisplay() {
        this.tagNodeList.forEach((tag) => {
            if (tag.dataset.tag === this.activeTag) {
                tag.dataset.selected = 'true';
            } else {
                tag.dataset.selected = 'false';
            }
        });
    }

    filterPhotosByTag(e) {
        let clickedTag = e.target.dataset.tag;

        if (clickedTag === this.activeTag) {
            this.activeTag = '';
            //Sorting the array may be needed
            let option = this.currentOption;
            this.filteredMedias = this.mediaGallery.sortMedias(option);
        }else{
            //Since we cut an array already sorted, no need to sort here
            this.activeTag = clickedTag;
            this.filteredMedias = this.mediaGallery.mediaData.filter(media => media.tags.includes(clickedTag));
        }
        this.mediaGallery.addMediaListToGallery(this.filteredMedias);
        this.lightboxObject.attachListenerToThumbnails();
        this.attachListenerToLikeIcons();
        this.updateTagDisplay();
    }

    attachListenerToMediaTags() {
        this.tagNodeList.forEach(tagElt => {
            tagElt.addEventListener('click', this.filterPhotosByTag.bind(this))
        });
    }

    //Part relative to sorting

    displaySortMenu(e) {
        e.stopPropagation();

        this.sortMenu.style.display = 'block';
        this.sortMenu.focus();
        this.sortMenuIcon.style.transform = 'rotate(180deg)';
        this.sortMenuIcon.removeEventListener('click', this.clickHandleIconExpand);
        this.handleIconClickSortSelect = this.sortOptionSelected.bind(this);
        this.sortMenuIcon.addEventListener('click', this.handleIconClickSortSelect);
        this.menuExpanded = true;
        this.sortBtn.setAttribute('aria-expanded', 'true');
        this.updateAriaSelected(this.sortOptions, 0);

    }

    closeDropDown() {
        if (this.menuExpanded) {
            this.sortMenu.style.display = '';
            this.sortMenu.removeAttribute('aria-activedescendant');
            this.sortMenuIcon.style.transform = '';
            this.sortMenuIcon.removeEventListener('click', this.handleIconClickSortSelect);
            this.sortMenuIcon.addEventListener('click', this.clickHandleIconExpand);
            this.sortBtn.setAttribute('aria-expanded', 'false');
            this.sortBtn.focus();
            this.menuExpanded = false;
        }
    }

    sortOptionSelected(e) {
        e.stopPropagation();

        if (e.target.tagName === 'LI') {
            this.currentOption = e.target.textContent;
        }else{
            this.currentOption = 'Popularité';
        }

        this.closeDropDown();
        this.updateDisplayedChoice(this.currentOption);
        const filteredArray = this.filteredMedias;
        const sortedArray = this.mediaGallery.sortMedias(this.currentOption, filteredArray);
        this.filteredMedias = sortedArray;
        this.mediaGallery.addMediaListToGallery(sortedArray);
        this.attachListenerToLikeIcons();
        this.lightboxObject.attachListenerToThumbnails();
    }

    updateAriaSelected(itemList, selectedItemIndex) {
        for (let item of itemList) {
            item.setAttribute('aria-selected', 'false');
            item.classList.remove('sort-focus');
        }
        itemList[selectedItemIndex].setAttribute('aria-selected', 'true');
        itemList[selectedItemIndex].classList.add('sort-focus');
        const itemIdList = [];
        itemList.forEach(item => itemIdList.push(item.id));

        this.sortMenu.setAttribute('aria-activedescendant',itemIdList[selectedItemIndex]);
    }

    selectNextSortOption() {
        const focusedSortItem = document.querySelector('li.sort-dropdown__item[aria-selected=true]');
        let index = focusedSortItem.dataset.index;
        if (index < this.sortOptions.length - 1) {
            index++;
            this.updateAriaSelected(this.sortOptions, index);
        }
    }

    selectPreviousSortOption() {
        const focusedSortItem = document.querySelector('li.sort-dropdown__item[aria-selected=true]');
        let index = focusedSortItem.dataset.index;
        if (index > 0) {
            index--;
            this.updateAriaSelected(this.sortOptions, index);
        }
    }

    updateDisplayedChoice(option) {
        this.currentOption = option;
        this.selectedSorting.innerText = option;
    }

    rememberChoice() {
        if(localStorage.getItem(`photographer${this.mediaGallery.photographerData.id}SortOption`)) {
            this.updateDisplayedChoice(localStorage.getItem(`photographer${this.mediaGallery.photographerData.id}SortOption`));
        }else{
            this.updateDisplayedChoice('Popularité');
        }
    }

    attachListenerToSortBtn() {
        this.sortBtn.addEventListener('click', this.displaySortMenu.bind(this));
        this.clickHandleIconExpand = this.displaySortMenu.bind(this)
        this.sortMenuIcon.addEventListener('click', this.clickHandleIconExpand);
    }

    attachListenerToSortOptions() {
        this.sortOptions.forEach(optionElt => {
            optionElt.addEventListener('click', this.sortOptionSelected.bind(this));
        });
    }

    attachListenersToKeyBoard() {
        window.addEventListener('keydown', this.keyboardEvents.bind(this));
    }

    keyboardEvents(e) {
        if(this.menuExpanded) {

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.selectNextSortOption();
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.selectPreviousSortOption();
            }

            if (e.key === 'Escape') {
                this.closeDropDown();
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                const focusedSortItem = document.querySelector('li.sort-dropdown__item[aria-selected=true]');
                focusedSortItem.click();
            }
        }
    }

    attachListenerClickOutside() {
        window.addEventListener('click', this.closeDropDown.bind(this));
    }

    // Like and thumbnail animations

    makeLikeIconClickable(likeIcon) {
        let localLiked = (likeIcon.dataset.localLiked === 'true');
        if (!localLiked) {
            likeIcon.addEventListener('click', this.addOneLike.bind(this));
        }else{
            likeIcon.addEventListener('click', this.removeOneLike.bind(this));
        }
    }

    attachListenerToLikeIcons() {
        const likeIconsElt = this.mediaGallery.mediaContainer.querySelectorAll('.js-clickable-like');
        likeIconsElt.forEach(icon => this.makeLikeIconClickable(icon));
    }

    addOneLike(e) {
        e.stopPropagation();
        let likes = e.target.dataset.likesNumber;
        const likedMediaContainer = e.target.parentElement.parentElement.parentElement;
        const currentSortOption = this.currentOption;
        // Function for the challenge
        if (currentSortOption === 'Popularité') this.checkDrawLiking(likes, likedMediaContainer);
        likes++;
        const likedMediaObject = this.filteredMedias.find(media => media.id === parseInt(likedMediaContainer.dataset.mediaId,10));
        likedMediaObject.likes = likes;
        likedMediaObject.localLiked = true;
        const likesContainer = e.target.parentElement;
        likesContainer.textContent = `${likes} `;
        const likeIcon = createLikeIcon();
        likeIcon.dataset.likesNumber = likes;
        likeIcon.dataset.localLiked = "true";
        likeIcon.addEventListener('click', this.removeOneLike.bind(this));
        likesContainer.appendChild(likeIcon);
        this.photographerObject.updateTotalLikes(1);
    }

    removeOneLike(e) {
        e.stopPropagation();
        let likes = e.target.dataset.likesNumber;
        const unlikedMediaContainer = e.target.parentElement.parentElement.parentElement;
        const currentSortOption = this.currentOption;
        if (currentSortOption === 'Popularité') this.checkDrawUnliking(likes, unlikedMediaContainer);
        likes--;
        const unlikedMediaObject = this.filteredMedias.find(media => media.id === parseInt(unlikedMediaContainer.dataset.mediaId,10));
        unlikedMediaObject.likes = likes;
        unlikedMediaObject.localLiked = false;
        const likesContainer = e.target.parentElement;
        likesContainer.textContent = `${likes} `;
        const likeIcon = createLikeIcon();
        likeIcon.dataset.likesNumber = likes;
        likeIcon.dataset.localLiked = "false";
        likeIcon.addEventListener('click', this.addOneLike.bind(this));
        likesContainer.appendChild(likeIcon);
        this.photographerObject.updateTotalLikes(-1);
    }

    checkDrawLiking(likes, clickedMedia) {
        const drawsList = this.filteredMedias.filter(media => media.likes === parseInt(likes,10));
        if (drawsList.length > 1) {
            this.getReadyToAnimateDrawLiking(drawsList, clickedMedia);
        }
    }

    checkDrawUnliking(likes, clickedMedia) {
        const drawsList = this.filteredMedias.filter(media => media.likes === parseInt(likes,10));
        if (drawsList.length > 1) {
            this.getReadyToAnimateDrawUnliking(drawsList,clickedMedia);
        }
    }

    getReadyToAnimateDrawLiking(drawMediaArray, clickedMedia,
                                growFactor = 1.25, totalTime = 800) {
        const drawMediaArrayElt = drawMediaArray.map(media => this.mediaGallery.mediaContainer.querySelector(`div.photo-container[data-media-id="${media.id}"]`));
        const positionArray = this.getPositionArray(drawMediaArrayElt);
        const firstPosition = positionArray[0];
        const clickedMediaCoords = this.getPosition(clickedMedia);
        const distanceFromFirst = this.getDistance(firstPosition, clickedMediaCoords);
        if (distanceFromFirst.x === 0 && distanceFromFirst.y === 0) return false;

        this.AnimateDecideBetweenLike(drawMediaArrayElt,clickedMedia,positionArray,distanceFromFirst,
            growFactor, totalTime);
        window.clearTimeout(this.movingHappens);
        this.movingHappens = setTimeout(this.updateDOMAfterAnimate.bind(this), totalTime+300,
            this.filteredMedias, this.mediaGallery.mediaContainer, this.mediaGallery.photographerData);
    }

    getReadyToAnimateDrawUnliking(drawMediaArray, clickedMedia,
                                  growFactor = 1.25, totalTime = 800) {
        const drawMediaArrayElt = drawMediaArray.map(media => document.querySelector(`div.photo-container[data-media-id="${media.id}"]`));
        const positionArray = this.getPositionArray(drawMediaArrayElt);
        const lastPosition = positionArray[positionArray.length - 1];
        const clickedMediaCoords = this.getPosition(clickedMedia);
        const distanceFromLast = this.getDistance(lastPosition, clickedMediaCoords);
        if (distanceFromLast.x === 0 && distanceFromLast.y === 0) return false;

        this.AnimateDecideBetweenUnlike(drawMediaArrayElt, clickedMedia, positionArray, distanceFromLast,
            growFactor, totalTime);
        window.clearTimeout(this.movingHappens);
        this.movingHappens = setTimeout(this.updateDOMAfterAnimate.bind(this), totalTime+300,
            this.filteredMedias);
    }

    updateDOMAfterAnimate(mediaArray, container, photographerData) {
        const sortedArray = sortPopularity(mediaArray)
        this.filteredMedias = sortedArray;
        this.mediaGallery.addMediaListToGallery(sortedArray, container, photographerData);
        this.attachListenerToLikeIcons();
    }

    AnimateDecideBetweenLike(
        mediaEltArray, clickedMediaElt, positionArray, distanceForClickedElt,
        growFactor = 1.25, totalTime = 800
    ) {
        const shrinkFactor = 1/growFactor;
        const step2Time = totalTime*0.4;
        const indexOfLikedElt = mediaEltArray.indexOf(clickedMediaElt);
        mediaEltArray.forEach((elt,index) => {
            if (elt === clickedMediaElt) {
                elt.style.transform = `scale(${growFactor})`;
                setTimeout(this.addTranslation, step2Time, elt, distanceForClickedElt.x*shrinkFactor, distanceForClickedElt.y*shrinkFactor);
                setTimeout(this.endAnimationDraw, totalTime, elt, distanceForClickedElt.x, distanceForClickedElt.y);
            }else{
                if (index < indexOfLikedElt) {
                    elt.style.transform = `scale(${shrinkFactor})`;
                    const distanceToTarget = this.getDistance(positionArray[index+1], positionArray[index]);
                    setTimeout(this.addTranslation, step2Time, elt, distanceToTarget.x*growFactor, distanceToTarget.y*growFactor);
                    setTimeout(this.endAnimationDraw, totalTime, elt, distanceToTarget.x, distanceToTarget.y);
                }
            }
        });
    }

    AnimateDecideBetweenUnlike(
        mediaEltArray, clickedMediaElt, positionArray, distanceForClickedElt,
        growFactor = 1.25, totalTime = 800
    ) {
        const shrinkFactor = 1/growFactor;
        const step2Time = totalTime*0.4;
        const indexOfLikedElt = mediaEltArray.indexOf(clickedMediaElt);
        mediaEltArray.forEach((elt,index) => {
            if (elt === clickedMediaElt) {
                elt.style.transform = `scale(${shrinkFactor})`;
                setTimeout(this.addTranslation, step2Time, elt, distanceForClickedElt.x*growFactor, distanceForClickedElt.y*growFactor);
                setTimeout(this.endAnimationDraw, totalTime, elt, distanceForClickedElt.x, distanceForClickedElt.y);
            }else{
                if (index > indexOfLikedElt) {
                    elt.style.transform = `scale(${growFactor})`;
                    const distanceToTarget = this.getDistance(positionArray[index - 1], positionArray[index]);
                    setTimeout(this.addTranslation, step2Time, elt, distanceToTarget.x*shrinkFactor, distanceToTarget.y*shrinkFactor);
                    setTimeout(this.endAnimationDraw, totalTime, elt, distanceToTarget.x, distanceToTarget.y);
                }
            }
        });
    }

    endAnimationDraw(mediaAnimated,x,y) {
        mediaAnimated.style.transform = `translate(${x}px,${y}px)`;
    }

    addTranslation(elt,x,y) {
        elt.style.transform += ` translate(${x}px,${y}px)`;
    }

    getPosition(elt) {
        const boundingObject = elt.getBoundingClientRect() ;
        return {
            x : boundingObject.x,
            y : boundingObject.y
        }
    }

    getDistance(coords1, coords2) {
        const difference = {};
        // Fix if both coordinates are the same
        if (coords1 === undefined) return {x:0,y:0}
        const coordKeys = Object.keys(coords1);
        coordKeys.forEach(key => difference[key] = coords1[key] - coords2[key]);
        return difference;
    }

    getPositionArray(mediaEltArray) {
        return mediaEltArray.map(mediaElt => this.getPosition(mediaElt));
    }

}

class ContactForm {
    constructor(contactBtn = document.querySelector('button.contact'),
                modalbg = document.querySelector('div.modalbg'),
                closebtn = document.querySelector('button.close'),
                modalForm = document.querySelector('form.modal')) {
        this.contactBtn = contactBtn;
        this.modalbg = modalbg;
        this.closebtn = closebtn;
        this.modalForm = modalForm;
    }

    displayModalForm() {
        this.modalbg.style.display = 'block';
        const firstInput = document.querySelector('input#firstname');
        mainPage.setAttribute('aria-hidden', 'true');
        firstInput.focus();
        lockScroll();
    }

    exitModalForm(e) {
        e.preventDefault();
        this.modalbg.style.display = 'none';
        mainPage.setAttribute('aria-hidden','false');
        this.contactBtn.focus();
        unlockScroll();
    }

    submitContactForm(e) {
        e.preventDefault();
        const firstNameElt = this.modalForm.querySelector('#firstname');
        const lastNameElt = this.modalForm.querySelector('#lastname');
        const emailElt = this.modalForm.querySelector('#email');
        const contactMsgElt = this.modalForm.querySelector('#message');

        const formDataObject = {
            firstName : {
                value : firstNameElt.value,
                isValid : isNotEmptyString,
                errorMsg : 'First Name must have at least one character'
            },
            lastName : {
                value : lastNameElt.value,
                isValid : isNotEmptyString,
                errorMsg : 'Last Name must have at least one character'
            },
            email : {
                value : emailElt.value,
                isValid : validEmailRegex,
                errorMsg : 'Please enter a valid e-mail address'
            },
            message : {
                value : contactMsgElt.value,
                isValid : isNotEmptyString,
                errorMsg : 'The message must have at least one character'
            }
        }

        const errorMsgs = this.formDataErrorCollection(formDataObject);

        if (errorMsgs.length > 0) {
            console.log(errorMsgs);
            return false;
        }

        const contentToDisplay = this.formDataValueCollection(formDataObject);

        console.log(contentToDisplay);
        this.contactBtn.focus();
    }

    formDataErrorCollection(objectToValidate) {
        const errorMessagesList = [];

        for (let [key,subObject] of Object.entries(objectToValidate)) {
            if (!subObject.isValid(subObject.value)) {
                errorMessagesList.push(`${key} error : ${subObject.errorMsg}`);
            }
        }

        return errorMessagesList;
    }

    formDataValueCollection(validatedObject) {
        const valueList = [];

        for (let key of Object.keys(validatedObject)) {
            valueList.push(validatedObject[key].value);
        }

        return valueList;
    }

    attachListenersToContactForm () {
        this.contactBtn.addEventListener('click', this.displayModalForm.bind(this));
        this.closebtn.addEventListener('click', this.exitModalForm.bind(this));
        this.modalForm.addEventListener('submit', this.submitContactForm.bind(this));
    }

}

// Class for the interaction of all the classes

class PhotographerPage {
    constructor(currentPhotographerData, currentPhotographerMedias) {
        this.photographerObject = new PhotographerGlobalObject(currentPhotographerData, currentPhotographerMedias);
        this.mediaGallery = new MediaGallery(currentPhotographerData, currentPhotographerMedias);
        this.lightBoxObject = new Lightbox(this.mediaGallery);
        this.dropDownObject = new SortingDropDown(this.mediaGallery,
            this.lightBoxObject, this.photographerObject);
        this.contactObject = new ContactForm();
    }

    //Needed all instances of media gallery, lightbox object and drop down object

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

window.addEventListener('load', () => {
    mainPage.style.display = 'none';
    readJsonData()
    .then((fishEyeData) => {
        const loader = document.querySelector('div.loader');

        //*---------------------------------------------------------------------------------------*

        //*---------------------------------------------------------------------------------------*

        // Checks for invalid data
        const photographersList = fishEyeData.photographers;
        const mediaList = fishEyeData.media;

        const currentId = getPhotographerId();

        if (currentId === null) {
            throw new Error('Photographer Id not specified');
        }
        const currentPhotographerData = photographersList.find(photographer => photographer.id === parseInt(currentId,10));

        if (currentPhotographerData === undefined) {
            throw new Error('Wrong Id specified');
        }
        const currentPhotographerMedias = mediaList.filter(media => media.photographerId === parseInt(currentId,10));

        const photographerPageObject = new PhotographerPage(currentPhotographerData,currentPhotographerMedias)
        photographerPageObject.initializePage();

        loader.style.display = 'none';
        mainPage.style.display = '';
        photographerPageObject.photographerObject.focusOnHeader();
        
    })
    .catch((error) => {
        const loader = document.querySelector('div.loader');
        const displayedMessage = document.querySelector('p.loader__msg');
    
        displayedMessage.innerText = error;
        const hint = document.createElement('p');
        hint.textContent = "Veuillez retourner sur la page d'accueil et sélectionnez un photographe disponible";
        
        loader.appendChild(hint);
        throw error;
    });
})