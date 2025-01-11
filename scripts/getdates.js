const year = document.querySelector("#currentyear");
const today = new Date();
year.innerHTML = `${today.getFullYear()}`;

const lastModified = document.querySelector("#lastModified");
lastModified.innerHTML = `Last modified: ${document.lastModified}`