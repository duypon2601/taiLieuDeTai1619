// State
let cubeHost = localStorage.getItem('cubeHost') || 'http://localhost:4000';
let aiProvider = localStorage.getItem('aiProvider') || 'gemini';
let apiKey = localStorage.getItem('apiKey') || '';
let chartInstance = null;

// DOM Elements
const cubeStatusBadge = document.getElementById('cubeStatusBadge');
const cubeStatusText = document.getElementById('cubeStatusText');
const aiStatusBadge = document.getElementById('aiStatusBadge');
const aiStatusText = document.getElementById('aiStatusText');

const aiProviderSelect = document.getElementById('aiProviderSelect');
const quickApiKeyInput = document.getElementById('quickApiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');

const promptInput = document.getElementById('promptInput');
const sendBtn = document.getElementById('sendBtn');
const presetChips = document.querySelectorAll('.preset-chip');

const pipelineStepper = document.getElementById('pipelineStepper');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const step4 = document.getElementById('step4');

const insightCard = document.getElementById('insightCard');
const insightContent = document.getElementById('insightContent');
const insightTime = document.getElementById('insightTime');

const kpiTotalRevenue = document.getElementById('kpiTotalRevenue');
const kpiTotalOrders = document.getElementById('kpiTotalOrders');
const kpiAvgAmount = document.getElementById('kpiAvgAmount');
const kpiTopCategory = document.getElementById('kpiTopCategory');
const kpiTopCategorySub = document.getElementById('kpiTopCategorySub');

const chartHeading = document.getElementById('chartHeading');
const chartSubheading = document.getElementById('chartSubheading');
const chartTypeBadge = document.getElementById('chartTypeBadge');
const mainChartCanvas = document.getElementById('mainChart');

const inspectorToggle = document.getElementById('inspectorToggle');
const inspectorBody = document.getElementById('inspectorBody');
const inspectorArrow = document.getElementById('inspectorArrow');
const ioTabBtns = document.querySelectorAll('.io-tab-btn');
const ioPanels = document.querySelectorAll('.io-panel');

const ioStep1Input = document.getElementById('ioStep1Input');
const ioStep1Output = document.getElementById('ioStep1Output');
const ioStep2Input = document.getElementById('ioStep2Input');
const ioStep2Output = document.getElementById('ioStep2Output');
const ioStep3Input = document.getElementById('ioStep3Input');
const ioStep3Output = document.getElementById('ioStep3Output');
const ioStep4Input = document.getElementById('ioStep4Input');
const ioStep4Output = document.getElementById('ioStep4Output');
const ioStep5Input = document.getElementById('ioStep5Input');
const ioStep5Output = document.getElementById('ioStep5Output');

// Color palettes for Chart.js
const COLORS = [
  { bg: 'rgba(99, 102, 241, 0.8)', border: '#6366f1' },  // Indigo
  { bg: 'rgba(16, 185, 129, 0.8)', border: '#10b981' },  // Emerald
  { bg: 'rgba(6, 182, 212, 0.8)',  border: '#06b6d4' },  // Cyan
  { bg: 'rgba(245, 158, 11, 0.8)', border: '#f59e0b' },  // Amber
  { bg: 'rgba(244, 63, 94, 0.8)',  border: '#f43f5e' },  // Rose
  { bg: 'rgba(168, 85, 247, 0.8)', border: '#a855f7' },  // Purple
];

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  aiProviderSelect.value = aiProvider;
  if (apiKey) {
    quickApiKeyInput.value = apiKey;
  }
  updateAiStatusBadge();
  checkCubeConnection();
  setupEventListeners();

  // Run initial query
  executeAnalysis("Tổng doanh thu theo từng loại sản phẩm");
});

function updateAiStatusBadge() {
  if (apiKey) {
    const provName = aiProvider === 'gemini' ? 'Google Gemini' : 'OpenAI';
    aiStatusText.innerHTML = `AI Mode: <strong>${provName} (Real LLM Online)</strong>`;
    aiStatusBadge.className = 'status-badge ai-badge online';
  } else {
    aiStatusText.innerHTML = `AI Mode: <strong>Chưa gắn Key (Offline Demo)</strong>`;
    aiStatusBadge.className = 'status-badge ai-badge';
  }
}

