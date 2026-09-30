# P-117 · Kiến thức cần nắm trước khi dựng khung

Sep 26, 2026 · @Duy

## Lộ trình đọc

Là leader, bạn cần hiểu **ranh giới giữa các phần** hơn là chi tiết từng phần. Đọc theo thứ tự ưu tiên dưới đây; mức "đủ dùng" là có thể review code của thành viên và biết họ đang làm sai contract hay không.

| Ưu tiên | Chủ đề | Dùng ở giai đoạn | Vì sao cần trước |
| --- | --- | --- | --- |
| 1 | Tư duy kiến trúc (skeleton, contract, adapter) | 0–1 | Quyết định cách cả đội chia việc |
| 1 | Pydantic v2 + FastAPI | 1, 4 | Contract viết bằng Pydantic |
| 1 | LangGraph | 3 | Phần lạ nhất, quyết định hình dạng SSE và HITL |
| 1 | SSE | 4, 5 | Chỗ nối backend ↔ frontend dễ vỡ nhất |
| 2 | Cube.dev | 2, 6 | Cần biết query JSON để viết mock đúng hình |
| 2 | JWT, RBAC, securityContext | 2, 4 | Bảo mật đi xuyên suốt 3 tầng |
| 2 | Frontend (App Router, MSW, sinh type) | 5 | Thế mạnh của bạn, chỉ cần phần sinh type + MSW |
| 3 | SQLAlchemy async + Alembic | 4 | Khá chuẩn, học khi làm |
| 3 | Docker Compose, pytest, Playwright | 0, 7 | Khá chuẩn, học khi làm |

Phần cuối doc có bài tự kiểm tra: trả lời được hết là đủ để bắt đầu Giai đoạn 0–1.

## Tư duy kiến trúc

Ba ý tưởng này quyết định các phần làm riêng có khớp nhau hay không.

**Walking skeleton.** Bản nhỏ nhất chạy được từ đầu đến cuối, qua mọi tầng thật. Mục đích là lộ lỗi tích hợp sớm, khi sửa còn rẻ. Khác với prototype: skeleton không bị vứt đi mà được "đắp thịt" dần.

**Contract-first.** Thống nhất hình dạng dữ liệu trước khi viết logic. Ở dự án này có 3 loại contract cần khóa:

- API REST (request/response) — sinh OpenAPI tự động từ FastAPI.
- Sự kiện SSE — không nằm trong OpenAPI, phải tự xuất JSON Schema.
- `DashboardSpec` — đi qua cả 3 tầng: agent sinh, DB lưu, frontend vẽ.

**Ports & adapters (hexagonal).** Code nghiệp vụ chỉ biết một interface (port). Mỗi interface có nhiều cài đặt (adapter): mock và real. Chọn adapter ở một chỗ duy nhất (factory đọc env). Trong Python dùng `typing.Protocol` hoặc `abc.ABC` để khai báo port.

**Golden test / fixture dùng chung.** Cùng một file JSON kịch bản được dùng ở 3 nơi: mock LLM/Cube, MSW frontend, và test. Nếu một phía sửa hình dạng dữ liệu mà phía kia không theo, test sẽ vỡ ngay.

Đọc thêm: khái niệm "walking skeleton" của Alistair Cockburn và "Hexagonal Architecture" (link ở mục Nguồn).

## Pydantic v2 + FastAPI

Contract của dự án viết bằng Pydantic, nên đây là thứ cần nắm chắc nhất.

**Pydantic v2 — cần biết:**

- `BaseModel`, `Field(default_factory=...)`, `Literal[...]` cho enum dạng chuỗi.
- **Discriminated union**: `Annotated[Union[A, B], Field(discriminator="event")]` — dùng cho SSE event.
- `model_dump()`, `model_validate()`, `model_json_schema()` (xuất JSON Schema cho frontend).
- `TypeAdapter` để validate/xuất schema cho kiểu không phải model (ví dụ union).
- `pydantic-settings` (`BaseSettings`) để đọc env vào `Settings`.

**FastAPI — cần biết:**

- `APIRouter` + prefix `/api/v1`; `response_model` để OpenAPI có schema đầu ra.
- **Dependency injection** (`Depends`): dùng cho `current_user`, `require_role`, và để inject client mock/real. Test có thể thay bằng `app.dependency_overrides`.
- `lifespan`: khởi tạo graph, checkpointer, DB pool khi app bật; đóng khi tắt.
- Exception handler chung để mọi lỗi trả cùng format.
- `app.openapi()` trả dict OpenAPI — script `gen_types` gọi hàm này mà không cần chạy server.

