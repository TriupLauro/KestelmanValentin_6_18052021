// Refactoring  with OOP
class PhotographerGallery {
    constructor(photographersList, containerDOM = document.getElementsByClassName('photograph-wrapper')[0]) {
        this.AllPhotographers = photographersList;
        this.navTagsDOM = document.querySelectorAll('div.nav-tag-item');
        this.photographersContainer = containerDOM;
        this.activeTag = '';
    }

    updatePhotographers(photographersList = this.AllPhotographers) {
        this.removeChildTags(this.photographersContainer);
        this.addPhotographersList(this.photographersContainer, photographersList)
    }

    attachListenerToNavTags() {
        this.navTagsDOM.forEach(tag => {
            tag.addEventListener('click', this.tagSelected.bind(this));
        });
    }

    updateNavTags(navTagsArray = this.navTagsDOM) {
        for (let currentTag of navTagsArray) {
            let tag = currentTag.dataset.tag;
            if (tag === this.activeTag) {
                currentTag.dataset.selected = 'true';
            } else {
                currentTag.dataset.selected = 'false';
            }
        }
    }

    tagSelected(e) {
        let tag = e.target.dataset.tag;
        let filteredPhotographers = this.AllPhotographers;
        if (this.activeTag === tag) {
            this.activeTag = '';
        } else {
            filteredPhotographers = filteredPhotographers.filter(photographer => photographer.tags.includes(tag));
            this.activeTag = tag;
        }
        this.updateNavTags(this.navTagsDOM);
        this.updatePhotographers(filteredPhotographers)
        if (e.target.classList.contains('photograph-profile__tags__tag-item')) {
            getCorrectFocus(e.target);
        }
    }

    addPhotographersList(container = this.photographersContainer, photographerArray = this.AllPhotographers) {
        for (let currentPhotographer of photographerArray) {
            this.appendPhotographer(container, currentPhotographer);
        }
    }

    appendPhotographer(container, photographerObject) {
        // We create all the element for the photographer profile on the homepage
        // And then append them to the specified container
        const photographerProfileElt = document.createElement('div');
        photographerProfileElt.classList.add('photograph-profile');
        const photographerProfileAvatarElt = document.createElement('a');
        photographerProfileAvatarElt.classList.add('photograph-profile__avatar');
        photographerProfileAvatarElt.setAttribute('href', `photographer-page.html?id=${photographerObject.id}`);
        const photographerPortraitElt = document.createElement('img');
        photographerPortraitElt.setAttribute('src', `images/Sample_Photos/Photographers_ID_Photos/thumbnails/mini_${photographerObject.portrait}`);
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
            if (currentTag === this.activeTag) {
                tagItemElt.dataset.selected = 'true';
            } else {
                tagItemElt.dataset.selected = 'false';
            }
            tagItemElt.dataset.tag = currentTag;
            tagItemElt.addEventListener('click', this.tagSelected.bind(this));
            photographerTagsElt.appendChild(tagItemElt);
        }
    }

    removeChildTags(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    displayPhotographers() {
        console.log(this.AllPhotographers);
    }
}

/*// Remove all the content inside a container element
function removeChildTags(container) {
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
}*/

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

// Focus on the photographer profile where the tag was clicked
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

// Event triggered on page launch
window.addEventListener('load', () => {
    readJsonData()
    .then((fishEyeData) => {
        const displayedGallery = new PhotographerGallery(fishEyeData.photographers);
        displayedGallery.updatePhotographers();
        displayedGallery.attachListenerToNavTags();
        displayedGallery.displayPhotographers();

        // Make the go to content button appear
        const goToContentBtn = document.querySelector('a.go-to-content');
        document.addEventListener('scroll',goToContentAppears);

        function goToContentAppears() {
            goToContentBtn.style.transform = 'translate(-50%, 200%)';
            document.removeEventListener('scroll', goToContentAppears);
        }
    })
});

