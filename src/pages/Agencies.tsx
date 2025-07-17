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
  Building,
  MapPin,
  Mail,
  Phone,
  Users,
  FileText,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import type { Agency } from "../types";

// Mock data
const mockAgencies: Agency[] = [
  {
    id: "ag1",
    name: "Prime Insurance Agency",
    email: "contact@primeinsurance.com",
    phone: "(555) 123-4567",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    status: "active",
    licenseNumber: "NY-INS-001234",
    createdAt: "2023-01-15T09:00:00Z",
    updatedAt: "2025-06-01T14:30:00Z",
  },
  {
    id: "ag2",
    name: "SecureLife Insurance",
    email: "info@securelife.com",
    phone: "(555) 987-6543",
    address: {
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
    },
    status: "active",
    licenseNumber: "CA-INS-005678",
    createdAt: "2023-03-22T11:15:00Z",
    updatedAt: "2025-05-15T16:45:00Z",
  },
  {
    id: "ag3",
    name: "Coastal Protection Services",
    email: "support@coastalprotection.com",
    phone: "(555) 456-7890",
    address: {
      street: "789 Beach Boulevard",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
    },
    status: "inactive",
    licenseNumber: "FL-INS-009012",
    createdAt: "2023-07-10T08:30:00Z",
    updatedAt: "2025-04-20T10:00:00Z",
  },
];

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
};