// Setup Event Listeners
function setupEventListeners() {
  saveApiKeyBtn.addEventListener('click', () => {
    apiKey = quickApiKeyInput.value.trim();
    aiProvider = aiProviderSelect.value;
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('aiProvider', aiProvider);
    updateAiStatusBadge();
    
    // Animate button
    saveApiKeyBtn.textContent = '✓ Đã kích hoạt!';
    setTimeout(() => {
      saveApiKeyBtn.textContent = 'Kích hoạt AI Thật';
    }, 1800);
  });

  sendBtn.addEventListener('click', () => {
    const val = promptInput.value.trim();
    if (val) executeAnalysis(val);
  });

  promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = promptInput.value.trim();
      if (val) executeAnalysis(val);
    }
  });

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const q = chip.getAttribute('data-query');
      promptInput.value = q;
      executeAnalysis(q);
    });
  });

  inspectorToggle.addEventListener('click', () => {
    inspectorBody.classList.toggle('collapsed');
    inspectorArrow.textContent = inspectorBody.classList.contains('collapsed') ? '▶' : '▼';
  });

  ioTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ioTabBtns.forEach(b => b.classList.remove('active'));
      ioPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const step = btn.getAttribute('data-step');
      const targetPanel = document.getElementById(`ioPanel${step}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

// Check Connection to Cube.dev
async function checkCubeConnection() {
  try {
    const res = await fetch(`${cubeHost}/cubejs-api/v1/meta`);
    if (res.ok) {
      cubeStatusText.textContent = 'Đã kết nối (Port 4000)';
      cubeStatusBadge.style.color = 'var(--accent-emerald)';
      cubeStatusBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    } else {
      throw new Error();
    }
  } catch (err) {
    cubeStatusText.textContent = 'Mất kết nối';
    cubeStatusBadge.style.color = 'var(--accent-rose)';
    cubeStatusBadge.style.borderColor = 'rgba(244, 63, 94, 0.4)';
  }
}

function updateStepper(step) {
  [step1, step2, step3, step4].forEach((s, idx) => {
    if (idx + 1 < step) {
      s.className = 'step-item completed';
    } else if (idx + 1 === step) {
      s.className = 'step-item active';
    } else {
      s.className = 'step-item';
    }
  });
}

// Master Pipeline Execution
async function executeAnalysis(userPrompt) {
  try {
    promptInput.value = userPrompt;
    updateStepper(1);
    insightContent.innerHTML = '<em>🤖 AI đang suy luận ngữ nghĩa và tạo cấu trúc Cube JSON...</em>';
    insightTime.textContent = new Date().toLocaleTimeString('vi-VN');

    // === BƯỚC 1: INPUT/OUTPUT (Ngôn ngữ tự nhiên) ===
    ioStep1Input.textContent = `User Query: "${userPrompt}"\nTimestamp: ${new Date().toISOString()}`;
    ioStep1Output.textContent = `Cleaned Prompt: "${userPrompt.trim()}"\nLanguage: vi-VN\nDetected Domain: Bất động sản / Doanh thu giao dịch`;

    // === BƯỚC 2: AI AGENT (Semantic Translation) ===
    updateStepper(2);
    const schemaDefinition = {
      cube: "Orders",
      measures: ["Orders.count", "Orders.totalAmount", "Orders.avgAmount"],
      dimensions: ["Orders.category", "Orders.status", "Orders.createdAt"]
    };

    ioStep2Input.textContent = `System Instruction: "You are the Semantic AI Agent. Convert request into Cube Query JSON."\nUser Question: "${userPrompt}"\nSchema Context:\n${JSON.stringify(schemaDefinition, null, 2)}`;

    const aiPlan = await generateCubeQueryWithAI(userPrompt);

    ioStep2Output.textContent = `AI Provider: ${apiKey ? (aiProvider === 'gemini' ? 'Google Gemini' : 'OpenAI') : 'Built-in Semantic Engine'}\nSelected Chart Type: ${aiPlan.chartType.toUpperCase()}\nChart Title: "${aiPlan.title}"\nReasoning: ${aiPlan.reasoning || 'Tối ưu theo số chiều dữ liệu'}\n\nCube Query JSON:\n${JSON.stringify(aiPlan.cubeQuery, null, 2)}`;

    // === BƯỚC 3: CUBE.DEV ENGINE (Data Query) ===
    updateStepper(3);
    insightContent.innerHTML = '<em>⚡ Cube.dev đang truy vấn Database và tính toán số liệu...</em>';
    
    ioStep3Input.textContent = `HTTP Request:\nPOST ${cubeHost}/cubejs-api/v1/load\nHeaders: { "Content-Type": "application/json" }\n\nPayload:\n${JSON.stringify({ query: aiPlan.cubeQuery }, null, 2)}`;

    const startTime = performance.now();
    const cubeResponse = await fetch(`${cubeHost}/cubejs-api/v1/load`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: aiPlan.cubeQuery })
    });

    if (!cubeResponse.ok) {
      throw new Error(`Cube API error: ${cubeResponse.statusText}`);
    }

    const cubeData = await cubeResponse.json();
    const duration = Math.round(performance.now() - startTime);

    ioStep3Output.textContent = `Status: 200 OK (${duration}ms)\nDataSource: Postgres (Local Docker)\nRecords Returned: ${cubeData.data ? cubeData.data.length : 0}\n\nRaw Aggregate Data:\n${JSON.stringify(cubeData.data, null, 2)}`;

    // === BƯỚC 4: VISUALIZATION (Chart & KPIs) ===
    updateStepper(4);
    renderChart(aiPlan, cubeData.data);
    updateKPIs(cubeData.data, aiPlan);

    const labels = cubeData.data.map(item => {
      let raw = item[aiPlan.dimensionKey];
      return (aiPlan.dimensionKey === 'Orders.createdAt' && raw) ? raw.split('T')[0] : (raw || 'Khác');
    });
    const values = cubeData.data.map(item => Number(item[aiPlan.measureKey]) || 0);

    ioStep4Input.textContent = `Raw Data Array: ${cubeData.data.length} records\nDimension Key: "${aiPlan.dimensionKey}"\nMeasure Key: "${aiPlan.measureKey}"\nTarget Chart: "${aiPlan.chartType}"`;
    ioStep4Output.textContent = `Chart.js Render Configuration:\n- Labels: ${JSON.stringify(labels)}\n- Dataset: ${JSON.stringify(values)}\n- Color Palette: Applied 6 Indigo/Emerald Gradients\n- Canvas: #mainChart\n\nKPI Indicators:\n- Revenue: ${kpiTotalRevenue.textContent}\n- Total Orders: ${kpiTotalOrders.textContent}\n- Average Ticket: ${kpiAvgAmount.textContent}\n- Top Category: ${kpiTopCategory.textContent}`;

    // === BƯỚC 5: NATURAL LANGUAGE INSIGHT ===
    insightContent.innerHTML = '<em>✍️ AI đang tổng hợp nhận định kinh doanh tự nhiên...</em>';

    ioStep5Input.textContent = `Prompt to Analyst AI:\n"Hãy viết đoạn văn 2-3 câu bằng tiếng Việt nhận xét dữ liệu kinh doanh sau để trả lời câu hỏi: '${userPrompt}'."\n\nInput Data:\n${JSON.stringify(cubeData.data, null, 2)}`;

    const insightResult = await generateNaturalLanguageInsights(userPrompt, aiPlan, cubeData.data, duration);

    ioStep5Output.textContent = `Generated Narrative Text:\n"${insightResult ? insightResult.replace(/<[^>]*>/g, '') : insightContent.innerText}"\n\nFormat: HTML Rich text với <strong> badges\nEngine: ${apiKey ? (aiProvider === 'gemini' ? 'Google Gemini 1.5' : 'OpenAI') : 'Semantic Analyst Rules'}`;

  } catch (error) {
    console.error(error);
    insightContent.innerHTML = `<span style="color: var(--accent-rose)">⚠️ Lỗi: ${error.message}. Hãy kiểm tra container Cube.dev hoặc API Key.</span>`;
  }
}

