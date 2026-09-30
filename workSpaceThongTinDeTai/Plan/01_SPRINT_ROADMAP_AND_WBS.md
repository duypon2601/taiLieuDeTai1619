# 01. PHÂN RÃ CÔNG VIỆC (WBS) & LỘ TRÌNH SPRINT CHI TIẾT
## ĐỀ TÀI DATA-16: AI AGENT TỰ SINH DASHBOARD TỪ NGÔN NGỮ TỰ NHIÊN
### Đội thi: P-117 | Lộ trình: 12 Tuần — 6 Sprints (2 tuần/Sprint)

---

## 1. CẤU TRÚC PHÂN RÃ CÔNG VIỆC TỔNG THỂ (WORK BREAKDOWN STRUCTURE - WBS)

Hệ thống công việc dự án được phân chia thành 6 gói công việc chính (Work Packages - WP):

```
DATA-16 Project Root
│
├── WP-1: Quản Trị Dự Án & Hồ Sơ Gates (Project Management & Compliance)
│   ├── WP-1.1: Quản lý Backlog, Sprint Planning & Daily Standup
│   ├── WP-1.2: Soạn thảo và nộp báo cáo Gate 1, Gate 2, Gate 3, Gate 4
│   ├── WP-1.3: Giám sát tuân thủ AI Usage Log trên hệ thống Phoenix
│   └── WP-1.4: Cập nhật JOURNAL.md & WORKLOG.md hàng tuần
│
├── WP-2: Kỹ Thuật Dữ Liệu & Semantic Layer (Data & Semantic Engineering)
│   ├── WP-2.1: Thiết kế & Tạo dữ liệu mẫu BĐS Vinhomes trên Google BigQuery
│   ├── WP-2.2: Cài đặt và cấu hình máy chủ Semantic Cube.dev (Docker)
│   ├── WP-2.3: Xây dựng Semantic Data Models (Measures, Dimensions, Joins)
│   ├── WP-2.4: Cấu hình Pre-aggregations Rollup tối ưu FinOps
│   └── WP-2.5: Thiết lập bảo mật cấp dòng (Row-Level Security - RLS)
│
├── WP-3: Phát Triển Hệ Thống AI Agent (LangGraph Multi-Agent Orchestration)
│   ├── WP-3.1: Xây dựng LangGraph State Schema & Supervisor Router
│   ├── WP-3.2: Phát triển Intent & Entity Extraction Agent (Xử lý tiếng Việt)
│   ├── WP-3.3: Phát triển Cube Query Builder Agent & Schema RAG
│   ├── WP-3.4: Xây dựng vòng lặp tự sửa lỗi truy vấn (Self-Correction Loop)
│   ├── WP-3.5: Phát triển Chart Advisor Agent (Bộ quy tắc Heuristic CSS)
│   └── WP-3.6: Phát triển Narrative Insight & Anomaly Detection Agent
│
├── WP-4: Dịch Vụ Backend & Cơ Chế HITL (Backend & API Gateway)
│   ├── WP-4.1: Khởi tạo ứng dụng FastAPI, Pydantic v2 Models & Settings
│   ├── WP-4.2: Tích hợp cơ chế xác thực JWT, RBAC & Security Context
│   ├── WP-4.3: Xây dựng Server-Sent Events (SSE) streaming tiến trình Agent
│   ├── WP-4.4: Thiết kế CSDL PostgreSQL lưu trữ Dashboard, Widget & Audit Log
│   └── WP-4.5: Xây dựng API điểm ngắt duyệt có sự tham gia của con người (HITL)
│
├── WP-5: Giao Diện Người Dùng & Trực Quan Hóa (Frontend & Visualization)
│   ├── WP-5.1: Khởi tạo dự án Next.js 14 App Router, Tailwind CSS & Shadcn/UI
│   ├── WP-5.2: Xây dựng Chat & Conversational Input Panel với gợi ý câu hỏi
│   ├── WP-5.3: Phát triển Dashboard Canvas động với Apache ECharts & Recharts
│   ├── WP-5.4: Xây dựng cơ chế lọc chéo thời gian thực (Cross-filtering) qua Zustand
│   ├── WP-5.5: Phát triển Modal xem nháp & duyệt xuất bản (HITL Review Studio)
│   └── WP-5.6: Tính năng xuất bản báo cáo ra file PDF/PNG chất lượng cao
│
└── WP-6: Đánh Giá, DevOps & Hồ Sơ Demo Day (Evaluation, DevOps & Demo Day)
    ├── WP-6.1: Xây dựng bộ dữ liệu kiểm thử Ground Truth 100 test cases
    ├── WP-6.2: Triển khai pipeline đánh giá tự động (CSS, VER, Hallucination)
    ├── WP-6.3: Cấu hình CI/CD GitHub Actions (Ruff linter, Pytest)
    ├── WP-6.4: Đóng gói Docker và deploy hệ thống lên Google Cloud Run & Vercel
    ├── WP-6.5: Sản xuất Video Demo (1080p, thời lượng 3-5 phút)
    └── WP-6.6: Thiết kế Pitch Deck trình bày trước hội đồng giám khảo
```

