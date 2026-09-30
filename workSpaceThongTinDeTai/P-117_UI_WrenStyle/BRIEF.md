# P-117 Frontend — WrenAI-style UI refresh (UI only, mock data)

Input brief for the `automatic-workflow` (autowf) skill. Run it from the P-117 repo:

```
cd /Users/thai/Vinuni/BuildPhaseProject/P-117
claude
> /automatic-workflow Build the UI refresh described in /Users/thai/Vinuni/BuildPhaseProject/workSpaceThongTinDeTai/P-117_UI_WrenStyle/BRIEF.md
```

The skill turns this brief into `PLAN.md` (one `## Task N` per section in "Tasks" below), you approve it, and then you run `autowf` in your own Terminal.

> Base branch: `main` (checked 2026-10-01: `feat/ui-redesign` and `develop` are already fully merged into `main`, 0 commits ahead). autowf creates its own `auto/*` branch from the current one.

> Note: `P-117/PLAN.md` currently holds the previous plan (Tasks 1–14, already merged). The skill will replace it. Keep a copy first if you still need it, e.g. `git mv PLAN.md docs/plans/PLAN_frontend_ai_display.md` and commit, so the tree is clean before autowf runs.

---

## 1. Goal

Restyle the P-117 frontend (`frontend/`, Next.js 16 + React 19 + Tailwind 4 + shadcn-style components) after the layout of WrenAI OSS (`http://localhost:3001`, antd 4). Reasons: WrenAI keeps thread history in a fixed sidebar, lays out each question as a results page, keeps the reasoning steps on the page in a collapsible block, suggests follow-up questions, and uses a flat, low-chrome look.

**Scope: frontend only, on mock data (MSW).** The backend will be wired in later.

Hard limits:
- Do NOT modify anything outside `frontend/`. No files under `src/` (Python), `tests/`, `cube/`, `docs/spec/`.
- Do NOT modify `frontend/src/lib/api/generated/**`, which is generated from the contract.
- Do NOT modify scenario fixtures (`tests/fixtures/scenarios/*.json`, `frontend/src/mocks/fixtures/*.json`). `fixtures-sync.test.ts` checks them against the backend.
- Do NOT add new npm dependencies. Use what is in `frontend/package.json`: lucide-react, radix dialog/slot, cva, clsx, tailwind-merge, zustand, echarts.
- Anything that needs backend data that does not exist yet goes behind a small **adapter** (a hook or pure function) with a `// TODO(BE): …` comment, so the later wiring only swaps the data source. See section 5.
- Keep every existing `data-testid` listed in section 6. The existing vitest and Playwright tests must keep passing.
- UI text in Vietnamese, identifiers and comments in English. Light mode only, since the demo is projected and printed.

TEST_CMD: `make autowf-test` (already used by the previous plan: pre-commit, ruff, mypy, pytest, tsc, vitest, cube tests). For one frontend file: `pnpm -C frontend exec vitest run <path>`.

## 2. Reference screenshots

All in `/Users/thai/Vinuni/BuildPhaseProject/workSpaceThongTinDeTai/P-117_UI_WrenStyle/refs/`:

| File | What it shows |
|---|---|
| `wrenai_home.png` | WrenAI home: sidebar, empty state, 3 recommendation cards, fixed prompt |
| `wrenai_thread.png` | WrenAI thread: question title, collapsed steps, tabs Answer/SQL/Chart, recommended questions |
| `wrenai_reasoning_done.png` | "Answer preparation steps" expanded after completion |
| `wrenai_reasoning_running.png` | Same block **while running**: red Cancel, solid dot on the active step, small spinner |
| `wrenai_knowledge.png` | WrenAI table page (model for the Library table) |
| `wrenai_modeling.png` | Modeling page (reference only, not in scope) |
| `p117_home.png`, `p117_studio_empty.png`, `p117_studio_draft.png`, `p117_library.png` | Current P-117 screens |
| `p117_stream_1.png`, `p117_stream_2_detail.png`, `p117_refine_2_detail.png` | Current P-117 stepper: floating card; during a refine it covers the blurred old draft |

## 3. Design tokens (WrenAI values mapped to P-117)

