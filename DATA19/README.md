# DỰ ÁN DATA-19: AI AGENT TRỢ LÝ DATA GOVERNANCE & TRA CỨU CHÍNH SÁCH DỮ LIỆU
## KHỐI DỮ LIỆU TẬP TRUNG (VSF) - TẬP ĐOÀN VINGROUP

---

## 📌 TỔNG QUAN HỆ THỐNG TÀI LIỆU DỰ ÁN

Bộ tài liệu kỹ thuật chuyên sâu này được xây dựng chuẩn mực theo yêu cầu của đề tài **DATA-19**: *"AI Agent trợ lý Data Governance & tra cứu chính sách dữ liệu"*, phục vụ báo cáo hội đồng thẩm định, thiết kế kiến trúc và triển khai thực tế tại **Khối Dữ liệu tập trung (VSF)**.

Bộ tài liệu được phân tách khoa học thành 4 tài liệu chuyên đề chi tiết:

| STT | Mã Tài Liệu | Tên Tài Liệu | Nội Dung Trọng Tâm |
| :---: | :--- | :--- | :--- |
| **01** | [DATA-19_01](file:///Users/thai/Vinuni/BuildPhaseProject/DATA19/DATA-19_01_Business_Requirements_Document_BRD.md) | **Business Requirements Document (BRD)** | Thực trạng chính sách quản trị dữ liệu phân mảnh tại VSF, Nỗi đau vi phạm retention & thiếu nhãn phân loại, Phân tích 2 vai trò `Governance Lead` & `Employee`, Mục tiêu định lượng/định tính, Ma trận MoSCoW. |
| **02** | [DATA-19_02](file:///Users/thai/Vinuni/BuildPhaseProject/DATA19/DATA-19_02_System_Architecture_Technical_Spec.md) | **System Architecture & Technical Spec** | Kiến trúc 5 tầng, Chi tiết Data Flow, Pipeline LlamaIndex + Vector DB Qdrant (Hierarchical Chunking, Dense + Sparse BM25 Hybrid Retrieval, Reranking), Warehouse Metadata Catalog Schema, Database PostgreSQL, Đặc tả API RESTful & SSE Streaming. |
| **03** | [DATA-19_03](file:///Users/thai/Vinuni/BuildPhaseProject/DATA19/DATA-19_03_LangGraph_Agent_Workflow_Prompt_Design.md) | **LangGraph Agent Workflow & Prompt Design** | Thiết kế LangGraph StateGraph (4 bước cốt lõi: Retrieve Policy ➔ Map to Dataset ➔ Check Compliance ➔ Guide & Remediation), Cơ chế Human-in-the-Loop (HITL) phê duyệt gán nhãn, Multi-Agent kiểm tra theo lịch, Bộ Prompt chống ảo giác và Mã nguồn Python chi tiết. |
| **04** | [DATA-19_04](file:///Users/thai/Vinuni/BuildPhaseProject/DATA19/DATA-19_04_Evaluation_Governance_Deployment_Roadmap.md) | **Evaluation, Governance & Deployment Roadmap** | Khung đánh giá tự động (Ragas / TruLens): Faithfulness, Citation Precision & Recall, Policy Mapping Accuracy, Phát hiện vi phạm lưu trữ, Guardrails an ninh, Tối ưu FinOps & Semantic Cache, Triển khai Google Cloud Run, Lộ trình 12 tuần. |

---

## 🏗️ TÓM TẮT CÔNG NGHỆ CHỦ CHỐT (CORE TECH STACK)

- **AI & Agent Orchestration:** LLM (GPT-4o / Claude 3.5 Sonnet / Gemini Pro), LangGraph (StateGraph, Conditional Branching, Memory Checkpoint, HITL `interrupt_before`).
- **Policy Knowledge Base & RAG:** LlamaIndex (Hierarchical Markdown/Node Parser), Vector DB Qdrant (Dense Vectors + Sparse BM25 Index, HNSW Indexing), Cohere / BGE Reranker.
- **Enterprise Warehouse & Metadata Integration:** Google BigQuery / PostgreSQL Information Schema, Data Catalog Policy Tags.
- **Backend & Middleware:** FastAPI (Python 3.11+, Pydantic v2, AsyncIO, SSE Streaming Tokens).
- **Frontend & Visualization:** Next.js 14 (App Router, TypeScript), Tailwind CSS, Shadcn/UI, Lucide Icons, React Flow.
- **Hạ tầng & Triển khai:** Google Cloud Run (Frontend & Backend Containers), Google Cloud Scheduler (Scheduled Batch Compliance Audit), Cloud SQL PostgreSQL, Redis Cache.

---

## 🚀 TÍNH NĂNG VƯỢT TRỘI THEO PHẠM VI YÊU CẦU

### 1. Mức Cơ Bản (Core Features)
1. **Web Deployment hoàn chỉnh & Phân quyền 2 vai trò:**
   - Vai trò `Employee` (Data Owner / Engineer): Tra cứu chính sách, gửi yêu cầu gắn nhãn dataset, xem hướng dẫn khắc phục.
   - Vai trò `Governance Lead`: Hàng chờ phê duyệt HITL, giám sát tuân thủ toàn tập đoàn, quản lý tài liệu chính sách.
2. **Hỏi chính sách bằng Ngôn ngữ tự nhiên trả lời có trích nguồn chính xác:**
   - Trích dẫn chính xác 100% số hiệu văn bản, điều, khoản, trang và đoạn văn bản gốc (Zero Hallucination).
3. **Ánh xạ chính sách cho Dataset dựa trên Metadata:**
   - Tự động phân tích tên bảng, schema, danh sách cột và nhận diện trường PII để đề xuất nhãn bảo mật (`Public`, `Internal`, `Confidential`, `Restricted`) và thời hạn lưu trữ trần.
4. **Kiểm tra mức độ tuân thủ & Cảnh báo vi phạm:**
   - Phát hiện các bảng dữ liệu chưa gắn nhãn hoặc đã quá hạn lưu trữ (Data Retention Exceeded).
5. **Cơ chế HITL (Human-in-the-Loop) Duyệt Gán nhãn:**
   - Dừng luồng an toàn tại breakpoint để Governance Lead phê duyệt hoặc chỉnh sửa trước khi cập nhật chính thức vào Data Catalog.

### 2. Mức Nâng Cao (Advanced Features)
1. **Multi-Agent Kiểm tra Tuân thủ Tự động theo Lịch (Scheduled Compliance Audit Multi-Agent):**
   - Tự động quét toàn bộ kho Data Warehouse hàng đêm thông qua Cloud Scheduler mà không cần con người kích hoạt thủ công.
2. **Khung Đánh giá Tự động Chuyên sâu (Automated Evaluation Suite):**
   - Đo lường định lượng: Độ trung thực (Faithfulness > 98%), Độ chính xác trích dẫn (Citation Precision > 95%), Độ chính xác ánh xạ chính sách (F1-Score > 0.94).
3. **Phát hiện Dataset Quá hạn Lưu trữ & Khuyến nghị Lưu trữ Lạnh:**
   - Cảnh báo các dataset vi phạm thời hạn retention và tự động sinh câu lệnh di chuyển sang Google Cloud Storage Coldline trước khi hủy dữ liệu.
4. **Tự động sinh Báo cáo Tuân thủ Định kỳ:**
   - Tự động tổng hợp và xuất bản Báo cáo Kiểm toán Quản trị Dữ liệu (Periodic Compliance Audit Report) dạng Markdown / PDF định kỳ hàng tuần.

---

## 📂 CẤU TRÚC THƯ MỤC DỰ ÁN DATA-19

```text
/Users/thai/Vinuni/BuildPhaseProject/DATA19/
│
├── README.md                                          # Tài liệu tổng quan dự án & điều hướng
├── DATA-19_01_Business_Requirements_Document_BRD.md   # Phân tích nghiệp vụ, vấn đề & mục tiêu KPIs
├── DATA-19_02_System_Architecture_Technical_Spec.md   # Kiến trúc 5 tầng, LlamaIndex, Qdrant, Data Model & API
├── DATA-19_03_LangGraph_Agent_Workflow_Prompt_Design.md# Thiết kế LangGraph, HITL, Prompts & Mã Python
└── DATA-19_04_Evaluation_Governance_Deployment_Roadmap.md # Khung đánh giá, Guardrails, FinOps & Lộ trình 12 tuần
```
