import {getPhotographerId} from './photographersFunctions.js'
import PhotographerPage from "./photographerPageClass.js";

// This function returns a promise, so we need to use .then after we call it
function readJsonData () {
    return fetch('database/FishEyeData.json')
        .then(response => {
            //Check if there's no error while loading the URL
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
}


window.addEventListener('load', () => {
    //DOM element of the loader over the main page
    const loader = document.querySelector('div.loader');
    //DOM element of the page without the modals
    const mainPage = document.querySelector('div.photographer-page');
    mainPage.style.display = 'none';
    readJsonData()
    .then((fishEyeData) => {
        // Store the value from the fetch request
        // Each of the array from the JSON file are stored in their own variable
        const photographersList = fishEyeData.photographers;
        const mediaList = fishEyeData.media;

        //Read the Id contained in the URL of the current page
        const currentId = getPhotographerId();

        //Check for invalid data (send to the catch section)
        if (currentId === null) {
            throw new Error('Photographer Id not specified');
        }
        const currentPhotographerData = photographersList.find(photographer => photographer.id === parseInt(currentId,10));

        if (currentPhotographerData === undefined) {
            throw new Error('Wrong Id specified');
        }

        //All checks passed
        //Getting the medias (photos/videos) from the photographer clicked on index.html (excluding all the others)
        const currentPhotographerMedias = mediaList.filter(media => media.photographerId === parseInt(currentId,10));

        //Creating the class managing all the other classes
        const photographerPageObject = new PhotographerPage(currentPhotographerData,currentPhotographerMedias, mainPage)
        photographerPageObject.initializePage();

        //Page is ready to be displayed
        loader.style.display = 'none';
        mainPage.style.display = '';
        photographerPageObject.focusOnHeader();
        
    })
    .catch((error) => {
        // This only runs if there's no or an invalid id for the photographer
        const displayedMessage = document.querySelector('p.loader__msg');

        // Displays the error messages and a message for the user to go back to the main page
        displayedMessage.innerText = error;
        const hint = document.createElement('p');
        hint.textContent = "Veuillez retourner sur la page d'accueil et sélectionnez un photographe disponible";
        
        loader.appendChild(hint);
        // Rethrow the error, to display it in the console
        throw error;
    });
})