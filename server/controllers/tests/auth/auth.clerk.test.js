import request from "supertest";
import express from "express";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { clerkMiddleware, getAuth } from "@clerk/express";
import authRoutes from "../../../routes/auth.js";

// 🧩 Мокаем модели и Clerk
vi.mock("../../../models/User.js", () => ({
  default: {
    create: vi.fn(),
    findOne: vi.fn(),
    findByPk: vi.fn(),
  },
}));

vi.mock("@clerk/express", () => ({
  clerkMiddleware: () => (req, res, next) => {
    req.auth = { userId: "user_12345" };
    next();
  },
  getAuth: vi.fn(() => ({ userId: "user_12345" })),
  clerkClient: {
    users: {
      getUser: vi.fn(async () => ({
        id: "user_12345",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        imageUrl: "http://example.com/avatar.png",
        primaryEmailAddress: { emailAddress: "test123@example.com" },
      })),
    },
  },
}));

// ⚙️ Инициализация приложения
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("POST /api/auth/oauth-login", () => {
  let User;
  let clerkClient;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    User = (await import("../../../models/User.js")).default;
    clerkClient = (await import("@clerk/express")).clerkClient;

    // дефолтные моки
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      id: 999,
      email: "test123@example.com",
      first_name: "Test",
      last_name: "User",
      toJSON: () => ({
        id: 999,
        email: "test123@example.com",
        first_name: "Test",
        last_name: "User",
      }),
    });
  });

  it("should return success response when Clerk middleware passes", async () => {
    const response = await request(app)
      .post("/api/auth/oauth-login")
      .send({ provider: "linkedin_oidc" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Welcome via SSO",
        token: expect.any(String),
        refreshToken: expect.any(String),
        user: expect.objectContaining({
          id: 999,
          email: "test123@example.com",
        }),
      })
    );
  });

  it("should handle DB errors gracefully", async () => {
    User.findOne.mockResolvedValueOnce(null);
    User.findOne.mockResolvedValueOnce(null);
    User.create.mockRejectedValueOnce(new Error("DB connection lost"));

    const response = await request(app)
      .post("/api/auth/oauth-login")
      .send({ provider: "linkedin_oidc" });

    expect(response.status).toBe(500);
    expect(response.body.message).toContain("Server error");
  });

  it("should not create a new user if one already exists", async () => {
    const existingUser = {
      id: 55,
      email: "existing@example.com",
      first_name: "Existing",
      last_name: "User",
      toJSON: () => ({
        id: 55,
        email: "existing@example.com",
        first_name: "Existing",
        last_name: "User",
      }),
    };
    User.findOne.mockResolvedValue(existingUser);

    const response = await request(app)
      .post("/api/auth/oauth-login")
      .send({ provider: "linkedin_oidc" });

    expect(response.status).toBe(200);
    expect(User.create).not.toHaveBeenCalled();
    expect(response.body.user.email).toBe("existing@example.com");
  });

  it("should return 500 if Clerk fails to provide user data", async () => {
    clerkClient.users.getUser.mockRejectedValueOnce(
      new Error("Clerk API down")
    );

    const response = await request(app)
      .post("/api/auth/oauth-login")
      .send({ provider: "linkedin_oidc" });

    expect(response.status).toBe(500);
    expect(response.body.message).toContain("Server error");
  });

  it("should return 401 if Clerk middleware does not provide auth", async () => {
    const { getAuth } = await import("@clerk/express");
    getAuth.mockReturnValueOnce({}); // simulate no userId

    const response = await request(app)
      .post("/api/auth/oauth-login")
      .send({ provider: "linkedin_oidc" });

    expect(response.status).toBe(401);
    expect(response.body.message).toContain("Unauthorized");
  });

  it("should create a new user with correct data", async () => {
    User.findOne.mockResolvedValueOnce(null);

    const response = await request(app)
      .post("/api/auth/oauth-login")
      .send({ provider: "linkedin_oidc" });

    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        clerkId: "user_12345",
        email: "test123@example.com",
        first_name: "Test",
        last_name: "User",
        avatarUrl: expect.stringContaining("example.com"),
      })
    );
    expect(response.status).toBe(200);
  });

  it("should return structured error details on DB error", async () => {
    User.findOne.mockResolvedValueOnce(null);
    User.findOne.mockResolvedValueOnce(null);
    User.create.mockRejectedValueOnce(new Error("DB write failure"));

    const response = await request(app)
      .post("/api/auth/oauth-login")
      .send({ provider: "linkedin_oidc" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining("Server error"),
        error: expect.stringContaining("DB write failure"),
      })
    );
  });

  it("should return 400 if Clerk user has no email", async () => {
    const { clerkClient } = await import("@clerk/express");

    // имитируем пользователя без email
    clerkClient.users.getUser.mockResolvedValueOnce({
      id: "user_no_email",
      firstName: "NoEmail",
      lastName: "User",
      imageUrl: "http://example.com/avatar.png",
      primaryEmailAddress: null,
      emailAddresses: [],
      externalAccounts: [],
    });

    const response = await request(app)
      .post("/api/auth/oauth-login")
      .send({ provider: "linkedin_oidc" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Cannot create user without email");
  });
});
