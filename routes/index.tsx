import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import * as db from "../lib/db.ts";
import TicketList from "../islands/TicketList.tsx";

interface Data {
  tickets: db.Ticket[];
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const tickets = await db.getTickets();
    return ctx.render({ tickets });
  },
};

export default function Home({ data }: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>Tableau de Bord Téléphérique</title>
      </Head>
      <div class="min-h-screen bg-gray-50">
        <div class="px-4 py-6 mx-auto max-w-screen-xl">
          <TicketList initialTickets={data.tickets} />
        </div>
      </div>
    </>
  );
}
