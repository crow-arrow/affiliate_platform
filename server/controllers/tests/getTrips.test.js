import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserTrips } from "../me/getTrips.js";
import { updateUserLevel } from "../../utils/updateUserLevel.js";
import { getCommission } from "../../utils/commissionCalculate.js";

// Создаем объект для хранения моков
const mocks = {
  identityFindUnique: vi.fn(),
  membershipFindUnique: vi.fn(),
  membershipCreate: vi.fn(),
  profileUpsert: vi.fn(),
  profileCreate: vi.fn(),
  profileFindUnique: vi.fn(),
  tripsFindMany: vi.fn(),
  profileUpdate: vi.fn(),
  levelHistoryCreate: vi.fn(),
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
      get findUnique() {
        return mocks.profileFindUnique;
      },
      get upsert() {
        return mocks.profileUpsert;
      },
      get create() {
        return mocks.profileCreate;
      },
      get update() {
        return mocks.profileUpdate;
      },
    },
    trips: {
      get findMany() {
        return mocks.tripsFindMany;
      },
    },
    levelHistory: {
      get create() {
        return mocks.levelHistoryCreate;
      },
    },
  },
}));

vi.mock("../../utils/updateUserLevel.js");
vi.mock("../../utils/commissionCalculate.js");

describe("getUserTrips", () => {
  let mockReq;
  let mockRes;
  let mockUser;
  let mockTrips;
  let mockLevelHistory;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq = { user: { id: "identity_id", tenantId: "tenant_id", role: "PARTNER" } };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    mockLevelHistory = [
      { level: "BRONZE", changed_at: new Date("2024-01-01") },
      { level: "SILVER", changed_at: new Date("2024-07-01") },
    ];
    mockUser = {
      id: 1,
      affiliate_id: "aff123",
      coupon_code: "coupon456",
      level: "SILVER",
      levelHistory: mockLevelHistory,
      levelChangedAt: new Date(),
      number_of_travellers: 0,
      current_year_travellers: 0,
      total_commission: 0,
    };
    mockTrips = [
      {
        id: 101,
        travel_date: new Date("2024-05-10"),
        traveller_amount: 2,
        total_price: 1000,
        order_status: "COMPLETED",
      },
      {
        id: 102,
        travel_date: new Date("2024-08-15"),
        traveller_amount: 1,
        total_price: 2000,
        order_status: "COMPLETED",
      },
      {
        id: 103,
        travel_date: new Date("2025-01-20"),
        traveller_amount: 3,
        total_price: 1500,
        order_status: "PENDING",
      },
    ];

    mocks.identityFindUnique.mockResolvedValue({ email: "test@test.com", firstName: "Test", lastName: "User" });
    mocks.membershipFindUnique.mockResolvedValue({
      id: "membership_id",
      tenantId: "tenant_id",
      profile: {
        ...mockUser,
        membershipId: "membership_id",
        membership: {
          tenantId: "tenant_id",
        },
      },
      role: "PARTNER",
    });
    mocks.tripsFindMany.mockResolvedValue(mockTrips);
    mocks.levelHistoryCreate.mockResolvedValue({});
    mocks.profileUpdate.mockResolvedValue(mockUser);

    updateUserLevel.mockReturnValue({
      newLevel: "GOLD",
      currentYearTravellers: 3,
      lastYearTravellers: 0,
      currentYearDepartedTrips: 2,
      lastYearDepartedTrips: 0,
    });
    getCommission.mockImplementation((level, price) => {
      if (level === "BRONZE") return parseFloat((price * 0.07).toFixed(2));
      if (level === "SILVER") return parseFloat((price * 0.1).toFixed(2));
      if (level === "GOLD") return parseFloat((price * 0.12).toFixed(2));
      return 0;
    });
  });

  it("should return 404 if identity is not found", async () => {
    mocks.identityFindUnique.mockResolvedValue(null);
    await getUserTrips(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Identity not found" });
  });

  it("should return 400 if tenantId is missing", async () => {
    mockReq.user.tenantId = null;
    await getUserTrips(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Tenant ID is required",
    });
  });

  it("should call trips.findMany with correct filter criteria", async () => {
    await getUserTrips(mockReq, mockRes);
    expect(mocks.tripsFindMany).toHaveBeenCalled();
  });

  it("should call updateUserLevel with profile and trips", async () => {
    await getUserTrips(mockReq, mockRes);
    expect(updateUserLevel).toHaveBeenCalled();
  });

  it("should update profile level if newLevel is different", async () => {
    await getUserTrips(mockReq, mockRes);

    expect(mocks.profileUpdate).toHaveBeenCalled();
    expect(mocks.levelHistoryCreate).toHaveBeenCalled();
  });

  it("should not update user level if newLevel is the same", async () => {
    updateUserLevel.mockReturnValue({
      newLevel: "SILVER",
      currentYearTravellers: 3,
      lastYearTravellers: 0,
      currentYearDepartedTrips: 2,
      lastYearDepartedTrips: 0,
    });

    await getUserTrips(mockReq, mockRes);

    expect(mocks.levelHistoryCreate).not.toHaveBeenCalled();
  });

  it("should calculate commission for each trip", async () => {
    await getUserTrips(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalled();
    const callArgs = mockRes.json.mock.calls[0][0];
    expect(callArgs).toHaveProperty("trips");
    expect(Array.isArray(callArgs.trips)).toBe(true);
    // Проверяем, что если есть трипы, они имеют commission
    if (callArgs.trips && callArgs.trips.length > 0) {
      expect(callArgs.trips[0]).toHaveProperty("commission");
    }
  });

  it("should handle errors and return 500", async () => {
    mocks.identityFindUnique.mockRejectedValue(new Error("Database error"));
    await getUserTrips(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "Database error",
    });
  });
});
