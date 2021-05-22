
// Global variables

let fishEyeData;
let photographersList;
let photographersStored = new Set();

// Dom elements
const navTags = document.querySelectorAll('div.nav-tag-item');
const photographersContainer = document.getElementsByClassName('photograph-wrapper')[0];

// Removes the photographers elements from the homepage
function removePhotographers () {
    let currentElt;
    while (photographersContainer.children.length > 0 ) {
        currentElt = photographersContainer.removeChild(photographersContainer.children[0]);
        photographersStored.add(currentElt);
    }
}

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