async function initializeEvents() {
    try {
        const events = await fetchEvents();
        displayEvents(events);
        setupFilterButtons(events);
    } catch (error) {
        console.error('Error initializing events:', error);
        displayError('Failed to load events. Please try again later.');
    }
}

async function fetchEvents() {
    try {
        const response = await fetch('./data/events.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const events = await response.json();
        return events;
    } catch (error) {
        throw new Error(`Failed to fetch events: ${error.message}`);
    }
}

function displayEvents(events) {
    const eventGrid = document.getElementById('event-grid');
    eventGrid.innerHTML = ''; // Clear existing content

    if (events.length === 0) {
        eventGrid.innerHTML = '<p class="no-events">No events found.</p>';
        return;
    }

    events.forEach(event => {
        const eventCard = createEventCard(event);
        eventGrid.appendChild(eventCard);
    });
}

function createEventCard(event) {
    const card = document.createElement('article');
    card.className = 'event-card';

    card.innerHTML = `
        <img src="${event.image}" alt="${event.imageAlt}" class="event-image" width="300" loading="lazy">
        <div class="event-content">
            <h3>${event.title}</h3>
            <div class="event-dates">
                <p>Start: ${formatDate(event.startDate)}</p>
                <p>End: ${formatDate(event.endDate)}</p>
            </div>
            <p class="event-details">${event.details}</p>
            ${createRewardsList(event.rewards)}
            ${event.subEvents ? createSubEventsList(event.subEvents) : ''}
        </div>
    `;

    return card;
}

function createRewardsList(rewards) {
    if (!rewards || rewards.length === 0) return '';
    
    return `
        <div class="event-rewards">
            <h4>Rewards:</h4>
            <ul>
                ${rewards.map(reward => `<li>${reward}</li>`).join('')}
            </ul>
        </div>
    `;
}

function createSubEventsList(subEvents) {
    if (!subEvents) return '';

    return `
        <div class="sub-events">
            <h4>Sub Events:</h4>
            ${subEvents.map(subEvent => `
                <div class="sub-event">
                    <h5>${subEvent.title}</h5>
                    <p class="event-dates">Duration: ${formatDate(subEvent.startDate)} - ${formatDate(subEvent.endDate)}</p>
                    <p>${subEvent.details}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Format date
function formatDate(dateString) {
    if (dateString === 'Permanent') {
        return 'Permanent';
    }

    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Filter buttons
function setupFilterButtons(events) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterType = button.dataset.filter;
            const filteredEvents = filterEvents(events, filterType);
            displayEvents(filteredEvents);
        });
    });
}

// Filter events based on date
function filterEvents(events, filterType) {
    const currentDate = new Date();

    switch(filterType) {
        case 'ongoing':
            return events.filter(event => {
                const startDate = new Date(event.startDate);
                // Handle permanent events
                if (event.endDate === 'Permanent') {
                    return startDate <= currentDate;
                }
                const endDate = new Date(event.endDate);
                return startDate <= currentDate && endDate >= currentDate;
            });
        case 'upcoming':
            return events.filter(event => {
                const startDate = new Date(event.startDate);
                return startDate > currentDate;
            });
        case 'ended':
            return events.filter(event => {
                // Permanent events never end
                if (event.endDate === 'Permanent') {
                    return false;
                }
                const endDate = new Date(event.endDate);
                return endDate < currentDate;
            });
        default:
            return events;
    }
}

function displayError(message) {
    const eventGrid = document.getElementById('event-grid');
    eventGrid.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', initializeEvents);