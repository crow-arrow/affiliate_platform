# Multi-Tenant Architecture - Subdomain-Based Routing

## 🏗️ Архитектура

Платформа использует **subdomain-based routing** для изоляции tenant:
- **Production**: `jinn-travel.myapp.ai`
- **Development**: `localhost:5173?tenant=jinn-travel`

## 📋 Как это работает

### 1. Определение Tenant

#### Frontend (App.tsx)
```typescript
// Production: извлекает из subdomain
// jinn-travel.myapp.ai → slug = "jinn-travel"

// Development: извлекает из query параметра
// localhost:5173?tenant=jinn-travel → slug = "jinn-travel"
```

#### Backend (auth.js)
```javascript
// Приоритет определения tenant:
// 1. Header X-Tenant-Slug (от axios interceptor)
// 2. Query parameter ?tenant=slug (для dev)
// 3. Subdomain (для production)
```

### 2. Роутинг

**Публичные страницы** (без tenant):
- `/sign-in`
- `/sign-up`
- `/business-sign-up`
- `/verify-email/:token`

**Защищенные страницы** (требуют tenant):
- `/` → Dashboard
- `/trips`
- `/admin/*`
- И т.д.

### 3. Axios Interceptor

Автоматически добавляет tenant в запросы:
```typescript
// На localhost: добавляет ?tenant=jinn-travel
// На production: добавляет header X-Tenant-Slug
```

### 4. Переключение Workspace

**WorkspaceSwitcher** переключает между tenant:
- **Localhost**: меняет query параметр `?tenant=...`
- **Production**: меняет subdomain `jinn-travel.myapp.ai → dream-travel.myapp.ai`

## 🔧 Настройка для Production

### DNS
Настройте wildcard DNS запись:
```
*.myapp.ai → ваш сервер IP
```

### SSL Certificate
Установите wildcard SSL сертификат:
```
*.myapp.ai
```

### Environment Variables
```env
ROOT_DOMAIN=myapp.ai  # для корректного определения subdomain на бэкенде
```

## 📝 Примеры URL

### Development
```
http://localhost:5173?tenant=jinn-travel
http://localhost:5173?tenant=jinn-travel/dashboard
http://localhost:5173/sign-in  # публичная страница
```

### Production
```
https://jinn-travel.myapp.ai
https://jinn-travel.myapp.ai/dashboard
https://jinn-travel.myapp.ai/admin/settings
https://myapp.ai/sign-in  # публичная страница (без subdomain)
```

## 🎯 Потоки

### Регистрация компании
1. Пользователь заходит на `myapp.ai/business-sign-up`
2. Заполняет форму регистрации
3. Создается Tenant и Admin пользователь
4. Редирект на главную (остается на том же домене)

### Вход пользователя
1. Пользователь заходит на `jinn-travel.myapp.ai/sign-in` (или `myapp.ai/sign-in`)
2. Вводит email/password
3. Система определяет tenant из subdomain или выбирает первый доступный
4. После логина остается на текущем subdomain

### Переключение Workspace
1. Пользователь открывает WorkspaceSwitcher в sidebar
2. Выбирает другой workspace
3. Происходит перезагрузка страницы на новый subdomain

## 🔐 Безопасность

### Изоляция данных
- Все запросы к API автоматически включают tenant в header/query
- Backend проверяет tenant из JWT token
- Каждый tenant видит только свои данные

### JWT Token
```javascript
{
  id: "identity-id",
  role: "ADMIN" | "PARTNER",
  tenantId: "tenant-id"  // обязательно для изоляции
}
```

## 📚 Ключевые файлы

### Frontend
- `client/src/App.tsx` - определение tenant и роутинг
- `client/src/utils/axios.ts` - добавление tenant в запросы
- `client/src/components/WorkspaceSwitcher.tsx` - переключение workspace
- `client/src/redux/features/tenant/tenantSlice.ts` - управление tenant state

### Backend
- `server/controllers/auth.js` - `extractTenantSlug()` определение tenant
- `server/middleware/checkAuth.js` - проверка JWT с tenantId
- `server/controllers/tenant/resolveTenant.js` - резолв tenant по slug

## ⚠️ Важные моменты

1. **Всегда проверяйте tenantId** в backend запросах для изоляции данных
2. **JWT содержит tenantId** - используйте его для проверок
3. **Public routes** не требуют tenant (sign-in, sign-up)
4. **WorkspaceSwitcher** работает только для авторизованных пользователей

## 🚀 Миграция с path-based на subdomain-based

Если нужно будет мигрировать с path-based (`/jinn-travel/...`):
1. Обновить DNS (wildcard)
2. Обновить SSL (wildcard certificate)
3. Обновить frontend routing (App.tsx)
4. Тестировать все сценарии

## 📖 Дополнительные ресурсы

- [Slack Multi-Tenant Architecture](https://slack.engineering/architecture/)
- [Wildcard DNS Setup](https://en.wikipedia.org/wiki/Wildcard_DNS_record)

