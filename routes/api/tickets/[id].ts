import { Handlers } from "$fresh/server.ts";
import * as db from "@/lib/db.ts";

export const handler: Handlers = {
    async GET(_req, ctx) {
        const id = Number(ctx.params.id);
        const ticket = await db.getTicketsById(id);
        if (!ticket) return new Response(null, { status: 404 });
        return new Response(JSON.stringify(ticket), { headers: { "Content-Type": "application/json" } });
    },
    async PUT(req, ctx) {
        const id = Number(ctx.params.id);
        const patch = await req.json();
        const updated = await db.updateTicket(id, patch);
        if (!updated) return new Response(null, { status: 404 });
        return new Response(JSON.stringify(updated), { headers: { "Content-Type": "application/json" } });
    },
    async DELETE(_req, ctx) {
        const id = Number(ctx.params.id);
        await db.deleteTicket(id);
        return new Response(null, { status: 204 });
    },
};