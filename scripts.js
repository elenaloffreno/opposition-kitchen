// Custom Cursor with Gradient Trail
let cursor = document.getElementById("cursor");
let size;
let trail = [];
const trailLength = 15; // Increased trail length for more lingering effect
let currentSize = 12; // Track the current size for smooth transitions
const transitionSpeed = 0.15; // Lower number = slower transition (was instant before)

// Create trail elements
for (let i = 0; i < trailLength; i++) {
    const trailDot = document.createElement("div");
    trailDot.className = "cursor-trail";
    document.body.appendChild(trailDot);
    trail.push({
        element: trailDot,
        x: 0,
        y: 0
    });
}

// Store cursor positions for trail effect
let cursorPositions = [];
const maxPositions = 30; // More positions stored for smoother trail
let animationFrame;

document.body.addEventListener("mousemove", (ev) => {
    let path = ev.composedPath();

    // Define target sizes - reduced the link/button size from 24 to 20
    let targetSize;
    if (path.some(x => x.tagName == "A")) targetSize = 20;
    else if (path.some(x => x.tagName == "BUTTON")) targetSize = 20;
    else targetSize = 12; // Default size

    // Store position for trail
    cursorPositions.unshift({ x: ev.clientX, y: ev.clientY, timestamp: performance.now() });
    
    // Keep array at fixed length
    if (cursorPositions.length > maxPositions) {
        cursorPositions.pop();
    }
});

// Continuously update cursor and trail
function animateTrail() {
    // Get current cursor position
    if (cursorPositions.length > 0) {
        const currentTime = performance.now();
        const currentPos = cursorPositions[0];

        // Determine target size based on what's under the cursor
        let path = document.elementsFromPoint(currentPos.x, currentPos.y);
        let targetSize;
        
        if (path.some(x => x.tagName == "A")) targetSize = 20; // Reduced from 24
        else if (path.some(x => x.tagName == "BUTTON")) targetSize = 20; // Reduced from 24
        else targetSize = 12;
        
        // Smooth transition of size
        currentSize = currentSize + (targetSize - currentSize) * transitionSpeed;
        
        // Update main cursor with smooth size transition
        cursor.style.left = (currentPos.x - currentSize / 2) + "px";
        cursor.style.top = (currentPos.y - currentSize / 2) + "px";
        cursor.style.width = currentSize + "px";
        cursor.style.height = currentSize + "px";
        
        trail.forEach((dot, index) => {
            // Determine position with spacing based on index
            const spacing = Math.pow(1.15, index); // Exponential spacing for natural trail effect
            const posIndex = Math.min(Math.floor(spacing), cursorPositions.length - 1);
            
            if (cursorPositions[posIndex]) {
                // Calculate time-based fade
                const age = currentTime - cursorPositions[posIndex].timestamp;
                const fadeTime = 800; // Fade out over 800ms for lingering effect
                const fadeOpacity = Math.max(0, 1 - (age / fadeTime));
                
                // Calculate size (smaller as we go down the trail)
                const dotSize = Math.max(4, 10 - index * 0.5); // Slightly larger trail dots
                
                // Update position with slight easing
                dot.element.style.left = (cursorPositions[posIndex].x - dotSize / 2) + "px";
                dot.element.style.top = (cursorPositions[posIndex].y - dotSize / 2) + "px";
                
                // Update size and opacity
                dot.element.style.width = dotSize + "px";
                dot.element.style.height = dotSize + "px";
                dot.element.style.opacity = Math.min(0.85, fadeOpacity - (index / (trailLength * 1.5)));
            }
        });
    }
    
    animationFrame = requestAnimationFrame(animateTrail);
}

// Start animation loop
animationFrame = requestAnimationFrame(animateTrail);

// Hide cursor and trail when cursor leaves the window
document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
    trail.forEach(dot => {
        dot.element.style.opacity = "0";
    });
});

// Show cursor and trail when cursor enters the window
document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
    trail.forEach((dot, index) => {
        dot.element.style.opacity = 0.85 - (index / trailLength);
    });
});

// Clean up animation frame on page unload
window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(animationFrame);
});



// Check for Mobile Device
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// Nav Interaction: Rotating Word Effect
const wordElement = document.getElementById("rotating-word");

if (wordElement) {
    const letters = Array.from(wordElement.textContent);

    wordElement.innerHTML = letters
        .map(letter => `<span class="letter">${letter}</span>`)
        .join('');

    const letterElements = document.querySelectorAll('.letter');

    wordElement.addEventListener('mouseenter', () => {
        letterElements.forEach(letter => {
            const randomDegree = Math.floor(Math.random() * 360);
            letter.style.transform = `rotate(${randomDegree}deg)`;
        });
    });

    wordElement.addEventListener('mouseleave', () => {
        letterElements.forEach(letter => {
            letter.style.transform = `rotate(0deg)`;
        });
    });
} else {
    console.log("No element with id 'rotating-word' found");
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

// newsletter sub

document.addEventListener("DOMContentLoaded", function() {
    const modal     = document.getElementById("subscribe-modal");
    const overlay   = document.querySelector(".modal-overlay");
    const closeBtn  = document.getElementById("close-modal");
    const content   = document.getElementById("content");
  
    // 1) Show after 5s (adjust as you like)
    setTimeout(() => {
      modal.style.display = "block";
    }, 50000);
  
    // 2) Close logic
    function closeModal() {
      modal.style.display = "none";
    }
  
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);
  });
  
