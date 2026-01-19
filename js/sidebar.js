/**
 * Sidebar Loader
 * Dynamically inserts the sidebar HTML into the placeholder div.
 * Requires: <div id="sidebar-container"></div> in HTML.
 */

const sidebarContent = `
<div class="sidebar d-flex flex-column flex-shrink-0 p-3">
    <span class="sidebar-heading">Monitoring</span>
    <ul class="nav nav-pills flex-column">
        <li class="nav-item">
            <a href="./dashboard.html" class="nav-link">
                <i class="bi bi-speedometer2"></i>
                Dashboard
            </a>
        </li>
    </ul>

    <hr class="text-secondary">

    <span class="sidebar-heading">Management</span>
    <ul class="nav nav-pills flex-column mb-auto">
        <li>
            <a href="./agent-list.html" class="nav-link">
                <i class="bi bi-hdd-rack"></i>
                Agents
            </a>
        </li>
        <li>
            <a href="./agent-group-list.html" class="nav-link">
                <i class="bi bi-collection"></i>
                Agent Group
            </a>
        </li>
        <li>
            <a href="./history.html" class="nav-link">
                <i class="bi bi-clock-history"></i>
                Action History
            </a>
        </li>
    </ul>

    <hr class="text-secondary">

    <span class="sidebar-heading">System</span>
    <ul class="nav nav-pills flex-column">
        <li>
            <a href="./user-list.html" class="nav-link">
                <i class="bi bi-people-fill"></i>
                Members
            </a>
        </li>
        <li class="menu-admin-only">
            <a href="./settings.html" class="nav-link">
                <i class="bi bi-gear-fill"></i>
                Setting
            </a>
        </li>
    </ul>
</div>
`;


function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    const navLinks = document.querySelectorAll('#sidebar-container .nav-link');

    // Manually map detailed pages to their parent list menu
    const PAGE_MAPPING = {
        'agent-details.html': 'agent-list.html',
        'agent-form.html': 'agent-list.html',
        'agent-group-details.html': 'agent-group-list.html',
        'user-form.html': 'user-list.html'
    };

    const targetPage = PAGE_MAPPING[pageName] || pageName;

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        const linkPageName = href.substring(href.lastIndexOf('/') + 1);

        // Simple matching logic consistent with common.js
        // Matches exact filename, or treats root as dashboard.html
        if (targetPage === linkPageName || (targetPage === '' && linkPageName === 'dashboard.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function loadSidebar() {
    const container = document.getElementById('sidebar-container');
    if (container) {
        container.innerHTML = sidebarContent;
        highlightActiveLink();
    } else {
        console.error("Sidebar container not found!");
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSidebar);
} else {
    loadSidebar();
}
