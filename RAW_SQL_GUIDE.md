# 📊 Руководство: Когда использовать Raw SQL в Prisma

## 🎯 Общее правило

**Используйте Prisma по умолчанию**, переходите на raw SQL только когда:

- Prisma не может выразить запрос эффективно
- Нужна оптимизация производительности
- Требуются сложные агрегации/аналитика

---

## ⚠️ Уже найдены места, где может потребоваться raw SQL:

### 1. **`getUsers.js` - N+1 Problem (КРИТИЧНО)**

**Текущий код:**

```javascript
const usersWithTripsCount = await Promise.all(
  users.map(async (user) => {
    const trips = await prisma.trips.findMany({
      where: { OR: whereConditions },
    });
    // ...
  })
);
```

**Проблема:** Для каждого пользователя выполняется отдельный запрос к БД → N+1 проблема

**Решение через Raw SQL:**

```javascript
// ⚠️ RAW SQL РЕКОМЕНДУЕТСЯ здесь
const usersWithStats = await prisma.$queryRaw`
  SELECT
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.affiliate_id,
    u.coupon_code,
    COUNT(DISTINCT t.id) as booked_trips_count,
    SUM(CASE WHEN t.order_status = 'COMPLETED' THEN t.traveller_amount ELSE 0 END) as number_of_travellers
  FROM referral_users u
  LEFT JOIN trips t ON (
    (u.affiliate_id IS NOT NULL AND t.affiliate_id = u.affiliate_id)
    OR (u.coupon_code IS NOT NULL AND t.coupon_code = u.coupon_code)
  )
  WHERE u.tenant_id = ${tenantId}
  GROUP BY u.id, u.first_name, u.last_name, u.email, u.affiliate_id, u.coupon_code
`;
```

**Когда применить:** Сразу, когда будете оптимизировать этот endpoint.

---

### 2. **Аналитика и отчеты (БУДУЩЕЕ)**

#### A. Статистика по тенантам (для админки)

```sql
-- ⚠️ RAW SQL для аналитики
SELECT
  t.id as tenant_id,
  t.name as tenant_name,
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT CASE WHEN u.created_at > NOW() - INTERVAL '30 days' THEN u.id END) as new_users_30d,
  SUM(u.earnings) as total_earnings,
  AVG(u.earnings) as avg_earnings_per_user
FROM "Tenant" t
LEFT JOIN referral_users u ON u.tenant_id = t.id
GROUP BY t.id, t.name
ORDER BY total_earnings DESC;
```

#### B. Топ партнеров по комиссиям

```sql
-- ⚠️ RAW SQL для рейтинга
SELECT
  u.id,
  u.first_name,
  u.last_name,
  u.email,
  SUM(tr.total_price * CASE
    WHEN u.level = 'GOLD' THEN 0.12
    WHEN u.level = 'SILVER' THEN 0.10
    ELSE 0.07
  END) as total_commission,
  COUNT(DISTINCT tr.id) as completed_trips
FROM referral_users u
INNER JOIN trips tr ON tr.affiliate_id = u.affiliate_id
WHERE tr.order_status = 'COMPLETED'
  AND u.tenant_id = ${tenantId}
GROUP BY u.id, u.first_name, u.last_name, u.email
ORDER BY total_commission DESC
LIMIT 10;
```

---

### 3. **Временные ряды (Time Series) - БУДУЩЕЕ**

Если понадобится график регистраций/комиссий по дням:

```sql
-- ⚠️ RAW SQL для временных рядов
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as registrations,
  SUM(earnings) as daily_earnings
FROM referral_users
WHERE tenant_id = ${tenantId}
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date;
```

---

### 4. **Оконные функции (Window Functions) - БУДУЩЕЕ**

Если понадобится ранжирование или скользящие средние:

```sql
-- ⚠️ RAW SQL для window functions
SELECT
  id,
  first_name,
  earnings,
  ROW_NUMBER() OVER (PARTITION BY tenant_id ORDER BY earnings DESC) as rank_in_tenant,
  AVG(earnings) OVER (PARTITION BY tenant_id) as avg_tenant_earnings
FROM referral_users
WHERE tenant_id = ${tenantId};
```

