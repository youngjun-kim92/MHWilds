package org.example.mhwilds.domain;

/**
 * 방어구 관련 도메인 클래스
 */
public class Armor {

    /**
     * 방어구 부위 열거형
     */
    public enum ArmorType {
        HEAD("투구"),
        CHEST("갑옷"),
        ARM("팔보호구"),
        WAIST("허리보호구"),
        LEG("다리보호구");

        private final String korName;

        ArmorType(String korName) {
            this.korName = korName;
        }

        public String getKorName() {
            return korName;
        }
    }

    /**
     * 방어구 등급 열거형
     */
    public enum ArmorRank {
        LOW_RANK("하위"),
        HIGH_RANK("상위"),
        MASTER_RANK("마스터"); // 현재 사용되지 않음

        private final String korName;

        ArmorRank(String korName) {
            this.korName = korName;
        }

        public String getKorName() {
            return korName;
        }
    }

    private ArmorType type;
    private ArmorRank rank;
    private String name;

    // Getters and Setters
    public ArmorType getType() {
        return type;
    }

    public void setType(ArmorType type) {
        this.type = type;
    }

    public ArmorRank getRank() {
        return rank;
    }

    public void setRank(ArmorRank rank) {
        this.rank = rank;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}