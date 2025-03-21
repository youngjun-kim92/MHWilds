package org.example.mhwilds.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.mhwilds.model.GachaSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.concurrent.atomic.AtomicReference;

/**
 * 가챠 설정 관리 서비스
 * 모든 IP에서 실시간으로 적용되는 설정 관리
 */
@Service
public class SettingsService {

    private static final Logger logger = LoggerFactory.getLogger(SettingsService.class);
    private static final String SETTINGS_FILE = "gacha_settings.json";

    // AtomicReference를 사용하여 스레드 안전하게 설정 참조 관리
    private static final AtomicReference<GachaSettings> settingsRef = new AtomicReference<>();

    // ObjectMapper는 스레드 안전하므로 정적으로 선언
    private static final ObjectMapper objectMapper = new ObjectMapper();

    // 최종 수정 시간 저장 (변경 감지용)
    private long lastModified = 0;

    @PostConstruct
    public void init() {
        // 서비스 시작 시 설정 로드
        loadSettings();

        // 백그라운드에서 파일 변경 감지 스레드 시작
        startFileWatcher();
    }

    /**
     * 현재 가챠 설정 가져오기 (스레드 안전)
     */
    public GachaSettings getSettings() {
        GachaSettings settings = settingsRef.get();
        if (settings == null) {
            // 아직 로드되지 않았으면 로드
            loadSettings();
            settings = settingsRef.get();

            // 여전히 null이면 기본값 생성
            if (settings == null) {
                settings = GachaSettings.getDefault();
                saveSettings(settings);
            }
        }
        return settings;
    }

    /**
     * 설정 업데이트 - 모든 클라이언트에 실시간 적용
     */
    public synchronized void updateSettings(GachaSettings newSettings) {
        // 유효성 검사
        validateSettings(newSettings);

        // 설정 저장 (파일에 쓰기)
        saveSettings(newSettings);

        // 메모리에 있는 참조 업데이트
        settingsRef.set(newSettings);

        logger.info("가챠 설정이 업데이트 되었습니다: {}", newSettings);
    }

    /**
     * 설정 초기화 - 기본값으로 되돌림
     */
    public synchronized void resetSettings() {
        GachaSettings defaultSettings = GachaSettings.getDefault();
        saveSettings(defaultSettings);
        settingsRef.set(defaultSettings);

        logger.info("가챠 설정이 기본값으로 초기화되었습니다");
    }

    /**
     * 설정 유효성 검사
     */
    private void validateSettings(GachaSettings settings) {
        if (settings.getLuckyChance() < 0 || settings.getLuckyChance() > 1) {
            throw new IllegalArgumentException("럭키 확률은 0과 1 사이의 값이어야 합니다");
        }

        if (settings.getDefaultHighRankCount() < 0 || settings.getDefaultHighRankCount() > 5) {
            throw new IllegalArgumentException("기본 상위 방어구 확정 개수는 0과 5 사이의 값이어야 합니다");
        }

        if (settings.getSpecialHighRankCount() < 0 || settings.getSpecialHighRankCount() > 5) {
            throw new IllegalArgumentException("특별 상위 방어구 확정 개수는 0과 5 사이의 값이어야 합니다");
        }
    }

    /**
     * 설정 파일에서 로드
     */
    private synchronized void loadSettings() {
        try {
            File file = new File(SETTINGS_FILE);

            // 파일이 없으면 기본 설정 사용
            if (!file.exists()) {
                logger.info("설정 파일이 없습니다. 기본값을 사용합니다.");
                GachaSettings defaultSettings = GachaSettings.getDefault();
                settingsRef.set(defaultSettings);
                saveSettings(defaultSettings);
                return;
            }

            // 파일 마지막 수정 시간 저장
            lastModified = file.lastModified();

            // JSON 파일에서 설정 로드
            GachaSettings settings = objectMapper.readValue(file, GachaSettings.class);
            settingsRef.set(settings);

            logger.info("가챠 설정이 파일에서 로드되었습니다: {}", settings);
        } catch (IOException e) {
            logger.error("설정 파일 로드 중 오류 발생", e);

            // 오류 발생 시 기본 설정 사용
            GachaSettings defaultSettings = GachaSettings.getDefault();
            settingsRef.set(defaultSettings);

            // 파일이 손상되었을 수 있으므로 다시 저장
            try {
                saveSettings(defaultSettings);
            } catch (Exception ex) {
                logger.error("설정 파일 복구 중 오류 발생", ex);
            }
        }
    }

    /**
     * 설정을 파일에 저장
     */
    private synchronized void saveSettings(GachaSettings settings) {
        try {
            // JSON 형식으로 설정 저장
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(new File(SETTINGS_FILE), settings);

            // 파일 마지막 수정 시간 업데이트
            lastModified = new File(SETTINGS_FILE).lastModified();

            logger.info("가챠 설정이 파일에 저장되었습니다: {}", SETTINGS_FILE);
        } catch (IOException e) {
            logger.error("설정 파일 저장 중 오류 발생", e);
            throw new RuntimeException("설정 저장 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 파일 변경 감지 스레드 시작
     * 다른 서버 인스턴스에서 설정 파일이 변경된 경우를 감지
     */
    private void startFileWatcher() {
        Thread watcherThread = new Thread(() -> {
            while (true) {
                try {
                    // 5초마다 파일 변경 확인
                    Thread.sleep(5000);

                    File file = new File(SETTINGS_FILE);
                    if (file.exists() && file.lastModified() > lastModified) {
                        logger.info("설정 파일이 변경되었습니다. 다시 로드합니다.");
                        loadSettings();
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
        watcherThread.setName("settings-file-watcher");
        watcherThread.start();

        logger.info("설정 파일 변경 감지 스레드가 시작되었습니다");
    }
}