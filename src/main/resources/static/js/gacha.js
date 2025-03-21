// 몬스터헌터 무기 & 방어구 & 몬스터 가챠 시스템 - 실시간 설정 적용
document.addEventListener('DOMContentLoaded', function() {
    // 버튼 요소 가져오기
    const randomWeaponBtn = document.getElementById('randomWeaponBtn');
    const randomArmorBtn = document.getElementById('randomArmorBtn');
    const randomMonsterBtn = document.getElementById('randomMonsterBtn');
    const randomLoadoutBtn = document.getElementById('randomLoadoutBtn');
    const resetBtn = document.getElementById('resetBtn');

    // 디스코드 공유 관련 요소
    const nicknameInput = document.getElementById('nickname');
    const shareToDiscordCheckbox = document.getElementById('shareToDiscord');
    const discordToast = document.getElementById('discordToast');
    const discordToastMessage = document.getElementById('discordToastMessage');

    // 몬스터 토글 체크박스
    const includeMonsterInLoadout = document.getElementById('includeMonsterInLoadout');

    // 토글 그룹 참조
    const monsterToggleGroup = document.getElementById('monsterToggleGroup');
    const discordToggleGroup = document.getElementById('discordToggleGroup');

    // 결과 섹션 요소
    const weaponResult = document.getElementById('weaponResult');
    const weaponEmpty = document.getElementById('weaponEmpty');
    const armorResult = document.getElementById('armorResult');
    const armorEmpty = document.getElementById('armorEmpty');
    const monsterResult = document.getElementById('monsterResult');
    const monsterEmpty = document.getElementById('monsterEmpty');

    // Bootstrap 토스트 초기화
    const toast = new bootstrap.Toast(discordToast);

    // 현재 결과 저장 변수
    let currentWeapon = null;
    let currentArmor = {};
    let currentMonster = null;

    // 무기 종류 데이터
    const weaponTypes = [
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

    // 몬스터 종류 데이터
    const monsterTypes = [
        { name: 'CHATAKABURA', korName: '차타카브라' },
        { name: 'KEMATRICE', korName: '케마트리스' },
        { name: 'LAVASIOTH', korName: '라바라 바리나' },
        { name: 'BABAKONGA', korName: '바바콩가' },
        { name: 'BALAHARAH', korName: '발라하라' },
        { name: 'DODOGAMA', korName: '도샤구마' },
        { name: 'WOODTUNA', korName: '우드투나' },
        { name: 'PUFUROPHORU', korName: '푸푸로포루' },
        { name: 'RADAU', korName: '레 다우' },
        { name: 'NERSCULA', korName: '네르스큐라' },
        { name: 'HIRABAMI', korName: '히라바미' },
        { name: 'AZARACAN', korName: '아자라칸' },
        { name: 'NUIGDORA', korName: '누 이그드라' },
        { name: 'DODOGAMA_ELDER', korName: '수호룡 도샤구마' },
        { name: 'RATHALOS_ELDER', korName: '수호룡 리오레우스' },
        { name: 'TRUE_DAHARD', korName: '진 다하드' },
        { name: 'ODOGARON_VARIANT', korName: '수호룡 오도가론 아종' },
        { name: 'SHIEU', korName: '시이우' },
        { name: 'YANKUK', korName: '얀쿡크' },
        { name: 'GENPREY', korName: '게리오스' },
        { name: 'RATHIAN', korName: '리오레이아' },
        { name: 'ANJANATH_VARIANT', korName: '수호룡 안쟈나프 아종' },
        { name: 'RATHALOS', korName: '리오레우스' },
        { name: 'GRAVIMOS', korName: '그라비모스' },
        { name: 'BLANGONGA', korName: '도도블랑고' },
        { name: 'GORE_MAGALA', korName: '고어 마가라' },
        { name: 'ALSUVERDE', korName: '알슈베르도' }
    ];

    // 방어구 등급 데이터
    const armorRanks = [
        { name: 'LOW_RANK', korName: '하위' },
        { name: 'HIGH_RANK', korName: '상위' }
    ];

    // 저장된 닉네임 불러오기
    const savedNickname = localStorage.getItem('mhGachaNickname');
    if (savedNickname) {
        nicknameInput.value = savedNickname;
    }

    // 저장된 체크박스 상태 불러오기
    const savedShareToDiscord = localStorage.getItem('mhGachaShareToDiscord');
    if (savedShareToDiscord === 'true') {
        shareToDiscordCheckbox.checked = true;
    }

    // 저장된 몬스터 포함 상태 불러오기
    const savedIncludeMonster = localStorage.getItem('mhGachaIncludeMonster');
    if (savedIncludeMonster === 'true') {
        includeMonsterInLoadout.checked = true;
        monsterToggleGroup.classList.add('toggle-active');
    }

    // 닉네임 입력시 저장
    nicknameInput.addEventListener('input', function() {
        localStorage.setItem('mhGachaNickname', nicknameInput.value);
    });

    // 체크박스 변경시 저장
    shareToDiscordCheckbox.addEventListener('change', function() {
        localStorage.setItem('mhGachaShareToDiscord', shareToDiscordCheckbox.checked);

        // 토글 그룹 활성화/비활성화
        if (this.checked) {
            discordToggleGroup.classList.add('toggle-active');
        } else {
            discordToggleGroup.classList.remove('toggle-active');
        }
    });

    // 몬스터 포함 체크박스 변경시 저장
    includeMonsterInLoadout.addEventListener('change', function() {
        localStorage.setItem('mhGachaIncludeMonster', includeMonsterInLoadout.checked);

        // 토글 그룹 활성화/비활성화
        if (this.checked) {
            monsterToggleGroup.classList.add('toggle-active');
        } else {
            monsterToggleGroup.classList.remove('toggle-active');
        }
    });

    // 엔터키 입력 시 전체 가챠 실행
    nicknameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            randomLoadoutBtn.click();
        }
    });

    // 무기 가챠 버튼 클릭 이벤트
    randomWeaponBtn.addEventListener('click', function() {
        // 무기 랜덤 선택
        const randomWeapon = getRandomWeapon();
        currentWeapon = randomWeapon;
        displayWeapon(randomWeapon);

        console.log("무기 가챠 결과:", currentWeapon);

        // 디스코드 공유 체크 확인
        if(shareToDiscordCheckbox.checked && nicknameInput.value.trim() !== '') {
            shareResultToDiscord('weapon');
        }
    });

    // 방어구 가챠 버튼 클릭 이벤트
    randomArmorBtn.addEventListener('click', async function() {
        // 방어구 랜덤 선택 (몬스터 영향 반영)
        const result = await getRandomArmor();
        currentArmor = result.armorSet;
        const isLucky = result.isLucky;

        displayArmor(currentArmor, isLucky);

        console.log("방어구 가챠 결과:", currentArmor, "럭키:", isLucky);

        // 디스코드 공유 체크 확인
        if(shareToDiscordCheckbox.checked && nicknameInput.value.trim() !== '') {
            shareResultToDiscord('armor', isLucky);
        }
    });

    // 몬스터 가챠 버튼 클릭 이벤트
    randomMonsterBtn.addEventListener('click', function() {
        // 몬스터 랜덤 선택
        const randomMonster = getRandomMonster();
        currentMonster = randomMonster;
        displayMonster(randomMonster);

        console.log("몬스터 가챠 결과:", currentMonster);

        // 디스코드 공유 체크 확인
        if(shareToDiscordCheckbox.checked && nicknameInput.value.trim() !== '') {
            shareResultToDiscord('monster');
        }
    });

    // 전체 가챠 버튼 클릭 이벤트
    randomLoadoutBtn.addEventListener('click', async function() {
        // 몬스터 포함 여부 확인
        if (includeMonsterInLoadout.checked) {
            // 몬스터도 함께 추첨
            const randomMonster = getRandomMonster();
            currentMonster = randomMonster;
            displayMonster(randomMonster);
            console.log("전체 가챠 결과 - 몬스터:", currentMonster);
        }

        // 무기 및 방어구 랜덤 선택
        const randomWeapon = getRandomWeapon();
        const result = await getRandomArmor();
        const isLucky = result.isLucky;

        currentWeapon = randomWeapon;
        currentArmor = result.armorSet;

        displayWeapon(randomWeapon);
        displayArmor(currentArmor, isLucky);

        console.log("전체 가챠 결과 - 무기:", currentWeapon);
        console.log("전체 가챠 결과 - 방어구:", currentArmor, "럭키:", isLucky);

        // 디스코드 공유 체크 확인
        if(shareToDiscordCheckbox.checked && nicknameInput.value.trim() !== '') {
            shareResultToDiscord('loadout', isLucky);
        }
    });

    // 초기화 버튼 클릭 이벤트
    resetBtn.addEventListener('click', function() {
        resetAll();
    });

    // 서버에서 가챠 설정 가져오기 (실시간)
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

    // 랜덤 무기 선택 함수
    function getRandomWeapon() {
        return weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
    }

    // 랜덤 몬스터 선택 함수
    function getRandomMonster() {
        return monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
    }

    // 랜덤 방어구 선택 함수 (실시간 설정 적용)
    async function getRandomArmor(forceLucky = false) {
        // 실행할 때마다 최신 설정 가져오기
        const settings = await fetchGachaSettings();

        // 결과 객체 초기화
        const armorSet = {};

        // 럭키 효과는 설정된 확률로 발동, 또는 테스트 모드에서 강제 적용
        let isLucky = forceLucky || (Math.random() <= settings.luckyChance);

        // 럭키 효과 발동 시 화려한 효과 표시
        if (isLucky && typeof showLuckyEffect === 'function') {
            showLuckyEffect();
        }

        // 몬스터가 선택되었는지 확인
        const hasSelectedMonster = currentMonster !== null;

        // 특별 몬스터인지 확인 (서버 설정 사용)
        const isSpecialMonster = hasSelectedMonster &&
            settings.specialMonsters.includes(currentMonster.name);

        // 기본 상위 방어구 개수 결정 (서버 설정 사용)
        let baseHighRankCount = 0;
        if (hasSelectedMonster) {
            if (isSpecialMonster) {
                // 특별 몬스터: 서버 설정된 개수 확정
                baseHighRankCount = settings.specialHighRankCount;
            } else {
                // 일반 몬스터: 서버 설정된 개수 확정
                baseHighRankCount = settings.defaultHighRankCount;
            }
        }

        // 추가 상위 방어구 개수 결정 (최대 5개까지 - 모든 부위)
        let extraHighRankCount = 0;
        let chance = 0.1; // 10% 확률

        // 5개 부위까지 각각 10% 확률로 상위 방어구 추가 시도
        for (let i = baseHighRankCount; i < 5; i++) {
            if (Math.random() <= chance) {
                extraHighRankCount++;
            } else {
                break; // 확률을 통과하지 못하면 중단
            }
        }

        // 최종 상위 방어구 개수
        const totalHighRankCount = Math.min(baseHighRankCount + extraHighRankCount, 5);

        // 방어구 부위 목록
        const armorTypes = ['HEAD', 'CHEST', 'ARM', 'WAIST', 'LEG'];

        // 기본적으로 모든 부위를 하위 등급으로 설정
        for (const type of armorTypes) {
            armorSet[type] = armorRanks[0]; // 하위 등급
        }

        // 상위 등급 적용 (랜덤하게 부위 선택)
        if (totalHighRankCount > 0) {
            // 랜덤하게 순서 섞기
            const shuffledTypes = [...armorTypes];
            for (let i = shuffledTypes.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledTypes[i], shuffledTypes[j]] = [shuffledTypes[j], shuffledTypes[i]];
            }

            // 필요한 수만큼 상위 등급으로 변경
            for (let i = 0; i < totalHighRankCount; i++) {
                armorSet[shuffledTypes[i]] = armorRanks[1]; // 상위 등급
            }
        }

        // 결과 로그
        const highCount = Object.values(armorSet).filter(rank => rank.name === 'HIGH_RANK').length;
        const lowCount = Object.values(armorSet).filter(rank => rank.name === 'LOW_RANK').length;
        console.log(`방어구 구성: 기본 상위 ${baseHighRankCount}개, 추가 상위 ${extraHighRankCount}개, 최종 상위 ${highCount}개, 하위 ${lowCount}개, 럭키: ${isLucky}`);
        console.log(`럭키 확률: ${settings.luckyChance * 100}%, 몬스터 선택됨: ${hasSelectedMonster}, 특별 몬스터: ${isSpecialMonster}`);

        return {
            armorSet: armorSet,
            isLucky: isLucky
        };
    }

    // 무기 정보 화면에 표시
    function displayWeapon(weaponType) {
        if (!weaponType) {
            weaponResult.style.display = 'none';
            weaponEmpty.style.display = 'block';
            return;
        }

        // 무기 이름 표시
        document.getElementById('weaponType').textContent = weaponType.korName;

        // 무기 이미지 표시
        const weaponImage = document.getElementById('weaponImage');
        const imagePath = `/img/weapons/${weaponType.name}.jpg`; // 무기 이름과 동일한 이미지 파일명 사용

        // 이미지 경로 설정
        weaponImage.src = imagePath;

        // 이미지 로드 에러 처리
        weaponImage.onerror = function() {
            // 이미지 로드 실패 시 기본 이미지 또는 숨김 처리
            this.src = '/img/weapons/default.jpg'; // 기본 이미지 경로
        };

        // 이미지 요소 표시
        weaponImage.style.display = 'inline-block';

        // 무기 섹션 표시
        weaponResult.style.display = 'block';
        weaponEmpty.style.display = 'none';
    }

    // 몬스터 정보 화면에 표시
    function displayMonster(monsterType) {
        if (!monsterType) {
            monsterResult.style.display = 'none';
            monsterEmpty.style.display = 'block';
            return;
        }

        // 몬스터 이름 표시
        document.getElementById('monsterType').textContent = monsterType.korName;

        // 몬스터 이미지 표시
        const monsterImage = document.getElementById('monsterImage');
        const imagePath = `/img/monsters/${monsterType.name}.webp`; // 몬스터 이름과 동일한 이미지 파일명, 확장자는 webp

        // 이미지 경로 설정
        monsterImage.src = imagePath;

        // 이미지 로드 에러 처리
        monsterImage.onerror = function() {
            // 이미지 로드 실패 시 기본 이미지 또는 숨김 처리
            this.src = '/img/monsters/default.webp'; // 기본 이미지 경로도 webp
        };

        // 이미지 요소 표시
        monsterImage.style.display = 'inline-block';

        // 몬스터 섹션 표시
        monsterResult.style.display = 'block';
        monsterEmpty.style.display = 'none';
    }

    // 방어구 정보 화면에 표시 (럭키 효과 추가)
    function displayArmor(armorRanks, isLucky = false) {
        if (!armorRanks || Object.keys(armorRanks).length === 0) {
            armorResult.style.display = 'none';
            armorEmpty.style.display = 'block';
            return;
        }

        // 방어구 섹션 표시
        armorResult.style.display = 'block';
        armorEmpty.style.display = 'none';

        // 호프셋 배지 모두 표시
        const hopsetBadges = document.querySelectorAll('.hopset-badge');
        hopsetBadges.forEach(badge => {
            badge.style.display = 'inline-flex';
        });

        // 모든 방어구 등급 초기화
        const rankElements = ['headRank', 'chestRank', 'armRank', 'waistRank', 'legRank'];
        rankElements.forEach(id => {
            const element = document.getElementById(id);
            element.textContent = '하위';
            element.classList.remove('high-rank', 'lucky');
        });

        // 부위별 매핑
        const typeMapping = {
            'HEAD': 'headRank',
            'CHEST': 'chestRank',
            'ARM': 'armRank',
            'WAIST': 'waistRank',
            'LEG': 'legRank'
        };

        // 럭키 효과 적용 (모든 방어구에 적용)
        if (isLucky) {
            rankElements.forEach(id => {
                const element = document.getElementById(id);
                element.textContent = '럭키 ✨';
                element.classList.add('lucky');
            });
            return;
        }

        // 일반 효과 (럭키 아님)
        Object.entries(armorRanks).forEach(([type, rank]) => {
            const elementId = typeMapping[type];
            if (!elementId) return;

            const rankElement = document.getElementById(elementId);

            // 등급 표시
            rankElement.textContent = rank.korName;

            // 상위 등급인 경우 클래스 추가
            if (rank.name === 'HIGH_RANK') {
                rankElement.classList.add('high-rank');
            }
        });
    }

    // 디스코드에 결과 공유 함수 (럭키 효과 추가)
    function shareResultToDiscord(type, isLucky = false) {
        const nickname = nicknameInput.value.trim();
        if (!nickname) {
            discordToastMessage.textContent = '닉네임을 입력해주세요!';
            toast.show();
            return;
        }

        // 결과 데이터 생성
        let resultData = {
            nickname: nickname,
            type: type,
            isLucky: isLucky
        };

        // 무기 결과가 있으면 추가
        if (currentWeapon) {
            resultData.weapon = currentWeapon;
        }

        // 방어구 결과가 있으면 추가
        if (Object.keys(currentArmor).length > 0) {
            resultData.armor = currentArmor;
        }

        // 몬스터 결과가 있으면 추가
        if (currentMonster) {
            resultData.monster = currentMonster;
        }

        // 디버깅 로그
        console.log("전송할 데이터:", resultData);

        // 공유할 결과가 없으면 중단
        if (!resultData.weapon && Object.keys(currentArmor).length === 0 && !resultData.monster) {
            discordToastMessage.textContent = '공유할 결과가 없습니다!';
            toast.show();
            return;
        }

        // 서버에 결과 전송
        fetch('/api/share-to-discord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resultData)
        })
            .then(response => {
                console.log("서버 응답 상태:", response.status);
                return response.json();
            })
            .then(data => {
                console.log("서버 응답 데이터:", data);
                if (data.success) {
                    discordToastMessage.textContent = '디스코드 채널에 결과가 공유되었습니다!';
                } else {
                    discordToastMessage.textContent = '디스코드 공유 중 오류가 발생했습니다: ' + data.message;
                }
                toast.show();
            })
            .catch(error => {
                console.error('Error:', error);
                discordToastMessage.textContent = '디스코드 공유 중 오류가 발생했습니다';
                toast.show();
            });
    }

    // 방어구 타입 이름 가져오기
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

    // 모든 결과 초기화
    function resetAll() {
        // 무기 초기화
        weaponResult.style.display = 'none';
        weaponEmpty.style.display = 'block';
        currentWeapon = null;

        // 방어구 초기화
        armorResult.style.display = 'none';
        armorEmpty.style.display = 'block';
        currentArmor = {};

        // 몬스터 초기화
        monsterResult.style.display = 'none';
        monsterEmpty.style.display = 'block';
        currentMonster = null;
    }

    // 개발용: 럭키 모드 테스트 함수
    window.testLuckyMode = async function() {
        console.log('럭키 모드 테스트');
        const result = await getRandomArmor(true); // 럭키 모드 강제 활성화
        currentArmor = result.armorSet;
        displayArmor(currentArmor, true);

        // 알림 표시
        const toast = new bootstrap.Toast(document.getElementById('discordToast'));
        document.getElementById('discordToastMessage').innerHTML = '🎉 <strong>LUCKY!</strong> 🎉 럭키 모드 테스트 중입니다!';
        toast.show();
    };

    // 몬스터 드롭박스 요소 참조 추가
    const monsterSelectDropdown = document.getElementById('monsterSelectDropdown');
    const applyMonsterBtn = document.getElementById('applyMonsterBtn');

    // 몬스터 데이터로 드롭박스 채우기 함수 (DOMContentLoaded 이벤트 내에 배치)
    function populateMonsterDropdown() {
        // 기존 옵션 제거 (첫 번째 기본 옵션은 유지)
        while (monsterSelectDropdown.options.length > 1) {
            monsterSelectDropdown.remove(1);
        }

        // 몬스터 데이터로 드롭박스 채우기
        monsterTypes.forEach(monster => {
            const option = document.createElement('option');
            option.value = monster.name;
            option.textContent = monster.korName;
            monsterSelectDropdown.appendChild(option);
        });
    }

    // 드롭박스 초기화 (DOMContentLoaded 이벤트 내부 초기화 부분에 추가)
    populateMonsterDropdown();

    // 몬스터 선택 적용 버튼 클릭 이벤트 (다른 이벤트 리스너들과 함께 추가)
    applyMonsterBtn.addEventListener('click', function() {
        const selectedMonsterValue = monsterSelectDropdown.value;

        if (!selectedMonsterValue) {
            // 몬스터가 선택되지 않았을 경우
            alert('몬스터를 선택해주세요.');
            return;
        }

        // 선택된 몬스터 찾기
        const selectedMonster = monsterTypes.find(monster => monster.name === selectedMonsterValue);

        if (selectedMonster) {
            // 현재 몬스터 변수 업데이트
            currentMonster = selectedMonster;

            // 몬스터 화면에 표시
            displayMonster(selectedMonster);

            // 알림 표시
            const toast = new bootstrap.Toast(document.getElementById('discordToast'));
            document.getElementById('discordToastMessage').innerHTML =
                `<strong>${selectedMonster.korName}</strong> 몬스터가 적용되었습니다!`;
            toast.show();

            console.log("선택된 몬스터:", currentMonster);

            // 디스코드 공유 체크 확인
            if(shareToDiscordCheckbox.checked && nicknameInput.value.trim() !== '') {
                shareResultToDiscord('monster');
            }
        }
    });

    // 초기화 버튼에 몬스터 드롭박스 초기화 추가 (resetAll 함수 수정)
    const originalResetAll = resetAll;
    resetAll = function() {
        // 기존 초기화 함수 호출
        originalResetAll();

        // 몬스터 드롭박스 초기화
        monsterSelectDropdown.selectedIndex = 0;
    };
});