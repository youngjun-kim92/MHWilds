// 몬스터헌터 무기 & 방어구 가챠 시스템
document.addEventListener('DOMContentLoaded', function() {
    // 버튼 요소 가져오기
    const randomWeaponBtn = document.getElementById('randomWeaponBtn');
    const randomArmorBtn = document.getElementById('randomArmorBtn');
    const randomLoadoutBtn = document.getElementById('randomLoadoutBtn');
    const resetBtn = document.getElementById('resetBtn');

    // 디스코드 공유 관련 요소
    const nicknameInput = document.getElementById('nickname');
    const shareToDiscordCheckbox = document.getElementById('shareToDiscord');
    const discordToast = document.getElementById('discordToast');
    const discordToastMessage = document.getElementById('discordToastMessage');

    // 결과 섹션 요소
    const weaponResult = document.getElementById('weaponResult');
    const weaponEmpty = document.getElementById('weaponEmpty');
    const armorResult = document.getElementById('armorResult');
    const armorEmpty = document.getElementById('armorEmpty');

    // Bootstrap 토스트 초기화
    const toast = new bootstrap.Toast(discordToast);

    // 현재 결과 저장 변수
    let currentWeapon = null;
    let currentArmor = {};
    let currentArmorNames = {}; // 방어구 이름 저장

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

    // 방어구 등급 데이터
    const armorRanks = [
        { name: 'LOW_RANK', korName: '하위' },
        { name: 'HIGH_RANK', korName: '상위' }
    ];

    // 하위 방어구 부위별 이름 데이터 (실제 게임 데이터)
    const lowRankArmorNames = {
        'HEAD': [
            '투나물헬름', '레다젤트헬름', '이그졸스헬름', '호벽수헬름', '호화룡헬름',
            '호흉조룡헬름', '시이우헬름', '호쇄인룡헬름', '잉곳헬름', '네라치카액세서리',
            '푸포루헬름', '스큐라헬름', '히라바미헬름', '아자라헬름', '콩가헬름',
            '발라헬름', '도샤구마헬름', '호프마스크', '레더헤드', '체인헤드',
            '본헬름', '브라치카글라스', '차타헬름', '트리스헬름', '얼로이헬름',
            '랑고헬름', '라바라헬름'
        ],
        'CHEST': [
            '투나물메일', '레다젤트메일', '이그졸스메일', '호벽수메일', '호화룡메일',
            '호흉조룡메일', '시이우메일', '호쇄인룡메일', '잉곳메일', '크라노다스메일',
            '푸포루메일', '스큐라메일', '히라바미메일', '아자라메일', '콩가메일',
            '발라메일', '도샤구마메일', '호프메일', '레더베스트', '체인베스트',
            '본메일', '차타메일', '트리스메일', '얼로이메일', '랑고메일',
            '라바라메일'
        ],
        'ARM': [
            '투나물암', '레다젤트암', '이그졸스암', '호벽수암', '호화룡암',
            '호흉조룡암', '시이우암', '호쇄인룡암', '잉곳암', '푸포루암',
            '스큐라암', '히라바미암', '아자라암', '콩가암', '발라암',
            '도샤구마암', '호프암', '레더글러브', '체인글러브', '본암',
            '탈리오스암', '차타암', '트리스암', '얼로이암', '랑고암',
            '라바라암'
        ],
        'WAIST': [
            '수호룡 세크레트코일', '투나물코일', '레다젤트코일', '이그졸스코일', '호벽수코일',
            '호화룡코일', '호흉조룡코일', '시이우코일', '호쇄인룡코일', '잉곳코일',
            '푸포루코일', '스큐라코일', '히라바미코일', '아자라코일', '콩가코일',
            '발라코일', '도샤구마코일', '호프코일', '레더벨트', '체인벨트',
            '본코일', '차타코일', '트리스코일', '얼로이코일', '랑고코일',
            '라바라코일'
        ],
        'LEG': [
            '투나물그리브', '레다젤트그리브', '이그졸스그리브', '호벽수그리브', '호화룡그리브',
            '호흉조룡그리브', '시이우그리브', '호쇄인룡그리브', '잉곳그리브', '푸포루그리브',
            '스큐라그리브', '히라바미그리브', '아자라그리브', '콩가그리브', '발라그리브',
            '도샤구마그리브', '호프그리브', '레더팬츠', '체인팬츠', '본그리브',
            '가쟈우부츠', '차타그리브', '트리스그리브', '얼로이그리브', '필라길그리브',
            '랑고그리브', '라바라그리브'
        ]
    };

    // 상위 방어구 부위별 이름 데이터 (α/β 구분)
    // 첫 번째 요소는 이름, 두 번째 요소는 β가 있는지 여부 (true면 α/β 둘 다 있음, false면 α만 있음)
    const highRankArmorNames = {
        'HEAD': [
            ['슈바르카헬름', true], ['호쇄인룡헬름', true], ['길드에이스피어스', false], ['용왕의 척안', false],
            ['도베르헬름', false], ['다마스크헬름', false], ['다하딜라헬름', true], ['투나물헬름', true],
            ['레다젤트헬름', true], ['이그졸스헬름', true], ['고어헬름', true], ['하이메탈헬름', false],
            ['배틀헬름', false], ['멜호아프롤', false], ['조사단헬름', false], ['잉곳헬름', false],
            ['호뢰악룡헬름', true], ['도샤구마헬름', true], ['호벽수헬름', true], ['아자라헬름', true],
            ['호흉조룡헬름', true], ['시이우헬름', true], ['레우스헬름', true], ['호화룡헬름', true],
            ['그라비드헬름', true], ['블랑고헬름', true], ['아티어헬름', false], ['쿠나파헤드', false],
            ['아즈즈헤드', false], ['실드후드', false], ['데스기어게힐', false], ['파피메르테스타', false],
            ['킹비트테스타', false], ['발라헬름', true], ['히라바미헬름', true], ['꽃성성이', false],
            ['조사대의 귀걸이', false], ['레이아헬름', true]
        ],
        'CHEST': [
            ['슈바르카메일', true], ['호쇄인룡메일', true], ['길드에이스메일', false], ['도베르메일', false],
            ['다마스크메일', false], ['다하딜라메일', true], ['투나물메일', true], ['레다젤트메일', true],
            ['이그졸스메일', true], ['고어메일', true], ['하이메탈메일', false], ['배틀메일', false],
            ['멜호아토론코', false], ['조사단메일', false], ['잉곳메일', false], ['호뢰악룡메일', true],
            ['도샤구마메일', true], ['호벽수메일', true], ['아자라메일', true], ['호흉조룡메일', true],
            ['시이우메일', true], ['레우스메일', true], ['호화룡메일', true], ['그라비드메일', true],
            ['블랑고메일', true], ['아티어메일', false], ['쿠나파케이프', false], ['아즈즈에이프런', false],
            ['실드코트', false], ['데스기어무스켈', false], ['파피메르페트', false], ['킹비트페트', false],
            ['발라메일', true], ['히라바미메일', true], ['레이아메일', true]
        ],
        'ARM': [
            ['슈바르카암', true], ['호쇄인룡암', true], ['길드에이스암', false], ['도베르암', false],
            ['다마스크암', false], ['다하딜라암', true], ['투나물암', true], ['레다젤트암', true],
            ['이그졸스암', true], ['고어암', true], ['하이메탈암', false], ['배틀암', false],
            ['멜호아라마', false], ['조사단암', false], ['잉곳암', false], ['호뢰악룡암', true],
            ['도샤구마암', true], ['호벽수암', true], ['아자라암', true], ['호흉조룡암', true],
            ['시이우암', true], ['레우스암', true], ['호화룡암', true], ['그라비드암', true],
            ['블랑고암', true], ['아티어암', false], ['데스기어파오스트', false], ['파피메르마노', false],
            ['킹비트마노', false], ['발라암', true], ['히라바미암', true], ['레이아암', true]
        ],
        'WAIST': [
            ['슈바르카코일', true], ['호쇄인룡코일', true], ['길드에이스코일', false], ['도베르코일', false],
            ['다마스크코일', false], ['다하딜라코일', true], ['투나물코일', true], ['레다젤트코일', true],
            ['이그졸스코일', true], ['고어코일', true], ['하이메탈코일', false], ['배틀코일', false],
            ['멜호아오하', false], ['조사단코일', false], ['잉곳코일', false], ['수호룡 세크레트코일', true],
            ['호뢰악룡코일', true], ['도샤구마코일', true], ['호벽수코일', true], ['아자라코일', true],
            ['호흉조룡코일', true], ['시이우코일', true], ['레우스코일', true], ['호화룡코일', true],
            ['그라비드코일', true], ['블랑고코일', true], ['스자의 허리띠', false], ['아티어코일', false],
            ['쿠나파벨트', false], ['데스기어네이블', false], ['파피메르앙카', false], ['킹비트앙카', false],
            ['스큐라코일', true], ['발라코일', true], ['히라바미코일', true], ['레이아코일', true]
        ],
        'LEG': [
            ['슈바르카그리브', true], ['호쇄인룡그리브', true], ['길드에이스부츠', false], ['도베르그리브', false],
            ['다마스크그리브', false], ['다하딜라그리브', true], ['투나물그리브', true], ['레다젤트그리브', true],
            ['이그졸스그리브', true], ['고어그리브', true], ['하이메탈그리브', false], ['배틀그리브', false],
            ['멜호아라이스', false], ['조사단그리브', false], ['잉곳그리브', false], ['가쟈우부츠', false],
            ['호뢰악룡그리브', true], ['도샤구마그리브', true], ['호벽수그리브', true], ['아자라그리브', true],
            ['호흉조룡그리브', true], ['시이우그리브', true], ['레우스그리브', true], ['호화룡그리브', true],
            ['그라비드그리브', true], ['블랑고그리브', true], ['아티어그리브', false], ['쿠나파챕스', false],
            ['아즈즈팬츠', false], ['데스기어페르제', false], ['파피메르감바', false], ['킹비트감바', false],
            ['스큐라그리브', true], ['발라그리브', true], ['히라바미그리브', true], ['레이아그리브', true]
        ]
    };

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

    // 닉네임 입력시 저장
    nicknameInput.addEventListener('input', function() {
        localStorage.setItem('mhGachaNickname', nicknameInput.value);
    });

    // 체크박스 변경시 저장
    shareToDiscordCheckbox.addEventListener('change', function() {
        localStorage.setItem('mhGachaShareToDiscord', shareToDiscordCheckbox.checked);
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
    randomArmorBtn.addEventListener('click', function() {
        // 방어구 랜덤 선택
        const randomArmor = getRandomArmor();
        currentArmor = randomArmor;
        currentArmorNames = {}; // 방어구 이름 초기화
        displayArmor(randomArmor);

        console.log("방어구 가챠 결과:", currentArmor);
        console.log("방어구 이름:", currentArmorNames);

        // 디스코드 공유 체크 확인
        if(shareToDiscordCheckbox.checked && nicknameInput.value.trim() !== '') {
            shareResultToDiscord('armor');
        }
    });

    // 전체 가챠 버튼 클릭 이벤트
    randomLoadoutBtn.addEventListener('click', function() {
        // 무기 및 방어구 랜덤 선택
        const randomWeapon = getRandomWeapon();
        const randomArmor = getRandomArmor();

        currentWeapon = randomWeapon;
        currentArmor = randomArmor;
        currentArmorNames = {}; // 방어구 이름 초기화

        displayWeapon(randomWeapon);
        displayArmor(randomArmor);

        console.log("전체 가챠 결과 - 무기:", currentWeapon);
        console.log("전체 가챠 결과 - 방어구:", currentArmor);
        console.log("방어구 이름:", currentArmorNames);

        // 디스코드 공유 체크 확인
        if(shareToDiscordCheckbox.checked && nicknameInput.value.trim() !== '') {
            shareResultToDiscord('loadout');
        }
    });

    // 초기화 버튼 클릭 이벤트
    resetBtn.addEventListener('click', function() {
        resetAll();
    });

    // 랜덤 무기 선택 함수
    function getRandomWeapon() {
        return weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
    }

    // 랜덤 방어구 선택 함수
    function getRandomArmor() {
        const result = {};

        // 각 부위별로 70% 확률로 방어구 선택
        for (const armorType of Object.keys(lowRankArmorNames)) {
            if (Math.random() <= 0.7) {
                const randomRank = armorRanks[Math.floor(Math.random() * armorRanks.length)];
                result[armorType] = randomRank;
            }
        }

        return result;
    }

    // 방어구 이름 생성 함수 - 등급에 따라 다른 풀에서 선택 및 알파/베타 처리
    function generateArmorName(armorType, armorRank) {
        if (armorRank.name === 'HIGH_RANK') {
            // 상위 방어구인 경우
            const namesPool = highRankArmorNames[armorType];
            if (!namesPool || namesPool.length === 0) {
                return `랜덤${getArmorTypeShortName(armorType)}`;
            }

            // 랜덤으로 방어구 선택
            const randomIndex = Math.floor(Math.random() * namesPool.length);
            const [baseName, hasBeta] = namesPool[randomIndex];

            // 베타 버전이 있는 경우, 알파/베타 랜덤 결정
            if (hasBeta) {
                return baseName + (Math.random() < 0.5 ? 'α' : 'β');
            } else {
                // 베타 버전이 없는 경우 알파만 추가
                return baseName + 'α';
            }
        } else {
            // 하위 방어구인 경우 (α/β 표기 없음)
            const namesPool = lowRankArmorNames[armorType];
            if (!namesPool || namesPool.length === 0) {
                return `랜덤${getArmorTypeShortName(armorType)}`;
            }

            // 랜덤으로 방어구 선택 (표기 없이 기본 이름만)
            return namesPool[Math.floor(Math.random() * namesPool.length)];
        }
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
            // 또는 이미지를 숨길 경우: this.style.display = 'none';
        };

        // 이미지 요소 표시
        weaponImage.style.display = 'inline-block';

        // 무기 섹션 표시
        weaponResult.style.display = 'block';
        weaponEmpty.style.display = 'none';
    }

    // 방어구 정보 화면에 표시
    function displayArmor(armorRanks) {
        if (!armorRanks || Object.keys(armorRanks).length === 0) {
            armorResult.style.display = 'none';
            armorEmpty.style.display = 'block';
            return;
        }

        // 모든 방어구 부위의 기본 상태 설정
        const armorTypes = ['head', 'chest', 'arm', 'waist', 'leg'];
        armorTypes.forEach(type => {
            document.getElementById(`${type}Info`).style.display = 'none';
            document.getElementById(`${type}Empty`).style.display = 'block';
        });

        // 각 방어구 부위 표시
        for (const [armorType, armorRank] of Object.entries(armorRanks)) {
            if (!armorRank) continue;

            const type = getTypeFromEnum(armorType).toLowerCase();

            // 방어구 이름 생성 및 저장
            const armorName = generateArmorName(armorType, armorRank);
            currentArmorNames[armorType] = armorName;

            // 방어구 이름 표시
            document.getElementById(`${type}FullName`).textContent = armorName;

            // 방어구 정보 표시
            document.getElementById(`${type}Type`).textContent = getArmorTypeName(armorType);

            // 등급 표시
            document.getElementById(`${type}Rank`).textContent = armorRank.korName;

            // 정보 표시 전환
            document.getElementById(`${type}Info`).style.display = 'block';
            document.getElementById(`${type}Empty`).style.display = 'none';
        }

        // 방어구 섹션 표시
        armorResult.style.display = 'block';
        armorEmpty.style.display = 'none';
    }

    // 디스코드에 결과 공유 함수
    function shareResultToDiscord(type) {
        const nickname = nicknameInput.value.trim();
        if (!nickname) {
            discordToastMessage.textContent = '닉네임을 입력해주세요!';
            toast.show();
            return;
        }

        // 결과 데이터 생성
        let resultData = {
            nickname: nickname,
            type: type
        };

        // 무기 결과가 있으면 추가
        if (currentWeapon) {
            resultData.weapon = currentWeapon;
        }

        // 방어구 결과가 있으면 추가
        if (Object.keys(currentArmor).length > 0) {
            resultData.armor = currentArmor;
            resultData.armorNames = currentArmorNames; // 방어구 이름 추가
        }

        // 디버깅 로그
        console.log("전송할 데이터:", resultData);

        // 공유할 결과가 없으면 중단
        if (!resultData.weapon && Object.keys(currentArmor).length === 0) {
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

    // 방어구 타입 열거형에서 표시용 문자열로 변환
    function getTypeFromEnum(enumType) {
        const typeMap = {
            'HEAD': 'head',
            'CHEST': 'chest',
            'ARM': 'arm',
            'WAIST': 'waist',
            'LEG': 'leg'
        };

        return typeMap[enumType] || enumType.toLowerCase();
    }

    // 방어구 타입의 짧은 이름 가져오기 (방어구 이름용)
    function getArmorTypeShortName(armorType) {
        const armorTypeShortNames = {
            'HEAD': '헬름',
            'CHEST': '메일',
            'ARM': '암즈',
            'WAIST': '코일',
            'LEG': '그리브'
        };

        return armorTypeShortNames[armorType] || '';
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
        currentArmorNames = {};
    }
});