'use client'
import React, { useState } from 'react'
import { useApp } from '../../../context/AppContext'

const EmployeeSettingsPage = () => {
  const { currentUser } = useApp()
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    preferences: {
      theme: 'dark',
      language: 'en',
      timezone: 'UTC'
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30
    }
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    })
  }

  const handlePreferenceChange = (key: string, value: string) => {
    setSettings({
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value
      }
    })
  }

  const handleSecurityChange = (key: string, value: boolean | number) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [key]: value
      }
    })
  }

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('user_settings', JSON.stringify(settings))
    alert('Settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-white/70">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Notifications Settings */}
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-sm text-white/60">Receive notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Push Notifications</p>
                <p className="text-sm text-white/60">Receive push notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => handleNotificationChange('push', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">SMS Notifications</p>
                <p className="text-sm text-white/60">Receive notifications via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.sms}
                  onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Preferences Settings */}
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Theme</label>
              <select
                value={settings.preferences.theme}
                onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none appearance-none pr-10"
              >
                <option value="dark" className="bg-slate-900">Dark</option>
                <option value="light" className="bg-slate-900">Light</option>
                <option value="auto" className="bg-slate-900">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Language</label>
              <select
                value={settings.preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none appearance-none pr-10"
              >
                <option value="en" className="bg-slate-900">English</option>
                <option value="es" className="bg-slate-900">Spanish</option>
                <option value="fr" className="bg-slate-900">French</option>
                <option value="de" className="bg-slate-900">German</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Timezone</label>
              <select
                value={settings.preferences.timezone}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none appearance-none pr-10"
              >
                <option value="UTC" className="bg-slate-900">UTC</option>
                <option value="EST" className="bg-slate-900">Eastern Time (EST)</option>
                <option value="PST" className="bg-slate-900">Pacific Time (PST)</option>
                <option value="GMT" className="bg-slate-900">Greenwich Mean Time (GMT)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Security</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-white/60">Add an extra layer of security to your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactor}
                  onChange={(e) => handleSecurityChange('twoFactor', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmployeeSettingsPage

