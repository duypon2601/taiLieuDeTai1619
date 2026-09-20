# BÁO CÁO NỘP GATE 1 — VINUNI AI20K BUILD PHASE

* **Mã đội (Team Code):** P-117
* **Khoá học:** VinUni AI20K Build Phase — Cohort 4
* **Đường dẫn Repository tài liệu:** https://github.com/duypon2601/taiLieuDeTai1619
* **Đường dẫn Repository mã nguồn (Org BTC):** https://github.com/AI20K-Build-Phase-Cohort-4/P-117

---

## MỤC LỤC TÀI LIỆU NỘP GATE 1

1. Project Brief (Bản tóm tắt dự án)
2. Product Requirements Document (PRD - Đặc tả yêu cầu sản phẩm)
3. Wireframe & UI Flow (Sơ đồ luồng trải nghiệm và thiết kế khung giao diện)
4. GitHub Repo & AI Log Setup (Hướng dẫn và xác nhận cấu hình theo dõi AI Log)

---

## PHẦN 1: PROJECT BRIEF (BẢN TÓM TẮT DỰ ÁN)

### 1.1. Thông tin định danh
* **Mã đề tài:** DATA-16
* **Tên dự án:** AI Agent Tự Sinh Dashboard Từ Ngôn Ngữ Tự Nhiên (Natural Language to Interactive Dashboard AI Agent)
* **Khối nghiệp vụ / Khách hàng thụ hưởng:** Khối Dữ Liệu Tập Trung (VSF) — Doanh nghiệp Bất Động Sản (Vinhomes / Vingroup).

### 1.2. Danh sách thành viên và phân công vai trò
| STT | Họ và Tên | Vai trò | Nhiệm vụ chính |
| :---: | :--- | :--- | :--- |
| 1 | [Họ và Tên Leader] *(Leader)* | Team Leader & AI Architect | Quản trị tiến độ, liên hệ Mentor/BTC, thiết kế StateGraph LangGraph và kiến trúc Human-in-the-Loop. |
| 2 | [Họ và Tên 2] | Data & Semantic Engineer | Xây dựng Semantic Layer Cube.dev, kết nối kho dữ liệu Google BigQuery, cấu hình RLS/RBAC. |
| 3 | [Họ và Tên 3] | Backend & AI Developer | Lập trình FastAPI, kết nối LLM, SSE streaming, xây dựng Prompt cho Intent Agent và Cube Builder Agent. |
| 4 | [Họ và Tên 4] | Frontend & UI/UX Designer | Phát triển Next.js 14, tích hợp Apache ECharts, xây dựng thuật toán Chart Advisor (Data-to-Viz). |

### 1.3. Bối cảnh và Nỗi đau thực tế (Problem Statement)
Tại các doanh nghiệp quy mô lớn như Vinhomes, việc ra quyết định kinh doanh (mở bán, điều phối giỏ hàng, chính sách cọc) cần dữ liệu tức thì:
* **Chu kỳ phản hồi chậm (Lead Time 3 - 5 ngày):** Khi lãnh đạo cần góc nhìn phân tích mới, quy trình qua BA, Data Engineer, BI Developer kéo dài nhiều ngày làm việc. Đội ngũ BI dành tới 70% thời gian cho các báo cáo kéo thả thủ công lặp đi lặp lại.
* **Cạm bẫy ảo giác số liệu của Text-to-SQL tự do:** Nếu cho LLM tự sinh mã SQL thô trực tiếp vào cơ sở dữ liệu, mô hình rất dễ sinh sai logic nghiệp vụ (ví dụ: cộng gộp cả hợp đồng đã hủy cọc vào doanh số).
* **Rủi ro rò rỉ dữ liệu:** Thiếu cơ chế phân quyền cấp dòng (Row-Level Security) khiến quản lý vùng này có thể xem trộm số liệu vùng khác.

### 1.4. Giải pháp đề xuất (Proposed Solution)
Xây dựng trợ lý AI Agent đàm thoại thông minh chuyển đổi câu lệnh tiếng Việt thành Dashboard tương tác hoàn chỉnh:
* **Thời gian xử lý:** Rút ngắn từ 3 - 5 ngày xuống dưới 60 giây.
* **Độ chính xác 100% (Zero-Hallucination):** Ứng dụng Semantic Layer (Cube.dev) làm lớp ngữ nghĩa trung gian. LLM không viết mã SQL trực tiếp mà chỉ chọn các chỉ số (Measures) và chiều phân tích (Dimensions) đã được chuẩn hóa và khóa cứng công thức.
* **Quy trình Multi-Agent có con người kiểm soát (Human-in-the-Loop):** Phân chia tác vụ cho các Agent chuyên trách (Intent, Cube Builder, Chart Advisor, Narrative Insight) kết hợp bước xem nháp và duyệt trước khi xuất bản.

