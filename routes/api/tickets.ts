import { Handlers } from "$fresh/server.ts";
import * as db from "../../lib/db.ts";

export const handler: Handlers = {
    async GET(_req, _ctx) {
        const tickets = await db.getTickets();
        return new Response(JSON.stringify(tickets), { headers: {"Content-Type": "application/json"} });
    },
    async POST(req, _ctx) {
        const body = await req.json();
        const created = await db.createTicket(body);
        return new Response(JSON.stringify(created), { status: 201, headers: { "Content-Type": "application/json" } });
    },
}