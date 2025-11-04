import prisma from "../prisma/client.js";

/**
 * Middleware для определения tenantId из заголовка X-Tenant-Slug
 * Перезаписывает req.user.tenantId, если slug указан в заголовке
 */
export const resolveTenantFromHeader = async (req, res, next) => {
  try {
    // Получаем tenantSlug из заголовка X-Tenant-Slug
    const tenantSlug = req.headers["x-tenant-slug"];

    // Если slug не указан, используем tenantId из токена (как раньше)
    if (!tenantSlug) {
      return next();
    }

    // Ищем tenant по slug
    const tenant = await prisma.tenant.findUnique({
      where: {
        domain: tenantSlug,
      },
      select: {
        id: true,
        name: true,
        domain: true,
      },
    });

    if (!tenant) {
      // Если tenant не найден, используем tenantId из токена
      console.warn(`Tenant not found for slug: ${tenantSlug}`);
      return next();
    }

    // Проверяем, что пользователь имеет доступ к этому тенанту
    if (req.user?.id) {
      const membership = await prisma.membership.findUnique({
        where: {
          identityId_tenantId: {
            identityId: req.user.id,
            tenantId: tenant.id,
          },
        },
      });

      if (!membership) {
        // Если у пользователя нет доступа к этому тенанту, используем tenantId из токена
        console.warn(
          `User ${req.user.id} does not have access to tenant ${tenant.id} (${tenantSlug})`
        );
        return next();
      }
    }

    // Перезаписываем tenantId в req.user
    if (req.user) {
      req.user.tenantId = tenant.id;
      console.log(`Tenant resolved from header: ${tenantSlug} -> ${tenant.id}`);
    }

    next();
  } catch (error) {
    console.error("Error resolving tenant from header:", error);
    // В случае ошибки продолжаем с tenantId из токена
    next();
  }
};
