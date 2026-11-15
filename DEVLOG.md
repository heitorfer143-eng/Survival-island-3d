# Survival Island 3D — Development Log

## Current architecture
- Single-page 3D game in `index.html`.
- Babylon.js carregado via CDN principal e CDN alternativo, com camada de compatibilidade temporária para os sistemas antigos de gameplay.
- Procedural island, player movement, resources, animals, water, survival stats, building, crafting, weather, exploration and quests live in the same module.
- O repositório independente publica o jogo a partir da raiz (`index.html`).
- Keep the existing game and CodeZero project intact. Make focused changes only.

## Recent work
- Improved island lighting, terrain color, ocean shader, sky, clouds and beach foam.
- Fixed duplicate `makeStructure` declaration by renaming the expanded construction function.
- Added startup error overlay to expose uncaught errors and module-loading failures.
- Commit `4701123488be24cfd1792a8b23f84458408551ed`: improved mobile joystick pointer tracking/cancel handling and added filename/line details to startup errors.

## Motor 3D — migração para Babylon.js
- Em 2026-11-15, o renderizador Three.js foi substituído pelo motor Babylon.js carregado via CDN principal e CDN alternativo.
- O jogo mantém os sistemas de sobrevivência e uma camada de compatibilidade temporária para preservar os construtores e objetos 3D já usados pelo gameplay enquanto a migração avança.
- Engine Babylon tenta inicialização WebGL de alto desempenho e, se falhar, tenta WebGL1/baixo consumo.
- Céu e água foram simplificados para materiais compatíveis com Babylon; o oceano mantém movimento vertical sutil. Sombras avançadas e shader customizado do Three.js ainda precisam ser reimplementados nativamente no Babylon.
- O terreno envia cores de vértice em RGBA e a névoa sincroniza com a cena Babylon.
- Commit de migração: `6fdee6033bebce34de45cc61c6c898aabdd00d2b`.
- Correção de terreno/névoa: `f8fe87f942003bbca7a822c0e552aa6abecb4936`.
- **Verificação:** commit `b53ef791f207183f5712fded2d89848998e3fdba` foi publicado no Render; teste real de gameplay em navegador/dispositivo ainda pendente. Um deploy `live` não comprova que o motor inicia nem que os controles funcionam.

## Known limitations / bugs to investigate
- Player reported a red startup error and inability to move. The exact red error text has not yet been provided, so the root cause is not confirmed.
- The mobile joystick had fragile pointer handling; the latest patch tracks a single pointer, handles cancellation/lost capture, and prevents default touch gestures.
- No real browser/device test has been executed in this development session. Do not claim gameplay works until tested.
- Existing hydration is basic: water pickups, dirty/clean/boiled water, thirst drain and health loss. Needs a unified, persistent inventory and save/load system.
- Construction systems are split between a placement-preview panel and a legacy quick-build menu. Avoid breaking either while consolidating later.

## Verification policy
- Confirm GitHub commit and Render deploy separately.
- Render static deploy status does not prove client-side JavaScript or WebGL works.
- Browser gameplay, mobile touch, collisions and performance require real browser/device testing; if unavailable, state that limitation.
- Never mark a feature tested unless a test actually ran.

## Next priorities
1. Ask for/inspect the exact startup error if it persists; fix root cause before adding large systems.
2. Verify startup and mobile movement on an actual browser/device.
3. Add reliable local save/load for player stats, inventory, water, and built structures.
4. Improve hydration loop: refillable containers, source contamination, boiling/purification, rain collection and clear HUD feedback.
5. Add inventory UI and item stack management.
6. Add regression checks for existing movement, collection, crafting, building and touch controls.

## Stability refactor — 2026-11-15
- Created isolated branch `stability-refactor` so the previous published versions remain untouched.
- Removed a duplicated renderer/scene initialization block that redeclared `$`, `scene`, `camera`, `renderer`, `sun`, and `mat` in the same module. This caused a JavaScript parse failure before the game could start.
- Completed the Babylon compatibility surface for `THREE.Color` and corrected preview materials to use Babylon `alpha`, `disableDepthWrite`, and `diffuseColor`.
- Fixed the animation-loop brace mismatch, which was another syntax error found by the new build check.
- Fixed the quest text being written to a hidden data attribute instead of the visible quest HUD.
- Rain collectors now accumulate water only while the weather is rainy; removed the second always-on timer.
- Mobile look input now captures and releases its pointer correctly, including cancel/lost-capture events.
- Save data is written when the page is hidden, not only on the periodic timer/page close.
- Added `npm run check`, which extracts and syntax-checks every inline JavaScript block before deployment. Render build log confirmed: `JavaScript syntax check passed.`
- New isolated Render service: `https://survival-island-3d-v2.onrender.com` (branch `stability-refactor`). Latest deployment was confirmed `live` for commit `c1c5e50419327220ad2f23481031485e9038a5c0`.
- Browser/WebGL gameplay testing is still required; a successful syntax check and static deploy do not prove runtime rendering or controls.
