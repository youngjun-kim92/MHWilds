package org.example.mhwilds.domain;

/**
 * 방어구 도메인 클래스 - 단순화된 버전
 */
public class Armor {

    /**
     * 방어구 타입 열거형
     */
    public enum ArmorType {
        HEAD("투구", "머리를 보호하는 장비입니다."),
        CHEST("갑옷", "상체를 보호하는 장비입니다."),
        ARM("팔보호구", "팔을 보호하는 장비입니다."),
        WAIST("허리보호구", "허리를 보호하는 장비입니다."),
        LEG("다리보호구", "다리를 보호하는 장비입니다.");

        private final String korName;
        private final String description;

        ArmorType(String korName, String description) {
            this.korName = korName;
            this.description = description;
        }

        public String getKorName() {
            return korName;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * 방어구 등급 열거형 (상위/하위 등급)
     */
    public enum ArmorRank {
        LOW_RANK("하위", "초심자용 방어구로 비교적 제작이 쉽습니다."),
        HIGH_RANK("상위", "중급자용 방어구로 더 높은 방어력과 스킬을 제공합니다."),
        MASTER_RANK("마스터", "고급자용 방어구로 최고의 성능을 제공합니다.");

        private final String korName;
        private final String description;

        ArmorRank(String korName, String description) {
            this.korName = korName;
            this.description = description;
        }

        public String getKorName() {
            return korName;
        }

        public String getDescription() {
            return description;
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