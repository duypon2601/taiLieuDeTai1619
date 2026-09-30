cube(`Orders`, {
  sql: `
    SELECT 1 as id, 120 as amount, 'completed' as status, 'Căn hộ 2PN' as category, TIMESTAMP '2026-01-01' as created_at
    UNION ALL
    SELECT 2 as id, 280 as amount, 'completed' as status, 'Biệt thự' as category, TIMESTAMP '2026-01-02' as created_at
    UNION ALL
    SELECT 3 as id, 85 as amount, 'cancelled' as status, 'Studio' as category, TIMESTAMP '2026-01-02' as created_at
    UNION ALL
    SELECT 4 as id, 350 as amount, 'completed' as status, 'Shophouse' as category, TIMESTAMP '2026-01-03' as created_at
    UNION ALL
    SELECT 5 as id, 160 as amount, 'pending' as status, 'Căn hộ 2PN' as category, TIMESTAMP '2026-01-03' as created_at
    UNION ALL
    SELECT 6 as id, 420 as amount, 'completed' as status, 'Biệt thự' as category, TIMESTAMP '2026-01-04' as created_at
    UNION ALL
    SELECT 7 as id, 95 as amount, 'completed' as status, 'Studio' as category, TIMESTAMP '2026-01-05' as created_at
    UNION ALL
    SELECT 8 as id, 210 as amount, 'pending' as status, 'Shophouse' as category, TIMESTAMP '2026-01-05' as created_at
    UNION ALL
    SELECT 9 as id, 130 as amount, 'cancelled' as status, 'Căn hộ 2PN' as category, TIMESTAMP '2026-01-06' as created_at
    UNION ALL
    SELECT 10 as id, 500 as amount, 'completed' as status, 'Biệt thự' as category, TIMESTAMP '2026-01-07' as created_at
  `,

  measures: {
    count: {
      type: `count`,
      title: `Số lượng giao dịch`,
    },
    totalAmount: {
      sql: `amount`,
      type: `sum`,
      title: `Tổng giá trị (triệu VNĐ)`,
    },
    avgAmount: {
      sql: `amount`,
      type: `avg`,
      title: `Giá trị trung bình (triệu VNĐ)`,
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true,
    },
    status: {
      sql: `status`,
      type: `string`,
      title: `Trạng thái`,
    },
    category: {
      sql: `category`,
      type: `string`,
      title: `Loại sản phẩm`,
    },
    createdAt: {
      sql: `created_at`,
      type: `time`,
      title: `Ngày giao dịch`,
    },
  },
});
