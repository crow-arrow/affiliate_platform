// Создаем моки для Prisma
const mocks = {
  identityFindUnique: vi.fn(),
  identityUpdate: vi.fn(),
  identityCreate: vi.fn(),
  membershipUpsert: vi.fn(),
  membershipFindMany: vi.fn(),
};

vi.mock("../../../prisma/client.js", () => ({
  default: {
    identity: {
      get findUnique() {
        return mocks.identityFindUnique;
      },
      get update() {
        return mocks.identityUpdate;
      },
      get create() {
        return mocks.identityCreate;
      },
    },
    membership: {
      get upsert() {
        return mocks.membershipUpsert;
      },
      get findMany() {
        return mocks.membershipFindMany;
      },
    },
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

vi.mock("../../../utils/generateTokens.js", () => ({
  generateTokens: vi.fn(() => ({
    accessToken: "mocked_access_token",
    refreshToken: "mocked_refresh_token",
  })),
}));

// resolveTenantIdFromRequest определен в auth.js, не нужно мокать отдельно

import request from "supertest";
import express from "express";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

const authRoutes = (await import("../../../routes/auth.js")).default;

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("POST /api/auth/oauth-login", () => {
  let clerkClient;

  beforeEach(async () => {
    vi.clearAllMocks();

    clerkClient = (await import("@clerk/express")).clerkClient;

    // Настройка моков по умолчанию для успешного сценария
    mocks.identityFindUnique.mockImplementation((query) => {
      // Если ищем по clerkId
      if (query.where.clerkId === "user_12345") {
        return Promise.resolve(null); // Новый пользователь
      }
      // Если ищем по email
      if (query.where.email === "test123@example.com") {
        return Promise.resolve(null); // Новый пользователь
      }
      // Если ищем существующего пользователя
      if (query.where.email === "existing@example.com") {
        return Promise.resolve({
          id: "identity_55",
          clerkId: null,
          email: "existing@example.com",
          firstName: "Existing",
          lastName: "User",
          avatarUrl: null,
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return Promise.resolve(null);
    });

    mocks.identityCreate.mockResolvedValue({
      id: "identity_999",
      clerkId: "user_12345",
      email: "test123@example.com",
      firstName: "Test",
      lastName: "User",
      avatarUrl: "http://example.com/avatar.png",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mocks.identityUpdate.mockResolvedValue({
      id: "identity_55",
      clerkId: "user_12345",
      email: "existing@example.com",
      firstName: "Existing",
      lastName: "User",
      avatarUrl: null,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mocks.membershipUpsert.mockResolvedValue({
      id: "membership_1",
      identityId: "identity_999",
      tenantId: null,
      role: "PARTNER",
      tenant: null,
    });

    mocks.membershipFindMany.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should print environment variables (debug)", () => {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY);
    expect(process.env.JWT_SECRET).toBeDefined();
  });

  it("returns success response when Clerk middleware passes", async () => {
    const response = await request(app)
      .post("/api/auth/oauth-login")
      .send({ provider: "linkedin_oidc" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Welcome via SSO");
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refreshToken");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", "test123@example.com");
    expect(response.body).toHaveProperty("currentTenant");
    expect(response.body).toHaveProperty("availableTenants");
    expect(Array.isArray(response.body.availableTenants)).toBe(true);
  });

  it("handles DB errors gracefully", async () => {
    mocks.identityFindUnique.mockResolvedValueOnce(null);
    mocks.identityFindUnique.mockResolvedValueOnce(null);
    mocks.identityCreate.mockRejectedValueOnce(new Error("DB connection lost"));

    const response = await request(app)
      .post("/api/auth/oauth-login")
      .send({ provider: "linkedin_oidc" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("OAuth login failed");
    expect(response.body.error).toBe("DB connection lost");
  });

  it("does not create a new user if one already exists", async () => {
    // Настраиваем моки для существующего пользователя
    mocks.identityFindUnique.mockImplementation((query) => {
      if (query.where.clerkId === "user_12345") {
        return Promise.resolve({
          id: "identity_55",
          clerkId: "user_12345",
          email: "existing@example.com",
          firstName: "Existing",
          lastName: "User",
          avatarUrl: null,
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return Promise.resolve(null);
    });

    const response = await request(app)
      .post("/api/auth/oauth-login")
      .send({ provider: "linkedin_oidc" });

    expect(response.status).toBe(200);
    expect(mocks.identityCreate).not.toHaveBeenCalled();
    expect(response.body.user.email).toBe("test123@example.com");
  });

  it("returns 500 if Clerk fails to provide user data", async () => {
    clerkClient.users.getUser.mockRejectedValueOnce(
      new Error("Clerk API down")
    );

    const response = await request(app)
      .post("/api/auth/oauth-login")
      .send({ provider: "linkedin_oidc" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("OAuth login failed");
  });

  it("returns 401 if Clerk middleware does not provide auth", async () => {
    const { getAuth } = await import("@clerk/express");
    getAuth.mockReturnValueOnce({}); // simulate no userId

    const response = await request(app)
      .post("/api/auth/oauth-login")
      .send({ provider: "linkedin_oidc" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("creates a new user with correct data", async () => {
    mocks.identityFindUnique.mockResolvedValueOnce(null);
    mocks.identityFindUnique.mockResolvedValueOnce(null);

    const response = await request(app)
      .post("/api/auth/oauth-login")
      .send({ provider: "linkedin_oidc" });

    expect(mocks.identityCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          clerkId: "user_12345",
          email: "test123@example.com",
          firstName: "Test",
          lastName: "User",
          avatarUrl: "http://example.com/avatar.png",
          emailVerified: true,
        }),
      })
    );
    expect(response.status).toBe(200);
  });

  it("returns structured error details on DB error", async () => {
    mocks.identityFindUnique.mockResolvedValueOnce(null);
    mocks.identityFindUnique.mockResolvedValueOnce(null);
    mocks.identityCreate.mockRejectedValueOnce(new Error("DB write failure"));

    const response = await request(app)
      .post("/api/auth/oauth-login")
      .send({ provider: "linkedin_oidc" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "OAuth login failed",
        error: "DB write failure",
      })
    );
  });

  it("returns 400 if Clerk user has no email", async () => {
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
    expect(response.body.message).toBe("No email from Clerk");
  });
});
