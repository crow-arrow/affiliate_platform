import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from "@/components/ui/avatar";
import { CropAvatar } from "@/components/profile/Avatar";
import { getAvatarUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  Bell,
  Pencil,
  Link as LinkIcon,
  Link,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateUserProfile } from "@/redux/features/auth/authSlice";
import { formatDate } from "@/components/utils/formatters";
import { toast } from "sonner";
import { Typography } from "@/theme";

export const Account = () => {
  const { user, message, errors, status, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isCropAvatarOpen, setIsCropAvatarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "New York, NY",
    joinDate: user?.createdAt ? formatDate(user.createdAt) : "",
    role: user?.role || "",
    status: user?.status || "Active",
    level: user?.level || "BRONZE",
    avatar: user?.avatarUrl || "",
  });
  const avatar = getAvatarUrl(user?.avatarUrl);

  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone || "",
        location: user.location || "New York, NY",
        joinDate: user.createdAt ? formatDate(user.createdAt) : "",
        role: user.role || "",
        status: user.status || "Active",
        level: user.level || "BRONZE",
        avatar: user.avatarUrl || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const result = await dispatch(
        updateUserProfile({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          location: userData.location,
        })
      ).unwrap();
      setIsEditing(false);
      toast.success(result?.message || "Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (user) {
      setUserData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "New York, NY",
        joinDate: user.createdAt ? formatDate(user.createdAt) : "",
        role: user.role || "",
        status: user.status || "Active",
        level: user.level || "BRONZE",
        avatar: user.avatarUrl || "",
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography.h3>Profile</Typography.h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatar} alt={userData.firstName} />
                <AvatarFallback className="text-2xl">
                  {userData.firstName[0]}
                  {userData.lastName[0]}
                </AvatarFallback>
                {isCropAvatarOpen && (
                  <CropAvatar
                    isOpen={isCropAvatarOpen}
                    onClose={() => setIsCropAvatarOpen(false)}
                  />
                )}
                <AvatarBadge className="p-1" onClick={() => setIsCropAvatarOpen(true)}>
                  <Pencil />
                </AvatarBadge>
              </Avatar>
            </div>
            <CardTitle as="h3" className="text-xl">
              {userData.firstName} {userData.lastName}
            </CardTitle>
            <CardDescription>
              <Badge variant="secondary" className="mt-2 text-yellow-500">
                <Shield className="h-3 w-3 mr-1" />
                {userData.level}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{userData.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{userData.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{userData.location}</span>
            </div>
            <Separator className="bg-border" />
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Joined - {userData.joinDate}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Badge
              variant={userData.status === "Active" ? "default" : "secondary"}
              className="bg-green-500 text-white dark:bg-green-600"
            >
              {userData.status}
            </Badge>
          </CardFooter>
        </Card>

        {/* Account Information */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row justify-between items-center">
            <div className="flex flex-col justify-between items-start">
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Update your personal information and account details
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={userData.firstName}
                  onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={userData.lastName}
                  onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={userData.location}
                onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
