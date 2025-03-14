package org.example.mhwilds.controller;

import org.example.mhwilds.domain.Armor;
import org.example.mhwilds.domain.Monster;
import org.example.mhwilds.domain.Weapon;
import org.example.mhwilds.service.GachaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
public class GachaController {

    private final GachaService gachaService;

    @Autowired
    public GachaController(GachaService gachaService) {
        this.gachaService = gachaService;
    }

    @GetMapping("/")
    public String home(Model model) {
        // 무기 타입 목록과 방어구 타입 목록을 모델에 추가
        model.addAttribute("weaponTypes", Weapon.WeaponType.values());
        model.addAttribute("armorTypes", Armor.ArmorType.values());
        model.addAttribute("armorRanks", Armor.ArmorRank.values());
        model.addAttribute("monsterTypes", Monster.MonsterType.values());
        return "index";
    }

    @PostMapping("/gacha/weapon")
    @ResponseBody
    public Weapon.WeaponType drawRandomWeaponType() {
        Weapon.WeaponType result = gachaService.drawRandomWeaponType();
        // 디버깅을 위해 로그 추가
        System.out.println("컨트롤러에서 반환하는 무기 타입: " + result);
        return result;
    }

    @PostMapping("/gacha/armor")
    @ResponseBody
    public Map<Armor.ArmorType, Armor.ArmorRank> drawRandomArmorSet() {
        // 수정된 방식: 각 부위당 일정 확률로 없을 수도 있음
        return gachaService.drawRandomArmorRanksWithGaps();
    }

    @PostMapping("/gacha/monster")
    @ResponseBody
    public Monster.MonsterType drawRandomMonsterType() {
        Monster.MonsterType result = gachaService.drawRandomMonsterType();
        System.out.println("컨트롤러에서 반환하는 몬스터 타입: " + result);
        return result;
    }

    @PostMapping("/gacha/loadout")
    @ResponseBody
    public Map<String, Object> drawRandomLoadout() {
        return gachaService.drawRandomLoadout();
    }
}