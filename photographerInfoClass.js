import {countLikes, createLikeIcon, removeChildTags} from "./photographersFunctions.js";

//Class used to display all the information from the photographer clicked on the homepage
//Name, Location, tags, photo for the avatar, price and total likes
export default class PhotographerInfoObject {
    constructor(photographerData, photographerMedia,
                headerDOM = document.querySelector('div.photograph-header'),
                statsDOM = document.querySelector('.stats') ) {

        this.headerContainer = headerDOM;
        this.displayedInfos = this.headerContainer.querySelector('div.infos');
        this.photographerTitleDOM = this.displayedInfos.querySelector('h1');
        this.photographerLocalisation = this.displayedInfos.querySelector('p.infos__text__localisation');
        this.photographerLine = this.displayedInfos.querySelector('p.infos__text__slogan'/**/);
        this.photographerDisplayedTags = this.displayedInfos.querySelector('div.infos__tags');
        this.photographerDisplayedPortrait = this.headerContainer.querySelector('img.avatar');

        this.statsContainer = statsDOM;
        this.priceContainer = this.statsContainer.querySelector('.stats__price');
        this.likesContainer = this.statsContainer.querySelector('.stats__likes');

        this.photographerData = photographerData;
        this.mediaArray = photographerMedia;
    }

    // Called on the page load to match the displayed information in the header with the information in the
    // Photographer object
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

    //Display the price and the total likes of the photographer
    setPhotographerPrice () {
        this.priceContainer.innerText = `${this.photographerData.price}€ / jour`;
    }

    setTotalLikes() {
        const likesArray = this.mediaArray.map((mediaItem) => mediaItem.likes);
        const totalLikes = likesArray.reduce(countLikes);
        const likeIcon = createLikeIcon();

        this.likesContainer.innerText = `${totalLikes} `;
        //This is later used to modify the total likes
        this.likesContainer.dataset.totalLikes = totalLikes;

        this.likesContainer.appendChild(likeIcon);
    }

    //Update the total number of likes by the difference specified in the argument
    //+1 for a new like -1 for unliking a media
    //The total number of likes must already be specified by the setTotalLikes method
    updateTotalLikes(difference) {
        const likesElt = this.likesContainer;
        let totalLikes = parseInt(likesElt.dataset.totalLikes,10);
        totalLikes += difference;

        //Removes the number and the icon and recreate them
        const likeIcon = createLikeIcon();
        likesElt.innerText = `${totalLikes} `;
        //Used to access the total again once it has been updated
        likesElt.dataset.totalLikes = totalLikes.toString(10);
        likesElt.appendChild(likeIcon);
    }

    //Focus on header on page launch
    //This way the screen reader go directly to relevant information
    focusOnHeader() {
        this.headerContainer.focus();
    }

}