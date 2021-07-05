//Class used to display dynamically the gallery of photographer on the homepage (index.html)

export default class PhotographerGallery {
    constructor(photographersList,
                containerDOM = document.querySelector('div.photograph-wrapper'),
                navTagsDOM = document.querySelectorAll('div.nav-tag-item'),
                gotoContent = document.querySelector('a.go-to-content')) {
        this.allPhotographers = photographersList;
        this.navTagsDOM = navTagsDOM;
        this.photographersContainer = containerDOM;
        this.activeTag = '';
        this.gotoContent = gotoContent;
    }

    //This method only displays the photographers present in the array passed as argument
    updatePhotographers(photographersList = this.allPhotographers) {
        this.removeChildTags(this.photographersContainer);
        this.addPhotographersList(this.photographersContainer, photographersList)
    }

    attachListenerToNavTags() {
        this.navTagsDOM.forEach(tag => {
            tag.addEventListener('click', this.tagSelected.bind(this));
        });
    }

    //Modify the appearance of the tags present in the nav bar at the top
    //The tag selected by the user (activeTag) becomes red
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

    //Event triggered when clicking a tag (from the nav bar on the top or from a photographer profile)
    //The filtered array is stored in filteredPhotographers and then displayed thanks to updatePhotographers
    tagSelected(e) {
        let tag = e.target.dataset.tag;
        let filteredPhotographers = this.allPhotographers;
        if (this.activeTag === tag) {
            this.activeTag = '';
        } else {
            filteredPhotographers = filteredPhotographers.filter(photographer => photographer.tags.includes(tag));
            this.activeTag = tag;
        }
        this.updateNavTags(this.navTagsDOM);
        this.updatePhotographers(filteredPhotographers)
        //Only triggers get Correct focus if the tag is from the photographer profile
        if (e.target.classList.contains('photograph-profile__tags__tag-item')) {
            this.getCorrectFocus(e.target);
        }
    }

    //Calls appendPhotographers on each photographer object contained in the array passed as argument
    addPhotographersList(container = this.photographersContainer, photographerArray = this.allPhotographers) {
        for (let currentPhotographer of photographerArray) {
            this.appendPhotographer(container, currentPhotographer);
        }
    }

    //Creates all the DOM elements or the photographer profile on the homepage
    //And then append them to the specified container
    //Getting the correct urls and text element directly from the photographerObject passed as argument
    appendPhotographer(container, photographerObject) {
        //Creating all the elements and applying the correct classes for css styling
        const photographerProfileElt = document.createElement('div');
        photographerProfileElt.classList.add('photograph-profile');
        const photographerProfileAvatarElt = document.createElement('a');
        photographerProfileAvatarElt.classList.add('photograph-profile__avatar');
        //Specifying the correct url with the id corresponding to the photographer
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

        //Once all the DOM elements are created, apart from the tags, they are added to the document
        //thanks to appendChild
        container.appendChild(photographerProfileElt);
        photographerProfileElt.appendChild(photographerProfileAvatarElt);
        photographerProfileAvatarElt.appendChild(photographerPortraitElt);
        photographerProfileAvatarElt.appendChild(photographerNameElt);
        photographerProfileElt.appendChild(photographerDescriptionElt);
        photographerDescriptionElt.appendChild(photographerLocalisationElt);
        photographerDescriptionElt.appendChild(photographerSloganElt);
        photographerDescriptionElt.appendChild(photographerPriceElt);
        photographerProfileElt.appendChild(photographerTagsElt);
        //Go through each tag of the photographer object and create then append the correct DOM elements
        for (let currentTag of photographerObject.tags) {
            let tagItemElt = document.createElement('div');
            tagItemElt.classList.add('photograph-profile__tags__tag-item');
            const srOnlyText = document.createElement('span');
            srOnlyText.textContent = 'Tag';
            srOnlyText.classList.add('sr-only');
            tagItemElt.textContent = `#${currentTag}`;
            tagItemElt.insertBefore(srOnlyText,tagItemElt.firstChild);
            //If the tag is the currently selected by the user, modify its appearance
            if (currentTag === this.activeTag) {
                tagItemElt.dataset.selected = 'true';
            } else {
                tagItemElt.dataset.selected = 'false';
            }
            //Used to retrieve the tag when clicked. Used for consistency between tags beginning with cap or not
            tagItemElt.dataset.tag = currentTag;
            tagItemElt.addEventListener('click', this.tagSelected.bind(this));
            photographerTagsElt.appendChild(tagItemElt);
        }
    }

    //Removes all the html elements contained in the container
    removeChildTags(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    //Focus on the photographer profile corresponding to where the tag was clicked
    //Prevent the random focus from screen readers after updating the photographers gallery
    getCorrectFocus(clickedTag) {
        const tagContainer = clickedTag.parentElement;
        const description = tagContainer.previousSibling;
        const correctAvatar = description.previousSibling;
        const correctName = correctAvatar.text;
        const allh2 = this.photographersContainer.querySelectorAll('h2');
        for (let currenth2 of allh2) {
            if (correctName === currenth2.innerText) {
                const correctLink = currenth2.parentElement;
                correctLink.focus();
            }
        }
    }

    //Make the go to content button appear on scroll
    attachScrollingListener() {
        this.scrollingCallback  = this.goToContentAppears.bind(this)
        window.addEventListener('scroll', this.scrollingCallback);
    }

    goToContentAppears() {
        this.gotoContent.style.transform = 'translate(-50%, 200%)';
        window.removeEventListener('scroll', this.scrollingCallback);
    }
}