import { useSignal } from "@preact/signals";
import { Button } from "../components/Button.tsx";

export interface Ticket {
  id?: number;
  code: string;
  passenger: string;
  price: number | string;
  status?: string;
  created_at?: string;
}

interface TicketListProps {
  initialTickets: Ticket[];
}

export default function TicketList({ initialTickets }: TicketListProps) {
  const tickets = useSignal<Ticket[]>(initialTickets);
  const isLoading = useSignal(false);
  const showForm = useSignal(false);
  const filterStatus = useSignal<string>("all");
  const newTicket = useSignal({
    passenger: ""
  });

  // Generate next ticket code automatically
  const generateTicketCode = () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD
    const existingToday = tickets.value.filter(t => t.code.startsWith(`TK${dateStr}`));
    const nextNumber = (existingToday.length + 1).toString().padStart(3, '0');
    return `TK${dateStr}${nextNumber}`;
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${(numPrice || 0).toFixed(2)}`;
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'used': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'boarding': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'active': return 'ACTIF';
      case 'used': return 'UTILISÉ';
      case 'cancelled': return 'ANNULÉ';
      case 'boarding': return 'EMBARQUEMENT';
      default: return 'ACTIF';
    }
  };

  const addTicket = async () => {
    if (!newTicket.value.passenger.trim()) {
      alert("Veuillez entrer le nom du passager");
      return;
    }

    const ticketData = {
      code: generateTicketCode(),
      passenger: newTicket.value.passenger.trim(),
      price: 10.00
    };

    isLoading.value = true;
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData)
      });
      
      if (response.ok) {
        const ticket = await response.json();
        tickets.value = [ticket, ...tickets.value];
        newTicket.value = { passenger: "" };
        showForm.value = false;
      } else {
        alert("Échec de la création du billet");
      }
    } catch (error) {
      alert("Erreur lors de la création du billet");
    }
    isLoading.value = false;
  };

  const updateTicketStatus = async (id: number, newStatus: string) => {
    isLoading.value = true;
    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        const updatedTicket = await response.json();
        tickets.value = tickets.value.map(t => t.id === id ? updatedTicket : t);
      } else {
        alert("Échec de la mise à jour du statut du billet");
      }
    } catch (error) {
      alert("Erreur lors de la mise à jour du billet");
    }
    isLoading.value = false;
  };

  const deleteTicket = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce billet ?")) return;
    
    isLoading.value = true;
    try {
      const response = await fetch(`/api/tickets/${id}`, { method: "DELETE" });
      if (response.ok) {
        tickets.value = tickets.value.filter(t => t.id !== id);
      } else {
        alert("Échec de la suppression du billet");
      }
    } catch (error) {
      alert("Erreur lors de la suppression du billet");
    }
    isLoading.value = false;
  };

  // Filter tickets based on status
  const filteredTickets = tickets.value.filter(ticket => {
    if (filterStatus.value === "all") return true;
    return (ticket.status || 'active') === filterStatus.value;
  });

  const stats = {
    total: tickets.value.length,
    active: tickets.value.filter(t => (t.status || 'active') === 'active').length,
    used: tickets.value.filter(t => t.status === 'used').length,
    boarding: tickets.value.filter(t => t.status === 'boarding').length,
    cancelled: tickets.value.filter(t => t.status === 'cancelled').length,
  };

  return (
    <div>
      {/* En-tête avec Statistiques */}
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-800">Tableau de Bord Téléphérique</h2>
          <div class="text-sm text-gray-500">
            Aujourd'hui • {new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>
        
        {/* Statistiques Rapides */}
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div class="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div class="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div class="text-sm text-blue-600 font-medium">Total Billets</div>
          </div>
          <div class="text-center p-3 bg-green-50 rounded-lg border border-green-100">
            <div class="text-2xl font-bold text-green-600">{stats.active}</div>
            <div class="text-sm text-green-600 font-medium">Actifs</div>
          </div>
          <div class="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
            <div class="text-2xl font-bold text-orange-600">{stats.boarding}</div>
            <div class="text-sm text-orange-600 font-medium">Embarquement</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div class="text-2xl font-bold text-gray-600">{stats.used}</div>
            <div class="text-sm text-gray-600 font-medium">Utilisés</div>
          </div>
          <div class="text-center p-3 bg-red-50 rounded-lg border border-red-100">
            <div class="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div class="text-sm text-red-600 font-medium">Annulés</div>
          </div>
        </div>

        {/* Boutons d'Action */}
        <div class="flex gap-3">
          <Button 
            onClick={() => showForm.value = !showForm.value}
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm"
          >
            {showForm.value ? "Annuler" : "+ Nouveau Passager"}
          </Button>
          
          {/* Boutons de Filtre */}
          <div class="flex gap-2">
            {[
              { key: "all", label: "Tous", count: stats.total },
              { key: "active", label: "Actifs", count: stats.active },
              { key: "boarding", label: "Embarquement", count: stats.boarding },
              { key: "used", label: "Utilisés", count: stats.used }
            ].map(filter => (
              <Button
                key={filter.key}
                onClick={() => filterStatus.value = filter.key}
                class={`px-3 py-2 rounded-lg text-sm font-medium shadow-sm ${
                  filterStatus.value === filter.key 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Formulaire d'Ajout Rapide */}
      {showForm.value && (
        <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-800">Ajouter un Nouveau Passager</h3>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom du Passager</label>
              <input
                type="text"
                placeholder="Entrez le nom du passager..."
                value={newTicket.value.passenger}
                onInput={(e) => newTicket.value = { ...newTicket.value, passenger: (e.target as HTMLInputElement).value }}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>
          <div class="mt-4 flex gap-3 items-center">
            <Button 
              onClick={addTicket}
              disabled={isLoading.value}
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm"
            >
              {isLoading.value ? "Création..." : "Créer le Billet"}
            </Button>
            <div class="text-sm text-gray-500">
              Prix fixe: <span class="font-bold text-green-600">$10.00</span> • Code Billet: <span class="font-mono font-bold text-blue-600">{generateTicketCode()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Liste des Billets */}
      {filteredTickets.length === 0 ? (
        <div class="text-center py-12 bg-white rounded-lg shadow-sm border">
          <div class="text-6xl mb-4 text-gray-300">📋</div>
          <p class="text-gray-500 text-lg">
            {filterStatus.value === "all" ? "Aucun billet trouvé. Créez votre premier billet !" : `Aucun billet ${filterStatus.value === "active" ? "actif" : filterStatus.value === "used" ? "utilisé" : filterStatus.value === "boarding" ? "en embarquement" : filterStatus.value} trouvé.`}
          </p>
        </div>
      ) : (
        <div class="space-y-3">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200">
              <div class="p-4">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center gap-4 mb-3">
                      <span class="text-xl font-bold text-blue-600 font-mono">#{ticket.code}</span>
                      <span class={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
                        {getStatusLabel(ticket.status)}
                      </span>
                      <span class="text-sm text-gray-500 font-medium">
                        {formatTime(ticket.created_at)}
                      </span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span class="text-sm font-medium text-gray-500">Passager:</span>
                        <div class="text-lg font-semibold text-gray-800">{ticket.passenger}</div>
                      </div>
                      <div>
                        <span class="text-sm font-medium text-gray-500">Prix:</span>
                        <div class="text-lg font-bold text-green-600">{formatPrice(ticket.price)}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions Rapides */}
                  <div class="ml-4 flex flex-col gap-2">
                    {(ticket.status || 'active') === 'active' && (
                      <>
                        <Button 
                          onClick={() => updateTicketStatus(ticket.id!, 'boarding')}
                          disabled={isLoading.value}
                          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm min-w-[90px]"
                        >
                          Embarquer
                        </Button>
                        <Button 
                          onClick={() => updateTicketStatus(ticket.id!, 'used')}
                          disabled={isLoading.value}
                          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm min-w-[90px]"
                        >
                          Utiliser
                        </Button>
                      </>
                    )}
                    
                    {ticket.status === 'boarding' && (
                      <Button 
                        onClick={() => updateTicketStatus(ticket.id!, 'used')}
                        disabled={isLoading.value}
                        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm min-w-[90px]"
                      >
                        Terminer
                      </Button>
                    )}
                    
                    {(ticket.status === 'active' || ticket.status === 'boarding') && (
                      <Button 
                        onClick={() => updateTicketStatus(ticket.id!, 'cancelled')}
                        disabled={isLoading.value}
                        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm min-w-[90px]"
                      >
                        Annuler
                      </Button>
                    )}
                    
                    <Button 
                      onClick={() => deleteTicket(ticket.id!)}
                      disabled={isLoading.value}
                      class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm min-w-[90px]"
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
