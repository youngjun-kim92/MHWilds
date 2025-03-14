package org.example.mhwilds.service;

import org.example.mhwilds.domain.Armor;
import org.example.mhwilds.domain.Monster;
import org.example.mhwilds.domain.Weapon;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class GachaService {

    private final List<Weapon.WeaponType> weaponTypes = new ArrayList<>();
    private final List<Monster.MonsterType> monsterTypes = new ArrayList<>();
    private final Map<Armor.ArmorType, List<Armor.ArmorRank>> armorRanks = new EnumMap<>(Armor.ArmorType.class);
    private final Random random = ThreadLocalRandom.current();

    /**
     * 서비스 초기화 시 데이터 로드
     */
    @PostConstruct
    public void initialize() {
        initializeWeaponTypes();
        initializeMonsterTypes();
        initializeArmorRanks();
    }

    /**
     * 랜덤 무기 타입 뽑기
     * @return 랜덤으로 선택된 무기 타입
     */
    public Weapon.WeaponType drawRandomWeaponType() {
        if (weaponTypes.isEmpty()) {
            throw new IllegalStateException("무기 타입 풀이 비어있습니다");
        }
        Weapon.WeaponType result = weaponTypes.get(random.nextInt(weaponTypes.size()));
        return result;
    }

    /**
     * 랜덤 몬스터 타입 뽑기
     * @return 랜덤으로 선택된 몬스터 타입
     */
    public Monster.MonsterType drawRandomMonsterType() {
        if (monsterTypes.isEmpty()) {
            throw new IllegalStateException("몬스터 타입 풀이 비어있습니다");
        }
        Monster.MonsterType result = monsterTypes.get(random.nextInt(monsterTypes.size()));
        return result;
    }

    /**
     * 랜덤 방어구 등급 뽑기 (각 부위별로 나오지 않을 수도 있음)
     * @return 랜덤으로 선택된 방어구 부위와 등급 (일부 부위는 없을 수 있음)
     */
    public Map<Armor.ArmorType, Armor.ArmorRank> drawRandomArmorRanksWithGaps() {
        Map<Armor.ArmorType, Armor.ArmorRank> armorSet = new EnumMap<>(Armor.ArmorType.class);

        for (Armor.ArmorType type : Armor.ArmorType.values()) {
            // 각 부위당 70% 확률로 방어구가 나옴 (30% 확률로 나오지 않음)
            if (random.nextDouble() <= 0.7) {
                List<Armor.ArmorRank> ranksOfType = armorRanks.get(type);
                if (ranksOfType != null && !ranksOfType.isEmpty()) {
                    armorSet.put(type, ranksOfType.get(random.nextInt(ranksOfType.size())));
                }
            }
        }

        return armorSet;
    }

    /**
     * 무기 타입과 방어구 등급 세트 함께 뽑기
     * @return 랜덤 무기 타입과 방어구 등급 세트
     */
    public Map<String, Object> drawRandomLoadout() {
        Map<String, Object> loadout = new HashMap<>();
        loadout.put("weaponType", drawRandomWeaponType());
        loadout.put("armorRanks", drawRandomArmorRanksWithGaps());
        return loadout;
    }

    /**
     * 무기 타입 초기화 - 모든 가능한 무기 타입 추가
     */
    private void initializeWeaponTypes() {
        // 모든 무기 타입 추가
        weaponTypes.addAll(Arrays.asList(Weapon.WeaponType.values()));
    }

    /**
     * 몬스터 타입 초기화 - 모든 가능한 몬스터 타입 추가
     */
    private void initializeMonsterTypes() {
        // 모든 몬스터 타입 추가
        monsterTypes.addAll(Arrays.asList(Monster.MonsterType.values()));
    }

    /**
     * 방어구 등급 초기화 - 각 부위별로 가능한 등급 추가
     */
    private void initializeArmorRanks() {
        // 각 방어구 부위별로 가능한 등급 초기화
        for (Armor.ArmorType type : Armor.ArmorType.values()) {
            List<Armor.ArmorRank> ranks = new ArrayList<>();
            // 각 등급 추가 (마스터 등급은 제외)
            ranks.add(Armor.ArmorRank.LOW_RANK);
            ranks.add(Armor.ArmorRank.HIGH_RANK);
            armorRanks.put(type, ranks);
        }
    }
}