// AI Engine: Calls Real LLM or Semantic Parser
async function generateCubeQueryWithAI(prompt) {
  if (apiKey) {
    try {
      if (aiProvider === 'gemini') {
        return await callGeminiForQuery(prompt);
      } else {
        return await callOpenAIForQuery(prompt);
      }
    } catch (e) {
      console.warn("Real LLM call failed, fallback to offline rules:", e);
      insightContent.innerHTML += `<br/><small style="color: #f59e0b">⚠️ Gọi LLM thất bại (${e.message}), chuyển sang bộ phân tích nội bộ.</small>`;
    }
  }

  // Built-in Semantic Rules (Fallback)
  return fallbackSemanticQuery(prompt);
}

// Real Google Gemini LLM API Call
async function callGeminiForQuery(prompt) {
  const schemaDesc = `
  Cube: Orders
  Available Measures:
  - Orders.count: Số lượng giao dịch (type: count)
  - Orders.totalAmount: Tổng giá trị / Doanh thu (type: sum, đơn vị triệu VNĐ)
  - Orders.avgAmount: Giá trị trung bình (type: avg, đơn vị triệu VNĐ)
  
  Available Dimensions:
  - Orders.category: Loại sản phẩm (Studio, Căn hộ 2PN, Shophouse, Biệt thự)
  - Orders.status: Trạng thái (completed, pending, cancelled)
  - Orders.createdAt: Thời gian giao dịch (granularity: day)
  `;

  const systemInstruction = `You are the Semantic AI Agent for Project DATA-16.
Convert the user request into an exact JSON object matching this schema:
{
  "title": "Tiêu đề tiếng Việt ngắn gọn cho biểu đồ",
  "chartType": "bar" | "line" | "doughnut",
  "dimensionKey": "Orders.category" | "Orders.status" | "Orders.createdAt",
  "measureKey": "Orders.totalAmount" | "Orders.count" | "Orders.avgAmount",
  "dimensionTitle": "Tên trục/chiều phân tích tiếng Việt",
  "measureTitle": "Tên chỉ số đo lường tiếng Việt",
  "cubeQuery": {
    "measures": ["Orders.totalAmount", "Orders.count"],
    "dimensions": ["Orders.category"] (NOTE: if time, use timeDimensions: [{"dimension":"Orders.createdAt","granularity":"day"}] instead of dimensions),
    "order": { "Orders.totalAmount": "desc" }
  },
  "reasoning": "Lý do ngắn gọn chọn biểu đồ và chỉ số này..."
}
Respond ONLY with pure raw JSON without any markdown formatting.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemInstruction}\n\nSchema:\n${schemaDesc}\n\nUser Question: ${prompt}` }] }]
    })
  });

  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.error?.message || resp.statusText);
  }

  const data = await resp.json();
  let text = data.candidates[0].content.parts[0].text.trim();
  text = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(text);
}

