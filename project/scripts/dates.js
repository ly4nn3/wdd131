const year = document.querySelector("#currentyear");
const today = new Date();
year.innerHTML = `${today.getFullYear()}`;

const lastModified = document.querySelector("#lastModified");
const modifiedDate = new Date(document.lastModified);

const day = modifiedDate.getDate().toString().padStart(2, '0');
const month = (modifiedDate.getMonth() + 1).toString().padStart(2, '0');
const yearModified = modifiedDate.getFullYear();

let hours = modifiedDate.getHours();
const minutes = modifiedDate.getMinutes().toString().padStart(2, '0');
const amPm = hours >=12 ? "PM" : "AM";

hours = hours % 12 || 12;

lastModified.innerHTML = `Last modified: ${yearModified}/${month}/${day} | ${hours}:${minutes} ${amPm}`;

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');

            hamburgerMenu.textContent = navMenu.classList.contains('active') ? '✖' : '☰';
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburgerMenu.textContent = '☰';
            document.body.style.overflow = '';
        });
    });
});