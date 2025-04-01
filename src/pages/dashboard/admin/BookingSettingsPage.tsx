
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getBookingSettings, updateBookingSetting, createBookingSetting } from '@/services/contentService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { PencilIcon, PlusCircle } from 'lucide-react';

interface SettingFormData {
  key: string;
  value: any;
  description: string;
  valueType: 'string' | 'number' | 'boolean' | 'json';
}

const BookingSettingsPage = () => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [settingsMetadata, setSettingsMetadata] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [settingForm, setSettingForm] = useState<SettingFormData>({
    key: '',
    value: '',
    description: '',
    valueType: 'string'
  });
  const { toast } = useToast();

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await getBookingSettings();
      const settingsData: Record<string, any> = {};
      const metadataData: Record<string, any> = {};
      
      // Process the raw data to extract values and metadata
      Object.entries(data).forEach(([key, rawValue]) => {
        // For settings stored as objects with metadata
        if (rawValue && typeof rawValue === 'object' && rawValue.value !== undefined) {
          settingsData[key] = rawValue.value;
          metadataData[key] = {
            description: rawValue.description || '',
            type: typeof rawValue.value
          };
        } else {
          // For settings stored directly
          settingsData[key] = rawValue;
          metadataData[key] = {
            description: '',
            type: typeof rawValue
          };
        }
      });
      
      setSettings(settingsData);
      setSettingsMetadata(metadataData);
    } catch (error) {
      console.error('Error loading booking settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load booking settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const openCreateDialog = () => {
    setEditingKey(null);
    setSettingForm({
      key: '',
      value: '',
      description: '',
      valueType: 'string'
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (key: string) => {
    setEditingKey(key);
    
    let valueType: 'string' | 'number' | 'boolean' | 'json' = 'string';
    const value = settings[key];
    
    if (typeof value === 'number') {
      valueType = 'number';
    } else if (typeof value === 'boolean') {
      valueType = 'boolean';
    } else if (typeof value === 'object') {
      valueType = 'json';
    }
    
    setSettingForm({
      key,
      value: valueType === 'json' ? JSON.stringify(value, null, 2) : value,
      description: settingsMetadata[key]?.description || '',
      valueType
    });
    
    setIsDialogOpen(true);
  };

  const parseSettingValue = (value: any, type: string): any => {
    if (type === 'number') {
      return parseFloat(value);
    } else if (type === 'boolean') {
      return value === 'true' || value === true;
    } else if (type === 'json') {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error('Invalid JSON:', e);
        throw new Error('Invalid JSON format');
      }
    }
    return value;
  };

  const handleSaveSetting = async () => {
    if (!settingForm.key.trim()) {
      toast({
        title: 'Error',
        description: 'Setting key is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const parsedValue = parseSettingValue(settingForm.value, settingForm.valueType);
      
      let savedSetting;
      if (editingKey) {
        // Update existing setting
        savedSetting = await updateBookingSetting(settingForm.key, {
          value: parsedValue,
          description: settingForm.description
        });
        toast({
          title: 'Success',
          description: 'Setting updated successfully',
        });
      } else {
        // Create new setting
        savedSetting = await createBookingSetting({
          key: settingForm.key,
          value: parsedValue,
          description: settingForm.description
        });
        toast({
          title: 'Success',
          description: 'Setting created successfully',
        });
      }

      if (savedSetting) {
        await fetchSettings();
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error saving setting:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save setting',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatValueForDisplay = (value: any): string => {
    if (typeof value === 'boolean') {
      return value ? 'True' : 'False';
    } else if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const getSettingValueType = (value: any): string => {
    if (typeof value === 'boolean') {
      return 'Boolean';
    } else if (typeof value === 'number') {
      return 'Number';
    } else if (typeof value === 'object') {
      return 'JSON';
    }
    return 'Text';
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Booking Settings</h1>
            <p className="text-muted-foreground">
              Manage global settings for bookings across the platform
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Setting
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Settings</CardTitle>
            <CardDescription>
              Configure booking-related settings for your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(settings).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No settings found. Create your first setting to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  Object.entries(settings).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell>
                        <div className="max-w-md truncate">
                          {formatValueForDisplay(value)}
                        </div>
                      </TableCell>
                      <TableCell>{getSettingValueType(value)}</TableCell>
                      <TableCell>{settingsMetadata[key]?.description || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(key)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Setting Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingKey ? 'Edit Setting' : 'Create Setting'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="key" className="text-right">
                Key
              </Label>
              <Input
                id="key"
                value={settingForm.key}
                onChange={(e) => setSettingForm({ ...settingForm, key: e.target.value })}
                className="col-span-3"
                placeholder="setting_key"
                disabled={!!editingKey}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valueType" className="text-right">
                Value Type
              </Label>
              <select
                id="valueType"
                value={settingForm.valueType}
                onChange={(e) => setSettingForm({ 
                  ...settingForm, 
                  valueType: e.target.value as 'string' | 'number' | 'boolean' | 'json',
                  value: e.target.value === 'boolean' ? true : settingForm.value
                })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
              >
                <option value="string">Text</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="json">JSON</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value
              </Label>
              {settingForm.valueType === 'boolean' ? (
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="value-boolean"
                    checked={typeof settingForm.value === 'boolean' ? settingForm.value : settingForm.value === 'true'}
                    onCheckedChange={(checked) => setSettingForm({ ...settingForm, value: checked })}
                  />
                  <Label htmlFor="value-boolean">
                    {typeof settingForm.value === 'boolean' ? (settingForm.value ? 'True' : 'False') : (settingForm.value === 'true' ? 'True' : 'False')}
                  </Label>
                </div>
              ) : settingForm.valueType === 'json' ? (
                <Textarea
                  id="value-json"
                  value={typeof settingForm.value === 'object' ? JSON.stringify(settingForm.value, null, 2) : settingForm.value}
                  onChange={(e) => setSettingForm({ ...settingForm, value: e.target.value })}
                  className="col-span-3 font-mono text-sm"
                  placeholder="{}"
                  rows={5}
                />
              ) : (
                <Input
                  id="value"
                  type={settingForm.valueType === 'number' ? 'number' : 'text'}
                  value={settingForm.value}
                  onChange={(e) => setSettingForm({ ...settingForm, value: e.target.value })}
                  className="col-span-3"
                  placeholder={settingForm.valueType === 'number' ? '0' : 'Value'}
                />
              )}
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={settingForm.description}
                onChange={(e) => setSettingForm({ ...settingForm, description: e.target.value })}
                className="col-span-3"
                placeholder="Description of this setting"
                rows={2}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSetting}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : editingKey ? 'Save Changes' : 'Create Setting'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BookingSettingsPage;
