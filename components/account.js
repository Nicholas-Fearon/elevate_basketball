"use client";
import { useState } from "react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import { authConfigured } from "./providers";
export default function Account() {
  const [notice, setNotice] = useState(false);
  if (authConfigured)
    return (
      <>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="login">Log in</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </>
    );
  return (
    <div className="account-placeholder">
      <button
        className="login"
        onClick={() => setNotice(!notice)}
        aria-expanded={notice}
      >
        Log in
      </button>
      {notice && (
        <div className="account-notice" role="status">
          Camp accounts are coming soon.
          <button onClick={() => setNotice(false)} aria-label="Close notice">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
