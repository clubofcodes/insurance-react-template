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
  UserCheck,
  Mail,
  Phone,
  Building,
  Percent,
  Award,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import type { Agent } from "../types";

// Mock data
const mockAgents: Agent[] = [
  {
    id: "a1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@primeinsurance.com",
    phone: "(555) 234-5678",
    agencyId: "ag1",
    agencyName: "Prime Insurance Agency",
    status: "active",
    licenseNumber: "NY-AGT-12345",
    commissionRate: 8.5,
    createdAt: "2023-02-01T10:00:00Z",
    updatedAt: "2025-06-15T14:20:00Z",
  },
  {
    id: "a2",
    firstName: "Mike",
    lastName: "Wilson",
    email: "mike.wilson@primeinsurance.com",
    phone: "(555) 345-6789",
    agencyId: "ag1",
    agencyName: "Prime Insurance Agency",
    status: "active",
    licenseNumber: "NY-AGT-23456",
    commissionRate: 7.5,
    createdAt: "2023-04-15T09:30:00Z",
    updatedAt: "2025-05-30T11:10:00Z",
  },
  {
    id: "a3",
    firstName: "Lisa",
    lastName: "Chen",
    email: "lisa.chen@securelife.com",
    phone: "(555) 456-7890",
    agencyId: "ag2",
    agencyName: "SecureLife Insurance",
    status: "active",
    licenseNumber: "CA-AGT-34567",
    commissionRate: 9.0,
    createdAt: "2023-06-01T08:15:00Z",
    updatedAt: "2025-07-01T16:45:00Z",
  },
  {
    id: "a4",
    firstName: "David",
    lastName: "Rodriguez",
    email: "david.rodriguez@coastalprotection.com",
    phone: "(555) 567-8901",
    agencyId: "ag3",
    agencyName: "Coastal Protection Services",
    status: "inactive",
    licenseNumber: "FL-AGT-45678",
    commissionRate: 6.5,
    createdAt: "2023-08-20T12:00:00Z",
    updatedAt: "2025-03-10T09:30:00Z",
  },
];

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
};

