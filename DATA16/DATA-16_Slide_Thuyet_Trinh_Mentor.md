---
marp: true
theme: default
paginate: true
header: "DATA-16: AI Agent Tự Sinh Dashboard | Báo Cáo Mentor"
footer: "Khối Dữ Liệu Tập Trung (VSF) - Vinhomes / Vingroup"
size: 16:9
style: |
  section {
    font-family: 'Segoe UI', Arial, sans-serif;
    padding: 40px 60px;
    font-size: 20px;
  }
  h1 { color: #1E3A8A; font-size: 36px; }
  h2 { color: #2563EB; font-size: 28px; }
  h3 { color: #1D4ED8; font-size: 22px; }
  strong { color: #0F172A; }
  .highlight { color: #D97706; font-weight: bold; }
  .badge { background: #EEF2FF; color: #3730A3; padding: 3px 8px; border-radius: 4px; font-weight: 600; }
  table { font-size: 17px; }
---

<!-- SLIDE 1 -->
# 📊 ĐỀ TÀI DATA-16
## AI Agent Tự Sinh Dashboard Từ Ngôn Ngữ Tự Nhiên
### (Natural Language to Interactive Dashboard AI Agent)

**Đơn vị:** Khối Dữ Liệu Tập Trung (VSF) - Vinhomes / Vingroup  
**Người báo cáo:** [Họ và tên của bạn]  
**Mentor hướng dẫn:** [Tên Mentor]  
**Mục tiêu buổi gặp:** Báo cáo định hướng giải pháp, kiến trúc kỹ thuật & xin ý kiến chỉ đạo.

---

<!-- SLIDE 2 -->
# 🔴 BỐI CẢNH & ĐIỂM NGHẼN THỰC TẾ (PAIN POINTS)

Tại các doanh nghiệp BĐS quy mô lớn như **Vinhomes**, tốc độ ra quyết định phụ thuộc vào dữ liệu (doanh số, tiến độ cọc, dòng tiền mở bán). Tuy nhiên, quy trình BI hiện tại gặp **nút thắt cổ chai**:

* ⏳ **Chu kỳ kéo dài:** Mất **3 - 5 ngày** từ khi sếp ra yêu cầu ad-hoc đến khi nhận được dashboard.
* 🏋️ **BI Team quá tải:** Tốn **70% thời gian** phục vụ yêu cầu kéo thả báo cáo lặp lại thay vì phân tích sâu.
* 🧩 **Rào cản kỹ thuật:** Người dùng nghiệp vụ/quản lý không thạo SQL, DAX hay cấu hình chart phức tạp.
* ⚠️ **Generative AI thông thường dễ thất bại:**
  * **Text-to-SQL tự do bị ảo giác (hallucination):** Tự sinh sai logic kế toán, cộng gộp hợp đồng đã hủy.
  * **Rò rỉ dữ liệu:** Thiếu cơ chế phân quyền cấp dòng (Row-Level Security) theo vùng miền.

---

<!-- SLIDE 3 -->
# 🎯 MỤC TIÊU DỰ ÁN & GIÁ TRỊ MANG LẠI

Xây dựng hệ thống **AI Agent đàm thoại thông minh**, cho phép người dùng chỉ cần mô tả bằng tiếng Việt để tự động nhận về Dashboard tương tác hoàn chỉnh.

| Tiêu chí | BI Truyền Thống | Giải pháp AI Agent (DATA-16) |
| :--- | :---: | :---: |
| **Thời gian tạo Dashboard** | 3 - 5 ngày làm việc | **< 60 giây** (giảm 99%) |
| **Độ chính xác dữ liệu** | Phụ thuộc review thủ công | **100%** (kiểm soát qua Semantic Layer) |
| **Trải nghiệm người dùng** | Kéo thả phức tạp trên BI tool | **Chat tiếng Việt tự nhiên + HITL** |
| **Bảo mật & Phân quyền** | Cấu hình thủ công từng report | **Kế thừa tự động RLS / RBAC** |
| **Khả năng tinh chỉnh** | Phải gửi ticket làm lại | **Hội thoại đa vòng (Multi-turn chat)** |

---

<!-- SLIDE 4 -->
# 💡 ĐIỂM ĐỘT PHÁ CỐT LÕI: TẠI SAO DÙNG SEMANTIC LAYER?

> ❌ **Sai lầm phổ biến:** Cho LLM sinh trực tiếp mã SQL thô từ schema database (Text-to-SQL tự do).  
> ⚠️ **Hậu quả:** Ảo giác tên cột, sai công thức KPI doanh nghiệp, tốn chi phí query BigQuery khổng lồ.

### ✅ Giải pháp DATA-16: Kiến trúc qua Lớp Ngữ Nghĩa (Cube.dev)

* **LLM không viết SQL:** Agent chỉ sinh ra **Semantic Query JSON** gồm các `measures`, `dimensions`, `filters` đã được chuẩn hóa trước.
* **Định nghĩa tập trung (Single Source of Truth):** Logic tính "Doanh số thực tế", "Tỷ lệ cọc" nằm cố định trong Cube Schema, LLM không thể bịa đặt.
* **Tối ưu FinOps & Tốc độ:** Tận dụng **Pre-aggregation (Rollup cache)** của Cube.dev, giảm 80% chi phí truy vấn BigQuery và giảm thời gian tải xuống dưới 1.5s.

---

<!-- SLIDE 5 -->
# 🏗️ TỔNG QUAN KIẾN TRÚC KỸ THUẬT (4 TẦNG)

1. **Tầng Trực Quan (Frontend - Next.js 14 & Apache ECharts):**
   - Hỗ trợ 2 chế độ: **Viewer** (Xem, filter, drill-down) và **Builder** (Prompt sinh dashboard, sửa layout).
   - Tương tác thời gian thực qua giao thức **Server-Sent Events (SSE)**.
2. **Tầng Điều Phối AI (Orchestration - LangGraph & FastAPI):**
   - Multi-agent stateful workflow, vòng lặp tự sửa lỗi (Self-Correction Cyclic Loops).
   - Điểm ngắt **Human-in-the-Loop (HITL)**: Người dùng xem nháp, phê duyệt trước khi lưu.
3. **Tầng Ngữ Nghĩa & Tối Ưu (Semantic Layer - Cube.dev):**
   - Trả lời REST API / SQL API, quản trị định nghĩa chỉ số và bảo mật Row-Level Security.
4. **Tầng Kho Dữ Liệu Doanh Nghiệp (Enterprise Warehouse):**
   - **Google BigQuery** lưu trữ Fact transactions, Dimension dự án BĐS (phân vùng Partition & Cluster).

---

<!-- SLIDE 6 -->
# 🤖 QUY TRÌNH MULTI-AGENT VỚI LANGGRAPH

Quy trình phối hợp nhịp nhàng giữa các Agent chuyên trách:

```
[User Prompt: "Cho anh xem doanh số Grand Park theo tháng này"]
                        │
                        ▼
       [1. Intent & Disambiguation Agent] ─── (Nếu mơ hồ) ──> Hỏi lại User
                        │ (Đã rõ ý định)
                        ▼
             [2. Cube Builder Agent]
      (Sinh Semantic Query JSON theo Cube Model)
                        │
                        ▼
      [3. Chart Advisor Agent (Data-to-Viz)]
     (Chọn Line/Bar/Scatter tối ưu theo phân bố)
                        │
                        ▼
          [4. Narrative Insight Agent]
          (Tóm tắt điểm sáng/tối kinh doanh)
                        │
                        ▼
      [5. Human-in-the-Loop (HITL Breakpoint)]
           (Builder duyệt & Lưu Dashboard)
```

---

<!-- SLIDE 7 -->
# 📐 KHUNG ĐÁNH GIÁ ĐỘ PHÙ HỢP BIỂU ĐỒ (CHART SUITABILITY)

Không chỉ sinh ra biểu đồ ngẫu nhiên, hệ thống tích hợp **Quy tắc Data-to-Viz chuẩn mực**:

* **Quy tắc gợi ý tự động (Heuristic Rules):**
  * Có chiều thời gian (`Date`, `Month`) ➔ **Line Chart / Area Chart**.
  * So sánh tỷ trọng ít hạng mục (<= 5) ➔ **Donut Chart**; nhiều hạng mục ➔ **Horizontal Bar Chart**.
  * So sánh 2 chỉ số phân bổ nhiều phân khu ➔ **Scatter Plot / Bubble Chart**.
* **Chỉ số đo lường CSS (Chart Suitability Score):**
  * Tự động chấm điểm từ 0 - 100 điểm dựa trên: Khả năng đọc hiểu, tỷ lệ trùng lặp nhãn, số lượng dữ liệu (tránh quá tải thị giác).
  * Mục tiêu đề tài: Đạt CSS trung bình **> 90%**.

---

<!-- SLIDE 8 -->
# 🛡️ BẢO MẬT & QUẢN TRỊ DỮ LIỆU (GOVERNANCE)

Hệ thống tuân thủ nghiêm ngặt tiêu chuẩn bảo mật dữ liệu doanh nghiệp tập đoàn:

* **Bảo mật cấp dòng (Row-Level Security - RLS):**
  * Giám đốc kinh doanh Vùng 1 chỉ truy vấn được số liệu phân khu Vùng 1.
  * Context token chứa `user_id`, `role`, `allowed_projects` được truyền tự động vào Cube.dev.
* **Ngăn chặn rủi ro Prompt Injection:**
  * LLM không có quyền tương tác trực tiếp với Database, chỉ giao tiếp với API Semantic có cấu trúc JSON Schema.
* **Audit Trail:**
  * Lưu trữ toàn bộ lịch sử Prompt, Query sinh ra, và danh tính người bấm phê duyệt để phục vụ kiểm toán nội bộ.

---

<!-- SLIDE 9 -->
# 📅 LỘ TRÌNH TRIỂN KHAI DỰ ÁN (12 TUẦN)

* **Tuần 1 - 2 (Chuẩn bị & Nền tảng):** Xây dựng Semantic Model trên Cube.dev, kết nối BigQuery, chuẩn hóa từ điển thuật ngữ BĐS.
* **Tuần 3 - 5 (Phát triển AI Core):** Xây dựng StateGraph LangGraph, bộ Prompt Intent Agent & Cube Builder Agent.
* **Tuần 6 - 7 (Visualization Engine):** Xây dựng Chart Advisor, tích hợp bộ visualizer Apache ECharts, cơ chế SSE Streaming.
* **Tuần 8 - 9 (Human-in-the-Loop & UX):** Hoàn thiện giao diện Next.js, cơ chế preview nháp, chỉnh sửa widget kéo thả và phê duyệt.
* **Tuần 10 - 11 (Thử nghiệm & Đánh giá):** Đánh giá Benchmark 100 câu hỏi nghiệp vụ thực tế, đo CSS & Query Accuracy.
* **Tuần 12 (Đóng gói & Chuyển giao):** Bàn giao tài liệu kỹ thuật, demo hội đồng và chuyển giao cho khối VSF.

---

<!-- SLIDE 10 -->
# 💬 CÁC NỘI DUNG XIN Ý KIẾN CHỈ ĐẠO CỦA MENTOR

Em xin phép được xin ý kiến tư vấn từ Mentor về các trọng tâm sau:

1. **Về Semantic Layer:** Việc áp dụng **Cube.dev** làm lớp đệm trung gian có cần lưu ý thêm về tải bộ nhớ đệm (Cache Warming) khi dữ liệu BigQuery cập nhật hàng ngày?
2. **Về cơ chế Human-in-the-Loop (HITL):** Mức độ can thiệp của người dùng ở khâu xem nháp đã đủ tinh gọn chưa, hay cần bổ sung thêm tính năng đề xuất câu hỏi gợi ý (Follow-up prompts)?
3. **Về tập dữ liệu nghiệm thu (Test Benchmark):** Định hướng xây dựng bộ 100 câu test case nghiệp vụ thực tế bám sát các kịch bản mở bán lớn của Vinhomes.

---

# 🙏 XIN TRÂN TRỌNG CẢM ƠN MENTOR!
### Q&A - Trao đổi và Thảo luận
