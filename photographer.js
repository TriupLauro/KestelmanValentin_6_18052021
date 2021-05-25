

// Dom elements from the modal
const contactBtn = document.querySelector('div.contact');
const modalbg = document.querySelector('div.modalbg');
const closebtn = document.querySelector('i.close');

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

// Update the information displayed on the photographer's page
// It modify the existing html content without adding or removing tags
function updatePhotographerHeader(container = document.querySelector('photograph-header'), photographerObject) {
    const displayedPhotographerInfos = container.querySelector('div.infos');
    const photographersPageTitle = displayedPhotographerInfos.querySelector('h1');
    const photographersLocalisation = displayedPhotographerInfos.querySelector('p.infos__text__localisation');
    const photographersLine = displayedPhotographerInfos.querySelector('p.infos__text__slogan');
    const photographersDisplayedTags = displayedPhotographerInfos.querySelector('div.infos__tags');
    const photographerDisplayedPortrait = container.querySelector('img.avatar');
    

    document.title = `Page du photographe ${photographerObject.name}`;
        photographersPageTitle.innerText = photographerObject.name;
        photographersLocalisation.innerText = `${photographerObject.city}, ${photographerObject.country}`;
        photographersLine.innerText = photographerObject.tagline;
        photographersDisplayedTags.innerHTML = '';
        for (let tag of photographerObject.tags) {
            let currentTagElement = document.createElement('div');
            currentTagElement.classList.add('infos__tags__item');
            currentTagElement.innerText = `#${tag}`;
            photographersDisplayedTags.appendChild(currentTagElement);
    }
    photographerDisplayedPortrait.setAttribute('src', `images/Sample_Photos/Photographers_ID_Photos/${photographerObject.portrait}`);
}

function updatePhotographerPrice (container = document.querySelector('div.stats__price'), photographerObject) {
    container.innerText = `${photographerObject.price}€ / jour`;
}

window.addEventListener('load', () => {
    let fishEyeData;
    // Dom elements from the photographers page header
    
    readJsonData()
    .then((v) => {
        const loader = document.querySelector('div.loader');
        
        fishEyeData = v;
        
        const photographersList = fishEyeData.photographers;
        
        const queryString = window.location.search;
        const currentId = new URLSearchParams(queryString).get('id');
        
        const currentPhotographerData = photographersList.find(photographer => photographer.id === parseInt(currentId));
        
        const photographerHeader = document.querySelector('div.photograph-header');
        updatePhotographerHeader(photographerHeader, currentPhotographerData);
        loader.style.display = 'none';
        const photographerPrice = document.querySelector('div.stats__price');
        updatePhotographerPrice(photographerPrice, currentPhotographerData);
        const contactName = document.querySelector('span.modal-name');
        contactName.textContent = currentPhotographerData.name;
    });
})

//Event triggered on clicking contact button
contactBtn.addEventListener('click', () => {
    modalbg.style.display = 'block';
});

//Event triggered on clicking the close modal btn
closebtn.addEventListener('click', () => {
    modalbg.style.display = 'none';
});