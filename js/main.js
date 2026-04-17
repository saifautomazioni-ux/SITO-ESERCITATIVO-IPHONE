const observerOptions = {
    threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

const heroTitle = document.querySelector('.hero-title-premium');
const heroSubtitle = document.querySelector('.hero-subtitle-premium');

if (heroTitle) {
    const text = heroTitle.textContent || '';
    heroTitle.setAttribute('aria-label', text.trim());
    heroTitle.textContent = '';

    let revealIndex = 0;
    [...text].forEach((char) => {
        const span = document.createElement('span');
        if (char === ' ') {
            span.className = 'title-space';
            span.textContent = '\u00A0';
        } else {
            span.className = 'title-char';
            span.style.setProperty('--i', String(revealIndex));
            span.textContent = char;
            revealIndex += 1;
        }
        heroTitle.appendChild(span);
    });
}

if (heroTitle && heroSubtitle) {
    const subtitleText = heroSubtitle.textContent || '';
    heroSubtitle.setAttribute('aria-label', subtitleText.trim());
    heroSubtitle.textContent = '';

    const rootStyles = getComputedStyle(heroTitle);
    const dur = rootStyles.getPropertyValue('--reveal-dur').trim() || '930ms';
    const stagger = rootStyles.getPropertyValue('--reveal-stagger').trim() || '0.068s';
    heroSubtitle.style.setProperty('--reveal-dur', dur);
    heroSubtitle.style.setProperty('--reveal-stagger', stagger);

    const durMs = dur.endsWith('ms') ? parseFloat(dur) : parseFloat(dur) * 1000;
    const staggerMs = stagger.endsWith('ms') ? parseFloat(stagger) : parseFloat(stagger) * 1000;

    const titleLen = heroTitle.querySelectorAll('.title-char').length;
    const totalTitleMs = Math.max(0, (titleLen - 1) * staggerMs + durMs);
    const gapMs = 8;

    const subtitleChars = [...subtitleText];
    let subtitleRevealLen = 0;
    subtitleChars.forEach((char) => {
        const span = document.createElement('span');
        if (char === ' ') {
            span.className = 'subtitle-space';
            span.textContent = '\u00A0';
        } else {
            span.className = 'subtitle-char';
            span.style.setProperty('--i', String(subtitleRevealLen));
            span.style.animationDelay = `${totalTitleMs + gapMs + (subtitleRevealLen * staggerMs)}ms`;
            span.textContent = char;
            subtitleRevealLen += 1;
        }
        heroSubtitle.appendChild(span);
    });

    const totalSubtitleMs = Math.max(0, (subtitleRevealLen - 1) * staggerMs + durMs);

    window.setTimeout(() => {
        const firstChar = heroSubtitle.querySelector('.subtitle-char');
        if (!firstChar) return;
        if (getComputedStyle(firstChar).opacity !== '1') {
            heroSubtitle.querySelectorAll('.subtitle-char').forEach((el) => {
                const element = el;
                element.style.animation = 'none';
                element.style.opacity = '1';
                element.style.transform = 'none';
            });
        }
    }, totalTitleMs + gapMs + totalSubtitleMs + 200);
}
