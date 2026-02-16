import { Gavel, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { Card } from '@components/ui';

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-lg text-gray-600">Last updated: February 16, 2026</p>
      </div>

      <div className="space-y-8">
        <Card>
          <div className="flex items-start gap-4 p-2">
            <div className="bg-primary-100 p-3 rounded-lg">
              <Gavel className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing or using LosstAndFound, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services. LosstAndFound provides a platform for community members to report and recover lost and found items.
              </p>
            </div>
          </div>
        </Card>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            1. User Responsibilities
          </h2>
          <div className="space-y-4 text-gray-600">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Accurate Reporting</h3>
              <p>You agree to provide accurate, current, and complete information when reporting lost or found items. Misrepresentation of ownership or item details is strictly prohibited.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">High-Value Items</h3>
              <p>For high-value items, users must comply with our verification process, which may include providing proof of ownership and meeting at designated secure locations.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Lawful Conduct</h3>
              <p>You agree to comply with all local, state, and national laws regarding property ownership and item recovery. Do not use the service for any illegal purposes.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            2. Limitations of Liability
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            LosstAndFound is a platform to facilitate item recovery. We do not take possession of items (except those stored in our official storage centers) and are not responsible for the physical condition of items recovered through the platform.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We are not liable for any disputes, damages, or losses arising from interactions between users. We recommend always meeting in public, well-lit places or at our official storage locations for item handovers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary-600" />
            3. Account Suspension
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to suspend or terminate accounts that violate our terms, engage in fraudulent activity, or disrupt the community experience. Users who repeatedly file false claims will be permanently banned from the platform.
          </p>
        </section>

        <section className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Questions?</h2>
          <p className="text-gray-600">
            If you have any questions regarding these terms, please contact our support team at 
            <a href="mailto:support@losstandfound.com" className="font-bold text-primary-600 hover:underline ml-1">support@losstandfound.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
