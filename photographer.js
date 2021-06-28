import {getPhotographerId} from './photographersFunctions.js'
import PhotographerPage from "./photographerPageClass.js";

//DOM element of the page without the modals
const mainPage = document.querySelector('div.photographer-page');

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


window.addEventListener('load', () => {
    mainPage.style.display = 'none';
    readJsonData()
    .then((fishEyeData) => {
        const loader = document.querySelector('div.loader');

        //*---------------------------------------------------------------------------------------*

        //*---------------------------------------------------------------------------------------*

        // Checks for invalid data
        const photographersList = fishEyeData.photographers;
        const mediaList = fishEyeData.media;

        const currentId = getPhotographerId();

        if (currentId === null) {
            throw new Error('Photographer Id not specified');
        }
        const currentPhotographerData = photographersList.find(photographer => photographer.id === parseInt(currentId,10));

        if (currentPhotographerData === undefined) {
            throw new Error('Wrong Id specified');
        }
        const currentPhotographerMedias = mediaList.filter(media => media.photographerId === parseInt(currentId,10));

        const photographerPageObject = new PhotographerPage(currentPhotographerData,currentPhotographerMedias, mainPage)
        photographerPageObject.initializePage();

        loader.style.display = 'none';
        mainPage.style.display = '';
        photographerPageObject.photographerObject.focusOnHeader();
        
    })
    .catch((error) => {
        const loader = document.querySelector('div.loader');
        const displayedMessage = document.querySelector('p.loader__msg');
    
        displayedMessage.innerText = error;
        const hint = document.createElement('p');
        hint.textContent = "Veuillez retourner sur la page d'accueil et sélectionnez un photographe disponible";
        
        loader.appendChild(hint);
        throw error;
    });
})