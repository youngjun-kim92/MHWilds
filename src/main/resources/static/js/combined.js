/**
 * 통합 제비뽑기 기능
 * 기존 제비뽑기와 가챠 시스템을 결합한 기능입니다.
 */
document.addEventListener('DOMContentLoaded', function() {
    // 통합 제비뽑기 요소 참조
    const combinedParticipantInput = document.getElementById('combinedParticipantInput');
    const addCombinedParticipantBtn = document.getElementById('addCombinedParticipantBtn');
    const clearCombinedParticipantsBtn = document.getElementById('clearCombinedParticipantsBtn');
    const combinedParticipantsList = document.getElementById('combinedParticipantsList');
    const emptyCombinedParticipantMessage = document.getElementById('emptyCombinedParticipantMessage');
    const combinedParticipantCountBadge = document.getElementById('combinedParticipantCountBadge');
    const startCombinedDrawBtn = document.getElementById('startCombinedDrawBtn');
    const resetCombinedDrawBtn = document.getElementById('resetCombinedDrawBtn');
    const combinedDrawResults = document.getElementById('combinedDrawResults');
    const combinedGroupResults = document.getElementById('combinedGroupResults');

    // 설정 체크박스들
    const includeMonsterInCombined = document.getElementById('includeMonsterInCombined');
    const includeWeaponInCombined = document.getElementById('includeWeaponInCombined');
    const includeArmorInCombined = document.getElementById('includeArmorInCombined');
    const shareCombinedToDiscord = document.getElementById('shareCombinedToDiscord');
    const randomizeCombinedGroups = document.getElementById('randomizeCombinedGroups');

    // 참가자 배열 초기화
    let combinedParticipants = [];

    // 마지막 결과 저장
    let lastCombinedResults = null;

    // 초기화
    initCombinedTab();

    /**
     * 통합 제비뽑기 탭 초기화
     */
    function initCombinedTab() {
        if (!combinedParticipantInput) return;

        // 로컬 스토리지에서 참가자 불러오기
        loadCombinedParticipantsFromStorage();

        // 참가자 추가 버튼 이벤트
        addCombinedParticipantBtn.addEventListener('click', addCombinedParticipant);

        // 엔터 키 이벤트
        combinedParticipantInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addCombinedParticipant();
            }
        });

        // 목록 초기화 버튼 이벤트
        clearCombinedParticipantsBtn.addEventListener('click', function() {
            if (combinedParticipants.length === 0) return;

            if (confirm('참가자 목록을 모두 지우시겠습니까?')) {
                combinedParticipants = [];
                updateCombinedParticipantsList();
                saveCombinedParticipantsToStorage();
                showToast('참가자 목록이 초기화되었습니다.');
            }
        });

        // 통합 제비뽑기 시작 버튼 이벤트
        startCombinedDrawBtn.addEventListener('click', function() {
            if (combinedParticipants.length === 0) {
                alert('참가자가 없습니다. 먼저 참가자를 추가해주세요.');
                combinedParticipantInput.focus();
                return;
            }

            startCombinedDrawing();
        });

        // 다시 뽑기 버튼 이벤트
        resetCombinedDrawBtn.addEventListener('click', function() {
            combinedDrawResults.style.display = 'none';
            window.scrollTo({
                top: document.getElementById('combined-content').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    }

    /**
     * 참가자 추가
     */
    function addCombinedParticipant() {
        const name = combinedParticipantInput.value.trim();

        if (name === '') {
            alert('참가자 이름을 입력해주세요.');
            combinedParticipantInput.focus();
            return;
        }

        // 중복 확인
        if (combinedParticipants.includes(name)) {
            alert('이미 추가된 참가자입니다.');
            combinedParticipantInput.value = '';
            combinedParticipantInput.focus();
            return;
        }

        // 참가자 추가
        combinedParticipants.push(name);

        // 입력 필드 초기화
        combinedParticipantInput.value = '';
        combinedParticipantInput.focus();

        // 목록 업데이트
        updateCombinedParticipantsList();

        // 로컬 스토리지에 저장
        saveCombinedParticipantsToStorage();

        showToast(`참가자 '${name}'이(가) 추가되었습니다.`, 'success');
    }

    /**
     * 참가자 목록 업데이트
     */
    function updateCombinedParticipantsList() {
        if (!combinedParticipantsList) return;

        // 목록 초기화
        combinedParticipantsList.innerHTML = '';

        // 비어있는 메시지 처리
        if (combinedParticipants.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'list-group-item text-center text-muted';
            emptyMessage.id = 'emptyCombinedParticipantMessage';
            emptyMessage.textContent = '참가자가 없습니다';
            combinedParticipantsList.appendChild(emptyMessage);
        } else {
            // 참가자 목록 렌더링
            combinedParticipants.forEach((name, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

                // 가장 최근 추가된 항목에 애니메이션 효과
                if (index === combinedParticipants.length - 1) {
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
                    removeCombinedParticipant(index);
                });

                listItem.appendChild(nameSpan);
                listItem.appendChild(removeBtn);

                combinedParticipantsList.appendChild(listItem);
            });
        }

        // 참가자 수 업데이트
        if (combinedParticipantCountBadge) {
            combinedParticipantCountBadge.textContent = `참가자 ${combinedParticipants.length}명`;

            // 참가자 수에 따라 배지 색상 변경
            if (combinedParticipants.length === 0) {
                combinedParticipantCountBadge.className = 'badge bg-light text-dark me-2';
            } else {
                combinedParticipantCountBadge.className = 'badge bg-primary text-white me-2';
            }
        }
    }

    /**
     * 참가자 제거
     */
    function removeCombinedParticipant(index) {
        if (index < 0 || index >= combinedParticipants.length) return;

        const name = combinedParticipants[index];
        combinedParticipants.splice(index, 1);
        updateCombinedParticipantsList();
        saveCombinedParticipantsToStorage();

        showToast(`참가자 '${name}'이(가) 제거되었습니다.`, 'warning');
    }

    /**
     * 로컬 스토리지에 참가자 저장
     */
    function saveCombinedParticipantsToStorage() {
        try {
            localStorage.setItem('combinedParticipants', JSON.stringify(combinedParticipants));
        } catch (e) {
            console.error('참가자 저장 중 오류 발생:', e);
        }
    }

    /**
     * 로컬 스토리지에서 참가자 불러오기
     */
    function loadCombinedParticipantsFromStorage() {
        try {
            const savedParticipants = localStorage.getItem('combinedParticipants');
            if (savedParticipants) {
                combinedParticipants = JSON.parse(savedParticipants);
                updateCombinedParticipantsList();
            }
        } catch (e) {
            console.error('참가자 불러오기 중 오류 발생:', e);
            combinedParticipants = [];
        }
    }

    /**
     * 서버에서 가챠 설정 가져오기 (실시간)
     */
    async function fetchGachaSettings() {
        try {
            // API 엔드포인트 호출
            const response = await fetch('/api/settings/gacha');
            if (!response.ok) {
                throw new Error('서버에서 설정을 가져오는데 실패했습니다');
            }
            const settings = await response.json();

            // 설정 로깅
            console.log('서버에서 가챠 설정 로드됨:', settings);
            return settings;
        } catch (error) {
            console.error('가챠 설정 가져오기 실패:', error);
            // 오류 발생 시 기본값 반환
            return {
                luckyChance: 0.01, // 기본 1% 확률
                defaultHighRankCount: 1,
                specialHighRankCount: 2,
                specialMonsters: ['TRUE_DAHARD', 'ALSUVERDE', 'GORE_MAGALA', 'RADAU', 'WOODTUNA']
            };
        }
    }

    /**
     * 통합 제비뽑기 시작
     */
    async function startCombinedDrawing() {
        // 애니메이션 오버레이 표시
        const drawingOverlay = document.getElementById('drawingOverlay');
        if (drawingOverlay) {
            drawingOverlay.style.display = 'flex';
        }

        // 그룹 크기 가져오기
        const groupSize = parseInt(document.querySelector('input[name="combinedGroupSize"]:checked').value);

        // 옵션 가져오기
        const randomize = randomizeCombinedGroups.checked;
        const includeMonster = includeMonsterInCombined.checked;
        const includeWeapon = includeWeaponInCombined.checked;
        const includeArmor = includeArmorInCombined.checked;

        // 서버에서 가챠 설정 가져오기
        const gachaSettings = await fetchGachaSettings();

        // 약간의 지연 후 결과 표시 (애니메이션 효과)
        setTimeout(() => {
            // 참가자 복사
            let participantsCopy = [...combinedParticipants];

            // 랜덤 섞기
            if (randomize) {
                shuffleArray(participantsCopy);
            }

            // 그룹으로 나누기
            const groups = [];
            for (let i = 0; i < participantsCopy.length; i += groupSize) {
                const groupMembers = participantsCopy.slice(i, i + groupSize);

                // 그룹별 공통 가챠 결과
                const commonResults = {};

                // 몬스터 결과 (그룹 공통)
                if (includeMonster) {
                    commonResults.monster = window.getRandomMonster ?
                        window.getRandomMonster() : getRandomMonsterFallback();
                }

                // 그룹 생성
                const group = {
                    members: groupMembers,
                    commonResults: commonResults,
                    memberResults: [] // 개인별 결과 저장 배열
                };

                // 개인별 가챠 결과 생성
                groupMembers.forEach(member => {
                    const memberResult = {};

                    // 개인별 무기 결과
                    if (includeWeapon) {
                        memberResult.weapon = window.getRandomWeapon ?
                            window.getRandomWeapon() : getRandomWeaponFallback();
                    }

                    // 개인별 방어구 결과 (몬스터 영향 적용)
                    if (includeArmor) {
                        // 몬스터가 있으면 영향 반영
                        if (window.getRandomArmor) {
                            const monster = includeMonster ? commonResults.monster : null;
                            const result = window.getRandomArmor(monster);
                            memberResult.armor = result.armorSet;
                            memberResult.isLucky = result.isLucky;
                        } else {
                            const result = getRandomArmorFallback(commonResults.monster, gachaSettings);
                            memberResult.armor = result.armorSet;
                            memberResult.isLucky = result.isLucky;
                        }
                    }

                    // 참가자 이름과 함께 결과 저장
                    group.memberResults.push({
                        name: member,
                        results: memberResult
                    });
                });

                groups.push(group);
            }

            // 결과 저장
            lastCombinedResults = {
                groups: groups,
                groupSize: groupSize,
                randomized: randomize,
                includeMonster: includeMonster,
                includeWeapon: includeWeapon,
                includeArmor: includeArmor
            };

            // 결과 표시
            displayCombinedResults(groups);

            // 애니메이션 오버레이 숨기기
            if (drawingOverlay) {
                drawingOverlay.style.display = 'none';
            }

            // 결과 영역으로 스크롤
            combinedDrawResults.scrollIntoView({ behavior: 'smooth' });

            // 토스트 메시지 표시
            showToast(`통합 제비뽑기 완료! ${groups.length}개 그룹으로 나눠졌습니다.`, 'success');

            // 디스코드 공유
            if (shareCombinedToDiscord.checked) {
                shareCombinedResultsToDiscord(groups);
            }
        }, 1500);
    }

    /**
     * 통합 제비뽑기 결과 표시 (개인별 무기/방어구 표시 - 향상된 스타일)
     */
    function displayCombinedResults(groups) {
        if (!combinedGroupResults || !combinedDrawResults) return;

        // 결과 영역 초기화
        combinedGroupResults.innerHTML = '';

        // 럭키 플레이어가 있는지 확인
        let hasLuckyPlayer = false;

        // 각 그룹별로 카드 생성
        groups.forEach((group, groupIndex) => {
            const groupCol = document.createElement('div');
            groupCol.className = 'col-md-12 mb-4';

            const groupCard = document.createElement('div');
            groupCard.className = 'card shadow h-100';

            // 카드 헤더
            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center';
            cardHeader.innerHTML = `
            <h5 class="mb-0"><i class="fa-solid fa-users me-2"></i>그룹 ${groupIndex + 1}</h5>
            <span class="badge bg-light text-dark">${group.members.length}명</span>
        `;

            // 카드 바디
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            // 공통 몬스터 정보 (그룹 전체)
            if (group.commonResults.monster) {
                const monsterDiv = document.createElement('div');
                monsterDiv.className = 'mb-4';

                // 몬스터 정보 카드
                const monsterCard = document.createElement('div');
                monsterCard.className = 'card bg-warning bg-opacity-10 border-warning';

                // 몬스터 카드 헤더
                const monsterHeader = document.createElement('div');
                monsterHeader.className = 'card-header bg-warning text-white';
                monsterHeader.innerHTML = `
                <h6 class="mb-0"><i class="fa-solid fa-dragon me-2"></i>그룹 몬스터</h6>
            `;

                // 몬스터 카드 바디
                const monsterBody = document.createElement('div');
                monsterBody.className = 'card-body text-center';

                // 몬스터 이미지 (있는 경우)
                const imagePath = `/img/monsters/${group.commonResults.monster.name}.webp`;
                monsterBody.innerHTML = `
                <h4 class="text-warning my-3">${group.commonResults.monster.korName}</h4>
                <img src="${imagePath}" class="img-fluid rounded mb-2" style="max-height: 150px;" 
                     onerror="this.onerror=null; this.src='/img/monsters/default.webp'; this.style.opacity=0.5;" 
                     alt="${group.commonResults.monster.korName}">
            `;

                // 몬스터 카드 조립
                monsterCard.appendChild(monsterHeader);
                monsterCard.appendChild(monsterBody);
                monsterDiv.appendChild(monsterCard);
                cardBody.appendChild(monsterDiv);
            }

            // 참가자 섹션 헤더
            const membersSectionHeader = document.createElement('h6');
            membersSectionHeader.className = 'mb-3 border-bottom pb-2';
            membersSectionHeader.innerHTML = '<i class="fa-solid fa-users-gear me-2"></i>참가자 결과';
            cardBody.appendChild(membersSectionHeader);

            // 개인별 결과 섹션 생성
            const membersResultsDiv = document.createElement('div');
            membersResultsDiv.className = 'row g-3';

            // 각 멤버별 결과 카드 생성
            group.memberResults.forEach((memberResult, memberIndex) => {
                const memberCol = document.createElement('div');
                memberCol.className = 'col-md-6 mb-3';

                const memberCard = document.createElement('div');
                memberCard.className = 'card h-100 border-primary';

                // 럭키 멤버 여부 확인 및 스타일 적용
                const isLuckyMember = memberResult.results.isLucky;
                if (isLuckyMember) {
                    memberCard.classList.add('lucky-member-card');
                    hasLuckyPlayer = true;
                }

                // 멤버 카드 헤더
                const memberHeader = document.createElement('div');
                memberHeader.className = 'card-header bg-primary bg-gradient text-white d-flex align-items-center';
                memberHeader.innerHTML = `
                <div class="me-3 rounded-circle bg-light text-primary d-flex align-items-center justify-content-center" 
                     style="width: 30px; height: 30px; font-weight: bold;">
                    ${memberIndex + 1}
                </div>
                <h6 class="mb-0">${memberResult.name}</h6>
            `;

                // 멤버 카드 바디
                const memberBody = document.createElement('div');
                memberBody.className = 'card-body pb-0';

                // 무기 결과
                if (memberResult.results.weapon) {
                    const weaponDiv = document.createElement('div');
                    weaponDiv.className = 'mb-3';

                    // 무기 카드
                    const weaponCard = document.createElement('div');
                    weaponCard.className = 'card bg-primary bg-opacity-10 mb-3';

                    // 무기 이미지 경로
                    const weaponImagePath = `/img/weapons/${memberResult.results.weapon.name}.jpg`;

                    // 무기 카드 내용
                    weaponCard.innerHTML = `
                    <div class="card-header bg-primary text-white">
                        <h6 class="mb-0"><i class="fa-solid fa-khanda me-2"></i>무기</h6>
                    </div>
                    <div class="card-body p-2 text-center">
                        <div class="display-6 text-primary my-2">${memberResult.results.weapon.korName}</div>
                        <img src="${weaponImagePath}" class="img-fluid rounded mb-2" style="max-height: 100px;" 
                             onerror="this.onerror=null; this.src='/img/weapons/default.jpg'; this.style.opacity=0.5;" 
                             alt="${memberResult.results.weapon.korName}">
                    </div>
                `;

                    weaponDiv.appendChild(weaponCard);
                    memberBody.appendChild(weaponDiv);
                }

                // 방어구 결과
                if (memberResult.results.armor) {
                    const armorDiv = document.createElement('div');
                    armorDiv.className = 'mb-3 armor-piece-container';

                    if (isLuckyMember) {
                        armorDiv.classList.add('lucky-armor');
                    }

                    // 방어구 카드
                    const armorCard = document.createElement('div');
                    armorCard.className = 'card bg-success bg-opacity-10';

                    // 방어구 카드 헤더
                    const armorHeader = document.createElement('div');
                    armorHeader.className = 'card-header bg-success text-white d-flex justify-content-between align-items-center';
                    armorHeader.innerHTML = `
                    <h6 class="mb-0"><i class="fa-solid fa-shield-halved me-2"></i>방어구</h6>
                    <span class="badge bg-light text-success">호프셋</span>
                `;

                    // 방어구 카드 바디
                    const armorBody = document.createElement('div');
                    armorBody.className = 'card-body p-2';

                    const isLucky = memberResult.results.isLucky;

                    if (isLucky) {
                        // 럭키 효과 표시
                        armorBody.innerHTML = `
                        <div class="text-center py-3">
                            <i class="fa-solid fa-star text-warning" style="font-size: 2rem;"></i>
                            <h5 class="text-warning mt-2">✨ 럭키! ✨</h5>
                            <p class="mb-0">원하는 방어구를 선택할 수 있습니다</p>
                        </div>
                    `;
                    } else {
                        // 방어구 부위별 목록 생성
                        const armorList = document.createElement('div');
                        armorList.className = 'armor-parts-container';

                        // 부위별 매핑
                        const typeMapping = {
                            'HEAD': { name: '투구', icon: 'fa-helmet-safety' },
                            'CHEST': { name: '갑옷', icon: 'fa-shirt' },
                            'ARM': { name: '팔보호구', icon: 'fa-hand' },
                            'WAIST': { name: '허리보호구', icon: 'fa-circle-dot' },
                            'LEG': { name: '다리보호구', icon: 'fa-socks' }
                        };

                        // 각 부위별 방어구 정보
                        Object.entries(memberResult.results.armor).forEach(([type, rank]) => {
                            if (!typeMapping[type]) return;

                            const armorPartDiv = document.createElement('div');
                            armorPartDiv.className = 'armor-part';

                            // 아이콘 부분
                            const iconDiv = document.createElement('div');
                            iconDiv.className = 'armor-icon';
                            iconDiv.innerHTML = `<i class="fa-solid ${typeMapping[type].icon}"></i>`;

                            // 정보 부분
                            const infoDiv = document.createElement('div');
                            infoDiv.className = 'armor-info';

                            // 이름 부분
                            const nameDiv = document.createElement('div');
                            nameDiv.className = 'armor-name';
                            nameDiv.textContent = typeMapping[type].name;

                            // 등급 컨테이너
                            const rankContainerDiv = document.createElement('div');
                            rankContainerDiv.className = 'armor-rank-container';

                            // 호프셋 배지
                            const hopsetBadge = document.createElement('div');
                            hopsetBadge.className = 'hopset-badge';
                            hopsetBadge.textContent = '호프셋';

                            // 등급 표시
                            const rankDiv = document.createElement('div');
                            rankDiv.className = 'armor-rank';
                            rankDiv.textContent = rank.korName;

                            // 상위 등급 스타일 적용
                            if (rank.name === 'HIGH_RANK') {
                                rankDiv.classList.add('high-rank');
                            }

                            // 등급 컨테이너에 배지와 등급 추가
                            rankContainerDiv.appendChild(hopsetBadge);
                            rankContainerDiv.appendChild(rankDiv);

                            // 정보에 이름과 등급 컨테이너 추가
                            infoDiv.appendChild(nameDiv);
                            infoDiv.appendChild(rankContainerDiv);

                            // 전체 요소 조립
                            armorPartDiv.appendChild(iconDiv);
                            armorPartDiv.appendChild(infoDiv);

                            // 목록에 추가
                            armorList.appendChild(armorPartDiv);
                        });

                        armorBody.appendChild(armorList);
                    }

                    // 방어구 카드 조립
                    armorCard.appendChild(armorHeader);
                    armorCard.appendChild(armorBody);
                    armorDiv.appendChild(armorCard);
                    memberBody.appendChild(armorDiv);
                }

                // 멤버 카드 조립
                memberCard.appendChild(memberHeader);
                memberCard.appendChild(memberBody);
                memberCol.appendChild(memberCard);

                membersResultsDiv.appendChild(memberCol);
            });

            cardBody.appendChild(membersResultsDiv);

            // 카드 조립
            groupCard.appendChild(cardHeader);
            groupCard.appendChild(cardBody);
            groupCol.appendChild(groupCard);

            // 결과에 추가
            combinedGroupResults.appendChild(groupCol);
        });

        // 결과 표시
        combinedDrawResults.style.display = 'block';
    }

    /**
     * 디스코드에 통합 제비뽑기 결과 공유
     */
    function shareCombinedResultsToDiscord(groups) {
        // 데이터 준비
        const payload = {
            type: 'combined',
            groups: groups,
            timestamp: new Date().toISOString()
        };

        // API 호출
        fetch('/api/share-combined-to-discord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('통합 제비뽑기 결과가 디스코드에 공유되었습니다!', 'primary');
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
     * 방어구 타입 이름 가져오기
     */
    function getArmorTypeName(armorType) {
        const armorTypeNames = {
            'HEAD': '투구',
            'CHEST': '갑옷',
            'ARM': '팔보호구',
            'WAIST': '허리보호구',
            'LEG': '다리보호구'
        };

        return armorTypeNames[armorType] || armorType;
    }

    /**
     * 토스트 메시지 표시
     */
    function showToast(message, type = 'primary') {
        // 기존에 정의된 함수가 있으면 사용
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
            return;
        }

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

    /**
     * 대체 함수: 기존 함수가 없을 경우 사용할 몬스터 선택 함수
     */
    function getRandomMonsterFallback() {
        // 간단한 몬스터 목록
        const fallbackMonsters = [
            { name: 'CHATAKABURA', korName: '차타카브라' },
            { name: 'KEMATRICE', korName: '케마트리스' },
            { name: 'LAVASIOTH', korName: '라바라 바리나' },
            { name: 'BABAKONGA', korName: '바바콩가' },
            { name: 'BALAHARAH', korName: '발라하라' },
            { name: 'DODOGAMA', korName: '도샤구마' },
            { name: 'WOODTUNA', korName: '우드투나' },
            { name: 'RADAU', korName: '레 다우' },
            { name: 'GORE_MAGALA', korName: '고어 마가라' },
            { name: 'ALSUVERDE', korName: '알슈베르도' }
        ];

        // 랜덤 선택
        return fallbackMonsters[Math.floor(Math.random() * fallbackMonsters.length)];
    }

    /**
     * 대체 함수: 기존 함수가 없을 경우 사용할 무기 선택 함수
     */
    function getRandomWeaponFallback() {
        // 간단한 무기 목록
        const fallbackWeapons = [
            { name: 'GREAT_SWORD', korName: '대검' },
            { name: 'LONG_SWORD', korName: '태도' },
            { name: 'SWORD_AND_SHIELD', korName: '한손검' },
            { name: 'DUAL_BLADES', korName: '쌍검' },
            { name: 'HAMMER', korName: '해머' },
            { name: 'HUNTING_HORN', korName: '수렵피리' },
            { name: 'LANCE', korName: '랜스' },
            { name: 'GUNLANCE', korName: '건랜스' },
            { name: 'SWITCH_AXE', korName: '슬래시액스' },
            { name: 'CHARGE_BLADE', korName: '차지액스' },
            { name: 'INSECT_GLAIVE', korName: '조충곤' },
            { name: 'LIGHT_BOWGUN', korName: '라이트보우건' },
            { name: 'HEAVY_BOWGUN', korName: '헤비보우건' },
            { name: 'BOW', korName: '활' }
        ];

        // 랜덤 선택
        return fallbackWeapons[Math.floor(Math.random() * fallbackWeapons.length)];
    }

    /**
     * 대체 함수: 기존 함수가 없을 경우 사용할 방어구 선택 함수
     */
    function getRandomArmorFallback(monster = null, settings = null) {
        // 결과 객체 초기화
        const armorSet = {};

        // 설정이 없으면 기본값 사용
        if (!settings) {
            settings = {
                luckyChance: 0.01, // 기본 1% 확률
                defaultHighRankCount: 1,
                specialHighRankCount: 2,
                specialMonsters: ['TRUE_DAHARD', 'ALSUVERDE', 'GORE_MAGALA', 'RADAU', 'WOODTUNA']
            };
        }

        // 럭키 효과는 설정된 확률로 발동
        let isLucky = Math.random() <= settings.luckyChance;

        // 럭키 효과 확인
        if (isLucky) {
            console.log("럭키 효과 발동! - getRandomArmorFallback");

            // 럭키 효과 애니메이션 표시
            if (typeof window.showLuckyEffect === 'function') {
                setTimeout(() => {
                    window.showLuckyEffect();
                }, 100);
            }
        }

        // 특별 몬스터 목록 (서버 설정에서 가져옴)
        const specialMonsters = settings.specialMonsters || ['TRUE_DAHARD', 'ALSUVERDE', 'GORE_MAGALA', 'RADAU', 'WOODTUNA'];

        // 몬스터가 선택되었는지 확인
        const hasSelectedMonster = monster !== null;

        // 특별 몬스터인지 확인
        const isSpecialMonster = hasSelectedMonster && specialMonsters.includes(monster.name);

        // 기본 상위 방어구 개수 결정
        let baseHighRankCount = 0;
        if (hasSelectedMonster) {
            if (isSpecialMonster) {
                // 특별 몬스터: 서버 설정값 사용
                baseHighRankCount = settings.specialHighRankCount || 2;
            } else {
                // 일반 몬스터: 서버 설정값 사용
                baseHighRankCount = settings.defaultHighRankCount || 1;
            }
        }

        // 방어구 등급 정의
        const armorRanks = [
            { name: 'LOW_RANK', korName: '하위' },
            { name: 'HIGH_RANK', korName: '상위' }
        ];

        // 방어구 부위 목록
        const armorTypes = ['HEAD', 'CHEST', 'ARM', 'WAIST', 'LEG'];

        if (isLucky) {
            // 럭키 효과 - 모든 부위 상위 등급
            for (const type of armorTypes) {
                armorSet[type] = armorRanks[1]; // 상위 등급
            }
        } else {
            // 기본적으로 모든 부위를 하위 등급으로 설정
            for (const type of armorTypes) {
                armorSet[type] = armorRanks[0]; // 하위 등급
            }

            // 상위 등급 적용 (랜덤하게 부위 선택)
            if (baseHighRankCount > 0) {
                // 부위를 랜덤으로 섞기
                const shuffledTypes = [...armorTypes];
                shuffleArray(shuffledTypes);

                // 필요한 수만큼 상위 등급으로 변경
                for (let i = 0; i < baseHighRankCount && i < shuffledTypes.length; i++) {
                    armorSet[shuffledTypes[i]] = armorRanks[1]; // 상위 등급
                }

                // 추가 상위 등급 부위 (각 부위당 10% 확률)
                for (let i = baseHighRankCount; i < shuffledTypes.length; i++) {
                    if (Math.random() <= 0.1) {
                        armorSet[shuffledTypes[i]] = armorRanks[1]; // 상위 등급
                    }
                }
            }
        }

        // 결과 로그
        const highCount = Object.values(armorSet).filter(rank => rank.name === 'HIGH_RANK').length;
        const lowCount = Object.values(armorSet).filter(rank => rank.name === 'LOW_RANK').length;
        console.log(`방어구 구성: 상위 ${highCount}개, 하위 ${lowCount}개, 럭키: ${isLucky}`);
        console.log(`럭키 확률: ${settings.luckyChance * 100}%, 몬스터 선택됨: ${hasSelectedMonster}, 특별 몬스터: ${isSpecialMonster}`);

        return {
            armorSet: armorSet,
            isLucky: isLucky
        };
    }

    // 개발용: 럭키 모드 테스트 함수
    window.testCombinedLuckyMode = async function() {
        console.log('통합 제비뽑기 럭키 모드 테스트');

        // 테스트용 세팅
        const testSettings = {
            luckyChance: 1.0, // 100% 확률로 설정
            defaultHighRankCount: 1,
            specialHighRankCount: 2,
            specialMonsters: ['TRUE_DAHARD', 'ALSUVERDE', 'GORE_MAGALA', 'RADAU', 'WOODTUNA']
        };

        // 임의의 몬스터 선택
        const testMonster = getRandomMonsterFallback();

        // 럭키 방어구 생성 (강제 적용)
        const result = getRandomArmorFallback(testMonster, testSettings);

        alert('통합 제비뽑기 럭키 테스트가 실행되었습니다. 콘솔을 확인하세요.');

        return result;
    };

    // window 객체에 함수 노출 (다른 스크립트에서 필요할 경우)
    window.combinedShowToast = showToast;
    window.getRandomArmorFallbackCombined = getRandomArmorFallback;
});

/**
 * 럭키 효과 처리를 위한 함수
 */
function showLuckyEffect() {
    console.log("럭키 효과 애니메이션 시작!");

    // 1. 화면에 럭키 효과 오버레이 생성
    const luckyOverlay = document.createElement('div');
    luckyOverlay.className = 'lucky-overlay';
    luckyOverlay.innerHTML = `
        <div class="lucky-content">
            <div class="lucky-icon">🎉</div>
            <div class="lucky-title">LUCKY!</div>
            <div class="lucky-message">이게 걸리네🤣👍</div>
        </div>
    `;
    document.body.appendChild(luckyOverlay);

    // 2. 오버레이 애니메이션 설정
    setTimeout(() => {
        luckyOverlay.classList.add('show');

        // 3. 반짝이는 효과 생성 (30개의 별)
        for (let i = 0; i < 30; i++) {
            createStar(luckyOverlay);
        }

        // 4. 폭죽 효과 추가
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                createFirework(luckyOverlay);
            }, i * 300);
        }

        // 5. 일정 시간 후 오버레이 제거
        setTimeout(() => {
            luckyOverlay.classList.remove('show');
            setTimeout(() => {
                try {
                    document.body.removeChild(luckyOverlay);
                } catch (e) {
                    console.log("오버레이 제거 중 오류 발생", e);
                }
            }, 600);
        }, 3500);
    }, 100);

    // 6. 방어구 항목에 반짝이는 효과 추가
    const armorElements = document.querySelectorAll('.armor-piece');
    armorElements.forEach(element => {
        element.classList.add('lucky-highlight');
        setTimeout(() => {
            element.classList.remove('lucky-highlight');
        }, 4000);
    });
}

