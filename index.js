
// Global variables

let fishEyeData;
let photographersList;

// Dom elements
const navTags = document.querySelectorAll('div.nav-tag-item');
//const photographersContainer = document.getElementsByClassName('photograph-wrapper')[0];
//const photographersDisplayed = document.getElementsByClassName('photograph-profile');

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
        console.log(photographersList);
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
    console.log(lowercaseTag);
    let filteredPhotographers = photographersList.filter(photographer => photographer.tags.includes(lowercaseTag));
    console.log(filteredPhotographers);
    //photographersContainer.removeChild(photographersDisplayed[0]);
}