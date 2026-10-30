# Flame staff motion lab

Uses the original user-provided rabbit idle/walk and staff PNG sheets from `assets/vfx/Character` and `assets/vfx/Weapon` without modifying their pixels. `assets/originals/manifest.json` records paths, dimensions, SHA-256 hashes and staff hand/gem anchors. The sword sheet is preserved for the next weapon implementation; this lab implements staff only.

Run from the repository root with `python -m http.server 8000`, then open `/labs/flame/flame.html`.

Arrow keys / WASD move; pointer aims; Space or the cast button fires. Pause, frame stepping, playback speed, loop, hit bounds and impact toggles are available. Idle: 2 columns × 4 rows; walk: 4 × 4; cells: 64 × 64. Direction rows: front, right, left, back. Original staff frames are aligned by their handle and ruby tip; fire is attached to the ruby. Upward-held staff renders behind the rabbit.

Fire: eight generated 64 × 64 transparent frames, 0.56-second cast, active 0.14–0.35 seconds, 54px range from staff tip, one hit per target per cast, 35 prototype damage. These are isolated lab values, not changes to canonical skill balance.

`assets/flame-staff/flame-pack.zip` contains fire frames and the original asset copies. Optional replacement image imports remain browser-local. No credentials or Site hosting metadata are included.

Validation: `node tests/flame-test.mjs`. Browser visual verification remains pending.

## Six-skill VFX laboratory

Open `/labs/flame/fire-vfx.html` for all six skills with ON/OFF, standalone triggers, movement, slow motion, frame stepping and transparent sheet inspection. Assets: `assets/fire-vfx` (48 RGBA frames + 6 sheets + manifest + ZIP). Test: `node tests/fire-vfx-test.mjs`. Automatic dependencies: fireball → field; burning death → spread; three burn stacks → burst (5s target cooldown). Fire fields do not stack their DPS; burn lasts 3s, max three stacks; meteor has a warning before impact. Numbers are isolated prototype values. Standalone preview buttons intentionally trigger passive visuals without their combat prerequisite.
