import { describe, it, expect, vi, beforeEach } from "vitest";
import { FieldMappingService } from "../fieldMapping.js";

const mockPrisma = {
  tenantFieldMapping: {
    findMany: vi.fn(),
  },
};

vi.mock("../../prisma/client.js", () => ({
  default: mockPrisma,
}));

describe("FieldMappingService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getMappings", () => {
    it("should return mapping map for active mappings", async () => {
      const mockMappings = [
        {
          incomingField: "travel_date",
          targetField: "travelDate",
        },
        {
          incomingField: "client_name",
          targetField: "customerFirstName",
        },
      ];

      mockPrisma.tenantFieldMapping.findMany.mockResolvedValue(mockMappings);

      const result = await FieldMappingService.getMappings("tenant_id");

      expect(result).toEqual({
        travel_date: "travelDate",
        client_name: "customerFirstName",
      });
      expect(mockPrisma.tenantFieldMapping.findMany).toHaveBeenCalledWith({
        where: {
          tenantId: "tenant_id",
          isActive: true,
        },
      });
    });

    it("should return empty object if no mappings found", async () => {
      mockPrisma.tenantFieldMapping.findMany.mockResolvedValue([]);

      const result = await FieldMappingService.getMappings("tenant_id");

      expect(result).toEqual({});
    });
  });

  describe("mapFields", () => {
    beforeEach(() => {
      mockPrisma.tenantFieldMapping.findMany.mockResolvedValue([
        {
          incomingField: "travel_date",
          targetField: "travelDate",
        },
        {
          incomingField: "booking_date",
          targetField: "bookingDate",
        },
        {
          incomingField: "client_name",
          targetField: "customerFirstName",
        },
        {
          incomingField: "traveller_count",
          targetField: "travellerAmount",
        },
        {
          incomingField: "total_price",
          targetField: "totalPrice",
        },
      ]);
    });

    it("should map fields correctly", async () => {
      const incomingData = {
        travel_date: "2025-12-01",
        client_name: "John",
        traveller_count: "2",
        total_price: "1500.00",
        unknown_field: "ignored",
      };

      const result = await FieldMappingService.mapFields(
        incomingData,
        "tenant_id"
      );

      expect(result.travelDate).toBeInstanceOf(Date);
      expect(result.customerFirstName).toBe("John");
      expect(result.travellerAmount).toBe(2);
      expect(result.totalPrice).toBe(1500.0);
      expect(result.unknown_field).toBeUndefined();
    });

    it("should handle null values", async () => {
      const incomingData = {
        travel_date: null,
        client_name: "John",
      };

      const result = await FieldMappingService.mapFields(
        incomingData,
        "tenant_id"
      );

      expect(result.travelDate).toBeUndefined();
      expect(result.customerFirstName).toBe("John");
    });

    it("should normalize dates to start of day", async () => {
      const incomingData = {
        travel_date: "2025-12-01T15:30:00Z",
        booking_date: "2025-11-15T10:00:00Z",
      };

      const result = await FieldMappingService.mapFields(
        incomingData,
        "tenant_id"
      );

      expect(result.travelDate.getHours()).toBe(0);
      expect(result.travelDate.getMinutes()).toBe(0);
      expect(result.bookingDate.getHours()).toBe(0);
    });
  });

  describe("transformValue", () => {
    it("should transform dates correctly", () => {
      const date = FieldMappingService.transformValue(
        "travelDate",
        "2025-12-01"
      );
      expect(date).toBeInstanceOf(Date);
      expect(date.getHours()).toBe(0);
    });

    it("should transform numbers correctly", () => {
      const amount = FieldMappingService.transformValue(
        "travellerAmount",
        "5"
      );
      expect(amount).toBe(5);

      const price = FieldMappingService.transformValue("totalPrice", "1500.50");
      expect(price).toBe(1500.5);
    });

    it("should trim strings", () => {
      const name = FieldMappingService.transformValue(
        "customerFirstName",
        "  John  "
      );
      expect(name).toBe("John");
    });

    it("should return null for invalid dates", () => {
      const date = FieldMappingService.transformValue("travelDate", "invalid");
      expect(date).toBeNull();
    });

    it("should return null for invalid numbers", () => {
      const num = FieldMappingService.transformValue("travellerAmount", "abc");
      expect(num).toBeNull();
    });
  });
});