### 1.5. Công nghệ chủ chốt (Core Tech Stack)
* **AI & Orchestration:** LangGraph (StateGraph, Self-Correction Loops, Breakpoints), OpenAI GPT-4o / Claude 3.5 Sonnet / Gemini Pro.
* **Semantic Layer:** Cube.dev (Semantic Data Models, Pre-aggregations Rollup, SQL/REST API).
* **Enterprise Warehouse:** Google BigQuery (Fact Sales, Dim Projects, Partitioning, Clustering).
* **Backend:** Python 3.11+, FastAPI, Pydantic v2, Server-Sent Events (SSE).
* **Frontend:** Next.js 14 (App Router, TypeScript), Tailwind CSS, Apache ECharts, Zustand.

---

## PHẦN 2: PRODUCT REQUIREMENTS DOCUMENT (PRD)

### 2.1. Đối tượng người dùng (User Personas)

#### Persona 1: Lãnh đạo cấp cao & Quản lý vùng (Viewer Persona)
* **Đặc điểm:** Bận rộn, không có chuyên môn về SQL, DAX hay kỹ thuật dữ liệu.
* **Mục tiêu:** Cần nắm bắt số liệu kinh doanh ngay lập tức thông qua câu hỏi tự nhiên để kịp thời ra quyết định trong các chiến dịch mở bán.
* **Nhu cầu chính:** Gõ câu hỏi tiếng Việt, nhận về dashboard trực quan, tương tác lọc dữ liệu chéo (cross-filter), xem phần tóm tắt nhận xét kinh doanh ngắn gọn.

#### Persona 2: Chuyên viên phân tích nghiệp vụ & BI Developer (Builder Persona)
* **Đặc điểm:** Am hiểu logic kinh doanh, chịu trách nhiệm về tính chuẩn xác của báo cáo.
* **Mục tiêu:** Giảm bớt khối lượng việc kéo thả báo cáo thủ công để tập trung vào phân tích chuyên sâu.
* **Nhu cầu chính:** Nhập yêu cầu phức tạp, xem trước dashboard nháp, kiểm tra giải trình công thức tính toán, tùy biến loại biểu đồ và bấm phê duyệt xuất bản.

### 2.2. Danh sách User Stories trọng tâm

| ID | User Story | Tiêu chí chấp nhận (Acceptance Criteria) |
| :--- | :--- | :--- |
| **US-01** | Là **Viewer**, tôi muốn gõ câu hỏi bằng tiếng Việt để hệ thống tự sinh Dashboard hoàn chỉnh trong vòng 60 giây. | Trả về đủ các KPI Card, biểu đồ xu hướng và bảng chi tiết phù hợp với câu hỏi. |
| **US-02** | Là **Viewer**, tôi muốn nhấp vào một phân khu trên biểu đồ để toàn bộ các biểu đồ khác tự động lọc theo (Cross-filtering). | Độ trễ lọc chéo dưới 1 giây, trạng thái lọc được hiển thị rõ ràng trên thanh filter. |
| **US-03** | Là **Builder**, tôi muốn hệ thống giải thích rõ công thức và nguồn dữ liệu của từng biểu đồ. | Mỗi widget có nút "Xem giải trình", hiển thị tên Cube Measure, bảng nguồn và điều kiện lọc đã áp dụng. |
| **US-04** | Là **Builder**, tôi muốn có thể đổi loại biểu đồ (ví dụ: từ Cột sang Đường) ngay trên giao diện nháp. | Thao tác đổi chart diễn ra tức thì, dữ liệu được giữ nguyên vẹn mà không cần truy vấn lại từ đầu. |
| **US-05** | Là **Builder**, tôi muốn bấm nút "Duyệt & Lưu" thì dashboard mới được công khai cho toàn bộ đơn vị. | Có bước xác nhận, lưu lịch sử phiên bản và định danh người duyệt vào hệ thống kiểm toán (Audit Log). |

