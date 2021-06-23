//DOM element of the page without the modals
const mainPage = document.querySelector('div.photographer-page');

// Dom elements from the modal form
const contactBtn = document.querySelector('button.contact');
const modalbg = document.querySelector('div.modalbg');
const closebtn = document.querySelector('button.close');
const modalForm = document.querySelector('form.modal');

// Dom of the media container
const mediaWrapper = document.querySelector('div.photo-wrapper');

// Events for the lightbox modal
const lightboxBg = document.querySelector('div.lightbox-bg');
const lightboxClose = document.querySelector('button.lightbox__close');
const lightboxTitle = document.querySelector('p.lightbox__title');
const lightboxPrevious = document.querySelector('a.lightbox__previous');
const lightboxNext = document.querySelector('a.lightbox__next');

lightboxClose.addEventListener('click', closeLightbox);

function closeLightbox() {
    mainPage.setAttribute('aria-hidden', 'false');
    const mediaDataHolder = document.querySelector('.lightbox');

    const lastIndex = mediaDataHolder.dataset.index;
    const eltToFocus = document.querySelector(`.photo-container[data-index='${lastIndex}'] .js-thumbnail`);
    eltToFocus.focus();
    lightboxBg.style.display = 'none';

    unlockScroll();
}

function goToMediaIndex(index) {
    const displayedMedia = document.querySelector('.lightbox__img');
    const lightbox = document.querySelector('div.lightbox');

    const newElt = document.querySelector(`.photo-container[data-index='${index}'] > .js-thumbnail`);
    
    const newMediaHolderElt = document.querySelector(`.photo-container[data-index='${index}']`);


    lightboxTitle.innerText = newMediaHolderElt.dataset.title;

    if (newElt.tagName === 'IMG') {
        
        const newImage = document.createElement('img')
        newImage.setAttribute('src', newElt.dataset.fullPath);
        newImage.setAttribute('alt', newElt.alt);
        newImage.classList.add('lightbox__img');
        newImage.setAttribute('tabindex','0');
        lightbox.removeChild(displayedMedia);
        lightbox.insertBefore(newImage, lightbox.firstChild);
        lightbox.dataset.index = index;
        newImage.focus();
    }

    if (newElt.tagName === 'VIDEO') {

        const newVideoElt = document.createElement('video');
        const newVideoSourceElt = document.createElement('source')
        newVideoSourceElt.setAttribute('src',newElt.firstChild.src);
        newVideoElt.classList.add('lightbox__img','pointer');
        newVideoElt.appendChild(newVideoSourceElt);
        newVideoElt.addEventListener('click', toggleVideoPlay);
        lightbox.removeChild(displayedMedia);
        lightbox.insertBefore(newVideoElt, lightbox.firstChild);
        lightbox.dataset.index = index;
        newVideoElt.focus();
    }
}

function goToPreviousMedia() {
    const mediaEltsList = document.querySelectorAll('div.photo-container');
    
    const lightbox = document.querySelector('div.lightbox');

    let previousIndex;
    
    if (lightbox.dataset.index === '0') {
        previousIndex = mediaEltsList.length - 1;
    }else{
        previousIndex = lightbox.dataset.index - 1;
    }

    goToMediaIndex(previousIndex);
    
}

function goToNextMedia() {
    const mediaEltsList = document.querySelectorAll('div.photo-container');
    
    const lightbox = document.querySelector('div.lightbox');

    let nextIndex;
    
    if (parseInt(lightbox.dataset.index,10) === (mediaEltsList.length - 1)) {
        nextIndex = 0;
        
    }else{
        nextIndex = parseInt(lightbox.dataset.index,10) + 1;
    }

    goToMediaIndex(nextIndex);

}

lightboxPrevious.addEventListener('click', goToPreviousMedia);

lightboxNext.addEventListener('click', goToNextMedia);

