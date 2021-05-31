
// Dom elements from the modal
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
const fullImage = document.querySelector('img.lightbox__img');

lightboxClose.addEventListener('click', () => {
    lightboxBg.style.display = 'none';
});

function goToPreviousMedia() {
    const mediaEltsList = document.querySelectorAll('div.photo-container');

    let previousIndex;
    
    if (fullImage.dataset.index === '0') {
        previousIndex = mediaEltsList.length - 1;
    }else{
        previousIndex = fullImage.dataset.index - 1;
    }
    const previousElt = document.querySelector(`.photo-container[data-index='${previousIndex}'] > *`);
    const previousTitleElt = document.querySelector(`.photo-container[data-index='${previousIndex}'] > .photo-description`);

    const previousTitleText = previousTitleElt.innerText.slice(0, previousTitleElt.innerText.indexOf('\n'));
    
    lightboxTitle.innerText = previousTitleText;

    if (previousElt.tagName === fullImage.tagName) {
        
        fullImage.setAttribute('src', previousElt.src);
    }

    fullImage.dataset.index = previousIndex;
    
}

function goToNextMedia() {
    const mediaEltsList = document.querySelectorAll('div.photo-container');

    let nextIndex;
    
    if (parseInt(fullImage.dataset.index,10) === (mediaEltsList.length - 1)) {
        nextIndex = 0;
        console.log('end of the list');
    }else{
        nextIndex = parseInt(fullImage.dataset.index,10) + 1;
    }

    const nextElt = document.querySelector(`.photo-container[data-index='${nextIndex}'] > *`);
    const nextTitleElt = document.querySelector(`.photo-container[data-index='${nextIndex}'] > .photo-description`);

    const nextTitleText = nextTitleElt.innerText.slice(0, nextTitleElt.innerText.indexOf('\n'));
    
    lightboxTitle.innerText = nextTitleText;

    if (nextElt.tagName === fullImage.tagName) {
        
        fullImage.setAttribute('src', nextElt.src);
    }

    fullImage.dataset.index = nextIndex;
    
}

lightboxPrevious.addEventListener('click', goToPreviousMedia);

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

lightboxNext.addEventListener('click', goToNextMedia);

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

        

        container.appendChild(mediaContainerElt);
        mediaContainerElt.addEventListener('click', (e) => {
            
            const mediaSrc = e.target.src
            const mediaTitleRaw = e.target.nextSibling.innerText;
            const mediaTitle = mediaTitleRaw.slice(0,mediaTitleRaw.indexOf('\n'));

            lightboxBg.style.display = 'block';

            fullImage.setAttribute('src', mediaSrc);

            lightboxTitle.innerText = mediaTitle;
            lightboxPrevious.lightboxTitleArgument = lightboxTitle;

            fullImage.dataset.index = parseInt(e.target.parentElement.dataset.index, 10);
            

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

        // Adds a placeholder play button instead of a thumbnail
        const playBtnElt = document.createElement('div');
        const playIconElt = document.createElement('i');
        playBtnElt.classList.add('play-btn','thumbnail');
        playIconElt.classList.add('far', 'fa-play-circle');
        playBtnElt.appendChild(playIconElt);
        mediaContainerElt.insertBefore(playBtnElt, mediaContainerElt.firstChild);
        mediaContainerElt.dataset.index = index;

        container.appendChild(mediaContainerElt);
        
        // TODO : Add video elements
        mediaContainerElt.addEventListener('click', () => {
            console.log('Clicked on video');
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
function updatePhotographerHeader(container = document.querySelector('photograph-header'), photographerObject) {
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

// Needs to be after the data is loaded, otherwise cause an error if the loader 
// is hiding the element to update
function updatePhotographerPrice (container = document.querySelector('div.stats__price'), photographerObject) {
    container.innerText = `${photographerObject.price}€ / jour`;
}

window.addEventListener('load', () => {
    let fishEyeData;
    
    readJsonData()
    .then((v) => {
        const loader = document.querySelector('div.loader');
        
        fishEyeData = v;
        
        const photographersList = fishEyeData.photographers;
        const mediaList = fishEyeData.media;
        

        const queryString = window.location.search;
        const currentId = new URLSearchParams(queryString).get('id');
        
        const currentPhotographerData = photographersList.find(photographer => photographer.id === parseInt(currentId));
        const currentPhotographerMedias = mediaList.filter(media => media.photographerId === parseInt(currentId));
        
        const sortedPhotographersMedias = sortPopularity(currentPhotographerMedias);
        
        const photographerHeader = document.querySelector('div.photograph-header');
        updatePhotographerHeader(photographerHeader, currentPhotographerData);
        loader.style.display = 'none';
        const photographerPrice = document.querySelector('div.stats__price');
        updatePhotographerPrice(photographerPrice, currentPhotographerData);
        const contactName = document.querySelector('span.modal-name');
        contactName.textContent = currentPhotographerData.name;

        removeChildTags(mediaWrapper);
        addMediaList(mediaWrapper, currentPhotographerData, sortedPhotographersMedias);

        // Dom elements from the sorting menu
        const sortBtn = document.querySelector('div.sort-button');
        const sortMenu = document.querySelector('div.sort-dropdown');
        const sortOptions = document.querySelectorAll('div.sort-dropdown__item');
        const sortChevronIcon = document.querySelector('div.sort-dropdown__item i');

        // Events relative to the sorting drop down menu
        sortBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sortMenu.style.display = 'block';
        });
        
        // The parameters for the callback function are passed to the optionElt object
        sortOptions.forEach(optionElt => {
            optionElt.parameterMedia = currentPhotographerMedias;
            optionElt.parameterPhotographer = currentPhotographerData;
            optionElt.parameterMenuElt = sortMenu;
            optionElt.addEventListener('click', sortOptionSelected);
        })
        // Hotfix when clicking on the chevron Icon
        sortChevronIcon.parameterMedia = currentPhotographerMedias;
        sortChevronIcon.parameterPhotographer = currentPhotographerData;
        sortChevronIcon.parameterMenuElt = sortMenu;

        // Closing dropdown without selecting
        window.addEventListener('click', closeDropDown);

        function closeDropDown() {
            if (sortMenu.style.display === 'block') {
                sortMenu.style.display = 'none';
            }
        }

        
    });
})

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

// Functions for drop down menu and sorting items
function sortOptionSelected(e) {
    e.stopPropagation();
    let option = e.target.textContent;
    console.log(option);
    
    const selectedSorting = document.querySelector('span.sort-selected');
    selectedSorting.textContent = option;

    e.target.parameterMenuElt.style.display = 'none';
    //console.log(e.target.parameterMedia);
    let newSortedList;
    switch(option) {
        case 'Titre' :
            newSortedList = sortAlphabeticalOrder(e.target.parameterMedia);
            break;
        case 'Popularité' :
            newSortedList = sortPopularity(e.target.parameterMedia);
            break;
        case 'Date' :
            newSortedList = sortDate(e.target.parameterMedia);
            break;
        default:
            // Only reached when clicked on the chevron icon, which is next to Popularité
            newSortedList = sortPopularity(e.target.parameterMedia);
            selectedSorting.textContent = 'Popularité';
    }
    removeChildTags(mediaWrapper);
    addMediaList(mediaWrapper, e.target.parameterPhotographer, newSortedList);
}

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