**Thực hành nhanh:** viết 1 endpoint `POST /echo` nhận và trả một `DashboardSpec`, mở `/docs` xem schema, rồi chạy `openapi-typescript` ra file `.ts`.

## SSE (Server-Sent Events)

SSE là kết nối HTTP một chiều: server giữ response mở và đẩy từng sự kiện xuống client. Dự án dùng SSE để đẩy tiến trình của agent (stepper) và bản nháp.

**Định dạng trên dây** (`Content-Type: text/event-stream`): mỗi sự kiện là các dòng `field: value`, kết thúc bằng một dòng trống.

```
event: step
data: {"node":"extract_entities","message":"Đã nhận diện: Ocean Park 2"}

event: draft_ready
data: {"dashboard_id":"d-1","draft":{...}}

```

**Phía server (FastAPI):** FastAPI đã có sẵn `EventSourceResponse` và `ServerSentEvent` trong `fastapi.sse`. Endpoint dùng `yield` và khai báo `response_class=EventSourceResponse`; muốn đặt trường `event` thì yield `ServerSentEvent(data=..., event="step")`. Cách này hoạt động với cả POST. Dự án cũ thường dùng thư viện `sse-starlette`, tương tự.

**Phía client:** `EventSource` của trình duyệt chỉ gửi được GET và không gắn header `Authorization`. Vì endpoint chat là POST có JWT, cần tự đọc stream:

1. `fetch(url, {method: "POST", headers, body})`.
2. Đọc `response.body.getReader()`, giải mã bằng `TextDecoder`.
3. Nối vào buffer, cắt theo `\n\n`, tách `event:` và `data:`, rồi `JSON.parse`.
4. Chunk mạng có thể cắt ngang một sự kiện — luôn giữ phần dư trong buffer.

Có thể dùng thư viện `@microsoft/fetch-event-source` thay vì tự viết.

**Bẫy hay gặp:** proxy/CDN buffer làm sự kiện đến dồn một lần (cần tắt buffering, ví dụ header `X-Accel-Buffering: no`); CORS chưa cho phép header; client không hủy request khi rời trang (dùng `AbortController`).

**Thực hành nhanh:** endpoint POST yield 5 sự kiện cách nhau 0,5s; xem bằng `curl -N`, rồi viết hook React hiển thị từng sự kiện.

## LangGraph

LangGraph là phần lạ nhất và quyết định hình dạng SSE lẫn HITL, nên đọc kỹ nhất. Dùng **Python ≥ 3.11** để tránh các giới hạn async bên dưới.

**Khái niệm cốt lõi:**

- **`StateGraph(State)`**: state là `TypedDict` (hoặc Pydantic). Node là hàm nhận state, trả **phần state thay đổi** (dict), không trả cả state.
- **Reducer**: `Annotated[list, add_messages]` nghĩa là nối thêm thay vì ghi đè. Trường không có reducer thì bị ghi đè.
- **Cạnh**: `add_edge(a, b)` cố định; `add_conditional_edges(a, route_fn)` với `route_fn(state) -> tên node`. Vòng retry của `validate_queries` là một cạnh có điều kiện quay lại.
- **`config["configurable"]`**: nơi truyền `thread_id` và các dependency (client LLM/Cube) vào node.

**Stream tiến trình (cho stepper):** trong node gọi `get_stream_writer()` (import từ `langgraph.config`) rồi `writer({...})`. Phía ngoài chạy `graph.astream(..., stream_mode=["custom", "updates"], version="v2")`; mỗi chunk có dạng `{"type", "ns", "data"}`. `version="v2"` cần LangGraph 1.1+. Với Python < 3.11, `get_stream_writer` không chạy trong node async — phải nhận `writer: StreamWriter` làm tham số.

**HITL bằng `interrupt()`** (import từ `langgraph.types`):

1. Cần checkpointer và `thread_id`. `thread_id` cũ = tiếp tục; `thread_id` mới = bắt đầu trống.
2. `decision = interrupt(payload)` dừng graph và lưu state. Payload phải serialize được JSON.
3. Resume bằng cách gọi lại graph với `Command(resume=value)`; `value` trở thành giá trị trả về của `interrupt()`.
4. **Khi resume, node chạy lại từ đầu**, không phải từ dòng `interrupt`.

**Luật cần nhớ với `interrupt`:**

