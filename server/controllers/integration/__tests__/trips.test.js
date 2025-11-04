import { describe, it, expect, vi, beforeEach } from "vitest";
import { receiveTrips } from "../trips.js";
import { FieldMappingService } from "../fieldMapping.js";

const mockPrisma = {
  trips: {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock("../../prisma/client.js", () => ({
  default: mockPrisma,
}));

vi.mock("../fieldMapping.js", () => ({
  FieldMappingService: {
    getMappings: vi.fn(),
    mapFields: vi.fn(),
  },
}));

describe("receiveTrips", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      tenantId: "tenant_id",
      body: [],
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it("should return 400 if no trips provided", async () => {
    mockReq.body = [];

    await receiveTrips(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "No trips provided",
    });
  });

  it("should create new trip if no duplicate found", async () => {
    const rawTrip = {
      travel_date: "2025-12-01",
      booking_date: "2025-11-15",
      client_name: "John",
      client_surname: "Doe",
      customer_email: "john@example.com",
    };

    mockReq.body = [rawTrip];

    FieldMappingService.getMappings.mockResolvedValue({
      travel_date: "travelDate",
      booking_date: "bookingDate",
      client_name: "customerFirstName",
      client_surname: "customerLastName",
      customer_email: "customerEmail",
    });

    FieldMappingService.mapFields.mockResolvedValue({
      travelDate: new Date("2025-12-01"),
      bookingDate: new Date("2025-11-15"),
      customerFirstName: "John",
      customerLastName: "Doe",
      customerEmail: "john@example.com",
    });

    mockPrisma.trips.findFirst.mockResolvedValue(null);
    mockPrisma.trips.create.mockResolvedValue({ id: BigInt(1) });

    await receiveTrips(mockReq, mockRes);

    expect(mockPrisma.trips.findFirst).toHaveBeenCalled();
    expect(mockPrisma.trips.create).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Trips processed successfully",
      results: {
        created: 1,
        updated: 0,
        errors: [],
      },
    });
  });

  it("should update existing trip if duplicate found", async () => {
    const rawTrip = {
      travel_date: "2025-12-01",
      booking_date: "2025-11-15",
      client_name: "John",
      client_surname: "Doe",
      customer_email: "john@example.com",
    };

    mockReq.body = [rawTrip];

    const existingTrip = { id: "1" };

    FieldMappingService.getMappings.mockResolvedValue({
      travel_date: "travelDate",
      booking_date: "bookingDate",
      client_name: "customerFirstName",
      client_surname: "customerLastName",
      customer_email: "customerEmail",
    });

    FieldMappingService.mapFields.mockResolvedValue({
      travelDate: new Date("2025-12-01"),
      bookingDate: new Date("2025-11-15"),
      customerFirstName: "John",
      customerLastName: "Doe",
      customerEmail: "john@example.com",
    });

    mockPrisma.trips.findFirst.mockResolvedValue(existingTrip);
    mockPrisma.trips.update.mockResolvedValue(existingTrip);

    await receiveTrips(mockReq, mockRes);

    expect(mockPrisma.trips.findFirst).toHaveBeenCalled();
    expect(mockPrisma.trips.update).toHaveBeenCalled();
    expect(mockPrisma.trips.create).not.toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Trips processed successfully",
      results: {
        created: 0,
        updated: 1,
        errors: [],
      },
    });
  });

  it("should handle missing required fields", async () => {
    const rawTrip = {
      travel_date: "2025-12-01",
      // Missing required fields
    };

    mockReq.body = [rawTrip];

    FieldMappingService.getMappings.mockResolvedValue({});
    FieldMappingService.mapFields.mockResolvedValue({
      travelDate: new Date("2025-12-01"),
    });

    await receiveTrips(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Trips processed successfully",
      results: {
        created: 0,
        updated: 0,
        errors: [
          {
            trip: rawTrip,
            error:
              "Missing required fields: customerFirstName, customerLastName, customerEmail, bookingDate",
          },
        ],
      },
    });
  });

  it("should handle multiple trips", async () => {
    const trips = [
      {
        travel_date: "2025-12-01",
        booking_date: "2025-11-15",
        client_name: "John",
        client_surname: "Doe",
        customer_email: "john@example.com",
      },
      {
        travel_date: "2025-12-02",
        booking_date: "2025-11-16",
        client_name: "Jane",
        client_surname: "Smith",
        customer_email: "jane@example.com",
      },
    ];

    mockReq.body = trips;

    FieldMappingService.getMappings.mockResolvedValue({
      travel_date: "travelDate",
      booking_date: "bookingDate",
      client_name: "customerFirstName",
      client_surname: "customerLastName",
      customer_email: "customerEmail",
    });

    FieldMappingService.mapFields
      .mockResolvedValueOnce({
        travelDate: new Date("2025-12-01"),
        bookingDate: new Date("2025-11-15"),
        customerFirstName: "John",
        customerLastName: "Doe",
        customerEmail: "john@example.com",
      })
      .mockResolvedValueOnce({
        travelDate: new Date("2025-12-02"),
        bookingDate: new Date("2025-11-16"),
        customerFirstName: "Jane",
        customerLastName: "Smith",
        customerEmail: "jane@example.com",
      });

    mockPrisma.trips.findFirst.mockResolvedValue(null);
    mockPrisma.trips.create.mockResolvedValue({ id: "1" });

    await receiveTrips(mockReq, mockRes);

    expect(mockPrisma.trips.create).toHaveBeenCalledTimes(2);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Trips processed successfully",
      results: {
        created: 2,
        updated: 0,
        errors: [],
      },
    });
  });
});
