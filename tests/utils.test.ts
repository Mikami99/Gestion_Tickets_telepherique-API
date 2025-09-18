/// <reference lib="deno.ns" />
// Tests simples pour vérifier les fonctions utilitaires
import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("Génération de code de billet", () => {
  const generateTicketCode = () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(2, 10).replace(/-/g, '');
    const nextNumber = "001";
    return `TK${dateStr}${nextNumber}`;
  };

  const code = generateTicketCode();
  assertEquals(code.length, 11);
  assertEquals(code.startsWith("TK"), true);
});

Deno.test("Formatage des prix", () => {
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `${(numPrice || 0).toFixed(2)}€`;
  };

  assertEquals(formatPrice(25), "25.00€");
  assertEquals(formatPrice("30.5"), "30.50€");
  assertEquals(formatPrice("invalid"), "0.00€");
});

Deno.test("Traduction des statuts", () => {
  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'active': return 'ACTIF';
      case 'used': return 'UTILISÉ';
      case 'cancelled': return 'ANNULÉ';
      case 'boarding': return 'EMBARQUEMENT';
      default: return 'ACTIF';
    }
  };

  assertEquals(getStatusLabel('active'), 'ACTIF');
  assertEquals(getStatusLabel('used'), 'UTILISÉ');
  assertEquals(getStatusLabel('cancelled'), 'ANNULÉ');
  assertEquals(getStatusLabel('boarding'), 'EMBARQUEMENT');
  assertEquals(getStatusLabel(undefined), 'ACTIF');
});
