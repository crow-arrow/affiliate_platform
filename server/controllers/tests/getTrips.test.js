import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserTrips } from "../me/getTrips.js";
import { updateUserLevel } from "../../utils/updateUserLevel.js";
import { getCommission } from "../../utils/commissionCalculate.js";

// Mock Prisma client
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  trips: {
    findMany: vi.fn(),
  },
  levelHistory: {
    create: vi.fn(),
  },
};

vi.mock("../../prisma/client.js", () => ({
  default: mockPrisma,
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
    mockReq = { user: { id: 1, role: "GENIE" } };
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

    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.trips.findMany.mockResolvedValue(mockTrips);
    mockPrisma.levelHistory.create.mockResolvedValue({});
    mockPrisma.user.update.mockResolvedValue(mockUser);
    
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

  it("should return 404 if user is not found", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await getUserTrips(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 400 if user has no valid affiliate_id or coupon_code", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      ...mockUser,
      affiliate_id: null,
      coupon_code: null,
      levelHistory: [],
    });
    await getUserTrips(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "User has no valid affiliate_id or coupon_code",
    });
  });

  it("should call trips.findMany with correct filter criteria", async () => {
    await getUserTrips(mockReq, mockRes);
    expect(mockPrisma.trips.findMany).toHaveBeenCalledWith({
      where: {
        OR: [{ affiliate_id: "aff123" }, { coupon_code: "coupon456" }],
      },
    });
  });

  it("should call updateUserLevel with user and trips", async () => {
    await getUserTrips(mockReq, mockRes);
    expect(updateUserLevel).toHaveBeenCalledWith(mockUser, mockTrips);
  });

  it("should update user level if newLevel is different", async () => {
    await getUserTrips(mockReq, mockRes);
    
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: {
        level: "GOLD",
        levelChangedAt: expect.any(Date),
      },
    });

    expect(mockPrisma.levelHistory.create).toHaveBeenCalledWith({
      data: {
        user_id: mockUser.id,
        level: "GOLD",
        changed_at: expect.any(Date),
      },
    });
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
    
    expect(mockPrisma.levelHistory.create).not.toHaveBeenCalled();
  });

  it("should calculate commission for each trip", async () => {
    await getUserTrips(mockReq, mockRes);
    
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        trips: expect.arrayContaining([
          expect.objectContaining({
            commission: expect.any(Number),
            level_used: expect.any(String),
            isCompleted: expect.any(Boolean),
            isCanceled: expect.any(Boolean),
          }),
        ]),
      })
    );
  });

  it("should handle errors and return 500", async () => {
    mockPrisma.user.findUnique.mockRejectedValue(new Error("Database error"));
    await getUserTrips(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "Database error",
    });
  });
});
