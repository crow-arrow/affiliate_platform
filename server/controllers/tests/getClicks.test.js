import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserClicks } from "../getClicks.js";

// Создаем объект для хранения моков
const mocks = {
  identityFindUnique: vi.fn(),
  membershipFindUnique: vi.fn(),
  membershipCreate: vi.fn(),
  profileUpsert: vi.fn(),
  clicksFindMany: vi.fn(),
};

vi.mock("../../prisma/client.js", () => ({
  default: {
    identity: {
      get findUnique() {
        return mocks.identityFindUnique;
      },
    },
    membership: {
      get findUnique() {
        return mocks.membershipFindUnique;
      },
      get create() {
        return mocks.membershipCreate;
      },
    },
    partnerProfile: {
      get upsert() {
        return mocks.profileUpsert;
      },
    },
    clicksData: {
      get findMany() {
        return mocks.clicksFindMany;
      },
    },
  },
}));

describe("getUserClicks", () => {
  const mockReq = { user: { id: "identity_id", tenantId: "tenant_id" } };
  const mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Настройка моков для успешного сценария
    mocks.identityFindUnique.mockResolvedValue({
      email: "test@test.com",
      firstName: "Test",
      lastName: "User",
    });
    mocks.membershipFindUnique.mockResolvedValue({
      id: "membership_id",
      profile: { affiliateId: "aff123" },
    });
    mocks.profileUpsert.mockResolvedValue({ affiliateId: "aff123" });
  });

  it("should return clicks for a valid user", async () => {
    const mockClicks = [{ id: BigInt(101), referralProfileId: "profile_id" }, { id: BigInt(102), referralProfileId: "profile_id" }];

    mocks.profileUpsert.mockResolvedValue({ id: "profile_id", affiliateId: "aff123" });
    mocks.clicksFindMany.mockResolvedValue(mockClicks);

    await getUserClicks(mockReq, mockRes);

    expect(mocks.clicksFindMany).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith({
      clicks: [
        { id: "101", referralProfileId: "profile_id" },
        { id: "102", referralProfileId: "profile_id" },
      ],
    });
  });

  it("should return 400 if identity or tenant is missing", async () => {
    const mockReqNoUser = { user: {} };

    await getUserClicks(mockReqNoUser, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Missing identity or tenant in request",
    });
  });

  it("should return 500 on error", async () => {
    const error = new Error("DB error");

    mocks.identityFindUnique.mockRejectedValue(error);

    await getUserClicks(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "DB error",
    });
  });
});
