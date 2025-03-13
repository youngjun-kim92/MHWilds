package org.example.mhwilds.controller;

import org.example.mhwilds.domain.Armor;
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
        // 무기 타입 목록을 모델에 추가
        model.addAttribute("weaponTypes", Weapon.WeaponType.values());
        model.addAttribute("armorTypes", Armor.ArmorType.values());
        return "index";
    }

    @PostMapping("/gacha/weapon")
    @ResponseBody
    public Weapon drawRandomWeapon() {
        return gachaService.drawRandomWeapon();
    }

    @PostMapping("/gacha/armor")
    @ResponseBody
    public Map<Armor.ArmorType, Armor> drawRandomArmorSet() {
        // 수정된 방식: 각 부위당 일정 확률로 없을 수도 있음
        return gachaService.drawRandomArmorSetWithGaps();
    }

    @PostMapping("/gacha/loadout")
    @ResponseBody
    public Map<String, Object> drawRandomLoadout() {
        Map<String, Object> loadout = new java.util.HashMap<>();
        loadout.put("weapon", gachaService.drawRandomWeapon());
        loadout.put("armorSet", gachaService.drawRandomArmorSetWithGaps());
        return loadout;
    }
}