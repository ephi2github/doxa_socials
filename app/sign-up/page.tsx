import { GOOGLE_ENABLED } from "@/lib/auth";
import SignUpClient from "./sign-up-client";

// Read the Google config per request, not at build time — otherwise adding the
// credentials in production would need a full rebuild before the button appears.
export const dynamic = "force-dynamic";

export default function SignUp() {
  return <SignUpClient googleEnabled={GOOGLE_ENABLED} />;
}
