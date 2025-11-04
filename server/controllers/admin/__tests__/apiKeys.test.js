import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getApiKeys,
  createApiKey,
  updateApiKey,
  deleteApiKey,
} from "../apiKeys.js";

const mockPrisma = {
  tenantApiKey: {
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

describe("API Keys Controllers", () => {
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

  describe("getApiKeys", () => {
    it("should return all API keys for tenant", async () => {
      const mockKeys = [
        { id: "1", apiKey: "ak_123", name: "Key 1", isActive: true },
        { id: "2", apiKey: "ak_456", name: "Key 2", isActive: false },
      ];

      mockPrisma.tenantApiKey.findMany.mockResolvedValue(mockKeys);

      await getApiKeys(mockReq, mockRes);

      expect(mockPrisma.tenantApiKey.findMany).toHaveBeenCalledWith({
        where: { tenantId: "tenant_id" },
        orderBy: { createdAt: "desc" },
      });
      expect(mockRes.json).toHaveBeenCalledWith({ apiKeys: mockKeys });
    });

    it("should return 400 if tenantId is missing", async () => {
      mockReq.user = {};

      await getApiKeys(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Tenant ID is required",
      });
    });
  });

  describe("createApiKey", () => {
    it("should create new API key", async () => {
      mockReq.body = { name: "Test Key" };

      const mockKey = {
        id: "new_id",
        apiKey: "ak_generated",
        name: "Test Key",
        isActive: true,
        tenantId: "tenant_id",
      };

      mockPrisma.tenantApiKey.create.mockResolvedValue(mockKey);

      await createApiKey(mockReq, mockRes);

      expect(mockPrisma.tenantApiKey.create).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "API key created successfully",
        apiKey: mockKey,
      });
    });

    it("should use default name if not provided", async () => {
      mockReq.body = {};

      const mockKey = {
        id: "new_id",
        apiKey: "ak_generated",
        name: "API Key",
        isActive: true,
      };

      mockPrisma.tenantApiKey.create.mockResolvedValue(mockKey);

      await createApiKey(mockReq, mockRes);

      expect(mockPrisma.tenantApiKey.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: "API Key",
        }),
      });
    });
  });

  describe("updateApiKey", () => {
    it("should update API key", async () => {
      mockReq.params = { id: "key_id" };
      mockReq.body = { name: "Updated Name", isActive: false };

      const existingKey = {
        id: "key_id",
        tenantId: "tenant_id",
      };

      const updatedKey = {
        ...existingKey,
        name: "Updated Name",
        isActive: false,
      };

      mockPrisma.tenantApiKey.findUnique.mockResolvedValue(existingKey);
      mockPrisma.tenantApiKey.update.mockResolvedValue(updatedKey);

      await updateApiKey(mockReq, mockRes);

      expect(mockPrisma.tenantApiKey.update).toHaveBeenCalledWith({
        where: { id: "key_id" },
        data: { name: "Updated Name", isActive: false },
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "API key updated successfully",
        apiKey: updatedKey,
      });
    });

    it("should return 404 if key not found", async () => {
      mockReq.params = { id: "key_id" };
      mockPrisma.tenantApiKey.findUnique.mockResolvedValue(null);

      await updateApiKey(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "API key not found",
      });
    });
  });

  describe("deleteApiKey", () => {
    it("should delete API key", async () => {
      mockReq.params = { id: "key_id" };

      const existingKey = {
        id: "key_id",
        tenantId: "tenant_id",
      };

      mockPrisma.tenantApiKey.findUnique.mockResolvedValue(existingKey);
      mockPrisma.tenantApiKey.delete.mockResolvedValue(existingKey);

      await deleteApiKey(mockReq, mockRes);

      expect(mockPrisma.tenantApiKey.delete).toHaveBeenCalledWith({
        where: { id: "key_id" },
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "API key deleted successfully",
      });
    });
  });
});