---

## 2. KẾ HOẠCH CHI TIẾT TỪNG SPRINT (SPRINT BACKLOG)

### SPRINT 1: NỀN TẢNG DỰ ÁN, MOCK DATA & SETUP MÔI TRƯỜNG (TUẦN 1 — TUẦN 2)
> **Mục tiêu Sprint (Sprint Goal):** Hoàn thành hồ sơ Gate 1; Khởi tạo môi trường lập trình chuẩn; Kích hoạt AI Log; Thiết kế bộ dữ liệu mẫu BigQuery BĐS Vinhomes và khởi tạo bộ khung mã nguồn.

| Mã Task | Tên nhiệm vụ | Người phụ trách | Ước tính | Phụ thuộc | Tiêu chí hoàn thành (Acceptance Criteria) |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **T1.1** | Hoàn thiện tài liệu nộp Gate 1 (PRD, Wireframe, Member Roles). | Leader | 8h | Không | File `GATE_1_SUBMISSION.md` và `.pdf` nộp đúng hạn lên hệ thống. |
| **T1.2** | Cài đặt và kiểm tra hook AI Usage Logging trên repo `P-117`. | Toàn đội | 4h | T1.1 | Chạy script setup thành công, commit thử nghiệm ghi nhận trên Phoenix. |
| **T1.3** | Thiết kế lược đồ CSDL BĐS: Fact Sales, Fact Deposits, Dim Projects, Dim Agents, Dim Date. | Data Eng | 12h | Không | Bản vẽ ERD chuẩn và file DDL SQL tạo bảng trên Google BigQuery. |
| **T1.4** | Sinh bộ dữ liệu giả lập (Mock Data Generator) khoảng 50,000 dòng giao dịch BĐS. | Data Eng | 16h | T1.3 | Script Python sinh dữ liệu logic (doanh số, căn hộ, cọc, hủy cọc) nạp vào BigQuery. |
| **T1.5** | Thiết lập repo FastAPI chuẩn (Pydantic settings, cấu trúc modules, Ruff, Pytest). | Backend Dev | 10h | Không | Lệnh `make lint` và `make test` chạy xanh không lỗi. |
| **T1.6** | Cài đặt Docker Compose chạy thử nghiệm Cube.dev cục bộ kết nối BigQuery. | Data Eng | 12h | T1.4 | Cube server khởi động thành công, giao diện Cube Playground truy vấn được BigQuery. |
| **T1.7** | Khởi tạo dự án Next.js 14 với TypeScript, Tailwind CSS và Shadcn/UI components. | Frontend Dev | 12h | Không | Next.js dev server chạy cổng 3000, theme Dark/Light mode hoạt động. |
| **T1.8** | Cập nhật báo cáo tuần `JOURNAL.md` và `WORKLOG.md` của Sprint 1. | Leader | 2h | T1.1 - T1.7 | Đầy đủ nội dung các đầu việc đã hoàn thành trong tuần. |

