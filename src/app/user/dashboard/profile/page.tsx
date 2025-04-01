import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
  console.log("Starting ProfilePage component rendering");

  // Get the session directly
  const session = await getServerSession(authOptions);
  console.log("Session data:", session ? "Session found" : "No session");

  // Show basic page that doesn't redirect if no session
  if (!session || !session.user?.id) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-red-500 mt-2">
            Please{" "}
            <a href="/login" className="underline">
              log in
            </a>{" "}
            to view your profile.
          </p>
        </div>
      </div>
    );
  }

  // Try to get user data with provider information if available
  let userData;
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    if (user) {
      // Check if user has Google provider
      const provider =
        user.accounts?.length > 0 ? user.accounts[0].provider : null;

      userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        provider: provider,
      };
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  // Fallback to session data if database query fails
  if (!userData) {
    userData = {
      id: session.user.id,
      name: session.user.name || "",
      email: session.user.email || "",
      provider: null, // Can't determine provider from session alone
    };
  }

  console.log(
    "Using profile data for user:",
    userData.id,
    "Provider:",
    userData.provider
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-500 mt-2">
          Manage your account information and settings
        </p>
      </div>

      <ProfileClient user={userData} />
    </div>
  );
}
