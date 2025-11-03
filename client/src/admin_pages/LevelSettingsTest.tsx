"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "@/utils/axios";

export const LevelSettingsTest = () => {
  const [levelSettings, setLevelSettings] = useState([]);
  const [appSettings, setAppSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/admin/level-settings/get");
      setLevelSettings(response.data.levelSettings || []);
      setAppSettings(response.data.appSettings || {});
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Level Settings Test</CardTitle>
          <CardDescription>Testing the level settings API endpoint</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={fetchSettings} loading={loading} loadingText="Loading...">
            Refresh Settings
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">App Settings</h3>
            <div className="p-4 bg-gray-50 rounded-md">
              <pre>{JSON.stringify(appSettings, null, 2)}</pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Level Settings</h3>
            <div className="grid gap-4">
              {levelSettings.map((level, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="outline" className="mr-2">
                        {level.levelName}
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Order: {level.levelOrder} | Required: {level.requiredAmount}
                      </span>
                    </div>
                    <Badge variant={level.isActive ? "default" : "secondary"}>
                      {level.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
