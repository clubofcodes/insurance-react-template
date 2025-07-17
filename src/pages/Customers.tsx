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
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserPlus,
  UserX,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import type { Customer } from "../types";

// Mock data
const mockCustomers: Customer[] = [
  {
    id: "c1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-06-15",
    address: {
      street: "123 Elm Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2025-06-01T14:30:00Z",
  },
  {
    id: "c2",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@email.com",
    phone: "(555) 234-5678",
    dateOfBirth: "1990-03-22",
    address: {
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
    },
    status: "active",
    createdAt: "2024-02-20T11:15:00Z",
    updatedAt: "2025-05-15T16:45:00Z",
  },
  {
    id: "c3",
    firstName: "Robert",
    lastName: "Brown",
    email: "robert.brown@email.com",
    phone: "(555) 345-6789",
    dateOfBirth: "1978-11-08",
    address: {
      street: "789 Pine Road",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
    },
    status: "active",
    createdAt: "2024-03-10T09:30:00Z",
    updatedAt: "2025-07-01T12:20:00Z",
  },
  {
    id: "c4",
    firstName: "Jessica",
    lastName: "Wilson",
    email: "jessica.wilson@email.com",
    phone: "(555) 456-7890",
    dateOfBirth: "1992-09-12",
    address: {
      street: "321 Maple Drive",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
    },
    status: "inactive",
    createdAt: "2024-04-05T13:45:00Z",
    updatedAt: "2025-04-20T10:00:00Z",
  },
  {
    id: "c5",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@email.com",
    phone: "(555) 567-8901",
    dateOfBirth: "1980-12-03",
    address: {
      street: "654 Cedar Lane",
      city: "Dallas",
      state: "TX",
      zipCode: "75201",
    },
    status: "active",
    createdAt: "2024-05-12T08:20:00Z",
    updatedAt: "2025-06-10T15:30:00Z",
  },
];

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
};

