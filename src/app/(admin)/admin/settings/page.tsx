"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    title: "",
    metaDescription: "",
    canonicalUrl: "",
    contactEmail: "",
    supportEmail: "",
    address: "",
    googleAnalyticsId: "",
    facebookPixelId: "",
    customHeaderTags: "",
    customFooterTags: "",
    logoUrl: "",
    faviconUrl: "",
    googleClientId: "",
    googleClientSecret: "",
    facebookAppId: "",
    facebookAppSecret: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to fetch settings");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      // Preserve existing values if fields are empty
      Object.keys(settings).forEach((key) => {
        const value = formData.get(key);
        if (!value && settings[key as keyof typeof settings]) {
          formData.set(key, settings[key as keyof typeof settings]);
        }
      });

      const response = await fetch("/api/settings", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground">
          Manage your site's configuration and appearance
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Site Title</label>
                <Input
                  name="title"
                  defaultValue={settings.title}
                  placeholder="Your site title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Meta Description</label>
                <Textarea
                  name="metaDescription"
                  defaultValue={settings.metaDescription}
                  placeholder="Brief description of your site"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Canonical URL</label>
                <Input
                  name="canonicalUrl"
                  defaultValue={settings.canonicalUrl}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <div>
              <label className="text-sm font-medium">Site Logo</label>
              <div className="mt-2">
                <Input
                  type="file"
                  name="logo"
                  accept="image/*"
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended size: 400x200px. Max file size: 5MB
                </p>
                {settings.logoUrl && (
                  <img
                    src={settings.logoUrl}
                    alt="Current logo"
                    className="mt-2 max-h-20"
                  />
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Favicon</label>
              <div className="mt-2">
                <Input
                  type="file"
                  name="favicon"
                  accept="image/*"
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended size: 32x32px or 16x16px. Max file size: 1MB
                </p>
                {settings.faviconUrl && (
                  <img
                    src={settings.faviconUrl}
                    alt="Current favicon"
                    className="mt-2 h-8 w-8"
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="auth" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Google OAuth</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Client ID</label>
                  <Input
                    name="googleClientId"
                    defaultValue={settings.googleClientId}
                    placeholder="Your Google OAuth Client ID"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Client Secret</label>
                  <Input
                    name="googleClientSecret"
                    type="password"
                    defaultValue={settings.googleClientSecret}
                    placeholder="Your Google OAuth Client Secret"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Get these from the Google Cloud Console under OAuth 2.0
                    Client IDs
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h2 className="text-lg font-medium">Facebook OAuth</h2>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">App ID</label>
                    <Input
                      name="facebookAppId"
                      defaultValue={settings.facebookAppId}
                      placeholder="Your Facebook App ID"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">App Secret</label>
                    <Input
                      name="facebookAppSecret"
                      type="password"
                      defaultValue={settings.facebookAppSecret}
                      placeholder="Your Facebook App Secret"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Get these from the Facebook Developers Console under Basic
                      Settings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <div>
              <label className="text-sm font-medium">Contact Email</label>
              <Input
                name="contactEmail"
                type="email"
                defaultValue={settings.contactEmail}
                placeholder="contact@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Support Email</label>
              <Input
                name="supportEmail"
                type="email"
                defaultValue={settings.supportEmail}
                placeholder="support@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Business Address</label>
              <Textarea
                name="address"
                defaultValue={settings.address}
                placeholder="Your business address"
              />
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <div>
              <label className="text-sm font-medium">Google Analytics ID</label>
              <Input
                name="googleAnalyticsId"
                defaultValue={settings.googleAnalyticsId}
                placeholder="UA-XXXXXXXXX-X"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Facebook Pixel ID</label>
              <Input
                name="facebookPixelId"
                defaultValue={settings.facebookPixelId}
                placeholder="XXXXXXXXXXXXXXXXXX"
              />
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div>
              <label className="text-sm font-medium">Custom Header Tags</label>
              <Textarea
                name="customHeaderTags"
                defaultValue={settings.customHeaderTags}
                placeholder="<!-- Custom header tags -->"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Custom Footer Tags</label>
              <Textarea
                name="customFooterTags"
                defaultValue={settings.customFooterTags}
                placeholder="<!-- Custom footer tags -->"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
