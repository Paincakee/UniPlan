
const title = document.title;
function generateNavbar(name) {
    const navbar = `
        <nav id="sidebarMenu" class="">
            <div class="nav-info">
                <div class="wrapper">
                <svg class="svg" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"><path d="M15,6c0-3.309-2.691-6-6-6S3,2.691,3,6s2.691,6,6,6,6-2.691,6-6Zm-6,4c-2.206,0-4-1.794-4-4s1.794-4,4-4,4,1.794,4,4-1.794,4-4,4Zm13,7c0-.552-.09-1.082-.256-1.579l1.82-1.049-.998-1.733-1.823,1.05c-.706-.797-1.662-1.368-2.743-1.589v-2.101h-2v2.101c-1.082,.221-2.037,.792-2.743,1.589l-1.823-1.05-.998,1.733,1.82,1.049c-.166,.497-.256,1.027-.256,1.579s.09,1.082,.256,1.579l-1.82,1.049,.998,1.733,1.823-1.05c.706,.797,1.662,1.368,2.743,1.589v2.101h2v-2.101c1.082-.221,2.037-.792,2.743-1.589l1.823,1.05,.998-1.733-1.82-1.049c.166-.497,.256-1.027,.256-1.579Zm-5,3c-1.654,0-3-1.346-3-3s1.346-3,3-3,3,1.346,3,3-1.346,3-3,3ZM5,14h3v2h-3c-1.654,0-3,1.346-3,3v5H0v-5c0-2.757,2.243-5,5-5Z"/></svg>

                    <span>${name}</span>
                </div>
            </div>
            <div class="nav-items">
                <a href="/home" class="" aria-current="true">
                <svg class="svg" xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M23.121,9.069,15.536,1.483a5.008,5.008,0,0,0-7.072,0L.879,9.069A2.978,2.978,0,0,0,0,11.19v9.817a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V11.19A2.978,2.978,0,0,0,23.121,9.069ZM15,22.007H9V18.073a3,3,0,0,1,6,0Zm7-1a1,1,0,0,1-1,1H17V18.073a5,5,0,0,0-10,0v3.934H3a1,1,0,0,1-1-1V11.19a1.008,1.008,0,0,1,.293-.707L9.878,2.9a3.008,3.008,0,0,1,4.244,0l7.585,7.586A1.008,1.008,0,0,1,22,11.19Z"/></svg>

                    <span>Home</span>
                </a>
                <a href="/account" class="" aria-current="true">
                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><g id="_01_align_center" data-name="01 align center"><path d="M21,24H19V18.957A2.96,2.96,0,0,0,16.043,16H7.957A2.96,2.96,0,0,0,5,18.957V24H3V18.957A4.963,4.963,0,0,1,7.957,14h8.086A4.963,4.963,0,0,1,21,18.957Z"/><path d="M12,12a6,6,0,1,1,6-6A6.006,6.006,0,0,1,12,12ZM12,2a4,4,0,1,0,4,4A4,4,0,0,0,12,2Z"/></g></svg>

                    <span>Account</span>
                </a>
                <a href="/project" class="" aria-current="true">
                    <svg id="Layer_1" class="svg" height="512" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m16 6a1 1 0 0 1 0 2h-8a1 1 0 0 1 0-2zm7.707 17.707a1 1 0 0 1 -1.414 0l-2.407-2.407a4.457 4.457 0 0 1 -2.386.7 4.5 4.5 0 1 1 4.5-4.5 4.457 4.457 0 0 1 -.7 2.386l2.407 2.407a1 1 0 0 1 0 1.414zm-6.207-3.707a2.5 2.5 0 1 0 -2.5-2.5 2.5 2.5 0 0 0 2.5 2.5zm-4.5 2h-6a3 3 0 0 1 -3-3v-14a3 3 0 0 1 3-3h12a1 1 0 0 1 1 1v8a1 1 0 0 0 2 0v-8a3 3 0 0 0 -3-3h-12a5.006 5.006 0 0 0 -5 5v14a5.006 5.006 0 0 0 5 5h6a1 1 0 0 0 0-2z"/></svg>
                    <span>Project</span>
                </a>
                <a href="#" class="" aria-current="true">
                    <span>Idk</span>
                </a>
                <a href="#" class="" aria-current="true">
                    <span>idk</span>
                </a>
            </div>
        </nav>
    `;
    // Get the current page URL
    var currentPage = window.location.href;

    // Create a temporary container to parse the navbar HTML
    var tempContainer = document.createElement('div');
    tempContainer.innerHTML = navbar;

    // Get all the <a> elements inside the nav-items container
    var navLinks = tempContainer.querySelectorAll(".nav-items a");

    // Loop through the <a> elements and check if the href matches the current page URL
    for (var i = 0; i < navLinks.length; i++) {
        var link = navLinks[i];

        // Get the href attribute value
        var href = link.getAttribute('href');

        // Compare the current page URL and the href value, taking into account the subpath
        if (currentPage.endsWith(href) || currentPage.endsWith(href + '/') || currentPage.includes(href + '?')) {
            link.classList.add("active");
            break; // Stop the loop if a match is found
        }
    }

    // Insert the navbar into a specific element on your page
    var navbarContainer = document.getElementById('navbar-container');
    navbarContainer.innerHTML = tempContainer.innerHTML;
}

// Call the function to generate the navbar
generateNavbar(title);
