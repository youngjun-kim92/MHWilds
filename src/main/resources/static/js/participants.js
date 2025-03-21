/**
 * 참가자 제비뽑기 기능 구현
 */
document.addEventListener('DOMContentLoaded', function() {
    // 필요한 요소 참조
    const participantNameInput = document.getElementById('participantNameInput');
    const addParticipantBtn = document.getElementById('addParticipantBtn');
    const clearParticipantsBtn = document.getElementById('clearParticipantsBtn');
    const participantsList = document.getElementById('participantsList');
    const emptyParticipantMessage = document.getElementById('emptyParticipantMessage');
    const participantCountBadge = document.getElementById('participantCountBadge');
    const startDrawBtn = document.getElementById('startDrawBtn');
    const resetDrawBtn = document.getElementById('resetDrawBtn');
    const drawResults = document.getElementById('drawResults');
    const groupResults = document.getElementById('groupResults');
    const drawingOverlay = document.getElementById('drawingOverlay');
    const shareToDiscordCheckbox = document.getElementById('shareLotteryToDiscord');

    // 참가자 배열 초기화
    let participants = [];

    // 제비뽑기 마지막 결과 저장
    let lastDrawResults = null;

    // 로컬 스토리지에서 참가자 불러오기
    loadParticipantsFromStorage();

    // 참가자 추가 버튼 이벤트
    if (addParticipantBtn && participantNameInput) {
        addParticipantBtn.addEventListener('click', function() {
            addParticipant();
        });

        // 엔터 키 이벤트
        participantNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // 폼 제출 방지
                addParticipant();
            }
        });
    }

    // 목록 초기화 버튼 이벤트
    if (clearParticipantsBtn) {
        clearParticipantsBtn.addEventListener('click', function() {
            if (participants.length === 0) {
                return;
            }

            if (confirm('참가자 목록을 모두 지우시겠습니까?')) {
                participants = [];
                updateParticipantsList();
                saveParticipantsToStorage();

                // 토스트 메시지 표시
                showToast('참가자 목록이 초기화되었습니다.');
            }
        });
    }

    // 제비뽑기 시작 버튼 이벤트
    if (startDrawBtn) {
        startDrawBtn.addEventListener('click', function() {
            if (participants.length === 0) {
                alert('참가자가 없습니다. 먼저 참가자를 추가해주세요.');
                participantNameInput.focus();
                return;
            }

            const groupSize = parseInt(document.querySelector('input[name="groupSize"]:checked').value);
            const randomizeGroups = document.getElementById('randomizeGroups').checked;

            startDrawing(groupSize, randomizeGroups);
        });
    }

    // 다시 뽑기 버튼 이벤트
    if (resetDrawBtn) {
        resetDrawBtn.addEventListener('click', function() {
            drawResults.style.display = 'none';

            // 상단으로 스크롤
            window.scrollTo({
                top: document.getElementById('lottery-content').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    }

    /**
     * 참가자 추가 함수
     */
    function addParticipant() {
        const name = participantNameInput.value.trim();

        if (name === '') {
            alert('참가자 이름을 입력해주세요.');
            participantNameInput.focus();
            return;
        }

        // 중복 확인
        if (participants.includes(name)) {
            alert('이미 추가된 참가자입니다.');
            participantNameInput.value = '';
            participantNameInput.focus();
            return;
        }

        // 참가자 추가
        participants.push(name);

        // 입력 필드 초기화
        participantNameInput.value = '';
        participantNameInput.focus();

        // 목록 업데이트
        updateParticipantsList();

        // 로컬 스토리지에 저장
        saveParticipantsToStorage();

        // 토스트 메시지 표시
        showToast(`참가자 '${name}'이(가) 추가되었습니다.`, 'success');
    }

    /**
     * 참가자 목록 업데이트
     */
    function updateParticipantsList() {
        if (!participantsList) return;

        // 목록 초기화
        participantsList.innerHTML = '';

        // 비어있는 메시지 처리
        if (participants.length === 0) {
            participantsList.appendChild(createEmptyMessage());
        } else {
            // 참가자 목록 렌더링
            participants.forEach((name, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

                // 가장 최근 추가된 항목에 애니메이션 효과
                if (index === participants.length - 1) {
                    listItem.classList.add('just-added');
                }

                const nameSpan = document.createElement('span');
                nameSpan.textContent = name;

                const removeBtn = document.createElement('button');
                removeBtn.className = 'btn btn-sm btn-outline-danger';
                removeBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
                removeBtn.title = '참가자 제거';
                removeBtn.setAttribute('data-index', index);
                removeBtn.addEventListener('click', function() {
                    removeParticipant(index);
                });

                listItem.appendChild(nameSpan);
                listItem.appendChild(removeBtn);

                participantsList.appendChild(listItem);
            });
        }

        // 참가자 수 업데이트
        if (participantCountBadge) {
            participantCountBadge.textContent = `참가자 ${participants.length}명`;

            // 참가자 수에 따라 배지 색상 변경
            if (participants.length === 0) {
                participantCountBadge.className = 'badge bg-light text-dark me-2';
            } else {
                participantCountBadge.className = 'badge bg-primary text-white me-2';
            }
        }
    }

    /**
     * 빈 메시지 요소 생성
     */
    function createEmptyMessage() {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'list-group-item text-center text-muted';
        emptyMessage.id = 'emptyParticipantMessage';
        emptyMessage.textContent = '참가자가 없습니다';
        return emptyMessage;
    }

    /**
     * 참가자 제거 함수
     */
    function removeParticipant(index) {
        if (index < 0 || index >= participants.length) return;

        const name = participants[index];
        participants.splice(index, 1);
        updateParticipantsList();
        saveParticipantsToStorage();

        // 토스트 메시지 표시
        showToast(`참가자 '${name}'이(가) 제거되었습니다.`, 'warning');
    }

    /**
     * 로컬 스토리지에 참가자 저장
     */
    function saveParticipantsToStorage() {
        try {
            localStorage.setItem('drawParticipants', JSON.stringify(participants));
        } catch (e) {
            console.error('참가자 저장 중 오류 발생:', e);
        }
    }

    /**
     * 로컬 스토리지에서 참가자 불러오기
     */
    function loadParticipantsFromStorage() {
        try {
            const savedParticipants = localStorage.getItem('drawParticipants');
            if (savedParticipants) {
                participants = JSON.parse(savedParticipants);
                updateParticipantsList();
            }
        } catch (e) {
            console.error('저장된 참가자 목록을 불러오는 중 오류 발생:', e);
            participants = [];
            localStorage.removeItem('drawParticipants');
        }
    }

    /**
     * 제비뽑기 시작
     */
    function startDrawing(groupSize, randomize) {
        // 애니메이션 오버레이 표시
        if (drawingOverlay) {
            drawingOverlay.style.display = 'flex';
        }

        // 약간의 지연 후 결과 표시 (애니메이션 효과)
        setTimeout(() => {
            // 참가자 목록 복사
            let participantsCopy = [...participants];

            // 랜덤 섞기 옵션이 선택된 경우
            if (randomize) {
                shuffleArray(participantsCopy);
            }

            // 그룹으로 나누기
            const groups = divideIntoGroups(participantsCopy, groupSize);

            // 마지막 결과 저장
            lastDrawResults = {
                groups: groups,
                groupSize: groupSize,
                randomized: randomize
            };

            // 결과 표시
            displayResults(groups);

            // 애니메이션 오버레이 숨기기
            if (drawingOverlay) {
                drawingOverlay.style.display = 'none';
            }

            // 토스트 메시지 표시
            showToast(`제비뽑기 완료! ${groups.length}개 그룹으로 나눠졌습니다.`, 'success');

            // 디스코드 공유 체크되어 있으면 자동 공유
            if (shareToDiscordCheckbox && shareToDiscordCheckbox.checked) {
                shareLotteryToDiscord(groups, groupSize, randomize);
            }
        }, 1500);
    }

    /**
     * 배열 랜덤 섞기 (Fisher-Yates 알고리즘)
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * 참가자 그룹으로 나누기
     */
    function divideIntoGroups(participants, groupSize) {
        const groups = [];

        // 참가자를 그룹 크기에 맞게 나누기
        for (let i = 0; i < participants.length; i += groupSize) {
            const group = participants.slice(i, i + groupSize);
            groups.push(group);
        }

        return groups;
    }

    /**
     * 결과 표시
     */
    function displayResults(groups) {
        if (!groupResults || !drawResults) return;

        // 결과 영역 초기화
        groupResults.innerHTML = '';

        // 각 그룹별로 카드 생성
        groups.forEach((group, groupIndex) => {
            const groupCol = document.createElement('div');
            groupCol.className = 'col-md-4 mb-4';

            const groupCard = document.createElement('div');
            groupCard.className = 'card shadow h-100';
            groupCard.style.animation = `fadeIn 0.5s ease forwards ${groupIndex * 0.2}s`;
            groupCard.style.opacity = '0';

            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header bg-primary text-white';
            cardHeader.innerHTML = `<h5 class="mb-0">그룹 ${groupIndex + 1}</h5>`;

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            const membersList = document.createElement('ul');
            membersList.className = 'list-group list-group-flush';

            // 그룹 멤버 추가
            group.forEach((member, memberIndex) => {
                const memberItem = document.createElement('li');
                memberItem.className = 'list-group-item d-flex align-items-center';
                memberItem.style.animation = `fadeIn 0.3s ease forwards ${groupIndex * 0.2 + memberIndex * 0.1}s`;
                memberItem.style.opacity = '0';

                // 멤버 순번과 이름
                memberItem.innerHTML = `
                    <div class="me-3 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style="width: 30px; height: 30px;">
                        ${memberIndex + 1}
                    </div>
                    <span class="fw-bold">${member}</span>
                `;

                membersList.appendChild(memberItem);
            });

            cardBody.appendChild(membersList);
            groupCard.appendChild(cardHeader);
            groupCard.appendChild(cardBody);
            groupCol.appendChild(groupCard);

            groupResults.appendChild(groupCol);
        });

        // 결과 영역 표시
        drawResults.style.display = 'block';

        // 결과 영역으로 스크롤
        drawResults.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * 디스코드에 제비뽑기 결과 공유
     */
    function shareLotteryToDiscord(groups, groupSize, randomized) {
        // 닉네임 가져오기
        const nickname = document.getElementById('nickname') ? document.getElementById('nickname').value.trim() : '';

        // 데이터 준비
        const payload = {
            nickname: nickname || '익명',
            groups: groups,
            groupSize: groupSize,
            randomized: randomized
        };

        // API 호출
        fetch('/api/share-lottery-to-discord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('제비뽑기 결과가 디스코드에 공유되었습니다!', 'primary');
                } else {
                    showToast(`디스코드 공유 실패: ${data.message}`, 'danger');
                }
            })
            .catch(error => {
                console.error('디스코드 공유 오류:', error);
                showToast('디스코드 공유 중 오류가 발생했습니다.', 'danger');
            });
    }

    /**
     * 토스트 메시지 표시
     * @param {string} message 표시할 메시지
     * @param {string} type 메시지 유형 (success, warning, danger, primary, info)
     */
    function showToast(message, type = 'primary') {
        // 토스트 컨테이너 확인 또는 생성
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            toastContainer.style.zIndex = '5';
            document.body.appendChild(toastContainer);
        }

        // 토스트 요소 생성
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        // 토스트 유형에 따른 아이콘과 색상 결정
        let icon, bgColor;
        switch (type) {
            case 'success':
                icon = 'fa-check-circle';
                bgColor = 'bg-success';
                break;
            case 'warning':
                icon = 'fa-exclamation-triangle';
                bgColor = 'bg-warning';
                break;
            case 'danger':
                icon = 'fa-times-circle';
                bgColor = 'bg-danger';
                break;
            case 'primary':
                icon = 'fa-info-circle';
                bgColor = 'bg-primary';
                break;
            default:
                icon = 'fa-info-circle';
                bgColor = 'bg-info';
        }

        // 토스트 내용 설정
        toast.innerHTML = `
            <div class="toast-header ${bgColor} text-white">
                <i class="fa-solid ${icon} me-2"></i>
                <strong class="me-auto">알림</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        // 토스트 컨테이너에 추가
        toastContainer.appendChild(toast);

        // Bootstrap 토스트 초기화 및 표시
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: 3000
        });
        bsToast.show();

        // 자동 제거 (토스트가 사라진 후)
        toast.addEventListener('hidden.bs.toast', function () {
            toast.remove();
        });
    }
});