"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchFieldMappings,
  fetchAvailableFields,
  createFieldMapping,
  updateFieldMapping,
  deleteFieldMapping,
  clearError,
} from "@/redux/features/admin/integrationSlice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, MoreVertical, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export const FieldMappings = () => {
  const dispatch = useAppDispatch();
  const { fieldMappings, availableFields, loading, error } = useAppSelector(
    (state) => state.integration
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    incomingField: "",
    targetField: "",
    description: "",
  });

  useEffect(() => {
    dispatch(fetchFieldMappings());
    dispatch(fetchAvailableFields());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleCreate = async () => {
    if (!formData.incomingField || !formData.targetField) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await dispatch(
        createFieldMapping({
          incomingField: formData.incomingField,
          targetField: formData.targetField,
          description: formData.description || undefined,
        })
      ).unwrap();
      setIsCreateDialogOpen(false);
      setFormData({ incomingField: "", targetField: "", description: "" });
      toast.success("Field mapping created successfully!");
    } catch (err: any) {
      toast.error(err || "Failed to create field mapping");
    }
  };

  const handleEdit = (mapping: any) => {
    setEditingMapping(mapping.id);
    setFormData({
      incomingField: mapping.incomingField,
      targetField: mapping.targetField,
      description: mapping.description || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingMapping || !formData.incomingField || !formData.targetField) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await dispatch(
        updateFieldMapping({
          id: editingMapping,
          incomingField: formData.incomingField,
          targetField: formData.targetField,
          description: formData.description || undefined,
        })
      ).unwrap();
      setEditingMapping(null);
      setFormData({ incomingField: "", targetField: "", description: "" });
      toast.success("Field mapping updated successfully!");
    } catch (err: any) {
      toast.error(err || "Failed to update field mapping");
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await dispatch(updateFieldMapping({ id, isActive: !isActive })).unwrap();
      toast.success("Field mapping updated successfully!");
    } catch (err: any) {
      toast.error(err || "Failed to update field mapping");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this field mapping?")) return;

    try {
      await dispatch(deleteFieldMapping(id)).unwrap();
      toast.success("Field mapping deleted successfully!");
    } catch (err: any) {
      toast.error(err || "Failed to delete field mapping");
    }
  };

  const getFieldLabel = (value: string) => {
    return availableFields.find((f) => f.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Field Mappings</CardTitle>
              <CardDescription>
                Map incoming field names from external systems to internal field names
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Mapping
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Field Mapping</DialogTitle>
                  <DialogDescription>
                    Map an incoming field name to an internal field
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="incoming-field">Incoming Field Name *</Label>
                    <Input
                      id="incoming-field"
                      value={formData.incomingField}
                      onChange={(e) =>
                        setFormData({ ...formData, incomingField: e.target.value })
                      }
                      placeholder="e.g., travel_date, client_name"
                    />
                    <p className="text-xs text-muted-foreground">
                      The field name as it comes from your external system
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target-field">Target Field *</Label>
                    <Select
                      value={formData.targetField}
                      onValueChange={(value) =>
                        setFormData({ ...formData, targetField: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select target field" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFields.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label} ({field.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      The internal field name in the system
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Optional description for this mapping"
                      rows={2}
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
          ) : fieldMappings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No field mappings found. Create your first mapping to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Incoming Field</TableHead>
                  <TableHead>Target Field</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fieldMappings.map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell className="font-medium">
                      <code className="text-sm bg-secondary px-2 py-1 rounded">
                        {mapping.incomingField}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getFieldLabel(mapping.targetField)}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {mapping.description || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={mapping.isActive ? "default" : "secondary"}>
                        {mapping.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Switch
                          checked={mapping.isActive}
                          onCheckedChange={() => handleToggleActive(mapping.id, mapping.isActive)}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(mapping)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(mapping.id)}
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

      {/* Edit Dialog */}
      <Dialog open={editingMapping !== null} onOpenChange={(open) => !open && setEditingMapping(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Field Mapping</DialogTitle>
            <DialogDescription>Update the field mapping configuration</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-incoming-field">Incoming Field Name *</Label>
              <Input
                id="edit-incoming-field"
                value={formData.incomingField}
                onChange={(e) =>
                  setFormData({ ...formData, incomingField: e.target.value })
                }
                placeholder="e.g., travel_date, client_name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-target-field">Target Field *</Label>
              <Select
                value={formData.targetField}
                onValueChange={(value) =>
                  setFormData({ ...formData, targetField: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target field" />
                </SelectTrigger>
                <SelectContent>
                  {availableFields.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label} ({field.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Optional description for this mapping"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMapping(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