const Agencies = () => {
  const { user } = useAuthStore();
  const [agencies, setAgencies] = useState<Agency[]>(mockAgencies);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [newAgency, setNewAgency] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    licenseNumber: "",
  });

  // Filter agencies based on search and status
  const getFilteredAgencies = () => {
    let filteredAgencies = agencies;

    // Search filtering
    if (searchTerm) {
      filteredAgencies = filteredAgencies.filter(
        (agency) =>
          agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agency.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agency.phone.includes(searchTerm) ||
          agency.licenseNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          agency.address.city
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          agency.address.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filtering
    if (statusFilter) {
      filteredAgencies = filteredAgencies.filter(
        (agency) => agency.status === statusFilter
      );
    }

    return filteredAgencies;
  };

  const handleDeleteAgency = (agencyId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this agency? This action cannot be undone."
      )
    ) {
      setAgencies(agencies.filter((agency) => agency.id !== agencyId));
    }
  };

  const handleViewAgency = (agency: Agency) => {
    setSelectedAgency(agency);
    setShowViewModal(true);
  };

  const handleEditAgency = (agency: Agency) => {
    setSelectedAgency(agency);
    setNewAgency({
      name: agency.name,
      email: agency.email,
      phone: agency.phone,
      street: agency.address.street,
      city: agency.address.city,
      state: agency.address.state,
      zipCode: agency.address.zipCode,
      licenseNumber: agency.licenseNumber,
    });
    setShowEditModal(true);
  };

  const handleCreateAgency = () => {
    const agency: Agency = {
      id: `ag${Date.now()}`,
      name: newAgency.name,
      email: newAgency.email,
      phone: newAgency.phone,
      address: {
        street: newAgency.street,
        city: newAgency.city,
        state: newAgency.state,
        zipCode: newAgency.zipCode,
      },
      status: "active",
      licenseNumber: newAgency.licenseNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAgencies([...agencies, agency]);
    setShowCreateModal(false);
    setNewAgency({
      name: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      licenseNumber: "",
    });
  };

  const handleUpdateAgency = () => {
    if (!selectedAgency) return;

    const updatedAgency: Agency = {
      ...selectedAgency,
      name: newAgency.name,
      email: newAgency.email,
      phone: newAgency.phone,
      address: {
        street: newAgency.street,
        city: newAgency.city,
        state: newAgency.state,
        zipCode: newAgency.zipCode,
      },
      licenseNumber: newAgency.licenseNumber,
      updatedAt: new Date().toISOString(),
    };

    setAgencies(
      agencies.map((a) => (a.id === selectedAgency.id ? updatedAgency : a))
    );
    setShowEditModal(false);
    setSelectedAgency(null);
    setNewAgency({
      name: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      licenseNumber: "",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Only master admin can manage agencies
  const canManageAgencies = user?.role === "master_admin";

  const filteredAgencies = getFilteredAgencies();

  if (!canManageAgencies) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="p-8">
          <div className="text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Access Restricted
            </h3>
            <p className="text-gray-600">
              You don't have permission to view agencies.
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
          <h1 className="text-3xl font-bold text-gray-900">Agencies</h1>
          <p className="text-gray-600 mt-1">
            Manage insurance agencies and their information
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Agency
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search agencies by name, email, phone, license, or location..."
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
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
              <Building className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Agencies
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredAgencies.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Agencies
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    filteredAgencies.filter(
                      (agency) => agency.status === "active"
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Inactive Agencies
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    filteredAgencies.filter(
                      (agency) => agency.status === "inactive"
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  States Covered
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    new Set(
                      filteredAgencies.map((agency) => agency.address.state)
                    ).size
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agencies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAgencies.map((agency) => (
          <Card key={agency.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <Building className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <CardTitle className="text-lg">{agency.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      License: {agency.licenseNumber}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    statusColors[agency.status]
                  }`}
                >
                  {agency.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{agency.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{agency.phone}</span>
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p>{agency.address.street}</p>
                    <p>
                      {agency.address.city}, {agency.address.state}{" "}
                      {agency.address.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-xs text-gray-500 mb-3">
                  Created: {formatDate(agency.createdAt)}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewAgency(agency)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditAgency(agency)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAgency(agency.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAgencies.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No agencies found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create Agency Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Agency"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAgency}>Create Agency</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agency Name
            </label>
            <Input
              value={newAgency.name}
              onChange={(e) =>
                setNewAgency({ ...newAgency, name: e.target.value })
              }
              placeholder="Enter agency name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={newAgency.email}
                onChange={(e) =>
                  setNewAgency({ ...newAgency, email: e.target.value })
                }
                placeholder="contact@agency.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                value={newAgency.phone}
                onChange={(e) =>
                  setNewAgency({ ...newAgency, phone: e.target.value })
                }
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <Input
              value={newAgency.street}
              onChange={(e) =>
                setNewAgency({ ...newAgency, street: e.target.value })
              }
              placeholder="123 Main Street"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <Input
                value={newAgency.city}
                onChange={(e) =>
                  setNewAgency({ ...newAgency, city: e.target.value })
                }
                placeholder="New York"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <Input
                value={newAgency.state}
                onChange={(e) =>
                  setNewAgency({ ...newAgency, state: e.target.value })
                }
                placeholder="NY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <Input
                value={newAgency.zipCode}
                onChange={(e) =>
                  setNewAgency({ ...newAgency, zipCode: e.target.value })
                }
                placeholder="10001"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Number
            </label>
            <Input
              value={newAgency.licenseNumber}
              onChange={(e) =>
                setNewAgency({ ...newAgency, licenseNumber: e.target.value })
              }
              placeholder="NY-INS-123456"
            />
          </div>
        </div>
      </Modal>

      {/* View Agency Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Agency Details"
        footer={<Button onClick={() => setShowViewModal(false)}>Close</Button>}
      >
        {selectedAgency && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Agency Name
              </label>
              <p className="text-sm">{selectedAgency.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="text-sm">{selectedAgency.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <p className="text-sm">{selectedAgency.phone}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <p className="text-sm">
                {selectedAgency.address.street}
                <br />
                {selectedAgency.address.city}, {selectedAgency.address.state}{" "}
                {selectedAgency.address.zipCode}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  License Number
                </label>
                <p className="text-sm font-mono">
                  {selectedAgency.licenseNumber}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    statusColors[selectedAgency.status]
                  }`}
                >
                  {selectedAgency.status}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Created
              </label>
              <p className="text-sm">{formatDate(selectedAgency.createdAt)}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Agency Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Agency"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAgency}>Update Agency</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agency Name
            </label>
            <Input
              value={newAgency.name}
              onChange={(e) =>
                setNewAgency({ ...newAgency, name: e.target.value })
              }
              placeholder="Enter agency name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={newAgency.email}
                onChange={(e) =>
                  setNewAgency({ ...newAgency, email: e.target.value })
                }
                placeholder="contact@agency.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                value={newAgency.phone}
                onChange={(e) =>
                  setNewAgency({ ...newAgency, phone: e.target.value })
                }
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <Input
              value={newAgency.street}
              onChange={(e) =>
                setNewAgency({ ...newAgency, street: e.target.value })
              }
              placeholder="123 Main Street"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <Input
                value={newAgency.city}
                onChange={(e) =>
                  setNewAgency({ ...newAgency, city: e.target.value })
                }
                placeholder="New York"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <Input
                value={newAgency.state}
                onChange={(e) =>
                  setNewAgency({ ...newAgency, state: e.target.value })
                }
                placeholder="NY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <Input
                value={newAgency.zipCode}
                onChange={(e) =>
                  setNewAgency({ ...newAgency, zipCode: e.target.value })
                }
                placeholder="10001"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Number
            </label>
            <Input
              value={newAgency.licenseNumber}
              onChange={(e) =>
                setNewAgency({ ...newAgency, licenseNumber: e.target.value })
              }
              placeholder="NY-INS-123456"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Agencies;