---

### 5. **Сложные JOIN с условиями - БУДУЩЕЕ**

Если понадобятся множественные JOIN с условиями:

```sql
-- ⚠️ RAW SQL для сложных JOIN
SELECT
  u.id as user_id,
  u.email,
  COUNT(DISTINCT t.id) as total_trips,
  COUNT(DISTINCT c.id) as total_clicks,
  COUNT(DISTINCT ce.id) as total_conversions
FROM referral_users u
LEFT JOIN trips t ON t.affiliate_id = u.affiliate_id
LEFT JOIN clicks_data c ON c.referral_user_id = u.id
LEFT JOIN "ConversionEvent" ce ON ce.referral_id IN (
  SELECT slug FROM "ReferralLink" WHERE "userId" = u.id
)
WHERE u.tenant_id = ${tenantId}
GROUP BY u.id, u.email;
```

---

## ✅ Места, где Prisma достаточно (не трогаем):

1. **CRUD операции** - создание, чтение, обновление, удаление
2. **Простые фильтры и пагинация**
3. **Базовые JOIN через include**
4. **Валидация и отношения**

---

## 📝 Как использовать Raw SQL в Prisma:

### Безопасный способ (Prisma.$queryRaw с tagged templates):

```javascript
// ✅ Безопасно - Prisma автоматически экранирует
const result = await prisma.$queryRaw`
  SELECT * FROM referral_users
  WHERE tenant_id = ${tenantId}
  AND created_at > ${date}
`;
```

### С параметрами (Prisma.$queryRawUnsafe):

```javascript
// ⚠️ Осторожно - используйте только с проверкой параметров
const result = await prisma.$queryRawUnsafe(
  `SELECT * FROM referral_users WHERE email = $1`,
  email // Всегда проверяйте и санитизируйте!
);
```

---

## 🚨 ВАЖНО: Безопасность

1. **Всегда используйте Prisma.$queryRaw** с tagged templates для автоматического экранирования
2. **Никогда не используйте конкатенацию строк** с пользовательским вводом
3. **Валидируйте все параметры** перед использованием
4. **Используйте TypeScript типы** для результатов (Prisma.$queryRawTyped)

---

## 📌 Чеклист: Нужен ли Raw SQL?

- [ ] Prisma делает N+1 запросов?
  - ✅ Да → Рассмотрите raw SQL
- [ ] Нужны сложные агрегации (SUM, COUNT, GROUP BY)?
  - ✅ Да → Raw SQL может быть эффективнее
- [ ] Нужны оконные функции (ROW_NUMBER, RANK, LAG)?
  - ✅ Да → Только raw SQL
- [ ] Нужна аналитика по временным рядам?
  - ✅ Да → Raw SQL эффективнее
- [ ] Простой CRUD запрос?
  - ❌ Нет → Используйте Prisma

---

## 🔔 Я буду предупреждать вас, когда потребуется Raw SQL в следующих случаях:

1. **Оптимизация производительности** - когда найду N+1 проблемы
2. **Новые фичи** - если вы добавите аналитику/отчеты
3. **Сложные запросы** - когда Prisma не справляется
4. **Миграции** - если нужны сложные изменения данных

---

## 💡 Пример структуры для raw SQL запросов:

Создайте отдельные файлы для raw SQL:

```
server/
  utils/
    rawQueries/
      getUserStats.sql.js
      getTenantAnalytics.sql.js
      getTopPartners.sql.js
```

Пример:

```javascript
// server/utils/rawQueries/getUserStats.sql.js
export const getUserStatsRaw = async (tenantId) => {
  return prisma.$queryRaw`
    SELECT ... -- ваш SQL
  `;
};
```

---

**Последнее обновление:** 2025-01-XX
**Следующий ревью:** Когда добавите новые аналитические функции