const Agents = () => {
  const { user } = useAuthStore();
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [agencyFilter, setAgencyFilter] = useState("");

  // CRUD state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    agencyId: "",
    agencyName: "",
    status: "active",
    licenseNumber: "",
    commissionRate: 0,
  });

  // Filter agents based on user role and filters
  const getFilteredAgents = () => {
    let filteredAgents = agents;

    // Role-based filtering
    if (user?.role === "agency_admin") {
      filteredAgents = filteredAgents.filter(
        (agent) => agent.agencyId === user.agencyId
      );
    }

    // Search filtering
    if (searchTerm) {
      filteredAgents = filteredAgents.filter(
        (agent) =>
          `${agent.firstName} ${agent.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.phone.includes(searchTerm) ||
          agent.licenseNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          agent.agencyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filtering
    if (statusFilter) {
      filteredAgents = filteredAgents.filter(
        (agent) => agent.status === statusFilter
      );
    }

    // Agency filtering (only for master admin)
    if (agencyFilter && user?.role === "master_admin") {
      filteredAgents = filteredAgents.filter(
        (agent) => agent.agencyId === agencyFilter
      );
    }

    return filteredAgents;
  };

  const handleDeleteAgent = (agentId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this agent? This action cannot be undone."
      )
    ) {
      setAgents(agents.filter((agent) => agent.id !== agentId));
    }
  };

  // CRUD handlers
  const handleViewAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowViewModal(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setNewAgent({
      firstName: agent.firstName,
      lastName: agent.lastName,
      email: agent.email,
      phone: agent.phone,
      agencyId: agent.agencyId,
      agencyName: agent.agencyName,
      status: agent.status,
      licenseNumber: agent.licenseNumber,
      commissionRate: agent.commissionRate,
    });
    setShowEditModal(true);
  };

  const handleCreateAgent = () => {
    const agent: Agent = {
      id: `a${Date.now()}`,
      firstName: newAgent.firstName || "",
      lastName: newAgent.lastName || "",
      email: newAgent.email || "",
      phone: newAgent.phone || "",
      agencyId: newAgent.agencyId || "",
      agencyName: newAgent.agencyName || "",
      status: newAgent.status || "active",
      licenseNumber: newAgent.licenseNumber || "",
      commissionRate: newAgent.commissionRate || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAgents([...agents, agent]);
    setShowCreateModal(false);
    setNewAgent({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      agencyId: "",
      agencyName: "",
      status: "active",
      licenseNumber: "",
      commissionRate: 0,
    });
  };

  const handleUpdateAgent = () => {
    if (selectedAgent) {
      const updatedAgent: Agent = {
        ...selectedAgent,
        firstName: newAgent.firstName || selectedAgent.firstName,
        lastName: newAgent.lastName || selectedAgent.lastName,
        email: newAgent.email || selectedAgent.email,
        phone: newAgent.phone || selectedAgent.phone,
        agencyId: newAgent.agencyId || selectedAgent.agencyId,
        agencyName: newAgent.agencyName || selectedAgent.agencyName,
        status: newAgent.status || selectedAgent.status,
        licenseNumber: newAgent.licenseNumber || selectedAgent.licenseNumber,
        commissionRate: newAgent.commissionRate || selectedAgent.commissionRate,
        updatedAt: new Date().toISOString(),
      };
      setAgents(
        agents.map((a) => (a.id === selectedAgent.id ? updatedAgent : a))
      );
      setShowEditModal(false);
      setSelectedAgent(null);
      setNewAgent({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        agencyId: "",
        agencyName: "",
        status: "active",
        licenseNumber: "",
        commissionRate: 0,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const canManageAgents =
    user?.role === "master_admin" || user?.role === "agency_admin";
  const canCreateAgent = canManageAgents;

  const filteredAgents = getFilteredAgents();
  const uniqueAgencies = Array.from(
    new Set(agents.map((agent) => agent.agencyId))
  )
    .map((agencyId) => agents.find((agent) => agent.agencyId === agencyId))
    .filter(Boolean);

  if (!canManageAgents) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="p-8">
          <div className="text-center">
            <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Access Restricted
            </h3>
            <p className="text-gray-600">
              You don't have permission to view agents.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agents</h1>
          <p className="text-gray-600 mt-1">
            Manage insurance agents and their information
          </p>
        </div>
        {canCreateAgent && (
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Agent
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
                  placeholder="Search agents by name, email, phone, license, or agency..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm bg-white min-w-[120px]"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {user?.role === "master_admin" && (
                <select
                  value={agencyFilter}
                  onChange={(e) => setAgencyFilter(e.target.value)}
                  className="px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm bg-white min-w-[140px]"
                >
                  <option value="">All Agencies</option>
                  {uniqueAgencies.map((agent) => (
                    <option key={agent?.agencyId} value={agent?.agencyId}>
                      {agent?.agencyName}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Agents
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredAgents.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Agents
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    filteredAgents.filter((agent) => agent.status === "active")
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Percent className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Avg Commission
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredAgents.length > 0
                    ? (
                        filteredAgents.reduce(
                          (sum, agent) => sum + agent.commissionRate,
                          0
                        ) / filteredAgents.length
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Agencies</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(filteredAgents.map((agent) => agent.agencyId)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agents List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Agency
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    License
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Commission
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Created
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium text-sm">
                            {agent.firstName[0]}
                            {agent.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {agent.firstName} {agent.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{agent.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-3 w-3 mr-1" />
                          <span className="truncate">{agent.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-3 w-3 mr-1" />
                          <span>{agent.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">
                          {agent.agencyName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm">
                        {agent.licenseNumber}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium">
                        {agent.commissionRate}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          statusColors[agent.status]
                        }`}
                      >
                        {agent.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900">
                        {formatDate(agent.createdAt)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewAgent(agent)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAgent(agent)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAgents.length === 0 && (
              <div className="text-center py-8">
                <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No agents found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Agent Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Agent"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <Input
                type="text"
                value={newAgent.firstName || ""}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, firstName: e.target.value })
                }
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <Input
                type="text"
                value={newAgent.lastName || ""}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, lastName: e.target.value })
                }
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={newAgent.email || ""}
              onChange={(e) =>
                setNewAgent({ ...newAgent, email: e.target.value })
              }
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              type="tel"
              value={newAgent.phone || ""}
              onChange={(e) =>
                setNewAgent({ ...newAgent, phone: e.target.value })
              }
              placeholder="Enter phone number"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agency ID
              </label>
              <Input
                type="text"
                value={newAgent.agencyId || ""}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, agencyId: e.target.value })
                }
                placeholder="Enter agency ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agency Name
              </label>
              <Input
                type="text"
                value={newAgent.agencyName || ""}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, agencyName: e.target.value })
                }
                placeholder="Enter agency name"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number
              </label>
              <Input
                type="text"
                value={newAgent.licenseNumber || ""}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, licenseNumber: e.target.value })
                }
                placeholder="Enter license number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commission Rate (%)
              </label>
              <Input
                type="number"
                step="0.1"
                value={newAgent.commissionRate || ""}
                onChange={(e) =>
                  setNewAgent({
                    ...newAgent,
                    commissionRate: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Enter commission rate"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={newAgent.status || "active"}
              onChange={(e) =>
                setNewAgent({
                  ...newAgent,
                  status: e.target.value as "active" | "inactive",
                })
              }
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md bg-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleCreateAgent} className="flex-1">
              Create Agent
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Agent Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Agent Details"
      >
        {selectedAgent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <p className="text-gray-900">{selectedAgent.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <p className="text-gray-900">{selectedAgent.lastName}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{selectedAgent.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <p className="text-gray-900">{selectedAgent.phone}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agency ID
                </label>
                <p className="text-gray-900">{selectedAgent.agencyId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agency Name
                </label>
                <p className="text-gray-900">{selectedAgent.agencyName}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <p className="text-gray-900">{selectedAgent.licenseNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission Rate
                </label>
                <p className="text-gray-900">{selectedAgent.commissionRate}%</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    statusColors[selectedAgent.status]
                  }`}
                >
                  {selectedAgent.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created At
                </label>
                <p className="text-gray-900">
                  {formatDate(selectedAgent.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditAgent(selectedAgent);
                }}
                className="flex-1"
              >
                Edit Agent
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowViewModal(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Agent Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Agent"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <Input
                type="text"
                value={newAgent.firstName || ""}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, firstName: e.target.value })
                }
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <Input
                type="text"
                value={newAgent.lastName || ""}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, lastName: e.target.value })
                }
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={newAgent.email || ""}
              onChange={(e) =>
                setNewAgent({ ...newAgent, email: e.target.value })
              }
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              type="tel"
              value={newAgent.phone || ""}
              onChange={(e) =>
                setNewAgent({ ...newAgent, phone: e.target.value })
              }
              placeholder="Enter phone number"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agency ID
              </label>
              <Input
                type="text"
                value={newAgent.agencyId || ""}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, agencyId: e.target.value })
                }
                placeholder="Enter agency ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agency Name
              </label>
              <Input
                type="text"
                value={newAgent.agencyName || ""}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, agencyName: e.target.value })
                }
                placeholder="Enter agency name"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number
              </label>
              <Input
                type="text"
                value={newAgent.licenseNumber || ""}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, licenseNumber: e.target.value })
                }
                placeholder="Enter license number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commission Rate (%)
              </label>
              <Input
                type="number"
                step="0.1"
                value={newAgent.commissionRate || ""}
                onChange={(e) =>
                  setNewAgent({
                    ...newAgent,
                    commissionRate: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Enter commission rate"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={newAgent.status || "active"}
              onChange={(e) =>
                setNewAgent({
                  ...newAgent,
                  status: e.target.value as "active" | "inactive",
                })
              }
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md bg-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleUpdateAgent} className="flex-1">
              Update Agent
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Agents;
