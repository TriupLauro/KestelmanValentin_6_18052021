
// Dom elements from the modal form
const contactBtn = document.querySelector('div.contact');
const modalbg = document.querySelector('div.modalbg');
const closebtn = document.querySelector('i.close');
const modalForm = document.querySelector('form.modal');

// Dom of the media container
const mediaWrapper = document.querySelector('div.photo-wrapper');

// Events for the lightbox modal
const lightboxBg = document.querySelector('div.lightbox-bg');
const lightboxClose = document.querySelector('div.lightbox__close');
const lightboxTitle = document.querySelector('p.lightbox__title');
const lightboxPrevious = document.querySelector('div.lightbox__previous');
const lightboxNext = document.querySelector('div.lightbox__next');

lightboxClose.addEventListener('click', () => {
    lightboxBg.style.display = 'none';
});

function goToPreviousMedia() {
    const mediaEltsList = document.querySelectorAll('div.photo-container');
    const displayedMedia = document.querySelector('.lightbox__img');
    const lightbox = document.querySelector('div.lightbox');

    let previousIndex;
    
    if (lightbox.dataset.index === '0') {
        previousIndex = mediaEltsList.length - 1;
    }else{
        previousIndex = lightbox.dataset.index - 1;
    }

    
    const previousElt = document.querySelector(`.photo-container[data-index='${previousIndex}'] > *`);
    
    const previousTitleElt = document.querySelector(`.photo-container[data-index='${previousIndex}'] > .photo-description`);
    

    const previousTitleText = previousTitleElt.innerText.slice(0, previousTitleElt.innerText.indexOf('\n'));
    
    lightboxTitle.innerText = previousTitleText;

    if (previousElt.tagName === 'IMG') {
        
        const previousImage = document.createElement('img')
        previousImage.setAttribute('src', previousElt.src);
        previousImage.classList.add('lightbox__img');
        lightbox.removeChild(displayedMedia);
        lightbox.insertBefore(previousImage, lightbox.firstChild);
        lightbox.dataset.index = previousIndex;

    }

    if (previousElt.tagName === 'VIDEO') {

        const previousVideoElt = document.createElement('video');
        const previousVideoSourceElt = document.createElement('source')
        previousVideoSourceElt.setAttribute('src',previousElt.firstChild.src);
        previousVideoElt.classList.add('lightbox__img');
        previousVideoElt.appendChild(previousVideoSourceElt);
        previousVideoElt.toggleAttribute('controls');
        lightbox.removeChild(displayedMedia);
        lightbox.insertBefore(previousVideoElt, lightbox.firstChild);
        lightbox.dataset.index = previousIndex;
    }
    
}

function goToNextMedia() {
    const mediaEltsList = document.querySelectorAll('div.photo-container');
    const displayedMedia = document.querySelector('.lightbox__img');
    const lightbox = document.querySelector('div.lightbox');

    let nextIndex;
    
    if (parseInt(lightbox.dataset.index,10) === (mediaEltsList.length - 1)) {
        nextIndex = 0;
        
    }else{
        nextIndex = parseInt(lightbox.dataset.index,10) + 1;
    }

    const nextElt = document.querySelector(`.photo-container[data-index='${nextIndex}'] > *`);
    const nextTitleElt = document.querySelector(`.photo-container[data-index='${nextIndex}'] > .photo-description`);

    const nextTitleText = nextTitleElt.innerText.slice(0, nextTitleElt.innerText.indexOf('\n'));
    
    lightboxTitle.innerText = nextTitleText;

    if (nextElt.tagName === 'IMG') {
        
        const nextImage = document.createElement('img');
        nextImage.setAttribute('src', nextElt.src);
        nextImage.classList.add('lightbox__img');
        lightbox.removeChild(displayedMedia);
        lightbox.insertBefore(nextImage, lightbox.firstChild);
        lightbox.dataset.index = nextIndex;
    }
    
    if (nextElt.tagName === 'VIDEO') {

        const nextVideoElt = document.createElement('video');
        const nextVideoSourceElt = document.createElement('source')
        nextVideoSourceElt.setAttribute('src',nextElt.firstChild.src);
        nextVideoElt.classList.add('lightbox__img');
        nextVideoElt.appendChild(nextVideoSourceElt);
        nextVideoElt.toggleAttribute('controls');
        lightbox.removeChild(displayedMedia);
        lightbox.insertBefore(nextVideoElt, lightbox.firstChild);
        lightbox.dataset.index = nextIndex;
    }
}