### 2.3. Yêu cầu chức năng (Functional Requirements - FR)

* **FR-01: Phân tích ý định và xử lý mơ hồ (Intent & Disambiguation):** Tiếp nhận câu hỏi tiếng Việt, nhận diện đúng thực thể (dự án, phân khu, mốc thời gian, loại giao dịch). Nếu câu hỏi thiếu dữ kiện (ví dụ: "cho xem doanh số"), Agent chủ động phản hồi hỏi lại để làm rõ phạm vi.
* **FR-02: Sinh Semantic Query JSON:** Ánh xạ ngữ nghĩa người dùng sang cấu trúc JSON hợp lệ của Cube.dev (measures, dimensions, filters, timeDimensions). Tuyệt đối không sinh mã SQL thô.
* **FR-03: Tư vấn biểu đồ thông minh (Chart Advisor):** Áp dụng bộ quy tắc Heuristic Data-to-Viz dựa trên cấu trúc phân bố dữ liệu:
  * Chiều thời gian liên tục -> Ưu tiên Line / Area Chart.
  * So sánh tỷ trọng dưới 5 hạng mục -> Ưu tiên Donut Chart.
  * So sánh nhiều hạng mục (> 7 phân khu) -> Tự chuyển sang Horizontal Bar Chart.
  * Tương quan 2 biến định lượng -> Ưu tiên Scatter Plot.
* **FR-04: Tự động trích xuất nhận xét kinh doanh (Narrative Insight):** Phân tích kết quả số liệu trả về để sinh ra 2 - 3 câu tóm tắt điểm sáng/tối (ví dụ: phân khu có tốc độ cọc cao nhất, đại lý vượt chỉ tiêu).
* **FR-05: Cơ chế duyệt có sự tham gia của con người (Human-in-the-Loop):** Cung cấp giao diện xem trước cho phép Builder kiểm tra, chỉnh sửa bố cục trước khi ghi nhận trạng thái xuất bản (Published).

### 2.4. Yêu cầu phi chức năng (Non-Functional Requirements - NFR)

* **NFR-01 (Độ trễ):** Thời gian từ khi gửi prompt đến khi hiển thị dashboard nháp không vượt quá 60 giây. Các thao tác tương tác lọc chéo trên dashboard đã tải đạt dưới 1.5 giây.
* **NFR-02 (Độ chính xác dữ liệu):** Đạt 100% tính đúng đắn của phép tính số học và định nghĩa chỉ số nhờ cơ chế khóa công thức trong Semantic Layer.
* **NFR-03 (Bảo mật phân quyền):** Kế thừa phân quyền cấp dòng (Row-Level Security) theo ngữ cảnh người dùng (user role, region). Người dùng không thể truy vấn dữ liệu ngoài thẩm quyền dù cố tình prompt thao túng.
* **NFR-04 (Tối ưu chi phí FinOps):** Giảm trên 80% dung lượng dữ liệu quét trên Google BigQuery bằng cơ chế Pre-aggregations Rollup cache của Cube.dev.

### 2.5. Ma trận ưu tiên MoSCoW (MVP Scope)

| Nhóm ưu tiên | Tính năng | Ghi chú lộ trình |
| :--- | :--- | :--- |
| **Must Have** (Bắt buộc cho MVP) | • Chat tiếng Việt sinh dashboard cơ bản.<br>• Semantic Layer Cube.dev kết nối BigQuery.<br>• Bố cục hiển thị KPI Cards + Line/Bar Chart.<br>• Cơ chế HITL xem nháp và duyệt lưu.<br>• Phân quyền RLS cơ bản theo vùng. | Hoàn thành tại Gate 2 & Gate 3 |
| **Should Have** (Nên có) | • Thuật toán chấm điểm Chart Suitability Score (CSS).<br>• Narrative Insight tóm tắt tự động.<br>• Bộ lọc chéo thời gian thực (Cross-filtering).<br>• Xuất bản báo cáo ra file PDF/PNG. | Hoàn thành tại Gate 3 |
| **Could Have** (Có thể phát triển thêm) | • Gợi ý câu hỏi tiếp theo (Follow-up suggestions).<br>• Nhúng dashboard vào Microsoft Teams / Telegram.<br>• Tự động cảnh báo dị thường (Anomaly Alerting). | Xem xét sau Gate 4 |
| **Won't Have** (Không làm trong phạm vi này) | • Tự động sửa chữa dữ liệu gốc trong kho BigQuery.<br>• Dự báo chuỗi thời gian bằng mô hình Deep Learning phức tạp. | Nằm ngoài phạm vi đề tài |

