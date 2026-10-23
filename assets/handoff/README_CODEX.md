# Bunny Warriors — Codex skill handoff (2026-10-23)

## Canonical sources & hierarchy
1. `data/skills_all.json` = CURRENT CURATED SKILL NAMES AND MECHANICS.
2. `data/skills_index.csv` = spreadsheet-friendly skill index, each level across columns.
3. `references/` = existing **VISUAL CONCEPT SHEETS ONLY** (many show superseded mechanics / names).
4. `icons_preview/` = approximate crops for review, each with a 32x32 *DERIVED PREVIEW*.
   **IMPORTANT: these are NOT native-authored 32x32 production icons.** Redraw/approve each at actual pixel grid.
5. Any preexisting game code/assets must be read before writing. Do not replace character sprites/logos.

## Existing vs requested new art
- The bundle includes existing Bow, Sword, Staff, Wizard (frost) concept sheets; 24 approximate cropped skill previews.
- The other 2 characters' skill icon art, neutral attack icons, passive icons, and all isolated native-quality 32x32 production images **have not been authored as verified assets**. Generate/hand-pixel them; do not use nonmatching imagery or quietly substitute invented rabbits.
- When enemies appear, they must be orange fox enemies (NEVER humans or random rabbit heads).
- The wizard reference sheet contains old and contradictory names such as Frost Rift, Freezing Sigil and Frozen Cataclysm. Use data/skills_all.json for canonical names: Frost Fracture, Shatter Spread, Frozen Prison, Ice Mirror, Blizzard Domain, and ULT Glacial Singularity. The visual motifs may be reused after review.

## In-run slots
- One separately equipped weapon primary attack, max Lv8.
- Six free slots concept: four ATTACK slots (either neutral attacks or compatible weapon-specific attack skills) and two SUPPORT slots (passives/support-tagged weapon skills).
- One character Ultimate in its own button, not occupying a slot.
- Character quality is permanent pre-run progression, not level-up card rarity.
- Passive character quality mechanics must function with any Bow/Sword/Staff.
- Each level-up: three choices, new skills if open slots, existing skills if full; no offered max-level skill.
- Weapon-specific cards only appear for equipped weapon. The six-step rarity color hierarchy for characters is separate from skill rarities.
- Current skill pool: 3 × 6 weapon skills = 18; 12 neutral attacks; 20 passives; 3 × 5 quality traits = 15; 3 ultimates. Total 68 entries.

## Non-negotiable separation rules
- Wizard owns frost slows/shatter/ice decoy. Staff alone **does not** freeze or burn.
- Knight owns prepared guard, grey-health shield and guard-triggered critical/heal; Sword alone **does not** guard or heal.
- Bow owns precise shots, line pierce, spread, hit/kill follow-up.
- Neutral attacks must not recursively trigger each other or multiply character passives without internal cooldowns.
- Bow / Staff are allowed on Knight but their direct weapon damage is -10%; Sword gets +8% effective radius on Knight.
- Wizard has no Sword penalty; Wizard using Staff has -10% casting impact windup only (not cooldown).
- Overall critical chance cap 65%, dodge chance cap 35%, auto-skill cooldown reduction cap 40%.
- Luck never alters withdrawable/$BUNNY/token/Gacha chance.
- Ultimate: unlimited uses across endless run; full gauge 100 and store only one charge; target ~2–3 uses in a normal ~15-minute run, but depends on actual boss schedule, and ULT damage does not refill ULT.
- No rainbow character passives are finalized in this handoff. Do not implement older rainbow drafts as final.

## Tuning & implementation work for Codex
1. Scan repository; identify current entity/component/skill schema, render resolution, collision system, and asset paths.
2. Implement canonical data as typed JSON/TS definitions with rarity, levels, groups, mechanics and caps.
3. Add a renderer that displays first-acquisition descriptions vs repeat-pick short deltas (`Skill Name+`, like `Damage +`).
4. Implement true 32x32 asset slots and placeholders only where art is not verified; wire sprite references by stable IDs.
5. Add simulation tests for 3 characters × 3 weapons × multiple enemy scenes, including mistaken dodges and 0-build white vs orange character scenarios. Flag unrealistic absolute survival rates rather than 'fixing' characters just to equalize.
6. Verify turret deploy cooldown vs firing interval; minimize VFX clutter so fox silhouettes and boss telegraphs remain visible.
7. Store your balancing changes in a diff/change log, not silently overwrite design values.
8. Make a work-in-progress list of unverified numbers, underspecified enemy mechanics, and missing art.

## Notes about values
Where level arrays contain only changes (`+percentage`, `CD X`), treat them as changes to the cumulative level state, not new skill instances. Validate all interactions. These are design baselines, NOT runtime-tested or certified to 9/10 combat balance.
