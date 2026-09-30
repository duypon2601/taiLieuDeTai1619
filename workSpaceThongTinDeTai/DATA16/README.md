# DỰ ÁN DATA-16: AI AGENT TỰ SINH DASHBOARD TỪ YÊU CẦU NGÔN NGỮ TỰ NHIÊN
## KHỐI DỮ LIỆU TẬP TRUNG (VSF) - VINHOMES / VINGROUP

---

## 📌 TỔNG QUAN HỆ THỐNG TÀI LIỆU DỰ ÁN

Bộ tài liệu kỹ thuật chuyên sâu này được xây dựng chuẩn mực theo yêu cầu của đề tài **DATA-16**: *"AI Agent tự sinh Dashboard từ yêu cầu ngôn ngữ tự nhiên"*, phục vụ báo cáo hội đồng, thiết kế kiến trúc và triển khai thực tế.

Bộ tài liệu được phân tách khoa học thành 4 tài liệu chuyên đề chi tiết:

| STT | Mã Tài Liệu | Tên Tài Liệu | Nội Dung Trọng Tâm |
| :---: | :--- | :--- | :--- |
| **01** | [DATA-16_01](file:///Users/thai/Vinuni/BuildPhaseProject/DATA-16_01_Business_Requirements_Document_BRD.md) | **Business Requirements Document (BRD)** | Thực trạng doanh nghiệp BĐS, Nỗi đau BI bottleneck, Phân tích 2 vai trò `Viewer` & `Builder`, Mục tiêu định lượng/định tính, Ma trận MoSCoW. |
| **02** | [DATA-16_02](file:///Users/thai/Vinuni/BuildPhaseProject/DATA-16_02_System_Architecture_Technical_Spec.md) | **System Architecture & Technical Spec** | Kiến trúc 4 tầng, Lý do dùng Semantic Layer Cube.dev thay vì Text-to-SQL tự do, Mô hình Cube Data Model, Vector DB, Bảo mật RLS/RBAC, Đặc tả API REST & SSE. |
| **03** | [DATA-16_03](file:///Users/thai/Vinuni/BuildPhaseProject/DATA-16_03_LangGraph_Agent_Workflow_Prompt_Design.md) | **LangGraph Agent Workflow & Prompt Design** | Thiết kế LangGraph StateGraph, Cơ chế Human-in-the-Loop (HITL), Multi-Agent: Intent Agent, Cube Builder, Chart Advisor (Heuristic Data-to-Viz), Narrative Insight Agent, Mã nguồn Python. |
| **04** | [DATA-16_04](file:///Users/thai/Vinuni/BuildPhaseProject/DATA-16_04_Evaluation_Governance_Deployment_Roadmap.md) | **Evaluation, Governance & Deployment Roadmap** | Khung đánh giá tự động: Chart Suitability Score (CSS), Query Accuracy, Chống ảo giác số liệu, Tối ưu chi phí FinOps (BigQuery), Kiến trúc Cloud Run + Vercel, Lộ trình 12 tuần. |

---

## 🏗️ TÓM TẮT CÔNG NGHỆ CHỦ CHỐT (CORE TECH STACK)

- **AI & Agent Orchestration:** LLM (GPT-4o / Claude 3.5 Sonnet / Gemini Pro), LangGraph (StateGraph, Self-Correction Cyclic Loops, HITL Breakpoints).
- **Semantic Layer (Lớp ngữ nghĩa trung gian):** Cube.dev (Cube Data Schema, Pre-aggregations Rollup, SQL API & REST API).
- **Kho Dữ liệu Doanh nghiệp (Enterprise Warehouse):** Google BigQuery / Snowflake (Fact transactions, Dim projects, Partitioning theo ngày, Clustering).
- **Vector Database:** Qdrant / Pinecone / pgvector (Lưu trữ Metadata, Cube measures/dimensions, Từ điển đồng nghĩa thuật ngữ BĐS).
- **Backend & Middleware:** FastAPI (Python 3.11+, Pydantic v2, AsyncIO, SSE Streaming).
- **Frontend & Visualization:** Next.js 14 (App Router, TypeScript), Apache ECharts, Recharts, Tailwind CSS, Shadcn/UI, Zustand (Cross-filtering state).
- **Hạ tầng & Triển khai:** Google Cloud Run (Backend & Cube.dev), Vercel (Frontend Next.js), Cloud Memorystore (Redis Cache), Cloud Scheduler (Scheduled Refresh).

---

## 🚀 TÍNH NĂNG VƯỢT TRỘI SO VỚI BI TRUYỀN THỐNG

1. **Rút ngắn chu kỳ:** Từ 3-5 ngày làm việc của BI team xuống còn **< 60 giây**.
2. **Không ảo giác số liệu (Zero-Hallucination):** 100% chỉ số được tính toán qua Semantic Layer Cube.dev với các công thức được định nghĩa chặt chẽ trước, không để LLM tự sinh SQL thô.
3. **Multi-Agent Chart Advisor:** Tự động tư vấn loại biểu đồ tối ưu nhất theo cấu trúc phân bố dữ liệu (Data-to-Viz principles), tự động chấm điểm độ phù hợp biểu đồ (CSS).
4. **An toàn & Kiểm soát có sự tham gia của con người (HITL):** Mọi dashboard nháp đều phải được người dùng Builder xem trước, giải trình số liệu và bấm "Duyệt & Lưu" trước khi xuất bản.
5. **Bảo mật tuyệt đối (Data Governance):** Tự động kế thừa phân quyền cấp dòng (Row-Level Security - RLS), ngăn chặn rò rỉ dữ liệu giữa các vùng miền và chi nhánh.
