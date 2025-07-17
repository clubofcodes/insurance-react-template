import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Modal } from "../components/ui/modal";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Calendar,
  DollarSign,
  User,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import type { Quote, QuoteFilters } from "../types";

// Mock data
const mockQuotes: Quote[] = [
  {
    id: "q1",
    customerId: "c1",
    customerName: "John Smith",
    agentId: "a1",
    agentName: "Sarah Johnson",
    agencyId: "ag1",
    agencyName: "Prime Insurance Agency",
    insuranceType: "auto",
    status: "pending",
    premium: 1200,
    deductible: 500,
    coverageAmount: 100000,
    terms: "12 months",
    validUntil: "2025-08-15",
    createdAt: "2025-07-01T10:00:00Z",
    updatedAt: "2025-07-01T10:00:00Z",
    notes: "Standard auto insurance policy",
  },
  {
    id: "q2",
    customerId: "c2",
    customerName: "Emily Davis",
    agentId: "a2",
    agentName: "Mike Wilson",
    agencyId: "ag1",
    agencyName: "Prime Insurance Agency",
    insuranceType: "home",
    status: "approved",
    premium: 2400,
    deductible: 1000,
    coverageAmount: 350000,
    terms: "12 months",
    validUntil: "2025-09-10",
    createdAt: "2025-06-15T14:30:00Z",
    updatedAt: "2025-07-02T09:15:00Z",
    notes: "Premium home coverage with flood protection",
  },
  {
    id: "q3",
    customerId: "c3",
    customerName: "Robert Brown",
    agentId: "a3",
    agentName: "Lisa Chen",
    agencyId: "ag2",
    agencyName: "SecureLife Insurance",
    insuranceType: "life",
    status: "draft",
    premium: 3600,
    deductible: 0,
    coverageAmount: 500000,
    terms: "20 years",
    validUntil: "2025-08-30",
    createdAt: "2025-07-10T16:45:00Z",
    updatedAt: "2025-07-15T11:20:00Z",
    notes: "Term life insurance policy",
  },
];

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  expired: "bg-gray-100 text-gray-600",
};

const insuranceTypeColors = {
  auto: "bg-blue-100 text-blue-800",
  home: "bg-purple-100 text-purple-800",
  life: "bg-green-100 text-green-800",
  health: "bg-red-100 text-red-800",
  business: "bg-orange-100 text-orange-800",
};

