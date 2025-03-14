package org.example.mhwilds.controller;

import org.example.mhwilds.domain.Armor;
import org.example.mhwilds.domain.Monster;
import org.example.mhwilds.domain.Weapon;
import org.example.mhwilds.service.DiscordService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DiscordController {

    private static final Logger logger = LoggerFactory.getLogger(DiscordController.class);
    private final DiscordService discordService;

    @Autowired
    public DiscordController(DiscordService discordService) {
        this.discordService = discordService;
    }

    /**
     * 디스코드에 가챠 결과 공유 API
     * @param payload 클라이언트에서 전송한 가챠 결과 데이터
     * @return 성공 여부와 메시지
     */
    @PostMapping("/share-to-discord")
    public ResponseEntity<Map<String, Object>> shareToDiscord(@RequestBody Map<String, Object> payload) {
        Map<String, Object> response = new HashMap<>();

        try {
            // 데이터 추출
            String nickname = (String) payload.get("nickname");
            String type = (String) payload.get("type");

            logger.info("Received share-to-discord request from {} for {} result", nickname, type);

            // 닉네임 유효성 검사
            if (nickname == null || nickname.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "닉네임이 비어있습니다");
                return ResponseEntity.badRequest().body(response);
            }

            // 무기 데이터 처리
            Weapon.WeaponType weaponType = null;
            if (payload.containsKey("weapon")) {
                Map<String, String> weaponData = (Map<String, String>) payload.get("weapon");
                String weaponTypeName = weaponData.get("name");
                if (weaponTypeName != null) {
                    try {
                        weaponType = Weapon.WeaponType.valueOf(weaponTypeName);
                    } catch (IllegalArgumentException e) {
                        logger.warn("Invalid weapon type: {}", weaponTypeName);
                    }
                }
            }

            // 방어구 데이터 처리 (단순화)
            Map<Armor.ArmorType, Armor.ArmorRank> armorRanks = new HashMap<>();

            if (payload.containsKey("armor")) {
                Map<String, Object> armorData = (Map<String, Object>) payload.get("armor");

                for (Map.Entry<String, Object> entry : armorData.entrySet()) {
                    try {
                        Armor.ArmorType armorType = Armor.ArmorType.valueOf(entry.getKey());
                        if (entry.getValue() != null) {
                            Map<String, String> rankData = (Map<String, String>) entry.getValue();
                            Armor.ArmorRank armorRank = Armor.ArmorRank.valueOf(rankData.get("name"));
                            armorRanks.put(armorType, armorRank);
                        }
                    } catch (IllegalArgumentException e) {
                        logger.warn("Invalid armor type or rank: {}", entry.getKey());
                    }
                }
            }

            // 몬스터 데이터 처리
            Monster.MonsterType monsterType = null;
            if (payload.containsKey("monster")) {
                Map<String, String> monsterData = (Map<String, String>) payload.get("monster");
                String monsterTypeName = monsterData.get("name");
                if (monsterTypeName != null) {
                    try {
                        monsterType = Monster.MonsterType.valueOf(monsterTypeName);
                    } catch (IllegalArgumentException e) {
                        logger.warn("Invalid monster type: {}", monsterTypeName);
                    }
                }
            }

            // 럭키 효과 확인
            boolean isLucky = payload.containsKey("isLucky") && Boolean.TRUE.equals(payload.get("isLucky"));

            logger.info("Processing gacha result - Type: {}, Monster: {}, Weapon: {}, Lucky: {}",
                    type, monsterType, weaponType, isLucky);

            // 디스코드에 결과 전송
            boolean success = discordService.sendGachaResultToDiscord(
                    nickname, type, weaponType, armorRanks, monsterType, isLucky);

            response.put("success", success);
            if (success) {
                response.put("message", "디스코드 채널에 결과가 성공적으로 공유되었습니다");
            } else {
                response.put("message", "디스코드 전송 중 오류가 발생했습니다");
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error in share-to-discord API", e);
            response.put("success", false);
            response.put("message", "서버 오류: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}