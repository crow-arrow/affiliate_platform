import { describe, test, expect } from "vitest";
import { updateUserLevel } from "../updateUserLevel.js";

// Вспомогательные функции для моков
const mockUser = (level, levelYear = new Date().getFullYear()) => ({
  level,
  levelYear,
  levelHistory: [{ changed_at: new Date(`${levelYear}-01-01`), level }],
});

const mockTrip = (date, traveller_amount, status = "COMPLETED") => ({
  travelDate: date ? new Date(date) : null,
  travellerAmount: traveller_amount,
  orderStatus: status,
});

const getDateThisYear = (month = 0, day = 1) => {
  const d = new Date();
  return new Date(d.getFullYear(), month, day).toISOString();
};

const getDateLastYear = (month = 0, day = 1) => {
  const d = new Date();
  return new Date(d.getFullYear() - 1, month, day).toISOString();
};

describe("updateUserLevel", () => {
  test("повышает уровень до Silver при 10 путешественниках в текущем году", async () => {
    const user = mockUser("BRONZE");
    // Создаем туры в прошлом, которые уже состоялись
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10); // 10 дней назад
    const trips = Array(2).fill(
      mockTrip(pastDate.toISOString(), 5, "COMPLETED")
    );

    const result = await updateUserLevel(user, trips);
    expect(result.newLevel).toBe("SILVER");
    expect(result.currentYearTravellers).toBe(10);
  });

  test("повышает уровень до Gold при 25 путешественниках в текущем году", async () => {
    const user = mockUser("SILVER");
    // Создаем туры в прошлом, которые уже состоялись
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10); // 10 дней назад
    const trips = Array(5).fill(
      mockTrip(pastDate.toISOString(), 5, "COMPLETED")
    );

    const result = await updateUserLevel(user, trips);
    expect(result.newLevel).toBe("GOLD");
    expect(result.currentYearTravellers).toBe(25);
  });

  test("понижает уровень до Silver в новом году при недостаточном количестве", async () => {
    const today = new Date();
    if (!(today.getMonth() === 0 && today.getDate() === 1)) {
      console.warn("Этот тест работает только 1 января");
      return;
    }

    const user = mockUser("GOLD", today.getFullYear() - 1);
    const trips = Array(2).fill(mockTrip(getDateLastYear(), 5, "COMPLETED")); // всего 10

    const result = await updateUserLevel(user, trips);
    expect(result.newLevel).toBe("SILVER");
  });

  test("оставляет уровень прежним, если нет условий для изменения", async () => {
    const user = mockUser("SILVER");
    const trips = [];

    const result = await updateUserLevel(user, trips);
    expect(result.newLevel).toBe("SILVER");
  });

  test("сохраняет уровень Gold в 2025 году, если в 2024 году было 25+ путешественников", () => {
    const RealDate = Date;
    global.Date = class extends RealDate {
      constructor(...args) {
        if (args.length === 0) {
          return new RealDate("2025-01-01T00:00:00Z");
        }
        return new RealDate(...args);
      }
      static now() {
        return new RealDate("2025-01-01T00:00:00Z").getTime();
      }
    };

    const user = {
      level: "GOLD",
      levelHistory: [{ changed_at: new Date("2024-12-31"), level: "GOLD" }],
    };

    const trips = Array.from({ length: 25 }, (_, i) => ({
      travelDate: new Date(`2024-06-${String(i + 1).padStart(2, "0")}`),
      travellerAmount: 1,
      orderStatus: "COMPLETED",
    }));

    const result = updateUserLevel(user, trips);

    expect(result.newLevel).toBe("GOLD");

    global.Date = RealDate;
  });

  test("исключает отмененные туры из подсчета путешественников", async () => {
    const user = mockUser("BRONZE");
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);

    const trips = [
      mockTrip(pastDate.toISOString(), 5, "COMPLETED"), // Состоялся
      mockTrip(pastDate.toISOString(), 3, "CANCEL"), // Отменен - не должен учитываться
      mockTrip(pastDate.toISOString(), 2, "REJECTED"), // Отклонен - не должен учитываться
    ];

    const result = await updateUserLevel(user, trips);
    expect(result.currentYearTravellers).toBe(5); // Только состоявшийся тур
    expect(result.newLevel).toBe("BRONZE"); // Недостаточно для повышения уровня
  });
});