const Customers = () => {
  const { user } = useAuthStore();
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // CRUD state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    status: "active",
  });

  // Filter customers based on search and status
  const getFilteredCustomers = () => {
    let filteredCustomers = customers;

    // Search filtering
    if (searchTerm) {
      filteredCustomers = filteredCustomers.filter(
        (customer) =>
          `${customer.firstName} ${customer.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm) ||
          customer.address.city
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          customer.address.state
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Status filtering
    if (statusFilter) {
      filteredCustomers = filteredCustomers.filter(
        (customer) => customer.status === statusFilter
      );
    }

    return filteredCustomers;
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this customer? This action cannot be undone."
      )
    ) {
      setCustomers(customers.filter((customer) => customer.id !== customerId));
    }
  };

  // CRUD handlers
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setNewCustomer({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      dateOfBirth: customer.dateOfBirth,
      address: {
        street: customer.address.street,
        city: customer.address.city,
        state: customer.address.state,
        zipCode: customer.address.zipCode,
      },
      status: customer.status,
    });
    setShowEditModal(true);
  };

  const handleCreateCustomer = () => {
    const customer: Customer = {
      id: `c${Date.now()}`,
      firstName: newCustomer.firstName || "",
      lastName: newCustomer.lastName || "",
      email: newCustomer.email || "",
      phone: newCustomer.phone || "",
      dateOfBirth: newCustomer.dateOfBirth || "",
      address: {
        street: newCustomer.address?.street || "",
        city: newCustomer.address?.city || "",
        state: newCustomer.address?.state || "",
        zipCode: newCustomer.address?.zipCode || "",
      },
      status: newCustomer.status || "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCustomers([...customers, customer]);
    setShowCreateModal(false);
    setNewCustomer({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
      status: "active",
    });
  };

  const handleUpdateCustomer = () => {
    if (selectedCustomer) {
      const updatedCustomer: Customer = {
        ...selectedCustomer,
        firstName: newCustomer.firstName || selectedCustomer.firstName,
        lastName: newCustomer.lastName || selectedCustomer.lastName,
        email: newCustomer.email || selectedCustomer.email,
        phone: newCustomer.phone || selectedCustomer.phone,
        dateOfBirth: newCustomer.dateOfBirth || selectedCustomer.dateOfBirth,
        address: {
          street:
            newCustomer.address?.street || selectedCustomer.address.street,
          city: newCustomer.address?.city || selectedCustomer.address.city,
          state: newCustomer.address?.state || selectedCustomer.address.state,
          zipCode:
            newCustomer.address?.zipCode || selectedCustomer.address.zipCode,
        },
        status: newCustomer.status || selectedCustomer.status,
        updatedAt: new Date().toISOString(),
      };
      setCustomers(
        customers.map((c) =>
          c.id === selectedCustomer.id ? updatedCustomer : c
        )
      );
      setShowEditModal(false);
      setSelectedCustomer(null);
      setNewCustomer({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
        },
        status: "active",
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

  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Helper function to update address fields properly
  const updateCustomerAddress = (
    field: keyof Customer["address"],
    value: string
  ) => {
    setNewCustomer({
      ...newCustomer,
      address: {
        street: newCustomer.address?.street || "",
        city: newCustomer.address?.city || "",
        state: newCustomer.address?.state || "",
        zipCode: newCustomer.address?.zipCode || "",
        [field]: value,
      },
    });
  };

  const canManageCustomers =
    user?.role === "master_admin" ||
    user?.role === "agency_admin" ||
    user?.role === "agent";

  const filteredCustomers = getFilteredCustomers();

  if (!canManageCustomers) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="p-8">
          <div className="text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Access Restricted
            </h3>
            <p className="text-gray-600">
              You don't have permission to view customers.
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
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">
            Manage customer information and profiles
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Customer
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
                  placeholder="Search customers by name, email, phone, or location..."
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
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredCustomers.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Customers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    filteredCustomers.filter(
                      (customer) => customer.status === "active"
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
              <UserX className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Inactive Customers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    filteredCustomers.filter(
                      (customer) => customer.status === "inactive"
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
                <p className="text-sm font-medium text-gray-600">States</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    new Set(
                      filteredCustomers.map(
                        (customer) => customer.address.state
                      )
                    ).size
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium">
                      {customer.firstName[0]}
                      {customer.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {customer.firstName} {customer.lastName}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Age: {calculateAge(customer.dateOfBirth)} years
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    statusColors[customer.status]
                  }`}
                >
                  {customer.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Born: {formatDate(customer.dateOfBirth)}</span>
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p>{customer.address.street}</p>
                    <p>
                      {customer.address.city}, {customer.address.state}{" "}
                      {customer.address.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-xs text-gray-500 mb-3">
                  Customer since: {formatDate(customer.createdAt)}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewCustomer(customer)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditCustomer(customer)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCustomer(customer.id)}
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

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No customers found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create Customer Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Customer"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <Input
                type="text"
                value={newCustomer.firstName || ""}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, firstName: e.target.value })
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
                value={newCustomer.lastName || ""}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, lastName: e.target.value })
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
              value={newCustomer.email || ""}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
              placeholder="Enter email address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                type="tel"
                value={newCustomer.phone || ""}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <Input
                type="date"
                value={newCustomer.dateOfBirth || ""}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    dateOfBirth: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <Input
              type="text"
              value={newCustomer.address?.street || ""}
              onChange={(e) => updateCustomerAddress("street", e.target.value)}
              placeholder="Enter street address"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <Input
                type="text"
                value={newCustomer.address?.city || ""}
                onChange={(e) => updateCustomerAddress("city", e.target.value)}
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <Input
                type="text"
                value={newCustomer.address?.state || ""}
                onChange={(e) => updateCustomerAddress("state", e.target.value)}
                placeholder="Enter state"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <Input
                type="text"
                value={newCustomer.address?.zipCode || ""}
                onChange={(e) =>
                  updateCustomerAddress("zipCode", e.target.value)
                }
                placeholder="Enter ZIP code"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={newCustomer.status || "active"}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  status: e.target.value as "active" | "inactive",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleCreateCustomer} className="flex-1">
              Create Customer
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

      {/* View Customer Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Customer Details"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <p className="text-gray-900">{selectedCustomer.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <p className="text-gray-900">{selectedCustomer.lastName}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{selectedCustomer.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <p className="text-gray-900">{selectedCustomer.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <p className="text-gray-900">
                  {calculateAge(selectedCustomer.dateOfBirth)} years old
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <p className="text-gray-900">
                {selectedCustomer.address.street}
                <br />
                {selectedCustomer.address.city},{" "}
                {selectedCustomer.address.state}{" "}
                {selectedCustomer.address.zipCode}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    statusColors[selectedCustomer.status]
                  }`}
                >
                  {selectedCustomer.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created At
                </label>
                <p className="text-gray-900">
                  {formatDate(selectedCustomer.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditCustomer(selectedCustomer);
                }}
                className="flex-1"
              >
                Edit Customer
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

      {/* Edit Customer Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Customer"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <Input
                type="text"
                value={newCustomer.firstName || ""}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, firstName: e.target.value })
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
                value={newCustomer.lastName || ""}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, lastName: e.target.value })
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
              value={newCustomer.email || ""}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
              placeholder="Enter email address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                type="tel"
                value={newCustomer.phone || ""}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <Input
                type="date"
                value={newCustomer.dateOfBirth || ""}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    dateOfBirth: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <Input
              type="text"
              value={newCustomer.address?.street || ""}
              onChange={(e) => updateCustomerAddress("street", e.target.value)}
              placeholder="Enter street address"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <Input
                type="text"
                value={newCustomer.address?.city || ""}
                onChange={(e) => updateCustomerAddress("city", e.target.value)}
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <Input
                type="text"
                value={newCustomer.address?.state || ""}
                onChange={(e) => updateCustomerAddress("state", e.target.value)}
                placeholder="Enter state"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <Input
                type="text"
                value={newCustomer.address?.zipCode || ""}
                onChange={(e) =>
                  updateCustomerAddress("zipCode", e.target.value)
                }
                placeholder="Enter ZIP code"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={newCustomer.status || "active"}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  status: e.target.value as "active" | "inactive",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleUpdateCustomer} className="flex-1">
              Update Customer
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

export default Customers;
