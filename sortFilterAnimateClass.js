import {createLikeIcon, sortPopularity} from "./photographersFunctions.js";

export default class SortingDropDown {
    constructor(mediaGallery, lightboxObject, photographerObject, activeTag = '',
                filterTagsDOM = document.querySelectorAll('div.infos__tags__item')) {
        this.sortBtn = document.querySelector('.sort-button');
        this.sortMenu = document.querySelector('ul.sort-dropdown');
        this.sortOptions = document.querySelectorAll('li.sort-dropdown__item');
        this.selectedSorting = document.querySelector('.sort-selected');
        this.sortMenuIcon = document.querySelector('.sort-container .fa-chevron-down');
        this.menuExpanded = false;
        this.mediaGallery = mediaGallery;
        this.lightboxObject = lightboxObject;
        this.photographerObject = photographerObject;
        this.activeTag = activeTag;
        this.tagNodeList = filterTagsDOM;
        this.filteredMedias = this.mediaGallery.mediaData;

        //Remembers last option to display and sort
        if (!localStorage.getItem(`photographer${this.photographerObject.photographerData.id}SortOption`)) {
            localStorage.setItem(`photographer${this.photographerObject.photographerData.id}SortOption`, 'Popularité');
            this.currentOption = 'Popularité';
        }else{
            this.currentOption = localStorage.getItem(`photographer${this.photographerObject.photographerData.id}SortOption`);
        }
    }

    // Part relative to filter

    updateTagDisplay() {
        this.tagNodeList.forEach((tag) => {
            if (tag.dataset.tag === this.activeTag) {
                tag.dataset.selected = 'true';
            } else {
                tag.dataset.selected = 'false';
            }
        });
    }

    filterPhotosByTag(e) {
        let clickedTag = e.target.dataset.tag;

        if (clickedTag === this.activeTag) {
            this.activeTag = '';
            //Sorting the array may be needed
            let option = this.currentOption;
            this.filteredMedias = this.mediaGallery.sortMedias(option);
        }else{
            //Since we cut an array already sorted, no need to sort here
            this.activeTag = clickedTag;
            this.filteredMedias = this.mediaGallery.mediaData.filter(media => media.tags.includes(clickedTag));
        }
        this.mediaGallery.addMediaListToGallery(this.filteredMedias);
        this.lightboxObject.attachListenerToThumbnails();
        this.attachListenerToLikeIcons();
        this.updateTagDisplay();
    }

    attachListenerToMediaTags() {
        this.tagNodeList.forEach(tagElt => {
            tagElt.addEventListener('click', this.filterPhotosByTag.bind(this))
        });
    }

    //Part relative to sorting

    displaySortMenu(e) {
        e.stopPropagation();

        this.sortMenu.style.display = 'block';
        this.sortMenu.focus();
        this.sortMenuIcon.style.transform = 'rotate(180deg)';
        this.sortMenuIcon.removeEventListener('click', this.clickHandleIconExpand);
        this.handleIconClickSortSelect = this.sortOptionSelected.bind(this);
        this.sortMenuIcon.addEventListener('click', this.handleIconClickSortSelect);
        this.menuExpanded = true;
        this.sortBtn.setAttribute('aria-expanded', 'true');
        this.updateAriaSelected(this.sortOptions, 0);

    }

