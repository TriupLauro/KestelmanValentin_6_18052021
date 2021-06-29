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
        const displayedGallery = new PhotographerGallery(fishEyeData.photographers);
        displayedGallery.updatePhotographers();
        displayedGallery.attachListenerToNavTags();

        // Make the go to content button appear
        displayedGallery.attachScrollingListener();
    })
});