lightboxPrevious.addEventListener('click', goToPreviousMedia);

lightboxNext.addEventListener('click', goToNextMedia);

document.addEventListener('keydown', (e) => {
    if (lightboxBg.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            goToPreviousMedia();
        }
        if (e.key === 'ArrowRight') {
            goToNextMedia();
        }
    }
});

// Media classes, used by the media factory
// Each of the two classes have theire respective appendMedia method to add the corrects DOM elements
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
    }
    appendMedia(container, index) {
        const mediaContainerElt = createMediaFrame(this.title, this.likes);

        const imageElt = document.createElement('img');
        this.fullPath = `images/Sample_Photos/${this.folderName}/${this.fileName}`;
        imageElt.setAttribute('src', this.fullPath);
        imageElt.classList.add('thumbnail');
        mediaContainerElt.insertBefore(imageElt,mediaContainerElt.firstChild);
        mediaContainerElt.dataset.index = index;
        mediaContainerElt.dataset.title = this.title;

        

        container.appendChild(mediaContainerElt);
        mediaContainerElt.addEventListener('click', (e) => {
            
            const lastImage = document.querySelector('.lightbox__img');
            const lightbox = document.querySelector('div.lightbox')
            const mediaSrc = e.target.src
            const dataHolder = e.target.parentElement
            const mediaTitle = dataHolder.dataset.title;
            

            lightboxBg.style.display = 'block';

            
            const imageElt = document.createElement('img');
            imageElt.setAttribute('src', mediaSrc);
            imageElt.classList.add('lightbox__img');
            lightbox.removeChild(lastImage);
            imageElt.dataset.index = parseInt(dataHolder.dataset.index, 10);
            lightbox.dataset.index = parseInt(dataHolder.dataset.index, 10);

            lightbox.insertBefore(imageElt, lightbox.firstChild);

            

            lightboxTitle.innerText = mediaTitle;
            lightboxPrevious.lightboxTitleArgument = lightboxTitle;


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
    }

    appendMedia(container, index) {
        const mediaContainerElt = createMediaFrame(this.title, this.likes);

        this.fullPath = `images/Sample_Photos/${this.folderName}/${this.fileName}`
        mediaContainerElt.dataset.src = this.fullPath;

        const videoElt = document.createElement('video');
        const videoSourceElt = document.createElement('source');
        videoSourceElt.setAttribute('src', this.fullPath);
        videoElt.appendChild(videoSourceElt);

        mediaContainerElt.insertBefore(videoElt, mediaContainerElt.firstChild);
        mediaContainerElt.dataset.index = index;
        mediaContainerElt.dataset.title = this.title;

        
        container.appendChild(mediaContainerElt);
        
        mediaContainerElt.addEventListener('click', (e) => {
            
            const ligthbox = document.querySelector('div.lightbox');
            lightboxBg.style.display = 'block';
            const fullImage = document.querySelector('.lightbox__img');
            const mediaHolder = e.target.parentElement;
            const mediaTitle = mediaHolder.dataset.title;

            
            ligthbox.removeChild(fullImage);
            const videoMedia = document.createElement('video');
            videoMedia.classList.add('lightbox__img');
            videoMedia.toggleAttribute('controls');
            ligthbox.insertBefore(videoMedia, lightboxTitle);
            
            const videoSource = document.createElement('source');
            videoSource.setAttribute('src', mediaContainerElt.dataset.src);
            videoMedia.appendChild(videoSource);
            
            lightboxTitle.innerText = mediaTitle;

            videoMedia.dataset.index = parseInt(mediaHolder.dataset.index, 10);

        });
    }
}

// Create, without adding it to the page, the frame with the titles and the likes
// Ready but without the media itself
function createMediaFrame(title, likes) {
    const mediaFrameElt = document.createElement('div');
    mediaFrameElt.classList.add('photo-container');

    const mediaDescriptionElt = document.createElement('p');
    mediaDescriptionElt.classList.add('photo-description');
    mediaDescriptionElt.textContent = title;
    const mediaLikesElt = document.createElement('span');
    mediaLikesElt.classList.add('photo-likes');
    mediaLikesElt.textContent = likes + ' ';
    const likeIconElt = document.createElement('i');
    likeIconElt.classList.add('fas','fa-heart');

    mediaFrameElt.appendChild(mediaDescriptionElt);
    mediaDescriptionElt.appendChild(mediaLikesElt);
    mediaLikesElt.appendChild(likeIconElt);

    return mediaFrameElt;
}

// The factory that create the appropriate media object, just by checking the presence
// of a video or image key in the object extracted from the JSON file
function mediaFactory(mediaObject, photographerObject) {
    let media;
    
    if ('image' in mediaObject) {
        media = new Photograph(mediaObject, photographerObject);
    }

    if ('video' in mediaObject) {
        media = new Video(mediaObject, photographerObject);
    }
    
    return media;
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

// Remove all the content inside a container element
function removeChildTags(container) {
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

// Update the information displayed on the photographer's page
// It modify the existing html content without adding or removing tags
function setPhotographerHeader(container = document.querySelector('photograph-header'), photographerObject) {
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
        photographersDisplayedTags.innerHTML = '';
        for (let tag of photographerObject.tags) {
            let currentTagElement = document.createElement('div');
            currentTagElement.classList.add('infos__tags__item');
            currentTagElement.innerText = `#${tag}`;
            photographersDisplayedTags.appendChild(currentTagElement);
    }
    photographerDisplayedPortrait.setAttribute('src', `images/Sample_Photos/Photographers_ID_Photos/${photographerObject.portrait}`);
}

// Adds all the media to the specified container using the factory
function addMediaList(container, currentPhotographerData, mediaArray) {
    
    for (let currentMediaIndex in mediaArray) {
        let mediaObject = new mediaFactory(mediaArray[currentMediaIndex], currentPhotographerData);
        
        mediaObject.appendMedia(container, currentMediaIndex);
    }
}

function setPhotographerPrice (container = document.querySelector('div.stats__price'), photographerObject) {
    container.innerText = `${photographerObject.price}€ / jour`;
}

//Part relative to the modal form
contactBtn.addEventListener('click', () => {
    modalbg.style.display = 'block';
});

closebtn.addEventListener('click', () => {
    modalbg.style.display = 'none';
});

modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
});

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
    
    let sortedObjectArray = sortedList.map((mediaItem) => mediaArray[mediaItem.index]);
    
    return sortedObjectArray;
}

