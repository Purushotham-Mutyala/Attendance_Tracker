import React from 'react';
import Sidebar from '../components/ui/Sidebar';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import ThemeToggle from '../components/ui/ThemeToggle';
import CollegeSelect from '../components/ui/CollegeSelect';
import { useTheme } from '../context/ThemeContext';
import { Bell, Moon, School } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { college } = useTheme();
  const isMobile = window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isMobile={isMobile} />
      
      <div className={`${isMobile ? 'pt-16 pl-0' : 'pl-16 lg:pl-64'} transition-all duration-300`}>
        <main className="p-4 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

          <div className="grid grid-cols-1 gap-6 max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Moon className="w-5 h-5 mr-2" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Choose between light and dark theme
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <School className="w-5 h-5 mr-2" />
                  Institution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white mb-1">College</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Select your college or university
                    </p>
                    <CollegeSelect />
                  </div>
                  
                  <div className="pt-4 border-t dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Current Institution: <span className="font-medium text-gray-900 dark:text-white">{college}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive email updates about your attendance
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get notified about important updates
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Mass Bunk Alerts</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get notified about mass bunk polls
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;