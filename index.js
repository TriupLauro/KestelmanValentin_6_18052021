
// Global variables
let photographersList;
let activeTag = '';

// Dom elements
const navTags = document.querySelectorAll('div.nav-tag-item');
const tagItems = document.querySelectorAll('div.photograph-profile__tags__tag-item');
const photographersContainer = document.getElementsByClassName('photograph-wrapper')[0];


// Event triggered on page launch
window.addEventListener('load', () => {
    readJsonData()
    .then((fishEyeData) => {
        
        photographersList = fishEyeData.photographers;

        removeChildTags(photographersContainer);
        addPhotographersList(photographersContainer, photographersList);

        // Click a tag in navigation event
        navTags.forEach(tag => {
            
            tag.addEventListener('click', tagSelected);
        });
        
        tagItems.forEach(tag => {
            
            tag.addEventListener('click', tagSelected);
        });

    })
});

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
        const srOnlyText = document.createElement('span');
        srOnlyText.textContent = 'Tag';
        srOnlyText.classList.add('sr-only');
        tagItemElt.textContent = `#${currentTag}`;
        tagItemElt.insertBefore(srOnlyText,tagItemElt.firstChild);
        if (currentTag === activeTag) {
            tagItemElt.dataset.selected = 'true';
        } else {
            tagItemElt.dataset.selected = 'false';
        }
        tagItemElt.dataset.tag = currentTag;
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

// Function called on clicking a tag
function tagSelected(e) {
    
    let tag = e.target.dataset.tag;
    
    let filteredPhotographers;
    if (activeTag === tag) {
        filteredPhotographers = photographersList;
        activeTag = '';
    } else {
        filteredPhotographers = photographersList.filter(photographer => photographer.tags.includes(tag));
        activeTag = tag;
    }
    
    updateNavTags(navTags);

    removeChildTags(photographersContainer);
    addPhotographersList(photographersContainer, filteredPhotographers)

    if (e.target.classList.contains('photograph-profile__tags__tag-item')) {
        getCorrectFocus(e.target);
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

function addPhotographersList(container, photographerArray) {
    for (let currentPhotographer of photographerArray) {
        appendPhotographer(container, currentPhotographer);
    }
}

function getCorrectFocus(clickedTag) {
    const tagContainer = clickedTag.parentElement;
    const description = tagContainer.previousSibling;
    const correctAvatar = description.previousSibling;
    const correctName = correctAvatar.text;
    
    const allh2 = document.querySelectorAll('h2');
    for (let currenth2 of allh2) {
        if (correctName === currenth2.innerText) {
            const correctLink = currenth2.parentElement;
            correctLink.focus();
            return 
        }
    }
}