- Không bọc `interrupt()` trong `try/except Exception` — nó dừng bằng cách ném exception đặc biệt.
- Code có side effect (ghi DB, audit) đặt **sau** `interrupt` hoặc ở node riêng, vì code trước nó sẽ chạy lại. Đây là lý do `hitl_review` chỉ nên gọi `interrupt` và trả kết quả, còn lưu DB nằm ở `publish`.
- `Command(resume=...)` là cách duy nhất nên truyền `Command` làm input. Lượt chat mới (multi-turn) truyền dict input bình thường.

**Checkpointer:** `InMemorySaver`/`MemorySaver` chỉ dùng cho test. Dự án dùng `AsyncPostgresSaver` (package `langgraph-checkpoint-postgres`), gọi `setup()` một lần để tạo bảng.

**Cần chốt trong Giai đoạn 1:** LangGraph 1.2 có thêm API mới `graph.stream_events(..., version="v3")` với `stream.interrupted` / `stream.interrupts`, và tài liệu khuyên dùng cho ứng dụng mới. Nhóm nên chọn **một** trong hai cách (`astream` v2 + custom mode, hay `stream_events` v3), khóa version LangGraph trong lockfile, và ghi vào JOURNAL.

**Thực hành nhanh:** graph 3 node `plan → review → publish`, `review` gọi `interrupt`, dùng `InMemorySaver`. Chạy tới interrupt, resume với `approve` và `reject`, in thứ tự node. Sau đó đổi sang `AsyncPostgresSaver` và resume sau khi tắt/bật lại process.

## Cube.dev (Semantic Layer)

Cần hiểu Cube đủ để viết `MockCubeClient` đúng hình: cùng dạng query, cùng dạng response, cùng dạng lỗi.

**Khái niệm:**

- **Cube**: một bảng (hoặc SQL) có `measures` (số tổng hợp: `count`, `sum`, `number`…) và `dimensions` (thuộc tính để nhóm/lọc; kiểu `time` là time dimension).
- **Joins**: khai báo quan hệ giữa các cube (`many_to_one`…). Query có thể lấy member của nhiều cube, Cube tự join.
- **Member**: tên đầy đủ dạng `Cube.member`, ví dụ `SalesContracts.netRevenue`.
- **Pre-aggregation**: bảng tổng hợp sẵn lưu trong Cube Store. Query chỉ "trúng" khi mọi member và filter của nó có trong pre-agg.

**Query JSON** (cái agent sinh ra và cái contract `CubeQuery` mô tả):

```json
{
  "measures": ["SalesContracts.netRevenue"],
  "dimensions": ["Zones.zoneName"],
  "timeDimensions": [{"dimension": "SalesContracts.contractDate",
                      "dateRange": ["2026-07-01", "2026-09-30"],
                      "granularity": "month"}],
  "filters": [{"member": "Projects.projectName", "operator": "equals", "values": ["Ocean Park 2"]}],
  "order": {"SalesContracts.netRevenue": "desc"},
  "limit": 100
}
```

**REST API** (mặc định dưới `/cubejs-api`, header `Authorization` mang JWT):

| Endpoint | Dùng cho | Ghi chú |
| --- | --- | --- |
| `/v1/meta` | Danh sách cube, measure, dimension kèm title | Nạp vào prompt `build_cube_queries`; nguồn cho `MockCubeClient.meta()` |
| `/v1/load` | Chạy query, trả `data` + `annotation` | Dùng POST để tránh giới hạn độ dài URL; trường `external: true` nghĩa là trúng pre-agg |
| `/v1/sql` | Biên dịch query ra SQL, không chạy | Dùng để debug, và có thể dùng để validate |
| `/v1/dry-run` | Validate query | Có tồn tại trong code Cube nhưng **không nằm trong trang reference chính thức** |

**Điểm cần lưu ý cho contract:**

- Cube trả số dưới dạng **chuỗi** (ví dụ `"700"`) để không mất độ chính xác. Backend phải parse trước khi đưa vào `WidgetDataResponse`; mock cũng nên trả chuỗi để bắt lỗi này sớm.
- Vì `/v1/dry-run` không có trong tài liệu chính thức, `CubeClient.dry_run()` nên được thử trên bản Cube nhóm dùng; nếu không ổn thì đổi sang gọi `/v1/sql`. Interface không đổi, chỉ adapter đổi.
- `/v1/load` với query chạy lâu có thể trả lỗi `Continue wait` và client phải gọi lại. `HttpCubeClient` cần vòng retry cho trường hợp này (kiểm chứng trên bản Cube thật).

