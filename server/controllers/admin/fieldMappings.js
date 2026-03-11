import prisma from "../../prisma/client.js";

/**
 * GET /api/admin/field-mappings
 * Получить все маппинги тенанта
 */
export const getFieldMappings = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    const mappings = await prisma.tenantFieldMapping.findMany({
      where: {
        tenantId: tenantId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ mappings });
  } catch (error) {
    console.error("Get field mappings error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/**
 * GET /api/admin/field-mappings/fields
 * Получить список доступных полей для маппинга
 */
export const getAvailableFields = async (req, res) => {
  try {
    const fields = [
      { value: "orderId", label: "Order ID", type: "string" },
      { value: "travelDate", label: "Travel Date", type: "date" },
      { value: "bookingDate", label: "Booking Date", type: "date" },
      { value: "customerFirstName", label: "Customer First Name", type: "string" },
      { value: "customerLastName", label: "Customer Last Name", type: "string" },
      { value: "customerEmail", label: "Customer Email", type: "string" },
      { value: "affiliateId", label: "Affiliate ID", type: "string" },
      { value: "couponCode", label: "Coupon Code", type: "string" },
      { value: "travellerAmount", label: "Traveller Amount", type: "number" },
      { value: "totalPrice", label: "Total Price", type: "number" },
      { value: "orderStatus", label: "Order Status", type: "string" },
      { value: "currency", label: "Currency", type: "string" },
    ];

    res.json({ fields });
  } catch (error) {
    console.error("Get available fields error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/**
 * POST /api/admin/field-mappings
 * Создать новый маппинг
 */
export const createFieldMapping = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId;
    const { incomingField, targetField, description } = req.body;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    if (!incomingField || !targetField) {
      return res.status(400).json({ message: "incomingField and targetField are required" });
    }

    // Проверяем, не существует ли уже такой маппинг
    const existing = await prisma.tenantFieldMapping.findUnique({
      where: {
        tenantId_incomingField: {
          tenantId: tenantId,
          incomingField: incomingField,
        },
      },
    });

    if (existing) {
      return res.status(409).json({ message: "Mapping with this incoming field already exists" });
    }

    const mapping = await prisma.tenantFieldMapping.create({
      data: {
        tenantId: tenantId,
        incomingField: incomingField,
        targetField: targetField,
        description: description || null,
        isActive: true,
      },
    });

    res.status(201).json({
      message: "Field mapping created successfully",
      mapping,
    });
  } catch (error) {
    console.error("Create field mapping error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/**
 * PUT /api/admin/field-mappings/:id
 * Обновить маппинг
 */
export const updateFieldMapping = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;
    const { incomingField, targetField, description, isActive } = req.body;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    // Проверяем, что маппинг принадлежит текущему тенанту
    const existing = await prisma.tenantFieldMapping.findUnique({
      where: { id },
    });

    if (!existing || existing.tenantId !== tenantId) {
      return res.status(404).json({ message: "Field mapping not found" });
    }

    // Если меняется incomingField, проверяем уникальность
    if (incomingField && incomingField !== existing.incomingField) {
      const duplicate = await prisma.tenantFieldMapping.findUnique({
        where: {
          tenantId_incomingField: {
            tenantId: tenantId,
            incomingField: incomingField,
          },
        },
      });

      if (duplicate) {
        return res.status(409).json({ message: "Mapping with this incoming field already exists" });
      }
    }

    const updateData = {};
    if (incomingField !== undefined) updateData.incomingField = incomingField;
    if (targetField !== undefined) updateData.targetField = targetField;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await prisma.tenantFieldMapping.update({
      where: { id },
      data: updateData,
    });

    res.json({
      message: "Field mapping updated successfully",
      mapping: updated,
    });
  } catch (error) {
    console.error("Update field mapping error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/**
 * DELETE /api/admin/field-mappings/:id
 * Удалить маппинг
 */
export const deleteFieldMapping = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    // Проверяем, что маппинг принадлежит текущему тенанту
    const existing = await prisma.tenantFieldMapping.findUnique({
      where: { id },
    });

    if (!existing || existing.tenantId !== tenantId) {
      return res.status(404).json({ message: "Field mapping not found" });
    }

    await prisma.tenantFieldMapping.delete({
      where: { id },
    });

    res.json({ message: "Field mapping deleted successfully" });
  } catch (error) {
    console.error("Delete field mapping error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

