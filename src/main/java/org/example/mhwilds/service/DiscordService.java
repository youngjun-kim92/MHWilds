package org.example.mhwilds.service;

import org.example.mhwilds.domain.Armor;
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
import java.util.Map;

@Service
public class DiscordService {

    private static final Logger logger = LoggerFactory.getLogger(DiscordService.class);
    private final RestTemplate restTemplate;
    private final GachaService gachaService;  // 방어구 이름을 가져오기 위한 서비스 추가

    @Value("${discord.webhook.url}")
    private String discordWebhookUrl;

    public DiscordService(GachaService gachaService) {
        this.restTemplate = new RestTemplate();
        this.gachaService = gachaService;
    }

    /**
     * 디스코드 웹훅을 통해 가챠 결과를 전송
     * @param nickname 사용자 닉네임
     * @param gachaType 가챠 유형 (weapon, armor, loadout)
     * @param weaponType 무기 유형 (null일 수 있음)
     * @param armorRanks 방어구 등급 맵 (null일 수 있음)
     * @param armorNames 방어구 이름 맵 (null일 수 있음)
     * @return 성공 여부
     */
    public boolean sendGachaResultToDiscord(String nickname, String gachaType,
                                            Weapon.WeaponType weaponType,
                                            Map<Armor.ArmorType, Armor.ArmorRank> armorRanks,
                                            Map<String, String> armorNames) {
        try {
            // 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 메시지 내용 생성
            String content = buildDiscordMessage(nickname, gachaType, weaponType, armorRanks, armorNames);

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
     * 디스코드에 보낼 메시지 본문 생성
     */
    private String buildDiscordMessage(String nickname, String gachaType,
                                       Weapon.WeaponType weaponType,
                                       Map<Armor.ArmorType, Armor.ArmorRank> armorRanks,
                                       Map<String, String> armorNames) {

        StringBuilder message = new StringBuilder();
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // 헤더 추가
        message.append("**:game_die: 몬스터헌터 가챠 결과 :game_die:**\n");
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

        // 방어구 정보 추가
        if (armorRanks != null && !armorRanks.isEmpty()) {
            message.append("**:shield: 방어구**\n");

            // 각 부위별 정보 추가
            for (Armor.ArmorType type : Armor.ArmorType.values()) {
                message.append("> **").append(type.getKorName()).append("**: ");

                if (armorRanks.containsKey(type)) {
                    Armor.ArmorRank rank = armorRanks.get(type);
                    String typeName = type.name(); // HEAD, CHEST 등
                    String armorName = "없음";

                    // 방어구 이름이 전달되었으면 사용
                    if (armorNames != null && armorNames.containsKey(typeName)) {
                        armorName = armorNames.get(typeName);
                    } else {
                        // 이름이 전달되지 않았으면 랜덤으로 생성
                        armorName = gachaService.drawRandomArmorName(type);
                    }

                    message.append(armorName).append(" (").append(rank.getKorName()).append(" 등급)\n");
                } else {
                    message.append("없음\n");
                }
            }
        }

        return message.toString();
    }

    // 오버로딩된 메서드 - 이전 버전과의 호환성 유지
    public boolean sendGachaResultToDiscord(String nickname, String gachaType,
                                            Weapon.WeaponType weaponType,
                                            Map<Armor.ArmorType, Armor.ArmorRank> armorRanks) {
        return sendGachaResultToDiscord(nickname, gachaType, weaponType, armorRanks, null);
    }
}