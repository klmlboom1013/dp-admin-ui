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
            <!-- Global Context Simulator -->
            <div id="headerSimulatorContainer" class="d-flex align-items-center">
                <small class="text-white-50 me-2">Simulator:</small>
                <select class="form-select form-select-sm bg-dark text-white border-secondary"
                    id="globalUserContextSelect" style="width: 180px;">
                    <option value="admin">System Admin (Super)</option>
                    <option value="hong.kd">홍길동 (Master/PD)</option>
                    <option value="kim.cs">김철수 (Content/SO)</option>
                    <option value="lee.yh">이영희 (Report/PD)</option>
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

        // Init Simulator
        initSimulator();
    } else {
        console.error("Header container not found!");
    }
}

function initSimulator() {
    const select = document.getElementById('globalUserContextSelect');
    if (!select) return;

    // Load saved context or default to admin
    const savedContext = localStorage.getItem('dp_sim_context_id') || 'admin';
    select.value = savedContext;

    // Initial Trigger
    updateGlobalContext(savedContext);

    // Event Listener
    select.addEventListener('change', (e) => {
        const newValue = e.target.value;
        localStorage.setItem('dp_sim_context_id', newValue);
        updateGlobalContext(newValue);
    });
}

// Mock User Data for Simulation
const MOCK_USERS = {
    'admin': { id: 'admin', name: '김관리', level: 'Admin', group: 'SYSTEM' },
    'hong.kd': { id: 'hong.kd', name: '홍길동', level: 'Master', group: 'PD' },
    'kim.cs': { id: 'kim.cs', name: '김철수', level: 'Content', group: 'SO' },
    'lee.yh': { id: 'lee.yh', name: '이영희', level: 'Report', group: 'PD' }
};

function updateGlobalContext(userId) {
    const user = MOCK_USERS[userId] || MOCK_USERS['admin'];

    // Update Display
    const display = document.getElementById('currentUserDisplay');
    if (display) display.textContent = `${user.level} (${user.name})`;

    // Update Global State (managed in common.js or window)
    window.currentUser = user;

    // Dispatch Custom Event for Pages to Listen
    const event = new CustomEvent('userContextChanged', { detail: user });
    document.dispatchEvent(event);

    // Optional: Log for debugging
    console.log(`[Simulator] Context switched to: ${user.level} (${user.name})`);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeader);
} else {
    loadHeader();
}
