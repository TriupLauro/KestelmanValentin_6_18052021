
// Dom elements from the sorting menu
const sortBtn = document.querySelector('div.sort-button');
const sortMenu = document.querySelector('div.sort-dropdown');
const sortOptions = document.querySelectorAll('div.sort-dropdown__item');

// Dom elements from the modal
const contactBtn = document.querySelector('div.contact');
const modalbg = document.querySelector('div.modalbg');
const closebtn = document.querySelector('i.close');
const modalForm = document.querySelector('form.modal');

// Dom of the media container
const mediaWrapper = document.querySelector('div.photo-wrapper');

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

function appendMedia(container, photographerObject, mediaObject) {
    const mediaContainerElt = document.createElement('div');
    mediaContainerElt.classList.add('photo-container');
    if ("image" in mediaObject) {
        const imageElt = document.createElement('img');
        let folderName = photographerObject.name.substr(0, photographerObject.name.indexOf(' '));
        imageElt.setAttribute('src', `images/Sample_Photos/${folderName}/${mediaObject.image}`);
        mediaContainerElt.appendChild(imageElt);
    } else {
        return false;
    }
    const mediaDescriptionElt = document.createElement('p');
    mediaDescriptionElt.classList.add('photo-description');
    mediaDescriptionElt.textContent = mediaObject.title;
    const mediaLikesElt = document.createElement('span');
    mediaLikesElt.classList.add('photo-likes');
    mediaLikesElt.textContent = mediaObject.likes + ' ';
    const likeIconElt = document.createElement('i');
    likeIconElt.classList.add('fas','fa-heart');

    container.appendChild(mediaContainerElt);
    mediaContainerElt.appendChild(mediaDescriptionElt);
    mediaDescriptionElt.appendChild(mediaLikesElt);
    mediaLikesElt.appendChild(likeIconElt);
}

function addMediaList(container, photographerObject, mediaList) {
    for (let currentMedia of mediaList) {
        appendMedia(container, photographerObject, currentMedia);
    }
}

function updatePhotographerPrice (container = document.querySelector('div.stats__price'), photographerObject) {
    container.innerText = `${photographerObject.price}€ / jour`;
}

window.addEventListener('load', () => {
    let fishEyeData;
    // Dom elements from the photographers page header
    
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
        
        const sortedPhotographersMedias = currentPhotographerMedias.sort((a,b) => b.likes - a.likes);
        console.log(sortedPhotographersMedias);

        const photographerHeader = document.querySelector('div.photograph-header');
        updatePhotographerHeader(photographerHeader, currentPhotographerData);
        loader.style.display = 'none';
        const photographerPrice = document.querySelector('div.stats__price');
        updatePhotographerPrice(photographerPrice, currentPhotographerData);
        const contactName = document.querySelector('span.modal-name');
        contactName.textContent = currentPhotographerData.name;

        removeChildTags(mediaWrapper);
        addMediaList(mediaWrapper, currentPhotographerData, sortedPhotographersMedias);
    });
})

//Event triggered on clicking contact button
contactBtn.addEventListener('click', () => {
    modalbg.style.display = 'block';
});

//Event triggered on clicking the close modal btn
closebtn.addEventListener('click', () => {
    modalbg.style.display = 'none';
});

// Events relative to the sorting drop down menu
sortBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sortMenu.style.display = 'block';
});

sortOptions.forEach(option => {
    option.addEventListener('click', sortOptionSelected);
})

function sortOptionSelected(e) {
    e.stopPropagation();
    let option = e.target.textContent;
    console.log(option);
    const selectedSorting = document.querySelector('span.sort-selected');
    selectedSorting.textContent = option;
    sortMenu.style.display = 'none';
}

// Closing dropdown without selecting
window.addEventListener('click', closeDropDown);

function closeDropDown() {
    if (sortMenu.style.display === 'block') {
        sortMenu.style.display = 'none';
    }
}

// Event triggered on submitting the modal form
modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
});