"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchApiKeys,
  createApiKey,
  updateApiKey,
  deleteApiKey,
  clearError,
} from "@/redux/features/admin/integrationSlice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, MoreVertical, Copy, Trash2, Edit, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const ApiKeys = () => {
  const dispatch = useAppDispatch();
  const { apiKeys, loading, error } = useAppSelector((state) => state.integration);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    dispatch(fetchApiKeys());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleCreate = async () => {
    try {
      const result = await dispatch(createApiKey({ name: newKeyName || undefined })).unwrap();
      setIsCreateDialogOpen(false);
      setNewKeyName("");
      toast.success("API key created successfully!");
      // Show the new key (it will be visible by default)
      setVisibleKeys(new Set([result.id]));
    } catch (err: any) {
      toast.error(err || "Failed to create API key");
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await dispatch(updateApiKey({ id, isActive: !isActive })).unwrap();
      toast.success("API key updated successfully!");
    } catch (err: any) {
      toast.error(err || "Failed to update API key");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) return;

    try {
      await dispatch(deleteApiKey(id)).unwrap();
      toast.success("API key deleted successfully!");
    } catch (err: any) {
      toast.error(err || "Failed to delete API key");
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success("API key copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return "••••••••";
    return `${key.substring(0, 4)}${"•".repeat(key.length - 8)}${key.substring(key.length - 4)}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API keys for external integrations</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    Create a new API key for external system integration
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">Key Name (Optional)</Label>
                    <Input
                      id="key-name"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Production API, Test API"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No API keys found. Create your first API key to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name || "Untitled"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-secondary px-2 py-1 rounded">
                          {visibleKeys.has(key.id) ? key.apiKey : maskApiKey(key.apiKey)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(key.id)}
                          className="h-6 w-6 p-0"
                        >
                          {visibleKeys.has(key.id) ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(key.apiKey)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.isActive ? "default" : "secondary"}>
                        {key.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Switch
                          checked={key.isActive}
                          onCheckedChange={() => handleToggleActive(key.id, key.isActive)}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleDelete(key.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
