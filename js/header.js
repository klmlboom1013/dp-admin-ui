/**
 * Header Loader
 * Dynamically inserts the header HTML into the placeholder div.
 * Requires: <div id="header-container"></div> in HTML.
 */

const headerContent = `
<nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary sticky-top">
    <div class="container-fluid px-4">
        <a class="navbar-brand fw-bold" href="./dashboard.html">
            <i class="bi bi-rocket-takeoff-fill me-2"></i>Deploy System
        </a>
        <div class="d-flex align-items-center text-white gap-3">
            <!-- Context Simulator (Hidden by default, enable via JS for specific pages) -->
            <div id="headerSimulatorContainer" class="d-flex align-items-center d-none">
                <small class="text-white-50 me-2">Simulator:</small>
                <select class="form-select form-select-sm bg-dark text-white border-secondary"
                    id="userContextSelect" style="width: 150px;">
                    <option value="admin">Admin (Top)</option>
                    <option value="master">User (Master)</option>
                    <option value="report">User (Report)</option>
                </select>
                <div class="vr bg-secondary ms-3"></div>
            </div>

            <!-- Current User Display -->
            <small class="me-3" id="currentUserDisplay">Admin (김관리)</small>
            <a href="./login.html" class="btn btn-sm btn-outline-light">Logout</a>
        </div>
    </div>
</nav>
`;

function loadHeader() {
    const container = document.getElementById('header-container');
    if (container) {
        container.innerHTML = headerContent;

        // If the page has defined a global config to show simulator, do it here?
        // Or let the page script handle it.
        // Let's check for a data-attribute on the container.
        if (container.dataset.showSimulator === 'true') {
            const sim = document.getElementById('headerSimulatorContainer');
            if (sim) sim.classList.remove('d-none');
        }

    } else {
        console.error("Header container not found!");
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeader);
} else {
    loadHeader();
}
