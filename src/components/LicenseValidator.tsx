import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface LicenseInfo {
  valid: boolean;
  type: 'demo' | 'commercial' | 'enterprise';
  features: string[];
  expiresAt: string | null;
  organization?: string;
}

const LicenseValidator: React.FC = () => {
  const [license, setLicense] = useState<LicenseInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    validateLicense();
  }, []);

  const validateLicense = async () => {
    try {
      // Check if running in Electron
      if (window.electronAPI) {
        const licenseInfo = await window.electronAPI.validateLicense();
        setLicense(licenseInfo);
      } else {
        // Web version - commercial mode
        setLicense({
          valid: true,
          type: 'commercial',
          features: ['multi-user', 'real-time', 'certificates', 'analytics'],
          expiresAt: null
        });
      }
    } catch (error) {
      console.error('License validation error:', error);
      setLicense({
        valid: false,
        type: 'commercial',
        features: [],
        expiresAt: null
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">Validation de la licence...</span>
        </div>
      </div>
    );
  }

  if (!license) return null;

  const getLicenseIcon = () => {
    if (!license.valid) return <XCircle className="w-5 h-5 text-red-600" />;
    if (license.type === 'commercial' || license.type === 'enterprise') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
  };

  const getLicenseColor = () => {
    if (!license.valid) return 'border-red-200 bg-red-50';
    if (license.type === 'commercial' || license.type === 'enterprise') {
      return 'border-green-200 bg-green-50';
    }
    return 'border-yellow-200 bg-yellow-50';
  };

  const getLicenseText = () => {
    if (!license.valid) return 'Licence invalide';
    if (license.type === 'commercial') return 'Licence Commerciale Activée';
    if (license.type === 'enterprise') return 'Licence Enterprise Activée';
    return 'Version Web Commerciale';
  };

  return (
    <div className={`fixed bottom-4 right-4 rounded-lg shadow-lg p-4 border ${getLicenseColor()}`}>
      <div className="flex items-center space-x-3">
        <Shield className="w-5 h-5 text-gray-600" />
        <div className="flex items-center space-x-2">
          {getLicenseIcon()}
          <span className="text-sm font-medium text-gray-900">
            {getLicenseText()}
          </span>
        </div>
      </div>
      
      {license.type === 'commercial' && (
        <div className="mt-2 text-xs text-gray-600">
          <div>✓ Version Web Commerciale</div>
          <div>✓ Multi-utilisateurs temps réel</div>
          <div>✓ Support technique premium</div>
        </div>
      )}
      
      {license.type === 'enterprise' && (
        <div className="mt-2 text-xs text-gray-600">
          <div>✓ Version Enterprise</div>
          <div>✓ Fonctionnalités avancées</div>
          <div>✓ Support prioritaire</div>
        </div>
      )}
      
      {license.organization && (
        <div className="mt-1 text-xs text-gray-500">
          Licence: {license.organization}
        </div>
      )}
    </div>
  );
};

export default LicenseValidator;