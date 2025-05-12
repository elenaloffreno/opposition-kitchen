

// Check for Mobile Device
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}



// Load Header Footer & Sharing HTML Components
document.addEventListener("DOMContentLoaded", function () {
    loadComponent("components/header.html", "header-container");
    loadComponent("components/footer.html", "footer-container");
    loadComponent("components/share.html", "share-links");
    
    // Date elements are now handled in the loadComponent function
    // when containerId === "share-links"
});

// Function to initialize share buttons
function initializeShareButtons() {
    // Get all share buttons
    const shareButtons = document.querySelectorAll('.share-btn');
    
    console.log('Initializing share buttons:', shareButtons.length);
    
    // Add click event listener to each button
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the platform from data attribute
            const platform = this.dataset.platform;
            
            // Get current page URL and title
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.querySelector('h2').textContent);
            
            // Define share URLs for different platforms
            const shareUrls = {
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
                email: `mailto:?subject=${title}&body=Check out this article: ${url}`
            };
            
            // Open share dialog in a new window
            if (shareUrls[platform]) {
                console.log(`Sharing to ${platform}: ${shareUrls[platform]}`);
                window.open(shareUrls[platform], '_blank');
            }
        });
    });
    
    // Add automatic date functionality
    const dateElements = document.querySelectorAll('.date-published time');
    dateElements.forEach(elem => {
        // If no datetime attribute is present, use current date
        if (!elem.getAttribute('datetime')) {
            const now = new Date();
            const formattedDate = now.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            elem.setAttribute('datetime', now.toISOString().split('T')[0]);
            elem.textContent = formattedDate;
        }
    });
}

// Function to Load HTML Components into the Page
function loadComponent(url, containerId) {
    console.log(`Attempting to load ${url} into #${containerId}`);
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                console.error(`Failed to load ${url}: ${response.statusText}`);
                throw new Error(`Failed to load ${url}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            const container = document.getElementById(containerId);
            
            if (!container) {
                console.error(`Container #${containerId} not found`);
                return;
            }
            
            // Check if this is a share component and has custom date attributes
            if (containerId === "share-links" && container.hasAttribute("data-publish-date")) {
                const publishDate = container.getAttribute("data-publish-date");
                const publishDateFormatted = container.getAttribute("data-publish-date-formatted");
                
                // Replace placeholders with custom dates
                html = html.replace(/{{article-date}}/g, publishDate);
                html = html.replace(/{{article-date-formatted}}/g, publishDateFormatted);
            }
            
            container.innerHTML = html;
            console.log(`Successfully loaded ${url} into #${containerId}`);
            
            // Initialize share buttons if this is the share component
            if (containerId === "share-links") {
                setTimeout(() => {
                    initializeShareButtons();
                }, 100); // Small delay to ensure DOM is updated
            }
        })
        .catch(error => {
            console.error(`Error loading ${url}:`, error);
        });
}

// newsletter sub (only run if there’s actually a modal on this page)
const modal = document.querySelector('.modal');
if (modal) {
  // show it after 5s
  setTimeout(() => modal.classList.add('visible'), 5000);

  function closeModal() {
    modal.classList.remove('visible');
  }

  // only hook up the close button if it exists
  const closeBtn = document.getElementById('close-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // only hook up backdrop‐click if overlay exists
  const overlay = modal.querySelector('.modal-overlay');
  if (overlay) overlay.addEventListener('click', closeModal);
}

// clicky sounds (this now will run on every page)
// 1) Preload your sounds
const soundPaths = [
  'sounds/apple.wav',
  'sounds/chips.wav',
  'sounds/clang.wav',
  'sounds/frying.wav',
  'sounds/pot.wav',
  'sounds/water.wav',
  'sounds/yummy.wav',
];
const clickSounds = soundPaths.map(src => {
  const a = new Audio(src);
  a.preload = 'auto';
  return a;
});

// 2) play once on all non‐link mousedowns
document.addEventListener('click', e => {
  const link = e.target.closest('a');
  if (!link) return;           // not a link → ignore

  e.preventDefault();          // stop immediate navigation
  const href = link.href;

  // figure out what kind of link this is:
  const isMail = href.startsWith('mailto:');
  let isExternal = false;
  try {
    const url = new URL(href, location.href);
    isExternal = url.origin !== location.origin;
  } catch (err) {
    // malformed URL? just treat as non-external
  }
  const isNewTab = link.target === '_blank';

  // play your random click
  const s = clickSounds[Math.floor(Math.random() * clickSounds.length)];
  s.currentTime = 0;
  s.play().catch(() => {});

  // then, once it’s done, open appropriately
  s.onended = () => {
    if (isMail || isExternal || isNewTab) {
      // mailto: or any external/new-tab link → open in new tab
      window.open(href, '_blank');
    } else {
      // same-origin internal link → navigate in-page
      window.location.href = href;
    }
  };
}, true);


