export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using NotaryFlow ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                NotaryFlow is a software-as-a-service platform designed to help notaries public manage their appointments, clients, billing, and business operations. The service includes scheduling, payment processing, calendar integration, and business management tools.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Accounts</h2>
              <p className="text-gray-600 mb-4">
                3.1. You must provide accurate and complete information when creating an account.<br/>
                3.2. You are responsible for maintaining the confidentiality of your account credentials.<br/>
                3.3. You must be a licensed notary public or authorized representative to use this service for business operations.<br/>
                3.4. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Payment Terms</h2>
              <p className="text-gray-600 mb-4">
                4.1. NotaryFlow offers subscription-based pricing with monthly billing cycles.<br/>
                4.2. Payments are processed through Stripe and are subject to Stripe's terms of service.<br/>
                4.3. Subscription fees are non-refundable except as required by law.<br/>
                4.4. We reserve the right to change pricing with 30 days notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. User Responsibilities</h2>
              <p className="text-gray-600 mb-4">
                5.1. You must comply with all applicable notary laws and regulations.<br/>
                5.2. You are responsible for the accuracy of all information entered into the system.<br/>
                5.3. You must not use the service for illegal activities or to facilitate illegal acts.<br/>
                5.4. You agree to maintain professional standards in all client interactions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Data and Privacy</h2>
              <p className="text-gray-600 mb-4">
                6.1. We collect and process data as described in our Privacy Policy.<br/>
                6.2. You retain ownership of all data you input into the system.<br/>
                6.3. We use industry-standard security measures to protect your data.<br/>
                6.4. We may aggregate anonymized data for analytics and service improvement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Service Availability</h2>
              <p className="text-gray-600 mb-4">
                7.1. We strive to maintain 99.9% uptime but do not guarantee uninterrupted service.<br/>
                7.2. We may perform scheduled maintenance with advance notice when possible.<br/>
                7.3. We are not liable for damages resulting from service interruptions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                8.1. The NotaryFlow service and its original content are owned by us.<br/>
                8.2. You retain rights to your data and content.<br/>
                8.3. You may not copy, modify, or distribute our proprietary software.<br/>
                8.4. We grant you a limited, non-exclusive license to use the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                9.1. Our liability is limited to the amount paid for the service in the preceding 12 months.<br/>
                9.2. We are not liable for indirect, incidental, or consequential damages.<br/>
                9.3. We make no warranties about the accuracy or completeness of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Termination</h2>
              <p className="text-gray-600 mb-4">
                10.1. You may terminate your account at any time.<br/>
                10.2. We may terminate accounts for violations of these terms.<br/>
                10.3. Upon termination, you lose access to the service.<br/>
                10.4. We will retain your data for 30 days after termination for recovery purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about these Terms of Service, please contact us at:<br/>
                Email: support@notaryflow.app<br/>
                Address: [Your Business Address]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Governing Law</h2>
              <p className="text-gray-600 mb-4">
                These terms are governed by and construed in accordance with the laws of [Your State/Country], without regard to conflict of law principles.
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
