package org.example.mhwilds.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 가챠 시스템 설정을 저장하는 모델 클래스
 * JSON으로 직렬화/역직렬화 가능
 */
public class GachaSettings {

    /**
     * 럭키 확률 (0.0 ~ 1.0 사이 값)
     */
    private double luckyChance;

    /**
     * 일반 몬스터에 대한 기본 상위 방어구 확정 개수
     */
    private int defaultHighRankCount;

    /**
     * 특별 몬스터에 대한 상위 방어구 확정 개수
     */
    private int specialHighRankCount;

    /**
     * 특별 몬스터 목록 (상위 방어구 추가 확정)
     */
    private List<String> specialMonsters;

    /**
     * 마지막 업데이트 시간 (밀리초 타임스탬프)
     */
    private long lastUpdated;

    /**
     * 기본 생성자 (JSON 직렬화용)
     */
    public GachaSettings() {
        // 비어있는 생성자 - Jackson에서 필요함
        this.lastUpdated = System.currentTimeMillis();
    }

    /**
     * 전체 필드 생성자
     */
    public GachaSettings(double luckyChance, int defaultHighRankCount,
                         int specialHighRankCount, List<String> specialMonsters) {
        this.luckyChance = luckyChance;
        this.defaultHighRankCount = defaultHighRankCount;
        this.specialHighRankCount = specialHighRankCount;
        this.specialMonsters = specialMonsters;
        this.lastUpdated = System.currentTimeMillis();
    }

    /**
     * 기본 설정 객체 가져오기
     */
    public static GachaSettings getDefault() {
        return new GachaSettings(
                0.01, // 기본 1% 확률
                1,    // 일반 몬스터: 상위 방어구 1개 확정
                2,    // 특별 몬스터: 상위 방어구 2개 확정
                Arrays.asList("TRUE_DAHARD", "ALSUVERDE", "GORE_MAGALA", "RADAU", "WOODTUNA")
        );
    }

    // Getter 및 Setter 메서드
    public double getLuckyChance() {
        return luckyChance;
    }

    public void setLuckyChance(double luckyChance) {
        this.luckyChance = luckyChance;
    }

    public int getDefaultHighRankCount() {
        return defaultHighRankCount;
    }

    public void setDefaultHighRankCount(int defaultHighRankCount) {
        this.defaultHighRankCount = defaultHighRankCount;
    }

    public int getSpecialHighRankCount() {
        return specialHighRankCount;
    }

    public void setSpecialHighRankCount(int specialHighRankCount) {
        this.specialHighRankCount = specialHighRankCount;
    }

    public List<String> getSpecialMonsters() {
        return specialMonsters;
    }

    public void setSpecialMonsters(List<String> specialMonsters) {
        this.specialMonsters = specialMonsters;
    }

    public long getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(long lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    /**
     * 설정 업데이트 시 마지막 업데이트 시간 갱신
     */
    public void updateTimestamp() {
        this.lastUpdated = System.currentTimeMillis();
    }

    @Override
    public String toString() {
        return "GachaSettings{" +
                "luckyChance=" + luckyChance +
                ", defaultHighRankCount=" + defaultHighRankCount +
                ", specialHighRankCount=" + specialHighRankCount +
                ", specialMonsters=" + specialMonsters +
                ", lastUpdated=" + lastUpdated +
                '}';
    }
}