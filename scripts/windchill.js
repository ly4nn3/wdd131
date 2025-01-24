function calculateWindChill(temp, windSpeed) {
    return (13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temp * Math.pow(windSpeed, 0.16)).toFixed(2);
}

document.addEventListener("DOMContentLoaded", function() {
    // console.log("Script is running");
    const temperature = 27;
    const windSpeed = 5;

    const windChill = calculateWindChill(temperature, windSpeed);
    // console.log(`Calculated Wind Chill: ${windChill}`);

    // Find the element for wind chill and update its content
    const windChillElement = document.querySelector("#weather dt:nth-of-type(4) + dd");
    if (windChillElement) {
        windChillElement.textContent = `${windChill} °C`;
    } else {
        console.error("Wind Chill element not found");
    }
});