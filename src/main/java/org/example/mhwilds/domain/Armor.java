package org.example.mhwilds.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Armor {
    private Long id;
    private String name;                    // 방어구 이름
    private ArmorType type;                 // 방어구 타입 (투구, 갑옷, 팔, 허리, 다리)
    private int defense;                    // 방어력
    private RarityType rarity;              // 레어도
    private Map<String, Integer> resistance; // 속성 저항 (화, 수, 뇌, 빙, 용)
    private Map<String, Integer> skills;    // 스킬 (스킬명, 레벨)
    private String imageUrl;                // 이미지 경로
    private String setName;                 // 세트 이름 (예: 리오소울, 네르기간테 등)

    /**
     * 방어구 타입 열거형
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