package org.example.mhwilds.controller;

import org.example.mhwilds.model.ParticipantList;
import org.example.mhwilds.service.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 참가자 명단 관리 API 컨트롤러
 */
@RestController
@RequestMapping("/api/participants")
public class ParticipantController {

    private final ParticipantService participantService;

    @Autowired
    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    /**
     * 현재 참가자 목록 가져오기
     */
    @GetMapping
    public ResponseEntity<ParticipantList> getParticipants() {
        return ResponseEntity.ok(participantService.getParticipants());
    }

    /**
     * 새로운 참가자 추가
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> addParticipant(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String discordId = request.get("discordId");

        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(createErrorResponse("이름은 필수 항목입니다"));
        }

        participantService.addParticipant(name, discordId != null ? discordId : "");

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "참가자가 추가되었습니다");
        response.put("participants", participantService.getParticipants().getParticipants());

        return ResponseEntity.ok(response);
    }

    /**
     * 참가자 제거
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> removeParticipant(@PathVariable String id) {
        boolean removed = participantService.removeParticipant(id);

        Map<String, Object> response = new HashMap<>();
        if (removed) {
            response.put("success", true);
            response.put("message", "참가자가 제거되었습니다");
        } else {
            response.put("success", false);
            response.put("message", "참가자를 찾을 수 없습니다");
        }

        response.put("participants", participantService.getParticipants().getParticipants());

        return ResponseEntity.ok(response);
    }

    /**
     * 전체 참가자 목록 업데이트
     */
    @PutMapping
    public ResponseEntity<Map<String, Object>> updateParticipants(@RequestBody ParticipantList participants) {
        participantService.updateParticipants(participants);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "참가자 목록이 업데이트되었습니다");
        response.put("participants", participantService.getParticipants().getParticipants());

        // 사람이 읽기 쉬운 형식의 시간 추가
        LocalDateTime dateTime = LocalDateTime.ofInstant(
                Instant.ofEpochMilli(participants.getLastUpdated()),
                ZoneId.systemDefault()
        );
        response.put("formattedTime", dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        return ResponseEntity.ok(response);
    }

    /**
     * 참가자 목록 초기화
     */
    @PostMapping("/reset")
    public ResponseEntity<Map<String, Object>> resetParticipants() {
        participantService.resetParticipants();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "참가자 목록이 초기화되었습니다");
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }

    /**
     * 랜덤으로 참가자 선택 (1-4명)
     */
    @GetMapping("/draw")
    public ResponseEntity<Map<String, Object>> drawParticipants(@RequestParam(defaultValue = "1") int count) {
        // count 범위 제한 (1-4명)
        count = Math.max(1, Math.min(count, 4));

        List<ParticipantList.Participant> selected = participantService.selectRandomParticipants(count);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", String.format("%d명의 참가자가 선택되었습니다", selected.size()));
        response.put("selectedCount", selected.size());
        response.put("selected", selected);
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }

    /**
     * 에러 응답 생성 도우미 메서드
     */
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}