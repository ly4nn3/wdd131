const temples = [
    {
        templeName: "Aba Nigeria",
        location: "Aba, Nigeria",
        dedicated: "2005, August, 7",
        area: 11500,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
    },
    {
        templeName: "Manti Utah",
        location: "Manti, Utah, United States",
        dedicated: "1888, May, 21",
        area: 74792,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
    },
    {
        templeName: "Payson Utah",
        location: "Payson, Utah, United States",
        dedicated: "2015, June, 7",
        area: 96630,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
    },
    {
        templeName: "Yigo Guam",
        location: "Yigo, Guam",
        dedicated: "2020, May, 2",
        area: 6861,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
    },
    {
        templeName: "Washington D.C.",
        location: "Kensington, Maryland, United States",
        dedicated: "1974, November, 19",
        area: 156558,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
    },
    {
        templeName: "Lima Perú",
        location: "Lima, Perú",
        dedicated: "1986, January, 10",
        area: 9600,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
    },
    {
        templeName: "Mexico City Mexico",
        location: "Mexico City, Mexico",
        dedicated: "1983, December, 2",
        area: 116642,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
    },
    {
        templeName: "Sapporo Japan",
        location: "Sapporo, Hokkaido, Japan",
        dedicated: "2016, August, 21",
        area: 48480,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/sapporo-japan/2018/400x250/Sapporo-Japan-Temple01.jpg"
    },
    {
        templeName: "Taipei Taiwan",
        location: "Taipei, Taiwan",
        dedicated: "1984, November, 17",
        area: 9945,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/taipei-taiwan/400x250/taipei-taiwan-temple-lds-1031625-wallpaper.jpg"
    },
    {
        templeName: "London England",
        location: "Surrey, England, United Kingdom",
        dedicated: "1958, September, 7",
        area: 42652,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/london-england/400x250/london-england-temple-lds-919365-wallpaper.jpg"
    }
];

// Filtering
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();

        navLinks.forEach(link => link.classList.remove('active'));
        event.target.classList.add('active');

        const category = event.target.textContent.toLowerCase();
        filterTemples(category);

        document.querySelector('h2').textContent = event.target.textContent;

        // Close hamburger menu after every click
        navMenu.classList.remove('active');
        hamburger.textContent = '☰';
    });
});

function filterTemples(category) {
    let filteredTemples;

    switch (category) {
        case 'old':
            filteredTemples = temples.filter(temple => {
                const dedicatedYear = parseInt(temple.dedicated.split(', ')[0]);
                return dedicatedYear < 1900;
            });
            break;

        case 'new':
            filteredTemples = temples.filter(temple => {
                const dedicatedYear = parseInt(temple.dedicated.split(', ')[0]);
                return dedicatedYear > 2000;
            });
            break;

        case 'large':
            filteredTemples = temples.filter(temple => temple.area > 90000);
            break;

        case 'small':
            filteredTemples = temples.filter(temple => temple.area < 10000);
            break;

        case 'home':
        default:
            filteredTemples = temples;
    }

    displayTemples(filteredTemples);
}

function displayTemples(templeList) {
    const templesElement = document.querySelector("#temples");
    templesElement.innerHTML = ''; // Clear existing content

    const gridElement = document.createElement("div");
    gridElement.classList.add("album-grid");

    templeList.forEach((temple) => {
        const articleElement = document.createElement("article");
        articleElement.classList.add("temple-card");

        articleElement.innerHTML = `
            <img src="${temple.imageUrl}" 
                 alt="The ${temple.templeName} Temple" 
                 loading="lazy">
            <h3>${temple.templeName}</h3>
            <p>${temple.location}</p>
            <p>Dedicated: ${temple.dedicated}</p>
            <p>Area: ${temple.area.toLocaleString()} sq ft</p>
        `;

        gridElement.appendChild(articleElement);
    });

    templesElement.appendChild(gridElement);
}

displayTemples(temples);

// Last modified
const year = document.querySelector("#currentyear");
const today = new Date();
year.innerHTML = `${today.getFullYear()}`;

const lastModified = document.querySelector("#lastModified");
lastModified.innerHTML = `Last modified: ${document.lastModified}`

// Hamburger menu
const hamburger = document.querySelector('.hamburger-menu');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.textContent = hamburger.textContent === '☰' ? '✕' : '☰';
    navMenu.classList.toggle('active');
});

displayTemples(temples);