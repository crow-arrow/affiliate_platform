# 🔍 Анализ схемы базы данных на Best Practices

## ❌ Найденные проблемы

### 1. **Непоследовательность в naming conventions**

**Проблема**: Смешение camelCase и snake_case в разных моделях

| Модель           | Стиль полей   | Примеры                                                         |
| ---------------- | ------------- | --------------------------------------------------------------- |
| `User`           | snake_case    | `first_name`, `last_name`, `affiliate_id`, `booked_trips_count` |
| `Identity`       | camelCase     | `firstName`, `lastName`, `avatarUrl`, `passwordHash`            |
| `PartnerProfile` | **смешанный** | `affiliate_id` (snake_case), `levelChangedAt` (camelCase)       |
| `ClicksData`     | snake_case    | `ip_address`, `user_agent`, `referral_user_id`                  |
| `LevelHistory`   | snake_case    | `user_id`, `changed_at`                                         |
| `ReferralLink`   | camelCase     | `destinationUrl`, `utmSource`, `userId`                         |

**Рекомендация**: Использовать единый стиль. Для Prisma рекомендуется **camelCase в модели** + **snake_case в БД через @map**.

---

### 2. **Отсутствие `updatedAt` в некоторых моделях**

**Проблема**:

- `Tenant` - нет `updatedAt` ❌
- `ConversionEvent` - нет `updatedAt` ❌

**Рекомендация**: Добавить `updatedAt DateTime @updatedAt` везде для аудита изменений.

---

### 3. **Inconsistent foreign key naming**

**Проблема**: Смешение стилей в foreign keys

| Модель           | Foreign Key                               | Стиль         |
| ---------------- | ----------------------------------------- | ------------- |
| `Membership`     | `identityId`, `tenantId`                  | camelCase ✅  |
| `PartnerProfile` | `membershipId`                            | camelCase ✅  |
| `ClicksData`     | `referral_user_id`, `referral_profile_id` | snake_case ❌ |
| `LevelHistory`   | `user_id`, `profile_id`                   | snake_case ❌ |
| `ReferralLink`   | `userId`, `profileId`                     | mixed ❌      |

**Рекомендация**: Использовать camelCase для всех foreign keys (Prisma convention).

---

### 4. **Legacy поля без пометки в названии**

**Проблема**: Legacy поля (`referral_user_id`, `user_id`, `userId`) могут вводить в заблуждение

**Рекомендация**: Добавить суффикс `_legacy` или комментарий, что поле deprecated.

---

### 5. **Отсутствие индексов на важных полях**

**Проблема**:

- `Trips.travel_date` - часто используется для фильтрации, но нет индекса
- `Trips.booking_date` - нет индекса
- `Trips.order_status` - нет индекса
- `ClicksData.timestamp` - нет индекса (хотя часто фильтруется)
- `LevelHistory.changed_at` - нет индекса

**Рекомендация**: Добавить индексы для полей, используемых в WHERE и ORDER BY.

---

### 6. **Названия таблиц (legacy WordPress)**

**Проблема**: Использование префиксов WordPress в названиях таблиц

- `wp_tourmaster_order` ❌
- `wp_affiliate_analytics` ❌

**Рекомендация**: Переименовать в более нейтральные названия:

- `wp_tourmaster_order` → `trips` или `orders`
- `wp_affiliate_analytics` → `clicks_data` или `analytics_clicks`

---

### 7. **Проблемы с типами данных**

**Проблема**:

- `Trips.total_price` - `Decimal(19,2)` - правильно ✅
- `PartnerProfile.earnings` - `Float` - может быть неточным для денег ❌

**Рекомендация**: Для денег использовать `Decimal` вместо `Float` для точности.

---

### 8. **Missing constraints и валидация**

**Проблема**:

- `Trips.affiliate_id` - может быть null, но нет проверки
- `ClicksData.affiliate_id` - NOT NULL, но может быть пустым
- `email` в разных моделях - нет единой валидации длины

**Рекомендация**: Добавить `@db.VarChar()` ограничения для строковых полей.

---

## ✅ Рекомендации по улучшению

### Приоритет 1 (Критично):

1. **Унифицировать naming convention**:

   ```prisma
   // Все поля в camelCase в модели, snake_case в БД
   model User {
     firstName String @map("first_name")
     lastName  String @map("last_name")
     affiliateId String? @map("affiliate_id")
   }
   ```

2. **Добавить `updatedAt` где отсутствует**:

   ```prisma
   model Tenant {
     updatedAt DateTime @updatedAt
   }
   ```

3. **Исправить типы данных для денег**:
   ```prisma
   model PartnerProfile {
     earnings Decimal @db.Decimal(19, 2) // вместо Float
     totalCommission Decimal @db.Decimal(19, 2)
   }
   ```

### Приоритет 2 (Важно):

4. **Добавить недостающие индексы**:

   ```prisma
   model Trips {
     @@index([travel_date])
     @@index([booking_date])
     @@index([order_status])
   }
   ```

5. **Унифицировать foreign keys**:
   - Все в camelCase: `identityId`, `tenantId`, `profileId`

### Приоритет 3 (Желательно):

6. **Переименовать legacy таблицы** (требует миграции данных)
7. **Добавить constraints для валидации**
8. **Удалить legacy поля** после полной миграции

---

## 📋 Чеклист для исправления

- [ ] Унифицировать naming: все поля camelCase в модели
- [ ] Добавить `updatedAt` в `Tenant` и `ConversionEvent`
- [ ] Изменить `Float` на `Decimal` для денежных полей
- [ ] Добавить индексы на важные поля
- [ ] Переименовать foreign keys в camelCase
- [ ] Добавить `@db.VarChar()` constraints
- [ ] Обновить комментарии для legacy полей
- [ ] Переименовать WordPress таблицы (опционально)
