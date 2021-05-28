
// Global variables
let photographersList;
let activeTag = '';

// Dom elements
const navTags = document.querySelectorAll('div.nav-tag-item');
const tagItems = document.querySelectorAll('div.photograph-profile__tags__tag-item');
const photographersContainer = document.getElementsByClassName('photograph-wrapper')[0];


// Remove all the content inside a container element
function removeChildTags(container) {
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function appendPhotographer(container, photographerObject) {
    // We create all the element for the photographer profile on the homepage
    // And then append them to the specified container
    const photographerProfileElt = document.createElement('div');
    photographerProfileElt.classList.add('photograph-profile');
    const photographerProfileAvatarElt = document.createElement('a');
    photographerProfileAvatarElt.classList.add('photograph-profile__avatar');
    photographerProfileAvatarElt.setAttribute('href', `photographer-page.html?id=${photographerObject.id}`);
    const photographerPortraitElt = document.createElement('img');
    photographerPortraitElt.setAttribute('src', `images/Sample_Photos/Photographers_ID_Photos/${photographerObject.portrait}`);
    const photographerNameElt = document.createElement('h2');
    photographerNameElt.textContent = `${photographerObject.name}`;
    const photographerDescriptionElt = document.createElement('div');
    photographerDescriptionElt.classList.add('photograph-profile__description');
    const photographerLocalisationElt = document.createElement('p');
    photographerLocalisationElt.classList.add('photograph-profile__localisation');
    photographerLocalisationElt.textContent = `${photographerObject.city}, ${photographerObject.country}`;
    const photographerSloganElt = document.createElement('p');
    photographerSloganElt.classList.add('photograph-profile__slogan');
    photographerSloganElt.textContent = photographerObject.tagline;
    const photographerPriceElt = document.createElement('p');
    photographerPriceElt.classList.add('photograph-profile__price');
    photographerPriceElt.textContent = `${photographerObject.price}€/jour`;
    const photographerTagsElt = document.createElement('div');
    photographerTagsElt.classList.add('photograph-profile__tags');

    container.appendChild(photographerProfileElt);
    photographerProfileElt.appendChild(photographerProfileAvatarElt);
    photographerProfileAvatarElt.appendChild(photographerPortraitElt);
    photographerProfileAvatarElt.appendChild(photographerNameElt);
    photographerProfileElt.appendChild(photographerDescriptionElt);
    photographerDescriptionElt.appendChild(photographerLocalisationElt);
    photographerDescriptionElt.appendChild(photographerSloganElt);
    photographerDescriptionElt.appendChild(photographerPriceElt);
    photographerProfileElt.appendChild(photographerTagsElt);
    for (let currentTag of photographerObject.tags) {
        let tagItemElt = document.createElement('div');
        tagItemElt.classList.add('photograph-profile__tags__tag-item');
        tagItemElt.textContent = `#${currentTag}`;
        if (currentTag === activeTag) {
            tagItemElt.dataset.selected = 'true';
        } else {
            tagItemElt.dataset.selected = 'false';
        }
        tagItemElt.addEventListener('click', tagSelected);
        photographerTagsElt.appendChild(tagItemElt);
    }
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

// Event triggered on page launch
window.addEventListener('load', () => {
    readJsonData()
    .then((v) => {
        let fishEyeData;
        
        fishEyeData = v;
        photographersList = fishEyeData.photographers;

    })
});

// Click a tag in navigation event
navTags.forEach(tag => {
    
    tag.addEventListener('click', tagSelected);
});

tagItems.forEach(tag => {
    
    tag.addEventListener('click', tagSelected);
});

// Function called on clicking a tag
function tagSelected(e) {
    
    let rawTag = e.target.textContent;
    let lowercaseTag = rawTag.toLowerCase().slice(1);
    let filteredPhotographers;
    if (activeTag === lowercaseTag) {
        filteredPhotographers = photographersList;
        activeTag = '';
    } else {
        filteredPhotographers = photographersList.filter(photographer => photographer.tags.includes(lowercaseTag));
        activeTag = lowercaseTag;
    }
    
    updateNavTags(navTags);

    removeChildTags(photographersContainer);
    for (let currentPhotographer of filteredPhotographers) {
        appendPhotographer(photographersContainer, currentPhotographer);
    }

}

function updateNavTags(navTagsArray) {
    for (let currentTag of navTagsArray) {
        let rawTag = currentTag.textContent;
        let lowercaseTag = rawTag.toLowerCase().slice(1);
        if (lowercaseTag === activeTag) {
            currentTag.dataset.selected = 'true';
        } else {
            currentTag.dataset.selected = 'false';
        }
    }
}