// Real OpenAI LLM API Call
async function callOpenAIForQuery(prompt) {
  const schemaDesc = `
  Cube: Orders
  Measures: Orders.count, Orders.totalAmount, Orders.avgAmount
  Dimensions: Orders.category, Orders.status, Orders.createdAt
  `;

  const messages = [
    {
      role: "system",
      content: `You are the Semantic AI Agent for Project DATA-16. Convert user question into pure JSON with: title, chartType ('bar'|'line'|'doughnut'), dimensionKey, measureKey, dimensionTitle, measureTitle, cubeQuery (measures, dimensions or timeDimensions), and reasoning. Schema: ${schemaDesc}. Return ONLY raw JSON.`
    },
    { role: "user", content: prompt }
  ];

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: messages,
      response_format: { type: "json_object" }
    })
  });

  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.error?.message || resp.statusText);
  }

  const data = await resp.json();
  return JSON.parse(data.choices[0].message.content);
}

// Fallback Rule Parser
function fallbackSemanticQuery(prompt) {
  const p = prompt.toLowerCase();

  if (p.includes('trạng thái') || p.includes('status') || p.includes('tỷ lệ') || p.includes('tỷ trọng')) {
    return {
      title: "Phân bổ Doanh thu theo Trạng thái Đơn hàng",
      chartType: "doughnut",
      dimensionKey: "Orders.status",
      measureKey: "Orders.totalAmount",
      dimensionTitle: "Trạng thái",
      measureTitle: "Doanh thu",
      cubeQuery: {
        measures: ["Orders.count", "Orders.totalAmount"],
        dimensions: ["Orders.status"],
        order: { "Orders.totalAmount": "desc" }
      },
      reasoning: "Câu hỏi yêu cầu so sánh tỷ trọng giữa các trạng thái nên biểu đồ Tròn (Doughnut) là tối ưu nhất."
    };
  }

  if (p.includes('ngày') || p.includes('xu hướng') || p.includes('thời gian') || p.includes('date') || p.includes('trend')) {
    return {
      title: "Xu hướng Giao dịch theo Ngày",
      chartType: "line",
      dimensionKey: "Orders.createdAt",
      measureKey: "Orders.count",
      dimensionTitle: "Ngày giao dịch",
      measureTitle: "Số lượng giao dịch",
      cubeQuery: {
        measures: ["Orders.count", "Orders.totalAmount"],
        timeDimensions: [{
          dimension: "Orders.createdAt",
          granularity: "day"
        }],
        order: { "Orders.createdAt": "asc" }
      },
      reasoning: "Câu hỏi chứa yếu tố thời gian nên biểu đồ Đường (Line Chart) thể hiện rõ nhất đà tăng trưởng."
    };
  }

  if (p.includes('trung bình') || p.includes('avg') || p.includes('bình quân')) {
    return {
      title: "Giá trị Giao dịch Trung bình theo Loại Sản phẩm",
      chartType: "bar",
      dimensionKey: "Orders.category",
      measureKey: "Orders.avgAmount",
      dimensionTitle: "Loại sản phẩm",
      measureTitle: "Giá trị TB (triệu VNĐ)",
      cubeQuery: {
        measures: ["Orders.avgAmount", "Orders.count"],
        dimensions: ["Orders.category"],
        order: { "Orders.avgAmount": "desc" }
      },
      reasoning: "Biểu đồ Cột (Bar Chart) giúp so sánh trực quan giá trị trung bình giữa các phân khúc."
    };
  }

  return {
    title: "Tổng Doanh thu theo Từng Loại Sản phẩm",
    chartType: "bar",
    dimensionKey: "Orders.category",
    measureKey: "Orders.totalAmount",
    dimensionTitle: "Loại sản phẩm",
    measureTitle: "Doanh thu (triệu VNĐ)",
    cubeQuery: {
      measures: ["Orders.totalAmount", "Orders.count"],
      dimensions: ["Orders.category"],
      order: { "Orders.totalAmount": "desc" }
    },
    reasoning: "Biểu đồ Cột sắp xếp giảm dần giúp nhanh chóng xác định phân khúc đóng góp doanh thu lớn nhất."
  };
}

