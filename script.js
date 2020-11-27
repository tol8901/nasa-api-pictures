const resultsNav = document.getElementById('resultsNav');
const favouritessNav = document.getElementById('favouritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favourites = {};

function updateDOM() {
    resultsArray.forEach((result) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture Of The Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        saveText.textContent = 'Add To Favourites';
        saveText.setAttribute('onclick', `saveFavourite('${result.url}')`);
        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        // Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        // console.log(card);
        imagesContainer.appendChild(card);
    });
}

// Get 10 images from NASA API
async function getNasaPictures() {
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM();
    } catch (error) {
        // Catch Error Here
        console.log(error);
    }
}

// add result to Favourites
function saveFavourite(itemUrl) {
    // Loop through Results Array to select Favourite
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favourites[itemUrl]) {
            favourites[itemUrl] = item;
            // Show Save Confirmation for 2 Seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            // Set Favourites in LocalStorage
            localStorage.setItem('nasaFavourites', JSON.stringify(favourites));
        }
    });
}

// On load
getNasaPictures();