package org.example.mhwilds.service;

import org.example.mhwilds.domain.Armor;
import org.example.mhwilds.domain.Monster;
import org.example.mhwilds.domain.Weapon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DiscordService {

    private static final Logger logger = LoggerFactory.getLogger(DiscordService.class);
    private final RestTemplate restTemplate;

    @Value("${discord.webhook.url}")
    private String discordWebhookUrl;

    public DiscordService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * 디스코드 웹훅을 통해 가챠 결과를 전송 (몬스터 및 럭키 효과 추가)
     * @param nickname 사용자 닉네임
     * @param gachaType 가챠 유형 (weapon, armor, monster, loadout)
     * @param weaponType 무기 유형 (null일 수 있음)
     * @param armorRanks 방어구 등급 맵 (null일 수 있음)
     * @param monsterType 몬스터 타입 (null일 수 있음)
     * @param isLucky 럭키 효과 적용 여부
     * @return 성공 여부
     */
    public boolean sendGachaResultToDiscord(String nickname, String gachaType,
                                            Weapon.WeaponType weaponType,
                                            Map<Armor.ArmorType, Armor.ArmorRank> armorRanks,
                                            Monster.MonsterType monsterType,
                                            boolean isLucky) {
        try {
            // 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 메시지 내용 생성 (몬스터 및 럭키 효과 포함)
            String content = buildDiscordMessage(nickname, gachaType, weaponType, armorRanks, monsterType, isLucky);

            // 메시지 객체 생성
            Map<String, Object> discordMessage = new HashMap<>();
            discordMessage.put("content", content);

            // HTTP 요청 생성
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(discordMessage, headers);

            // 디스코드 웹훅으로 전송
            ResponseEntity<String> response = restTemplate.postForEntity(discordWebhookUrl, request, String.class);

            // 응답 확인
            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Discord message sent successfully for user: {}", nickname);
                return true;
            } else {
                logger.error("Failed to send Discord message. Status code: {}", response.getStatusCodeValue());
                return false;
            }
        } catch (Exception e) {
            logger.error("Error sending message to Discord", e);
            return false;
        }
    }

    /**
     * 디스코드 웹훅을 통해 제비뽑기 결과를 전송
     * @param nickname 사용자 닉네임
     * @param groups 그룹별 참가자 목록
     * @param groupSize 각 그룹별 인원 수
     * @param randomized 랜덤 섞기 적용 여부
     * @return 성공 여부
     */
    public boolean sendLotteryResultToDiscord(String nickname, List<List<String>> groups, int groupSize, boolean randomized) {
        try {
            // 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 메시지 내용 생성
            String content = buildLotteryDiscordMessage(nickname, groups, groupSize, randomized);

            // 메시지 객체 생성
            Map<String, Object> discordMessage = new HashMap<>();
            discordMessage.put("content", content);

            // HTTP 요청 생성
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(discordMessage, headers);

            // 디스코드 웹훅으로 전송
            ResponseEntity<String> response = restTemplate.postForEntity(discordWebhookUrl, request, String.class);

            // 응답 확인
            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Discord lottery message sent successfully for user: {}", nickname);
                return true;
            } else {
                logger.error("Failed to send Discord lottery message. Status code: {}", response.getStatusCodeValue());
                return false;
            }
        } catch (Exception e) {
            logger.error("Error sending lottery message to Discord", e);
            return false;
        }
    }

    /**
     * 디스코드에 보낼 메시지 본문 생성 (몬스터 및 럭키 효과 포함)
     */
    private String buildDiscordMessage(String nickname, String gachaType,
                                       Weapon.WeaponType weaponType,
                                       Map<Armor.ArmorType, Armor.ArmorRank> armorRanks,
                                       Monster.MonsterType monsterType,
                                       boolean isLucky) {

        StringBuilder message = new StringBuilder();
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // 헤더 추가 (럭키 효과 포함)
        if (isLucky) {
            message.append("**:game_die: 몬스터헌터 가챠 결과 :sparkles: 초★러키!!! :sparkles:**\n");
        } else {
            message.append("**:game_die: 몬스터헌터 가챠 결과 :game_die:**\n");
        }
        message.append("> **닉네임**: ").append(nickname).append("\n");
        message.append("> **시간**: ").append(now.format(formatter)).append("\n");

        // 가챠 유형에 따라 표시
        message.append("> **가챠 유형**: ");
        switch (gachaType) {
            case "weapon":
                message.append("무기 가챠\n\n");
                break;
            case "armor":
                message.append("방어구 가챠\n\n");
                break;
            case "monster":
                message.append("몬스터 가챠\n\n");
                break;
            case "loadout":
                message.append("전체 가챠\n\n");
                break;
            default:
                message.append("알 수 없음\n\n");
        }

        // 무기 정보 추가
        if (weaponType != null) {
            message.append("**:crossed_swords: 무기**\n");
            message.append("> ").append(weaponType.getKorName()).append("\n\n");
        }

        // 방어구 정보 추가 (럭키 효과 간소화)
        if (armorRanks != null && !armorRanks.isEmpty()) {
            message.append("**:shield: 방어구**\n");

            if (isLucky) {
                // 럭키 효과 발동 시 간단한 메시지만 표시
                message.append("> **원하는 방어구 착용하세요** :sparkles:\n\n");
            } else {
                // 일반 효과 시 각 부위 정보 표시
                for (Armor.ArmorType type : Armor.ArmorType.values()) {
                    message.append("> **").append(type.getKorName()).append("**: ");

                    if (armorRanks.containsKey(type)) {
                        Armor.ArmorRank rank = armorRanks.get(type);
                        message.append(rank.getKorName()).append(" 등급\n");
                    } else {
                        message.append("없음\n");
                    }
                }
            }
        }

        // 몬스터 정보 추가
        if (monsterType != null) {
            message.append("\n**:dragon: 몬스터**\n");
            message.append("> ").append(monsterType.getKorName()).append("\n");
        }

        return message.toString();
    }

    /**
     * 디스코드에 보낼 제비뽑기 결과 메시지 본문 생성
     */
    private String buildLotteryDiscordMessage(String nickname, List<List<String>> groups, int groupSize, boolean randomized) {
        StringBuilder message = new StringBuilder();
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // 헤더 추가
        message.append("**:tada: 제비뽑기 결과 :tada:**\n");
        message.append("> **진행자**: ").append(nickname).append("\n");
        message.append("> **시간**: ").append(now.format(formatter)).append("\n");
        message.append("> **그룹 인원**: ").append(groupSize).append("명\n");
        message.append("> **랜덤 섞기**: ").append(randomized ? "적용" : "미적용").append("\n");
        message.append("> **총 인원**: ").append(countTotalParticipants(groups)).append("명\n");
        message.append("> **총 그룹수**: ").append(groups.size()).append("개\n\n");

        // 각 그룹 정보 추가
        for (int i = 0; i < groups.size(); i++) {
            List<String> group = groups.get(i);
            message.append("**:pushpin: 그룹 ").append(i + 1).append("**\n");

            for (int j = 0; j < group.size(); j++) {
                message.append("> ").append(j + 1).append(". ").append(group.get(j)).append("\n");
            }

            // 그룹 간 구분선 추가 (마지막 그룹 제외)
            if (i < groups.size() - 1) {
                message.append("\n");
            }
        }

        return message.toString();
    }

    /**
     * 전체 참가자 수 계산
     */
    private int countTotalParticipants(List<List<String>> groups) {
        int total = 0;
        for (List<String> group : groups) {
            total += group.size();
        }
        return total;
    }

    // 오버로딩된 메소드들 (기존 메소드와의 호환성 유지)
    public boolean sendGachaResultToDiscord(String nickname, String gachaType,
                                            Weapon.WeaponType weaponType,
                                            Map<Armor.ArmorType, Armor.ArmorRank> armorRanks,
                                            Monster.MonsterType monsterType) {
        return sendGachaResultToDiscord(nickname, gachaType, weaponType, armorRanks, monsterType, false);
    }

    public boolean sendGachaResultToDiscord(String nickname, String gachaType,
                                            Weapon.WeaponType weaponType,
                                            Map<Armor.ArmorType, Armor.ArmorRank> armorRanks) {
        return sendGachaResultToDiscord(nickname, gachaType, weaponType, armorRanks, null, false);
    }
}