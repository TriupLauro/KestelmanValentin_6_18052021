
// Global variables
//let photographersStored = new Set();
let photographersList;


// Dom elements
const navTags = document.querySelectorAll('div.nav-tag-item');
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
    let photographerProfileElt = document.createElement('div');
    photographerProfileElt.classList.add('photograph-profile');
    let photographerProfileAvatarElt = document.createElement('a');
    photographerProfileAvatarElt.classList.add('photograph-profile__avatar');
    photographerProfileAvatarElt.setAttribute('href', `photographer-page.html?id=${photographerObject.id}`);
    let photographerPortraitElt = document.createElement('img');
    photographerPortraitElt.setAttribute('src', `images/Sample_Photos/Photographers_ID_Photos/${photographerObject.portrait}`);
    let photographerNameElt = document.createElement('h2');
    photographerNameElt.textContent = `${photographerObject.name}`;
    let photographerDescriptionElt = document.createElement('div');
    photographerDescriptionElt.classList.add('photograph-profile__description');
    let photographerLocalisationElt = document.createElement('p');
    photographerLocalisationElt.classList.add('photograph-profile__localisation');
    photographerLocalisationElt.textContent = `${photographerObject.city}, ${photographerObject.country}`;
    let photographerSloganElt = document.createElement('p');
    photographerSloganElt.classList.add('photograph-profile__slogan');
    photographerSloganElt.textContent = photographerObject.tagline;
    let photographerPriceElt = document.createElement('p');
    photographerPriceElt.classList.add('photograph-profile__price');
    photographerPriceElt.textContent = `${photographerObject.price}€/jour`;
    let photographerTagsElt = document.createElement('div');
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

// Function called on clicking a tag
function tagSelected(e) {
    let rawTag = e.target.textContent;
    let lowercaseTag = rawTag.toLowerCase().slice(1);
    
    let filteredPhotographers = photographersList.filter(photographer => photographer.tags.includes(lowercaseTag));
    
    removeChildTags(photographersContainer);
    for (let currentPhotographer of filteredPhotographers) {
        appendPhotographer(photographersContainer, currentPhotographer);
    }
}

