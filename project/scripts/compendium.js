async function initializeCompendium() {
    try {
        const outfits = await fetchOutfits();
        setupFilterButtons();
        displayOutfits(outfits);
    } catch (error) {
        console.error('Error initializing compendium:', error);
        displayError('Failed to load outfits. Please try again later.');
    }
}

async function fetchOutfits() {
    try {
        const response = await fetch('./data/outfits.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Failed to fetch outfits: ${error.message}`);
    }
}

function setupFilterButtons() {
    const buttons = document.querySelectorAll('aside button');
    let activeFilters = {
        style: null,
        type: null
    };

    buttons.forEach(button => {
        button.className = 'filter-btn';
        
        button.addEventListener('click', async () => {
            const buttonGroup = button.parentElement.querySelector('p').textContent.toLowerCase();
            const siblings = button.parentElement.querySelectorAll('button');
            
            // Toggle active state
            if (button.classList.contains('active')) {
                button.classList.remove('active');
                activeFilters[buttonGroup === 'styles' ? 'style' : 'type'] = null;
            } else {
                siblings.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                activeFilters[buttonGroup === 'styles' ? 'style' : 'type'] = button.textContent;
            }

            const outfits = await fetchOutfits();
            displayOutfits(outfits, activeFilters);
        });
    });
}

function displayOutfits(outfits, filters = { style: null, type: null }) {
    const section = document.querySelector('.outfits-container');

    let filteredOutfits = outfits;
    
    if (filters.style) {
        filteredOutfits = filteredOutfits.filter(outfit => outfit.style === filters.style);
    }
    
    if (filters.type) {
        const typeMap = {
            "Miracle Outfit": "Miracle",
            "Ability Outfit": "Ability",
            "Stylish Outfit": "Stylish",
            "Momo's Cloak": "Momo",
            "Other": "Other"
        };
        filteredOutfits = filteredOutfits.filter(outfit => outfit.type === typeMap[filters.type]);
    }

    if (filteredOutfits.length === 0) {
        section.innerHTML = '<p class="no-outfits">No outfits found matching the selected filters.</p>';
        return;
    }

    const outfitsHTML = `
        <div class="outfit-grid">
            ${filteredOutfits.map(outfit => createOutfitCard(outfit)).join('')}
        </div>
    `;
    
    section.innerHTML = outfitsHTML;
}

function createOutfitCard(outfit) {
    const qualityDisplay = outfit.type === "Momo" ? 
        '🐱' : 
        '★'.repeat(outfit.quality);
    
        return `
        <article class="outfit-card">
            <div class="outfit-image">
                <img src="${outfit.image}" alt="${outfit.imageAlt}" width="300" loading="lazy">
                <span class="outfit-quality ${outfit.type === "Momo" ? 'momo-quality' : ''}">${qualityDisplay}</span>
                ${outfit.type !== "Momo" && outfit.ability && outfit.ability !== "none" ? 
                    `<span class="outfit-ability">${outfit.ability}</span>` : 
                    ''}
            </div>
            <div class="outfit-content">
                <h3>${outfit.name}</h3>
                ${outfit.type !== "Momo" ? `
                    <div class="outfit-meta">
                        <span class="outfit-style ${outfit.style.toLowerCase()}">${outfit.style}</span>
                        ${outfit.type !== "Other" ? 
                            `<span class="outfit-type">${outfit.type}</span>` : 
                            ''}
                    </div>
                ` : ''}
                <p class="outfit-description">${outfit.description}</p>
                ${outfit.type !== "Momo" ? `
                    <div class="outfit-labels">
                        ${outfit.label.map(label => `<span class="label">${label}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="outfit-banner">${outfit.banner}</div>
            </div>
        </article>
    `;
}

function displayError(message) {
    const section = document.querySelector('main section');
    section.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', initializeCompendium);