---

### SPRINT 2: SEMANTIC LAYER & BASELINE AGENT POC (TUẦN 3 — TUẦN 4) — CỘT MỐC GATE 2
> **Mục tiêu Sprint (Sprint Goal):** Hoàn thiện Semantic Data Models trên Cube.dev; Xây dựng đồ thị LangGraph cơ bản kết nối LLM; Thực thi luồng End-to-End: Gõ prompt tiếng Việt $\rightarrow$ Sinh Cube JSON $\rightarrow$ Trả dữ liệu thô; Vượt qua Gate 2.

| Mã Task | Tên nhiệm vụ | Người phụ trách | Ước tính | Phụ thuộc | Tiêu chí hoàn thành (Acceptance Criteria) |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **T2.1** | Viết Cube Data Models cho `SalesTransactions`, `Deposits`, `Projects`, `Agents`. | Data Eng | 16h | T1.6 | Định nghĩa đầy đủ các measures (doanh số, số cọc, tỷ lệ vào HĐ) và dimensions. |
| **T2.2** | Thiết kế LangGraph State Schema (TypedDict) và Supervisor Graph structure. | AI Architect | 12h | T1.5 | File `src/agents/state.py` và `graph.py` có cấu trúc state hoàn chỉnh. |
| **T2.3** | Xây dựng Intent & Entity Extraction Node (nhận diện dự án, thời gian, metric bằng tiếng Việt). | Backend Dev | 16h | T2.2 | Parse chính xác các câu hỏi tiếng Việt cơ bản về dự án Ocean Park, Grand Park. |
| **T2.4** | Xây dựng Cube Query Builder Node (ánh xạ thực thể sang cấu trúc JSON của Cube REST API). | Backend Dev | 16h | T2.1, T2.3 | Trả về payload JSON Cube hợp lệ cho các câu hỏi phổ biến. |
| **T2.5** | Xây dựng Service gọi Cube REST API và lấy kết quả dữ liệu tổng hợp. | Backend Dev | 8h | T2.4 | Hàm `cube_client.execute_query(json_query)` trả về dữ liệu chuẩn xác dạng JSON/DataFrame. |
| **T2.6** | Viết End-to-End Integration Test kiểm tra luồng từ Prompt tới kết quả Cube. | AI Architect | 10h | T2.5 | Test case tự động chạy thành công với 10 câu hỏi mẫu BĐS. |
| **T2.7** | Chuẩn bị tài liệu kỹ thuật và báo cáo nộp Gate 2. | Leader | 8h | T2.1 - T2.6 | Báo cáo kiến trúc và video/log chạy baseline PoC được nộp đúng hạn. |

---

### SPRINT 3: CHART ADVISOR, NARRATIVE INSIGHT & SELF-CORRECTION (TUẦN 5 — TUẦN 6)
> **Mục tiêu Sprint (Sprint Goal):** Triển khai trí tuệ trực quan hóa (Heuristic Chart Advisor) tự động chọn biểu đồ; Xây dựng Agent tóm tắt insight và phát hiện điểm bất thường; Tích hợp vòng lặp tự sửa lỗi khi Cube báo lỗi truy vấn.

