/**
 * settings.js
 * Manages configuration for System Settings using localStorage
 */

// Keys for localStorage
const STORAGE_KEYS = {
    MENU_PERMS: 'dp_admin_menu_perms',
    AGENT_PERMS: 'dp_admin_agent_perms',
    OPTIONS: 'dp_admin_options'
};

// Default Configuration
const DEFAULTS = {
    menuPerms: {
        'Admin': { dashboard: true, agent: true, agentGroup: true, history: true, user: true },
        'Master': { dashboard: true, agent: true, agentGroup: true, history: true, user: true },
        'Content': { dashboard: true, agent: true, agentGroup: false, history: true, user: false }, // Cannot see Group/User
        'Report': { dashboard: true, agent: true, agentGroup: false, history: true, user: false },
    },
    agentPerms: {
        'Admin': { view: true, edit: true, action: true, bulk: true, prod: true },
        'Master': { view: true, edit: true, action: true, bulk: true, prod: false }, // No PROD
        'Content': { view: true, edit: false, action: true, bulk: false, prod: false }, // Ops specific
        'Report': { view: true, edit: false, action: false, bulk: false, prod: false } // View only
    },
    options: {
        levels: ['Admin', 'Master', 'Content', 'Report'],
        depts: ['Tech1실', 'Tech2실', 'Tech실', 'CTO', '서비스운영팀'],
        groups: ['PD', 'SO', 'QA', 'OP', 'Common']
    }
};

// State
let config = {
    menuPerms: {},
    agentPerms: {},
    options: {}
};

// Config Loading
function loadConfig() {
    const storedMenu = localStorage.getItem(STORAGE_KEYS.MENU_PERMS);
    const storedAgent = localStorage.getItem(STORAGE_KEYS.AGENT_PERMS);
    const storedOptions = localStorage.getItem(STORAGE_KEYS.OPTIONS);

    config.menuPerms = storedMenu ? JSON.parse(storedMenu) : JSON.parse(JSON.stringify(DEFAULTS.menuPerms));
    config.agentPerms = storedAgent ? JSON.parse(storedAgent) : JSON.parse(JSON.stringify(DEFAULTS.agentPerms));
    config.options = storedOptions ? JSON.parse(storedOptions) : JSON.parse(JSON.stringify(DEFAULTS.options));

    // Merge new levels if they exist in options but not in perms (Handling newly added levels)
    config.options.levels.forEach(lvl => {
        if (!config.menuPerms[lvl]) config.menuPerms[lvl] = { dashboard: true, agent: false, agentGroup: false, history: false, user: false };
        if (!config.agentPerms[lvl]) config.agentPerms[lvl] = { view: false, edit: false, action: false, bulk: false, prod: false };
    });

    // --- Data Migration: TopAdmin -> Admin ---
    if (config.options.levels.includes('TopAdmin')) {
        console.log('Migrating TopAdmin to Admin...');

        // 1. Rename in Levels
        const idx = config.options.levels.indexOf('TopAdmin');
        if (idx !== -1) config.options.levels[idx] = 'Admin';

        // 2. Migrate Permissions
        if (config.menuPerms['TopAdmin']) {
            config.menuPerms['Admin'] = config.menuPerms['TopAdmin'];
            delete config.menuPerms['TopAdmin'];
        }
        if (config.agentPerms['TopAdmin']) {
            config.agentPerms['Admin'] = config.agentPerms['TopAdmin'];
            delete config.agentPerms['TopAdmin'];
        }

        // 3. Save immediately
        saveConfigToStorage();
        showToast('시스템 업데이트: 관리자 권한 명칭이 변경되었습니다.', 'info');
    }

    // --- Data Migration: Remove Admin from Groups (System Reserved) ---
    if (config.options.groups && config.options.groups.includes('Admin')) {
        console.log('Removing Admin from Groups (System Reserved)...');
        config.options.groups = config.options.groups.filter(g => g !== 'Admin');
        saveConfigToStorage();
    }
}

