function getReviewCount() {
    let reviewCount = parseInt(localStorage.getItem('reviewCount')) || 0;
    reviewCount++;

    localStorage.setItem('reviewCount', reviewCount.toString());

    document.getElementById('reviewCount').textContent = `Total Reviews Submitted: ${reviewCount}`;
}

document.addEventListener('DOMContentLoaded', getReviewCount);