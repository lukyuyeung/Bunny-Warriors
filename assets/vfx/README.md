# Bunny Warriors — Frost VFX v0.1

Review prototypes, authored at 64×64 RGBA with transparent backgrounds. Original handoff files remain unchanged.

## Contents
- `frost_fracture`: 24-frame one-shot crack/stack/shatter sequence, 12 FPS. In a game, drive the individual stack states from actual hit events; do not let animation apply stacks or damage.
- `frozen_prison`: 24 frames at 20 FPS = 1.2-second visual. Deploy on the normal-fox freeze event; ice field persistence and the 14-second cooldown belong to gameplay logic. Two-tile area must be scaled against the game's actual tile size.
- `glacial_singularity`: 16-frame seamless-intent storm cycle at 12 FPS. Loop while the actual 7-second ability is active. Stop emission at expiry; follow the target selected by gameplay. This animation does not implement tracking.
- Each directory includes a spritesheet, numbered frames and an MP4 mechanics illustration.
- `manifest.json` contains frame size, order, rate and suggested import settings.
- `build_vfx.py` regenerates assets using Pillow and ffmpeg, retaining transparency and nearest-neighbor display scaling. It creates new artwork procedurally; it does not modify supplied images.

## Unity import
1. Copy selected PNGs into your project's VFX folder. Texture Type: Sprite (2D and UI), Sprite Mode: Multiple, Pixels Per Unit: 64 (adjust to game scale), Filter Mode: Point, Compression: None, Mip Maps: Off, alpha from input.
2. Slice by Grid by Cell Size, 64×64. Read left-to-right and top-to-bottom. Pivot: Center. Sheets have eight columns; ignore empty cells.
3. Make an Animation Clip at the FPS in the manifest. Only storm loops. Use separate ground and foreground renderers if actor readability requires it.
4. Visuals never decide damage, status duration, cooldown, stack counts or boss immunity. Bind these to existing game events.
5. Test in the actual Unity version and camera scale before production use. No Unity project or installed editor was supplied; import, shader compatibility, sorting and in-game performance remain unverified.

## Design constraints
Source: handoff `skills_all.json`. Frost Fracture: slow 25% for 2s; same-target stack ICD 1.25s; three stacks shatter for 80% weapon reference damage; target shatter ICD 5s. Frozen Prison: every 14s, two-tile field; normal fox freeze 1.2s; boss only slows up to 15%. Glacial Singularity: 7-second tracking storm, initial burst then sustained damage/slow, mobile caster, no boss freeze.

Videos are intentionally simple scripted diagrams with orange fox markers, not captured gameplay. Stack animation is a presentation sequence, not a combat simulation. No player character art is replaced. No new balance values are asserted. Videos are silent. VFX appearance and timing require art review; this is not a production certification.

## Regenerate
`cd /workspace/bunny-design/vfx-frost-v1 && python build_vfx.py`
Requires Python 3, Pillow and ffmpeg. Uses the installed DejaVu Sans font path specified in the script.

`art-direction-concept.png` is a separately generated high-resolution visual concept, not a sliced 64×64 animation or production sprite. The procedural prototype animations establish timing and readability and do not yet reproduce all concept-art detail.