| Mã Task | Tên nhiệm vụ | Người phụ trách | Ước tính | Phụ thuộc | Tiêu chí hoàn thành (Acceptance Criteria) |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **T3.1** | Xây dựng Heuristic Engine Data-to-Viz (Quy tắc chọn Line, Bar, Donut, Scatter theo phân bố dữ liệu). | AI Architect | 16h | T2.5 | Thuật toán nhận diện đúng loại biểu đồ đạt điểm CSS lý thuyết $\ge 90/100$. |
| **T3.2** | Tích hợp Chart Advisor Node vào đồ thị LangGraph, sinh cấu trúc cấu hình Widget. | Backend Dev | 14h | T3.1 | Trả về mảng các widgets với loại chart, trục X, trục Y và màu sắc quy định. |
| **T3.3** | Xây dựng cơ chế Self-Correction Loop trong LangGraph khi Cube trả về lỗi schema. | Backend Dev | 16h | T2.5 | Nếu Cube lỗi, Agent tự đưa thông điệp lỗi vào prompt và thử lại, sửa đúng $\ge 90\%$ lỗi. |
| **T3.4** | Phát triển Narrative Insight Node: Trích xuất nhận xét kinh doanh từ dữ liệu kết quả. | AI Architect | 14h | T2.5 | Tự động sinh 2 - 3 câu nhận xét súc tích bằng tiếng Việt về phân khu dẫn đầu hoặc tỷ lệ tăng trưởng. |
| **T3.5** | Xây dựng module Hallucination Checker kiểm tra các con số trong Narrative Insight. | AI Architect | 10h | T3.4 | Regex bắt toàn bộ số liệu và đối soát với DataFrame, cảnh báo nếu sai lệch. |
| **T3.6** | Xây dựng cấu hình Pre-aggregations Rollup trên Cube.dev để tăng tốc độ phản hồi. | Data Eng | 12h | T2.1 | Truy vấn tổng hợp theo tháng/quý đạt thời gian phản hồi $\le 500\text{ms}$ từ cache. |

---

### SPRINT 4: FRONTEND CANVAS, ECHARTS & LUỒNG DUYỆT HITL (TUẦN 7 — TUẦN 8) — CỘT MỐC GATE 3
> **Mục tiêu Sprint (Sprint Goal):** Hoàn thiện giao diện Next.js 14 hiển thị các widget ECharts; Tích hợp luồng Human-in-the-Loop xem trước và duyệt xuất bản; Kết nối Server-Sent Events (SSE) hiển thị tiến trình suy nghĩ của Agent; Vượt qua Gate 3.

| Mã Task | Tên nhiệm vụ | Người phụ trách | Ước tính | Phụ thuộc | Tiêu chí hoàn thành (Acceptance Criteria) |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **T4.1** | Xây dựng API FastAPI SSE endpoint `/api/v1/chat/stream` đẩy tiến trình suy nghĩ của Agent. | Backend Dev | 14h | T3.2 | Frontend nhận được các event: `parsing_intent`, `building_query`, `advising_chart`. |
| **T4.2** | Phát triển ECharts React Wrapper Component hỗ trợ: KPI Card, Line, Bar, Donut Chart. | Frontend Dev | 16h | T1.7 | Biểu đồ render mượt mà, hỗ trợ responsive và tooltip tương tác chuẩn. |
| **T4.3** | Phát triển Dashboard Grid Canvas linh hoạt (hỗ trợ kéo thả / xếp lưới tự động). | Frontend Dev | 14h | T4.2 | Canvas hiển thị đầy đủ bố cục Dashboard từ Schema JSON do Agent sinh ra. |
| **T4.4** | Xây dựng Modal Human-in-the-Loop Review: Hiển thị bản nháp, nút xem giải trình metric. | Frontend Dev | 16h | T4.3 | Người dùng Builder có thể xem nguồn gốc số liệu, bấm đổi loại chart trực tiếp. |
| **T4.5** | Xây dựng API duyệt và lưu Dashboard vào CSDL PostgreSQL (`/api/v1/dashboards/approve`). | Backend Dev | 12h | T4.4 | Lưu dashboard vào bảng `dashboards`, ghi lịch sử vào `audit_event_logs`. |
| **T4.6** | Tích hợp hoàn chỉnh luồng End-to-End từ Frontend gõ chat $\rightarrow$ SSE $\rightarrow$ Xem nháp $\rightarrow$ Bấm Duyệt. | Toàn đội | 16h | T4.1 - T4.5 | Thực hiện thành công kịch bản nghiệp vụ trực tiếp trên trình duyệt. |
| **T4.7** | Soạn thảo tài liệu và nộp báo cáo cột mốc Gate 3 (Bản demo MVP chạy được). | Leader | 8h | T4.6 | Hoàn thành báo cáo Gate 3 theo biểu mẫu của BTC VinUni. |

