async function initializeHomePage() {
    try {
        // Fetch all data
        const [events, news, outfits] = await Promise.all([
            fetch('./data/events.json').then(response => response.json()),
            fetch('./data/news.json').then(response => response.json()),
            fetch('./data/outfits.json').then(response => response.json())
        ]);

        displayLatestPost(events, news);
        displayRandomOngoingEvents(events);
        displayRecentNews(news);
        displayRandomOutfits(outfits);

    } catch (error) {
        console.error('Error initializing home page:', error);
        displayError('Failed to load content. Please try again later.');
    }
}

function displayLatestPost(events, news) {
    const latestPostContainer = document.getElementById('latest-post');
    
    // Combine events and news into one array with type identifier
    const allPosts = [
        ...events.map(event => ({
            ...event,
            postType: 'event',
            date: event.startDate // Use startDate for events
        })),
        ...news.map(newsItem => ({
            ...newsItem,
            postType: 'news',
            date: newsItem.date
        }))
    ];

    // Sort by date (most recent first)
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Get the most recent post
    const latestPost = allPosts[0];

    if (!latestPost) {
        latestPostContainer.innerHTML = '<p>No posts available.</p>';
        return;
    }

    // Create different card layouts based on post type
    if (latestPost.postType === 'event') {
        latestPostContainer.innerHTML = createLatestEventCard(latestPost);
    } else {
        latestPostContainer.innerHTML = createLatestNewsCard(latestPost);
    }
}

function createLatestEventCard(event) {
    return `
        <article class="latest-card event-preview">
            <img src="${event.image}" alt="${event.imageAlt}" class="latest-image" width="300" loading="lazy">
            <div class="latest-content">
                <h4>${event.title}</h4>
                <p class="latest-date">Starts: ${formatDate(event.startDate)}</p>
                <p class="latest-preview">${event.details}</p>
                <a href="events.html" class="view-more-btn">View Event Details</a>
            </div>
        </article>
    `;
}

function createLatestNewsCard(newsItem) {
    let preview = '';
    if (Array.isArray(newsItem.details)) {
        // Handle Q&A format
        preview = newsItem.details[0].question;
    } else {
        // Handle regular news
        preview = newsItem.details;
    }

    return `
        <article class="latest-card news-preview">
            ${newsItem.image ? `
                <img src="${newsItem.image}" alt="${newsItem.imageAlt}" class="latest-image" width="300" loading="lazy">
            ` : ''}
            <div class="latest-content">
                <h4>${newsItem.title}</h4>
                <p class="latest-date">${formatDate(newsItem.date)}</p>
                <p class="latest-preview">${preview}</p>
                <a href="news.html" class="view-more-btn">Read More</a>
            </div>
        </article>
    `;
}

function displayRandomOngoingEvents(events) {
    const eventsContainer = document.getElementById('events');
    const currentDate = new Date();

    // Filter for ongoing events
    const ongoingEvents = events.filter(event => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        return startDate <= currentDate && endDate >= currentDate;
    });

    if (ongoingEvents.length === 0) {
        eventsContainer.innerHTML = '<p>No ongoing events at this time.</p>';
        return;
    }

    // Get 3 random events
    const randomEvents = getRandomItems(ongoingEvents, 3);

    eventsContainer.innerHTML = `
        <div class="event-preview-grid">
            ${randomEvents.map(event => createEventPreviewCard(event)).join('')}
        </div>
    `;
}

function createEventPreviewCard(event) {
    return `
        <article class="event-preview-card">
            <img src="${event.image}" alt="${event.imageAlt}" class="event-preview-image" width="300" loading="lazy">
            <div class="event-preview-content">
                <h4>${event.title}</h4>
                <div class="event-preview-dates">
                    <p>Until: ${formatDate(event.endDate)}</p>
                </div>
                ${event.rewards ? `
                    <div class="event-preview-rewards">
                        <p>Rewards include:</p>
                        <ul>
                            ${event.rewards.slice(0, 2).map(reward => `
                                <li>${reward}</li>
                            `).join('')}
                            ${event.rewards.length > 2 ? `<li>and more...</li>` : ''}
                        </ul>
                    </div>
                ` : ''}
                <a href="events.html" class="view-more-btn">View Details</a>
            </div>
        </article>
    `;
}

