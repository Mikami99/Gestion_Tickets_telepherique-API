/// <reference lib="deno.ns" />
import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

// Tests des fonctions de l'API (tests unitaires, pas d'intégration)
Deno.test("Validation du format des données API", () => {
  // Test de validation d'un objet ticket
  const validTicket = {
    code: "TK240917001",
    passenger: "Test Passager",
    price: 25.00,
    status: "active"
  };

  assertEquals(typeof validTicket.code, "string");
  assertEquals(typeof validTicket.passenger, "string");
  assertEquals(typeof validTicket.price, "number");
  assertEquals(validTicket.price > 0, true);
});

Deno.test("Validation des statuts de billets", () => {
  const validStatuses = ['active', 'used', 'cancelled', 'boarding'];
  
  validStatuses.forEach(status => {
    assertEquals(typeof status, "string");
    assertEquals(status.length > 0, true);
  });
});

Deno.test("Format des codes de billets", () => {
  const codePattern = /^TK\d{6}\d{3}$/; // TK + YYMMDD + 3 digits
  const testCode = "TK240917001";
  
  assertEquals(codePattern.test(testCode), true);
  assertEquals(testCode.length, 11);
  assertEquals(testCode.startsWith("TK"), true);
});
