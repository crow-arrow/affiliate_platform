# 📋 План полного перехода на Identity + Membership + PartnerProfile

## ❌ Текущее состояние

Таблица `User` все еще используется в:

1. **getUsers.js** - получение всех пользователей
2. **admin/getUserById.js** - получение пользователя по ID
3. **me/getTrips.js** - получение поездок (ленивое создание User)
4. **getClicks.js** - получение кликов (ленивое создание User)
5. **uploadFiles.js** - загрузка аватара (ленивое создание User)
6. **auth.js** - fallback для старых токенов, legacy login
7. **emailController.js** - верификация email
8. **resetPassword.js** - сброс пароля
9. **Схема Prisma** - legacy связи в Trips, ClicksData, LevelHistory, ReferralLink

---

## ✅ План миграции (пошагово)

### **Шаг 1: Мигрировать все контроллеры на PartnerProfile** ⚠️ КРИТИЧНО

#### 1.1 `me/getTrips.js`

- ❌ Убрать ленивое создание User
- ✅ Использовать PartnerProfile через Membership
- ✅ Получать данные из PartnerProfile

#### 1.2 `getClicks.js`

- ❌ Убрать ленивое создание User
- ✅ Использовать PartnerProfile.referralProfileId

#### 1.3 `uploadFiles.js`

- ❌ Убрать ленивое создание User
- ✅ Сохранять avatarUrl в Identity или PartnerProfile

#### 1.4 `getUsers.js`

- ❌ Убрать использование User
- ✅ Получать пользователей через Membership + PartnerProfile

#### 1.5 `admin/getUserById.js`

- ❌ Убрать использование User
- ✅ Получать через Identity + Membership + PartnerProfile

#### 1.6 `auth.js`

- ❌ Убрать fallback на legacy User
- ✅ Только Identity + Membership

#### 1.7 `emailController.js` и `resetPassword.js`

- ❌ Убрать использование User
- ✅ Использовать Identity

---

### **Шаг 2: Мигрировать связи в других таблицах**

#### 2.1 `Trips`

- ✅ Использовать PartnerProfile.affiliateId вместо User.affiliateId
- ❌ Убрать связь `affiliate User?`

#### 2.2 `ClicksData`

- ✅ Использовать только referralProfileId
- ❌ Убрать referralUserId и связь `user User?`

#### 2.3 `LevelHistory`

- ✅ Использовать только profileId
- ❌ Убрать userId и связь `user User?`

#### 2.4 `ReferralLink`

- ✅ Использовать только profileId
- ❌ Убрать userId и связь `user User?`

---

### **Шаг 3: Мигрировать данные из User в PartnerProfile**

- Создать скрипт миграции, который:
  1. Для каждого User находит соответствующий Identity по email
  2. Находит/создает Membership
  3. Создает PartnerProfile с данными из User
  4. Обновляет внешние ключи в Trips, ClicksData, LevelHistory, ReferralLink

---

### **Шаг 4: Обновить схему Prisma**

- ❌ Удалить модель User
- ❌ Удалить legacy поля (referral_user_id, user_id, userId)
- ❌ Удалить legacy связи
- ✅ Оставить только PartnerProfile связи

---

### **Шаг 5: Очистка**

- Удалить seed данных для User
- Обновить тесты
- Проверить все endpoints

---

## 🚨 Важно

**НЕ удаляем таблицу User сейчас**, потому что:

1. ⚠️ Много контроллеров все еще используют "ленивое создание" User
2. ⚠️ Есть legacy связи в других таблицах
3. ⚠️ Может быть важная бизнес-логика, зависящая от User

---

## 📌 Следующий шаг

**Начать с Шага 1.1** - мигрировать `me/getTrips.js` на PartnerProfile.

Это самый важный контроллер, так как он используется для основной функциональности (получение поездок и комиссий).

---

## ⏱️ Оценка времени

- **Шаг 1**: ~2-3 часа (миграция всех контроллеров)
- **Шаг 2**: ~30 минут (обновление схемы)
- **Шаг 3**: ~1 час (скрипт миграции данных)
- **Шаг 4**: ~30 минут (финальная очистка схемы)
- **Шаг 5**: ~1 час (тестирование)

**Итого**: ~5-6 часов работы