---

## PHẦN 3: WIREFRAME & UI FLOW

### 3.1. Sơ đồ luồng giao diện tổng thể (UI Flow Diagram)

```
[Người dùng đăng nhập]
         │
         ▼
[Màn hình Trang chủ / Danh sách Dashboard]
         │
         ├───> [Chế độ VIEWER: Xem & Lọc Dashboard có sẵn]
         │          │
         │          └───> Chọn bộ lọc / Click chart lọc chéo (Cross-filtering)
         │
         └───> [Chế độ BUILDER: Tạo Dashboard mới]
                    │
                    ▼
          [Khung nhập Prompt tiếng Việt]
                    │
                    ▼
          [Hiển thị Streaming tiến độ xử lý của AI]
                    │
                    ▼
          [Màn hình BUILDER PREVIEW: Xem nháp]
                    │
                    ├───> Tinh chỉnh loại biểu đồ / Đổi vị trí widget
                    ├───> Bấm xem giải trình công thức & nguồn dữ liệu
                    │
                    ▼
          [Nút: DUYỆT VÀ XUẤT BẢN (HITL)]
                    │
                    ▼
          [Dashboard chính thức lên sóng hệ thống]
```

### 3.2. Thiết kế Wireframe chi tiết (Text Wireframes)

#### Màn hình 1: Giao diện Khởi tạo & Nhập Prompt (Conversational Input Canvas)
```
+-------------------------------------------------------------------------------+
| LOGO VSF       DATA-16: DASHBOARD GENERATOR AGENT         [User: Admin (Vung 1)]|
+-------------------------------------------------------------------------------+
|                                                                               |
|   CHÀO MỪNG BẠN ĐẾN VỚI HỆ THỐNG TỰ SINH DASHBOARD TỰ PHỤC VỤ (SELF-SERVICE)   |
|   Hãy nhập câu hỏi nghiệp vụ hoặc chọn các gợi ý bên dưới:                    |
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   | > So sánh doanh số thực tế và tiến độ cọc các phân khu Ocean Park Q3 |   |
|   +-----------------------------------------------------------------------+   |
|                                                      [ NÚT: TẠO DASHBOARD ]   |
|                                                                               |
|   Gợi ý câu hỏi nhanh:                                                       |
|   [+ Tỷ lệ hấp thụ giỏ hàng cao tầng]   [+ Tình hình dòng tiền theo tuần]     |
|   [+ Hiệu suất bán hàng các sàn đại lý] [+ Top 5 phân khu doanh số cao nhất]   |
|                                                                               |
+-------------------------------------------------------------------------------+
```

#### Màn hình 2: Giao diện Chỉnh sửa nháp & Duyệt (Builder Studio & HITL Review)
```
+-------------------------------------------------------------------------------+
| < Quay lại | ĐANG XEM NHÁP: Phân tích Doanh số & Cọc Ocean Park Q3 | [Chế độ Builder]|
+-------------------------------------------------------------------------------+
| THANH TRẠNG THÁI AI:                                                          |
| [OK] Intent Da Ro | [OK] Cube Query Hop Le | [OK] Data-to-Viz: CSS 94/100     |
+-------------------------------------------------------------------------------+
| [WIDGET 1: KPI CARDS]                      [WIDGET 2: CƠ CẤU THEO NGUỒN KHÁCH] |
| Tong Doanh So: 1,420 Ty VND                Loai: Donut Chart [Nut Doi Chart v] |
| Tong So Coc:   850 can                     +---------------------------------+ |
| Ty Le Vao HD:  78.4%                       |       (Donut Chart ECharts)     | |
| [Xem giai trinh metric]                    +---------------------------------+ |
+--------------------------------------------+----------------------------------+
| [WIDGET 3: XU HƯỚNG DOANH SỐ THEO TUẦN]    [WIDGET 4: DOANH SỐ THEO PHÂN KHU] |
| Loai: Line/Area Chart [Nut Doi Chart v]    Loai: Horizontal Bar Chart         |
| +----------------------------------------+ +--------------------------------+ |
| |        (Line Chart ECharts)            | |      (Bar Chart ECharts)       | |
| +----------------------------------------+ +--------------------------------+ |
+-------------------------------------------------------------------------------+
| TÓM TẮT INSIGHT KINH DOANH:                                                   |
| "Doanh số tăng trưởng mạnh nhất vào tuần thứ 3 sau đợt mở bán phân khu Sapphire.|
| Nguồn khách từ đại lý F1 chiếm 62% tổng lượng cọc toàn dự án."                |
+-------------------------------------------------------------------------------+
|                                [ NÚT: CHỈNH SỬA THÊM ]  [ NÚT: DUYỆT & XUẤT BẢN ]|
+-------------------------------------------------------------------------------+
```

