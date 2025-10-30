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

    const domain = (slug || fromHost || "").trim().toLowerCase();
    if (!domain) {
      return res.status(400).json({ message: "Tenant slug is required" });
    }

    const tenant = await prisma.tenant.findUnique({ where: { domain } });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    return res.json({ id: tenant.id, name: tenant.name, slug: tenant.domain });
  } catch (error) {
    console.error("resolveTenant error:", error);
    return res.status(500).json({ message: "Failed to resolve tenant" });
  }
};


