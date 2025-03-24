import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CredentialsForm } from "@/components/forms/credentials-form";
import { toast } from "sonner";
import { Pencil, Eye, EyeOff } from "lucide-react";

interface Credentials {
  email?: string;
  password?: string;
  details?: string;
}

interface CredentialsDialogProps {
  orderId: string;
  trigger?: React.ReactNode;
}

export function CredentialsDialog({
  orderId,
  trigger,
}: CredentialsDialogProps) {
  const [open, setOpen] = useState(false);
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fetchCredentials = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/orders/${orderId}/credentials`);

      if (response.ok) {
        const data = await response.json();
        setCredentials(data.credentials);
      }
    } catch (error) {
      console.error("Error fetching credentials:", error);
      toast.error("Failed to fetch credentials");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCredentials();
      setIsEditing(false);
    }
  }, [open]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete these credentials?")) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/orders/${orderId}/credentials`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete credentials");
      }

      setCredentials(null);
      toast.success("Credentials deleted successfully");
    } catch (error) {
      console.error("Error deleting credentials:", error);
      toast.error("Failed to delete credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Manage Credentials</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order Credentials</DialogTitle>
          <DialogDescription>
            {credentials
              ? "View or manage the credentials for this order."
              : "Add credentials for this order."}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : credentials && !isEditing ? (
          <div className="space-y-6">
            {credentials.email && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <div className="p-3 rounded-lg bg-muted/50">
                  {credentials.email}
                </div>
              </div>
            )}
            {credentials.password && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">
                  Password
                </label>
                <div className="p-3 rounded-lg bg-muted/50 flex justify-between items-center">
                  <span>
                    {showPassword ? credentials.password : "••••••••"}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="h-8 w-8"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
            {credentials.details && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">
                  Additional Details
                </label>
                <div className="p-3 rounded-lg bg-muted/50 whitespace-pre-wrap">
                  {credentials.details}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <CredentialsForm
            orderId={orderId}
            initialData={isEditing ? credentials : undefined}
            onSuccess={() => {
              fetchCredentials();
              setIsEditing(false);
            }}
            onCancel={isEditing ? () => setIsEditing(false) : undefined}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
