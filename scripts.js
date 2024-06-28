let cursor = document.getElementById("cursor");
let size;
document.body.addEventListener("mousemove", (ev)=>{
    let path = ev.composedPath();
    
    if (path.some(x=>x.tagName == "A")) size = 20;
    else if (path.some(x=>x.tagName == "BUTTON")) size = 20; // adjust size for <button> tag
    
    else size = 10; // default size if not over <a> or <button>
    
    cursor.style.left   = (ev.clientX - size/2) + "px";
    cursor.style.top    = (ev.clientY - size/2) + "px";
    cursor.style.width  = size + "px";
    cursor.style.height = size + "px";
});


function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function checkOrientation() {
    if (isMobileDevice()) {
        if (window.innerHeight > window.innerWidth) {
            document.getElementById('rotate-message').style.display = 'block';
            document.getElementById('content').classList.add('blur');
        } else {
            document.getElementById('rotate-message').style.display = 'none';
            document.getElementById('content').classList.remove('blur');
        }
    } else {
        document.getElementById('rotate-message').style.display = 'none';
        document.getElementById('content').classList.remove('blur');
    }
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('load', checkOrientation);
