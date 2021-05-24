
// Global variables
let fishEyeData;
let photographersList;
let mediaList;
let photographersStored = new Set();
let currentId;

// Store the current page name
let path = window.location.pathname;
let page = path.split("/").pop()
//console.log(page);

// Dom elements
const navTags = document.querySelectorAll('div.nav-tag-item');
const photographersContainer = document.getElementsByClassName('photograph-wrapper')[0];
// Dom elements from the photographers page header
const displayedPhotographerInfos = document.querySelector('div.infos');
const photographersPageTitle = displayedPhotographerInfos.querySelector('h1');
const photographersLocalisation = displayedPhotographerInfos.querySelector('p.infos__text__localisation');
const photographersLine = displayedPhotographerInfos.querySelector('p.infos__text__slogan');
const photographersDisplayedTags = displayedPhotographerInfos.querySelector('div.infos__tags')
const photographerDisplayedPortrait = document.querySelector('img.avatar');
const photographerDisplayedPrice = document.querySelector('div.stats__price');

// Removes the photographers elements from the homepage
function removePhotographers () {
    let currentElt;
    while (photographersContainer.children.length > 0 ) {
        currentElt = photographersContainer.removeChild(photographersContainer.children[0]);
        photographersStored.add(currentElt);
    }
}

// Display the photographers included in the array
// The array contains data from the JSON file
function displayPhotographersList(photographersToDisplay) {
    let namesList = photographersToDisplay.map(photographer => photographer.name);
    console.log(namesList);
    for (let  photographer of photographersStored) {
        if (namesList.includes(photographer.querySelector('h2').innerText)) {
            photographersContainer.appendChild(photographer);
        }
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
    .then(json => {
        return json;
    })
    .catch(() => {
        this.dataError = true;
    })
}

// Event triggered on page launch
window.addEventListener('load', () => {
    readJsonData()
    .then((v) => {
        fishEyeData = v;
        photographersList = fishEyeData.photographers;
        mediaList = fishEyeData.media;
        console.log(mediaList);
        // Only runs in the photographers page
        if (page === "photographer-page.html") {
            console.log("We're on the photographer's page !")
            currentId = self.location.toString().split('?')[1].split('=')[1];
            console.log(`Which Id is ${currentId}`);
            const currentPhotographerData = photographersList.find(photographer => photographer.id === parseInt(currentId));
            console.log(currentPhotographerData);
            document.title = `Page du photographe ${currentPhotographerData.name}`;
            photographersPageTitle.innerText = currentPhotographerData.name;
            photographersLocalisation.innerText = `${currentPhotographerData.city}, ${currentPhotographerData.country}`;
            photographersLine.innerText = currentPhotographerData.tagline;
            photographersDisplayedTags.innerHTML = '';
            for (let tag of currentPhotographerData.tags) {
                let currentTagElement = document.createElement('div');
                currentTagElement.classList.add('infos__tags__item');
                currentTagElement.innerText = `#${tag}`;
                photographersDisplayedTags.appendChild(currentTagElement);
            }
            photographerDisplayedPortrait.setAttribute('src', `images/Sample_Photos/Photographers_ID_Photos/${currentPhotographerData.portrait}`);
            photographerDisplayedPrice.innerText = `${currentPhotographerData.price}€ / jour`;
        }
    })
});

// Click a tag in navigation event
navTags.forEach(tag => {
    tag.addEventListener('click', tagSelected)
});

// Function called on clicking a tag
function tagSelected(e) {
    let rawTag = e.target.textContent;
    let lowercaseTag = rawTag.toLowerCase().slice(1);
    
    let filteredPhotographers = photographersList.filter(photographer => photographer.tags.includes(lowercaseTag));
    
    removePhotographers();
    displayPhotographersList(filteredPhotographers);
}