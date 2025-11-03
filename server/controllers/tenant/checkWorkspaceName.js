import prisma from "../../prisma/client.js";

// GET /api/tenant/check-name?name=CompanyName
// Проверяет, доступно ли название workspace
export const checkWorkspaceName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        available: false,
        message: "Workspace name is required",
      });
    }

    const workspaceName = name.trim();

    // Проверяем, существует ли tenant с таким именем
    const existingTenant = await prisma.tenant.findFirst({
      where: {
        name: workspaceName,
      },
    });

    if (existingTenant) {
      return res.status(200).json({
        available: false,
        message: "This workspace name is already taken",
      });
    }

    return res.status(200).json({
      available: true,
      message: "Workspace name is available",
    });
  } catch (error) {
    console.error("checkWorkspaceName error:", error);
    return res.status(500).json({
      available: false,
      message: "Failed to check workspace name",
    });
  }
};
