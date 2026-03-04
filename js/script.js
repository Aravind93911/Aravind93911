// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('toggle');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        burger.classList.remove('toggle');
    });
});

// Counter Animation
const counters = document.querySelectorAll('.counter');
const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const increment = target / 100;
    let count = 0;

    const updateCount = () => {
        count += increment;
        if (count < target) {
            counter.textContent = Math.ceil(count);
            requestAnimationFrame(updateCount);
        } else {
            counter.textContent = target;
        }
    };
    updateCount();
};

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach(counter => animateCounter(counter));
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const aboutSection = document.querySelector('.about');
if (aboutSection) observer.observe(aboutSection);

// Fetch GitHub Repositories
const GITHUB_USERNAME = 'Aravind93911';
const projectsGrid = document.getElementById('projects-grid');

// Repository category mapping (customize based on your repo names/topics)
const categoryMap = {
    'linux-kernel-security-lab': ['kernel', 'security'],
    'syzkaller-kernel-fuzz': ['kernel', 'security'],
    'aosp-selinux-experiments': ['android', 'security'],
    'android-security-tools': ['android', 'tools', 'security'],
    'arm-security-mitigations': ['kernel', 'security'],
    // Add more mappings for your repos
};

// Icon mapping for projects
const getProjectIcon = (name, topics) => {
    if (topics.includes('kernel') || name.includes('kernel')) return 'fa-linux';
    if (topics.includes('android') || name.includes('android')) return 'fa-android';
    if (topics.includes('security') || name.includes('security')) return 'fa-shield-alt';
    if (topics.includes('fuzzing') || name.includes('fuzz')) return 'fa-bug';
    return 'fa-code';
};

async function fetchGitHubRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        const repos = await response.json();

        // Filter out forks and sort by stars/updated
        const filteredRepos = repos
            .filter(repo => !repo.fork && !repo.name.includes('Aravind93911'))
            .sort((a, b) => b.stargazers_count - a.stargazers_count);

        displayProjects(filteredRepos);
    } catch (error) {
        projectsGrid.innerHTML = '<p style="text-align:center; color: var(--gray);">Failed to load repositories. Please visit <a href="https://github.com/Aravind93911" style="color: var(--primary);">GitHub</a> directly.</p>';
    }
}

function displayProjects(repos) {
    projectsGrid.innerHTML = '';

    if (repos.length === 0) {
        projectsGrid.innerHTML = '<p style="text-align:center; color: var(--gray);">No repositories found.</p>';
        return;
    }

    repos.forEach((repo, index) => {
        const categories = categoryMap[repo.name] || ['tools'];
        const topics = repo.topics || categories;
        const icon = getProjectIcon(repo.name, topics);

        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', categories.join(' '));
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="project-header">
                <i class="fas ${icon} project-icon"></i>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" title="View on GitHub"><i class="fab fa-github"></i></a>
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                </div>
            </div>
            <h3>${repo.name}</h3>
            <p class="project-description">${repo.description || 'No description available.'}</p>
            <div class="project-topics">
                ${topics.slice(0, 4).map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
            </div>
            <div class="project-stats">
                <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                <span><i class="fas fa-circle" style="color: ${getLanguageColor(repo.language)}"></i> ${repo.language || 'N/A'}</span>
            </div>
        `;

        projectsGrid.appendChild(card);
    });

    setupFilters();
}

function getLanguageColor(language) {
    const colors = {
        'C': '#555555',
        'C++': '#f34b7d',
        'Python': '#3572A5',
        'Java': '#b07219',
        'JavaScript': '#f1e05a',
        'Shell': '#89e051',
        'Makefile': '#427819'
    };
    return colors[language] || '#8b949e';
}

// Project Filtering
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Update footer date
document.getElementById('update-date').textContent = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Initialize
fetchGitHubRepos();

// Smooth scroll offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});