#### Màn hình 3: Giao diện Báo cáo hoàn chỉnh (Viewer Executive Dashboard)
```
+-------------------------------------------------------------------------------+
| VSF BI | BÁO CÁO KINH DOANH OCEAN PARK Q3 (Chính thức)   [Xuat PDF] [Chia se] |
+-------------------------------------------------------------------------------+
| BỘ LỌC TOÀN CỤC: [Dự án: Ocean Park v] [Thời gian: Quý 3 v] [Vùng: Miền Bắc v]|
+-------------------------------------------------------------------------------+
| +-----------------+  +-----------------+  +-----------------+  +------------+ |
| | TỔNG DOANH SỐ   |  | LƯỢNG GIAO DỊCH |  | TỶ LỆ HẤP THỤ   |  | GIỎ HÀNG   | |
| | 1,420 Tỷ VNĐ    |  | 850 Hợp đồng    |  | 78.4%           |  | 1,100 Căn  | |
| +-----------------+  +-----------------+  +-----------------+  +------------+ |
+-------------------------------------------------------------------------------+
| Biểu đồ xu hướng và phân bổ có tính năng tương tác lọc chéo (Cross-filtering) |
| [Click vào cột 'Sapphire 1' -> Toàn bộ dashboard đồng bộ hiển thị riêng phân khu] |
+-------------------------------------------------------------------------------+
```

---

## PHẦN 4: GITHUB REPO & AI LOG SETUP

### 4.1. Thông tin cấu hình Kho mã nguồn
* **Repository chính thức của đội (Org BTC):**  
  `https://github.com/AI20K-Build-Phase-Cohort-4/P-117`
* **Repository tài liệu và slide thuyết trình:**  
  `https://github.com/duypon2601/taiLieuDeTai1619`
* **Nhánh phát triển chính:** `main` và `develop`.

### 4.2. Trạng thái và Hướng dẫn thiết lập AI Log Tracking
Theo yêu cầu bắt buộc của Ban tổ chức VinUni AI20K, toàn bộ quá trình tương tác và sử dụng các công cụ AI hỗ trợ lập trình (Antigravity, Cursor, Claude Code, Copilot, Codex) phải được ghi log và gửi về máy chủ chấm điểm tự động.

#### Bước 1: Khởi tạo biến môi trường AI_LOG_API_KEY
Mỗi thành viên trong đội lấy khóa API cá nhân tại trang quản trị Phoenix Dashboard:
`https://phoenix.note.transformerlabs.ai/api-keys`

Cấu hình trong file `.env` tại thư mục gốc của dự án `P-117`:
```bash
OPENAI_API_KEY=sk-...
AI_LOG_API_KEY=ak_live_your_actual_key_here
```

#### Bước 2: Kích hoạt hook ghi nhận AI Log tự động
Chạy lệnh kích hoạt hook một lần duy nhất sau khi clone repo:
* Trên hệ điều hành macOS / Linux:
  ```bash
  bash scripts/setup_hooks.sh
  ```
* Trên hệ điều hành Windows (PowerShell):
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts\setup_hooks.ps1
  ```

#### Bước 3: Xác nhận cơ chế hoạt động (Verification)
1. Thư mục `.ai-log/` được kích hoạt sẵn để lưu tạm thời các tương tác prompt của lập trình viên.
2. Hook `pre-push` được cài đặt tự động vào `.git/hooks/pre-push`. Mỗi khi thành viên thực hiện lệnh `git push`, script `scripts/submit_log.py` sẽ tự động đóng gói và đẩy các bản ghi log lên máy chủ chấm điểm của VinUni.
3. Kết quả ghi nhận có thể kiểm tra trực tiếp trên trang cá nhân của thành viên tại hệ thống Phoenix.
