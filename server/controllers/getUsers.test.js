import { describe, it, expect, vi, beforeEach } from "vitest";
import { Op } from "sequelize";
import { getUserTrips } from "./getUsers";
import User from "../models/User";
import LevelHistory from "../models/LevelHistory";
import Trips from "../models/Trips"; // Использую "Trips", как указано в вашем коде
import { updateUserLevel } from "../utils/updateUserLevel";
import { getCommission } from "../utils/commissionCalculate"; // Использую "commissionCalculate", как указано в вашем коде

vi.mock("../models/User");
vi.mock("../models/LevelHistory");
vi.mock("../models/Trips");
vi.mock("../utils/updateUserLevel");
vi.mock("../utils/commissionCalculate");

describe("getUserTrips", () => {
  let mockReq;
  let mockRes;
  let mockUser;
  let mockTrips;
  let mockLevelHistory;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq = { userId: 1 };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    mockLevelHistory = [
      { level: "Bronze", changed_at: new Date("2024-01-01") },
      { level: "Silver", changed_at: new Date("2024-07-01") },
    ];
    mockUser = {
      id: 1,
      affiliate_id: "aff123",
      coupon_code: "coupon456",
      level: "Silver",
      levelHistory: mockLevelHistory,
      levelChangedAt: new Date(),
      levelYear: 2024,
      number_of_travellers: 0,
      current_year_travellers: 0,
      total_commission: 0,
      save: vi.fn().mockResolvedValue(mockUser),
    };
    mockTrips = [
      {
        id: 101,
        travel_date: new Date("2024-05-10"),
        traveller_amount: 2,
        total_price: 1000,
        toJSON: function () {
          return {
            id: this.id,
            travel_date: this.travel_date,
            traveller_amount: this.traveller_amount,
            total_price: this.total_price,
          };
        },
      },
      {
        id: 102,
        travel_date: new Date("2024-08-15"),
        traveller_amount: 1,
        total_price: 2000,
        toJSON: function () {
          return {
            id: this.id,
            travel_date: this.travel_date,
            traveller_amount: this.traveller_amount,
            total_price: this.total_price,
          };
        },
      },
      {
        id: 103,
        travel_date: new Date("2025-01-20"),
        traveller_amount: 3,
        total_price: 1500,
        toJSON: function () {
          return {
            id: this.id,
            travel_date: this.travel_date,
            traveller_amount: this.traveller_amount,
            total_price: this.total_price,
          };
        },
      },
    ];

    vi.spyOn(User, "findByPk").mockResolvedValue(mockUser);
    vi.spyOn(Trips, "findAll").mockResolvedValue(mockTrips);
    vi.spyOn(LevelHistory, "create").mockResolvedValue({});
    updateUserLevel.mockReturnValue({
      newLevel: "Gold",
      currentYearTravellers: 3,
      lastYearTravellers: 0,
      currentYearDepartedTrips: 2,
      lastYearDepartedTrips: 0,
    });
    getCommission.mockImplementation((level, price) => {
      if (level === "Bronze") return parseFloat((price * 0.07).toFixed(2));
      if (level === "Silver") return parseFloat((price * 0.1).toFixed(2));
      if (level === "Gold") return parseFloat((price * 0.12).toFixed(2));
      return 0;
    });
  });

  it("should return 404 if user is not found", async () => {
    User.findByPk.mockResolvedValue(null);
    await getUserTrips(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 400 if user has no valid affiliate_id or coupon_code", async () => {
    User.findByPk.mockResolvedValue({
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

  it("should call Trips.findAll with correct filter criteria", async () => {
    await getUserTrips(mockReq, mockRes);
    expect(Trips.findAll).toHaveBeenCalledWith({
      where: {
        [Op.or]: [{ affiliate_id: "aff123" }, { coupon_code: "coupon456" }],
      },
    });

    const mockUserWithoutAffiliate = {
      ...mockUser,
      affiliate_id: null,
      levelHistory: [],
    };
    User.findByPk.mockResolvedValue(mockUserWithoutAffiliate);
    await getUserTrips(mockReq, mockRes);
    expect(Trips.findAll).toHaveBeenCalledWith({
      where: {
        [Op.or]: [{ coupon_code: "coupon456" }],
      },
    });

    const mockUserWithoutCoupon = {
      ...mockUser,
      coupon_code: null,
      levelHistory: [],
    };
    User.findByPk.mockResolvedValue(mockUserWithoutCoupon);
    await getUserTrips(mockReq, mockRes);
    expect(Trips.findAll).toHaveBeenCalledWith({
      where: {
        [Op.or]: [{ affiliate_id: "aff123" }],
      },
    });
  });

  it("should call updateUserLevel with user and trips", async () => {
    await getUserTrips(mockReq, mockRes);
    expect(updateUserLevel).toHaveBeenCalledWith(mockUser, mockTrips);
  });

  it("should update user level and save if newLevel is different", async () => {
    // Мокируем данные уровня и дата изменения уровня
    const mockLevelHistory = [
      { level: "Bronze", changed_at: new Date("2024-01-01") },
      { level: "Silver", changed_at: new Date("2024-06-01") },
    ];

    const mockUserWithHistory = {
      ...mockUser,
      level: "Bronze", // Начальный уровень
      levelHistory: mockLevelHistory, // История уровня
      levelChangedAt: new Date(), // Дата изменения уровня
      save: vi.fn().mockResolvedValue(mockUser), // Мокируем метод save
    };

    // Обновим mockUser, чтобы использовать mockLevelHistory
    User.findByPk.mockResolvedValue(mockUserWithHistory);

    // Мокируем обновление уровня
    updateUserLevel.mockReturnValue({
      newLevel: "Gold", // Новый уровень
      currentYearTravellers: 3,
      lastYearTravellers: 20,
      currentYearDepartedTrips: 2,
      lastYearDepartedTrips: 0,
    });

    // Запускаем getUserTrips
    await getUserTrips(mockReq, mockRes);

    // Проверяем, что уровень изменен на "Gold"
    expect(mockUserWithHistory.level).toBe("Gold");

    // Проверяем, что дата уровня была обновлена
    expect(mockUserWithHistory.levelChangedAt).toBeInstanceOf(Date);

    // Проверяем, что метод save был вызван дважды (один раз для начального сохранения, второй раз для обновления уровня)
    expect(mockUserWithHistory.save).toHaveBeenCalledTimes(2);
  });

  it("should not update user level if newLevel is the same", async () => {
    updateUserLevel.mockReturnValue({
      newLevel: "Silver",
      currentYearTravellers: 3,
      lastYearTravellers: 0,
      currentYearDepartedTrips: 2,
      lastYearDepartedTrips: 0,
    });
    await getUserTrips(mockReq, mockRes);
    expect(mockUser.level).toBe("Silver");
    expect(mockUser.save).toHaveBeenCalledTimes(1); // Only initial save
  });

  it("should create a new LevelHistory record if level changes", async () => {
    await getUserTrips(mockReq, mockRes);
    expect(LevelHistory.create).toHaveBeenCalledWith({
      user_id: mockUser.id,
      level: "Gold",
      changed_at: mockUser.levelChangedAt,
    });
  });

  it("should not create a new LevelHistory record if level does not change", async () => {
    LevelHistory.create.mockClear(); // ensure previous calls don't affect the current test
    updateUserLevel.mockReturnValue({
      newLevel: mockUser.level,
      currentYearTravellers: 3,
      lastYearTravellers: 0,
      currentYearDepartedTrips: 2,
      lastYearDepartedTrips: 0,
    });
    await getUserTrips(mockReq, mockRes);
    expect(LevelHistory.create).not.toHaveBeenCalled();
  });

  it("should calculate commission for each trip based on the level at the time of travel", async () => {
    getCommission.mockImplementation((level, price) => {
      if (level === "Bronze") return parseFloat((price * 0.07).toFixed(2));
      if (level === "Silver") return parseFloat((price * 0.1).toFixed(2));
      if (level === "Gold") return parseFloat((price * 0.12).toFixed(2));
      return 0;
    });

    const mockLevelHistoryWithDates = [
      { level: "Bronze", changed_at: new Date("2024-01-01") },
      { level: "Silver", changed_at: new Date("2024-06-01") },
      { level: "Gold", changed_at: new Date("2024-09-01") },
    ];
    User.findByPk.mockResolvedValue({
      ...mockUser,
      level: "Bronze",
      levelHistory: mockLevelHistoryWithDates,
      save: vi.fn().mockResolvedValue(mockUser),
    });

    const mockTripsWithDates = [
      {
        ...mockTrips[0],
        travel_date: new Date("2024-05-10"),
        toJSON: () => ({
          ...mockTrips[0],
          travel_date: new Date("2024-05-10"),
        }),
      }, // Bronze
      {
        ...mockTrips[1],
        travel_date: new Date("2024-07-15"),
        toJSON: () => ({
          ...mockTrips[1],
          travel_date: new Date("2024-07-15"),
        }),
      }, // Silver
      {
        ...mockTrips[2],
        travel_date: new Date("2024-08-15"),
        toJSON: () => ({
          ...mockTrips[2],
          travel_date: new Date("2024-08-15"),
        }),
      }, // Silver
    ];
    Trips.findAll.mockResolvedValue(mockTripsWithDates);

    await getUserTrips(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        trips: expect.arrayContaining([
          expect.objectContaining({
            commission: 70.0,
            level_used: "Bronze",
          }), // Bronze
          expect.objectContaining({
            commission: 200.0,
            level_used: "Silver",
          }), // Silver
          expect.objectContaining({
            commission: 150.0,
            level_used: "Silver",
          }), // Silver
        ]),
        total_commission: 420,
      })
    );
  });

  it("should calculate total earned commission", async () => {
    await getUserTrips(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        total_commission: 420,
      })
    );
  });

  it("should calculate total number of travellers in departed trips", async () => {
    const RealDate = Date;
    global.Date = class extends RealDate {
      constructor(...args) {
        if (args.length === 0) {
          return new RealDate("2024-10-01T00:00:00Z");
        }
        return new RealDate(...args);
      }
      static now() {
        return new RealDate("2024-10-01T00:00:00Z").getTime();
      }
    };

    await getUserTrips(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        number_of_travellers: 3, // 2 + 1
      })
    );
    expect(mockUser.number_of_travellers).toBe(3);
    global.Date = RealDate;
  });

  it("should update user current_year_travellers", async () => {
    await getUserTrips(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        current_year_travellers: 3,
      })
    );
    expect(mockUser.current_year_travellers).toBe(3);
  });

  it("should handle errors and return 500", async () => {
    User.findByPk.mockRejectedValue(new Error("Database error"));
    await getUserTrips(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "Database error",
    });
  });

  it("should retain Gold level if earned in 2024 and no trips in current year, new trip still uses 12% commission", async () => {
    const mockLevelHistory = [
      { level: "Bronze", changed_at: new Date("2024-01-01") },
      { level: "Gold", changed_at: new Date("2024-12-31") },
    ];

    const mockUserGold = {
      ...mockUser,
      level: "Gold",
      levelYear: 2024,
      levelHistory: mockLevelHistory,
      save: vi.fn().mockResolvedValue(mockUser),
    };

    const newTrip = {
      id: 104,
      travel_date: new Date("2025-04-10"),
      traveller_amount: 2,
      total_price: 1000,
      toJSON: function () {
        return {
          id: this.id,
          travel_date: this.travel_date,
          traveller_amount: this.traveller_amount,
          total_price: this.total_price,
        };
      },
    };

    User.findByPk.mockResolvedValue(mockUserGold);
    Trips.findAll.mockResolvedValue([newTrip]);
    updateUserLevel.mockReturnValue({
      newLevel: "Gold",
      currentYearTravellers: 0,
      lastYearTravellers: 25,
      currentYearDepartedTrips: [],
      lastYearDepartedTrips: [],
    });

    await getUserTrips(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        trips: expect.arrayContaining([
          expect.objectContaining({
            commission: 120.0, // 12% of 1000
            level_used: "Gold",
          }),
        ]),
        total_commission: 120,
        number_of_travellers: 2,
        current_year_travellers: 0,
      })
    );
  });
});
