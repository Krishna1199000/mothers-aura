"use client";

import { useState, useEffect } from "react";
import { Bell, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { ImageUpload } from "@/components/ui/image-upload";
import Image from "next/image";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  imageUrl?: string;
  isRead: boolean;
  createdAt: string;
}

interface Task {
  id: string;
  name: string;
  description: string;
  type: "EMPLOYEE" | "CUSTOMER" | "BOTH";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  isRead: boolean;
  createdAt: string;
}

export function NotificationBar() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isCreateNotificationOpen, setIsCreateNotificationOpen] = useState(false);
  const [isCreatingNotification, setIsCreatingNotification] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "OFFER",
    targetRoles: [] as string[],
    imageUrl: "",
  });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
  const isEmployee = (session?.user as { role?: string })?.role === "EMPLOYEE";
  const isCustomer = (session?.user as { role?: string })?.role === "CUSTOMER";

  useEffect(() => {
    fetchNotificationsAndTasks();
  }, []);

  const fetchNotificationsAndTasks = async () => {
    try {
      const [notificationsRes, tasksRes] = await Promise.all([
        fetch("/api/notifications"),
        fetch("/api/tasks"),
      ]);

      if (notificationsRes.ok) {
        const notifData = await notificationsRes.json();
        console.log('Fetched notifications:', notifData);
        setNotifications(notifData);
        setUnreadCount(notifData.filter((n: Notification) => !n.isRead).length);
      }

      if (tasksRes.ok) {
        const taskData = await tasksRes.json();
        setTasks(taskData);
      }
    } catch (error) {
      console.error("Error fetching notifications/tasks:", error);
    }
  };



  const handleDeleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: `${data.count} notification(s) deleted`,
      });

      fetchNotificationsAndTasks();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const handleCreateNotification = async () => {
    if (isCreatingNotification || isImageUploading) return; // Prevent duplicate submissions or during upload
    
    try {
      setIsCreatingNotification(true);
      
      console.log('Creating notification with data:', newNotification);
      
      // If an image was chosen but URL hasn't been set yet, block submission
      if (isImageUploading) {
        throw new Error("Image is still uploading. Please wait.");
      }
      
      const response = await fetch("/api/notifications/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNotification),
      });

      if (!response.ok) {
        throw new Error("Failed to create notification");
      }

      toast({
        title: "Notification Sent",
        description: "Notification has been sent successfully.",
      });

      setIsCreateNotificationOpen(false);
      setNewNotification({
        title: "",
        message: "",
        type: "OFFER",
        targetRoles: [],
        imageUrl: "",
      });
      fetchNotificationsAndTasks();
    } catch (error) {
      console.error("Error creating notification:", error);
      toast({
        title: "Error",
        description: (error as Error)?.message || "Failed to create notification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingNotification(false);
    }
  };

  const markAsRead = async (id: string, isTask: boolean = false) => {
    try {
      const endpoint = isTask ? `/api/tasks/${id}/read` : `/api/notifications/${id}/read`;
      const response = await fetch(endpoint, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Failed to mark ${isTask ? 'task' : 'notification'} as read`);
      }

      if (isTask) {
        setTasks(prev =>
          prev.map(t => t.id === id ? { ...t, isRead: true } : t)
        );
      } else {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => prev - 1);
      }
    } catch (error) {
      console.error(`Error marking ${isTask ? 'task' : 'notification'} as read:`, error);
    }
  };

  const formatTimeAgo = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    return `about ${diffInHours} hours ago`;
  };

  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <Dialog open={isCreateNotificationOpen} onOpenChange={setIsCreateNotificationOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Notification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="notif-title">Title</Label>
                <Input
                  id="notif-title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notif-message">Message</Label>
                <Textarea
                  id="notif-message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notif-type">Type</Label>
                <Select
                  value={newNotification.type}
                  onValueChange={(value) => setNewNotification(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select notification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OFFER">🎯 Offer</SelectItem>
                    <SelectItem value="SYSTEM">⚙️ System Update</SelectItem>
                    <SelectItem value="ANNOUNCEMENT">📢 Announcement</SelectItem>
                    <SelectItem value="TASK">📋 Task</SelectItem>
                    <SelectItem value="PROMOTION">🎉 Promotion</SelectItem>
                    <SelectItem value="NEWS">📰 News</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Send To (Admin will always receive a copy)</Label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newNotification.targetRoles.includes("EMPLOYEE")}
                      onChange={(e) => {
                        const roles = newNotification.targetRoles;
                        if (e.target.checked) {
                          setNewNotification(prev => ({ ...prev, targetRoles: [...roles, "EMPLOYEE"] }));
                        } else {
                          setNewNotification(prev => ({ ...prev, targetRoles: roles.filter(r => r !== "EMPLOYEE") }));
                        }
                      }}
                    />
                    <span>Employees</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newNotification.targetRoles.includes("CUSTOMER")}
                      onChange={(e) => {
                        const roles = newNotification.targetRoles;
                        if (e.target.checked) {
                          setNewNotification(prev => ({ ...prev, targetRoles: [...roles, "CUSTOMER"] }));
                        } else {
                          setNewNotification(prev => ({ ...prev, targetRoles: roles.filter(r => r !== "CUSTOMER") }));
                        }
                      }}
                    />
                    <span>Customers</span>
                  </label>
                </div>
              </div>
              
              <ImageUpload
                onUpload={(url: string) => setNewNotification(prev => ({ ...prev, imageUrl: url }))}
                currentImageUrl={newNotification.imageUrl}
              />
              <Button 
                className="w-full" 
                onClick={handleCreateNotification}
                disabled={isCreatingNotification || isImageUploading}
              >
                {isCreatingNotification || isImageUploading ? "Please wait..." : "Send Notification"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="relative">
        <Button 
          variant="outline" 
          size="icon" 
          className="relative"
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
        
        {isNotificationOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsNotificationOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-[420px] max-h-[600px] bg-white rounded-lg shadow-xl border z-50 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b bg-white">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <div className="flex items-center gap-3">
                  <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded">
                    {unreadCount} new
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 -mr-2"
                    onClick={() => setIsNotificationOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {isEmployee && tasks.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold">Tasks</h3>
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-sm">New Task Assignment</h4>
                            {!task.isRead && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                            )}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Task:</span> {task.name}</p>
                            <p><span className="font-medium">Description:</span> {task.description}</p>
                            <p><span className="font-medium">Status:</span> {task.status.toLowerCase()}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-md hover:bg-gray-100 flex-shrink-0"
                          onClick={() => markAsRead(task.id, true)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400">{formatTimeAgo(task.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}

              {isCustomer && notifications.some(n => n.type === "OFFER") && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold">Offers</h3>
                  {notifications
                    .filter(n => n.type === "OFFER")
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className="bg-white border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <h4 className="font-semibold text-sm text-gray-900">🎯 Special Offer</h4>
                              </div>
                              {!notification.isRead && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
                                <h5 className="font-medium text-gray-900 mb-2">{notification.title}</h5>
                                <p className="text-sm text-gray-700 leading-relaxed">{notification.message}</p>
                              </div>
                              
                              {notification.imageUrl && (
                                <div className="mt-3">
                                  <Image
                                    src={notification.imageUrl} 
                                    alt="Notification" 
                                    width={800}
                                    height={160}
                                    sizes="(max-width: 420px) 100vw, 420px"
                                    className="w-full h-40 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                                    onError={(e) => {
                                      console.error('Image failed to load:', notification.imageUrl);
                                      e.currentTarget.style.display = 'none';
                                    }}
                                    onLoad={() => {
                                      console.log('Image loaded successfully:', notification.imageUrl);
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md hover:bg-gray-100 flex-shrink-0"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-400">{formatTimeAgo(notification.createdAt)}</p>
                      </div>
                    ))}
                </div>
              )}

              {isAdmin && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold">Admin Notifications</h3>
                  {notifications
                    .filter(n => n.type === "TASK")
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className="bg-white border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                <h4 className="font-semibold text-sm text-gray-900">📋 Task Created</h4>
                              </div>
                              {!notification.isRead && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-400">
                                <h5 className="font-medium text-gray-900 mb-2">{notification.title}</h5>
                                <p className="text-sm text-gray-700 leading-relaxed">{notification.message}</p>
                              </div>
                              
                              {notification.imageUrl && (
                                <div className="mt-3">
                                  <Image
                                    src={notification.imageUrl} 
                                    alt="Notification" 
                                    width={800}
                                    height={160}
                                    sizes="(max-width: 420px) 100vw, 420px"
                                    className="w-full h-40 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                                    onError={(e) => {
                                      console.error('Image failed to load:', notification.imageUrl);
                                      e.currentTarget.style.display = 'none';
                                    }}
                                    onLoad={() => {
                                      console.log('Image loaded successfully:', notification.imageUrl);
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md hover:bg-gray-100 flex-shrink-0"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-400">{formatTimeAgo(notification.createdAt)}</p>
                      </div>
                    ))}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">General Notifications</h3>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => setIsCreateNotificationOpen(true)}
                    >
                      <Bell className="h-4 w-4" />
                      New Notification
                    </Button>
                  )}
                </div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="bg-white border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              notification.type === "OFFER" ? "bg-green-500" :
                              notification.type === "SYSTEM" ? "bg-blue-500" :
                              notification.type === "ANNOUNCEMENT" ? "bg-purple-500" :
                              notification.type === "TASK" ? "bg-orange-500" :
                              notification.type === "PROMOTION" ? "bg-pink-500" :
                              notification.type === "NEWS" ? "bg-indigo-500" :
                              "bg-gray-500"
                            }`}></div>
                            <h4 className="font-semibold text-sm text-gray-900">
                              {notification.type === "OFFER" ? "🎯 New Offer" :
                               notification.type === "SYSTEM" ? "⚙️ System Update" :
                               notification.type === "ANNOUNCEMENT" ? "📢 Announcement" :
                               notification.type === "TASK" ? "📋 Task" :
                               notification.type === "PROMOTION" ? "🎉 Promotion" :
                               notification.type === "NEWS" ? "📰 News" :
                               "📋 Notification"}
                            </h4>
                          </div>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div className={`rounded-lg p-3 border-l-4 ${
                            notification.type === "OFFER" ? "bg-green-50 border-green-400" :
                            notification.type === "SYSTEM" ? "bg-blue-50 border-blue-400" :
                            notification.type === "ANNOUNCEMENT" ? "bg-purple-50 border-purple-400" :
                            notification.type === "TASK" ? "bg-orange-50 border-orange-400" :
                            notification.type === "PROMOTION" ? "bg-pink-50 border-pink-400" :
                            notification.type === "NEWS" ? "bg-indigo-50 border-indigo-400" :
                            "bg-gray-50 border-gray-400"
                          }`}>
                            <h5 className="font-medium text-gray-900 mb-2">{notification.title}</h5>
                            <p className="text-sm text-gray-700 leading-relaxed">{notification.message}</p>
                          </div>
                          
                          {notification.imageUrl && notification.imageUrl !== '' && (
                            <div className="mt-3">
                              <Image
                                src={notification.imageUrl} 
                                alt="Notification" 
                                width={800}
                                height={160}
                                sizes="(max-width: 420px) 100vw, 420px"
                                className="w-full h-40 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                                loading="lazy"
                                onError={(e) => {
                                  console.error('Image failed to load:', notification.imageUrl);
                                  e.currentTarget.style.display = 'none';
                                }}
                                onLoad={() => {
                                  console.log('Image loaded successfully:', notification.imageUrl);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      {isAdmin && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md hover:bg-gray-100"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{formatTimeAgo(notification.createdAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}