    closeDropDown() {
        if (this.menuExpanded) {
            this.sortMenu.style.display = '';
            this.sortMenu.removeAttribute('aria-activedescendant');
            this.sortMenuIcon.style.transform = '';
            this.sortMenuIcon.removeEventListener('click', this.handleIconClickSortSelect);
            this.sortMenuIcon.addEventListener('click', this.clickHandleIconExpand);
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
        const filteredArray = this.filteredMedias;
        const sortedArray = this.mediaGallery.sortMedias(this.currentOption, filteredArray);
        this.filteredMedias = sortedArray;
        this.mediaGallery.addMediaListToGallery(sortedArray);
        this.attachListenerToLikeIcons();
        this.lightboxObject.attachListenerToThumbnails();
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
        this.currentOption = option;
        this.selectedSorting.innerText = option;
    }

    rememberChoice() {
        if(localStorage.getItem(`photographer${this.mediaGallery.photographerData.id}SortOption`)) {
            this.updateDisplayedChoice(localStorage.getItem(`photographer${this.mediaGallery.photographerData.id}SortOption`));
        }else{
            this.updateDisplayedChoice('Popularité');
        }
    }

    attachListenerToSortBtn() {
        this.sortBtn.addEventListener('click', this.displaySortMenu.bind(this));
        this.clickHandleIconExpand = this.displaySortMenu.bind(this);
        this.sortMenuIcon.addEventListener('click', this.clickHandleIconExpand);
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
                e.preventDefault();
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

    // Like and thumbnail animations

    makeLikeIconClickable(likeIcon) {
        let localLiked = (likeIcon.dataset.localLiked === 'true');
        if (!localLiked) {
            likeIcon.addEventListener('click', this.addOneLike.bind(this));
        }else{
            likeIcon.addEventListener('click', this.removeOneLike.bind(this));
            likeIcon.classList.add('liked');
        }
    }

    attachListenerToLikeIcons() {
        const likeIconsElt = this.mediaGallery.mediaContainer.querySelectorAll('.js-clickable-like');
        likeIconsElt.forEach(icon => this.makeLikeIconClickable(icon));
    }

    addOneLike(e) {
        e.stopPropagation();
        let likes = e.target.dataset.likesNumber;
        const likedMediaContainer = e.target.parentElement.parentElement.parentElement;
        const currentSortOption = this.currentOption;
        // Function for the challenge
        if (currentSortOption === 'Popularité') this.checkDrawLiking(likes, likedMediaContainer);
        likes++;
        const likedMediaObject = this.filteredMedias.find(media => media.id === parseInt(likedMediaContainer.dataset.mediaId,10));
        likedMediaObject.likes = likes;
        likedMediaObject.localLiked = true;
        const likesContainer = e.target.parentElement;
        likesContainer.textContent = `${likes} `;
        const likeIcon = createLikeIcon();
        likeIcon.dataset.likesNumber = likes;
        likeIcon.dataset.localLiked = "true";
        likeIcon.classList.add('liked');
        likeIcon.addEventListener('click', this.removeOneLike.bind(this));
        likesContainer.appendChild(likeIcon);
        this.photographerObject.updateTotalLikes(1);
    }

    removeOneLike(e) {
        e.stopPropagation();
        let likes = e.target.dataset.likesNumber;
        const unlikedMediaContainer = e.target.parentElement.parentElement.parentElement;
        const currentSortOption = this.currentOption;
        if (currentSortOption === 'Popularité') this.checkDrawUnliking(likes, unlikedMediaContainer);
        likes--;
        const unlikedMediaObject = this.filteredMedias.find(media => media.id === parseInt(unlikedMediaContainer.dataset.mediaId,10));
        unlikedMediaObject.likes = likes;
        unlikedMediaObject.localLiked = false;
        const likesContainer = e.target.parentElement;
        likesContainer.textContent = `${likes} `;
        const likeIcon = createLikeIcon();
        likeIcon.dataset.likesNumber = likes;
        likeIcon.dataset.localLiked = "false";
        likeIcon.addEventListener('click', this.addOneLike.bind(this));
        likesContainer.appendChild(likeIcon);
        this.photographerObject.updateTotalLikes(-1);
    }

    checkDrawLiking(likes, clickedMedia) {
        const drawsList = this.filteredMedias.filter(media => media.likes === parseInt(likes,10));
        if (drawsList.length > 1) {
            this.getReadyToAnimateDrawLiking(drawsList, clickedMedia);
        }
    }

    checkDrawUnliking(likes, clickedMedia) {
        const drawsList = this.filteredMedias.filter(media => media.likes === parseInt(likes,10));
        if (drawsList.length > 1) {
            this.getReadyToAnimateDrawUnliking(drawsList,clickedMedia);
        }
    }

    getReadyToAnimateDrawLiking(drawMediaArray, clickedMedia,
                                growFactor = 1.25, totalTime = 800) {
        const drawMediaArrayElt = drawMediaArray.map(media => this.mediaGallery.mediaContainer.querySelector(`div.photo-container[data-media-id="${media.id}"]`));
        const positionArray = this.getPositionArray(drawMediaArrayElt);
        const firstPosition = positionArray[0];
        const clickedMediaCoords = this.getPosition(clickedMedia);
        const distanceFromFirst = this.getDistance(firstPosition, clickedMediaCoords);
        if (distanceFromFirst.x === 0 && distanceFromFirst.y === 0) return false;

        this.AnimateDecideBetweenLike(drawMediaArrayElt,clickedMedia,positionArray,distanceFromFirst,
            growFactor, totalTime);
        window.clearTimeout(this.movingHappens);
        this.movingHappens = setTimeout(this.updateDOMAfterAnimate.bind(this), totalTime+300,
            this.filteredMedias, this.mediaGallery.mediaContainer, this.mediaGallery.photographerData);
    }

    getReadyToAnimateDrawUnliking(drawMediaArray, clickedMedia,
                                  growFactor = 1.25, totalTime = 800) {
        const drawMediaArrayElt = drawMediaArray.map(media => document.querySelector(`div.photo-container[data-media-id="${media.id}"]`));
        const positionArray = this.getPositionArray(drawMediaArrayElt);
        const lastPosition = positionArray[positionArray.length - 1];
        const clickedMediaCoords = this.getPosition(clickedMedia);
        const distanceFromLast = this.getDistance(lastPosition, clickedMediaCoords);
        if (distanceFromLast.x === 0 && distanceFromLast.y === 0) return false;

        this.AnimateDecideBetweenUnlike(drawMediaArrayElt, clickedMedia, positionArray, distanceFromLast,
            growFactor, totalTime);
        window.clearTimeout(this.movingHappens);
        this.movingHappens = setTimeout(this.updateDOMAfterAnimate.bind(this), totalTime+300,
            this.filteredMedias);
    }

    updateDOMAfterAnimate(mediaArray, container, photographerData) {
        const sortedArray = sortPopularity(mediaArray)
        this.filteredMedias = sortedArray;
        this.mediaGallery.addMediaListToGallery(sortedArray, container, photographerData);
        this.attachListenerToLikeIcons();
        this.lightboxObject.attachListenerToThumbnails();
    }

    AnimateDecideBetweenLike(
        mediaEltArray, clickedMediaElt, positionArray, distanceForClickedElt,
        growFactor = 1.25, totalTime = 800
    ) {
        const shrinkFactor = 1/growFactor;
        const step2Time = totalTime*0.4;
        const indexOfLikedElt = mediaEltArray.indexOf(clickedMediaElt);
        mediaEltArray.forEach((elt,index) => {
            if (elt === clickedMediaElt) {
                elt.style.transform = `scale(${growFactor})`;
                setTimeout(this.addTranslation, step2Time, elt, distanceForClickedElt.x*shrinkFactor, distanceForClickedElt.y*shrinkFactor);
                setTimeout(this.endAnimationDraw, totalTime, elt, distanceForClickedElt.x, distanceForClickedElt.y);
            }else{
                if (index < indexOfLikedElt) {
                    elt.style.transform = `scale(${shrinkFactor})`;
                    const distanceToTarget = this.getDistance(positionArray[index+1], positionArray[index]);
                    setTimeout(this.addTranslation, step2Time, elt, distanceToTarget.x*growFactor, distanceToTarget.y*growFactor);
                    setTimeout(this.endAnimationDraw, totalTime, elt, distanceToTarget.x, distanceToTarget.y);
                }
            }
        });
    }

    AnimateDecideBetweenUnlike(
        mediaEltArray, clickedMediaElt, positionArray, distanceForClickedElt,
        growFactor = 1.25, totalTime = 800
    ) {
        const shrinkFactor = 1/growFactor;
        const step2Time = totalTime*0.4;
        const indexOfLikedElt = mediaEltArray.indexOf(clickedMediaElt);
        mediaEltArray.forEach((elt,index) => {
            if (elt === clickedMediaElt) {
                elt.style.transform = `scale(${shrinkFactor})`;
                setTimeout(this.addTranslation, step2Time, elt, distanceForClickedElt.x*growFactor, distanceForClickedElt.y*growFactor);
                setTimeout(this.endAnimationDraw, totalTime, elt, distanceForClickedElt.x, distanceForClickedElt.y);
            }else{
                if (index > indexOfLikedElt) {
                    elt.style.transform = `scale(${growFactor})`;
                    const distanceToTarget = this.getDistance(positionArray[index - 1], positionArray[index]);
                    setTimeout(this.addTranslation, step2Time, elt, distanceToTarget.x*shrinkFactor, distanceToTarget.y*shrinkFactor);
                    setTimeout(this.endAnimationDraw, totalTime, elt, distanceToTarget.x, distanceToTarget.y);
                }
            }
        });
    }

    endAnimationDraw(mediaAnimated,x,y) {
        mediaAnimated.style.transform = `translate(${x}px,${y}px)`;
    }

    addTranslation(elt,x,y) {
        elt.style.transform += ` translate(${x}px,${y}px)`;
    }

    getPosition(elt) {
        const boundingObject = elt.getBoundingClientRect() ;
        return {
            x : boundingObject.x,
            y : boundingObject.y
        }
    }

    getDistance(coords1, coords2) {
        const difference = {};
        // Fix if both coordinates are the same
        if (coords1 === undefined) return {x:0,y:0}
        const coordKeys = Object.keys(coords1);
        coordKeys.forEach(key => difference[key] = coords1[key] - coords2[key]);
        return difference;
    }

    getPositionArray(mediaEltArray) {
        return mediaEltArray.map(mediaElt => this.getPosition(mediaElt));
    }

}