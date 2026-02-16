import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { Card } from '@components/ui';

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-lg text-gray-600">Last updated: February 16, 2026</p>
      </div>

      <div className="space-y-8">
        <Card>
          <div className="flex items-start gap-4 p-2">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Our Commitment to Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                At LosstAndFound, we take your privacy seriously. This policy describes how we collect, use, and handle your information when you use our website and services. We are committed to protecting your personal data and ensuring transparency in our processing activities.
              </p>
            </div>
          </div>
        </Card>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-primary-600" />
            1. Information We Collect
          </h2>
          <div className="grid gap-4 text-gray-600">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Account Information</h3>
              <p>When you register, we collect your name, email address, and phone number to verify your identity and facilitate communication between finders and owners.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Item and Report Data</h3>
              <p>We collect information about lost and found items, including descriptions, categories, locations, and photos, to facilitate matching and recovery.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Location Information</h3>
              <p>With your consent, we may collect location data when you report a lost or found item to provide more accurate matching services.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary-600" />
            2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-600 ml-4">
            <li>To provide and maintain our item matching services.</li>
            <li>To notify you about potential matches for your reported items.</li>
            <li>To facilitatecommunication between users regarding found items.</li>
            <li>To verify high-value item claims through our administrative process.</li>
            <li>To improve our system and develop new features for the community.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary-600" />
            3. Data Sharing and Security
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We do not sell your personal information to third parties. Your contact information is only shared with another user when a potential match is confirmed and both parties agree to communicate for item recovery.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We implement industry-standard security measures to protect your data, including encryption of sensitive information and regular security audits of our systems.
          </p>
        </section>

        <section className="bg-primary-50 p-8 rounded-2xl border border-primary-100">
          <h2 className="text-xl font-bold text-primary-900 mb-2">Contact Us</h2>
          <p className="text-primary-800">
            If you have any questions about this Privacy Policy, please contact our privacy team at 
            <a href="mailto:privacy@losstandfound.com" className="font-bold underline ml-1">privacy@losstandfound.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