Keep the P-117 navy brand `--primary: #1e3a8a`. Everything else moves toward WrenAI's flat style.

| Token / rule | Current | Target |
|---|---|---|
| `--radius` | `0.625rem` (10px) | `0.375rem` (6px); tags and small chips 4px |
| Page background (`--background`) | `#f8fafc`, with white cards on top | `#ffffff` for the main area |
| Sidebar background | none | new `--sidebar: #fafafa`, `--sidebar-accent: #f0f0f0` (selected row) |
| `--border` | `#e2e8f0` | `#eeeeee` for panels, cards and tables (WrenAI `#f0f0f0`) |
| `--input` | `#cbd5e1` | `#d9d9d9` for inputs and outline buttons |
| `--muted-foreground` | `#64748b` | keep; add `--subtle-foreground: #8c8c8c` for 12px captions and step results |
| Shadows | `shadow-xs`/`shadow-md` on cards, chips, stepper | **none**. The only exception is the floating prompt tray: `0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -2px rgb(0 0 0 / .05)` → new utility `shadow-prompt` |
| Font sizes | 36px hero, mixed | base 14px; captions 12px; answer and insight text 16px; page/question title 20px/500 |
| Spacing | mixed | 4/8/12/16/24/48; sidebar rows 28px tall |
| Header | 32px gold banner + 56px white header = 88px | one **48px** header, dark `#0f172a`, white text, pill nav |

Components (WrenAI → P-117):
- **Header** (`wrenai_home.png`): h-12, bg `#0f172a`, px-4. Brand on the left: logo mark + "Dashboard Agent" in white. Pill nav: h-7, rounded-full, px-3, 14px; active item `bg-white/20 font-semibold`, inactive `text-white/80 hover:bg-white/10`. Right side: a small gold badge "Dữ liệu giả lập" (bg `--gold-soft`, text amber-900, 12px, rounded, with a tooltip "không phản ánh số liệu thực của doanh nghiệp"). The dev-scenario menu goes here too (Task 12).
- **Sidebar**: width 280px, bg `--sidebar`, full height below the header, no right border. Section header "Hội thoại (n)" 14px/500 with the count in 12px muted, and on the right a small outline button "+ Mới" (h-6, 12px). Rows: h-7, px-4, 14px, truncated with `…`, a ⋮ icon on hover; selected row `bg-[--sidebar-accent] text-primary`. Bottom block (pinned): the account (initials avatar + username + "Người tạo · Miền Bắc" in 12px) and the logout icon button.
- **Prompt tray** (`wrenai_thread.png`, bottom): `position: fixed; bottom: 16px`, centred in the main area (right of the sidebar), width `min(680px, 100% - 32px)`. Tray bg `#fafafa`, 1px `#f5f5f5` border, radius 6px, p-3, `shadow-prompt`. Inside: an input with auto-grow from 1 to 4 lines (h-10 min, 16px, 1px `--input` border, radius 6px), then a gap of 12px and a primary button with a **label** "Gửi" (h-10, px-4). The keyboard hint moves into the placeholder/title. The main content gets `pb-32` so nothing hides behind the tray.
- **Collapsible block** (reasoning panel, follow-up block): 1px `--border`, radius 6px, no shadow. Header p-3 px-4, icon + title 16px/500 in `--muted-foreground`, right side meta in 12px + chevron.
- **Tabs** (WrenAI card tabs): tab h-9, px-4, 14px, radius `6px 6px 0 0`. Active tab: white bg, border `--border` with no bottom border, text `--foreground`. Inactive: bg `#fafafa`, text `--subtle-foreground`. The panel below has a 1px border and p-4.
- **Tag**: 12px, h-5, px-1.5, 1px `--input` border, bg `#fafafa`, text `--muted-foreground`, radius 4px.

## 4. Target layout per page

