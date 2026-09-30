# Task done log — Giai đoạn 0–1 (Walking Skeleton)

- **Ngày:** 2026-09-27
- **Repo:** `/Users/thai/Vinuni/BuildPhaseProject/P-117` (remote `AI20K-Build-Phase-Cohort-4/P-117`)
- **Nhánh:** `feature/skeleton-g0-g1` (tách từ `develop`, `develop` tách từ `main`), **chưa push**
- **Commit:** `7916ab3 feat(models): dựng khung repo, tooling và contract (Giai đoạn 0-1)`
- **Kế hoạch gốc:** `claudePlain/P-117 · Kế hoạch dựng khung dự án (Walking Skeleton).md` (đã tick các task tương ứng)

## Kết quả kiểm tra

| Kiểm tra | Kết quả |
| --- | --- |
| `pytest tests/` | 50 passed |
| `ruff check` / `ruff format --check` | sạch |
| `mypy src/` | sạch |
| Frontend `pnpm lint` / `pnpm typecheck` | sạch |
| `pre-commit run --all-files` | tất cả Passed |
| `docker compose up --build` | postgres, backend, frontend đều healthy |
| `GET /api/v1/health` | 200 `{"status":"ok","llm_mode":"mock","cube_mode":"mock",...}` |
| `docker compose --profile cube up cube` | healthy |
| `make types` chạy 2 lần | output giống hệt (ổn định, dùng được cho CI) |

## Giai đoạn 0 — Repo, quy ước, tooling

| Task | Trạng thái | Ghi chú |
| --- | --- | --- |
| T0.1 | Xong | `git remote -v` trỏ đúng org khoá |
| T0.2 | **Còn lại** | Máy Duy đã có hook pre-push; 3 thành viên còn lại tự chạy `bash scripts/setup_hooks.sh` |
| T0.3 | Xong | `src/{api/routes,core,agent,db,models,services}`, `tests/{unit,integration,eval,fixtures/scenarios}`, `frontend/`, `cube/`, `docs/{adr,architecture}`. `src/agents` → `src/agent`, `src/config.py` → `src/core/config.py`; `src/main.py` giữ làm entry point |
| T0.4 | **Còn lại** | Đã tạo `develop` + feature branch ở local; cần push và bật branch protection cho `main` trên GitHub |
| T0.5 | Xong | Quy ước commit ghi trong README và PR template |
| T0.6 | **Còn lại một phần** | PR template mới (Thay đổi / Tại sao / Cách test / Checklist); cần bật rule review + CI trên GitHub |
| T0.7 | Xong | Python 3.12; `requirements.txt` có ràng buộc version; `mypy.ini`; giữ `ruff.toml` |
| T0.8 | Xong | Next.js 16 + pnpm 10 + ESLint + `next typegen && tsc --noEmit` |
| T0.9 | Xong | `.pre-commit-config.yaml`: ruff, mypy, eslint, tsc; bỏ qua `docs/guide/` và script AI logging; không đụng pre-push |
| T0.10 | Xong | `docker-compose.yml`: healthcheck + `depends_on: service_healthy`; Cube `v1.7.46` ở profile `cube` |
| T0.11 | Xong | Giữ `run/test/lint/format/typecheck/check/clean`, thêm `dev`, `dev-cube`, `down`, `types`, `fe-lint`, `fe-typecheck`, `hooks` |
| T0.12 | Xong | `.env.example` đủ biến theo kế hoạch |
| T0.13 | Xong | `/api/v1/health` chạy trong compose |
| T0.14 | **Còn lại một phần** | README mới có Quick Start, kiến trúc, contract; còn điền tên + vai trò 3 thành viên |

## Giai đoạn 1 — Contract, fixture, ADR

| Task | File | Ghi chú |
| --- | --- | --- |
| T1.1 | `src/models/common.py` | `Role`, `Region`, `ChartType` (9), `DashboardStatus`, `ReviewAction`, `Intent`, `RefinementKind`, `AuditActionType`, `RiskLevel`, `NodeName` (17), `Granularity` |
| T1.2 | `src/models/dashboard.py` | `UserContext`, `Entities`, `CubeQuery` (giữ camelCase của Cube qua alias), `WidgetSpec`, `Fact`, `Insight`, `DashboardSpec` |
| T1.3 | `src/models/events.py` | Discriminated union 7 event; quy tắc: luôn kết thúc bằng đúng một `done` |
| T1.4 | `src/models/api.py` | Login, Chat, Review (chỉ approve/reject + `version`), DashboardList/Detail, WidgetData (`columns` + `rows`), Health |
| T1.5 | `src/models/errors.py`, `src/core/errors.py` | 13 mã lỗi (thêm `CONFLICT`, `UNAUTHORIZED`, `NOT_IMPLEMENTED`, `INTERNAL_ERROR`), map HTTP status, message tiếng Việt không lộ nội bộ |
| T1.6 | `src/models/audit.py` | Bảng đối chiếu spec ↔ Sổ tay §11.7; chỉ lưu hash |
| T1.7 | `scripts/export_schemas.py`, `scripts/gen_types.sh` | Sinh `openapi.ts`, `sse-events.ts`, `scenario.ts` |
| T1.8 | `.github/workflows/ci.yml` | Job `contract-types`: sinh lại type, lệch thì fail |
| T1.9 | `tests/fixtures/scenarios/S1..S8_*.json` | Validate bằng `src/models/scenario.py`; test ở `tests/unit/test_scenarios.py` |
| T1.10 | `docs/adr/ADR-006-request-changes.md` | `request_changes` = lượt chat mới, không qua `/review` |
| T1.11 | `docs/adr/ADR-001-orchestration.md` (+ `docs/ADR-orchestration.md`) | Graph 17 node, điều kiện dừng 4 lớp |
| T1.12 | `docs/adr/ADR-002-langgraph-streaming.md` | `astream` v2 + `custom`/`updates`; khóa `langgraph>=1.2.12,<1.3` |
| T1.13 | `docs/adr/ADR-003-cube-validation.md` | Dùng `/v1/dry-run` (đã thử trên Cube 1.7.46) |
| T1.14 | `docs/adr/ADR-004-token-storage.md` | Token trong bộ nhớ + header `Authorization` |
| T1.15 | `docs/adr/ADR-005-tracing.md` | LangSmith |
| T1.16 | `docs/architecture/overview.md`, `agent-flow.md` | Nhúng vào README |

