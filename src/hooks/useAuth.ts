import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface SignInData {
  email: string;
  password: string;
}

export function useAuth() {
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = session.status === "authenticated";
  const user = session.data?.user;

  const signup = async (data: SignUpData) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Sending signup request with data:", {
        name: data.name,
        email: data.email,
        passwordProvided: !!data.password,
      });

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Signup API response:", {
        status: response.status,
        ok: response.ok,
        error: result.error,
        details: result.details,
      });

      if (!response.ok) {
        const errorMessage = result.details
          ? `${result.error}: ${JSON.stringify(result.details)}`
          : result.error || "Failed to sign up";
        throw new Error(errorMessage);
      }

      // After successful signup, log the user in
      await login({
        email: data.email,
        password: data.password,
      });

      return result;
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err instanceof Error ? err.message : "An error occurred during signup"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: SignInData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          throw new Error("Invalid email or password. Please try again.");
        } else {
          throw new Error(result.error);
        }
      }

      router.push("/");
      router.refresh();
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      await signIn("google", { callbackUrl: "/" });
      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during Google login"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      await signOut({ callbackUrl: "/" });
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during logout"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
  };
}