---

### SPRINT 5: TƯƠNG TÁC LỌC CHÉO, CHAT COPILOT & BENCHMARK EVAL (TUẦN 9 — TUẦN 10)
> **Mục tiêu Sprint (Sprint Goal):** Triển khai tính năng lọc chéo dữ liệu thời gian thực (Cross-filtering); Hỗ trợ tinh chỉnh Dashboard qua Chat Copilot nhiều vòng; Xây dựng bộ dữ liệu Ground Truth 100 test cases và chạy pipeline đánh giá tự động (CSS, Query Accuracy, Latency).

| Mã Task | Tên nhiệm vụ | Người phụ trách | Ước tính | Phụ thuộc | Tiêu chí hoàn thành (Acceptance Criteria) |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **T5.1** | Xây dựng Zustand Global Filter Store quản lý trạng thái lọc chéo giữa các biểu đồ ECharts. | Frontend Dev | 14h | T4.2 | Khi click vào cột của Chart A, Chart B và C tự động gọi lại API để lọc theo dimension đó. |
| **T5.2** | Xây dựng Conversational Refiner Node cho phép người dùng gõ lệnh chỉnh sửa dashboard hiện tại. | Backend Dev | 16h | T2.3, T3.2 | Ví dụ: *"Đổi biểu đồ phân khu sang dạng cột ngang"* $\rightarrow$ cập nhật đúng 1 widget. |
| **T5.3** | Xây dựng bộ dữ liệu kiểm thử Ground Truth gồm 100 câu hỏi tiếng Việt chuyên ngành BĐS. | AI Architect | 16h | Không | File JSON gồm 100 prompt, nhãn Intent, Cube Query mẫu và loại Chart chuẩn mực. |
| **T5.4** | Lập trình Evaluation Benchmark Suite tự động chạy 100 câu hỏi và tính điểm CSS, VER. | AI Architect | 18h | T5.3, T2.5 | Script `eval/run_benchmark.py` xuất ra file báo cáo `eval/results/benchmark_report.json`. |
| **T5.5** | Tính năng xuất bản Dashboard ra định dạng PDF và hình ảnh PNG chất lượng cao. | Frontend Dev | 10h | T4.3 | Nút "Xuất PDF" tải về báo cáo định dạng A4 sắc nét đầy đủ biểu đồ và nhận xét. |
| **T5.6** | Thiết lập bảo mật phân quyền cấp dòng (RLS) Cube theo JWT Claims của người dùng. | Data Eng | 12h | T2.1 | Tài khoản Quản lý Vùng 1 không xem được dữ liệu của Vùng 2 trong mọi tình huống. |

---

### SPRINT 6: TỐI ƯU HÓA, CLOUD DEPLOY & HỒ SƠ DEMO DAY (TUẦN 11 — TUẦN 12) — DEMO DAY (GATE 4)
> **Mục tiêu Sprint (Sprint Goal):** Đóng gói Docker, triển khai hệ thống lên Google Cloud Run & Vercel; Tối ưu hóa hiệu năng và FinOps; Sản xuất Video Demo 3-5 phút và Slide Pitch Deck; Hoàn tất toàn bộ 10 Deliverables sẵn sàng cho Demo Day.

