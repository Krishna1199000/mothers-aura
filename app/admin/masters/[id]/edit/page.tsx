"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RoleBasedHeader } from "@/components/RoleBasedHeader";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Globe, FileText, Users } from "lucide-react";

interface User {
  id: string;
  name: string;
  role: string;
}

interface Master {
  id: string;
  companyName: string;
  ownerName: string;
  addressLine1: string;
  addressLine2?: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  phoneNo: string;
  faxNo?: string;
  email: string;
  website?: string;
  paymentTerms: string;
  shippedBy: string;
  organizationType: string;
  businessType: string;
  businessRegNo?: string;
  panNo?: string;
  sellerPermitNo?: string;
  cstTinNo?: string;
  tradeBodyMembership?: string;
  referenceType: string;
  references: Array<{
    id: string;
    companyName: string;
    contactPerson: string;
    contactNo: string;
  }>;
  notes?: string;
  authorizedById: string;
  accountManagerId: string;
  brokerName?: string;
  partyGroup: string;
  salesExecutiveId: string;
  leadSourceId: string;
  limit: number;
}

export default function EditMasterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [admins, setAdmins] = useState<User[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [master, setMaster] = useState<Master | null>(null);
  const [referenceCount, setReferenceCount] = useState(2);

  // Form state
  const [formData, setFormData] = useState({
    // Company Details
    companyName: "",
    ownerName: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
    phoneNo: "",
    faxNo: "",
    email: "",
    website: "",
    paymentTerms: "COD",
    shippedBy: "FEDEX",

    // Organization Details
    organizationType: "SOLE_PROPRIETOR",
    businessType: "RETAILER",
    businessRegNo: "",
    panNo: "",
    sellerPermitNo: "",
    cstTinNo: "",
    tradeBodyMembership: "AGS",

    // Additional Information
    referenceType: "REFERENCE",
    references: Array(5).fill({
      id: "",
      companyName: "",
      contactPerson: "",
      contactNo: "",
    }),
    notes: "",
    authorizedById: "",
    accountManagerId: "",
    brokerName: "",
    partyGroup: "Customer",
    salesExecutiveId: "",
    leadSourceId: "",
    limit: "0",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
      return;
    }
    
    fetchUsers();
    fetchMaster();
  }, [session, status, router, id]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const users = await response.json();
        setAdmins(users.filter((user: User) => user.role === 'ADMIN'));
        setEmployees(users.filter((user: User) => user.role === 'EMPLOYEE'));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchMaster = async () => {
    try {
      const response = await fetch(`/api/admin/masters/${id}`);
      if (response.ok) {
        const masterData = await response.json();
        setMaster(masterData);
        
        // Populate form with master data
        setFormData({
          companyName: masterData.companyName || "",
          ownerName: masterData.ownerName || "",
          addressLine1: masterData.addressLine1 || "",
          addressLine2: masterData.addressLine2 || "",
          country: masterData.country || "",
          state: masterData.state || "",
          city: masterData.city || "",
          postalCode: masterData.postalCode || "",
          phoneNo: masterData.phoneNo || "",
          faxNo: masterData.faxNo || "",
          email: masterData.email || "",
          website: masterData.website || "",
          paymentTerms: masterData.paymentTerms || "COD",
          shippedBy: masterData.shippedBy || "FEDEX",
          organizationType: masterData.organizationType || "SOLE_PROPRIETOR",
          businessType: masterData.businessType || "RETAILER",
          businessRegNo: masterData.businessRegNo || "",
          panNo: masterData.panNo || "",
          sellerPermitNo: masterData.sellerPermitNo || "",
          cstTinNo: masterData.cstTinNo || "",
          tradeBodyMembership: masterData.tradeBodyMembership || "AGS",
          referenceType: masterData.referenceType || "REFERENCE",
          references: masterData.references || Array(5).fill({
            id: "",
            companyName: "",
            contactPerson: "",
            contactNo: "",
          }),
          notes: masterData.notes || "",
          authorizedById: masterData.authorizedById || "",
          accountManagerId: masterData.accountManagerId || "",
          brokerName: masterData.brokerName || "",
          partyGroup: masterData.partyGroup || "Customer",
          salesExecutiveId: masterData.salesExecutiveId || "",
          leadSourceId: masterData.leadSourceId || "",
          limit: masterData.limit?.toString() || "0",
        });

        setReferenceCount(masterData.references?.length || 2);
      }
    } catch (error) {
      console.error("Error fetching master:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.authorizedById || !formData.accountManagerId || !formData.salesExecutiveId || !formData.leadSourceId) {
        throw new Error("Please select all required user fields");
      }

      const response = await fetch(`/api/admin/masters/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update master");
      }

      router.push('/admin/masters');
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReferenceChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      ),
    }));
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (!master) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar />
        <RoleBasedHeader />
        
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>Master not found</AlertDescription>
          </Alert>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <RoleBasedHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Edit Master</h1>
            <p className="text-muted-foreground">
              Update customer/vendor master information
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  <CardTitle>Company Details</CardTitle>
                </div>
                <CardDescription>
                  Basic information about the company
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name *</Label>
                    <Input
                      id="ownerName"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange("ownerName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    value={formData.addressLine1}
                    onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    value={formData.addressLine2}
                    onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNo">Phone No *</Label>
                    <Input
                      id="phoneNo"
                      value={formData.phoneNo}
                      onChange={(e) => handleInputChange("phoneNo", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faxNo">Fax No</Label>
                    <Input
                      id="faxNo"
                      value={formData.faxNo}
                      onChange={(e) => handleInputChange("faxNo", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms *</Label>
                    <Select
                      value={formData.paymentTerms}
                      onValueChange={(value) => handleInputChange("paymentTerms", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COD">COD</SelectItem>
                        <SelectItem value="ADVANCE_PAYMENT">Advance Payment</SelectItem>
                        <SelectItem value="WITHIN_5_DAYS">Within 5 Days</SelectItem>
                        <SelectItem value="WITHIN_7_DAYS">Within 7 Days</SelectItem>
                        <SelectItem value="WITHIN_15_DAYS">Within 15 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippedBy">Shipped By *</Label>
                    <Select
                      value={formData.shippedBy}
                      onValueChange={(value) => handleInputChange("shippedBy", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FEDEX">FedEx</SelectItem>
                        <SelectItem value="UPS">UPS</SelectItem>
                        <SelectItem value="USPS">USPS</SelectItem>
                        <SelectItem value="DHL">DHL</SelectItem>
                        <SelectItem value="HAND_DELIVERY">Hand Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organization Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <CardTitle>Nature of Organization</CardTitle>
                </div>
                <CardDescription>
                  Organization type and business details
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationType">Organization Type *</Label>
                    <Select
                      value={formData.organizationType}
                      onValueChange={(value) => handleInputChange("organizationType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOLE_PROPRIETOR">Sole Proprietor</SelectItem>
                        <SelectItem value="CORPORATION">Corporation</SelectItem>
                        <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                        <SelectItem value="PARTNERSHIP">Partnership</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) => handleInputChange("businessType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RETAILER">Retailer</SelectItem>
                        <SelectItem value="BROKER">Broker</SelectItem>
                        <SelectItem value="DIAMOND_DEALER">Diamond Dealer</SelectItem>
                        <SelectItem value="MANUFACTURER">Manufacturer</SelectItem>
                        <SelectItem value="WHOLESALER">Wholesaler</SelectItem>
                        <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                        <SelectItem value="JEWELRY_DEALER">Jewelry Dealer</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessRegNo">Business Registration No</Label>
                    <Input
                      id="businessRegNo"
                      value={formData.businessRegNo}
                      onChange={(e) => handleInputChange("businessRegNo", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panNo">PAN No/Tax ID No</Label>
                    <Input
                      id="panNo"
                      value={formData.panNo}
                      onChange={(e) => handleInputChange("panNo", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sellerPermitNo">Seller Permit No</Label>
                    <Input
                      id="sellerPermitNo"
                      value={formData.sellerPermitNo}
                      onChange={(e) => handleInputChange("sellerPermitNo", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cstTinNo">CST/TIN No</Label>
                    <Input
                      id="cstTinNo"
                      value={formData.cstTinNo}
                      onChange={(e) => handleInputChange("cstTinNo", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tradeBodyMembership">Trade Body Membership</Label>
                  <Select
                    value={formData.tradeBodyMembership}
                    onValueChange={(value) => handleInputChange("tradeBodyMembership", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AGS">AGS</SelectItem>
                      <SelectItem value="AGTA">AGTA</SelectItem>
                      <SelectItem value="JA">JA</SelectItem>
                      <SelectItem value="JBT">JBT</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <CardTitle>Additional Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="space-y-4">
                  <Label>Reference Type *</Label>
                  <RadioGroup
                    value={formData.referenceType}
                    onValueChange={(value) => {
                      handleInputChange("referenceType", value);
                      setReferenceCount(value === "REFERENCE" ? 2 : 0);
                    }}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="REFERENCE" id="reference" />
                      <Label htmlFor="reference">Reference (minimum two)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="NO_REFERENCE" id="no-reference" />
                      <Label htmlFor="no-reference">No Reference (Advance Pay Only)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.referenceType === "REFERENCE" && (
                  <div className="space-y-4">
                    {Array.from({ length: referenceCount }).map((_, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                        <div className="space-y-2">
                          <Label>Company Name *</Label>
                          <Input
                            value={formData.references[index]?.companyName || ""}
                            onChange={(e) => handleReferenceChange(index, "companyName", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Contact Person *</Label>
                          <Input
                            value={formData.references[index]?.contactPerson || ""}
                            onChange={(e) => handleReferenceChange(index, "contactPerson", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Contact No *</Label>
                          <Input
                            value={formData.references[index]?.contactNo || ""}
                            onChange={(e) => handleReferenceChange(index, "contactNo", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="authorizedBy">Authorized By *</Label>
                    <Select
                      value={formData.authorizedById}
                      onValueChange={(value) => handleInputChange("authorizedById", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Authorized By" />
                      </SelectTrigger>
                      <SelectContent>
                        {admins.map((admin) => (
                          <SelectItem key={admin.id} value={admin.id}>
                            {admin.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountManager">Account Manager *</Label>
                    <Select
                      value={formData.accountManagerId}
                      onValueChange={(value) => handleInputChange("accountManagerId", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Account Manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {admins.map((admin) => (
                          <SelectItem key={admin.id} value={admin.id}>
                            {admin.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brokerName">Broker Name</Label>
                  <Input
                    id="brokerName"
                    value={formData.brokerName}
                    onChange={(e) => handleInputChange("brokerName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partyGroup">Party Group *</Label>
                  <Select
                    value={formData.partyGroup}
                    onValueChange={(value) => handleInputChange("partyGroup", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salesExecutive">Sales Executive *</Label>
                    <Select
                      value={formData.salesExecutiveId}
                      onValueChange={(value) => handleInputChange("salesExecutiveId", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Sales Executive" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leadSource">Lead Source *</Label>
                    <Select
                      value={formData.leadSourceId}
                      onValueChange={(value) => handleInputChange("leadSourceId", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Lead Source" />
                      </SelectTrigger>
                      <SelectContent>
                        {admins.map((admin) => (
                          <SelectItem key={admin.id} value={admin.id}>
                            {admin.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limit">Limit *</Label>
                  <Input
                    id="limit"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.limit}
                    onChange={(e) => handleInputChange("limit", e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/masters')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Master"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