function sortDate(mediaArray) {
    let dateArray = mediaArray.map((mediaItem) => new Date(mediaItem.date));

    let dateArrayWithIndex = [];
    for (let date of dateArray) {
        dateArrayWithIndex.push({index : dateArray.indexOf(date), date});
    }
    
    let sortedList = dateArrayWithIndex.sort((a,b) => b.date - a.date);
    
    let sortedObjectArray = sortedList.map((mediaItem) => mediaArray[mediaItem.index]);
    return sortedObjectArray;
}

function sortPopularity(mediaArray) {
    return mediaArray.sort((a,b) => b.likes - a.likes);
}

window.addEventListener('load', () => {
    readJsonData()
    .then((fishEyeData) => {
        const loader = document.querySelector('div.loader');
    
        // Dom elements from the sorting menu
        const sortBtn = document.querySelector('div.sort-button');
        const sortMenu = document.querySelector('div.sort-dropdown');
        const sortOptions = document.querySelectorAll('div.sort-dropdown__item');
        const selectedSorting = document.querySelector('span.sort-selected');
        
        const photographersList = fishEyeData.photographers;
        const mediaList = fishEyeData.media;
        

        const queryString = window.location.search;
        const currentId = new URLSearchParams(queryString).get('id');
        
        const currentPhotographerData = photographersList.find(photographer => photographer.id === parseInt(currentId));
        const currentPhotographerMedias = mediaList.filter(media => media.photographerId === parseInt(currentId));

        const sortedPhotographersMedias = rememberSort(currentPhotographerMedias);

        const photographerHeader = document.querySelector('div.photograph-header');
        setPhotographerHeader(photographerHeader, currentPhotographerData);
        const photographerPrice = document.querySelector('div.stats__price');
        setPhotographerPrice(photographerPrice, currentPhotographerData);

        const contactName = document.querySelector('span.modal-name');
        contactName.textContent = currentPhotographerData.name;

        removeChildTags(mediaWrapper);
        addMediaList(mediaWrapper, currentPhotographerData, sortedPhotographersMedias);

        loader.style.display = 'none';
        
        

        

        // Events relative to the sorting drop down menu
        sortBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sortMenu.style.display = 'block';
        });
        
        // The parameters for the callback function are passed to the optionElt object
        sortOptions.forEach(optionElt => {
            optionElt.addEventListener('click', sortOptionSelected);
        })
        

        function rememberSort(mediaArray) {
            let sortedArray;
            if (!localStorage.getItem(`photographer${currentId}SortOption`)) {
            
                localStorage.setItem(`photographer${currentId}SortOption`, 'Popularité');
                sortedArray = sortPopularity(mediaArray);
            }else{
                
                const lastSortOption = localStorage.getItem(`photographer${currentId}SortOption`);
                switch(lastSortOption) {
                    case 'Popularité' :
                    sortedArray = sortPopularity(mediaArray);
                    selectedSorting.textContent = 'Popularité';
                    break;
    
                    case 'Titre' :
                    sortedArray = sortAlphabeticalOrder(mediaArray);
                    selectedSorting.textContent = 'Titre';
                    break;
    
                    case 'Date' :
                    sortedArray = sortDate(mediaArray);
                    selectedSorting.textContent = 'Date';
                    break;
                }
            }
            return sortedArray;
        }

        // Functions for drop down menu and sorting items
        function sortOptionSelected(e) {
            e.stopPropagation();

            let option;
            
            if (e.target.tagName === 'DIV') {
                
                option = e.target.textContent;
            }else{
                
                option = e.target.parentElement.textContent;
            }
            
            selectedSorting.textContent = option;
            
            sortMenu.style.display = 'none';
            
            let newSortedList;
            switch(option) {
                case 'Titre' :
                newSortedList = sortAlphabeticalOrder(currentPhotographerMedias);
                localStorage.setItem(`photographer${currentId}SortOption`, 'Titre');
                break;

                case 'Popularité' :
                newSortedList = sortPopularity(currentPhotographerMedias);
                localStorage.setItem(`photographer${currentId}SortOption`, 'Popularité');
                break;

                case 'Date' :
                newSortedList = sortDate(currentPhotographerMedias);
                localStorage.setItem(`photographer${currentId}SortOption`, 'Date');
                break;
            }
            removeChildTags(mediaWrapper);
            addMediaList(mediaWrapper, currentPhotographerData, newSortedList);
        }

        // Closing dropdown without selecting
        window.addEventListener('click', closeDropDown);

        function closeDropDown() {
            if (sortMenu.style.display === 'block') {
                sortMenu.style.display = 'none';
            }
        }

        
    });
})