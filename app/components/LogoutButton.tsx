'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button
      // The callbackUrl tells NextAuth where to send the user after logging out
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="px-4 py-2 text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
    >
      Logout
    </button>
  );
}