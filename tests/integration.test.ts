/// <reference lib="deno.ns" />
import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

// Tests d'intégration - nécessitent que le serveur soit démarré sur localhost:8000
// Exécuter avec: deno test --allow-net tests/integration.test.ts

async function isServerRunning(): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:8000/api/tickets");
    return response.status === 200 || response.status === 404;
  } catch {
    return false;
  }
}

Deno.test("Integration - API Health Check", async () => {
  const serverRunning = await isServerRunning();
  
  if (!serverRunning) {
    console.log("⚠️  Serveur non démarré. Démarrez avec 'deno task start' pour exécuter les tests d'intégration.");
    return;
  }

  const response = await fetch("http://localhost:8000/api/tickets");
  assertEquals(response.status, 200);
  const data = await response.json();
  assertEquals(Array.isArray(data), true);
});

Deno.test("Integration - Create and retrieve ticket", async () => {
  const serverRunning = await isServerRunning();
  
  if (!serverRunning) {
    console.log("⚠️  Serveur non démarré pour les tests d'intégration.");
    return;
  }

  const newTicket = {
    code: `TK${Date.now()}`,
    passenger: "Test Integration",
    price: 25.00
  };

  // Créer un billet
  const createResponse = await fetch("http://localhost:8000/api/tickets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTicket),
  });

  assertEquals(createResponse.status, 201);
  const createdTicket = await createResponse.json();
  assertEquals(createdTicket.passenger, "Test Integration");
  assertEquals(createdTicket.price, 25.00);
  assertEquals(createdTicket.status, "active");

  // Nettoyer - supprimer le billet de test
  if (createdTicket.id) {
    await fetch(`http://localhost:8000/api/tickets/${createdTicket.id}`, {
      method: "DELETE"
    });
  }
});
