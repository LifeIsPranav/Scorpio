import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { settingsApi } from "@/lib/api";

import {
  Save,
  RefreshCw,
  Download,
  Upload,
  RotateCcw,
  Settings,
  Palette,
  ShoppingCart,
  Bell,
  Search,
  Shield,
  Link,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";

interface WebsiteSettings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    contactEmail: string;
    supportEmail: string;
    phone: string;
    address: string;
    currency: string;
    timezone: string;
    language: string;
    maintenance: boolean;
  };
  appearance: {
    logo: string;
    favicon: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    theme: string;
  };
  ecommerce: {
    enableInventoryTracking: boolean;
    enableReviews: boolean;
    enableWishlist: boolean;
    enableCoupons: boolean;
    defaultShippingCost: number;
    freeShippingThreshold: number;
    taxRate: number;
    enableGuestCheckout: boolean;
    enableOrderTracking: boolean;
    orderPrefix: string;
    lowStockThreshold: number;
  };
  notifications: {
    enableEmailNotifications: boolean;
    enableSMSNotifications: boolean;
    enablePushNotifications: boolean;
    orderConfirmationEmails: boolean;
    shippingNotifications: boolean;
    lowStockAlerts: boolean;
    reviewNotifications: boolean;
    promotionalEmails: boolean;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    googleAnalyticsId: string;
    facebookPixelId: string;
    enableSitemap: boolean;
    enableRobotsTxt: boolean;
  };
  security: {
    enableTwoFactorAuth: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    enableCaptcha: boolean;
    ipWhitelist: string[];
    enableSSL: boolean;
    cookieSecure: boolean;
  };
  integrations: {
    paymentGateways: {
      stripe: {
        enabled: boolean;
        publicKey: string;
        secretKey: string;
      };
      paypal: {
        enabled: boolean;
        clientId: string;
        clientSecret: string;
      };
    };
    emailService: {
      provider: string;
      smtpHost: string;
      smtpPort: number;
      smtpUser: string;
      smtpPassword: string;
      fromEmail: string;
      fromName: string;
    };
    socialMedia: {
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
      youtube: string;
    };
  };
}

