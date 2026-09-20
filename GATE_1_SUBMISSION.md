# BÁO CÁO NỘP GATE 1 — VINUNI AI20K BUILD PHASE

* **Mã đội (Team Code):** `P-117`
* **Khoá học:** VinUni AI20K Build Phase — Cohort 4
* **Đường dẫn tài liệu / Repository:** [https://github.com/duypon2601/taiLieuDeTai1619](https://github.com/duypon2601/taiLieuDeTai1619)

---

## 1. MÃ ĐỀ TÀI & TÊN DỰ ÁN

* **Mã đề tài:** `DATA-16`
* **Tên dự án chính thức:** **AI Agent Tự Sinh Dashboard Từ Ngôn Ngữ Tự Nhiên**  
  *(English: Natural Language to Interactive Dashboard AI Agent)*
* **Đơn vị / Bài toán bối cảnh:** Khối Dữ Liệu Tập Trung (VSF) — Doanh nghiệp Bất Động Sản (Vinhomes / Vingroup).

---

## 2. DANH SÁCH THÀNH VIÊN & PHÂN CHIA VAI TRÒ

> *(Ghi chú: Team có thể điều chỉnh tên thành viên theo danh sách thực tế của đội `P-117`)*

| STT | Họ và Tên | Vai trò chính | Nhiệm vụ chi tiết phụ trách |
| :---: | :--- | :--- | :--- |
| **1** | [Họ và Tên] *(Leader)* | **Team Leader & AI Architect** | • Quản trị tiến độ chung của đội, nộp Gate và liên hệ Mentor.<br>• Thiết kế kiến trúc Multi-Agent LangGraph và quy trình Human-in-the-Loop (HITL). |
| **2** | [Họ và Tên] | **Data & Semantic Engineer** | • Thiết kế Cube.dev Semantic Layer (Metrics, Dimensions, Pre-aggregations Rollup).<br>• Kết nối và tối ưu truy vấn kho dữ liệu Google BigQuery, cấu hình RLS/RBAC. |
| **3** | [Họ và Tên] | **Backend & AI Developer** | • Phát triển FastAPI Middleware, kết nối LLM (GPT-4o/Claude/Gemini) và SSE streaming.<br>• Xây dựng bộ Prompt & logic cho Intent Agent, Cube Builder Agent. |
| **4** | [Họ và Tên] | **Frontend & Visualization (UX/BA)** | • Phát triển giao diện Next.js 14 (Chế độ Viewer & Builder).<br>• Tích hợp thư viện Apache ECharts, xây dựng thuật toán Chart Advisor (Data-to-Viz). |

---

## 3. MÔ TẢ BÀI TOÁN & MỤC TIÊU DỰ ÁN

### 3.1. Vấn đề thực tế (Problem Statement)
Tại các doanh nghiệp quy mô lớn như Vinhomes, việc ra quyết định kinh doanh (mở bán, điều phối giỏ hàng, chính sách cọc) cần dữ liệu tức thì. Tuy nhiên:
1. **Nút thắt cổ chai BI (Lead Time 3 - 5 ngày):** Lãnh đạo cần dashboard mới phải qua nhiều tầng yêu cầu, đội BI quá tải 70% thời gian cho các báo cáo kéo thả lặp lại.
2. **Cạm bẫy "Ảo giác số liệu" (Hallucination):** Các giải pháp Generative AI Text-to-SQL tự do sinh sai logic kế toán (cộng nhầm cọc đã hủy vào doanh số), không có phân quyền cấp dòng (RLS), gây rủi ro bảo mật nghiêm trọng.

### 3.2. Mục tiêu dự án (Objectives & Impact)
Xây dựng một hệ thống **AI Agent đàm thoại thông minh** cho phép người dùng chỉ cần mô tả bằng tiếng Việt để tự động nhận về Dashboard tương tác hoàn chỉnh:
* **Thời gian tạo:** Rút ngắn từ **3 - 5 ngày xuống < 60 giây**.
* **Độ chính xác dữ liệu 100% (Zero-Hallucination):** Bắt buộc LLM tương tác qua **Semantic Layer (Cube.dev)** thay vì tự viết SQL thô. Mọi công thức chỉ số đã được khóa cứng cố định.
* **Bảo mật doanh nghiệp:** Kế thừa tự động phân quyền Row-Level Security (RLS) theo chức vụ và vùng miền.

---

## 4. KẾ HOẠCH SƠ BỘ & CÁC TÍNH NĂNG CỐT LÕI (MVP ROADMAP)

### Giai đoạn 1: Nền tảng Dữ liệu & AI Core MVP (Tuần 1 - 4) — *Trọng tâm Gate 2*
* [x] Hoàn thiện tài liệu kiến trúc BRD, Technical Spec và thiết kế StateGraph LangGraph.
* [ ] Xây dựng Cube Data Schema mẫu trên **Cube.dev** kết nối dữ liệu giả lập BigQuery (Fact Sales, Dim Projects).
* [ ] Phát triển **Intent Agent** (hiểu câu hỏi, gỡ mơ hồ) & **Cube Builder Agent** (sinh Semantic Query JSON).
* [ ] Dựng khung giao diện web tối giản cho phép gõ prompt và hiển thị bảng dữ liệu trả về.

### Giai đoạn 2: Trực Quan Hóa Tự Động & Human-in-the-Loop (Tuần 5 - 8) — *Trọng tâm Gate 3*
* [ ] Phát triển **Chart Advisor Agent** theo nguyên tắc Data-to-Viz (tự động chọn Line, Bar, Donut, Scatter theo phân bố dữ liệu).
* [ ] Tích hợp **Apache ECharts** render dashboard nhiều widget tương tác thời gian thực qua Server-Sent Events (SSE).
* [ ] Triển khai cơ chế **Human-in-the-Loop (HITL)**: Người dùng xem bản nháp, chỉnh sửa visual và bấm "Duyệt & Lưu" trước khi xuất bản.
* [ ] Tích hợp **Narrative Insight Agent** tự động tóm tắt nhận xét kinh doanh từ số liệu.

### Giai đoạn 3: Tối Ưu Hóa, Governance & Demo Day (Tuần 9 - 12) — *Trọng tâm Gate 4*
* [ ] Tối ưu hóa FinOps qua cơ chế Pre-aggregations Rollup cache của Cube.dev (giảm > 80% chi phí BigQuery).
* [ ] Thiết lập hệ thống đo lường chất lượng tự động: **Chart Suitability Score (CSS > 90%)** và tỷ lệ query hợp lệ (> 95%).
* [ ] Chạy kiểm thử trên bộ **100 kịch bản test case thực tế** bám sát quy trình mở bán BĐS.
* [ ] Đóng gói Docker, triển khai Cloud Run & hoàn thiện slide / video demo phục vụ Hội đồng phản biện.
