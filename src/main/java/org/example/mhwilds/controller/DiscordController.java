package org.example.mhwilds.controller;

import org.example.mhwilds.domain.Armor;
import org.example.mhwilds.domain.Weapon;
import org.example.mhwilds.service.DiscordService;
import org.example.mhwilds.service.GachaService;
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
    private final GachaService gachaService;

    @Autowired
    public DiscordController(DiscordService discordService, GachaService gachaService) {
        this.discordService = discordService;
        this.gachaService = gachaService;
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

            // 방어구 데이터 처리
            Map<Armor.ArmorType, Armor.ArmorRank> armorRanks = new HashMap<>();
            Map<String, String> armorNames = new HashMap<>();

            if (payload.containsKey("armor")) {
                Map<String, Object> armorData = (Map<String, Object>) payload.get("armor");

                // 방어구 이름 데이터 처리
                if (payload.containsKey("armorNames")) {
                    armorNames = (Map<String, String>) payload.get("armorNames");
                }

                for (Map.Entry<String, Object> entry : armorData.entrySet()) {
                    try {
                        Armor.ArmorType armorType = Armor.ArmorType.valueOf(entry.getKey());
                        if (entry.getValue() != null) {
                            Map<String, String> rankData = (Map<String, String>) entry.getValue();
                            Armor.ArmorRank armorRank = Armor.ArmorRank.valueOf(rankData.get("name"));
                            armorRanks.put(armorType, armorRank);

                            // 방어구 이름이 없으면 랜덤으로 생성
                            if (!armorNames.containsKey(entry.getKey())) {
                                String randomName = gachaService.drawRandomArmorName(armorType);
                                armorNames.put(entry.getKey(), randomName);
                            }
                        }
                    } catch (IllegalArgumentException e) {
                        logger.warn("Invalid armor type or rank: {}", entry.getKey());
                    }
                }
            }

            // 디스코드에 결과 전송
            boolean success = discordService.sendGachaResultToDiscord(nickname, type, weaponType, armorRanks, armorNames);

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