| Mã Task | Tên nhiệm vụ | Người phụ trách | Ước tính | Phụ thuộc | Tiêu chí hoàn thành (Acceptance Criteria) |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **T6.1** | Tối ưu Dockerfile multi-stage cho Backend FastAPI và Cube.dev Server. | Backend Dev | 8h | T1.5 | Dung lượng Docker image dưới 500MB, thời gian cold-start dưới 3 giây. |
| **T6.2** | Triển khai Backend và Cube.dev lên Google Cloud Run; Triển khai Frontend lên Vercel. | DevOps / Leader | 12h | T6.1 | Hệ thống hoạt động trực tiếp qua Live URL công khai, cấu hình HTTPS an toàn. |
| **T6.3** | Kiểm thử tải (Load Testing) và đo đạc chi phí quét BigQuery (FinOps Guardrails). | Data Eng | 10h | T6.2 | Xác nhận 80% truy vấn hit cache Redis, không có truy vấn nào quét quá 5GB. |
| **T6.4** | Quay và biên tập Video Demo sản phẩm (1080p, thời lượng 3 - 5 phút, thuyết minh rõ ràng). | Frontend / Leader| 16h | T6.2 | Video thể hiện trọn vẹn luồng Text-to-Dashboard, HITL Review và Cross-filtering. |
| **T6.5** | Thiết kế Slide Pitch Deck (10 - 12 slides chuyên nghiệp theo chuẩn đề tài khởi nghiệp/doanh nghiệp). | Leader | 14h | Không | File slide PDF tại `presentation/pitch_deck.pdf` trình bày mạch lạc bài toán & giải pháp. |
| **T6.6** | Kiểm tra toàn diện Checklist 10 Deliverables Demo Day của VinUni AI20K. | Toàn đội | 8h | Toàn bộ tasks| 10/10 mục trong `README.md` đều tích xanh và có đầy đủ bằng chứng. |
| **T6.7** | Tổng duyệt thuyết trình thử nghiệm (Dry-run rehearsal) trước Mentor và giảng viên. | Toàn đội | 6h | T6.5 | Trình bày trôi chảy trong vòng 5 phút, trả lời tốt các câu hỏi phản biện kỹ thuật. |

---

## 3. BẢNG PHÂN BỔ NỖ LỰC CỦA CÁC THÀNH VIÊN THEO SPRINT

| Thành viên / Vai trò | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | Sprint 5 | Sprint 6 | Tổng giờ làm |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Thành viên 1 (AI Architect & Leader)** | 14h | 30h | 40h | 24h | 34h | 36h | **178h** |
| **Thành viên 2 (Data & Semantic Eng)** | 44h | 24h | 12h | 8h | 12h | 18h | **118h** |
| **Thành viên 3 (Backend & AI Dev)** | 14h | 40h | 30h | 34h | 24h | 16h | **158h** |
| **Thành viên 4 (Frontend & UI/UX)** | 16h | 8h | 8h | 50h | 32h | 24h | **138h** |
| **Tổng cộng toàn đội mỗi Sprint** | **88h** | **102h** | **90h** | **116h** | **102h** | **94h** | **592h** |

---

## 4. QUY TRÌNH QUẢN LÝ TIẾN ĐỘ & BIỂU ĐỒ BURNDOWN

1. **Theo dõi qua GitHub Projects:**
   - Mỗi Task tương ứng với 1 GitHub Issue có gán nhãn `sprint-X`, `assignee`, và `estimate-hours`.
   - Các cột Kanban: `To Do` $\rightarrow$ `In Progress` $\rightarrow$ `In Review (PR)` $\rightarrow$ `Done`.
2. **Cập nhật Journal & Worklog định kỳ:**
   - Thứ 6 hàng tuần: Thành viên cập nhật bảng công việc cá nhân trong [`WORKLOG.md`](file:///Users/thai/Vinuni/BuildPhaseProject/cloneFromGitHub/P-117/WORKLOG.md).
   - Chủ nhật hàng tuần: Leader tổng hợp nhật ký dự án trong [`JOURNAL.md`](file:///Users/thai/Vinuni/BuildPhaseProject/cloneFromGitHub/P-117/JOURNAL.md) và đối chiếu tỷ lệ hoàn thành Sprint.
3. **Cơ chế Xử lý Chậm tiến độ (Delay Escalation Protocol):**
   - Nếu một Task có nguy cơ trễ quá 2 ngày so với kế hoạch Sprint, thành viên phải thông báo ngay trên nhóm trao đổi nội bộ.
   - Leader điều phối giảm bớt độ phức tạp (Scope De-scoping) hoặc phân công thành viên khác hỗ trợ cặp đôi (Pair Programming) để đảm bảo không ảnh hưởng đến Cột mốc Gate chung.
