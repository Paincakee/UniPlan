
const title = document.title;
function generateNavbar(name, isAdmin) {
    const href = window.location.pathname;
    const svgWrapperArrowStyle = href === '/project/new' ? 'height: 45px; margin-top: 8px;' : '';

    const adminLink = isAdmin == 1 ? `<a href="/account/admin" class="" aria-current="true">
    <svg class="svg" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24"
        width="512" height="512">
        <path
            d="M15,6c0-3.309-2.691-6-6-6S3,2.691,3,6s2.691,6,6,6,6-2.691,6-6Zm-6,4c-2.206,0-4-1.794-4-4s1.794-4,4-4,4,1.794,4,4-1.794,4-4,4Zm13,7c0-.552-.09-1.082-.256-1.579l1.82-1.049-.998-1.733-1.823,1.05c-.706-.797-1.662-1.368-2.743-1.589v-2.101h-2v2.101c-1.082,.221-2.037,.792-2.743,1.589l-1.823-1.05-.998,1.733,1.82,1.049c-.166,.497-.256,1.027-.256,1.579s.09,1.082,.256,1.579l-1.82,1.049,.998,1.733,1.823-1.05c.706,.797,1.662,1.368,2.743,1.589v2.101h2v-2.101c1.082-.221,2.037-.792,2.743-1.589l1.823,1.05,.998-1.733-1.82-1.049c.166-.497,.256-1.027,.256-1.579Zm-5,3c-1.654,0-3-1.346-3-3s1.346-3,3-3,3,1.346,3,3-1.346,3-3,3ZM5,14h3v2h-3c-1.654,0-3,1.346-3,3v5H0v-5c0-2.757,2.243-5,5-5Z" />
    </svg>
        <span>Admin</span>
    </a>` : ``;

    const navbar = `
    <nav id="sidebarMenu" class="">
        <div class="nav-info">
            <div class="wrapper">
                <span>${name}</span>
            </div>
        </div>
        <div class="nav-items">
            <a href="/home" class="nav-link" aria-current="true">
                <svg class="svg" xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512"
                    height="512">
                    <path
                        d="M23.121,9.069,15.536,1.483a5.008,5.008,0,0,0-7.072,0L.879,9.069A2.978,2.978,0,0,0,0,11.19v9.817a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V11.19A2.978,2.978,0,0,0,23.121,9.069ZM15,22.007H9V18.073a3,3,0,0,1,6,0Zm7-1a1,1,0,0,1-1,1H17V18.073a5,5,0,0,0-10,0v3.934H3a1,1,0,0,1-1-1V11.19a1.008,1.008,0,0,1,.293-.707L9.878,2.9a3.008,3.008,0,0,1,4.244,0l7.585,7.586A1.008,1.008,0,0,1,22,11.19Z" />
                </svg>

                <span>Dashboard</span>
            </a>
            <a href="/account" class="nav-link" aria-current="true">
                <svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512">
                    <g id="_01_align_center" data-name="01 align center">
                        <path
                            d="M21,24H19V18.957A2.96,2.96,0,0,0,16.043,16H7.957A2.96,2.96,0,0,0,5,18.957V24H3V18.957A4.963,4.963,0,0,1,7.957,14h8.086A4.963,4.963,0,0,1,21,18.957Z" />
                        <path d="M12,12a6,6,0,1,1,6-6A6.006,6.006,0,0,1,12,12ZM12,2a4,4,0,1,0,4,4A4,4,0,0,0,12,2Z" />
                    </g>
                </svg>

                <span>Account</span>
                <div class="svg-wrapper-arrow" style="${svgWrapperArrowStyle}" onclick="toggleSubMenu('accountSubMenu', event)">
                    <svg class="svg-arrow" xmlns="http://www.w3.org/2000/svg" id="" viewBox="0 0 24 24" width="512"
                        height="512">
                        <path
                            d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z" />
                    </svg>
                </div>
                
            </a>
            <div id="accountSubMenu" class="submenus">
                
                ${adminLink}
                <a href="/account/notifications" class="" aria-current="true">
                <svg class="svg" id="Layer_1" height="512" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m20.859 15.331-3.772 6.155a5.235 5.235 0 0 1 -3.87 2.477 5.315 5.315 0 0 1 -.628.037 5.212 5.212 0 0 1 -3-.955 4.741 4.741 0 0 1 -6.689-6.566l-1.315-1.313a5.264 5.264 0 0 1 .955-8.2l5.767-3.566a8.859 8.859 0 0 1 10.327.551l1.659-1.659a1 1 0 1 1 1.414 1.414l-1.657 1.658a8.951 8.951 0 0 1 .809 9.967zm-12.794 6.316-3.719-3.72a2.721 2.721 0 0 0 .463 3.264 2.827 2.827 0 0 0 3.256.456zm9.921-15.6a6.887 6.887 0 0 0 -8.617-.947l-5.777 3.566a3.265 3.265 0 0 0 -.592 5.086l7.29 7.291a3.265 3.265 0 0 0 5.093-.6l3.755-6.125a6.937 6.937 0 0 0 -1.152-8.276zm1.279 17.953a1 1 0 0 1 -.591-1.808 8.633 8.633 0 0 0 3.315-5.407 1 1 0 1 1 1.953.43 10.7 10.7 0 0 1 -4.088 6.593 1 1 0 0 1 -.589.192zm-18.265-18.261a1 1 0 0 1 -.8-1.594 10.692 10.692 0 0 1 6.713-4.125 1 1 0 1 1 .4 1.96 8.636 8.636 0 0 0 -5.513 3.354 1 1 0 0 1 -.8.405z"/></svg>
                    <span>Notifications</span>
                </a>

            </div>

            <a href="/project" class="nav-link" aria-current="true">
                <svg id="Layer_1" class="svg" height="512" viewBox="0 0 24 24" width="512"
                    xmlns="http://www.w3.org/2000/svg" data-name="Layer 1">
                    <path
                        d="m16 6a1 1 0 0 1 0 2h-8a1 1 0 0 1 0-2zm7.707 17.707a1 1 0 0 1 -1.414 0l-2.407-2.407a4.457 4.457 0 0 1 -2.386.7 4.5 4.5 0 1 1 4.5-4.5 4.457 4.457 0 0 1 -.7 2.386l2.407 2.407a1 1 0 0 1 0 1.414zm-6.207-3.707a2.5 2.5 0 1 0 -2.5-2.5 2.5 2.5 0 0 0 2.5 2.5zm-4.5 2h-6a3 3 0 0 1 -3-3v-14a3 3 0 0 1 3-3h12a1 1 0 0 1 1 1v8a1 1 0 0 0 2 0v-8a3 3 0 0 0 -3-3h-12a5.006 5.006 0 0 0 -5 5v14a5.006 5.006 0 0 0 5 5h6a1 1 0 0 0 0-2z" />
                </svg>
                <span>Project</span>

                <div class="svg-wrapper-arrow" style="${svgWrapperArrowStyle}" onclick="toggleSubMenu('projectSubMenu', event)">
                    <svg class="svg-arrow" xmlns="http://www.w3.org/2000/svg" id="" viewBox="0 0 24 24" width="512"
                        height="512">
                        <path
                            d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z" />
                    </svg>
                </div>
                
            </a>
            <div id="projectSubMenu" class="submenus">
                <a href="/project/new" class="" aria-current="true">
                    <svg id="Layer_1" class="svg" height="512" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m16 16a1 1 0 0 1 -1 1h-2v2a1 1 0 0 1 -2 0v-2h-2a1 1 0 0 1 0-2h2v-2a1 1 0 0 1 2 0v2h2a1 1 0 0 1 1 1zm6-5.515v8.515a5.006 5.006 0 0 1 -5 5h-10a5.006 5.006 0 0 1 -5-5v-14a5.006 5.006 0 0 1 5-5h4.515a6.958 6.958 0 0 1 4.95 2.05l3.484 3.486a6.951 6.951 0 0 1 2.051 4.949zm-6.949-7.021a5.01 5.01 0 0 0 -1.051-.78v4.316a1 1 0 0 0 1 1h4.316a4.983 4.983 0 0 0 -.781-1.05zm4.949 7.021c0-.165-.032-.323-.047-.485h-4.953a3 3 0 0 1 -3-3v-4.953c-.162-.015-.321-.047-.485-.047h-4.515a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3z"/></svg>
                    <span>Create</span>
                </a>
                <a href="/project/applies" class="" aria-current="true">
                <svg class="svg" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"><path d="m11.696,11.718l-1.862,1.805c-.318.318-.74.478-1.163.478-.427,0-.856-.163-1.183-.489l-.681-.654c-.398-.383-.411-1.016-.028-1.414.383-.398,1.017-.41,1.414-.028l.473.455,1.638-1.588c.396-.383,1.029-.375,1.414.022.384.396.375,1.029-.022,1.414Zm4.304,5.282h-3c-.552,0-1,.448-1,1s.448,1,1,1h3c.552,0,1-.448,1-1s-.448-1-1-1Zm0-12h-3c-.552,0-1,.448-1,1s.448,1,1,1h3c.552,0,1-.448,1-1s-.448-1-1-1Zm0,6h-2c-.552,0-1,.448-1,1s.448,1,1,1h2c.552,0,1-.448,1-1s-.448-1-1-1Zm-7.5,5.5c-.828,0-1.5.672-1.5,1.5s.672,1.5,1.5,1.5,1.5-.672,1.5-1.5-.672-1.5-1.5-1.5Zm0-9c.828,0,1.5-.672,1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5,1.5.672,1.5,1.5,1.5Zm13.5-2.5v14c0,2.757-2.243,5-5,5H7c-2.757,0-5-2.243-5-5V5C2,2.243,4.243,0,7,0h10c2.757,0,5,2.243,5,5Zm-2,0c0-1.654-1.346-3-3-3H7c-1.654,0-3,1.346-3,3v14c0,1.654,1.346,3,3,3h10c1.654,0,3-1.346,3-3V5Z"/></svg>
                <span>Applies</span>
                </a>
            </div>
            <a href="/account/logout" class="nav-link logout-link" aria-current="true">
                <svg class="svg" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"><path d="M11.476,15a1,1,0,0,0-1,1v3a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2H7.476a3,3,0,0,1,3,3V8a1,1,0,0,0,2,0V5a5.006,5.006,0,0,0-5-5H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H7.476a5.006,5.006,0,0,0,5-5V16A1,1,0,0,0,11.476,15Z"/><path d="M22.867,9.879,18.281,5.293a1,1,0,1,0-1.414,1.414L21.13,10.97,6,11a1,1,0,0,0,0,2H6l15.188-.03-4.323,4.323a1,1,0,1,0,1.414,1.414l4.586-4.586A3,3,0,0,0,22.867,9.879Z"/></svg>

                <span>Logout</span>
            </a>
        </div>
    </nav>
    `;
    // Get the current page URL
    const currentPage = window.location.href;

    // Create a temporary container to parse the navbar HTML
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = navbar;

    // Get all the <a> elements inside the nav-items container and submenus
    const navLinks = tempContainer.querySelectorAll(".nav-items a, .submenus a");

    // Loop through the links and check if the href matches the current page URL
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPage.endsWith(href) || currentPage.endsWith(href + '/') || currentPage.includes(href + '?')) {
            link.classList.add("active");
            // Add the "show" class to the parent submenu if it exists
            const parentSubMenu = link.closest('.submenus');
            if (parentSubMenu) {
                parentSubMenu.classList.add('show');
            }
        }
    });

    // Insert the navbar into a specific element on your page
    const navbarContainer = document.getElementById('navbar-container');
    navbarContainer.innerHTML = tempContainer.innerHTML;
}


function toggleSubMenu(subMenuId, event) {
    event.preventDefault();
    const subMenu = document.getElementById(subMenuId);
    const svgArrow = document.querySelector(`#${subMenuId} .svg-arrow`);
    const isSubMenuHidden = subMenu.style.display === "none";


    if (!subMenu.classList.contains("show")) {
        subMenu.classList.add("show");
        event.stopPropagation();
    }
    else {
        subMenu.classList.remove("show");

    }
}

// Call the function to generate the navbar
generateNavbar(title, admin);
