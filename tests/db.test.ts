import { assertEquals } from "https://deno.land/std@0.203.0/assert/mod.ts";
import * as db from "../lib/db.ts";

Deno.test("create & get ticket", async () => {
    const code = `T_${Date.now()}`;
    const created = await db.createTicket({ code, passenger: "Test", price: 100});
    const fetched = await db.getTicketsById(created.id!);
    assertEquals(fetched?.code, code);
});

