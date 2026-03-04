import prisma from "../prisma/client.js";

/**
 * Универсальная функция для резолвинга и валидации tenantId
 * Гарантирует, что возвращаемый tenantId валиден и пользователь имеет к нему доступ
 *
 * @param {Object} options
 * @param {string} options.identityId - ID пользователя
 * @param {string|null} options.tenantSlug - Slug тенанта из заголовка (опционально)
 * @param {string|null} options.tenantIdFromToken - tenantId из JWT токена (опционально)
 * @returns {Promise<{tenantId: string, tenant: Object}|null>} - Валидный tenant или null
 */
export const resolveAndValidateTenant = async ({
  identityId,
  tenantSlug = null,
  tenantIdFromToken = null
}) => {
  // Приоритет 1: tenantSlug из заголовка X-Tenant-Slug
  if (tenantSlug) {
    const tenant = await prisma.tenant.findUnique({
      where: { domain: tenantSlug },
      select: { id: true, name: true, domain: true },
    });

    if (tenant) {
      // Проверяем доступ пользователя к этому тенанту
      const membership = await prisma.membership.findUnique({
        where: {
          identityId_tenantId: {
            identityId,
            tenantId: tenant.id,
          },
        },
      });

      if (membership) {
        return { tenantId: tenant.id, tenant };
      }
    }
  }

  // Приоритет 2: tenantId из JWT токена (с проверкой доступа)
  if (tenantIdFromToken) {
    const membership = await prisma.membership.findUnique({
      where: {
        identityId_tenantId: {
          identityId,
          tenantId: tenantIdFromToken,
        },
      },
      include: {
        tenant: {
          select: { id: true, name: true, domain: true },
        },
      },
    });

    if (membership && membership.tenant) {
      return { tenantId: membership.tenantId, tenant: membership.tenant };
    }
  }

  // Приоритет 3: Первый доступный tenant пользователя
  const firstMembership = await prisma.membership.findFirst({
    where: { identityId },
    include: {
      tenant: {
        select: { id: true, name: true, domain: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  if (firstMembership && firstMembership.tenant) {
    return {
      tenantId: firstMembership.tenantId,
      tenant: firstMembership.tenant
    };
  }

  // Если ничего не найдено - возвращаем null
  return null;
};

/**
 * Middleware для определения tenantId из заголовка X-Tenant-Slug
 * Перезаписывает req.user.tenantId, если slug указан в заголовке
 * Гарантирует, что req.user.tenantId всегда валиден
 */
export const resolveTenantFromHeader = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return next();
    }

    const tenantSlug = req.headers["x-tenant-slug"];
    const tenantIdFromToken = req.user.tenantId;

    // Резолвим и валидируем tenant
    const result = await resolveAndValidateTenant({
      identityId: req.user.id,
      tenantSlug,
      tenantIdFromToken,
    });

    if (result) {
      // Обновляем tenantId в req.user
      req.user.tenantId = result.tenantId;
      req.user.currentTenant = result.tenant; // Дополнительно сохраняем объект tenant

      if (tenantSlug && result.tenantId) {
        console.log(`✅ Tenant resolved from header: ${tenantSlug} -> ${result.tenantId}`);
      } else if (result.tenantId) {
        console.log(`✅ Tenant resolved from fallback: ${result.tenantId}`);
      }
    } else {
      // Если tenant не найден - оставляем null, но логируем предупреждение
      console.warn(`⚠️ No valid tenant found for user ${req.user.id}`);
      req.user.tenantId = null;
    }

    next();
  } catch (error) {
    console.error("Error resolving tenant from header:", error);
    // В случае ошибки продолжаем с tenantId из токена (или null)
    next();
  }
};
