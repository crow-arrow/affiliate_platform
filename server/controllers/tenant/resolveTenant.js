import prisma from "../../prisma/client.js";

const getSubdomain = (host, rootDomain) => {
  if (!host) return null;
  const lower = String(host).toLowerCase();
  const withoutPort = lower.split(":")[0];
  if (!rootDomain) return null;
  if (withoutPort === rootDomain) return null;
  if (!withoutPort.endsWith(rootDomain)) return null;
  const sub = withoutPort.slice(0, -rootDomain.length).replace(/\.$/, "");
  return sub || null;
};

export const resolveTenant = async (req, res) => {
  try {
    const { slug } = req.query;
    const rootDomain = process.env.ROOT_DOMAIN || "localhost"; // e.g. myapp.com
    const fromHost = getSubdomain(req.headers.host, rootDomain);

    const searchTerm = (slug || fromHost || "").trim().toLowerCase();
    if (!searchTerm) {
      return res.status(400).json({ message: "Tenant slug is required" });
    }

    // Ищем tenant: сначала по точному совпадению domain, затем по slug (первая часть domain до точки)
    let tenant = await prisma.tenant.findUnique({
      where: { domain: searchTerm },
    });

    // Если не найден по точному domain, ищем по slug (первая часть domain до точки)
    if (!tenant) {
      // Добавляем возможные доменные расширения для поиска
      const possibleDomains = [
        searchTerm, // "jinn-travel"
        `${searchTerm}.com`, // "jinn-travel.com"
        `${searchTerm}.ai`, // "jinn-travel.ai"
        `${searchTerm}.net`, // "jinn-travel.net"
      ];

      // Ищем по каждому варианту
      for (const domain of possibleDomains) {
        tenant = await prisma.tenant.findUnique({ where: { domain } });
        if (tenant) break;
      }

      // Если все еще не найден, ищем по части domain (starts with)
      if (!tenant) {
        const tenants = await prisma.tenant.findMany({
          where: {
            domain: {
              startsWith: searchTerm,
            },
          },
        });
        // Берем первый найденный или тот, у которого domain начинается с searchTerm + "."
        tenant =
          tenants.find((t) => t.domain.startsWith(searchTerm + ".")) ||
          tenants[0];
      }
    }

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Возвращаем slug (первая часть domain до точки)
    const tenantSlug = tenant.domain.split(".")[0];

    return res.json({
      id: tenant.id,
      name: tenant.name,
      domain: tenant.domain,
      slug: tenantSlug,
    });
  } catch (error) {
    console.error("resolveTenant error:", error);
    return res.status(500).json({ message: "Failed to resolve tenant" });
  }
};