// 반짝이는 별 효과 생성 함수
function createStar(container) {
    const star = document.createElement('div');
    star.className = 'lucky-star';

    // 랜덤 위치 설정
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const size = Math.random() * 20 + 10;
    const duration = Math.random() * 2 + 1;
    const delay = Math.random() * 1.5;

    star.style.left = `${left}%`;
    star.style.top = `${top}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDuration = `${duration}s`;
    star.style.animationDelay = `${delay}s`;

    container.appendChild(star);

    // 별 애니메이션 완료 후 제거
    setTimeout(() => {
        try {
            container.removeChild(star);
        } catch (e) {
            // 이미 제거된 경우 무시
        }
    }, (duration + delay) * 1000);
}

// 폭죽 효과 생성 함수
function createFirework(container) {
    const firework = document.createElement('div');
    firework.className = 'lucky-firework';

    // 랜덤 위치 설정
    const left = Math.random() * 80 + 10;
    const top = Math.random() * 80 + 10;

    firework.style.left = `${left}%`;
    firework.style.top = `${top}%`;

    container.appendChild(firework);

    // 폭죽 파티클 생성
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'lucky-particle';

        // 랜덤 각도와 거리
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 60 + 40;
        const duration = Math.random() * 1 + 0.5;
        const delay = Math.random() * 0.2;
        const size = Math.random() * 4 + 2;

        // 랜덤 색상
        const colors = ['#ffff00', '#ff4500', '#00ff00', '#ff00ff', '#00ffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.backgroundColor = color;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
        particle.style.opacity = '0';
        particle.style.transition = `all ${duration}s ease-out ${delay}s`;

        firework.appendChild(particle);

        // 파티클 애니메이션 시작
        setTimeout(() => {
            particle.style.opacity = '1';
        }, 10);

        // 파티클 제거
        setTimeout(() => {
            try {
                firework.removeChild(particle);
            } catch (e) {
                // 이미 제거된 경우 무시
            }
        }, (duration + delay) * 1000);
    }

    // 폭죽 제거
    setTimeout(() => {
        try {
            container.removeChild(firework);
        } catch (e) {
            // 이미 제거된 경우 무시
        }
    }, 2000);
}

// CSS 스타일 추가
function addLuckyStyles() {
    // 이미 스타일이 추가되어 있는지 확인
    if (document.querySelector('style[data-lucky-styles]')) {
        return;
    }

    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-lucky-styles', 'true');
    styleEl.textContent = `
        .lucky-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.5s;
            pointer-events: none;
        }
        .lucky-overlay.show {
            opacity: 1;
        }
        .lucky-content {
            text-align: center;
            color: white;
            z-index: 2;
        }
        .lucky-icon {
            font-size: 80px;
            margin-bottom: 20px;
            animation: spin 2s infinite;
        }
        .lucky-title {
            font-size: 72px;
            font-weight: bold;
            color: gold;
            text-shadow: 0 0 10px gold, 0 0 20px gold;
            margin-bottom: 20px;
            animation: pulse 1s infinite;
            font-family: 'Arial Black', 'Arial Bold', Gadget, sans-serif;
        }
        .lucky-message {
            font-size: 24px;
            color: white;
        }
        .lucky-star {
            position: absolute;
            background-color: gold;
            border-radius: 50%;
            opacity: 0;
            animation: twinkle 2s forwards;
        }
        .lucky-highlight {
            animation: highlight 1s infinite;
        }
        .lucky-firework {
            position: absolute;
            width: 10px;
            height: 10px;
            z-index: 1;
        }
        .lucky-particle {
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: gold;
        }
        .lucky-member-card {
            border: 2px solid gold !important;
            box-shadow: 0 0 15px gold !important;
            position: relative;
            overflow: hidden;
        }
        
        .lucky-member-card::before {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
                to bottom right,
                rgba(255, 215, 0, 0.3) 0%,
                rgba(255, 215, 0, 0) 30%,
                rgba(255, 215, 0, 0) 70%,
                rgba(255, 215, 0, 0.3) 100%
            );
            z-index: 1;
            animation: lucky-shine 3s linear infinite;
            pointer-events: none;
        }
        
        @keyframes lucky-shine {
            0% {
                transform: translateY(-50%) translateX(-50%) rotate(0deg);
            }
            100% {
                transform: translateY(-50%) translateX(-50%) rotate(360deg);
            }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        @keyframes twinkle {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0); opacity: 0; }
        }
        @keyframes highlight {
            0% { box-shadow: 0 0 5px gold; }
            50% { box-shadow: 0 0 20px gold, 0 0 30px gold; }
            100% { box-shadow: 0 0 5px gold; }
        }
        
        .lucky-armor {
            position: relative;
        }
    `;
    document.head.appendChild(styleEl);
}

// DOM 로드 시 스타일 추가
document.addEventListener('DOMContentLoaded', function() {
    // 럭키 효과 스타일 추가
    addLuckyStyles();

    // window 객체에 럭키 효과 함수 등록 (다른 스크립트에서 사용할 수 있도록)
    window.showLuckyEffect = showLuckyEffect;

    console.log("Lucky 효과 초기화 완료!");
});