// Data Saving
function saveConfigToStorage() {
    localStorage.setItem(STORAGE_KEYS.MENU_PERMS, JSON.stringify(config.menuPerms));
    localStorage.setItem(STORAGE_KEYS.AGENT_PERMS, JSON.stringify(config.agentPerms));
    localStorage.setItem(STORAGE_KEYS.OPTIONS, JSON.stringify(config.options));
}

// --- Render Logic ---

function renderMenuPerms() {
    const tbody = document.getElementById('menuPermsBody');
    tbody.innerHTML = '';

    config.options.levels.forEach(level => {
        // Skip Admin from table (System Reserved)
        if (level === 'Admin') return;

        const isTopAdmin = level === 'Admin';
        const perms = config.menuPerms[level];

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="text-start ps-4 fw-bold">${level}</td>
            <td><input type="checkbox" class="form-check-input perm-checkbox" ${perms.dashboard ? 'checked' : ''} ${isTopAdmin ? 'disabled' : ''} onchange="updatePerm('menu', '${level}', 'dashboard', this.checked)"></td>
            <td><input type="checkbox" class="form-check-input perm-checkbox" ${perms.agent ? 'checked' : ''} ${isTopAdmin ? 'disabled' : ''} onchange="updatePerm('menu', '${level}', 'agent', this.checked)"></td>
            <td><input type="checkbox" class="form-check-input perm-checkbox" ${perms.agentGroup ? 'checked' : ''} ${isTopAdmin ? 'disabled' : ''} onchange="updatePerm('menu', '${level}', 'agentGroup', this.checked)"></td>
            <td><input type="checkbox" class="form-check-input perm-checkbox" ${perms.history ? 'checked' : ''} ${isTopAdmin ? 'disabled' : ''} onchange="updatePerm('menu', '${level}', 'history', this.checked)"></td>
            <td><input type="checkbox" class="form-check-input perm-checkbox" ${perms.user ? 'checked' : ''} ${isTopAdmin ? 'disabled' : ''} onchange="updatePerm('menu', '${level}', 'user', this.checked)"></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderAgentPerms() {
    const tbody = document.getElementById('agentPermsBody');
    tbody.innerHTML = '';

    config.options.levels.forEach(level => {
        // Skip Admin from table (System Reserved)
        if (level === 'Admin') return;

        const isTopAdmin = level === 'Admin';
        const perms = config.agentPerms[level];

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="text-start ps-4 fw-bold">${level}</td>
            <td><input type="checkbox" class="form-check-input perm-checkbox" ${perms.view ? 'checked' : ''} ${isTopAdmin ? 'disabled' : ''} onchange="updatePerm('agent', '${level}', 'view', this.checked)"></td>
            <td><input type="checkbox" class="form-check-input perm-checkbox" ${perms.edit ? 'checked' : ''} ${isTopAdmin ? 'disabled' : ''} onchange="updatePerm('agent', '${level}', 'edit', this.checked)"></td>
            <td><input type="checkbox" class="form-check-input perm-checkbox" ${perms.action ? 'checked' : ''} ${isTopAdmin ? 'disabled' : ''} onchange="updatePerm('agent', '${level}', 'action', this.checked)"></td>
            <td><input type="checkbox" class="form-check-input perm-checkbox" ${perms.bulk ? 'checked' : ''} ${isTopAdmin ? 'disabled' : ''} onchange="updatePerm('agent', '${level}', 'bulk', this.checked)"></td>
            <td><input type="checkbox" class="form-check-input perm-checkbox" ${perms.prod ? 'checked' : ''} ${isTopAdmin ? 'disabled' : ''} onchange="updatePerm('agent', '${level}', 'prod', this.checked)"></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderUserOptions() {
    // Render Levels
    const levelList = document.getElementById('levelList');
    levelList.innerHTML = '';
    config.options.levels.forEach(item => {
        // Skip Admin from list (System Reserved)
        if (item === 'Admin') return;

        const isProtected = ['Admin'].includes(item); // Protect Admin (just in case logic changes)
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <span>${item}</span>
            ${!isProtected ? `<button class="btn btn-sm text-danger" onclick="removeOptionItem('level', '${item}')"><i class="bi bi-x-lg"></i></button>` : '<span class="text-muted small"><i class="bi bi-lock-fill"></i></span>'}
        `;
        levelList.appendChild(li);
    });

    // Render Depts
    const deptList = document.getElementById('deptList');
    deptList.innerHTML = '';
    config.options.depts.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <span>${item}</span>
            <button class="btn btn-sm text-danger" onclick="removeOptionItem('dept', '${item}')"><i class="bi bi-x-lg"></i></button>
        `;
        deptList.appendChild(li);
    });
    // 3. Groups (Account Group)
    const groupList = document.getElementById('groupList');
    groupList.innerHTML = '';

    // Ensure groups exists (migration for existing data)
    if (!config.options.groups) config.options.groups = ['PD', 'SO', 'QA', 'OP', 'Common'];

    config.options.groups.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <span>${item}</span>
            <button class="btn btn-sm text-danger" onclick="removeOptionItem('group', '${item}')"><i class="bi bi-x-lg"></i></button>
        `;
        groupList.appendChild(li);
    });
}

// --- Action Handlers ---

function updatePerm(type, level, key, value) {
    if (type === 'menu') {
        config.menuPerms[level][key] = value;
    } else if (type === 'agent') {
        config.agentPerms[level][key] = value;
    }
}

function saveMenuPerms() {
    saveConfigToStorage();
    showToast('메뉴 접근 권한이 저장되었습니다.', 'success');
}

function saveAgentPerms() {
    saveConfigToStorage();
    showToast('Agent 실행 권한이 저장되었습니다.', 'success');
}

function addOptionItem(type) {
    let typeName;
    if (type === 'level') typeName = '등급';
    else if (type === 'dept') typeName = '소속';
    else if (type === 'group') typeName = '계정 그룹';

    const name = prompt(`추가할 ${typeName} 명을 입력하세요:`);
    if (!name) return;

    let list;
    if (type === 'level') list = config.options.levels;
    else if (type === 'dept') list = config.options.depts;
    else if (type === 'group') list = config.options.groups;
    if (list.includes(name)) {
        showToast('이미 존재하는 항목입니다.', 'warning');
        return;
    }

    list.push(name);

    // If adding level, init perms
    if (type === 'level') {
        config.menuPerms[name] = { dashboard: true, agent: false, agentGroup: false, history: false, user: false };
        config.agentPerms[name] = { view: false, edit: false, action: false, bulk: false, prod: false };
        renderMenuPerms();  // Rerender perms tabs as well
        renderAgentPerms();
    }

    saveConfigToStorage();
    renderUserOptions();
    showToast('항목이 추가되었습니다.', 'success');
}

function removeOptionItem(type, name) {
    showConfirm(`'${name}' 항목을 삭제하시겠습니까?\n이 설정은 즉시 저장됩니다.`, () => {
        let list;
        if (type === 'level') list = config.options.levels;
        else if (type === 'dept') list = config.options.depts;
        else if (type === 'group') list = config.options.groups;

        const index = list.indexOf(name);
        if (index > -1) {
            list.splice(index, 1);

            // Cleanup perms if level removed
            if (type === 'level') {
                delete config.menuPerms[name];
                delete config.agentPerms[name];
                renderMenuPerms();
                renderAgentPerms();
            }

            saveConfigToStorage();
            renderUserOptions();
            showToast('항목이 삭제되었습니다.', 'success');
        }
    });
}

// Init
document.addEventListener("DOMContentLoaded", function () {
    loadConfig();
    renderMenuPerms();
    renderAgentPerms();
    renderUserOptions();
});
