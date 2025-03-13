package org.example.mhwilds.service;

import org.example.mhwilds.domain.Armor;
import org.example.mhwilds.domain.Weapon;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class GachaService {

    private final List<Weapon> weaponPool = new ArrayList<>();
    private final Map<Armor.ArmorType, List<Armor>> armorPool = new EnumMap<>(Armor.ArmorType.class);
    private final Random random = ThreadLocalRandom.current();

    /**
     * 서비스 초기화 시 무기와 방어구 데이터 로드
     */
    @PostConstruct
    public void initialize() {
        initializeWeaponPool();
        initializeArmorPool();
    }

    /**
     * 랜덤 무기 뽑기
     * @return 랜덤으로 선택된 무기
     */
    public Weapon drawRandomWeapon() {
        if (weaponPool.isEmpty()) {
            throw new IllegalStateException("무기 풀이 비어있습니다");
        }
        return weaponPool.get(random.nextInt(weaponPool.size()));
    }

    /**
     * 랜덤 방어구 세트 뽑기 (각 부위별 1개씩)
     * @return 랜덤으로 선택된 방어구 세트 (부위별 맵)
     */
    public Map<Armor.ArmorType, Armor> drawRandomArmorSet() {
        Map<Armor.ArmorType, Armor> armorSet = new EnumMap<>(Armor.ArmorType.class);

        for (Armor.ArmorType type : Armor.ArmorType.values()) {
            List<Armor> armorsOfType = armorPool.get(type);
            if (armorsOfType != null && !armorsOfType.isEmpty()) {
                armorSet.put(type, armorsOfType.get(random.nextInt(armorsOfType.size())));
            }
        }

        return armorSet;
    }

    /**
     * 랜덤 방어구 세트 뽑기 (각 부위별로 나오지 않을 수도 있음)
     * @return 랜덤으로 선택된 방어구 세트 (부위별 맵, 일부 부위는 없을 수 있음)
     */
    public Map<Armor.ArmorType, Armor> drawRandomArmorSetWithGaps() {
        Map<Armor.ArmorType, Armor> armorSet = new EnumMap<>(Armor.ArmorType.class);

        for (Armor.ArmorType type : Armor.ArmorType.values()) {
            // 각 부위당 70% 확률로 방어구가 나옴 (30% 확률로 나오지 않음)
            if (random.nextDouble() <= 0.7) {
                List<Armor> armorsOfType = armorPool.get(type);
                if (armorsOfType != null && !armorsOfType.isEmpty()) {
                    armorSet.put(type, armorsOfType.get(random.nextInt(armorsOfType.size())));
                }
            }
        }

        return armorSet;
    }

    /**
     * 동일한 세트의 방어구만 뽑기
     * @return 동일 세트의 방어구 맵
     */
    public Map<Armor.ArmorType, Armor> drawSameSetArmorSet() {
        // 모든 세트 이름 수집
        Set<String> setNames = new HashSet<>();
        for (List<Armor> armors : armorPool.values()) {
            for (Armor armor : armors) {
                setNames.add(armor.getSetName());
            }
        }

        if (setNames.isEmpty()) {
            return Collections.emptyMap();
        }

        // 랜덤으로 세트 이름 선택
        List<String> setNameList = new ArrayList<>(setNames);
        String randomSetName = setNameList.get(random.nextInt(setNameList.size()));

        // 선택된 세트에 해당하는 방어구만 선택
        Map<Armor.ArmorType, Armor> sameSetArmor = new EnumMap<>(Armor.ArmorType.class);

        for (Armor.ArmorType type : Armor.ArmorType.values()) {
            List<Armor> armorsOfType = armorPool.get(type);
            if (armorsOfType != null) {
                for (Armor armor : armorsOfType) {
                    if (armor.getSetName().equals(randomSetName)) {
                        sameSetArmor.put(type, armor);
                        break;
                    }
                }
            }
        }

        return sameSetArmor;
    }

    /**
     * 무기와 방어구 세트 함께 뽑기
     * @return 랜덤 무기와 방어구 세트
     */
    public Map<String, Object> drawRandomLoadout() {
        Map<String, Object> loadout = new HashMap<>();
        loadout.put("weapon", drawRandomWeapon());
        loadout.put("armorSet", drawRandomArmorSet());
        return loadout;
    }

    /**
     * 특정 무기 타입만 뽑기
     * @param weaponType 무기 타입
     * @return 특정 타입의 랜덤 무기
     */
    public Weapon drawSpecificWeaponType(Weapon.WeaponType weaponType) {
        List<Weapon> specificTypeWeapons = weaponPool.stream()
                .filter(weapon -> weapon.getType() == weaponType)
                .toList();

        if (specificTypeWeapons.isEmpty()) {
            throw new IllegalArgumentException("해당 타입의 무기가 없습니다: " + weaponType);
        }

        return specificTypeWeapons.get(random.nextInt(specificTypeWeapons.size()));
    }

    /**
     * 무기 데이터 초기화
     */
    private void initializeWeaponPool() {
        // 대검
        weaponPool.add(Weapon.builder()
                .id(1L)
                .name("자갈투성이")
                .type(Weapon.WeaponType.GREAT_SWORD)
                .attack(1248)
                .element(Weapon.ElementType.NONE)
                .rarity(Weapon.RarityType.RARE_6)
                .imageUrl("/images/weapons/great_sword_1.png")
                .build());

        weaponPool.add(Weapon.builder()
                .id(2L)
                .name("재거너스")
                .type(Weapon.WeaponType.GREAT_SWORD)
                .attack(1296)
                .element(Weapon.ElementType.NONE)
                .rarity(Weapon.RarityType.RARE_7)
                .imageUrl("/images/weapons/great_sword_2.png")
                .build());

        weaponPool.add(Weapon.builder()
                .id(3L)
                .name("이그니션")
                .type(Weapon.WeaponType.GREAT_SWORD)
                .attack(1344)
                .element(Weapon.ElementType.FIRE)
                .rarity(Weapon.RarityType.RARE_8)
                .imageUrl("/img/weapons/great_sword_3.png")
                .build());

        // 태도
        weaponPool.add(Weapon.builder()
                .id(4L)
                .name("신뢰의 날")
                .type(Weapon.WeaponType.LONG_SWORD)
                .attack(792)
                .element(Weapon.ElementType.NONE)
                .rarity(Weapon.RarityType.RARE_6)
                .imageUrl("/images/weapons/long_sword_1.png")
                .build());

        weaponPool.add(Weapon.builder()
                .id(5L)
                .name("멸진도")
                .type(Weapon.WeaponType.LONG_SWORD)
                .attack(825)
                .element(Weapon.ElementType.DRAGON)
                .rarity(Weapon.RarityType.RARE_7)
                .imageUrl("/images/weapons/long_sword_2.png")
                .build());

        weaponPool.add(Weapon.builder()
                .id(6L)
                .name("다인 왕검")
                .type(Weapon.WeaponType.LONG_SWORD)
                .attack(858)
                .element(Weapon.ElementType.THUNDER)
                .rarity(Weapon.RarityType.RARE_8)
                .imageUrl("/images/weapons/long_sword_3.png")
                .build());

        // 쌍검
        weaponPool.add(Weapon.builder()
                .id(7L)
                .name("화룡쌍도")
                .type(Weapon.WeaponType.DUAL_BLADES)
                .attack(322)
                .element(Weapon.ElementType.FIRE)
                .rarity(Weapon.RarityType.RARE_7)
                .imageUrl("/images/weapons/dual_blades_1.png")
                .build());

        weaponPool.add(Weapon.builder()
                .id(8L)
                .name("뇌전쌍도")
                .type(Weapon.WeaponType.DUAL_BLADES)
                .attack(336)
                .element(Weapon.ElementType.THUNDER)
                .rarity(Weapon.RarityType.RARE_8)
                .imageUrl("/images/weapons/dual_blades_2.png")
                .build());

        // 랜스
        weaponPool.add(Weapon.builder()
                .id(9L)
                .name("붉은 맹습")
                .type(Weapon.WeaponType.LANCE)
                .attack(460)
                .element(Weapon.ElementType.FIRE)
                .rarity(Weapon.RarityType.RARE_7)
                .imageUrl("/images/weapons/lance_1.png")
                .build());

        weaponPool.add(Weapon.builder()
                .id(10L)
                .name("사자왕의 랜스")
                .type(Weapon.WeaponType.LANCE)
                .attack(483)
                .element(Weapon.ElementType.NONE)
                .rarity(Weapon.RarityType.RARE_8)
                .imageUrl("/images/weapons/lance_2.png")
                .build());

        // 건랜스
        weaponPool.add(Weapon.builder()
                .id(11L)
                .name("왕의 건랜스")
                .type(Weapon.WeaponType.GUNLANCE)
                .attack(598)
                .element(Weapon.ElementType.NONE)
                .rarity(Weapon.RarityType.RARE_7)
                .imageUrl("/images/weapons/gunlance_1.png")
                .build());

        weaponPool.add(Weapon.builder()
                .id(12L)
                .name("암용의 건랜스")
                .type(Weapon.WeaponType.GUNLANCE)
                .attack(621)
                .element(Weapon.ElementType.DRAGON)
                .rarity(Weapon.RarityType.RARE_8)
                .imageUrl("/images/weapons/gunlance_2.png")
                .build());

        // 활
        weaponPool.add(Weapon.builder()
                .id(13L)
                .name("파멸의 활")
                .type(Weapon.WeaponType.BOW)
                .attack(312)
                .element(Weapon.ElementType.DRAGON)
                .rarity(Weapon.RarityType.RARE_7)
                .imageUrl("/images/weapons/bow_1.png")
                .build());

        weaponPool.add(Weapon.builder()
                .id(14L)
                .name("천재의 활")
                .type(Weapon.WeaponType.BOW)
                .attack(336)
                .element(Weapon.ElementType.THUNDER)
                .rarity(Weapon.RarityType.RARE_8)
                .imageUrl("/images/weapons/bow_2.png")
                .build());
    }

    /**
     * 방어구 데이터 초기화
     */
    private void initializeArmorPool() {
        // 초기화
        for (Armor.ArmorType type : Armor.ArmorType.values()) {
            armorPool.put(type, new ArrayList<>());
        }

        // 리오소울 세트 (레어 7)
        addRathalosArmorSet();

        // 네르기간테 세트 (레어 8)
        addNergiganteArmorSet();

        // 오도가론 세트 (레어 7)
        addOdogaronArmorSet();
    }

    /**
     * 리오소울 세트 추가
     */
    private void addRathalosArmorSet() {
        // 리오소울 저항
        Map<String, Integer> rathalosResistance = new HashMap<>();
        rathalosResistance.put("fire", 3);
        rathalosResistance.put("water", -2);
        rathalosResistance.put("thunder", 0);
        rathalosResistance.put("ice", -1);
        rathalosResistance.put("dragon", -3);

        // 투구
        Map<String, Integer> rathalosHeadSkills = new HashMap<>();
        rathalosHeadSkills.put("공격", 2);
        rathalosHeadSkills.put("약점 특효", 1);

        armorPool.get(Armor.ArmorType.HEAD).add(Armor.builder()
                .id(1L)
                .name("리오소울 헬름")
                .type(Armor.ArmorType.HEAD)
                .defense(68)
                .rarity(Armor.RarityType.RARE_7)
                .resistance(new HashMap<>(rathalosResistance))
                .skills(rathalosHeadSkills)
                .imageUrl("/images/armors/rathalos_head.png")
                .setName("리오소울")
                .build());

        // 갑옷
        Map<String, Integer> rathalosChestSkills = new HashMap<>();
        rathalosChestSkills.put("약점 특효", 1);
        rathalosChestSkills.put("체력 회복량 UP", 1);

        armorPool.get(Armor.ArmorType.CHEST).add(Armor.builder()
                .id(2L)
                .name("리오소울 메일")
                .type(Armor.ArmorType.CHEST)
                .defense(68)
                .rarity(Armor.RarityType.RARE_7)
                .resistance(new HashMap<>(rathalosResistance))
                .skills(rathalosChestSkills)
                .imageUrl("/images/armors/rathalos_chest.png")
                .setName("리오소울")
                .build());

        // 팔 보호구
        Map<String, Integer> rathalosArmSkills = new HashMap<>();
        rathalosArmSkills.put("공격", 1);
        rathalosArmSkills.put("약점 특효", 1);

        armorPool.get(Armor.ArmorType.ARM).add(Armor.builder()
                .id(3L)
                .name("리오소울 팔보호구")
                .type(Armor.ArmorType.ARM)
                .defense(68)
                .rarity(Armor.RarityType.RARE_7)
                .resistance(new HashMap<>(rathalosResistance))
                .skills(rathalosArmSkills)
                .imageUrl("/images/armors/rathalos_arm.png")
                .setName("리오소울")
                .build());

        // 허리 보호구
        Map<String, Integer> rathalosWaistSkills = new HashMap<>();
        rathalosWaistSkills.put("날카로움", 1);
        rathalosWaistSkills.put("통상탄/연사확장", 1);

        armorPool.get(Armor.ArmorType.WAIST).add(Armor.builder()
                .id(4L)
                .name("리오소울 코일")
                .type(Armor.ArmorType.WAIST)
                .defense(68)
                .rarity(Armor.RarityType.RARE_7)
                .resistance(new HashMap<>(rathalosResistance))
                .skills(rathalosWaistSkills)
                .imageUrl("/images/armors/rathalos_waist.png")
                .setName("리오소울")
                .build());

        // 다리 보호구
        Map<String, Integer> rathalosLegSkills = new HashMap<>();
        rathalosLegSkills.put("점프 달인", 1);
        rathalosLegSkills.put("체력 회복량 UP", 1);

        armorPool.get(Armor.ArmorType.LEG).add(Armor.builder()
                .id(5L)
                .name("리오소울 그리브")
                .type(Armor.ArmorType.LEG)
                .defense(68)
                .rarity(Armor.RarityType.RARE_7)
                .resistance(new HashMap<>(rathalosResistance))
                .skills(rathalosLegSkills)
                .imageUrl("/images/armors/rathalos_leg.png")
                .setName("리오소울")
                .build());
    }

    /**
     * 네르기간테 세트 추가
     */
    private void addNergiganteArmorSet() {
        // 네르기간테 저항
        Map<String, Integer> nergResistance = new HashMap<>();
        nergResistance.put("fire", 1);
        nergResistance.put("water", 1);
        nergResistance.put("thunder", 1);
        nergResistance.put("ice", 1);
        nergResistance.put("dragon", -3);

        // 투구
        Map<String, Integer> nergHeadSkills = new HashMap<>();
        nergHeadSkills.put("패기", 1);
        nergHeadSkills.put("최대 체력 증가", 1);

        armorPool.get(Armor.ArmorType.HEAD).add(Armor.builder()
                .id(6L)
                .name("네르기간테 투구")
                .type(Armor.ArmorType.HEAD)
                .defense(72)
                .rarity(Armor.RarityType.RARE_8)
                .resistance(new HashMap<>(nergResistance))
                .skills(nergHeadSkills)
                .imageUrl("/images/armors/nergigante_head.png")
                .setName("네르기간테")
                .build());

        // 갑옷
        Map<String, Integer> nergChestSkills = new HashMap<>();
        nergChestSkills.put("패기", 1);
        nergChestSkills.put("공격", 1);

        armorPool.get(Armor.ArmorType.CHEST).add(Armor.builder()
                .id(7L)
                .name("네르기간테 메일")
                .type(Armor.ArmorType.CHEST)
                .defense(72)
                .rarity(Armor.RarityType.RARE_8)
                .resistance(new HashMap<>(nergResistance))
                .skills(nergChestSkills)
                .imageUrl("/images/armors/nergigante_chest.png")
                .setName("네르기간테")
                .build());

        // 팔 보호구
        Map<String, Integer> nergArmSkills = new HashMap<>();
        nergArmSkills.put("패기", 1);
        nergArmSkills.put("스태미나 급속 회복", 1);

        armorPool.get(Armor.ArmorType.ARM).add(Armor.builder()
                .id(8L)
                .name("네르기간테 팔보호구")
                .type(Armor.ArmorType.ARM)
                .defense(72)
                .rarity(Armor.RarityType.RARE_8)
                .resistance(new HashMap<>(nergResistance))
                .skills(nergArmSkills)
                .imageUrl("/images/armors/nergigante_arm.png")
                .setName("네르기간테")
                .build());

        // 허리 보호구
        Map<String, Integer> nergWaistSkills = new HashMap<>();
        nergWaistSkills.put("패기", 1);
        nergWaistSkills.put("공격", 1);

        armorPool.get(Armor.ArmorType.WAIST).add(Armor.builder()
                .id(9L)
                .name("네르기간테 코일")
                .type(Armor.ArmorType.WAIST)
                .defense(72)
                .rarity(Armor.RarityType.RARE_8)
                .resistance(new HashMap<>(nergResistance))
                .skills(nergWaistSkills)
                .imageUrl("/images/armors/nergigante_waist.png")
                .setName("네르기간테")
                .build());

        // 다리 보호구
        Map<String, Integer> nergLegSkills = new HashMap<>();
        nergLegSkills.put("패기", 1);
        nergLegSkills.put("날카로움", 1);

        armorPool.get(Armor.ArmorType.LEG).add(Armor.builder()
                .id(10L)
                .name("네르기간테 그리브")
                .type(Armor.ArmorType.LEG)
                .defense(72)
                .rarity(Armor.RarityType.RARE_8)
                .resistance(new HashMap<>(nergResistance))
                .skills(nergLegSkills)
                .imageUrl("/images/armors/nergigante_leg.png")
                .setName("네르기간테")
                .build());
    }

    /**
     * 오도가론 세트 추가
     */
    private void addOdogaronArmorSet() {
        // 오도가론 저항
        Map<String, Integer> odoResistance = new HashMap<>();
        odoResistance.put("fire", 2);
        odoResistance.put("water", 2);
        odoResistance.put("thunder", -2);
        odoResistance.put("ice", -3);
        odoResistance.put("dragon", 2);

        // 투구
        Map<String, Integer> odoHeadSkills = new HashMap<>();
        odoHeadSkills.put("치명타 강화", 1);
        odoHeadSkills.put("체력 회복량 UP", 1);

        armorPool.get(Armor.ArmorType.HEAD).add(Armor.builder()
                .id(11L)
                .name("오도가론 헬름")
                .type(Armor.ArmorType.HEAD)
                .defense(64)
                .rarity(Armor.RarityType.RARE_7)
                .resistance(new HashMap<>(odoResistance))
                .skills(odoHeadSkills)
                .imageUrl("/images/armors/odogaron_head.png")
                .setName("오도가론")
                .build());

        // 갑옷
        Map<String, Integer> odoChestSkills = new HashMap<>();
        odoChestSkills.put("치명타 강화", 1);
        odoChestSkills.put("회심", 1);

        armorPool.get(Armor.ArmorType.CHEST).add(Armor.builder()
                .id(12L)
                .name("오도가론 메일")
                .type(Armor.ArmorType.CHEST)
                .defense(64)
                .rarity(Armor.RarityType.RARE_7)
                .resistance(new HashMap<>(odoResistance))
                .skills(odoChestSkills)
                .imageUrl("/images/armors/odogaron_chest.png")
                .setName("오도가론")
                .build());

        // 팔 보호구
        Map<String, Integer> odoArmSkills = new HashMap<>();
        odoArmSkills.put("회심", 1);
        odoArmSkills.put("속성 공격 강화", 1);

        armorPool.get(Armor.ArmorType.ARM).add(Armor.builder()
                .id(13L)
                .name("오도가론 팔보호구")
                .type(Armor.ArmorType.ARM)
                .defense(64)
                .rarity(Armor.RarityType.RARE_7)
                .resistance(new HashMap<>(odoResistance))
                .skills(odoArmSkills)
                .imageUrl("/images/armors/odogaron_arm.png")
                .setName("오도가론")
                .build());

        // 허리 보호구
        Map<String, Integer> odoWaistSkills = new HashMap<>();
        odoWaistSkills.put("날카로움", 1);
        odoWaistSkills.put("출혈 내성", 1);

        armorPool.get(Armor.ArmorType.WAIST).add(Armor.builder()
                .id(14L)
                .name("오도가론 코일")
                .type(Armor.ArmorType.WAIST)
                .defense(64)
                .rarity(Armor.RarityType.RARE_7)
                .resistance(new HashMap<>(odoResistance))
                .skills(odoWaistSkills)
                .imageUrl("/images/armors/odogaron_waist.png")
                .setName("오도가론")
                .build());

        // 다리 보호구
        Map<String, Integer> odoLegSkills = new HashMap<>();
        odoLegSkills.put("회심", 1);
        odoLegSkills.put("빠른 납도", 1);

        armorPool.get(Armor.ArmorType.LEG).add(Armor.builder()
                .id(15L)
                .name("오도가론 그리브")
                .type(Armor.ArmorType.LEG)
                .defense(64)
                .rarity(Armor.RarityType.RARE_7)
                .resistance(new HashMap<>(odoResistance))
                .skills(odoLegSkills)
                .imageUrl("/images/armors/odogaron_leg.png")
                .setName("오도가론")
                .build());
    }
}