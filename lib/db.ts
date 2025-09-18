/// <reference lib="deno.ns" />
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const client = new Client({
    user: Deno.env.get("DB_USER") ?? "postgres",
    password: Deno.env.get("DB_PASS") ?? "0000",
    database: Deno.env.get("DB_NAME") ?? "ticketsdb",
    hostname: Deno.env.get("DB_HOST") ?? "127.0.0.1",
    port: Number(Deno.env.get("DB_PORT") ?? 5432),
});

await client.connect();

export type Ticket = {
    id?: number;
    code: string;
    passenger: string;
    price: number;
    status?: string;
    created_at?: string;
};

export async function createTicket(t: { code: string; passenger: string; price: number }): Promise<Ticket> {
    const result = await client.queryObject<Ticket>`
        INSERT INTO tickets (code, passenger, price)
        VALUES (${t.code}, ${t.passenger}, ${t.price})
        RETURNING id, code, passenger, price, status, created_at
        `;
    return result.rows[0];
}

export async function getTickets(): Promise<Ticket[]> {
    const res = await client.queryObject<Ticket>("SELECT * FROM tickets ORDER BY id DESC");
    return res.rows;
}

export async function getTicketsById(id: number): Promise<Ticket | null> {
    const res = await client.queryObject<Ticket>`SELECT * FROM tickets WHERE id = ${id}`;
    return res.rows[0] ?? null;
}

export async function updateTicket(id: number, patch: Partial<Ticket>): Promise<Ticket | null> {
    // Build dynamic SQL based on what fields are provided
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (patch.passenger !== undefined) {
        updates.push(`passenger = $${paramIndex++}`);
        values.push(patch.passenger);
    }
    if (patch.price !== undefined) {
        updates.push(`price = $${paramIndex++}`);
        values.push(patch.price);
    }
    if (patch.status !== undefined) {
        updates.push(`status = $${paramIndex++}`);
        values.push(patch.status);
    }

    if (updates.length === 0) {
        // No updates to make, just return current record
        return await getTicketsById(id);
    }

    const sql = `
        UPDATE tickets SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING id, code, passenger, price, status, created_at
    `;
    values.push(id);

    const res = await client.queryObject<Ticket>(sql, values);
    return res.rows[0] ?? null;
}

export async function deleteTicket(id: number): Promise<{ success: boolean }> {
    await client.queryObject`DELETE FROM tickets WHERE id = ${id}`;
    return { success: true };
}