function displayRecentNews(news) {
    const newsContainer = document.getElementById('news');
    
    // Sort news by date (most recent first)
    const sortedNews = [...news].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Get the three most recent items
    const recentNews = sortedNews.slice(0, 3);

    if (recentNews.length === 0) {
        newsContainer.innerHTML = '<p>No news available.</p>';
        return;
    }

    newsContainer.innerHTML = `
        <div class="news-preview-list">
            ${recentNews.map(newsItem => createNewsPreviewItem(newsItem)).join('')}
        </div>
        <a href="news.html" class="view-all-btn">View All News</a>
    `;
}

function createNewsPreviewItem(newsItem) {
    let preview = '';
    if (Array.isArray(newsItem.details)) {
        // Handle Q&A format
        preview = newsItem.details[0].question;
    } else {
        // Handle regular news
        preview = truncateText(newsItem.details, 100);
    }

    return `
        <article class="news-preview-item">
            <div class="news-preview-content">
                <div class="news-preview-header">
                    <h4>${newsItem.title}</h4>
                    <span class="news-preview-type">${newsItem.type}</span>
                </div>
                <p class="news-preview-date">${formatDate(newsItem.date)}</p>
                <p class="news-preview-text">${preview}</p>
            </div>
            ${newsItem.image ? `
                <img src="${newsItem.image}" alt="${newsItem.imageAlt}" class="news-preview-image" width="300" loading="lazy">
            ` : ''}
        </article>
    `;
}

function displayRandomOutfits(outfits) {
    const compendiumContainer = document.querySelector('section:last-child div');
    
    // Get 3 random outfits
    const randomOutfits = getRandomItems(outfits, 3);

    if (randomOutfits.length === 0) {
        compendiumContainer.innerHTML = '<p>No outfits available.</p>';
        return;
    }

    compendiumContainer.innerHTML = `
        <h3>Freeway Compendium</h3>
        <div class="outfit-preview-grid">
            ${randomOutfits.map(outfit => createOutfitPreviewCard(outfit)).join('')}
        </div>
        <a href="compendium.html" class="view-all-btn">View All Outfits</a>
    `;
}

function createOutfitPreviewCard(outfit) {
    const qualityDisplay = outfit.type === "Momo" ? 
        '🐱' : 
        '★'.repeat(outfit.quality);
    
    return `
        <article class="outfit-preview-card">
            <div class="outfit-preview-image">
                <img src="${outfit.image}" alt="${outfit.imageAlt}" width="300" loading="lazy">
                <span class="outfit-preview-quality ${outfit.type === "Momo" ? 'momo-quality' : ''}">${qualityDisplay}</span>
                ${outfit.type !== "Momo" && outfit.ability && outfit.ability !== "none" ? 
                    `<span class="outfit-preview-ability">${outfit.ability}</span>` : 
                    ''}
            </div>
            <div class="outfit-preview-content">
                <h4>${outfit.name}</h4>
                ${outfit.type !== "Momo" ? `
                    <div class="outfit-preview-meta">
                        <span class="outfit-preview-style ${outfit.style.toLowerCase()}">${outfit.style}</span>
                        ${outfit.type !== "Other" ? 
                            `<span class="outfit-preview-type">${outfit.type}</span>` : 
                            ''}
                    </div>
                ` : ''}
                <p class="outfit-preview-banner">${outfit.banner}</p>
            </div>
        </article>
    `;
}

// Utility Functions
function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

function displayError(message) {
    const containers = ['latest-post', 'events', 'news'];
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <p>${message}</p>
                </div>
            `;
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeHomePage);