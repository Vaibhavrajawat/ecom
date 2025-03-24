import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface Credentials {
  email?: string;
  password?: string;
  details?: string;
}

interface CredentialsFormProps {
  orderId: string;
  initialData?: Credentials;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CredentialsForm({
  orderId,
  initialData,
  onSuccess,
  onCancel,
}: CredentialsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      details: formData.get("details") as string,
    };

    try {
      const response = await fetch(`/api/orders/${orderId}/credentials`, {
        method: initialData ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error ||
            `Failed to ${initialData ? "update" : "save"} credentials`
        );
      }

      toast.success(
        `Credentials ${initialData ? "updated" : "saved"} successfully`
      );
      onSuccess?.();
    } catch (error) {
      console.error("Error saving credentials:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${initialData ? "update" : "save"} credentials`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-sm font-medium text-muted-foreground"
        >
          Email (optional)
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter email"
          defaultValue={initialData?.email}
          className="bg-muted/50"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-muted-foreground"
        >
          Password (optional)
        </label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            defaultValue={initialData?.password}
            className="bg-muted/50 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="details"
          className="text-sm font-medium text-muted-foreground"
        >
          Additional Details (optional)
        </label>
        <Textarea
          id="details"
          name="details"
          placeholder="Enter any additional details"
          defaultValue={initialData?.details}
          className="bg-muted/50 min-h-[100px]"
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {initialData ? "Updating..." : "Saving..."}
            </>
          ) : initialData ? (
            "Update Credentials"
          ) : (
            "Save Credentials"
          )}
        </Button>
      </div>
    </form>
  );
}
