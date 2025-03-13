package org.example.mhwilds.domain;

/**
 * 무기 도메인 클래스 - 단순화된 버전
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

    /**
     * 속성 열거형
     */
    public enum ElementType {
        NONE("무속성"),
        FIRE("화속성"),
        WATER("수속성"),
        THUNDER("뇌속성"),
        ICE("빙속성"),
        DRAGON("용속성");

        private final String korName;

        ElementType(String korName) {
            this.korName = korName;
        }

        public String getKorName() {
            return korName;
        }
    }

    /**
     * 레어도 열거형
     */
    public enum RarityType {
        RARE_1("레어 1", "#FFFFFF"),
        RARE_2("레어 2", "#AAFFAA"),
        RARE_3("레어 3", "#55FF55"),
        RARE_4("레어 4", "#AAAAFF"),
        RARE_5("레어 5", "#5555FF"),
        RARE_6("레어 6", "#FFAAFF"),
        RARE_7("레어 7", "#FF55FF"),
        RARE_8("레어 8", "#FFAA55"),
        RARE_9("레어 9", "#FF5555"),
        RARE_10("레어 10", "#FF9999");

        private final String korName;
        private final String colorCode;

        RarityType(String korName, String colorCode) {
            this.korName = korName;
            this.colorCode = colorCode;
        }

        public String getKorName() {
            return korName;
        }

        public String getColorCode() {
            return colorCode;
        }
    }
}