**Bảo mật:** JWT ký bằng `CUBEJS_API_SECRET`; payload trở thành `securityContext`. Trong `cube.js`, `queryRewrite(query, { securityContext })` được gọi cho mọi query, nơi thêm filter theo vùng/dự án (xem mục 4.5 spec).

**Thực hành nhanh:** chạy Cube bằng Docker với Postgres và 2 bảng nhỏ, viết 1 cube có 1 measure, gọi `/v1/meta` và `/v1/load` bằng `curl`, rồi thêm `queryRewrite` và xem query bị thêm filter.

## Auth: JWT, RBAC, securityContext

Dự án có **hai loại JWT** khác nhau, dễ nhầm.

| Token | Ai ký | Ai đọc | Hạn | Nội dung |
| --- | --- | --- | --- | --- |
| Token người dùng | Backend, lúc `/auth/login` | Backend (mọi request từ frontend) | Vài giờ | `sub`, `role`, `region`, `allowed_projects` |
| Token Cube | Backend, mỗi lần gọi Cube | Cube | 5 phút | Cùng payload, ký bằng `CUBEJS_API_SECRET` |

**Cần biết:**

- JWT = header.payload.signature; payload **chỉ được ký, không được mã hóa** — không đặt bí mật vào đó.
- Thư viện Python: `PyJWT`. Thuật toán HS256 với secret dùng chung là đủ cho dự án.
- **RBAC** = kiểm tra role ở backend (`require_role("Builder", "Admin")`). **RLS** = lọc dữ liệu theo thuộc tính người dùng, làm ở Cube.
- Frontend ẩn nút theo role chỉ là UX; bảo mật thật nằm ở backend và Cube.
- `securityContext` luôn lấy từ user thật đã xác thực, **không bao giờ** từ nội dung chat hay output của LLM. Đây là lớp chống prompt injection kiểu "bỏ qua bộ lọc vùng".

**Lưu token ở frontend:** trong skeleton có thể giữ trong bộ nhớ/Zustand. Nếu muốn giữ qua reload, cân nhắc cookie `httpOnly` thay vì `localStorage` — quyết trong Giai đoạn 1 vì nó ảnh hưởng cách gọi SSE.

## Postgres: SQLAlchemy async + Alembic

Phần này khá chuẩn, nắm đủ các điểm sau là làm được.

- **SQLAlchemy 2.x async**: `create_async_engine("postgresql+asyncpg://...")`, `async_sessionmaker`, model khai báo bằng `Mapped[...]` + `mapped_column`.
- **Session theo request**: một dependency FastAPI `get_db()` mở session và đóng sau request.
- **JSONB**: cột `cube_query`, `rule_trace`, `spec` lưu dạng JSONB; ghi bằng `model_dump(mode="json")` của Pydantic.
- **Alembic**: `alembic init -t async`, `revision --autogenerate`, `upgrade head`. Luôn đọc lại file migration sinh tự động trước khi commit (autogenerate hay bỏ sót enum và index).
- **Append-only audit**: trong migration, `REVOKE UPDATE, DELETE ON audit_event_logs FROM <app_user>`.
- **Hai "chủ sở hữu" bảng trong cùng DB**: bảng app do Alembic quản lý; bảng checkpoint do `AsyncPostgresSaver.setup()` tạo. Không để Alembic autogenerate đụng vào bảng checkpoint (dùng `include_object` để loại trừ, hoặc tách schema riêng).

## Frontend

Frontend là thế mạnh của bạn, nên chỉ liệt kê những phần đặc thù của dự án này.

**Sinh type từ backend:**

- `openapi-typescript` đọc file OpenAPI và sinh `paths`, `components["schemas"]`.
- `openapi-fetch` (cùng tác giả) cho client gọi API có type theo path — sai path hoặc sai body là lỗi compile.
- `json-schema-to-typescript` cho SSE event (xuất từ `TypeAdapter(SSEEvent).json_schema()`).
- Thư mục `generated/` không bao giờ sửa tay.

**Exhaustive check** để thêm enum mới là compile báo thiếu: dùng `Record<ChartType, ...>` / `Record<NodeName, ...>` và `switch` có nhánh `default` gán vào biến kiểu `never`.

**MSW (Mock Service Worker):**

- Chặn request ở tầng mạng, nên code app gọi API y hệt khi có backend thật.
- Cú pháp v2: `http.post("/api/v1/...", handler)` trả `HttpResponse.json(...)`.
- Giả SSE: trả `new HttpResponse(readableStream, { headers: { "Content-Type": "text/event-stream" } })`, trong stream enqueue từng sự kiện có delay.
- Handler đọc cùng file golden scenario với backend (import JSON hoặc copy bằng script).

