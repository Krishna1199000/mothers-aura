"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Shield, UserCheck, Crown, Eye, EyeOff, Edit2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER';
  approvalStatus: string;
  approvalAttempts: number;
  createdAt: string;
}

export default function ManageUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [editingPassword, setEditingPassword] = useState<string | null>(null);
  const [passwordValues, setPasswordValues] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
      return;
    }
    
    // Check if user is admin (for now, we'll check this on the frontend)
    // In a real app, this should be verified on the backend
    fetchUsers();
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setUsers(Array.isArray(data) ? data : []);
        const initialPasswordValues: Record<string, string> = {};
        (Array.isArray(data) ? data : []).forEach((user: User) => {
          if (user.password) {
            initialPasswordValues[user.id] = user.password;
          }
        });
        setPasswordValues(initialPasswordValues);
        setMessage("");
      } else {
        setMessage(data?.details || data?.error || "Failed to fetch users");
      }
    } catch (error) {
      setMessage("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    setUpdating(userId);
    try {
      const response = await fetch('/api/admin/users/update-role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        setMessage(`User role updated successfully to ${newRole}`);
        toast.success("Role Updated", {
          description: `User role updated successfully to ${newRole}`,
        });
        fetchUsers(); // Refresh the list
      } else {
        const error = await response.json();
        const errorMsg = error.error || "Failed to update user role";
        setMessage(errorMsg);
        toast.error("Update Failed", {
          description: errorMsg,
        });
      }
    } catch (error) {
      setMessage("Error updating user role");
    } finally {
      setUpdating(null);
    }
  };

  const updateUserPassword = async (userId: string) => {
    const newPassword = passwordValues[userId];
    if (!newPassword || newPassword.trim() === '') {
      setMessage("Password cannot be empty");
      toast.error("Validation Error", {
        description: "Password cannot be empty",
      });
      return;
    }

    setUpdating(userId);
    try {
      const response = await fetch('/api/admin/users/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, password: newPassword }),
      });

      if (response.ok) {
        setMessage("Password updated successfully");
        toast.success("Password Updated", {
          description: "User password has been updated successfully",
        });
        setEditingPassword(null);
        setPasswordValues({ ...passwordValues, [userId]: newPassword });
        fetchUsers(); // Refresh the list
      } else {
        const error = await response.json();
        const errorMsg = error.error || "Failed to update password";
        setMessage(errorMsg);
        toast.error("Update Failed", {
          description: errorMsg,
        });
      }
    } catch (error) {
      setMessage("Error updating password");
      toast.error("Update Failed", {
        description: "Error updating password",
      });
    } finally {
      setUpdating(null);
    }
  };

  const startEditingPassword = (userId: string, currentPassword: string = '') => {
    setEditingPassword(userId);
    setPasswordValues({ ...passwordValues, [userId]: currentPassword });
  };

  const cancelEditingPassword = (userId: string, originalPassword: string = '') => {
    setEditingPassword(null);
    setPasswordValues({ ...passwordValues, [userId]: originalPassword });
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords({ ...showPasswords, [userId]: !showPasswords[userId] });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'EMPLOYEE':
        return 'default';
      case 'CUSTOMER':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="w-4 h-4" />;
      case 'EMPLOYEE':
        return <Shield className="w-4 h-4" />;
      case 'CUSTOMER':
        return <UserCheck className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (status === "loading" || loading) {
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

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Manage Users</h1>
              <p className="text-muted-foreground">
                Manage user roles and permissions across the platform
              </p>
            </div>
          </div>

          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admins</CardTitle>
                <Crown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter(user => user.role === 'ADMIN').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employees</CardTitle>
                <Shield className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter(user => user.role === 'EMPLOYEE').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Manage user roles and permissions. Changes take effect immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Approval</TableHead>
                    <TableHead>Member Since</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const isEditing = editingPassword === user.id;
                    const isPasswordVisible = showPasswords[user.id];
                    const displayPassword = user.password || 'No password';
                    // Check if password is hashed (starts with $2a$, $2b$, or $2y$)
                    const isHashed = user.password?.startsWith('$2a$') || 
                                     user.password?.startsWith('$2b$') || 
                                     user.password?.startsWith('$2y$');
                    // Show actual password if visible and not hashed, otherwise show masked
                    const showPassword = isHashed 
                      ? '******** (Hashed)' 
                      : (isPasswordVisible ? displayPassword : '••••••••');
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getRoleIcon(user.role)}
                            {user.name}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type={isPasswordVisible ? "text" : "password"}
                                value={passwordValues[user.id] || ''}
                                onChange={(e) => setPasswordValues({ ...passwordValues, [user.id]: e.target.value })}
                                className="w-48"
                                autoFocus
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => togglePasswordVisibility(user.id)}
                                disabled={updating === user.id}
                              >
                                {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateUserPassword(user.id)}
                                disabled={updating === user.id}
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => cancelEditingPassword(user.id, user.password || '')}
                                disabled={updating === user.id}
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm max-w-xs truncate">
                                {showPassword}
                              </span>
                              {!isHashed && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => togglePasswordVisibility(user.id)}
                                  className="h-6 w-6 p-0"
                                  title={isPasswordVisible ? "Hide password" : "Show password"}
                                >
                                  {isPasswordVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditingPassword(user.id, user.password || '')}
                                className="h-6 w-6 p-0"
                                disabled={updating === user.id}
                                title="Edit password"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge
                              variant={
                                user.approvalStatus === "APPROVED"
                                  ? "default"
                                  : user.approvalStatus === "REJECTED"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {user.approvalStatus}
                            </Badge>
                            {user.approvalStatus === "REJECTED" && (
                              <span className="text-[10px] text-muted-foreground">
                                Attempts: {user.approvalAttempts} / 3
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <Select
                              value={user.role}
                              onValueChange={(newRole) =>
                                updateUserRole(user.id, newRole)
                              }
                              disabled={updating === user.id}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CUSTOMER">
                                  Customer
                                </SelectItem>
                                <SelectItem value="EMPLOYEE">
                                  Employee
                                </SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            {user.role === "CUSTOMER" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={updating === user.id}
                                  onClick={async () => {
                                    setUpdating(user.id);
                                    try {
                                      const res = await fetch(
                                        "/api/admin/users/approve",
                                        {
                                          method: "POST",
                                          headers: {
                                            "Content-Type": "application/json",
                                          },
                                          body: JSON.stringify({
                                            userId: user.id,
                                          }),
                                        },
                                      );
                                      const data = await res.json();
                                      if (!res.ok) {
                                        toast.error("Approve Failed", {
                                          description:
                                            data.error ||
                                            "Failed to approve user",
                                        });
                                      } else {
                                        toast.success("User Approved", {
                                          description:
                                            "Customer can now access the panel.",
                                        });
                                        fetchUsers();
                                      }
                                    } finally {
                                      setUpdating(null);
                                    }
                                  }}
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={updating === user.id}
                                  onClick={async () => {
                                    setUpdating(user.id);
                                    try {
                                      const res = await fetch(
                                        "/api/admin/users/reject",
                                        {
                                          method: "POST",
                                          headers: {
                                            "Content-Type": "application/json",
                                          },
                                          body: JSON.stringify({
                                            userId: user.id,
                                          }),
                                        },
                                      );
                                      const data = await res.json();
                                      if (!res.ok) {
                                        toast.error("Reject Failed", {
                                          description:
                                            data.error ||
                                            "Failed to reject user",
                                        });
                                      } else {
                                        toast.success("User Rejected", {
                                          description:
                                            "Customer will be notified by email.",
                                        });
                                        fetchUsers();
                                      }
                                    } finally {
                                      setUpdating(null);
                                    }
                                  }}
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {users.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role Descriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Role Descriptions</CardTitle>
              <CardDescription>
                Understanding different user roles and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Crown className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-600">Admin</h4>
                  <p className="text-sm text-muted-foreground">
                    Full access to all features including user management, dashboard, and profile settings.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-600">Employee</h4>
                  <p className="text-sm text-muted-foreground">
                    Access to dashboard and profile settings. Can assist customers and manage orders.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <UserCheck className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-600">Customer</h4>
                  <p className="text-sm text-muted-foreground">
                    Access to dashboard for browsing diamonds and profile management. Can place orders.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}