const Quotes = () => {
  const { user } = useAuthStore();
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<QuoteFilters>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [newQuote, setNewQuote] = useState({
    customerName: "",
    insuranceType: "auto" as "auto" | "home" | "life" | "health" | "business",
    premium: "",
    deductible: "",
    coverageAmount: "",
    terms: "",
    validUntil: "",
    notes: "",
  });

  // Filter quotes based on user role
  const getFilteredQuotes = () => {
    let filteredQuotes = quotes;

    // Role-based filtering
    if (user?.role === "agent") {
      filteredQuotes = filteredQuotes.filter(
        (quote) => quote.agentId === user.id
      );
    } else if (user?.role === "agency_admin") {
      filteredQuotes = filteredQuotes.filter(
        (quote) => quote.agencyId === user.agencyId
      );
    }

    // Search filtering
    if (searchTerm) {
      filteredQuotes = filteredQuotes.filter(
        (quote) =>
          quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filtering
    if (filters.status) {
      filteredQuotes = filteredQuotes.filter(
        (quote) => quote.status === filters.status
      );
    }

    // Insurance type filtering
    if (filters.insuranceType) {
      filteredQuotes = filteredQuotes.filter(
        (quote) => quote.insuranceType === filters.insuranceType
      );
    }

    return filteredQuotes;
  };

  const handleDeleteQuote = (quoteId: string) => {
    if (window.confirm("Are you sure you want to delete this quote?")) {
      setQuotes(quotes.filter((quote) => quote.id !== quoteId));
    }
  };

  const handleCreateQuote = () => {
    const quote: Quote = {
      id: `q${Date.now()}`,
      customerId: "c1", // Mock customer ID
      customerName: newQuote.customerName,
      agentId: user?.id || "a1",
      agentName: user ? `${user.firstName} ${user.lastName}` : "Unknown Agent",
      agencyId: user?.agencyId || "ag1",
      agencyName: "Current Agency", // Mock agency name
      insuranceType: newQuote.insuranceType,
      status: "draft",
      premium: parseFloat(newQuote.premium) || 0,
      deductible: parseFloat(newQuote.deductible) || 0,
      coverageAmount: parseFloat(newQuote.coverageAmount) || 0,
      terms: newQuote.terms,
      validUntil: newQuote.validUntil,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: newQuote.notes,
    };

    setQuotes([...quotes, quote]);
    setShowCreateModal(false);
    setNewQuote({
      customerName: "",
      insuranceType: "auto",
      premium: "",
      deductible: "",
      coverageAmount: "",
      terms: "",
      validUntil: "",
      notes: "",
    });
  };

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowViewModal(true);
  };

  const handleEditQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setNewQuote({
      customerName: quote.customerName,
      insuranceType: quote.insuranceType,
      premium: quote.premium.toString(),
      deductible: quote.deductible.toString(),
      coverageAmount: quote.coverageAmount.toString(),
      terms: quote.terms,
      validUntil: quote.validUntil,
      notes: quote.notes || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateQuote = () => {
    if (!selectedQuote) return;

    const updatedQuote: Quote = {
      ...selectedQuote,
      customerName: newQuote.customerName,
      insuranceType: newQuote.insuranceType,
      premium: parseFloat(newQuote.premium) || 0,
      deductible: parseFloat(newQuote.deductible) || 0,
      coverageAmount: parseFloat(newQuote.coverageAmount) || 0,
      terms: newQuote.terms,
      validUntil: newQuote.validUntil,
      notes: newQuote.notes,
      updatedAt: new Date().toISOString(),
    };

    setQuotes(
      quotes.map((q) => (q.id === selectedQuote.id ? updatedQuote : q))
    );
    setShowEditModal(false);
    setSelectedQuote(null);
    setNewQuote({
      customerName: "",
      insuranceType: "auto",
      premium: "",
      deductible: "",
      coverageAmount: "",
      terms: "",
      validUntil: "",
      notes: "",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const canCreateQuote =
    user?.role === "master_admin" ||
    user?.role === "agency_admin" ||
    user?.role === "agent";
  const canEditQuote = (quote: Quote) => {
    if (user?.role === "master_admin") return true;
    if (user?.role === "agency_admin") return quote.agencyId === user.agencyId;
    if (user?.role === "agent") return quote.agentId === user.id;
    return false;
  };

  const filteredQuotes = getFilteredQuotes();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quotes</h1>
          <p className="text-gray-600 mt-1">
            Manage insurance quotes and policies
          </p>
        </div>
        {canCreateQuote && (
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Quote
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search quotes by customer, agent, agency, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filters.status || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: e.target.value || undefined,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
                <option value="expired">Expired</option>
              </select>
              <select
                value={filters.insuranceType || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    insuranceType: e.target.value || undefined,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Types</option>
                <option value="auto">Auto</option>
                <option value="home">Home</option>
                <option value="life">Life</option>
                <option value="health">Health</option>
                <option value="business">Business</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Quotes
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredQuotes.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Premium
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    filteredQuotes.reduce(
                      (sum, quote) => sum + quote.premium,
                      0
                    )
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredQuotes.filter((q) => q.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredQuotes.filter((q) => q.status === "approved").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quotes List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Quote ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Premium
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Agent
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Valid Until
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm">{quote.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {quote.customerName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {quote.agencyName}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          insuranceTypeColors[quote.insuranceType]
                        }`}
                      >
                        {quote.insuranceType}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium">
                        {formatCurrency(quote.premium)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          statusColors[quote.status]
                        }`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900">{quote.agentName}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900">
                        {formatDate(quote.validUntil)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewQuote(quote)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {canEditQuote(quote) && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditQuote(quote)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteQuote(quote.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredQuotes.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No quotes found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Quote Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Quote"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateQuote}>Create Quote</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <Input
              value={newQuote.customerName}
              onChange={(e) =>
                setNewQuote({ ...newQuote, customerName: e.target.value })
              }
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Type
            </label>
            <select
              value={newQuote.insuranceType}
              onChange={(e) =>
                setNewQuote({
                  ...newQuote,
                  insuranceType: e.target
                    .value as typeof newQuote.insuranceType,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="auto">Auto</option>
              <option value="home">Home</option>
              <option value="life">Life</option>
              <option value="health">Health</option>
              <option value="business">Business</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Premium ($)
              </label>
              <Input
                type="number"
                value={newQuote.premium}
                onChange={(e) =>
                  setNewQuote({ ...newQuote, premium: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deductible ($)
              </label>
              <Input
                type="number"
                value={newQuote.deductible}
                onChange={(e) =>
                  setNewQuote({ ...newQuote, deductible: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coverage Amount ($)
            </label>
            <Input
              type="number"
              value={newQuote.coverageAmount}
              onChange={(e) =>
                setNewQuote({ ...newQuote, coverageAmount: e.target.value })
              }
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terms
            </label>
            <Input
              value={newQuote.terms}
              onChange={(e) =>
                setNewQuote({ ...newQuote, terms: e.target.value })
              }
              placeholder="e.g., 12 months"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valid Until
            </label>
            <Input
              type="date"
              value={newQuote.validUntil}
              onChange={(e) =>
                setNewQuote({ ...newQuote, validUntil: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={newQuote.notes}
              onChange={(e) =>
                setNewQuote({ ...newQuote, notes: e.target.value })
              }
              placeholder="Additional notes..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </Modal>

      {/* View Quote Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Quote Details"
        footer={<Button onClick={() => setShowViewModal(false)}>Close</Button>}
      >
        {selectedQuote && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quote ID
                </label>
                <p className="text-sm font-mono">{selectedQuote.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    statusColors[selectedQuote.status]
                  }`}
                >
                  {selectedQuote.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer
                </label>
                <p className="text-sm">{selectedQuote.customerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Agent
                </label>
                <p className="text-sm">{selectedQuote.agentName}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Insurance Type
                </label>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    insuranceTypeColors[selectedQuote.insuranceType]
                  }`}
                >
                  {selectedQuote.insuranceType}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Premium
                </label>
                <p className="text-sm font-medium">
                  {formatCurrency(selectedQuote.premium)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Deductible
                </label>
                <p className="text-sm">
                  {formatCurrency(selectedQuote.deductible)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Coverage Amount
                </label>
                <p className="text-sm">
                  {formatCurrency(selectedQuote.coverageAmount)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Terms
                </label>
                <p className="text-sm">{selectedQuote.terms}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Valid Until
                </label>
                <p className="text-sm">
                  {formatDate(selectedQuote.validUntil)}
                </p>
              </div>
            </div>
            {selectedQuote.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <p className="text-sm bg-gray-50 p-2 rounded">
                  {selectedQuote.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Quote Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Quote"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateQuote}>Update Quote</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <Input
              value={newQuote.customerName}
              onChange={(e) =>
                setNewQuote({ ...newQuote, customerName: e.target.value })
              }
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Type
            </label>
            <select
              value={newQuote.insuranceType}
              onChange={(e) =>
                setNewQuote({
                  ...newQuote,
                  insuranceType: e.target
                    .value as typeof newQuote.insuranceType,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="auto">Auto Insurance</option>
              <option value="home">Home Insurance</option>
              <option value="life">Life Insurance</option>
              <option value="health">Health Insurance</option>
              <option value="business">Business Insurance</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Premium ($)
              </label>
              <Input
                type="number"
                value={newQuote.premium}
                onChange={(e) =>
                  setNewQuote({ ...newQuote, premium: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deductible ($)
              </label>
              <Input
                type="number"
                value={newQuote.deductible}
                onChange={(e) =>
                  setNewQuote({ ...newQuote, deductible: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coverage Amount ($)
            </label>
            <Input
              type="number"
              value={newQuote.coverageAmount}
              onChange={(e) =>
                setNewQuote({ ...newQuote, coverageAmount: e.target.value })
              }
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terms
              </label>
              <Input
                value={newQuote.terms}
                onChange={(e) =>
                  setNewQuote({ ...newQuote, terms: e.target.value })
                }
                placeholder="e.g., 12 months"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valid Until
              </label>
              <Input
                type="date"
                value={newQuote.validUntil}
                onChange={(e) =>
                  setNewQuote({ ...newQuote, validUntil: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={newQuote.notes}
              onChange={(e) =>
                setNewQuote({ ...newQuote, notes: e.target.value })
              }
              placeholder="Additional notes..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Quotes;
