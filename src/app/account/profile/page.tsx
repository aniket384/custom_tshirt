import type { Metadata } from "next";
import { DemoNotice, ProfileForm } from "@/components/account/AccountClient";
import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = noindexMetadata("Profile", "/account/profile");

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="heading-display text-5xl">Profile</h1>
      <DemoNotice />
      <ProfileForm />
    </div>
  );
}
