/**
 * Common JS Utilities
 */

// 현재 페이지 URL을 기반으로 사이드바 메뉴 활성화
document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;
    // 파일명만 추출 (예: /agent-list.html -> agent-list.html)
    const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    const navLinks = document.querySelectorAll('.sidebar .nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // href가 ./로 시작하는 경우 처리
        const linkPageName = href.substring(href.lastIndexOf('/') + 1);

        if (pageName === linkPageName || (pageName === '' && linkPageName === 'dashboard.html')) {
            link.classList.add('active');
        }
    });
});

// 간단한 알림 모달 출력 함수
function showToast(message, type = 'info', callback = null) {
    // 1. 모달이 DOM에 없으면 생성
    if (!document.getElementById('commonAlertModal')) {
        const modalHtml = `
        <div class="modal fade" id="commonAlertModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-secondary text-white"> <!-- Default to secondary -->
                        <h5 class="modal-title fw-bold" id="commonAlertTitle">알림</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center py-4">
                        <p class="mb-0 fw-bold" id="commonAlertMessage"></p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">확인</button>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // 2. 메시지 및 스타일 설정
    const modalElement = document.getElementById('commonAlertModal');
    const headerElement = modalElement.querySelector('.modal-header');
    const titleElement = document.getElementById('commonAlertTitle');
    const msgElement = document.getElementById('commonAlertMessage');

    msgElement.textContent = message;

    // type에 따른 헤더 색상 변경 (info, error, success, warning)
    headerElement.className = 'modal-header text-white'; // 초기화
    if (type === 'error') {
        headerElement.classList.add('bg-danger');
        titleElement.innerHTML = '<i class="bi bi-exclamation-octagon-fill me-2"></i>오류';
    } else if (type === 'success') {
        headerElement.classList.add('bg-success');
        titleElement.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>성공';
    } else if (type === 'warning') {
        headerElement.classList.add('bg-warning', 'text-dark');
        headerElement.classList.remove('text-white'); // warning은 검은 글씨가 가독성 좋음 (선택사항)
        titleElement.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i>경고';
    } else {
        // info or request, etc.
        headerElement.classList.add('bg-primary');
        titleElement.innerHTML = '<i class="bi bi-info-circle-fill me-2"></i>알림';
    }

    // 3. Callback 설정 (Optional)
    if (callback) {
        modalElement.addEventListener('hidden.bs.modal', function handler() {
            callback();
            // once: true guarantees it runs only once per show/hide cycle of this specific attachment
        }, { once: true });
    }

    // 4. 모달 표시
    // bootstrap 객체가 없는 경우 대비 (보통 layout에 포함됨)
    if (typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    } else {
        alert(message); // fallback
        if (callback) callback();
    }
}

// 간단한 확인 모달 출력 함수 (Callback 방식)
function showConfirm(message, yesCallback, noCallback) {
    // 1. 모달이 DOM에 없으면 생성
    if (!document.getElementById('commonConfirmModal')) {
        const modalHtml = `
        <div class="modal fade" id="commonConfirmModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title fw-bold" id="commonConfirmTitle"><i class="bi bi-question-circle-fill me-2"></i>확인</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center py-4">
                        <p class="mb-0 fw-bold" id="commonConfirmMessage"></p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal" id="btnConfirmCancel">취소</button>
                        <button type="button" class="btn btn-primary px-4" id="btnConfirmYes">확인</button>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // 2. 메시지 설정
    document.getElementById('commonConfirmMessage').innerHTML = message.replace(/\n/g, '<br>');

    // 3. 이벤트 바인딩 (일회성)
    const btnYes = document.getElementById('btnConfirmYes');
    const btnCancel = document.getElementById('btnConfirmCancel');

    // 기존 리스너 제거 (복제본 생성으로 깨끗하게 처리)
    const newBtnYes = btnYes.cloneNode(true);
    btnYes.parentNode.replaceChild(newBtnYes, btnYes);

    const newBtnCancel = btnCancel.cloneNode(true);
    btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

    // Bootstrap Modal 인스턴스 가져오기 또는 생성
    const modalElement = document.getElementById('commonConfirmModal');
    const modal = new bootstrap.Modal(modalElement);

    // Yes 클릭 시
    newBtnYes.addEventListener('click', function () {
        modal.hide();
        if (yesCallback) yesCallback();
    });

    // Cancel 클릭 시
    newBtnCancel.addEventListener('click', function () {
        // modal.hide()는 data-bs-dismiss로 자동 처리됨
        if (noCallback) noCallback();
    });

    // 4. 모달 표시
    modal.show();
}

function showProdSafetyConfirm(action, agentNames, callback) {
    // Remove existing input confirm modal if any
    const existingModal = document.getElementById('prodSafetyModal');
    if (existingModal) existingModal.remove();

    const namesString = agentNames.join(', ');

    const modalHtml = `
        <div class="modal fade" id="prodSafetyModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title fs-6 fw-bold">
                            <i class="bi bi-shield-exclamation me-2"></i>PROD 안전 확인
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4 text-center">
                        <div class="mb-3 text-warning">
                            <i class="bi bi-exclamation-triangle-fill fs-1"></i>
                        </div>
                        <h6 class="fw-bold mb-3">선택한 에이전트에 [PROD] 서버가 포함되어 있습니다.</h6>
                        <p class="text-secondary small mb-4">
                            실수를 방지하기 위해 영향을 받는 <b>모든</b> PROD 에이전트의 이름을 입력해야 합니다.<br>
                            아래 이름을 정확히 입력하세요. (순서 무관, 콤마로 구분)
                        </p>
                        <div class="alert alert-light border mb-3 fw-bold text-primary text-break">
                            ${namesString}
                        </div>
                        <input type="text" class="form-control text-center mb-3" id="confirmAgentNameInput" placeholder="예: Name1, Name2">
                        <div id="prodConfirmError" class="text-danger small d-none">이름이 일치하지 않습니다. 모든 이름을 정확히 입력해주세요.</div>
                    </div>
                    <div class="modal-footer justify-content-center border-0 pb-4">
                        <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">취소</button>
                        <button type="button" class="btn btn-primary px-4 fw-bold" id="btnConfirmProdAction" disabled>확인</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modalElement = document.getElementById('prodSafetyModal');
    const modal = new bootstrap.Modal(modalElement);
    const input = document.getElementById('confirmAgentNameInput');
    const btnConfirm = document.getElementById('btnConfirmProdAction');
    const errorMsg = document.getElementById('prodConfirmError');

    // Validation Function
    const validateInput = (inputVal) => {
        if (!inputVal) return false;

        // Split by comma and trim whitespace
        const userTokens = inputVal.split(',').map(s => s.trim()).filter(s => s.length > 0);

        // Must match exact count
        if (userTokens.length !== agentNames.length) return false;

        // Check content equality (strict case)
        const requiredSet = new Set(agentNames);
        const userSet = new Set(userTokens);

        if (requiredSet.size !== userSet.size) return false;
        for (let name of userSet) {
            if (!requiredSet.has(name)) return false;
        }

        return true;
    };

    input.addEventListener('input', function () {
        const isValid = validateInput(this.value);
        btnConfirm.disabled = !isValid;
        if (isValid) {
            errorMsg.classList.add('d-none');
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else {
            input.classList.remove('is-valid');
        }
    });

    btnConfirm.addEventListener('click', function () {
        const isValid = validateInput(input.value);
        if (isValid) {
            modal.hide();
            if (callback) callback();
        } else {
            errorMsg.classList.remove('d-none');
            input.classList.add('is-invalid');
        }
    });

    modalElement.addEventListener('hidden.bs.modal', function () {
        modalElement.remove();
    });

    modal.show();
}

/**
 * Admin Menu Visibility Control
 * Applies to elements with class 'menu-admin-only'
 * @param {string} level - User level (e.g., 'TopAdmin', 'Master')
 */
function updateAdminMenuVisibility(level) {
    // If level is not provided, try to use global currentUser
    if (!level && typeof currentUser !== 'undefined') {
        level = currentUser.level;
    }
    // Default to TopAdmin if still unknown (Preserve existing behavior for static pages)
    if (!level) level = 'TopAdmin';

    const items = document.querySelectorAll('.menu-admin-only');
    items.forEach(item => {
        if (level === 'TopAdmin') {
            // Remove inline style to revert to CSS default (usually visible)
            item.style.display = ''; 
        } else {
            item.style.display = 'none';
        }
    });
}