### 4.1 App shell (all signed-in pages)
```
┌──────────────────── header 48px (dark) ─────────────────────────┐
│ ◆ Dashboard Agent   (Studio) (Thư viện)       [Dữ liệu giả lập] │
├────────────┬─────────────────────────────────────────────────────┤
│ sidebar    │ main (white, scrolls on its own)                    │
│ 280px      │                                                     │
│ + Mới      │                                                     │
│ Hội thoại  │                                                     │
│  …         │                                                     │
│ Dashboard  │                                                     │
│  …         │                                                     │
│────────────│                                                     │
│ BU builder │                                                     │
└────────────┴─────────────────────────────────────────────────────┘
```
- Viewer role: the sidebar shows only the "Dashboard đã xuất bản" list, with no conversation section and no "+ Mới" (Viewers cannot chat).
- The layout must work below `lg`: the sidebar becomes a Radix `Sheet` opened by a hamburger button in the header, and the main area stays full width. No horizontal scroll at 375px.

### 4.2 Home `/`
Like `wrenai_home.png`: vertically centred in the main area, max-w 640px.
- Brand icon (40px, rounded, bg accent) → "Bạn muốn xem số liệu gì?" (20px/500) → "Thử hỏi…" (14px muted).
- 3 suggestion cards in a row (1 column on mobile): each card is a `button`, 1px `--input` border, radius 6px, p-3, min-h 132px, with a tag at the top (e.g. "So sánh" / "Tỷ lệ" / "Tổng hợp") and the prompt in 14px `--foreground`, max 4 lines. Cards come from a `SUGGESTIONS: {tag, prompt}[]` constant built from `STARTER_PROMPTS`.
- Prompt tray fixed at the bottom (section 3).

### 4.3 Studio `/studio` and `/studio/[conversationId]` — a "results page", no chat column
The current 380px chat column is removed (history moves to the sidebar). The main column is centred, `max-w-[1200px]`, px-6, pt-8, pb-32. The conversation renders as a vertical list of **turns**:

