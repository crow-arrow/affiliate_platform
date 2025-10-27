import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserClicks } from "../getClicks.js";

// Mock Prisma client
const mockPrisma = {
  clicksData: {
    findMany: vi.fn(),
  },
};

vi.mock("../../prisma/client.js", () => ({
  default: mockPrisma,
}));

describe("getUserClicks", () => {
  const mockReq = { user: { id: 1 } };
  const mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return clicks for a valid user", async () => {
    const mockClicks = [{ id: 101 }, { id: 102 }];

    mockPrisma.clicksData.findMany.mockResolvedValue(mockClicks);

    await getUserClicks(mockReq, mockRes);

    expect(mockPrisma.clicksData.findMany).toHaveBeenCalledWith({
      where: { referral_user_id: 1 },
    });
    expect(mockRes.json).toHaveBeenCalledWith({
      clicks: mockClicks,
    });
  });

  it("should return 400 if user ID is missing", async () => {
    const mockReqNoUser = {};

    await getUserClicks(mockReqNoUser, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Missing user in request" });
  });

  it("should return 500 on error", async () => {
    const error = new Error("DB error");

    mockPrisma.clicksData.findMany.mockRejectedValue(error);

    await getUserClicks(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "DB error",
    });
  });
});
