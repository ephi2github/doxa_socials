import { GOOGLE_ENABLED } from "@/lib/auth";
import SignInClient from "./sign-in-client";

// Read the Google config per request, not at build time — otherwise adding the
// credentials in production would need a full rebuild before the button appears.
export const dynamic = "force-dynamic";

export default function SignIn() {
  return <SignInClient googleEnabled={GOOGLE_ENABLED} />;
}