**Next.js App Router:**

- Màn có tương tác (chat, studio, canvas) là Client Component (`"use client"`).
- Biến môi trường cần đọc ở browser phải có tiền tố `NEXT_PUBLIC_`.
- ECharts chỉ chạy ở client; nếu gặp lỗi SSR thì load component chart bằng `next/dynamic` với `ssr: false`.

**react-grid-layout:** lưới 12 cột, mỗi item có `{i, x, y, w, h}` — khớp với `WidgetSpec.layout`. `i` = `widget_id`.

**Zustand:** một store cho phiên chat (event, draft hiện tại), một store cho filter. Tránh để component tự giữ bản sao của `DashboardSpec`.

## Hạ tầng & kiểm thử

**Docker Compose:**

- `depends_on` + `healthcheck` để backend chờ Postgres sẵn sàng.
- `profiles` để Cube chỉ bật khi cần (`docker compose --profile cube up`).
- Trong mạng compose, service gọi nhau bằng tên service (`postgres:5432`), không phải `localhost`.
- `.env` nạp vào compose; `.env.example` commit lên repo, `.env` thì không.

**Kiểm thử backend:**

- `pytest` + `pytest-asyncio` cho test async.
- `httpx.AsyncClient` với `ASGITransport(app=app)` để gọi API không cần chạy server.
- `app.dependency_overrides` để thay client mock/real hoặc user trong test.
- Graph test: compile với `InMemorySaver` cho nhanh; riêng test resume-sau-restart dùng Postgres thật.

**E2E:** Playwright — `page.goto`, `getByRole`, `expect(...).toBeVisible()`. Chạy trên stack compose mock mode để kết quả ổn định.

**CI:** GitHub Actions với service container Postgres; cache `uv`/`pnpm`; bước "sinh type rồi `git diff --exit-code`" để bắt lệch contract.

## Bài tự kiểm tra

Trả lời được hết (không cần tra) là đủ để dẫn dắt Giai đoạn 0–1. Tick khi chắc.

- [ ] Nếu backend thêm một trường vào `WidgetSpec` mà quên sinh lại type, bước nào trong CI báo lỗi?
- [ ] Vì sao endpoint chat không dùng được `EventSource` của trình duyệt?
- [ ] Khi Builder bấm Duyệt, backend cần những gì để resume đúng graph? (gợi ý: 2 thứ)
- [ ] Code nào trong `hitl_review` sẽ chạy hai lần, và vì sao không được ghi audit ở đó?
- [ ] Khác nhau giữa `MemorySaver` và `AsyncPostgresSaver` khi Cloud Run có 2 instance?
- [ ] `securityContext` của Cube đến từ đâu, và vì sao LLM không thể đổi nó?
- [ ] Viewer Miền Bắc gọi thẳng `/widgets/{id}/data` của một dashboard Miền Nam: những lớp nào chặn?
- [ ] Tại sao `MockCubeClient.load` nên trả số dạng chuỗi?
- [ ] Refine "đổi sang cột ngang" đi nhánh nào của `plan_refinement`, có gọi Cube không?
- [ ] Đổi từ mock sang Cube thật, cần sửa những file nào? (đáp án đúng: chỉ adapter + env)

## Nguồn

**Đã đối chiếu khi viết doc này:**

- [LangGraph — Interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts)
- [LangGraph — Streaming](https://docs.langchain.com/oss/python/langgraph/streaming)
- [Cube — REST API reference](https://docs.cube.dev/reference/core-data-apis/rest-api/reference)
- [FastAPI — Server-Sent Events](https://fastapi.tiangolo.com/tutorial/server-sent-events/)
- [Cube issue #1583 — `/dry-run` chưa được document](https://github.com/cube-js/cube/issues/1583)

**Tài liệu chính thức nên đọc thêm:**

- [LangGraph — Persistence (checkpointer)](https://docs.langchain.com/oss/python/langgraph/persistence)
- [Pydantic — Unions / discriminated unions](https://docs.pydantic.dev/latest/concepts/unions/)
- [FastAPI — Dependencies](https://fastapi.tiangolo.com/tutorial/dependencies/)
- [Cube — tài liệu tổng](https://docs.cube.dev/)
- [openapi-typescript](https://openapi-ts.dev/)
- [MSW](https://mswjs.io/docs/)
- [SQLAlchemy — asyncio](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)
- [Playwright](https://playwright.dev/docs/intro)
- [Alistair Cockburn — Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
