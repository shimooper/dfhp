const CURRENT_LANG = document.documentElement.lang === 'ar' ? 'he' : 'en';
let resourcesData = null;

function formatResourceDate(dateStr, lang) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    const year = parts[0];
    const month = parts[1] ? parseInt(parts[1], 10) : null;
    const day = parts[2] ? parseInt(parts[2], 10) : null;
    if (!month) return year;
    const monthNamesEn = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const monthNamesHe = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
    if (lang === 'he') {
        return day ? `${day} ב${monthNamesHe[month - 1]} ${year}` : `${monthNamesHe[month - 1]} ${year}`;
    }
    return day ? `${monthNamesEn[month - 1]} ${day}, ${year}` : `${monthNamesEn[month - 1]} ${year}`;
}

function renderResources(lang) {
    if (!resourcesData) return;
    const grid = document.getElementById('resource-grid');
    if (!grid) return;
    grid.innerHTML = [...resourcesData.resources].reverse().map(r => {
        const t = r[lang] || r['he'];
        const logoHtml = r.logo
            ? `<img src="${r.logo}" alt="" class="resource-logo" style="max-height: 28px; margin-bottom: 0.75rem;">`
            : '';
        const dateStr = formatResourceDate(r.date, lang);
        const dateHtml = dateStr
            ? `<div class="resource-date">${dateStr}</div>`
            : '';
        return `<a href="${r.link}" target="_blank" rel="noopener noreferrer" class="resource-card" style="background: ${r.cardBackground}; border-top: 6px solid ${r.cardBorderColor}; align-items: flex-start; text-align: right;">
            ${logoHtml}
            <div class="resource-title">${t.title}</div>
            ${dateHtml}
            <p style="font-size: 1rem; line-height: 1.7;">${t.description}</p>
            <div class="resource-btn" style="margin-top: 1.25rem;">${lang === 'he' ? 'להמשך קריאה...' : 'Read more...'}</div>
        </a>`;
    }).join('');
}

fetch('/resources.json')
    .then(r => r.json())
    .then(data => {
        resourcesData = data;
        renderResources(CURRENT_LANG);
    })
    .catch(err => console.error('Failed to load resources.json:', err));

// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Expandable aspect cards
document.querySelectorAll('.aspect-card--expandable').forEach(card => {
    const toggle = () => {
        const expanded = card.getAttribute('aria-expanded') === 'true';
        card.setAttribute('aria-expanded', String(!expanded));
    };
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
});

// Sticky Header effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.style.padding = '5px 0';
        header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.padding = '0';
        header.style.boxShadow = 'none';
    }
});
