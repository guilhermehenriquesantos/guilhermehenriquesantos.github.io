'use strict';

/* ─── LANGUAGE TOGGLE ──────────────────────── */
const LANG_STORAGE_KEY = 'gh_lang';
let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'pt';

function translateElements(lang) {
    document.querySelectorAll('[data-pt][data-en]').forEach((el) => {
        // Only translate leaf nodes to avoid a parent overwriting children
        if (el.querySelector('[data-pt]')) return;
        const text = el.dataset[lang];
        if (text !== undefined) el.innerHTML = text;
    });
}

function updateLangToggles(lang) {
    document
        .querySelectorAll('.lang-pt')
        .forEach((el) => el.classList.toggle('active', lang === 'pt'));
    document
        .querySelectorAll('.lang-en')
        .forEach((el) => el.classList.toggle('active', lang === 'en'));
}

function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

    translateElements(lang);
    updateLangToggles(lang);

    // Re-render repos so fallback descriptions follow the language
    const grid = document.getElementById('repos-grid');
    if (grid && grid.querySelector('.repo-card')) renderRepos();
}

function toggleLang() {
    applyLang(currentLang === 'pt' ? 'en' : 'pt');
}

document.querySelectorAll('#lang-btn, #lang-btn-mobile').forEach((btn) => {
    btn.addEventListener('click', () => {
        toggleLang();
        resetTypewriter();
    });
});

applyLang(currentLang);

/* ─── HIGH CONTRAST TOGGLE ─────────────────── */
const CONTRAST_STORAGE_KEY = 'gh_contrast';
const contrastButton = document.getElementById('contrast-btn');

function applyContrast(isHigh) {
    if (isHigh) {
        document.documentElement.setAttribute('data-contrast', 'high');
        localStorage.setItem(CONTRAST_STORAGE_KEY, 'high');
    } else {
        document.documentElement.removeAttribute('data-contrast');
        localStorage.removeItem(CONTRAST_STORAGE_KEY);
    }
    contrastButton.setAttribute('aria-pressed', isHigh);
}

contrastButton.addEventListener('click', () => {
    applyContrast(!document.documentElement.hasAttribute('data-contrast'));
});

applyContrast(localStorage.getItem(CONTRAST_STORAGE_KEY) === 'high');

/* ─── REDUCED MOTION ───────────────────────── */
const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;

/* ─── TECH MARQUEE ─────────────────────────── */
// The track holds two identical halves and animates translateX(-50%).
// On screens wider than one half, the end of the track becomes visible
// near -50% and shows a blank area. Doubling the content until the
// track covers at least twice the viewport keeps the loop seamless.
const MARQUEE_SPEED = 50; // px per second

function setUpMarquee() {
    const wrap = document.querySelector('.marquee-wrap');
    const track = document.querySelector('.marquee-track');
    if (!wrap || !track) return;

    const fitTrackToViewport = () => {
        while (
            track.scrollWidth < wrap.offsetWidth * 2 &&
            track.children.length < 400
        ) {
            track.innerHTML += track.innerHTML;
        }
        const halfWidth = track.scrollWidth / 2;
        track.style.animationDuration = `${halfWidth / MARQUEE_SPEED}s`;
    };

    fitTrackToViewport();
    window.addEventListener('resize', fitTrackToViewport);
}

setUpMarquee();

/* ─── MOBILE MENU ──────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

function setMobileNavOpen(isOpen) {
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

hamburger.addEventListener('click', () => {
    setMobileNavOpen(!mobileNav.classList.contains('open'));
});

mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMobileNavOpen(false));
});

/* ─── NAV SCROLL SHADOW ────────────────────── */
const navOuter = document.querySelector('.nav-outer');

window.addEventListener(
    'scroll',
    () => {
        navOuter.style.boxShadow =
            window.scrollY > 10 ? '0 1px 12px rgba(21,17,10,.08)' : '';
    },
    { passive: true }
);

/* ─── SCROLL REVEAL ────────────────────────── */
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

document
    .querySelectorAll('.reveal')
    .forEach((el) => revealObserver.observe(el));

/* ─── GITHUB REPOS ─────────────────────────── */
const GH_USER = 'guilhermehenriquesantos';
const FEATURED_REPO = 'blockchain-pow-py';
const REPOS_TO_SHOW = 4;
const CACHE_KEY = 'gh_repos_v2';
const CACHE_TTL = 60 * 60 * 1000; // 1h

const LANG_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    default: '#8a7a68',
};

const FALLBACK_REPOS = [
    {
        name: 'angular-cms',
        description: {
            pt: 'CMS flexível e modular em Angular + Express. Gerenciamento dinâmico de conteúdo com layout customizável.',
            en: 'Flexible modular CMS in Angular + Express. Dynamic content management with a customizable layout.',
        },
        language: 'TypeScript',
        stargazers_count: 12,
        html_url: 'https://github.com/guilhermehenriquesantos/angular-cms',
        visibility: 'public',
    },
    {
        name: 'crawler-telefones',
        description: {
            pt: 'Acessa API e recupera telefones de anunciantes pela descrição inserida. Web scraping com Python.',
            en: 'Hits an API and retrieves ad-listed phone numbers from a description string. Python web scraping.',
        },
        language: 'Python',
        stargazers_count: 8,
        html_url:
            'https://github.com/guilhermehenriquesantos/crawler-telefones',
        visibility: 'public',
    },
    {
        name: 'guiacybersecurity',
        description: {
            pt: 'Guia completo de segurança da informação para desenvolvedores: boas práticas e referências.',
            en: 'Complete information-security guide for developers: best practices and references.',
        },
        language: 'HTML',
        stargazers_count: 23,
        html_url:
            'https://github.com/guilhermehenriquesantos/guiacybersecurity',
        visibility: 'public',
    },
    {
        name: 'blockchain-pow-py',
        description: {
            pt: 'Biblioteca peso-leve em Python para simulação de operações em blockchain baseada em PoW. TCC UFU.',
            en: 'Lightweight Python library for simulating PoW-based blockchain operations. UFU thesis.',
        },
        language: 'Python',
        stargazers_count: 15,
        html_url:
            'https://github.com/guilhermehenriquesantos/blockchain-pow-py',
        visibility: 'public',
    },
];

