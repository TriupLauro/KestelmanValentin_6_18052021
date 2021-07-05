export function lockScroll() {
    document.body.style.overflow = 'hidden';
}

export function unlockScroll() {
    document.body.style.overflow = '';
}

export function toggleVideoPlay(e) {
    if (e.target.paused) {
        e.target.play();
    }else{
        e.target.pause();
    }
}

// Form validation functions
export function isNotEmptyString (value) {
    return value !== '';
}

export function validEmailRegex(value) {
    return /[a-zA-Z0-9.-]+@[a-zA-Z0-9]+.[a-z]+/.test(value);
}

// Create, without adding it to the page, the frame with the titles and the likes
// Ready but without the media itself
export function createMediaFrame(title, likes, localLiked = false) {
    const mediaFrameElt = document.createElement('div');
    mediaFrameElt.classList.add('photo-container');

    const mediaDescriptionElt = document.createElement('p');
    mediaDescriptionElt.classList.add('photo-description');
    mediaDescriptionElt.textContent = title;
    const mediaLikesElt = document.createElement('span');
    mediaLikesElt.classList.add('photo-likes');
    mediaLikesElt.textContent = likes + ' ';
    const likeIconElt = createLikeIcon();
    likeIconElt.classList.add('js-clickable-like');
    likeIconElt.dataset.likesNumber = likes;

    // Used when adding the event listener to permit either liking or unliking
    likeIconElt.dataset.localLiked = localLiked.toString();

    mediaFrameElt.appendChild(mediaDescriptionElt);
    mediaDescriptionElt.appendChild(mediaLikesElt);
    mediaLikesElt.appendChild(likeIconElt);

    return mediaFrameElt;
}

// Remove all the content inside a container element
export function removeChildTags(container) {
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

// Three sorting functions
export function sortAlphabeticalOrder(mediaArray) {
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

    return sortedList.map((mediaItem) => mediaArray[mediaItem.index]);
}

export function sortDate(mediaArray) {
    let dateArray = mediaArray.map((mediaItem) => new Date(mediaItem.date));

    let dateArrayWithIndex = [];
    for (let date of dateArray) {
        dateArrayWithIndex.push({index : dateArray.indexOf(date), date});
    }

    let sortedList = dateArrayWithIndex.sort((a,b) => b.date - a.date);

    return sortedList.map((mediaItem) => mediaArray[mediaItem.index]);
}

export function sortPopularity(mediaArray) {
    return mediaArray.sort((a,b) => b.likes - a.likes);
}

export function sortingChoice(mediaArray, choice, photographerId) {
    let newSortedList;
    switch(choice) {

        case 'Popularité' :
            newSortedList = sortPopularity(mediaArray);
            localStorage.setItem(`photographer${photographerId}SortOption`, 'Popularité');

            break;

        case 'Date' :
            newSortedList = sortDate(mediaArray);
            localStorage.setItem(`photographer${photographerId}SortOption`, 'Date');

            break;


        case 'Titre' :
            newSortedList = sortAlphabeticalOrder(mediaArray);
            localStorage.setItem(`photographer${photographerId}SortOption`, 'Titre');

            break;

    }
    const selectedSorting = document.querySelector('.sort-selected');
    selectedSorting.textContent = choice;
    return newSortedList;
}

// Used to count all the likes using the reduce array method
// Returns the total sum
export function countLikes(accumulator, currentValue) {
    return accumulator + currentValue;
}

// Create the Like Icon
// Used in the stats div and in the media frame
export function createLikeIcon() {
    const likeIcon = document.createElement('span');
    likeIcon.classList.add('fas', 'fa-heart');
    likeIcon.setAttribute('aria-label','likes');
    return likeIcon
}

export function getPhotographerId() {
    const queryString = window.location.search;
    return new URLSearchParams(queryString).get('id');
}