// Render Chart.js
function renderChart(aiPlan, dataList) {
  chartHeading.textContent = aiPlan.title;
  chartSubheading.textContent = `Phân tích theo ${aiPlan.dimensionTitle} • Chỉ số: ${aiPlan.measureTitle}`;
  chartTypeBadge.textContent = aiPlan.chartType.toUpperCase() + ' CHART';

  const labels = dataList.map(item => {
    let raw = item[aiPlan.dimensionKey];
    if (aiPlan.dimensionKey === 'Orders.createdAt' && raw) {
      return raw.split('T')[0];
    }
    return raw || 'Khác';
  });

  const values = dataList.map(item => Number(item[aiPlan.measureKey]) || 0);

  if (chartInstance) {
    chartInstance.destroy();
  }

  const isDoughnut = aiPlan.chartType === 'doughnut';
  const isLine = aiPlan.chartType === 'line';

  const backgroundColors = isDoughnut 
    ? COLORS.map(c => c.bg) 
    : isLine 
      ? 'rgba(99, 102, 241, 0.15)' 
      : COLORS[0].bg;

  const borderColors = isDoughnut 
    ? COLORS.map(c => c.border) 
    : COLORS[0].border;

  chartInstance = new Chart(mainChartCanvas, {
    type: aiPlan.chartType,
    data: {
      labels: labels,
      datasets: [{
        label: aiPlan.measureTitle,
        data: values,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: isDoughnut ? 0 : 6,
        fill: isLine,
        tension: isLine ? 0.35 : 0,
        pointBackgroundColor: COLORS[0].border,
        pointRadius: isLine ? 5 : 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: isDoughnut,
          position: 'right',
          labels: {
            color: '#9ca3af',
            font: { family: 'Inter', size: 12 },
            padding: 16
          }
        },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#f9fafb',
          bodyColor: '#38bdf8',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
        }
      },
      scales: isDoughnut ? {} : {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#9ca3af', font: { family: 'Inter' } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#9ca3af', font: { family: 'Inter' } },
          beginAtZero: true
        }
      }
    }
  });
}

