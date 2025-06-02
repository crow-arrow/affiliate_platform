import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserClicks } from "./getClicks.js";
import { ClicksData, User } from "../models/models.js";

vi.mock("../models/models.js", () => ({
  User: {
    findByPk: vi.fn(),
  },
  ClicksData: {
    findAll: vi.fn(),
  },
}));

describe("getUserClicks", () => {
  const mockReq = { userId: 1 };
  const mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return clicks for a valid user", async () => {
    const mockUser = { id: 1 };
    const mockClicks = [{ id: 101 }, { id: 102 }];

    User.findByPk.mockResolvedValue(mockUser);
    ClicksData.findAll.mockResolvedValue(mockClicks);

    await getUserClicks(mockReq, mockRes);

    expect(User.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: ClicksData, as: "clicksData" }],
    });
    expect(ClicksData.findAll).toHaveBeenCalledWith({
      where: { referral_user_id: 1 },
    });
    expect(mockRes.json).toHaveBeenCalledWith({
      userId: 1,
      clicks: mockClicks,
    });
  });

  it("should return 404 if user not found", async () => {
    User.findByPk.mockResolvedValue(null);

    await getUserClicks(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 500 on error", async () => {
    const error = new Error("DB error");
    User.findByPk.mockRejectedValue(error);

    await getUserClicks(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      massege: "Server error",
      error: error.massege,
    });
  });
});
