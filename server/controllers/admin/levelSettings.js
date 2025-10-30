import prisma from "../../prisma/client.js";

// Получить все настройки уровней с учетом tenantId (фолбек на глобальные)
export const getLevelSettings = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId ?? null;

    // Глобальные дефолты (tenantId = null)
    const [globalLevels, globalAppSettings] = await Promise.all([
      prisma.levelSetting.findMany({ where: { tenantId: null }, orderBy: { levelOrder: "asc" } }),
      prisma.appSetting.findMany({ where: { tenantId: null } }),
    ]);

    // Оверрайды текущего тенанта (если есть tenantId)
    const [tenantLevels, tenantAppSettings] = await Promise.all([
      tenantId
        ? prisma.levelSetting.findMany({ where: { tenantId }, orderBy: { levelOrder: "asc" } })
        : Promise.resolve([]),
      tenantId ? prisma.appSetting.findMany({ where: { tenantId } }) : Promise.resolve([]),
    ]);

    // Смержить уровни: ключ по levelOrder (или можно по levelName)
    const tenantByOrder = new Map(tenantLevels.map((l) => [l.levelOrder, l]));
    const mergedLevels = globalLevels.map((g) => tenantByOrder.get(g.levelOrder) || g);
    // Добавить уровни, которых нет в глобальных, но есть в тенантных
    tenantLevels.forEach((t) => {
      if (!mergedLevels.some((l) => l.levelOrder === t.levelOrder)) {
        mergedLevels.push(t);
      }
    });
    mergedLevels.sort((a, b) => a.levelOrder - b.levelOrder);

    // Смержить appSettings: приоритет у tenant, иначе глобальные
    const appSettingsMap = new Map();
    globalAppSettings.forEach((s) => appSettingsMap.set(s.key, s.value));
    tenantAppSettings.forEach((s) => appSettingsMap.set(s.key, s.value));
    const appSettingsObject = Object.fromEntries(appSettingsMap.entries());

    res.json({
      levelSettings: mergedLevels,
      appSettings: appSettingsObject,
    });
  } catch (error) {
    console.error("Error fetching level settings:", error);
    res.status(500).json({ error: "Failed to fetch level settings" });
  }
};

// Обновить настройки уровней
export const updateLevelSettings = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId ?? null;
    if (!tenantId) {
      return res.status(400).json({ error: "Missing tenantId in user context" });
    }

    const { levelSettings = [], appSettings = {} } = req.body || {};

    await prisma.$transaction(async (tx) => {
      // Уровни: upsert по составному ключу (tenantId, levelName)
      for (const raw of levelSettings) {
        const data = {
          tenantId,
          levelName: String(raw.levelName),
          levelOrder: Number(raw.levelOrder),
          requiredAmount: Number(raw.requiredAmount),
          isActive: Boolean(raw.isActive),
        };

        await tx.levelSetting.upsert({
          where: { tenantId_levelName: { tenantId, levelName: data.levelName } },
          update: {
            levelOrder: data.levelOrder,
            requiredAmount: data.requiredAmount,
            isActive: data.isActive,
          },
          create: data,
        });
      }

      // App settings: upsert по (tenantId, key)
      for (const [key, value] of Object.entries(appSettings)) {
        await tx.appSetting.upsert({
          where: { tenantId_key: { tenantId, key } },
          update: { value: String(value) },
          create: { tenantId, key, value: String(value) },
        });
      }
    });

    res.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating level settings:", error);
    res.status(500).json({ error: "Failed to update level settings" });
  }
};

// Создать новый уровень
export const createLevel = async (req, res) => {
  try {
    const { levelName, levelOrder, requiredAmount } = req.body;
    
    const newLevel = await prisma.levelSetting.create({
      data: {
        levelName,
        levelOrder,
        requiredAmount,
        isActive: true
      }
    });
    
    res.json(newLevel);
  } catch (error) {
    console.error('Error creating level:', error);
    res.status(500).json({ error: 'Failed to create level' });
  }
};

// Удалить уровень
export const deleteLevel = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.levelSetting.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ success: true, message: 'Level deleted successfully' });
  } catch (error) {
    console.error('Error deleting level:', error);
    res.status(500).json({ error: 'Failed to delete level' });
  }
};

