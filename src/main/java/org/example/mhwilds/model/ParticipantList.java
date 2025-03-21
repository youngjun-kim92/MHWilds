package org.example.mhwilds.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 참가자 명단 관리 모델 클래스
 * JSON으로 직렬화/역직렬화 가능
 */
public class ParticipantList {

    /**
     * 참가자 목록
     */
    private List<Participant> participants;

    /**
     * 마지막 업데이트 시간 (밀리초 타임스탬프)
     */
    private long lastUpdated;

    /**
     * 기본 생성자 (JSON 직렬화용)
     */
    public ParticipantList() {
        this.participants = new ArrayList<>();
        this.lastUpdated = System.currentTimeMillis();
    }

    /**
     * 참가자 추가
     */
    public void addParticipant(String name, String discordId) {
        Participant participant = new Participant(UUID.randomUUID().toString(), name, discordId);
        participants.add(participant);
        this.lastUpdated = System.currentTimeMillis();
    }

    /**
     * 참가자 제거
     */
    public boolean removeParticipant(String id) {
        boolean removed = participants.removeIf(p -> p.getId().equals(id));
        if (removed) {
            this.lastUpdated = System.currentTimeMillis();
        }
        return removed;
    }

    /**
     * 참가자 전체 목록 가져오기
     */
    public List<Participant> getParticipants() {
        return participants;
    }

    public void setParticipants(List<Participant> participants) {
        this.participants = participants;
        this.lastUpdated = System.currentTimeMillis();
    }

    public long getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(long lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    /**
     * 랜덤으로 참가자 선택
     * @param count 선택할 참가자 수 (1-4명)
     * @return 선택된 참가자 목록
     */
    public List<Participant> selectRandomParticipants(int count) {
        // 선택할 수 있는 최대 참가자 수를 참가자 목록 크기로 제한
        int selectCount = Math.min(count, participants.size());

        // 1명 미만이거나 4명 초과인 경우 조정
        selectCount = Math.max(1, Math.min(selectCount, 4));

        // 결과 목록 초기화
        List<Participant> selected = new ArrayList<>();

        // 참가자 목록의 복사본 생성 (원본 목록 변경 방지)
        List<Participant> tempList = new ArrayList<>(participants);

        // 필요한 수만큼 랜덤 선택
        for (int i = 0; i < selectCount && !tempList.isEmpty(); i++) {
            int randomIndex = (int) (Math.random() * tempList.size());
            selected.add(tempList.remove(randomIndex));
        }

        return selected;
    }

    /**
     * 참가자 엔티티 클래스
     */
    public static class Participant {
        private String id;
        private String name;
        private String discordId;

        // 기본 생성자 (JSON 직렬화용)
        public Participant() {
        }

        public Participant(String id, String name, String discordId) {
            this.id = id;
            this.name = name;
            this.discordId = discordId;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDiscordId() {
            return discordId;
        }

        public void setDiscordId(String discordId) {
            this.discordId = discordId;
        }

        @Override
        public String toString() {
            return "Participant{" +
                    "id='" + id + '\'' +
                    ", name='" + name + '\'' +
                    ", discordId='" + discordId + '\'' +
                    '}';
        }
    }
}