// Update Top KPI Cards
function updateKPIs(dataList, aiPlan) {
  let totalRev = 0;
  let totalCount = 0;
  let topName = '---';
  let topVal = -1;

  dataList.forEach(item => {
    const rev = Number(item['Orders.totalAmount']) || 0;
    const cnt = Number(item['Orders.count']) || 0;
    const targetVal = Number(item[aiPlan.measureKey]) || 0;

    totalRev += rev;
    totalCount += cnt;

    if (targetVal > topVal) {
      topVal = targetVal;
      topName = item[aiPlan.dimensionKey] || 'N/A';
      if (aiPlan.dimensionKey === 'Orders.createdAt' && topName.includes('T')) {
        topName = topName.split('T')[0];
      }
    }
  });

  const avg = totalCount > 0 ? (totalRev / totalCount).toFixed(1) : 0;

  kpiTotalRevenue.textContent = totalRev.toLocaleString('vi-VN');
  kpiTotalOrders.textContent = totalCount.toLocaleString('vi-VN');
  kpiAvgAmount.textContent = avg;
  kpiTopCategory.textContent = topName;
  kpiTopCategorySub.textContent = `Cao nhất (${topVal.toLocaleString('vi-VN')})`;
}

// Generate Natural Language Insights: Calls Real LLM if Key is present
async function generateNaturalLanguageInsights(prompt, aiPlan, dataList, latency) {
  if (!dataList || dataList.length === 0) {
    insightContent.innerHTML = 'Không tìm thấy dữ liệu phù hợp với yêu cầu này.';
    return;
  }

  if (apiKey) {
    try {
      const liveInsight = await callLLMForBusinessInsight(prompt, dataList);
      insightContent.innerHTML = `
        <p>${liveInsight}</p>
        <div style="margin-top: 8px; font-size: 0.78rem; color: #94a3b8;">
          ✨ <em>Được sinh trực tiếp bởi <strong>${aiProvider === 'gemini' ? 'Google Gemini' : 'OpenAI'}</strong> • Cube.dev truy vấn trong <strong>${latency}ms</strong>.</em>
        </div>
      `;
      return liveInsight;
    } catch (e) {
      console.warn("LLM insight failed, fallback to rule engine", e);
    }
  }

  // Fallback Rule-based insight
  const values = dataList.map(d => Number(d[aiPlan.measureKey]) || 0);
  const total = values.reduce((a, b) => a + b, 0);
  const sorted = [...dataList].sort((a, b) => (Number(b[aiPlan.measureKey]) || 0) - (Number(a[aiPlan.measureKey]) || 0));
  const top = sorted[0];
  const topLabel = top[aiPlan.dimensionKey];
  const topVal = Number(top[aiPlan.measureKey]) || 0;
  const topPct = total > 0 ? ((topVal / total) * 100).toFixed(1) : 0;

  let explanation = '';
  if (aiPlan.dimensionKey === 'Orders.status') {
    explanation = `Hệ thống ghi nhận tổng cộng <strong>${total.toLocaleString('vi-VN')} triệu VNĐ</strong> doanh thu từ các giao dịch. Trong đó, nhóm trạng thái <strong>"${topLabel}"</strong> chiếm tỷ trọng áp đảo nhất với <strong>${topPct}%</strong> (tương đương <strong>${topVal.toLocaleString('vi-VN')} triệu VNĐ</strong>). Nhóm bị hủy (cancelled) chỉ chiếm tỷ lệ nhỏ, cho thấy tỷ lệ hoàn tất giao dịch đạt hiệu suất cao.`;
  } else if (aiPlan.dimensionKey === 'Orders.createdAt') {
    explanation = `Qua phân tích chuỗi thời gian, ngày <strong>${topLabel ? topLabel.split('T')[0] : 'gần nhất'}</strong> ghi nhận lượng giao dịch đạt đỉnh với <strong>${topVal} giao dịch</strong>. Xu hướng giao dịch duy trì ổn định qua các ngày trong đầu tháng 1/2026.`;
  } else if (aiPlan.measureKey === 'Orders.avgAmount') {
    explanation = `Về mặt giá trị đơn vị, phân khúc <strong>"${topLabel}"</strong> có giá trị giao dịch trung bình cao nhất, đạt <strong>${topVal.toFixed(1)} triệu VNĐ / giao dịch</strong>, vượt trội so với các phân khúc Studio và Căn hộ tiêu chuẩn.`;
  } else {
    explanation = `Dựa trên dữ liệu từ Cube.dev, phân khúc <strong>"${topLabel}"</strong> đóng vai trò động lực chính với <strong>${topVal.toLocaleString('vi-VN')} triệu VNĐ</strong> (chiếm <strong>${topPct}%</strong> tổng doanh thu toàn danh mục). Các dòng sản phẩm khác như Shophouse và Căn hộ 2PN đóng góp ổn định vào cơ cấu doanh thu.`;
  }

  insightContent.innerHTML = `
    <p>${explanation}</p>
    <div style="margin-top: 8px; font-size: 0.78rem; color: #94a3b8;">
      ⚡ <em>Tự động tổng hợp qua Cube.dev REST API trong <strong>${latency}ms</strong> (Cache-ready).</em>
    </div>
  `;
  return explanation;
}

// Call Real LLM for Natural Business Insight
async function callLLMForBusinessInsight(prompt, dataList) {
  const promptText = `Bạn là một Chuyên viên Phân tích Dữ liệu Kinh doanh (Senior BI Analyst).
Người dùng hỏi: "${prompt}".
Dữ liệu thực tế vừa được truy vấn từ Cube.dev Semantic Layer:
${JSON.stringify(dataList, null, 2)}

Hãy viết một đoạn nhận xét/insight kinh doanh ngắn (khoảng 2-3 câu bằng tiếng Việt tự nhiên):
- Trả lời trực diện câu hỏi của người dùng.
- Nêu rõ số liệu nổi bật, nhóm đóng góp cao nhất và tỷ trọng tương ứng.
- Dùng thẻ <strong>...</strong> để bôi đậm các con số và từ khóa quan trọng.
- Trả về dạng text thuần (có thể chứa thẻ <strong>), không cần tiêu đề.`;

  if (aiProvider === 'gemini') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });
    const d = await resp.json();
    return d.candidates[0].content.parts[0].text.trim();
  } else {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: promptText }]
      })
    });
    const d = await resp.json();
    return d.choices[0].message.content.trim();
  }
}