function readReposCache() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { data, ts } = JSON.parse(cached);
    return Date.now() - ts < CACHE_TTL ? data : null;
}

async function fetchRepos() {
    try {
        const cachedRepos = readReposCache();
        if (cachedRepos) return cachedRepos;

        const res = await fetch(
            `https://api.github.com/users/${GH_USER}/repos?per_page=100&type=public`
        );
        if (!res.ok) throw new Error(`GitHub API: ${res.status}`);

        const repos = await res.json();
        repos.sort(
            (a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)
        );
        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ data: repos, ts: Date.now() })
        );
        return repos;
    } catch {
        return null;
    }
}

function repoDescription(repo) {
    if (typeof repo.description === 'object' && repo.description) {
        return repo.description[currentLang] || repo.description.pt || '';
    }
    return repo.description || '';
}

function repoCardHtml(repo) {
    const color = LANG_COLORS[repo.language] || LANG_COLORS.default;
    return `
    <a href="${repo.html_url}" target="_blank" rel="noopener" class="repo-card">
        <div class="repo-top">
            <span class="repo-name">${repo.name}</span>
            <span class="repo-stars">★ ${repo.stargazers_count || 0}</span>
        </div>
        <p class="repo-desc">${repoDescription(repo)}</p>
        <div class="repo-footer">
            ${repo.language ? `<span class="repo-lang"><span class="lang-dot" style="background:${color}"></span>${repo.language}</span>` : '<span></span>'}
            <span class="repo-visibility">${repo.visibility || 'public'}</span>
        </div>
    </a>`;
}

function animateRepoCards(grid) {
    grid.querySelectorAll('.repo-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        card.style.transition = `opacity .5s ease ${i * 0.08}s, transform .5s ease ${i * 0.08}s`;
        requestAnimationFrame(() =>
            requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            })
        );
    });
}

async function renderRepos() {
    const grid = document.getElementById('repos-grid');
    const repos = (await fetchRepos()) || FALLBACK_REPOS;

    // The featured project already has its own card above the grid
    const visible = repos
        .filter((repo) => repo.name !== FEATURED_REPO)
        .slice(0, REPOS_TO_SHOW);
    const toShow = visible.length
        ? visible
        : FALLBACK_REPOS.filter((repo) => repo.name !== FEATURED_REPO);

    grid.innerHTML = toShow.map(repoCardHtml).join('');
    animateRepoCards(grid);
}

renderRepos();

/* ─── TYPEWRITER ───────────────────────────── */
const TW_ROLES = {
    pt: [
        'Desenvolvedor Full Stack',
        'Analista de TI · HU Brasil',
        'Java · Python · JavaScript',
        'IA aplicada ao desenvolvimento',
        'UX/UI como diferencial técnico',
    ],
    en: [
        'Full Stack Developer',
        'IT Analyst · HU Brasil',
        'Java · Python · JavaScript',
        'Applied AI in development',
        'UX/UI as a technical edge',
    ],
};
const TW_TYPE_DELAY = 62;
const TW_DELETE_DELAY = 34;
const TW_HOLD_DELAY = 2000;
const TW_NEXT_ROLE_DELAY = 340;

const twElement = document.getElementById('tw-text');
let twRoleIndex = 0;
let twCharIndex = 0;
let twDeleting = false;
let twTimer = null;

function twTick() {
    const roles = TW_ROLES[currentLang] || TW_ROLES.pt;
    const role = roles[twRoleIndex];

    if (!twDeleting) {
        twElement.textContent = role.slice(0, ++twCharIndex);
        if (twCharIndex === role.length) {
            twDeleting = true;
            twTimer = setTimeout(twTick, TW_HOLD_DELAY);
            return;
        }
        twTimer = setTimeout(twTick, TW_TYPE_DELAY);
    } else {
        twElement.textContent = role.slice(0, --twCharIndex);
        if (twCharIndex === 0) {
            twDeleting = false;
            twRoleIndex = (twRoleIndex + 1) % roles.length;
            twTimer = setTimeout(twTick, TW_NEXT_ROLE_DELAY);
            return;
        }
        twTimer = setTimeout(twTick, TW_DELETE_DELAY);
    }
}

function showStaticRole() {
    const roles = TW_ROLES[currentLang] || TW_ROLES.pt;
    twElement.textContent = roles[0];
}

function resetTypewriter() {
    clearTimeout(twTimer);
    twRoleIndex = 0;
    twCharIndex = 0;
    twDeleting = false;
    if (prefersReducedMotion) {
        showStaticRole();
        return;
    }
    twElement.textContent = '';
    twTimer = setTimeout(twTick, 300);
}

if (prefersReducedMotion) {
    showStaticRole();
} else {
    twTick();
}

/* ─── BACK TO TOP ──────────────────────────── */
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener(
    'scroll',
    () => {
        backToTopButton.classList.toggle('visible', window.scrollY > 400);
    },
    { passive: true }
);

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
