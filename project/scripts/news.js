async function initializeNews() {
    try {
        const news = await fetchNews();
        setupFilterButtons();
        displayNews(news, 'Latest');
    } catch (error) {
        console.error('Error initializing news:', error);
        displayError('Failed to load news. Please try again later.');
    }
}

async function fetchNews() {
    try {
        const response = await fetch('./data/news.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Failed to fetch news: ${error.message}`);
    }
}

function setupFilterButtons() {
    const buttons = document.querySelectorAll('main div button');
    buttons.forEach(button => {
        button.className = 'filter-btn';
        if (button.textContent === 'Latest') {
            button.classList.add('active');
        }
        
        button.addEventListener('click', async () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const news = await fetchNews();
            displayNews(news, button.textContent);
        });
    });
}

function displayNews(news, filter) {
    const newsSection = document.querySelector('.news-container');
    
    let filteredNews = news;
    if (filter !== 'Latest') {
        filteredNews = news.filter(item => item.type === filter);
    }

    filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date));

    const newsHTML = filteredNews.map(item => createNewsCard(item)).join('');
    newsSection.innerHTML = newsHTML || '<p class="no-news">No news items found.</p>';
}

function createNewsCard(newsItem) {
    const date = new Date(newsItem.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let contentHTML = '';
    if (Array.isArray(newsItem.details)) {
        contentHTML = `
            <div class="news-qa">
                <h4>${newsItem.details[0].question}</h4>
                <p class="team-name">${newsItem.details[0].team}</p>
                <p>${newsItem.details[0].answer.substring(0, 200)}...</p>
                ${newsItem.details[0].image ? 
                    `<img src="${newsItem.details[0].image}" alt="${newsItem.details[0].imageAlt}" class="news-image" width="300" loading="lazy">` : 
                    ''}
            </div>
            ${newsItem.url ? 
                `<div class="news-actions">
                    <a href="${newsItem.url}" class="read-more-btn">Read Full Article</a>
                </div>` : 
                ''}
        `;
    } else {
        contentHTML = `
            <p>${newsItem.details}</p>
            ${newsItem.image ? 
                `<img src="${newsItem.image}" alt="${newsItem.imageAlt}" class="news-image" width="300" loading="lazy">` : 
                ''}
        `;
    }

    return `
        <article class="news-card">
            <div class="news-header">
                <h3>${newsItem.title}</h3>
                <div class="news-meta">
                    <span class="news-type">${newsItem.type}</span>
                    <span class="news-date">${date}</span>
                </div>
            </div>
            <div class="news-content">
                ${contentHTML}
            </div>
        </article>
    `;
}

function displayError(message) {
    const newsSection = document.querySelector('main section');
    newsSection.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', initializeNews);