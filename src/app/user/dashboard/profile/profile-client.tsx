"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Profile update schema
const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

// Password update schema
const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

type User = {
  id: string;
  name: string | null;
  email: string | null;
  provider?: string | null;
};

export default function ProfileClient({ user }: { user: User }) {
  if (!user || !user.id) {
    console.error("ProfileClient: User data is missing or invalid", user);
    return <div className="text-red-500">Unable to load profile data</div>;
  }

  try {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Determine login method based on provider or infer from email domain
    const isGmailLogin =
      user.provider === "google" ||
      (user.email && user.email.endsWith("@gmail.com"));

    // Debug user data
    useEffect(() => {
      console.log("ProfileClient mounted with user:", user);
    }, [user]);

    // Profile form
    const profileForm = useForm<ProfileFormValues>({
      resolver: zodResolver(profileFormSchema),
      defaultValues: {
        name: user.name || "",
        email: user.email || "",
      },
    });

    // Password form
    const passwordForm = useForm<PasswordFormValues>({
      resolver: zodResolver(passwordFormSchema),
      defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    });

    async function onProfileSubmit(data: ProfileFormValues) {
      setIsLoading(true);
      setError(null);

      try {
        // Only update name, we keep email unchanged
        const response = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: user.email, // Always use original email
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to update profile");
        }

        toast.success("Profile updated successfully");
        router.refresh();
      } catch (error: any) {
        const errorMessage = error.message || "Failed to update profile";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    async function onPasswordSubmit(data: PasswordFormValues) {
      // Skip password update for Gmail users
      if (isGmailLogin) {
        toast.info("Password changes not supported for Google accounts");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/user/password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to update password");
        }

        toast.success("Password updated successfully");
        passwordForm.reset();
      } catch (error: any) {
        const errorMessage = error.message || "Failed to update password";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    return (
      <div className="w-full">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Email & Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" alt={user.name || "User"} />
                    <AvatarFallback className="text-2xl">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle>Email & Profile</CardTitle>
                      <Badge variant={isGmailLogin ? "default" : "outline"}>
                        {isGmailLogin ? "Google Login" : "Manual Signup"}
                      </Badge>
                    </div>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your email"
                              {...field}
                              disabled={true}
                              className="bg-gray-100 cursor-not-allowed"
                            />
                          </FormControl>
                          <FormDescription className="text-amber-700">
                            Email changes are not allowed for security reasons
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </Form>

                {!isGmailLogin && (
                  <div className="mt-6 border-t pt-6">
                    <h3 className="font-medium mb-2">Connect with Gmail</h3>
                    <Button variant="outline" className="w-full">
                      Connect Gmail Account
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  {isGmailLogin
                    ? "Password management is handled by Google for your account"
                    : "Update your password to keep your account secure"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGmailLogin ? (
                  <div className="bg-blue-50 p-4 rounded-md text-blue-700">
                    <p>
                      You signed up with Google, please manage your password
                      through your Google account settings.
                    </p>
                  </div>
                ) : (
                  <Form {...passwordForm}>
                    <form
                      onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Password must be at least 8 characters
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "Change Password"}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error("Error rendering ProfileClient component:", error);
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-lg font-medium text-red-800">
          Error loading profile interface
        </h3>
        <p className="text-red-600 mt-2">
          There was a problem loading your profile settings. Please refresh the
          page or try again later.
        </p>
      </div>
    );
  }
}
