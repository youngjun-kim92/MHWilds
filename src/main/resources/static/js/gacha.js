// 몬스터헌터 무기 & 방어구 가챠 시스템
document.addEventListener('DOMContentLoaded', function() {
    // 버튼 요소 가져오기
    const randomWeaponBtn = document.getElementById('randomWeaponBtn');
    const randomArmorBtn = document.getElementById('randomArmorBtn');
    const randomLoadoutBtn = document.getElementById('randomLoadoutBtn');
    const resetBtn = document.getElementById('resetBtn');

    // 결과 섹션 요소
    const weaponResult = document.getElementById('weaponResult');
    const weaponEmpty = document.getElementById('weaponEmpty');
    const armorResult = document.getElementById('armorResult');
    const armorEmpty = document.getElementById('armorEmpty');

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

    // 방어구 부위별 이름 데이터
    const armorNames = {
        'HEAD': [
            '슈바르카헬름α', '슈바르카헬름β', '호쇄인룡헬름α', '호쇄인룡헬름β', '길드에이스피어스α',
            '도베르헬름α', '다마스크헬름α', '다하딜라헬름α', '다하딜라헬름β', '투나물헬름α',
            '투나물헬름β', '레다젤트헬름α', '레다젤트헬름β', '이그졸스헬름α', '이그졸스헬름β',
            '고어헬름α', '고어헬름β', '하이메탈헬름α', '배틀헬름α', '멜호아프롤α',
            '조사단헬름α', '잉곳헬름α', '호뢰악룡헬름α', '호뢰악룡헬름β', '도샤구마헬름α',
            '도샤구마헬름β', '호벽수헬름α', '호벽수헬름β', '아자라헬름α', '아자라헬름β',
            '호흉조룡헬름α', '호흉조룡헬름β', '시이우헬름α', '시이우헬름β', '레우스헬름α',
            '레우스헬름β', '호화룡헬름α', '호화룡헬름β', '그라비드헬름α', '그라비드헬름β',
            '블랑고헬름α', '블랑고헬름β', '아티어헬름α', '쿠나파헤드α', '아즈즈헤드α',
            '실드후드α', '데스기어게힐α', '파피메르테스타α', '킹비트테스타α', '발라헬름α',
            '발라헬름β', '히라바미헬름α', '히라바미헬름β', '꽃성성이α', '조사대의 귀걸이α',
            '레이아헬름α', '레이아헬름β', '호프마스크α', '레더헤드α', '체인헤드α',
            '본헬름α', '얼로이헬름α', '브라치카글라스α', '브라치카글라스β', '랑고헬름α',
            '랑고헬름β', '네라치카액세서리α', '네라치카액세서리β', '쿡크헬름α', '쿡크헬름β',
            '차타헬름α', '차타헬름β', '트리스헬름α', '트리스헬름β', '라바라헬름α',
            '라바라헬름β', '콩가헬름α', '콩가헬름β', '푸포루헬름α', '푸포루헬름β',
            '게리오스헬름α', '게리오스헬름β', '스큐라헬름α', '스큐라헬름β', '투나물헬름',
            '레다젤트헬름', '이그졸스헬름', '호벽수헬름', '호화룡헬름', '호흉조룡헬름',
            '시이우헬름', '호쇄인룡헬름', '잉곳헬름', '네라치카액세서리', '푸포루헬름',
            '스큐라헬름', '히라바미헬름', '아자라헬름', '콩가헬름', '발라헬름',
            '도샤구마헬름', '호프마스크', '레더헤드', '체인헤드', '본헬름',
            '브라치카글라스', '차타헬름', '트리스헬름', '얼로이헬름', '랑고헬름',
            '라바라헬름'
        ],
        'CHEST': [
            '슈바르카메일α', '슈바르카메일β', '호쇄인룡메일α', '호쇄인룡메일β', '길드에이스메일α',
            '도베르메일α', '다마스크메일α', '다하딜라메일α', '다하딜라메일β', '투나물메일α',
            '투나물메일β', '레다젤트메일α', '레다젤트메일β', '이그졸스메일α', '이그졸스메일β',
            '고어메일α', '고어메일β', '하이메탈메일α', '배틀메일α', '멜호아토론코α',
            '조사단메일α', '잉곳메일α', '호뢰악룡메일α', '호뢰악룡메일β', '도샤구마메일α',
            '도샤구마메일β', '호벽수메일α', '호벽수메일β', '아자라메일α', '아자라메일β',
            '호흉조룡메일α', '호흉조룡메일β', '시이우메일α', '시이우메일β', '레우스메일α',
            '레우스메일β', '호화룡메일α', '호화룡메일β', '그라비드메일α', '그라비드메일β',
            '블랑고메일α', '블랑고메일β', '아티어메일α', '쿠나파케이프α', '아즈즈에이프런α',
            '실드코트α', '데스기어무스켈α', '파피메르페트α', '킹비트페트α', '발라메일α',
            '발라메일β', '히라바미메일α', '히라바미메일β', '레이아메일α', '레이아메일β',
            '호프메일α', '레더베스트α', '체인베스트α', '본메일α', '얼로이메일α',
            '랑고메일α', '랑고메일β', '크라노다스메일α', '크라노다스메일β', '쿡크메일α',
            '쿡크메일β', '차타메일α', '차타메일β', '트리스메일α', '트리스메일β',
            '라바라메일α', '라바라메일β', '콩가메일α', '콩가메일β', '푸포루메일α',
            '푸포루메일β', '게리오스메일α', '게리오스메일β', '스큐라메일α', '스큐라메일β',
            '투나물메일', '레다젤트메일', '이그졸스메일', '호벽수메일', '호화룡메일',
            '호흉조룡메일', '시이우메일', '호쇄인룡메일', '잉곳메일', '크라노다스메일',
            '푸포루메일', '스큐라메일', '히라바미메일', '아자라메일', '콩가메일',
            '발라메일', '도샤구마메일', '호프메일', '레더베스트', '체인베스트',
            '본메일', '차타메일', '트리스메일', '얼로이메일', '랑고메일',
            '라바라메일'
        ],
        'ARM': [
            '슈바르카암α', '슈바르카암β', '호쇄인룡암α', '호쇄인룡암β', '길드에이스암α',
            '도베르암α', '다마스크암α', '다하딜라암α', '다하딜라암β', '투나물암α',
            '투나물암β', '레다젤트암α', '레다젤트암β', '이그졸스암α', '이그졸스암β',
            '고어암α', '고어암β', '하이메탈암α', '배틀암α', '멜호아라마α',
            '조사단암α', '잉곳암α', '호뢰악룡암α', '호뢰악룡암β', '도샤구마암α',
            '도샤구마암β', '호벽수암α', '호벽수암β', '아자라암α', '아자라암β',
            '호흉조룡암α', '호흉조룡암β', '시이우암α', '시이우암β', '레우스암α',
            '레우스암β', '호화룡암α', '호화룡암β', '그라비드암α', '그라비드암β',
            '블랑고암α', '블랑고암β', '아티어암α', '데스기어파오스트α', '파피메르마노α',
            '킹비트마노α', '발라암α', '발라암β', '히라바미암α', '히라바미암β',
            '레이아암α', '레이아암β', '호프암α', '레더글러브α', '체인글러브α',
            '본암α', '얼로이암α', '탈리오스암α', '탈리오스암β', '랑고암α',
            '랑고암β', '쿡크암α', '쿡크암β', '차타암α', '차타암β',
            '트리스암α', '트리스암β', '라바라암α', '라바라암β', '콩가암α',
            '콩가암β', '푸포루암α', '푸포루암β', '게리오스암α', '게리오스암β',
            '스큐라암α', '스큐라암β', '투나물암', '레다젤트암', '이그졸스암',
            '호벽수암', '호화룡암', '호흉조룡암', '시이우암', '호쇄인룡암',
            '잉곳암', '푸포루암', '스큐라암', '히라바미암', '아자라암',
            '콩가암', '발라암', '도샤구마암', '호프암', '레더글러브',
            '체인글러브', '본암', '탈리오스암', '차타암', '트리스암',
            '얼로이암', '랑고암', '라바라암'
        ],
        'WAIST': [
            '슈바르카코일α', '슈바르카코일β', '호쇄인룡코일α', '호쇄인룡코일β', '길드에이스코일α',
            '도베르코일α', '다마스크코일α', '다하딜라코일α', '다하딜라코일β', '투나물코일α',
            '투나물코일β', '레다젤트코일α', '레다젤트코일β', '이그졸스코일α', '이그졸스코일β',
            '고어코일α', '고어코일β', '하이메탈코일α', '배틀코일α', '멜호아오하α',
            '조사단코일α', '잉곳코일α', '호뢰악룡코일α', '호뢰악룡코일β', '도샤구마코일α',
            '도샤구마코일β', '호벽수코일α', '호벽수코일β', '아자라코일α', '아자라코일β',
            '호흉조룡코일α', '호흉조룡코일β', '시이우코일α', '시이우코일β', '레우스코일α',
            '레우스코일β', '호화룡코일α', '호화룡코일β', '그라비드코일α', '그라비드코일β',
            '블랑고코일α', '블랑고코일β', '스자의 허리띠α', '아티어코일α', '쿠나파벨트α',
            '데스기어네이블α', '파피메르앙카α', '킹비트앙카α', '스큐라코일β', '발라코일α',
            '발라코일β', '히라바미코일α', '히라바미코일β', '레이아코일α', '레이아코일β',
            '호프코일α', '레더벨트α', '체인벨트α', '본코일α', '얼로이코일α',
            '랑고코일α', '랑고코일β', '쿡크코일α', '쿡크코일β', '차타코일α',
            '차타코일β', '트리스코일α', '트리스코일β', '라바라코일α', '라바라코일β',
            '콩가코일α', '콩가코일β', '푸포루코일α', '푸포루코일β', '게리오스코일α',
            '게리오스코일β', '스큐라코일α', '투나물코일', '레다젤트코일', '이그졸스코일',
            '호벽수코일', '호화룡코일', '호흉조룡코일', '시이우코일', '호쇄인룡코일',
            '잉곳코일', '푸포루코일', '스큐라코일', '히라바미코일', '아자라코일',
            '콩가코일', '발라코일', '도샤구마코일', '호프코일', '레더벨트',
            '체인벨트', '본코일', '차타코일', '트리스코일', '얼로이코일',
            '랑고코일', '라바라코일'
        ],
        'LEG': [
            '슈바르카그리브α', '슈바르카그리브β', '호쇄인룡그리브α', '호쇄인룡그리브β', '길드에이스부츠α',
            '도베르그리브α', '다마스크그리브α', '다하딜라그리브α', '다하딜라그리브β', '투나물그리브α',
            '투나물그리브β', '레다젤트그리브α', '레다젤트그리브β', '이그졸스그리브α', '이그졸스그리브β',
            '고어그리브α', '고어그리브β', '하이메탈그리브α', '배틀그리브α', '멜호아라이스α',
            '조사단그리브α', '잉곳그리브α', '가쟈우부츠α', '호뢰악룡그리브α', '호뢰악룡그리브β',
            '도샤구마그리브α', '도샤구마그리브β', '호벽수그리브α', '호벽수그리브β', '아자라그리브α',
            '아자라그리브β', '호흉조룡그리브α', '호흉조룡그리브β', '시이우그리브α', '시이우그리브β',
            '레우스그리브α', '레우스그리브β', '호화룡그리브α', '호화룡그리브β', '그라비드그리브α',
            '그라비드그리브β', '블랑고그리브α', '블랑고그리브β', '아티어그리브α', '쿠나파챕스α',
            '아즈즈팬츠α', '데스기어페르제α', '파피메르감바α', '킹비트감바α', '스큐라그리브β',
            '발라그리브α', '발라그리브β', '히라바미그리브α', '히라바미그리브β', '레이아그리브α',
            '레이아그리브β', '호프그리브α', '레더팬츠α', '체인팬츠α', '본그리브α',
            '얼로이그리브α', '필라길그리브α', '필라길그리브β', '랑고그리브α', '랑고그리브β',
            '쿡크그리브α', '쿡크그리브β', '차타그리브α', '차타그리브β', '트리스그리브α',
            '트리스그리브β', '라바라그리브α', '라바라그리브β', '콩가그리브α', '콩가그리브β',
            '푸포루그리브α', '푸포루그리브β', '게리오스그리브α', '게리오스그리브β', '스큐라그리브α',
            '투나물그리브', '레다젤트그리브', '이그졸스그리브', '호벽수그리브', '호화룡그리브',
            '호흉조룡그리브', '시이우그리브', '호쇄인룡그리브', '잉곳그리브', '푸포루그리브',
            '스큐라그리브', '히라바미그리브', '아자라그리브', '콩가그리브', '발라그리브',
            '도샤구마그리브', '호프그리브', '레더팬츠', '체인팬츠', '본그리브',
            '가쟈우부츠', '차타그리브', '트리스그리브', '얼로이그리브', '필라길그리브',
            '랑고그리브', '라바라그리브'
        ]
    };

    // 무기 가챠 버튼 클릭 이벤트
    randomWeaponBtn.addEventListener('click', function() {
        // 무기 랜덤 선택
        const randomWeapon = getRandomWeapon();
        displayWeapon(randomWeapon);
    });

    // 방어구 가챠 버튼 클릭 이벤트
    randomArmorBtn.addEventListener('click', function() {
        // 방어구 랜덤 선택
        const randomArmor = getRandomArmor();
        displayArmor(randomArmor);
    });

    // 전체 가챠 버튼 클릭 이벤트
    randomLoadoutBtn.addEventListener('click', function() {
        // 무기 및 방어구 랜덤 선택
        const randomWeapon = getRandomWeapon();
        const randomArmor = getRandomArmor();

        displayWeapon(randomWeapon);
        displayArmor(randomArmor);
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
        for (const armorType of Object.keys(armorNames)) {
            if (Math.random() <= 0.7) {
                const randomRank = armorRanks[Math.floor(Math.random() * armorRanks.length)];
                result[armorType] = randomRank;
            }
        }

        return result;
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

            // 방어구 타입별 이름 목록에서 랜덤으로 이름 선택
            const namesOfType = armorNames[armorType] || [];
            const randomArmorName = namesOfType.length > 0 ?
                namesOfType[Math.floor(Math.random() * namesOfType.length)] :
                `랜덤${getArmorTypeShortName(armorType)}`;

            // 방어구 이름 표시
            document.getElementById(`${type}FullName`).textContent = randomArmorName;

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

        // 방어구 초기화
        armorResult.style.display = 'none';
        armorEmpty.style.display = 'block';
    }
});