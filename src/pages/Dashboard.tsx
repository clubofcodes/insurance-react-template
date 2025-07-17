import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  FileText,
  Building,
  UserCheck,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Activity,
} from "lucide-react";
import { formatCurrency, formatDate } from "../lib/utils";

// Mock data - replace with actual API calls
const mockStats = {
  totalQuotes: 156,
  totalPremium: 1245600,
  totalAgencies: 12,
  totalAgents: 45,
  totalCustomers: 234,
  recentQuotes: [
    {
      id: "1",
      customerId: "1",
      customerName: "John Smith",
      agentId: "1",
      agentName: "Sarah Wilson",
      agencyId: "1",
      agencyName: "Premier Insurance",
      insuranceType: "auto" as const,
      status: "pending" as const,
      premium: 1200,
      deductible: 500,
      coverageAmount: 25000,
      terms: "6 months",
      validUntil: "2024-08-15",
      createdAt: "2024-02-15T10:30:00Z",
      updatedAt: "2024-02-15T10:30:00Z",
    },
    {
      id: "2",
      customerId: "2",
      customerName: "Emily Johnson",
      agentId: "2",
      agentName: "Mike Davis",
      agencyId: "1",
      agencyName: "Premier Insurance",
      insuranceType: "home" as const,
      status: "approved" as const,
      premium: 2400,
      deductible: 1000,
      coverageAmount: 350000,
      terms: "12 months",
      validUntil: "2025-02-15",
      createdAt: "2024-02-14T14:20:00Z",
      updatedAt: "2024-02-15T09:15:00Z",
    },
  ],
  monthlyStats: [
    { month: "Jan", quotes: 23, premium: 185400 },
    { month: "Feb", quotes: 31, premium: 248600 },
    { month: "Mar", quotes: 28, premium: 225800 },
    { month: "Apr", quotes: 35, premium: 289400 },
    { month: "May", quotes: 39, premium: 296200 },
  ],
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  description?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change && (
        <div className="flex items-center text-xs text-muted-foreground">
          <TrendingUp className="h-3 w-3 mr-1" />
          {change}
        </div>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

const QuoteCard = ({
  quote,
}: {
  quote: (typeof mockStats.recentQuotes)[0];
}) => (
  <div className="flex items-center space-x-4 p-4 border rounded-lg">
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900 truncate">
          {quote.customerName}
        </p>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            quote.status === "approved"
              ? "bg-green-100 text-green-800"
              : quote.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {quote.status}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-500 mt-1">
        <span className="capitalize">{quote.insuranceType}</span>
        <span className="mx-2">•</span>
        <span>{formatCurrency(quote.premium)}</span>
        <span className="mx-2">•</span>
        <span>{formatDate(quote.createdAt)}</span>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Agent: {quote.agentName} • {quote.agencyName}
      </p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const getStatsForRole = () => {
    switch (user?.role) {
      case "master_admin":
        return [
          {
            title: "Total Quotes",
            value: mockStats.totalQuotes,
            icon: FileText,
            change: "+12% from last month",
          },
          {
            title: "Total Premium",
            value: formatCurrency(mockStats.totalPremium),
            icon: DollarSign,
            change: "+8% from last month",
          },
          {
            title: "Agencies",
            value: mockStats.totalAgencies,
            icon: Building,
            change: "+2 new this month",
          },
          {
            title: "Agents",
            value: mockStats.totalAgents,
            icon: UserCheck,
            change: "+5 new this month",
          },
        ];
      case "agency_admin":
        return [
          {
            title: "Agency Quotes",
            value: 89,
            icon: FileText,
            change: "+15% from last month",
          },
          {
            title: "Agency Premium",
            value: formatCurrency(745600),
            icon: DollarSign,
            change: "+12% from last month",
          },
          {
            title: "Active Agents",
            value: 12,
            icon: UserCheck,
            change: "+1 new this month",
          },
          {
            title: "Customers",
            value: mockStats.totalCustomers,
            icon: Users,
            change: "+18 new this month",
          },
        ];
      case "agent":
        return [
          {
            title: "My Quotes",
            value: 24,
            icon: FileText,
            change: "+6 this week",
          },
          {
            title: "My Premium",
            value: formatCurrency(156800),
            icon: DollarSign,
            change: "+$12k this month",
          },
          {
            title: "Active Customers",
            value: 45,
            icon: Users,
            change: "+5 new this month",
          },
          {
            title: "This Month",
            value: 8,
            icon: Calendar,
            change: "quotes created",
          },
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.firstName}! Here's what's happening with your{" "}
          {user?.role?.replace("_", " ")}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest quotes and updates from your{" "}
              {user?.role === "master_admin"
                ? "system"
                : user?.role === "agency_admin"
                ? "agency"
                : "portfolio"}
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockStats.recentQuotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => navigate("/quotes")}
            >
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Create New Quote</p>
                <p className="text-xs text-gray-500">
                  Start a new insurance quote
                </p>
              </div>
            </div>
            {user?.role !== "agent" && (
              <div
                className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => navigate("/agents")}
              >
                <UserCheck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Add New Agent</p>
                  <p className="text-xs text-gray-500">Register a new agent</p>
                </div>
              </div>
            )}
            <div
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => navigate("/customers")}
            >
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Customer Management</p>
                <p className="text-xs text-gray-500">
                  View and manage customers
                </p>
              </div>
            </div>
            <div
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => navigate("/dashboard")}
            >
              <Activity className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">View Reports</p>
                <p className="text-xs text-gray-500">Analytics and insights</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
