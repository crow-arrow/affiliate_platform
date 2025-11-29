"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import {
  fetchLevelSettings,
  updateLevelSettings,
  addLevel,
  removeLevel,
  updateAppSettings,
  clearError,
  updateLevel as updateLevelAction,
} from "@/redux/features/admin/adminSettingsSlice";

export const LevelSettingsAdmin = () => {
  const dispatch = useAppDispatch();
  const { levelSettings, appSettings, loading, error } = useAppSelector(
    (state) => state.adminSettings
  );

  // Загружаем настройки при монтировании
  useEffect(() => {
    dispatch(fetchLevelSettings());
  }, [dispatch]);

  // Показываем ошибки
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const addNewLevel = () => {
    const newLevel = {
      levelName: "",
      levelOrder: levelSettings.length + 1,
      requiredAmount: 0,
      isActive: true,
    };
    dispatch(addLevel(newLevel));
  };

  const updateLevel = (index: number, field: string, value: any) => {
    const updatedLevel = { ...levelSettings[index], [field]: value };
    dispatch(updateLevelAction({ index, level: updatedLevel }));
  };

  const removeLevelHandler = (index: number) => {
    dispatch(removeLevel(index));
  };

  const saveSettings = async () => {
    try {
      await dispatch(updateLevelSettings({ levelSettings, appSettings })).unwrap();
      toast.success("Settings saved successfully!");
    } catch (error) {
      // Ошибка уже обработана в slice
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Level Settings</CardTitle>
          <CardDescription>Manage user levels and their requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* App Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">General Settings</h3>
            <div className="space-y-2">
              <Label htmlFor="levelAmountDescription">Level Amount Description</Label>
              <Input
                id="levelAmountDescription"
                value={appSettings.levelAmountDescription}
                onChange={(e) =>
                  dispatch(
                    updateAppSettings({
                      levelAmountDescription: e.target.value,
                    })
                  )
                }
                placeholder="e.g., Travellers This Year, Orders Last Month"
              />
            </div>
          </div>

          {/* Level Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Level Names & Requirements</h3>
              <Button onClick={addNewLevel} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Level
              </Button>
            </div>

            <div className="space-y-4">
              {levelSettings.map((level, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor={`levelName-${index}`}>Level Name</Label>
                      <Input
                        id={`levelName-${index}`}
                        value={level.levelName}
                        onChange={(e) => updateLevel(index, "levelName", e.target.value)}
                        placeholder="e.g., Base, Advance, Premium"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`requiredAmount-${index}`}>Required Amount</Label>
                      <Input
                        id={`requiredAmount-${index}`}
                        type="number"
                        value={level.requiredAmount}
                        onChange={(e) =>
                          updateLevel(index, "requiredAmount", parseInt(e.target.value) || 0)
                        }
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`levelOrder-${index}`}>Order</Label>
                      <Input
                        id={`levelOrder-${index}`}
                        type="number"
                        value={level.levelOrder}
                        onChange={(e) =>
                          updateLevel(index, "levelOrder", parseInt(e.target.value) || 1)
                        }
                        placeholder="1"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeLevelHandler(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={saveSettings} loading={loading} loadingText="Saving...">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
