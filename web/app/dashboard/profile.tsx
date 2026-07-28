'use client';

import React from 'react';
import { User } from 'lucide-react';

export function ProfileView() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Profile</h1>
          <p className="text-sm text-foreground/70">Manage your personal details and account settings</p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant/60 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-semibold text-foreground mb-4">Personal Information</h2>
        <div className="text-sm text-foreground/70">Profile details will appear here.</div>
      </div>
    </div>
  );
}

export default ProfileView;
