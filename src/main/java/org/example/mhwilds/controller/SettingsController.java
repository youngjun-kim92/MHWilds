package org.example.mhwilds.controller;

import org.example.mhwilds.model.GachaSettings;
import org.example.mhwilds.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * 가챠 설정 관리 API 컨트롤러
 */
@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    @Autowired
    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    /**
     * 현재 가챠 설정 가져오기
     */
    @GetMapping("/gacha")
    public ResponseEntity<GachaSettings> getGachaSettings() {
        GachaSettings settings = settingsService.getSettings();
        return ResponseEntity.ok(settings);
    }

    /**
     * 가챠 설정 업데이트
     */
    @PostMapping("/gacha")
    public ResponseEntity<Map<String, Object>> updateGachaSettings(@RequestBody GachaSettings settings) {
        // 타임스탬프 업데이트
        settings.updateTimestamp();

        // 설정 업데이트
        settingsService.updateSettings(settings);

        // 응답 생성
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "설정이 성공적으로 업데이트되었습니다");
        response.put("timestamp", settings.getLastUpdated());

        // 사람이 읽기 쉬운 형식의 시간 추가
        LocalDateTime dateTime = LocalDateTime.ofInstant(
                Instant.ofEpochMilli(settings.getLastUpdated()),
                ZoneId.systemDefault()
        );
        response.put("formattedTime", dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        return ResponseEntity.ok(response);
    }

    /**
     * 가챠 설정 초기화
     */
    @PostMapping("/gacha/reset")
    public ResponseEntity<Map<String, Object>> resetGachaSettings() {
        settingsService.resetSettings();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "설정이 기본값으로 초기화되었습니다");
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }
}