// Control the lightbox modal with the keyboard
document.addEventListener('keydown', (e) => {
    if (lightboxBg.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            goToPreviousMedia();
        }
        if (e.key === 'ArrowRight') {
            goToNextMedia();
        }
        if (e.key === 'Escape') {
            closeLightbox();
        }
        //Toggle the play state of the video element
        const displayedMedia = document.querySelector('.lightbox__img');
        if (displayedMedia.tagName === 'VIDEO') {
            if (e.key === 'Enter' || e.key === ' ') {
                if (displayedMedia.paused) {
                    displayedMedia.play();
                }else{
                    displayedMedia.pause();
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
});

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

        imageElt.addEventListener('click', (e) => {
            const lastImage = document.querySelector('.lightbox__img');
            const lightbox = document.querySelector('div.lightbox')
            const mediaSrc = e.target.dataset.fullPath;
            
            const imageElt = document.createElement('img');
            imageElt.setAttribute('src', mediaSrc);
            imageElt.setAttribute('alt', this.alt);
            imageElt.classList.add('lightbox__img');
            imageElt.setAttribute('tabindex','0');
            lightbox.removeChild(lastImage);
            
            lightbox.dataset.index = index;
            lightbox.insertBefore(imageElt, lightbox.firstChild);

            lightboxTitle.innerText = this.title;
            lightboxBg.style.display = 'block';
            imageElt.focus();
            mainPage.setAttribute('aria-hidden', 'true');
            lockScroll();

        });
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
        
        videoElt.addEventListener('click', () => {

            const lightbox = document.querySelector('div.lightbox');
            lightboxBg.style.display = 'block';
            const fullImage = document.querySelector('.lightbox__img');
            
            lightbox.removeChild(fullImage);
            const videoMedia = document.createElement('video');
            videoMedia.classList.add('lightbox__img','pointer');
            //videoMedia.toggleAttribute('controls');
            lightbox.insertBefore(videoMedia, lightboxTitle);
            
            const videoSource = document.createElement('source');
            videoSource.setAttribute('src', mediaContainerElt.dataset.src);
            videoMedia.appendChild(videoSource);
            
            lightboxTitle.innerText = this.title;
            lightbox.dataset.index = index;
            videoMedia.focus();
            mainPage.setAttribute('aria-hidden','true');

            lockScroll();
            videoMedia.addEventListener('click',toggleVideoPlay);

        });
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
function createMediaFrame(title, likes, localLiked) {
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
    makeLikeIconClickable(likeIconElt, localLiked);
    preventClickOnParent(mediaDescriptionElt);

    mediaFrameElt.appendChild(mediaDescriptionElt);
    mediaDescriptionElt.appendChild(mediaLikesElt);
    mediaLikesElt.appendChild(likeIconElt);

    return mediaFrameElt;
}

// The factory that create the appropriate media object, just by checking the presence
// of a video or image key in the object extracted from the JSON file
function mediaFactory(mediaObject, photographerObject) {
    let media;
    
    if (Object.prototype.hasOwnProperty.call(mediaObject, 'image')) {
        media = new Photograph(mediaObject, photographerObject);
    }

    if (Object.prototype.hasOwnProperty.call(mediaObject, 'video')) {
        media = new Video(mediaObject, photographerObject);
    }
    
    return media;
}

// Remove all the content inside a container element
function removeChildTags(container) {
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

// Update the information displayed on the photographer's page
// It modify the existing html content without adding or removing html tags
/*function setPhotographerHeader(container = document.querySelector('.photograph-header'), photographerObject) {
    const displayedPhotographerInfos = container.querySelector('div.infos');
    const photographersPageTitle = displayedPhotographerInfos.querySelector('h1');
    const photographersLocalisation = displayedPhotographerInfos.querySelector('p.infos__text__localisation');
    const photographersLine = displayedPhotographerInfos.querySelector('p.infos__text__slogan');
    const photographersDisplayedTags = displayedPhotographerInfos.querySelector('div.infos__tags');
    const photographerDisplayedPortrait = container.querySelector('img.avatar');
    

    document.title = `Page du photographe ${photographerObject.name}`;
    photographersPageTitle.innerText = photographerObject.name;
    photographersLocalisation.innerText = `${photographerObject.city}, ${photographerObject.country}`;
    photographersLine.innerText = photographerObject.tagline;
    removeChildTags(photographersDisplayedTags);
    for (let tag of photographerObject.tags) {
        let currentTagElement = document.createElement('div');
        currentTagElement.classList.add('infos__tags__item');
        currentTagElement.innerText = `#${tag}`;
        currentTagElement.dataset.tag = tag;
        const tagLabel = document.createElement('span');
        tagLabel.innerText = 'Tag';
        tagLabel.classList.add('sr-only');
        photographersDisplayedTags.appendChild(tagLabel);
        photographersDisplayedTags.appendChild(currentTagElement);
    }
    photographerDisplayedPortrait.setAttribute('src', `images/Sample_Photos/Photographers_ID_Photos/thumbnails/mini_${photographerObject.portrait}`);
}*/

// Variable used to filter tags
//let activeTag = '';

// Adds all the media to the specified container using the factory
function addMediaList(container, currentPhotographerData, mediaArray) {
    
    for (let currentMediaIndex in mediaArray) {
        let mediaObject = new mediaFactory(mediaArray[currentMediaIndex], currentPhotographerData);
        
        mediaObject.appendMedia(container, currentMediaIndex);
    }
}


/*function setPhotographerPrice (container = document.querySelector('div.stats__price'), photographerObject) {
    container.innerText = `${photographerObject.price}€ / jour`;
}*/

//Part relative to the modal form
contactBtn.addEventListener('click', () => {
    modalbg.style.display = 'block';
    const firstInput = document.querySelector('input#firstname');
    mainPage.setAttribute('aria-hidden', 'true');
    firstInput.focus();
    lockScroll();
});

closebtn.addEventListener('click', (e) => {
    e.preventDefault();
    modalbg.style.display = 'none';
    mainPage.setAttribute('aria-hidden','false');
    contactBtn.focus();
    unlockScroll();
});

modalForm.addEventListener('submit', submitContactForm);

function submitContactForm(e) {
    e.preventDefault();
    const firstNameElt = document.querySelector('#firstname');
    const lastNameElt = document.querySelector('#lastname');
    const emailElt = document.querySelector('#email');
    const contactMsgElt = document.querySelector('#message');

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

    const errorMsgs = formDataErrorCollection(formDataObject);

    if (errorMsgs.length > 0) {
        console.log(errorMsgs);
        return false;
    }

    const contentToDisplay = formDataValueCollection(formDataObject);

    console.log(contentToDisplay);
    contactBtn.focus();
}

function isNotEmptyString (value) {
    return value !== '';
}

function validEmailRegex(value) {
    return /[a-zA-Z0-9.-]+@[a-zA-Z0-9]+.[a-z]+/.test(value);
}

function formDataErrorCollection(objectToValidate) {
    const errorMessagesList = [];

    for (let [key,subObject] of Object.entries(objectToValidate)) {
        if (!subObject.isValid(subObject.value)) {
            errorMessagesList.push(`${key} error : ${subObject.errorMsg}`);
        }
    }

    return errorMessagesList;
    
}

function formDataValueCollection(validatedObject) {
    const valueList = [];

    for (let key of Object.keys(validatedObject)) {
        valueList.push(validatedObject[key].value);
    }

    return valueList;
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

function countLikes(accumulator, currentValue) {
    return accumulator + currentValue;
}

/*function setTotalLikes(mediaArray) {
    const likesElt = document.querySelector('div.stats__likes');
    const likesArray = mediaArray.map((mediaItem) => mediaItem.likes);
    const totalLikes = likesArray.reduce(countLikes);
    const likeIcon = createLikeIcon();
    

    likesElt.innerText = `${totalLikes} `;
    likesElt.dataset.totalLikes = totalLikes;
    likesElt.appendChild(likeIcon);
}*/

function createLikeIcon() {
    const likeIcon = document.createElement('span');
    likeIcon.classList.add('fas', 'fa-heart');
    likeIcon.setAttribute('aria-label','likes');
    return likeIcon
}

// Incrementing likes

let filteredMedias;

function makeLikeIconClickable(likeIcon, localLiked) {
    if (!localLiked) {
        likeIcon.addEventListener('click', addOneLike);
    }else{
        likeIcon.addEventListener('click', removeOneLike);
    }
}

function updateMediaObject(mediaObject, likes, localLiked) {
    mediaObject.likes = likes;
    mediaObject.localLiked = localLiked;
}

function addOneLike(e) {
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
}

function preventClickOnParent(elt) {
    elt.addEventListener('click', (e) => {
        e.stopPropagation();
    })
}

function updateTotalLikes(difference) {
    const likesElt = document.querySelector('div.stats__likes');
    let totalLikes = parseInt(likesElt.dataset.totalLikes,10);
    totalLikes += difference;

    const likeIcon = createLikeIcon();
    likesElt.innerText = `${totalLikes} `;
    likesElt.dataset.totalLikes = totalLikes.toString(10);
    likesElt.appendChild(likeIcon);
}

// When one media becomes more popular after incrementing its likes

function checkDrawLiking(likes, clickedMedia) {
    const drawsList = filteredMedias.filter(media => media.likes === parseInt(likes,10));
    if (drawsList.length > 1) {
        getReadyToAnimateDrawLiking(drawsList, clickedMedia);
    }
}

let movingHappens;

function getReadyToAnimateDrawLiking(drawMediaArray, clickedMedia,
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
}

function updateDOMAfterAnimateDraw(photographerData) {
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
    const positionArray = [];
    mediaEltArray.forEach(mediaElt => {
        const mediaEltCoords = getPosition(mediaElt);
        positionArray.push(mediaEltCoords);
    });
    return positionArray;
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

function getPhotographerId() {
    const queryString = window.location.search;
    return new URLSearchParams(queryString).get('id');
}

// Returns a promise
function reloadPhotographerData(photographerId) {
    return readJsonData()
        .then((fishEyeData) => {
            return fishEyeData.photographers.find(photographer => photographer.id === parseInt(photographerId,10));
        })
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

        //this.activeTag = '';
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

        this.photographerDisplayedPortrait.setAttribute('src', `images/Sample_Photos/Photographers_ID_Photos/thumbnails/mini_${this.photographerData.portrait}`);
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

    focusOnHeader() {
        this.headerContainer.focus();
    }

}

class MediaGallery {
    constructor(photographerData, mediaData,
                containerDOM = document.querySelector('.photo-wrapper')) {
        this.mediaContainer = containerDOM;
        this.photographerData = photographerData;
        this.mediaData = mediaData;

        //this.activeTag = '';
    }

    sortMedias(sortOption, mediaArray = this.mediaData) {
        const  resArray = sortingChoice(mediaArray, sortOption, this.photographerData.id);
        filteredMedias = resArray;
        return resArray;
    }

    rememberSort(option = 'Popularité', mediaArray = this.mediaData) {
        if (!localStorage.getItem(`photographer${this.photographerData.id}SortOption`)) {
            localStorage.setItem(`photographer${this.photographerData.id}SortOption`, 'Popularité');
        }else{
            option = localStorage.getItem(`photographer${this.photographerData.id}SortOption`);
        }
        const sortedArray = this.sortMedias(option, mediaArray);
        filteredMedias = sortedArray;
        this.addMediaListToGallery(sortedArray);
    }

    addMediaToGallery(mediaObject, index, container = this.mediaContainer) {
        mediaObject.appendMedia(container, index);
    }

    addMediaListToGallery(mediaArray = this.mediaData, container = this.mediaContainer, currentPhotographerData = this.photographerData) {
        console.log('Intern array', mediaArray);
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

window.addEventListener('load', () => {
    mainPage.style.display = 'none';
    readJsonData()
    .then((fishEyeData) => {
        const loader = document.querySelector('div.loader');
        // const header = document.querySelector('div.photograph-header');
        // Dom elements from the sorting menu
        //const sortBtn = document.querySelector('.sort-button');
        //const sortMenu = document.querySelector('ul.sort-dropdown');
        //const sortOptions = document.querySelectorAll('li.sort-dropdown__item');
        //const selectedSorting = document.querySelector('.sort-selected');
        //const sortMenuIcon = document.querySelector('.sort-container .fa-chevron-down');

        const photographersList = fishEyeData.photographers;
        const mediaList = fishEyeData.media;

        const currentId = getPhotographerId();

        if (currentId === null) {
            throw new Error('Photographer Id not specified');
        }
        const currentPhotographerData = photographersList.find(photographer => photographer.id === parseInt(currentId));

        if (currentPhotographerData === undefined) {
            throw new Error('Wrong Id specified');
        }
        const currentPhotographerMedias = mediaList.filter(media => media.photographerId === parseInt(currentId));

        //const sortedPhotographersMedias = rememberSort(currentPhotographerMedias, currentId);
        //filteredMedias = sortedPhotographersMedias;


        const displayedInfoObject = new PhotographerGlobalObject(currentPhotographerData, currentPhotographerMedias);
        displayedInfoObject.setPhotographerHeader();
        displayedInfoObject.setPhotographerPrice();
        displayedInfoObject.setTotalLikes();

        const contactName = document.querySelector('span.modal-name');
        contactName.textContent = currentPhotographerData.name;

        const mediaGallery = new MediaGallery(currentPhotographerData, currentPhotographerMedias);
        mediaGallery.rememberSort();

        loader.style.display = 'none';
        mainPage.style.display = '';
        displayedInfoObject.focusOnHeader();

        //Sorting menu
        class SortingDropDown {
            constructor(currentOption) {
                this.sortBtn = document.querySelector('.sort-button');
                this.sortMenu = document.querySelector('ul.sort-dropdown');
                this.sortOptions = document.querySelectorAll('li.sort-dropdown__item');
                this.selectedSorting = document.querySelector('.sort-selected');
                this.sortMenuIcon = document.querySelector('.sort-container .fa-chevron-down');
                this.currentOption = currentOption;
                this.menuExpanded = false;
            }

            displaySortMenu(e) {
                e.stopPropagation();

                this.sortMenu.style.display = 'block';
                this.sortMenu.focus();
                this.sortMenuIcon.style.transform = 'rotate(180deg)';
                this.sortMenuIcon.addEventListener('click', this.sortOptionSelected.bind(this));
                this.menuExpanded = true;
                this.sortBtn.setAttribute('aria-expanded', 'true');
                this.updateAriaSelected(this.sortOptions, 0);

            }

            closeDropDown() {
                if (this.sortMenu.style.display === 'block') {
                    this.sortMenu.style.display = '';
                    this.sortMenu.removeAttribute('aria-activedescendant');
                    this.sortMenuIcon.style.transform = '';
                    this.sortMenuIcon.removeEventListener('click', this.sortOptionSelected);
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
                const sortedArray = mediaGallery.sortMedias(this.currentOption);
                mediaGallery.addMediaListToGallery(sortedArray);

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
                this.selectedSorting.innerText = option;
            }

            rememberChoice() {
                if(localStorage.getItem(`photographer${mediaGallery.photographerData.id}SortOption`)) {
                    this.updateDisplayedChoice(localStorage.getItem(`photographer${mediaGallery.photographerData.id}SortOption`));
                }else{
                    this.updateDisplayedChoice('Popularité');
                }
            }

            attachListenerToSortBtn() {
                this.sortBtn.addEventListener('click', this.displaySortMenu.bind(this));
                this.sortMenuIcon.addEventListener('click', this.displaySortMenu.bind(this));
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

        }

        const DropDownObject = new SortingDropDown();
        DropDownObject.rememberChoice();
        DropDownObject.attachListenerToSortBtn();
        DropDownObject.attachListenerClickOutside();
        DropDownObject.attachListenerToSortOptions();
        DropDownObject.attachListenersToKeyBoard();

        // Filter photos by tag
        //const tagsArray = document.querySelectorAll('div.infos__tags__item');

        //tagsArray.forEach(tagElt => tagElt.addEventListener('click', filterPhotosByTag));

        /*function filterPhotosByTag(e) {
            let clickedTag = e.target.dataset.tag;

            if (clickedTag === activeTag) {
                activeTag = '';
                //Sorting the array may be needed
                let option = selectedSorting.innerText;
                mediaGallery.sortMedias(option);
            }else{
                //Since we cut an array already sorted, no need to sort here
                activeTag = clickedTag;
                //filteredMedias = sortedPhotographersMedias.filter(media => media.tags.includes(clickedTag));
            }
            mediaGallery.addMediaListToGallery();
            updateTagDisplay();
        }*/

        /*function updateTagDisplay() {
            tagsArray.forEach((tag) => {
                if (tag.dataset.tag === activeTag) {
                    tag.dataset.selected = 'true';
                }else{
                    tag.dataset.selected = 'false';
                }
            });
        }*/

        // Events relative to the sorting drop down menu
        /*sortBtn.addEventListener('click', displaySortMenu);
        sortMenuIcon.addEventListener('click', displaySortMenu);

        sortOptions.forEach(optionElt => {
            optionElt.addEventListener('click', sortOptionSelected);
        })


        function displaySortMenu(e) {
            e.stopPropagation();

            sortMenu.style.display = 'block';
            sortMenu.focus();
            sortMenuIcon.style.transform = 'rotate(180deg)';
            sortMenuIcon.addEventListener('click', sortOptionSelected);

            sortBtn.setAttribute('aria-expanded', 'true');
            updateAriaSelected(sortOptions, 0);

        }*/

        /*function rememberSort(mediaArray, photographerID) {
            let sortedArray;
            if (!localStorage.getItem(`photographer${photographerID}SortOption`)) {
                localStorage.setItem(`photographer${photographerID}SortOption`, 'Popularité');
                sortedArray = sortPopularity(mediaArray);
            }else{
                const lastSortOption = localStorage.getItem(`photographer${photographerID}SortOption`);
                sortedArray = sortingChoice(mediaArray, lastSortOption, photographerID);
            }
            return sortedArray;
        }*/

        // Functions for drop down menu and sorting items
        /*function sortOptionSelected(e) {
            e.stopPropagation();

            let option;
            
            if (e.target.tagName === 'LI') {
                option = e.target.textContent;
            }else{
                option = 'Popularité';
            }

            closeDropDown();

            let newSortedList = sortingChoice(filteredMedias, option, currentId);

            removeChildTags(mediaWrapper);
            addMediaList(mediaWrapper, currentPhotographerData, newSortedList);
            setTotalLikes(currentPhotographerMedias);

        }*/

        /*function updateAriaSelected(itemList, selectedItemIndex) {
            for (let item of itemList) {
                item.setAttribute('aria-selected', 'false');
                item.classList.remove('sort-focus');
            }
            itemList[selectedItemIndex].setAttribute('aria-selected', 'true');
            itemList[selectedItemIndex].classList.add('sort-focus');
            const itemIdList = [];
            itemList.forEach(item => itemIdList.push(item.id));

            sortMenu.setAttribute('aria-activedescendant',itemIdList[selectedItemIndex]);
        }*/

        //Controlling the dropdown with the keyboard
        /*window.addEventListener('keydown', (e) => {
            if(sortMenu.style.display === 'block') {

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    selectNextSortOption();
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    selectPreviousSortOption();
                }
                if (e.key === 'Escape') {
                    closeDropDown();
                }
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const focusedSortItem = document.querySelector('li.sort-dropdown__item[aria-selected=true]');
                    focusedSortItem.click();
                }
            }
        })*/

        /*function selectNextSortOption() {
            const focusedSortItem = document.querySelector('li.sort-dropdown__item[aria-selected=true]');
            let index = focusedSortItem.dataset.index;
            if (index < sortOptions.length - 1) {
                index++;
                updateAriaSelected(sortOptions, index);
            }
        }

        function selectPreviousSortOption() {
            const focusedSortItem = document.querySelector('li.sort-dropdown__item[aria-selected=true]');
            let index = focusedSortItem.dataset.index;
            if (index > 0) {
                index--;
                updateAriaSelected(sortOptions, index);
            }
        }*/

        // Closing dropdown without selecting
        //window.addEventListener('click', closeDropDown);

        /*function closeDropDown() {
            if (sortMenu.style.display === 'block') {
                sortMenu.style.display = '';
                sortMenu.removeAttribute('aria-activedescendant');
                sortMenuIcon.style.transform = '';
                sortMenuIcon.removeEventListener('click', sortOptionSelected);
                sortBtn.setAttribute('aria-expanded','false');
                sortBtn.focus();
            }
        }*/
        
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