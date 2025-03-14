package org.example.mhwilds.domain;

/**
 * 무기 관련 도메인 클래스
 */
public class Weapon {

    /**
     * 무기 종류 열거형
     */
    public enum WeaponType {
        GREAT_SWORD("대검"),
        LONG_SWORD("태도"),
        SWORD_AND_SHIELD("한손검"),
        DUAL_BLADES("쌍검"),
        HAMMER("해머"),
        HUNTING_HORN("수렵피리"),
        LANCE("랜스"),
        GUNLANCE("건랜스"),
        SWITCH_AXE("슬래시액스"),
        CHARGE_BLADE("차지액스"),
        INSECT_GLAIVE("조충곤"),
        LIGHT_BOWGUN("라이트보우건"),
        HEAVY_BOWGUN("헤비보우건"),
        BOW("활");

        private final String korName;

        WeaponType(String korName) {
            this.korName = korName;
        }

        public String getKorName() {
            return korName;
        }
    }

    private WeaponType type;
    private String name;

    // Getters and Setters
    public WeaponType getType() {
        return type;
    }

    public void setType(WeaponType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}