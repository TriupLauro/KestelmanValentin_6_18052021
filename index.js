import PhotographerGallery from './indexPhotographersGalleryClass.js'

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

// Event triggered on page launch
window.addEventListener('load', () => {
    readJsonData()
    .then((fishEyeData) => {
        //We create the class managing the photographer gallery from the homepage
        //Then we display all the photographers available in the JSON file
        //And we add the event listener to the tags contained in the nav bar in the header
        const displayedGallery = new PhotographerGallery(fishEyeData.photographers);
        displayedGallery.updatePhotographers();
        displayedGallery.attachListenerToNavTags();

        // Make the go to content button appear
        displayedGallery.attachScrollingListener();
    })
});

