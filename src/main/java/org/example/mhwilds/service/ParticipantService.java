package org.example.mhwilds.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.mhwilds.model.ParticipantList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

/**
 * 참가자 명단 관리 서비스
 */
@Service
public class ParticipantService {

    private static final Logger logger = LoggerFactory.getLogger(ParticipantService.class);
    private static final String PARTICIPANTS_FILE = "participants.json";

    // AtomicReference를 사용하여 스레드 안전하게 참가자 목록 참조 관리
    private static final AtomicReference<ParticipantList> participantsRef = new AtomicReference<>();

    // ObjectMapper는 스레드 안전하므로 정적으로 선언
    private static final ObjectMapper objectMapper = new ObjectMapper();

    // 최종 수정 시간 저장 (변경 감지용)
    private long lastModified = 0;

    @PostConstruct
    public void init() {
        // 서비스 시작 시 참가자 목록 로드
        loadParticipants();

        // 백그라운드에서 파일 변경 감지 스레드 시작
        startFileWatcher();
    }

    /**
     * 현재 참가자 목록 가져오기 (스레드 안전)
     */
    public ParticipantList getParticipants() {
        ParticipantList participants = participantsRef.get();
        if (participants == null) {
            // 아직 로드되지 않았으면 로드
            loadParticipants();
            participants = participantsRef.get();

            // 여전히 null이면 빈 목록 생성
            if (participants == null) {
                participants = new ParticipantList();
                saveParticipants(participants);
            }
        }
        return participants;
    }

    /**
     * 참가자 추가
     */
    public synchronized void addParticipant(String name, String discordId) {
        ParticipantList participants = getParticipants();
        participants.addParticipant(name, discordId);
        saveParticipants(participants);
        logger.info("참가자가 추가되었습니다: {}, {}", name, discordId);
    }

    /**
     * 참가자 제거
     */
    public synchronized boolean removeParticipant(String id) {
        ParticipantList participants = getParticipants();
        boolean removed = participants.removeParticipant(id);
        if (removed) {
            saveParticipants(participants);
            logger.info("참가자가 제거되었습니다: {}", id);
        }
        return removed;
    }

    /**
     * 참가자 목록 업데이트
     */
    public synchronized void updateParticipants(ParticipantList newParticipants) {
        newParticipants.setLastUpdated(System.currentTimeMillis());
        saveParticipants(newParticipants);
        participantsRef.set(newParticipants);
        logger.info("참가자 목록이 업데이트 되었습니다: {} 명", newParticipants.getParticipants().size());
    }

    /**
     * 랜덤으로 참가자 선택
     * @param count 선택할 참가자 수 (1-4명)
     * @return 선택된 참가자 목록
     */
    public List<ParticipantList.Participant> selectRandomParticipants(int count) {
        return getParticipants().selectRandomParticipants(count);
    }

    /**
     * 참가자 목록 초기화
     */
    public synchronized void resetParticipants() {
        ParticipantList emptyList = new ParticipantList();
        saveParticipants(emptyList);
        participantsRef.set(emptyList);
        logger.info("참가자 목록이 초기화되었습니다");
    }

    /**
     * 참가자 목록 파일에서 로드
     */
    private synchronized void loadParticipants() {
        try {
            File file = new File(PARTICIPANTS_FILE);

            // 파일이 없으면 빈 목록 사용
            if (!file.exists()) {
                logger.info("참가자 목록 파일이 없습니다. 빈 목록을 생성합니다.");
                ParticipantList emptyList = new ParticipantList();
                participantsRef.set(emptyList);
                saveParticipants(emptyList);
                return;
            }

            // 파일 마지막 수정 시간 저장
            lastModified = file.lastModified();

            // JSON 파일에서 참가자 목록 로드
            ParticipantList participants = objectMapper.readValue(file, ParticipantList.class);
            participantsRef.set(participants);

            logger.info("참가자 목록이 파일에서 로드되었습니다: {} 명", participants.getParticipants().size());
        } catch (IOException e) {
            logger.error("참가자 목록 파일 로드 중 오류 발생", e);

            // 오류 발생 시 빈 목록 사용
            ParticipantList emptyList = new ParticipantList();
            participantsRef.set(emptyList);

            // 파일이 손상되었을 수 있으므로 다시 저장
            try {
                saveParticipants(emptyList);
            } catch (Exception ex) {
                logger.error("참가자 목록 파일 복구 중 오류 발생", ex);
            }
        }
    }

    /**
     * 참가자 목록을 파일에 저장
     */
    private synchronized void saveParticipants(ParticipantList participants) {
        try {
            // JSON 형식으로 참가자 목록 저장
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(new File(PARTICIPANTS_FILE), participants);

            // 파일 마지막 수정 시간 업데이트
            lastModified = new File(PARTICIPANTS_FILE).lastModified();

            logger.info("참가자 목록이 파일에 저장되었습니다: {}", PARTICIPANTS_FILE);
        } catch (IOException e) {
            logger.error("참가자 목록 파일 저장 중 오류 발생", e);
            throw new RuntimeException("참가자 목록 저장 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 파일 변경 감지 스레드 시작
     * 다른 서버 인스턴스에서 파일이 변경된 경우를 감지
     */
    private void startFileWatcher() {
        Thread watcherThread = new Thread(() -> {
            while (true) {
                try {
                    // 5초마다 파일 변경 확인
                    Thread.sleep(5000);

                    File file = new File(PARTICIPANTS_FILE);
                    if (file.exists() && file.lastModified() > lastModified) {
                        logger.info("참가자 목록 파일이 변경되었습니다. 다시 로드합니다.");
                        loadParticipants();
                    }
                } catch (InterruptedException e) {
                    logger.warn("파일 감시 스레드 중단됨", e);
                    Thread.currentThread().interrupt();
                    break;
                } catch (Exception e) {
                    logger.error("파일 감시 중 오류 발생", e);
                }
            }
        });

        watcherThread.setDaemon(true);
        watcherThread.setName("participants-file-watcher");
        watcherThread.start();

        logger.info("참가자 목록 파일 변경 감지 스레드가 시작되었습니다");
    }
}