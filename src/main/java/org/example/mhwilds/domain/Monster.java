package org.example.mhwilds.domain;

public class Monster {

    public enum MonsterType {
        CHATAKABURA("차타카브라"),
        KEMATRICE("케마트리스"),
        LAVASIOTH("라바라 바리나"),
        BABAKONGA("바바콩가"),
        BALAHARAH("발라하라"),
        DODOGAMA("도샤구마"),
        WOODTUNA("우드투나"),
        PUFUROPHORU("푸푸로포루"),
        RADAU("레 다우"),
        NERSCULA("네르스큐라"),
        HIRABAMI("히라바미"),
        AZARACAN("아자라칸"),
        NUIGDORA("누 이그드라"),
        DODOGAMA_ELDER("수호룡 도샤구마"),
        RATHALOS_ELDER("수호룡 리오레우스"),
        TRUE_DAHARD("진 다하드"),
        ODOGARON_VARIANT("수호룡 오도가론 아종"),
        SHIEU("시이우"),
        YANKUK("얀쿡크"),
        GENPREY("게리오스"),
        RATHIAN("리오레이아"),
        ANJANATH_VARIANT("수호룡 안쟈나프 아종"),
        RATHALOS("리오레우스"),
        GRAVIMOS("그라비모스"),
        BLANGONGA("도도블랑고"),
        GORE_MAGALA("고어 마가라"),
        ALSUVERDE("알슈베르도");

        private final String korName;

        MonsterType(String korName) {
            this.korName = korName;
        }

        public String getKorName() {
            return korName;
        }
    }

    private MonsterType type;

    public Monster(MonsterType type) {
        this.type = type;
    }

    public MonsterType getType() {
        return type;
    }

    public void setType(MonsterType type) {
        this.type = type;
    }
}