```
(💬) So sánh doanh số các phân khu Ocean Park 2 quý 3/2026      ← user text, 20px/500, rendered ONCE
┌ ✦ Các bước tạo bản nháp        4 giai đoạn · 12 bước  ˅ ┐     ← ReasoningPanel (collapsed after done)
└──────────────────────────────────────────────────────────┘
<assistant outcome of this turn>                                ← clarification / denied / blocked / done / error block
<DashboardCanvas of the draft this turn produced>               ← only for the LATEST draft; older ones collapse
                                                                   to one line "Bản nháp v1 · đã được thay bằng v2  [Xem]"
┌ 💡 Câu hỏi gợi ý tiếp theo ───────────────────────────────┐  ← only after the last turn, when a draft exists
│ Đổi biểu đồ phân khu sang cột ngang                        │
│ Chỉ lấy thấp tầng                                          │
└────────────────────────────────────────────────────────────┘
                 [ fixed prompt tray: "Yêu cầu chỉnh sửa bản nháp…"  (Gửi) ]
```
- Empty studio (no turns): the same empty state as Home (icon, title, 3 suggestion cards).
- While a turn streams: its ReasoningPanel is open and running (4.4). The previous draft stays visible below at `opacity-60`, **no blur, no overlay**. Keep `data-testid="draft-stale"` on it.
- The "•••" indicator is replaced by the running ReasoningPanel, but keep an element with `data-testid="streaming-indicator"` while streaming (e.g. on the panel's running header) because tests query it.
- Auto-scroll to the newest turn on send.

### 4.4 ReasoningPanel (the most important piece)
References: `wrenai_reasoning_running.png`, `wrenai_reasoning_done.png`. The P-117 advantage to keep: the 17 nodes are grouped into the 4 business phases (`PHASES` in `features/stepper/PhaseStepper.tsx`).

States:
1. **Running**: open. Header: sparkle-list icon + "Đang tạo bản nháp…" and, on the right, a red outline button "⊘ Dừng" (h-6, 12px, border and text `--destructive`), which calls `onStop`. The chevron is hidden while running.
2. **Done**: auto-collapses to one line: "Các bước tạo bản nháp" + right meta "4 giai đoạn · 12 bước" + chevron. Clicking the header toggles it. It stays on the page permanently, one panel per turn.
3. **Stopped** (user pressed Dừng): collapsed, meta "Đã dừng", with the active node marked `stopped`.
4. **Blocked / denied / error**: the node that caused it is shown red (`deny_access`, `guard_input` for blocked, the last node before `error`). The panel stays open and the meta says "Dừng ở: <label>".

Body: a vertical timeline (2px `--border` line connecting 10px dots), phases as parent items and nodes as indented children:
```
● Phân tích câu hỏi                         ← phase: 14px/500; dot: done=hollow navy, running=solid navy + pulse, pending=hollow gray
   ✓ Kiểm tra an toàn · Yêu cầu an toàn      ← node: label 13px --muted-foreground, "·" result 12px --subtle-foreground
   ✓ Trích xuất thực thể
     [Ocean Park 2] [quý 3/2026] [doanh số theo phân khu]   ← tags
   ✓ Kiểm tra quyền truy cập  [Miền Bắc]
◉ Ánh xạ Semantic Cube
   ⟳ Kiểm tra truy vấn · Truy vấn lỗi: thiếu khoảng thời gian, đang sửa (lần 1/3)  ← running node: small 10px spinner after the text
○ Chọn biểu đồ                               ← pending phase: gray, no children yet
○ Hoàn tất bản nháp
```
- No numbered circles. Pending phases stay visible in gray so the user sees how much is left (this is where P-117 does better than WrenAI).
- Retries (S6) show as repeated children: "Kiểm tra truy vấn ✗ lỗi (lần 1/3)" (amber) → "Dựng lại truy vấn" → "Kiểm tra truy vấn ✓ hợp lệ". Use `dedupeSteps` only for **consecutive** duplicates, as today.
- After `draft_ready`, extra tags derived from the draft appear under the matching nodes (section 5, `stepDetail`): measures under `build_cube_queries`, chart types under `advise_charts`, "n/n nhận xét khớp số liệu" under `verify_insights`.
- Root `data-testid="reasoning-panel"`, header `reasoning-panel-toggle`, stop button `reasoning-stop-btn`. Every node row keeps `data-testid="step-item"` and `data-node="<node>"` (existing tests rely on these).

### 4.5 Widget card
- Tabs on each non-KPI widget: **Biểu đồ | Bảng dữ liệu | Truy vấn**.
  - Biểu đồ: the current chart (with the existing chart switcher and ⓘ explanation button kept in the card header).
  - Bảng dữ liệu: the widget's loaded rows through the existing `TableChart` (max-h 280px, scrolls).
  - Truy vấn: `widget.cube_query` pretty-printed as JSON in a `<pre>` (12px mono, bg `#fafafa`, radius 6px), plus `rule_trace` as a list.
- Card: 1px `--border`, radius 6px, no shadow, p-4. Title 14px/600, subtitle 12px `--subtle-foreground`, max 2 lines.
- **Grid fix**: S1 row 1 is KPI w=3 + bar w=6 = 9/12 columns, which leaves a hole. Add a pure `normalizeRowSpans(widgets)` that groups widgets by `layout.y` and widens the last widget of each row so the row fills 12 columns. Use it in both `DashboardCanvas` and the library detail.

### 4.6 Library `/dashboards`
Like `wrenai_knowledge.png`: page title "Thư viện dashboard" (20px/500) + description (14px muted), then a table:
`Tên dashboard | Trạng thái | Phiên bản | Số biểu đồ | Tác giả | Cập nhật | (Xem →)`.
Header row bg `#fafafa`, 14px/500; rows h-12, 1px `--border`. The container keeps `data-testid="dashboards-grid"`; each row keeps `data-testid="dashboard-card-<id>"`, and its "Xem" link keeps `view-dashboard-<id>`. Below `md` it falls back to stacked cards.

## 5. Adapters for data the backend does not provide yet

Each one is a small module with a `// TODO(BE):` comment and its own unit test:

| Adapter | File | For now (mock/FE) | Later (BE) |
|---|---|---|---|
| `useConversations()` | `frontend/src/stores/conversations.ts` (zustand, in-memory like the auth store, ADR-004) | `add({id, title, updatedAt})` on the first `done`/`draft_ready` of a conversation; the title is the first user message | replace with `GET /api/v1/conversations` |
| `useSidebarDashboards()` | `frontend/src/features/sidebar/useSidebarDashboards.ts` | `GET /api/v1/dashboards` (already mocked), grouped into "Bản nháp của tôi" / "Đã xuất bản" | same, add paging |
| `stepDetail(node, message, draft?)` | `frontend/src/features/stepper/stepDetail.ts` (pure) | returns `{ result: string; tags: string[]; tone: 'ok'\|'warn'\|'error' }`: rewrites the "Đang …" messages of **finished** nodes into results (table below), extracts tags from `extract_entities` ("Đã nhận diện: a, b, c" → 3 tags), `check_access` (region), and from `draft` (measures, chart types via `CHART_TYPE_LABELS`, insight count); `tone:'warn'` when the message matches `/lỗi/i` | read a structured `detail` field from `StepEvent` |
| `followUpSuggestions(draft)` | `frontend/src/features/chat/followUps.ts` (pure) | returns `REFINE_PROMPTS` | agent-generated suggestions |
| Stop | `useChatStream().abort` (already exists) | client-side abort only; the panel goes to "Đã dừng" | call a server cancel endpoint |

Finished-node result text (used when the node is done and its message starts with "Đang"):

| node | result |
|---|---|
| guard_input | Yêu cầu an toàn |
| route_intent | Đã phân loại yêu cầu |
| build_cube_queries | Đã dựng truy vấn (keep the "cho N biểu đồ" part if present) |
| load_data | Đã tải dữ liệu |
| advise_charts | Đã chọn biểu đồ |
| compute_facts | Đã tính các con số chính |
| write_insights | Đã viết nhận xét |
| verify_insights | Nhận xét khớp số liệu |
| others | the message unchanged |

## 6. Test IDs that must survive
`chat-input`, `send-btn`, `streaming-indicator`, `draft-stale`, `draft-canvas`, `dashboard-canvas`, `canvas-area`, `empty-canvas`, `streaming-loading`, `version-badge`, `draft-version`, `status-pending`, `status-published`, `status-rejected`, `hitl-review-bar`, `hitl-approve-btn`, `hitl-reject-btn`, `hitl-request-changes-btn`, `goto-library-btn`, `insights-panel`, `insight-fact-*`, `widget-<id>`, `widgets-grid`, `kpi-value`, `explain-btn-*`, `echarts-mock`, `heatmap-placeholder`, `clarification-box`, `clarification-question`, `clarification-option-*`, `banner-access-denied`, `banner-blocked`, `done-message`, `toast-error`, `toast-close-btn`, `prompt-chip-s1…s8`, `nav-dashboards-link`, `account-chip`, `account-btn-*`, `demo-data-banner` (now on the header badge), `simulated-data-badge`, `dashboards-grid`, `dashboard-card-*`, `view-dashboard-*`, `reset-filters-btn`, `active-cross-filter`, `step-item` (+ `data-node`), `stepper-container` (may move to the ReasoningPanel root in addition to `reasoning-panel`), `home-prompt-input`.

Gotcha: `studio.test.tsx` uses `getByText(<user prompt>)`, so each user message text must appear **exactly once** in the DOM (the turn title). Do not also put it in the sidebar row title while that conversation is open; use the draft title or a truncated copy with `aria-hidden` and different text.

## 7. Tasks (suggested split for PLAN.md, one concern each)

1. **Tokens**: `frontend/src/app/globals.css` (section 3 values, `--sidebar*`, `--subtle-foreground`, `shadow-prompt` utility), `components/ui/{button,badge,card}.tsx` (radius, no shadow). New test `frontend/src/app/__tests__/tokens.test.ts` reads `globals.css` and asserts `--radius: 0.375rem`, `--sidebar: #fafafa`, and that `shadow-prompt` is defined. TEST_CMD passes.
2. **Header 48px**: `components/layout/AppShell.tsx`, `app/layout.tsx`. Remove the gold banner row and move `demo-data-banner` onto a header badge; dark header with pill nav; the account moves to the sidebar in Task 3 (keep `account-chip` in the header until then). Test: the header renders the badge and the nav, and there is no element with the old banner classes.
3. **Sidebar + adapters**: `features/sidebar/SideNav.tsx`, `features/sidebar/useSidebarDashboards.ts`, `stores/conversations.ts`, AppShell integration (desktop fixed, mobile Sheet), account block with `account-chip` and logout. Tests: builder sees "Hội thoại" + dashboards; viewer sees only published dashboards and no "+ Mới"; selecting a row navigates.
4. **stepDetail + timeline model** (pure): `features/stepper/stepDetail.ts`, `features/stepper/timeline.ts` (`buildTimeline(steps, {running, terminal})` → phases with status `done|running|pending|error|stopped` and child nodes with `{label, result, tags, tone, status}`). Tests cover S1 (all done, 4 phases), S6 (retry children with warn tone), S3 (`deny_access` error), stopped mid-way, and finished-node message rewriting.
5. **ReasoningPanel component**: `features/stepper/ReasoningPanel.tsx` (states from 4.4, test IDs). Keep `Stepper.tsx`/`dedupeSteps` exported so `Stepper.test.tsx` still passes; `PhaseStepper` may become a thin wrapper or be deleted along with its imports. Tests: running shows the stop button and auto-open; done collapses with the "4 giai đoạn · N bước" meta; the toggle works; the stop button calls `onStop`.
6. **Studio: turns + panel per turn**: `features/studio/StudioView.tsx`. Replace the `messages` list with `turns: {id, userText, steps[], outcome[], draftVersion?, state}`; keep steps per turn (never cleared); render the ReasoningPanel per turn; the stop button calls `abort()` and marks the turn stopped; remove the overlay/blur (old draft `opacity-60`, `draft-stale` kept). Keep all studio/StudioView/conversation tests passing (update only selectors that referred to removed markup, never behaviour).
7. **Studio: results-page layout**: remove the 380px chat column; centred `max-w-[1200px]` column; question title rendered once; older drafts collapse to "Bản nháp vN · đã được thay bằng vM"; empty state = home-style cards; auto-scroll. Tests: the S1 flow renders the title once, the panel and the canvas; the S1→S4 flow shows v1 collapsed and v2 expanded.
8. **Prompt tray + follow-ups**: `features/chat/ChatInput.tsx` (auto-grow 1–4 lines, labelled "Gửi" button, `chat-input`/`send-btn` kept), new `features/chat/PromptTray.tsx` (fixed, centred right of the sidebar), `features/chat/followUps.ts`, a "Câu hỏi gợi ý tiếp theo" block in the Studio after the last turn. Tests: Enter sends, Shift+Enter makes a newline, the button is disabled when empty or streaming, clicking a follow-up sends it.
9. **Widget tabs + grid fix**: `features/canvas/WidgetCard.tsx`, new `features/canvas/normalizeRowSpans.ts`, `DashboardCanvas.tsx`, `features/library/DashboardDetail.tsx`. Tests: the tabs switch content; the "Truy vấn" tab shows the measure name; `normalizeRowSpans` makes S1 row 1 add up to 12; KPI widgets have no tabs.
10. **Home page**: `app/page.tsx`, `features/chat/PromptChips.tsx` (`SUGGESTIONS` + `SuggestionCards`). Tests: 3 cards with tags; clicking one stores the pending prompt and routes to `/studio` (existing behaviour); `home-prompt-input` kept.
11. **Library table**: `features/library/DashboardList.tsx` (table ≥ md, cards < md), test IDs kept. `library.test.tsx` passes unchanged except for markup-only selectors.
12. **Dev scenarios + polish**: move the S1–S8 chips (`prompt-chip-s*`, still only when `SHOW_FIXTURE_CHIPS`) into a small "Kịch bản dev" dropdown in the header; set `devIndicators: false` in `frontend/next.config.ts` so the Next badge no longer covers the UI; restyle the login card with the new tokens. Tests: the dropdown opens and a chip sends its prompt.

Order matters: 1 → 2 → 3 are safe foundations; 4 → 5 → 6 → 7 are the core; 8–12 are independent after that.

## 8. Out of scope (later, when the backend is ready)
- A real `detail`/`tags` field in `StepEvent` (contract change in `src/models/` plus regenerated types).
- `GET /api/v1/conversations` and a server-side cancel for the stop button.
- Agent-generated follow-up questions.
- A dark theme, and any Modeling/Knowledge equivalents.