Tiêu chí "Xong khi" của Giai đoạn 1 còn thiếu: **review + merge, cả 4 người đã đọc**.

## Kết quả thí nghiệm dùng cho ADR

**LangGraph 1.2.12 (ADR-002, ADR-006)**
- `astream(stream_mode=["custom","updates"], version="v2")` trả event từ `get_stream_writer()`; interrupt hiện dưới dạng `updates` có `__interrupt__`.
- `Command(resume=...)` chạy lại node có `interrupt()` từ đầu, nên event `step` trước `interrupt()` bị phát 2 lần.
- Gửi input mới vào thread đang chờ duyệt: graph chạy lại từ `START` (qua `guard_input`), interrupt cũ bị bỏ.

**Cube 1.7.46 (ADR-003)**
- `/v1/dry-run` chạy được, trả `normalizedQueries` đã có filter RLS từ `queryRewrite`.
- Member sai → 400 `'revenue' not found for path ...`; lỗi ném từ `queryRewrite` → 500; operator sai → 400; token sai → 403.
- `/v1/load` trả số dạng chuỗi; RLS lọc đúng theo region.
- Tắt dev mode mà không có Cube Store thì `/load` lỗi → cần `CUBEJS_CACHE_AND_QUEUE_DRIVER=memory`.

## Quyết định/giả định cần cả đội review

- **Không có `DATA-16_MASTER_SPEC_v2.md`** trong workspace. Tên node, 9 chart type, tên member Cube (`SalesContracts.netRevenue`, `Zones.zoneName`, `Agents.agentName`, `Projects.projectName`, `Zones.segment`...), region (`MienBac`...) và cột audit là suy ra từ kế hoạch + tài liệu `DATA16/` + `Plan/`. Cần đối chiếu với spec v2 nếu có.
- S1 dùng widget donut cho "doanh số theo phân khu" để S4 ("đổi sang cột ngang") có nghĩa; horizontal_bar của S1 là "Top 5 sàn phân phối".
- Số liệu trong fixture là giả lập, tự nhất quán (tổng, tỷ trọng, tăng trưởng khớp nhau).
- Có route stub trả 501 cho `/auth/login`, `/chat/stream`, `/dashboards...` để khóa đường dẫn API trong OpenAPI; Giai đoạn 4 thay bằng code thật.

## Thay đổi ngoài repo / môi trường máy

- `README.md` cũ của template (giới thiệu khoá học) bị thay bằng README dự án; bản cũ còn trong git history.
- `.venv` tạo lại bằng Python 3.12; bản 3.11 cũ chuyển vào thư mục scratchpad của phiên Claude.
- Đã cài `pnpm@10` toàn cục (`npm i -g pnpm`) và bật Docker Desktop.
- Container `cube-demo` đang chiếm cổng 5432 và 4000 → không tắt; compose cho đổi cổng: `POSTGRES_PORT=5433 CUBE_PORT=4001 make dev-cube`.
- Stack thí nghiệm Cube tạm (`cubespike`) đã được dọn.

## Việc cần làm tiếp

1. Push `develop` và `feature/skeleton-g0-g1`, mở PR vào `develop` (chưa làm, chờ xác nhận).
2. Bật branch protection `main` + rule "≥1 review + CI xanh".
3. Sửa `.github/CODEOWNERS` (đang giao mọi file cho `@AI20K-Build-Phase/book-maintainers` của template, có thể chặn PR).
4. 3 thành viên chạy `bash scripts/setup_hooks.sh` + `make hooks`, điền `AI_LOG_API_KEY`.
5. Điền thành viên + vai trò vào README.
6. Cả đội review contract, fixture, ADR → merge → bắt đầu Giai đoạn 2–6 song song.

## Cách kiểm tra lại nhanh

```bash
cd /Users/thai/Vinuni/BuildPhaseProject/P-117
git checkout feature/skeleton-g0-g1
source .venv/bin/activate
make test lint typecheck
make types && git status --short frontend/src/lib/api/generated   # không có thay đổi = contract khớp
POSTGRES_PORT=5433 make dev                                      # rồi: curl localhost:8000/api/v1/health
```
