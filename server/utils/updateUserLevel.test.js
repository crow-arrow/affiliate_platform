import { describe, test, expect } from "vitest";
import { updateUserLevel } from "../utils/updateUserLevel.js";

// Вспомогательные функции для моков
const mockUser = (level, levelYear = new Date().getFullYear()) => ({
  level,
  levelYear,
  levelHistory: [{ changed_at: new Date(`${levelYear}-01-01`), level }],
});

const mockTrip = (date, traveller_amount, status = "departed") => ({
  travel_date: date,
  traveller_amount,
  order_status: status,
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
    const user = mockUser("Bronze");
    const trips = Array(2).fill(mockTrip(getDateThisYear(), 5));

    const result = await updateUserLevel(user, trips);
    expect(result.newLevel).toBe("Silver");
    expect(result.currentYearTravellers).toBe(10);
  });

  test("повышает уровень до Gold при 25 путешественниках в текущем году", async () => {
    const user = mockUser("Silver");
    const trips = Array(5).fill(mockTrip(getDateThisYear(), 5));

    const result = await updateUserLevel(user, trips);
    expect(result.newLevel).toBe("Gold");
    expect(result.currentYearTravellers).toBe(25);
  });

  test("понижает уровень до Silver в новом году при недостаточном количестве", async () => {
    const today = new Date();
    if (!(today.getMonth() === 0 && today.getDate() === 1)) {
      console.warn("Этот тест работает только 1 января");
      return;
    }

    const user = mockUser("Gold", today.getFullYear() - 1);
    const trips = Array(2).fill(mockTrip(getDateLastYear(), 5)); // всего 10

    const result = await updateUserLevel(user, trips);
    expect(result.newLevel).toBe("Silver");
  });

  test("оставляет уровень прежним, если нет условий для изменения", async () => {
    const user = mockUser("Silver");
    const trips = [];

    const result = await updateUserLevel(user, trips);
    expect(result.newLevel).toBe("Silver");
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
      level: "Gold",
      levelHistory: [{ changed_at: new Date("2024-12-31"), level: "Gold" }],
    };

    const trips = Array.from({ length: 25 }, (_, i) => ({
      travel_date: new Date(`2024-06-${String(i + 1).padStart(2, "0")}`),
      traveller_amount: 1,
      order_status: "departed",
    }));

    const result = updateUserLevel(user, trips);

    expect(result.newLevel).toBe("Gold");

    global.Date = RealDate;
  });
});
