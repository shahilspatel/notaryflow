export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                1.1. <strong>Account Information:</strong> Name, email address, phone number, and professional credentials.<br/>
                1.2. <strong>Business Data:</strong> Client information, appointment details, financial records, and business documents.<br/>
                1.3. <strong>Usage Data:</strong> How you interact with our service, including login times and feature usage.<br/>
                1.4. <strong>Technical Data:</strong> IP address, browser type, device information, and access logs.<br/>
                1.5. <strong>Payment Information:</strong> Payment processing is handled by Stripe; we do not store credit card details.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                2.1. <strong>Service Provision:</strong> To provide and maintain the NotaryFlow service.<br/>
                2.2. <strong>Account Management:</strong> To manage your account and provide customer support.<br/>
                2.3. <strong>Payment Processing:</strong> To process subscription payments and manage billing.<br/>
                2.4. <strong>Service Improvement:</strong> To analyze usage patterns and improve our service.<br/>
                2.5. <strong>Communication:</strong> To send service updates and important notifications.<br/>
                2.6. <strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Data Security</h2>
              <p className="text-gray-600 mb-4">
                3.1. <strong>Encryption:</strong> All data is encrypted in transit using TLS 1.2+ and at rest.<br/>
                3.2. <strong>Access Control:</strong> Strict access controls and authentication mechanisms.<br/>
                3.3. <strong>Regular Audits:</strong> Regular security audits and vulnerability assessments.<br/>
                3.4. <strong>Compliance:</strong> We comply with relevant data protection regulations including GDPR and CCPA.<br/>
                3.5. <strong>Backup:</strong> Regular automated backups with disaster recovery procedures.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-600 mb-4">
                4.1. <strong>Service Providers:</strong> We share data with trusted third-party service providers:<br/>
                &nbsp;&nbsp;• Stripe for payment processing<br/>
                &nbsp;&nbsp;• Google for calendar integration<br/>
                &nbsp;&nbsp;• Resend for email delivery<br/>
                &nbsp;&nbsp;• Supabase for database hosting<br/>
                4.2. <strong>Legal Requirements:</strong> We may disclose data if required by law or legal process.<br/>
                4.3. <strong>Business Transfers:</strong> Data may be transferred in connection with business sales or mergers.<br/>
                4.4. <strong>No Sale of Data:</strong> We do not sell personal information to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Your Rights and Choices</h2>
              <p className="text-gray-600 mb-4">
                5.1. <strong>Access:</strong> You can access and download your data at any time.<br/>
                5.2. <strong>Correction:</strong> You can update or correct your personal information.<br/>
                5.3. <strong>Deletion:</strong> You can request deletion of your account and data.<br/>
                5.4. <strong>Portability:</strong> You can export your data in a portable format.<br/>
                5.5. <strong>Opt-out:</strong> You can opt out of non-essential communications.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Data Retention</h2>
              <p className="text-gray-600 mb-4">
                6.1. <strong>Account Data:</strong> Retained while your account is active.<br/>
                6.2. <strong>Deleted Accounts:</strong> Data retained for 30 days for recovery purposes, then permanently deleted.<br/>
                6.3. <strong>Legal Requirements:</strong> Data may be retained longer if required by law.<br/>
                6.4. <strong>Analytics Data:</strong> Anonymized analytics data may be retained indefinitely.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. International Data Transfers</h2>
              <p className="text-gray-600 mb-4">
                7.1. Your data may be transferred to and processed in countries other than your own.<br/>
                7.2. We ensure appropriate safeguards are in place for international data transfers.<br/>
                7.3. Our service providers are located in the United States and EU regions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">
                8.1. <strong>Essential Cookies:</strong> Required for the service to function properly.<br/>
                8.2. <strong>Analytics Cookies:</strong> Used to understand how our service is used.<br/>
                8.3. <strong>Preference Cookies:</strong> Remember your settings and preferences.<br/>
                8.4. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-600 mb-4">
                9.1. Our service is not intended for children under 18 years of age.<br/>
                9.2. We do not knowingly collect personal information from children.<br/>
                9.3. If we become aware of collecting information from children, we will delete it promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Data Breach Notification</h2>
              <p className="text-gray-600 mb-4">
                10.1. We will notify you of any data breach that may affect your personal information.<br/>
                10.2. Notifications will be sent within 72 hours of discovery, as required by law.<br/>
                10.3. We will provide information about the breach and steps you can take to protect yourself.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Changes to Privacy Policy</h2>
              <p className="text-gray-600 mb-4">
                11.1. We may update this privacy policy from time to time.<br/>
                11.2. Changes will be posted on this page with an updated revision date.<br/>
                11.3. We will notify users of significant changes via email.<br/>
                11.4. Your continued use of the service constitutes acceptance of changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about this Privacy Policy or want to exercise your rights, please contact us:<br/>
                <strong>Email:</strong> privacy@notaryflow.app<br/>
                <strong>Address:</strong> [Your Business Address]<br/>
                <strong>Phone:</strong> [Your Phone Number]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Regulatory Compliance</h2>
              <p className="text-gray-600 mb-4">
                13.1. <strong>GDPR:</strong> We comply with the EU General Data Protection Regulation.<br/>
                13.2. <strong>CCPA:</strong> We comply with the California Consumer Privacy Act.<br/>
                13.3. <strong>Notary Laws:</strong> We respect notary confidentiality requirements and professional ethics.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
