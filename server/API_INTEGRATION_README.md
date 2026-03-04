# API Integration Documentation

Документация по интеграции с внешними системами для приема туров.

## 🔑 Аутентификация

Все запросы к API интеграции требуют API ключ в заголовке:

```
X-API-Key: your_api_key_here
```

Или через Authorization header:

```
Authorization: Bearer your_api_key_here
```

## 📋 Endpoints

### 1. Прием туров

**POST** `/api/integration/trips`

Принимает туры от внешних систем и сохраняет их в базу данных.

#### Headers
```
X-API-Key: your_api_key_here
Content-Type: application/json
```

#### Request Body

Можно отправить один тур или массив туров:

```json
[
  {
    "travel_date": "2025-12-01",
    "booking_date": "2025-11-15",
    "client_name": "John",
    "client_surname": "Doe",
    "customer_email": "john@example.com",
    "affiliate_code": "amal_666",
    "traveller_count": 2,
    "total_price": 1500.00,
    "currency": "EUR",
    "order_status": "CONFIRMED"
  }
]
```

#### Response

```json
{
  "message": "Trips processed successfully",
  "results": {
    "created": 5,
    "updated": 2,
    "errors": []
  }
}
```

#### Логика обработки

1. **Маппинг полей**: Входящие данные преобразуются согласно настроенным маппингам тенанта
2. **Определение дубликатов**: Поиск по `customerFirstName + customerLastName + customerEmail + bookingDate`
3. **Обновление**: Если дубликат найден - обновляется существующий тур
4. **Создание**: Если дубликат не найден - создается новый тур

#### Обязательные поля после маппинга

- `customerFirstName`
- `customerLastName`
- `customerEmail`
- `bookingDate`

## 🛠️ Админ-панель API

### Управление API ключами

#### Получить все API ключи
**GET** `/api/admin/integration/api-keys`

#### Создать API ключ
**POST** `/api/admin/integration/api-keys`

```json
{
  "name": "Production API Key"
}
```

Response:
```json
{
  "message": "API key created successfully",
  "apiKey": {
    "id": "...",
    "apiKey": "ak_...",
    "name": "Production API Key",
    "isActive": true
  }
}
```

#### Обновить API ключ
**PUT** `/api/admin/integration/api-keys/:id`

```json
{
  "name": "Updated Name",
  "isActive": false
}
```

#### Удалить API ключ
**DELETE** `/api/admin/integration/api-keys/:id`

### Управление маппингами полей

#### Получить все маппинги
**GET** `/api/admin/integration/field-mappings`

#### Получить доступные поля
**GET** `/api/admin/integration/field-mappings/fields`

Response:
```json
{
  "fields": [
    { "value": "travelDate", "label": "Travel Date", "type": "date" },
    { "value": "bookingDate", "label": "Booking Date", "type": "date" },
    { "value": "customerFirstName", "label": "Customer First Name", "type": "string" },
    { "value": "customerLastName", "label": "Customer Last Name", "type": "string" },
    { "value": "customerEmail", "label": "Customer Email", "type": "string" },
    { "value": "affiliateId", "label": "Affiliate ID", "type": "string" },
    { "value": "couponCode", "label": "Coupon Code", "type": "string" },
    { "value": "travellerAmount", "label": "Traveller Amount", "type": "number" },
    { "value": "totalPrice", "label": "Total Price", "type": "number" },
    { "value": "orderStatus", "label": "Order Status", "type": "string" },
    { "value": "currency", "label": "Currency", "type": "string" }
  ]
}
```

#### Создать маппинг
**POST** `/api/admin/integration/field-mappings`

```json
{
  "incomingField": "travel_date",
  "targetField": "travelDate",
  "description": "Дата путешествия"
}
```

#### Обновить маппинг
**PUT** `/api/admin/integration/field-mappings/:id`

```json
{
  "incomingField": "trip_date",
  "targetField": "travelDate",
  "description": "Updated description",
  "isActive": true
}
```

#### Удалить маппинг
**DELETE** `/api/admin/integration/field-mappings/:id`

## 📝 Примеры использования

### Пример 1: Турфирма с полями travel_date, client_name

**Настройка маппингов:**
1. `travel_date` → `travelDate`
2. `client_name` → `customerFirstName`
3. `client_surname` → `customerLastName`
4. `customer_email` → `customerEmail`
5. `booking_date` → `bookingDate`
6. `affiliate_code` → `affiliateId`

**Отправка данных:**
```json
[
  {
    "travel_date": "2025-12-01",
    "booking_date": "2025-11-15",
    "client_name": "John",
    "client_surname": "Doe",
    "customer_email": "john@example.com",
    "affiliate_code": "amal_666",
    "traveller_count": 2,
    "total_price": 1500.00
  }
]
```

### Пример 2: Турфирма с полями TravelDate, firstName

**Настройка маппингов:**
1. `TravelDate` → `travelDate`
2. `firstName` → `customerFirstName`
3. `lastName` → `customerLastName`
4. `email` → `customerEmail`
5. `reservation_date` → `bookingDate`
6. `partner_id` → `affiliateId`

**Отправка данных:**
```json
[
  {
    "TravelDate": "2025-12-01",
    "reservation_date": "2025-11-15",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "partner_id": "amal_43897",
    "guests": 3,
    "price": 2000.00
  }
]
```

## ⚠️ Важные замечания

1. **Дубликаты**: Туры определяются как дубликаты по комбинации `customerFirstName + customerLastName + customerEmail + bookingDate`. Если дубликат найден, существующий тур обновляется новыми данными.

2. **Маппинг полей**: Поля, которые не указаны в маппингах, игнорируются. Убедитесь, что все необходимые поля настроены.

3. **Типы данных**:
   - Даты автоматически преобразуются из строк в Date объекты
   - Числа преобразуются из строк в числа
   - Строки остаются строками

4. **Ошибки**: Если обработка тура завершилась ошибкой, он добавляется в массив `errors` в ответе, но не останавливает обработку других туров.

5. **Тенант**: Туры автоматически привязываются к тенанту, связанному с API ключом.

## 🔒 Безопасность

- API ключи хранятся в зашифрованном виде в базе данных
- Можно деактивировать ключи без удаления
- Все запросы логируются для аудита
- Рекомендуется использовать HTTPS в production

