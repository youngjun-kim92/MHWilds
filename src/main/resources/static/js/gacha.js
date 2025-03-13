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

    // 무기 가챠 버튼 클릭 이벤트
    randomWeaponBtn.addEventListener('click', function() {
        fetchRandomWeapon();
    });

    // 방어구 가챠 버튼 클릭 이벤트
    randomArmorBtn.addEventListener('click', function() {
        fetchRandomArmor();
    });

    // 전체 가챠 버튼 클릭 이벤트
    randomLoadoutBtn.addEventListener('click', function() {
        fetchRandomLoadout();
    });

    // 초기화 버튼 클릭 이벤트
    resetBtn.addEventListener('click', function() {
        resetAll();
    });

    // 랜덤 무기 가져오기
    function fetchRandomWeapon() {
        fetch('/gacha/weapon', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('서버 응답 오류');
                }
                return response.json();
            })
            .then(data => {
                displayWeapon(data);
            })
            .catch(error => {
                console.error('무기 가챠 오류:', error);
                alert('무기 가챠 중 오류가 발생했습니다.');
            });
    }

    // 랜덤 방어구 가져오기
    function fetchRandomArmor() {
        fetch('/gacha/armor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('서버 응답 오류');
                }
                return response.json();
            })
            .then(data => {
                displayArmor(data);
            })
            .catch(error => {
                console.error('방어구 가챠 오류:', error);
                alert('방어구 가챠 중 오류가 발생했습니다.');
            });
    }

    // 무기+방어구 전체 가져오기
    function fetchRandomLoadout() {
        fetch('/gacha/loadout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('서버 응답 오류');
                }
                return response.json();
            })
            .then(data => {
                displayWeapon(data.weapon);
                displayArmor(data.armorSet);
            })
            .catch(error => {
                console.error('전체 가챠 오류:', error);
                alert('가챠 중 오류가 발생했습니다.');
            });
    }

    // 무기 정보 화면에 표시
    function displayWeapon(weapon) {
        if (!weapon) {
            weaponResult.style.display = 'none';
            weaponEmpty.style.display = 'block';
            return;
        }

        document.getElementById('weaponName').textContent = weapon.name;
        document.getElementById('weaponType').textContent = weapon.type.korName;
        document.getElementById('weaponAttack').textContent = weapon.attack;
        document.getElementById('weaponElement').textContent = weapon.element.korName;

        // 레어도에 색상 적용
        const rarityElement = document.getElementById('weaponRarity');
        rarityElement.textContent = weapon.rarity.korName;
        rarityElement.style.backgroundColor = weapon.rarity.colorCode;

        // 이미지 업데이트 (이미지가 없을 경우 기본 이미지 사용)
        const weaponImage = document.getElementById('weaponImage');
        if (weapon.imageUrl) {
            // 이미지 경로 변환 /images/ -> /img/
            const fixedImageUrl = weapon.imageUrl.replace('/images/', '/img/');
            weaponImage.src = fixedImageUrl;
        } else {
            weaponImage.src = '/img/weapons/default.png';
        }

        // 무기 섹션 표시
        weaponResult.style.display = 'block';
        weaponEmpty.style.display = 'none';
    }

    // 방어구 정보 화면에 표시
    function displayArmor(armorSet) {
        if (!armorSet || Object.keys(armorSet).length === 0) {
            armorResult.style.display = 'none';
            armorEmpty.style.display = 'block';
            return;
        }

        // 모든 방어구 부위의 기본 상태 설정
        const armorTypes = ['head', 'chest', 'arm', 'waist', 'leg'];
        armorTypes.forEach(type => {
            document.getElementById(`${type}Info`).style.display = 'none';
            document.getElementById(`${type}Empty`).style.display = 'block';
            // 이미지 초기화
            document.getElementById(`${type}Image`).src = '/images/armor_default.png';
        });

        let totalDefense = 0;
        const totalResistance = { fire: 0, water: 0, thunder: 0, ice: 0, dragon: 0 };
        const totalSkills = {};

        // 각 방어구 표시
        for (const [armorType, armor] of Object.entries(armorSet)) {
            if (!armor) continue;

            const type = armorType.toLowerCase();

            // 방어력 누적
            totalDefense += armor.defense || 0;

            // 내성 누적
            if (armor.resistance) {
                for (const [element, value] of Object.entries(armor.resistance)) {
                    if (totalResistance.hasOwnProperty(element)) {
                        totalResistance[element] += value;
                    }
                }
            }

            // 스킬 누적
            if (armor.skills) {
                for (const [skill, level] of Object.entries(armor.skills)) {
                    if (totalSkills.hasOwnProperty(skill)) {
                        totalSkills[skill] += level;
                    } else {
                        totalSkills[skill] = level;
                    }
                }
            }

            // 방어구 상세 정보 표시
            document.getElementById(`${type}Name`).textContent = armor.name;
            document.getElementById(`${type}Defense`).textContent = armor.defense;

            // 레어도에 색상 적용
            const rarityElement = document.getElementById(`${type}Rarity`);
            rarityElement.textContent = armor.rarity.korName;
            rarityElement.style.backgroundColor = armor.rarity.colorCode;

            // 스킬 목록 표시
            const skillsElement = document.getElementById(`${type}Skills`);
            skillsElement.innerHTML = '';

            if (armor.skills) {
                for (const [skill, level] of Object.entries(armor.skills)) {
                    const li = document.createElement('li');
                    li.textContent = `${skill} Lv.${level}`;
                    skillsElement.appendChild(li);
                }
            }

            // 이미지 업데이트 (이미지가 없을 경우 기본 이미지 사용)
            const armorImage = document.getElementById(`${type}Image`);
            if (armor.imageUrl) {
                armorImage.src = armor.imageUrl;
            } else {
                armorImage.src = `/img/armors/${type}_default.png`;
            }

            // 정보 표시 전환
            document.getElementById(`${type}Info`).style.display = 'block';
            document.getElementById(`${type}Empty`).style.display = 'none';
        }

        // 총 방어력 표시
        document.getElementById('totalDefense').textContent = totalDefense;

        // 총 내성 표시
        document.getElementById('fireRes').textContent = totalResistance.fire;
        document.getElementById('waterRes').textContent = totalResistance.water;
        document.getElementById('thunderRes').textContent = totalResistance.thunder;
        document.getElementById('iceRes').textContent = totalResistance.ice;
        document.getElementById('dragonRes').textContent = totalResistance.dragon;

        // 내성 값에 따라 색상 적용
        colorResistance('fireRes', totalResistance.fire);
        colorResistance('waterRes', totalResistance.water);
        colorResistance('thunderRes', totalResistance.thunder);
        colorResistance('iceRes', totalResistance.ice);
        colorResistance('dragonRes', totalResistance.dragon);

        // 발동 스킬 목록 표시
        const totalSkillsList = document.getElementById('totalSkillsList');
        totalSkillsList.innerHTML = '';

        if (Object.keys(totalSkills).length === 0) {
            const li = document.createElement('li');
            li.textContent = '발동 스킬 없음';
            totalSkillsList.appendChild(li);
        } else {
            for (const [skill, level] of Object.entries(totalSkills)) {
                const li = document.createElement('li');
                li.textContent = `${skill} Lv.${level}`;
                totalSkillsList.appendChild(li);
            }
        }

        // 방어구 섹션 표시
        armorResult.style.display = 'block';
        armorEmpty.style.display = 'none';
    }

    // 내성 값에 따라 색상 적용
    function colorResistance(elementId, value) {
        const element = document.getElementById(elementId);

        if (value > 0) {
            element.style.color = '#198754'; // 양수: 초록색
        } else if (value < 0) {
            element.style.color = '#dc3545'; // 음수: 빨간색
        } else {
            element.style.color = ''; // 0: 기본 색상
        }
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