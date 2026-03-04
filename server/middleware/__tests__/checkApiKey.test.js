import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkApiKey } from "../checkApiKey.js";

// Создаем объект для хранения моков
const mocks = {
  findUnique: vi.fn(),
};

vi.mock("../../prisma/client.js", () => ({
  default: {
    tenantApiKey: {
      get findUnique() {
        return mocks.findUnique;
      },
    },
  },
}));

describe("checkApiKey middleware", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  it("should return 401 if API key is missing", async () => {
    await checkApiKey(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "API key is required",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if API key is invalid", async () => {
    mockReq.headers["x-api-key"] = "invalid_key";
    mocks.findUnique.mockResolvedValue(null);

    await checkApiKey(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid or inactive API key",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next() if API key is valid", async () => {
    const mockApiKey = {
      id: "key_id",
      apiKey: "valid_key",
      tenantId: "tenant_id",
      isActive: true,
      tenant: {
        id: "tenant_id",
        name: "Test Tenant",
      },
    };

    mockReq.headers["x-api-key"] = "valid_key";
    mocks.findUnique.mockResolvedValue(mockApiKey);

    await checkApiKey(mockReq, mockRes, mockNext);

    expect(mockReq.tenantId).toBe("tenant_id");
    expect(mockReq.tenant).toEqual(mockApiKey.tenant);
    expect(mockReq.apiKey).toEqual(mockApiKey);
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it("should accept API key from Authorization header", async () => {
    const mockApiKey = {
      id: "key_id",
      apiKey: "valid_key",
      tenantId: "tenant_id",
      isActive: true,
      tenant: {
        id: "tenant_id",
        name: "Test Tenant",
      },
    };

    mockReq.headers.authorization = "Bearer valid_key";
    mocks.findUnique.mockResolvedValue(mockApiKey);

    await checkApiKey(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
