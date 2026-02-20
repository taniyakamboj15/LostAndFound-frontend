import { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, Save, CheckCircle } from 'lucide-react';
import { Card, Button } from '@components/ui';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@hooks/useToast';
import api from '../services/api';

interface NotificationPrefs {
  emailOptOut: boolean;
  smsOptOut: boolean;
  channels: string[];
}

const CHANNEL_OPTIONS = [
  { key: 'EMAIL', label: 'Email', icon: Mail, description: 'Receive email notifications for claims, matches, and reminders.' },
  { key: 'SMS', label: 'SMS', icon: MessageSquare, description: 'Receive SMS alerts for high-priority updates.' },
  { key: 'PUSH', label: 'In-App / Push', icon: Smartphone, description: 'Receive real-time in-app notifications.' },
];

const NotificationPreferences = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [prefs, setPrefs] = useState<NotificationPrefs>({
    emailOptOut: false,
    smsOptOut: false,
    channels: ['EMAIL', 'PUSH'],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load existing prefs from backend (user profile)
    const loadPrefs = async () => {
      try {
        const res = await api.get('/api/users/me');
        const notifPrefs = res.data?.data?.notificationPreferences;
        if (notifPrefs) {
          setPrefs({
            emailOptOut: notifPrefs.emailOptOut ?? false,
            smsOptOut: notifPrefs.smsOptOut ?? false,
            channels: notifPrefs.channels ?? ['EMAIL', 'PUSH'],
          });
        }
      } catch {
        // Graceful degradation — defaults are fine
      }
    };
    loadPrefs();
  }, []);

  const toggleChannel = (channel: string) => {
    setPrefs(prev => {
      const active = prev.channels.includes(channel);
      const updated = active
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel];
      return {
        ...prev,
        channels: updated,
        emailOptOut: channel === 'EMAIL' ? active : prev.emailOptOut,
        smsOptOut: channel === 'SMS' ? active : prev.smsOptOut,
      };
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch('/api/users/me/notification-preferences', {
        notificationPreferences: {
          emailOptOut: prefs.emailOptOut,
          smsOptOut: prefs.smsOptOut,
          channels: prefs.channels,
        },
      });
      toast.success('Notification preferences saved');
      setSaved(true);
    } catch {
      toast.error('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notification Preferences</h1>
        <p className="text-gray-600 mt-1">
          Control how and when you receive notifications for <strong>{user?.email}</strong>.
        </p>
      </div>

      {/* Channel toggles */}
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <Bell className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Active Channels</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          We use an escalation model: in-app notification first, then email after 24 hours, then SMS after 72 hours — only if you haven't engaged.
        </p>
        <div className="space-y-3">
          {CHANNEL_OPTIONS.map(({ key, label, icon: Icon, description }) => {
            const isActive = prefs.channels.includes(key);
            return (
              <div
                key={key}
                onClick={() => toggleChannel(key)}
                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isActive
                    ? 'border-primary-500 bg-primary-50/50'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className={`mt-0.5 p-2 rounded-lg ${isActive ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-500'}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{label}</span>
                    <div className={`w-10 h-5 rounded-full transition-colors ${isActive ? 'bg-primary-500' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Escalation info */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Escalation Schedule</h2>
        <div className="space-y-2">
          {[
            { step: 1, label: 'Immediate', desc: 'In-app / push notification', channel: 'PUSH' },
            { step: 2, label: '+ 24 hours', desc: 'Email notification (if unread)', channel: 'EMAIL' },
            { step: 3, label: '+ 72 hours', desc: 'SMS notification (for urgent items)', channel: 'SMS' },
          ].map(({ step, label, desc, channel }) => (
            <div key={step} className="flex items-center gap-3 text-sm">
              <span className={`flex-none w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                prefs.channels.includes(channel) ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400 line-through'
              }`}>
                {step}
              </span>
              <span className="font-medium text-gray-700 w-24">{label}</span>
              <span className="text-gray-500">{desc}</span>
              {!prefs.channels.includes(channel) && (
                <span className="ml-auto text-xs text-gray-400 italic">disabled</span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Save */}
      <div className="flex items-center justify-between">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" /> Saved
          </span>
        )}
        <Button
          variant="primary"
          onClick={handleSave}
          isLoading={isSaving}
          className="ml-auto"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferences;