interface SystemInfo {
  application: {
    name: string;
    version: string;
    environment: string;
    uptime: number;
    nodeVersion: string;
  };
  server: {
    platform: string;
    architecture: string;
    hostname: string;
    totalMemory: number;
    freeMemory: number;
    cpuCores: number;
    loadAverage: number[];
  };
  database: {
    status: string;
    type: string;
  };
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsApi.getAll() as { success: boolean; data: WebsiteSettings };
      if (response.success) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemInfo = async () => {
    try {
      const response = await settingsApi.getSystemInfo() as { success: boolean; data: SystemInfo };
      if (response.success) {
        setSystemInfo(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch system info:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchSystemInfo();
  }, []);

  const handleSave = async (section: string, sectionSettings: any) => {
    try {
      setSaving(true);
      const response = await settingsApi.update(section, sectionSettings) as { success: boolean; data: any; message: string };
      if (response.success) {
        setSettings(prev => prev ? { ...prev, [section]: response.data } : null);
        setMessage({ type: 'success', text: response.message });
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async (section: string) => {
    try {
      setSaving(true);
      const response = await settingsApi.reset(section) as { success: boolean; data: any; message: string };
      if (response.success) {
        setSettings(prev => prev ? { ...prev, [section]: response.data } : null);
        setMessage({ type: 'success', text: response.message });
      }
    } catch (error) {
      console.error('Failed to reset settings:', error);
      setMessage({ type: 'error', text: 'Failed to reset settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      await settingsApi.backup();
      setMessage({ type: 'success', text: 'Settings backup downloaded successfully' });
    } catch (error) {
      console.error('Failed to backup settings:', error);
      setMessage({ type: 'error', text: 'Failed to create backup' });
    }
  };

  const formatBytes = (bytes: number) => {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading && !settings) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your store configuration and preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleBackup} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Backup
          </Button>
          <Button onClick={fetchSettings} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          {message.type === 'error' ? (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          {settings && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Basic information about your store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.general.siteName}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        general: { ...prev.general, siteName: e.target.value }
                      } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input
                      id="siteUrl"
                      value={settings.general.siteUrl}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        general: { ...prev.general, siteUrl: e.target.value }
                      } : null)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.general.siteDescription}
                    onChange={(e) => setSettings(prev => prev ? {
                      ...prev,
                      general: { ...prev.general, siteDescription: e.target.value }
                    } : null)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        general: { ...prev.general, contactEmail: e.target.value }
                      } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        general: { ...prev.general, supportEmail: e.target.value }
                      } : null)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={settings.general.phone}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        general: { ...prev.general, phone: e.target.value }
                      } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={settings.general.currency}
                      onValueChange={(value) => setSettings(prev => prev ? {
                        ...prev,
                        general: { ...prev.general, currency: value }
                      } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={settings.general.address}
                    onChange={(e) => setSettings(prev => prev ? {
                      ...prev,
                      general: { ...prev.general, address: e.target.value }
                    } : null)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenance"
                    checked={settings.general.maintenance}
                    onCheckedChange={(checked) => setSettings(prev => prev ? {
                      ...prev,
                      general: { ...prev.general, maintenance: checked }
                    } : null)}
                  />
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  {settings.general.maintenance && (
                    <Badge variant="destructive">Active</Badge>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => handleReset('general')}
                    disabled={saving}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset to Defaults
                  </Button>
                  <Button
                    onClick={() => handleSave('general', settings.general)}
                    disabled={saving}
                  >
                    {saving ? <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* E-commerce Settings */}
        <TabsContent value="ecommerce" className="space-y-6">
          {settings && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  E-commerce Settings
                </CardTitle>
                <CardDescription>
                  Configure your store's e-commerce features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableInventoryTracking"
                        checked={settings.ecommerce.enableInventoryTracking}
                        onCheckedChange={(checked) => setSettings(prev => prev ? {
                          ...prev,
                          ecommerce: { ...prev.ecommerce, enableInventoryTracking: checked }
                        } : null)}
                      />
                      <Label htmlFor="enableInventoryTracking">Inventory Tracking</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableReviews"
                        checked={settings.ecommerce.enableReviews}
                        onCheckedChange={(checked) => setSettings(prev => prev ? {
                          ...prev,
                          ecommerce: { ...prev.ecommerce, enableReviews: checked }
                        } : null)}
                      />
                      <Label htmlFor="enableReviews">Product Reviews</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableWishlist"
                        checked={settings.ecommerce.enableWishlist}
                        onCheckedChange={(checked) => setSettings(prev => prev ? {
                          ...prev,
                          ecommerce: { ...prev.ecommerce, enableWishlist: checked }
                        } : null)}
                      />
                      <Label htmlFor="enableWishlist">Wishlist</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableGuestCheckout"
                        checked={settings.ecommerce.enableGuestCheckout}
                        onCheckedChange={(checked) => setSettings(prev => prev ? {
                          ...prev,
                          ecommerce: { ...prev.ecommerce, enableGuestCheckout: checked }
                        } : null)}
                      />
                      <Label htmlFor="enableGuestCheckout">Guest Checkout</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Pricing & Shipping</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultShippingCost">Default Shipping Cost</Label>
                      <Input
                        id="defaultShippingCost"
                        type="number"
                        step="0.01"
                        value={settings.ecommerce.defaultShippingCost}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          ecommerce: { ...prev.ecommerce, defaultShippingCost: parseFloat(e.target.value) }
                        } : null)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="freeShippingThreshold">Free Shipping Threshold</Label>
                      <Input
                        id="freeShippingThreshold"
                        type="number"
                        step="0.01"
                        value={settings.ecommerce.freeShippingThreshold}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          ecommerce: { ...prev.ecommerce, freeShippingThreshold: parseFloat(e.target.value) }
                        } : null)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        step="0.01"
                        value={settings.ecommerce.taxRate}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          ecommerce: { ...prev.ecommerce, taxRate: parseFloat(e.target.value) }
                        } : null)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        value={settings.ecommerce.lowStockThreshold}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          ecommerce: { ...prev.ecommerce, lowStockThreshold: parseInt(e.target.value) }
                        } : null)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => handleReset('ecommerce')}
                    disabled={saving}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset to Defaults
                  </Button>
                  <Button
                    onClick={() => handleSave('ecommerce', settings.ecommerce)}
                    disabled={saving}
                  >
                    {saving ? <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* System Info Tab */}
        <TabsContent value="system" className="space-y-6">
          {systemInfo && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="h-5 w-5 mr-2" />
                    System Information
                  </CardTitle>
                  <CardDescription>
                    Current system status and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center">
                        <Info className="h-4 w-4 mr-1" />
                        Application
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span>{systemInfo.application.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Version:</span>
                          <Badge variant="outline">{systemInfo.application.version}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Environment:</span>
                          <Badge variant={systemInfo.application.environment === 'production' ? 'default' : 'secondary'}>
                            {systemInfo.application.environment}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Uptime:</span>
                          <span>{formatUptime(systemInfo.application.uptime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Node.js:</span>
                          <span>{systemInfo.application.nodeVersion}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Server</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Platform:</span>
                          <span>{systemInfo.server.platform}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Architecture:</span>
                          <span>{systemInfo.server.architecture}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CPU Cores:</span>
                          <span>{systemInfo.server.cpuCores}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Memory:</span>
                          <span>{formatBytes(systemInfo.server.totalMemory)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Free Memory:</span>
                          <span>{formatBytes(systemInfo.server.freeMemory)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Database</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span>{systemInfo.database.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant="default" className="bg-green-500">
                            {systemInfo.database.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
