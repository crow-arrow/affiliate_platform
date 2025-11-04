import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getFieldMappings,
  getAvailableFields,
  createFieldMapping,
  updateFieldMapping,
  deleteFieldMapping,
} from "../fieldMappings.js";

const mockPrisma = {
  tenantFieldMapping: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

vi.mock("../../../prisma/client.js", () => ({
  default: mockPrisma,
}));

describe("Field Mappings Controllers", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      user: {
        tenantId: "tenant_id",
      },
      body: {},
      params: {},
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    vi.clearAllMocks();
  });

  describe("getFieldMappings", () => {
    it("should return all field mappings for tenant", async () => {
      const mockMappings = [
        {
          id: "1",
          incomingField: "travel_date",
          targetField: "travelDate",
          isActive: true,
        },
      ];

      mockPrisma.tenantFieldMapping.findMany.mockResolvedValue(mockMappings);

      await getFieldMappings(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ mappings: mockMappings });
    });
  });

  describe("getAvailableFields", () => {
    it("should return list of available fields", async () => {
      await getAvailableFields(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        fields: expect.arrayContaining([
          expect.objectContaining({
            value: "travelDate",
            label: "Travel Date",
            type: "date",
          }),
        ]),
      });
    });
  });

  describe("createFieldMapping", () => {
    it("should create new field mapping", async () => {
      mockReq.body = {
        incomingField: "travel_date",
        targetField: "travelDate",
        description: "Travel date mapping",
      };

      const mockMapping = {
        id: "new_id",
        ...mockReq.body,
        tenantId: "tenant_id",
        isActive: true,
      };

      mockPrisma.tenantFieldMapping.findUnique.mockResolvedValue(null);
      mockPrisma.tenantFieldMapping.create.mockResolvedValue(mockMapping);

      await createFieldMapping(mockReq, mockRes);

      expect(mockPrisma.tenantFieldMapping.create).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Field mapping created successfully",
        mapping: mockMapping,
      });
    });

    it("should return 409 if mapping already exists", async () => {
      mockReq.body = {
        incomingField: "travel_date",
        targetField: "travelDate",
      };

      mockPrisma.tenantFieldMapping.findUnique.mockResolvedValue({
        id: "existing_id",
      });

      await createFieldMapping(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Mapping with this incoming field already exists",
      });
    });

    it("should return 400 if required fields missing", async () => {
      mockReq.body = {
        incomingField: "travel_date",
        // Missing targetField
      };

      await createFieldMapping(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe("updateFieldMapping", () => {
    it("should update field mapping", async () => {
      mockReq.params = { id: "mapping_id" };
      mockReq.body = {
        incomingField: "trip_date",
        targetField: "travelDate",
        isActive: false,
      };

      const existing = {
        id: "mapping_id",
        tenantId: "tenant_id",
        incomingField: "travel_date",
      };

      const updated = {
        ...existing,
        ...mockReq.body,
      };

      mockPrisma.tenantFieldMapping.findUnique
        .mockResolvedValueOnce(existing)
        .mockResolvedValueOnce(null);
      mockPrisma.tenantFieldMapping.update.mockResolvedValue(updated);

      await updateFieldMapping(mockReq, mockRes);

      expect(mockPrisma.tenantFieldMapping.update).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Field mapping updated successfully",
        mapping: updated,
      });
    });
  });

  describe("deleteFieldMapping", () => {
    it("should delete field mapping", async () => {
      mockReq.params = { id: "mapping_id" };

      const existing = {
        id: "mapping_id",
        tenantId: "tenant_id",
      };

      mockPrisma.tenantFieldMapping.findUnique.mockResolvedValue(existing);
      mockPrisma.tenantFieldMapping.delete.mockResolvedValue(existing);

      await deleteFieldMapping(mockReq, mockRes);

      expect(mockPrisma.tenantFieldMapping.delete).toHaveBeenCalledWith({
        where: { id: "mapping_id" },
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Field mapping deleted successfully",
      });
    });
  });
});

