import React from 'react';
import SettingsClient from './settings-client';

export const metadata = {
  title: 'Account & Security Settings | Individual Dashboard',
  description: 'Manage your account security and privacy settings',
};

export default function SettingsPage() {
  return <SettingsClient />;
}
