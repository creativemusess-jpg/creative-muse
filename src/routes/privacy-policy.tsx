import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, PolicySection, PolicySubsection, PolicyList, PolicyPara, PolicyDivider, PolicyContact } from "@/components/site/PolicyPage";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Creative Muse" },
      { name: "description", content: "Read the Creative Muse Privacy Policy and learn how personal information is collected, used, stored and protected." },
      { property: "og:title", content: "Privacy Policy | Creative Muse" },
      { property: "og:description", content: "Read the Creative Muse Privacy Policy and learn how personal information is collected, used, stored and protected." },
      { property: "og:url", content: "https://creativemusee.com/privacy-policy" },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <PolicyPage eyebrow="Legal" title="Privacy Policy" lastUpdated="14/06/2026">
      <PolicySection id="introduction" title="Introduction">
        <PolicyPara>
          Welcome to Creative Muse ("Company," "we," "our," or "us"). Your privacy is important to us, and we are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, process, share, and protect your personal data when you visit or use our website, mobile website, customer portal, or any related online services (collectively referred to as the "Website").
        </PolicyPara>
        <PolicyPara>
          By accessing or using our Website, creating an account, placing an order, subscribing to our newsletter, or interacting with our services, you acknowledge that you have read, understood, and agree to this Privacy Policy. If you do not agree with any part of this Privacy Policy, please discontinue the use of our Website immediately.
        </PolicyPara>
        <PolicyPara>
          This Privacy Policy applies to all visitors, registered users, customers, suppliers, vendors, business partners, affiliates, and any individual who interacts with our Website.
        </PolicyPara>
      </PolicySection>

      <PolicySection id="definitions" title="Definitions">
        <PolicyPara>For the purposes of this Privacy Policy:</PolicyPara>
        <PolicyList items={[
          'Account means a registered profile created by a customer on our Website.',
          'Personal Information means any information that identifies or can reasonably identify an individual directly or indirectly.',
          'Sensitive Personal Information refers to information requiring enhanced protection under applicable laws.',
          'Processing means collecting, recording, organizing, storing, modifying, retrieving, consulting, using, transmitting, deleting, or otherwise handling personal information.',
          'Cookies are small data files placed on your browser or device that help improve your browsing experience.',
          'Website means the Creative Muse online platform including all associated pages, mobile versions, APIs, customer dashboards, and future applications.',
          'User, Customer, You, and Your refer to anyone using our Website.',
        ]} />
      </PolicySection>

      <PolicySection id="information-we-collect" title="Information We Collect">
        <PolicyPara>Depending on how you interact with our Website, we may collect different categories of information.</PolicyPara>

        <PolicySubsection id="personal-identification" title="A. Personal Identification Information">
          <PolicyPara>When you create an account or place an order, we may collect:</PolicyPara>
          <PolicyList items={[
            'Full Name',
            'Email Address',
            'Mobile Number',
            'Alternate Contact Number',
            'Billing Address',
            'Shipping Address',
            'City',
            'State',
            'Country',
            'Postal Code',
            'Company Name (if applicable)',
            'GST Number (if applicable)',
            'Date of Birth (optional)',
            'Gender (optional)',
          ]} />
        </PolicySubsection>

        <PolicySubsection id="account-info" title="B. Account Information">
          <PolicyPara>When you register for an account, we may collect:</PolicyPara>
          <PolicyList items={[
            'Username',
            'Login Credentials',
            'Encrypted Password',
            'Google Sign-In Information',
            'Account Preferences',
            'Wishlist',
            'Saved Addresses',
            'Saved Payment Preferences',
            'Shopping Cart Data',
            'Purchase History',
            'Order History',
          ]} />
          <PolicyPara>Passwords are securely encrypted and are never stored in plain text.</PolicyPara>
        </PolicySubsection>

        <PolicySubsection id="order-info" title="C. Order Information">
          <PolicyPara>Whenever you purchase products, we collect:</PolicyPara>
          <PolicyList items={[
            'Products Ordered',
            'Quantity',
            'Product Variants',
            'Order Number',
            'Invoice Information',
            'Order Status',
            'Shipping Method',
            'Courier Details',
            'Tracking Information',
            'Delivery Confirmation',
            'Return Requests',
            'Refund Requests',
            'Exchange Requests',
          ]} />
        </PolicySubsection>

        <PolicySubsection id="payment-info" title="D. Payment Information">
          <PolicyPara>Payments may be processed through secure third-party payment gateways. Depending on your selected payment method, we may collect:</PolicyPara>
          <PolicyList items={[
            'Payment Method',
            'Transaction ID',
            'Payment Status',
            'Payment Timestamp',
            'Partial Payment Information',
          ]} />
          <PolicyPara>We do not store your complete debit card, credit card, CVV, UPI PIN, internet banking passwords, or other highly sensitive financial credentials on our servers.</PolicyPara>
        </PolicySubsection>

        <PolicySubsection id="communication-info" title="E. Communication Information">
          <PolicyPara>Whenever you contact us, we may collect:</PolicyPara>
          <PolicyList items={[
            'Emails',
            'Contact Form Messages',
            'Customer Support Requests',
            'Live Chat Conversations',
            'WhatsApp Communications',
            'Phone Call Records (where legally permitted)',
            'Feedback',
            'Survey Responses',
            'Product Reviews',
          ]} />
        </PolicySubsection>

        <PolicySubsection id="auto-collected" title="Information Automatically Collected">
          <PolicyPara>Whenever you browse our Website, certain information is automatically collected. This may include:</PolicyPara>
          <PolicyList items={[
            'IP Address',
            'Browser Type',
            'Browser Version',
            'Operating System',
            'Device Information',
            'Screen Resolution',
            'Device Identifier',
            'Language Preference',
            'Time Zone',
            'Referral URL',
            'Pages Visited',
            'Time Spent on Pages',
            'Clickstream Data',
            'Scroll Activity',
            'Session Duration',
            'Exit Pages',
            'Download Activity',
            'Search Queries',
            'Shopping Behaviour',
          ]} />
        </PolicySubsection>
      </PolicySection>

      <PolicySection id="cookies" title="Cookies and Tracking Technologies">
        <PolicyPara>Our Website uses cookies and similar technologies to enhance user experience and improve our services. Cookies may be used to:</PolicyPara>
        <PolicyList items={[
          'Keep you logged in',
          'Remember shopping cart items',
          'Save wishlist items',
          'Remember your language preferences',
          'Improve website performance',
          'Analyze user behaviour',
          'Personalize recommendations',
          'Prevent fraudulent activity',
          'Improve security',
          'Measure marketing effectiveness',
        ]} />
        <PolicyPara>Types of cookies we may use include:</PolicyPara>
        <PolicyList items={[
          'Essential Cookies',
          'Functional Cookies',
          'Analytics Cookies',
          'Performance Cookies',
          'Marketing Cookies',
          'Advertising Cookies',
          'Preference Cookies',
          'Session Cookies',
          'Persistent Cookies',
          'Third-Party Cookies',
        ]} />
        <PolicyPara>You may disable cookies through your browser settings; however, certain Website features may not function properly.</PolicyPara>
      </PolicySection>

      <PolicySection id="google-signin" title="Google Sign-In and Authentication">
        <PolicyPara>Our Website may allow users to create an account or log in using Google OAuth. If you choose to sign in with Google, we may receive limited profile information authorized by you, such as:</PolicyPara>
        <PolicyList items={[
          'Name',
          'Email Address',
          'Profile Picture',
          'Google Account Identifier',
        ]} />
        <PolicyPara>We do not access your Gmail, Google Drive, Calendar, Contacts, or any other Google data unless you explicitly authorize such access for a specific feature.</PolicyPara>
      </PolicySection>

      <PolicySection id="how-we-collect" title="How We Collect Information">
        <PolicyPara>We collect information through multiple methods, including but not limited to:</PolicyPara>
        <PolicyList items={[
          'Account Registration',
          'Product Purchases',
          'Checkout Forms',
          'Newsletter Subscription',
          'Contact Forms',
          'Live Chat',
          'Customer Support',
          'Product Reviews',
          'Wishlist Features',
          'Cart Activities',
          'Cookies',
          'Analytics Tools',
          'Marketing Campaigns',
          'Social Media Interactions',
          'Google Login',
          'Promotional Events',
          'Surveys',
          'Giveaways',
          'Referral Programs',
        ]} />
      </PolicySection>

      <PolicySection id="purpose" title="Purpose of Collecting Information">
        <PolicyPara>We collect personal information to:</PolicyPara>
        <PolicyList items={[
          'Process customer orders',
          'Deliver purchased products',
          'Provide customer support',
          'Improve website performance',
          'Personalize shopping experiences',
          'Recommend relevant products',
          'Detect fraudulent activities',
          'Prevent unauthorized access',
          'Maintain customer accounts',
          'Send order confirmations',
          'Process returns and refunds',
          'Improve customer satisfaction',
          'Conduct internal analytics',
          'Comply with legal obligations',
          'Resolve disputes',
          'Enforce our Terms and Conditions',
          'Improve security measures',
          'Communicate important service updates',
        ]} />
      </PolicySection>

      <PolicySection id="how-we-use" title="How We Use Your Information">
        <PolicyPara>We use the information collected for legitimate business purposes, including but not limited to:</PolicyPara>
        <PolicyList items={[
          'Processing and fulfilling customer orders.',
          'Managing your account and profile.',
          'Providing customer support and responding to inquiries.',
          'Processing payments and refunds.',
          'Delivering products to your specified address.',
          'Sending order confirmations, invoices, and shipping updates.',
          'Personalizing your shopping experience.',
          'Displaying relevant products and recommendations.',
          'Improving website functionality and performance.',
          'Conducting internal research and analytics.',
          'Preventing fraudulent transactions and unauthorized activities.',
          'Verifying customer identity where required.',
          'Managing promotional offers, discounts, and loyalty programs.',
          'Sending newsletters and marketing communications (where consent is provided).',
          'Improving customer service based on feedback.',
          'Detecting bugs, technical issues, and security vulnerabilities.',
          'Complying with applicable legal obligations.',
          'Enforcing our Terms & Conditions and other policies.',
        ]} />
      </PolicySection>

      <PolicySection id="sharing" title="Sharing of Personal Information">
        <PolicyPara>We value your privacy and do not sell your personal information. However, we may share your information in limited circumstances necessary to operate our business.</PolicyPara>
        <PolicyPara>Your information may be shared with:</PolicyPara>
        <PolicyList items={[
          'Payment gateway providers.',
          'Shipping and courier partners.',
          'Cloud hosting providers.',
          'Customer support platforms.',
          'Email service providers.',
          'SMS and WhatsApp communication providers.',
          'Analytics service providers.',
          'Marketing platforms.',
          'Fraud prevention services.',
          'Legal advisors and auditors.',
          'Government authorities where required by law.',
        ]} />
        <PolicyPara>All third-party service providers are required to process your information only for authorized purposes and are expected to maintain appropriate security measures.</PolicyPara>
      </PolicySection>

      <PolicySection id="third-party" title="Third-Party Services">
        <PolicyPara>Our Website may integrate with various third-party services, including but not limited to:</PolicyPara>
        <PolicyList items={[
          'Google Analytics',
          'Google Sign-In (OAuth)',
          'Google Tag Manager',
          'Meta Pixel',
          'Payment Gateway Providers',
          'Shipping Aggregators',
          'Email Marketing Platforms',
          'Cloud Storage Providers',
          'CDN Providers',
          'Live Chat Services',
        ]} />
        <PolicyPara>These services operate under their own privacy policies, and we encourage you to review them before using their services.</PolicyPara>
      </PolicySection>

      <PolicySection id="data-security" title="Data Security">
        <PolicyPara>Protecting your information is one of our highest priorities. We implement appropriate administrative, technical, and physical safeguards, including:</PolicyPara>
        <PolicyList items={[
          'SSL/TLS encryption.',
          'Secure servers.',
          'Firewall protection.',
          'Database encryption where applicable.',
          'Encrypted passwords.',
          'Role-based access control.',
          'Multi-factor authentication for administrators (where enabled).',
          'Regular security monitoring.',
          'Malware scanning.',
          'Security updates and patches.',
          'Limited employee access to customer information.',
          'Secure backup procedures.',
          'Audit logging and monitoring.',
        ]} />
        <PolicyPara>While we strive to protect your information using commercially reasonable security practices, no method of transmission or electronic storage is completely secure. Therefore, we cannot guarantee absolute security.</PolicyPara>
      </PolicySection>

      <PolicySection id="data-retention" title="Data Retention">
        <PolicyPara>We retain your personal information only for as long as necessary to:</PolicyPara>
        <PolicyList items={[
          'Complete transactions.',
          'Provide customer support.',
          'Comply with legal obligations.',
          'Resolve disputes.',
          'Prevent fraud.',
          'Enforce agreements.',
          'Maintain accounting and tax records.',
          'Improve our services.',
        ]} />
        <PolicyPara>When information is no longer required, it will be securely deleted, anonymized, or archived as permitted by applicable laws.</PolicyPara>
      </PolicySection>

      <PolicySection id="international-transfers" title="International Data Transfers">
        <PolicyPara>Depending on the services used by our Website, your information may be transferred to and processed on servers located outside your country of residence.</PolicyPara>
        <PolicyPara>By using our Website, you acknowledge and consent to such transfers where permitted by applicable law. We take reasonable steps to ensure that transferred information remains protected through contractual, technical, and organizational safeguards.</PolicyPara>
      </PolicySection>

      <PolicySection id="your-rights" title="Your Privacy Rights">
        <PolicyPara>Subject to applicable laws, you may have the right to:</PolicyPara>
        <PolicyList items={[
          'Access your personal information.',
          'Correct inaccurate information.',
          'Update your account information.',
          'Delete your personal data.',
          'Restrict or object to certain processing activities.',
          'Withdraw consent where processing is based on consent.',
          'Request a copy of your personal data.',
          'Request data portability where applicable.',
          'Lodge a complaint with an appropriate regulatory authority.',
        ]} />
        <PolicyPara>Requests may be subject to identity verification and applicable legal limitations.</PolicyPara>
      </PolicySection>

      <PolicySection id="children-privacy" title="Children's Privacy">
        <PolicyPara>Our Website is intended for individuals who are at least 18 years of age or the age of majority in their jurisdiction.</PolicyPara>
        <PolicyPara>We do not knowingly collect personal information from children without appropriate parental or legal guardian consent.</PolicyPara>
        <PolicyPara>If we become aware that personal information has been collected from a child in violation of applicable laws, we will take reasonable steps to delete such information promptly.</PolicyPara>
      </PolicySection>

      <PolicySection id="marketing" title="Marketing Communications">
        <PolicyPara>With your consent, we may send:</PolicyPara>
        <PolicyList items={[
          'Promotional emails.',
          'Product launch announcements.',
          'Special offers.',
          'Festival discounts.',
          'Loyalty program updates.',
          'Cart reminders.',
          'Wishlist reminders.',
          'Order follow-ups.',
          'Customer satisfaction surveys.',
        ]} />
        <PolicyPara>You may unsubscribe from marketing communications at any time using the unsubscribe link provided in our emails or by contacting us directly.</PolicyPara>
      </PolicySection>

      <PolicySection id="cookies-policy" title="Cookies Policy">
        <PolicyPara>Our Website uses cookies and similar technologies to:</PolicyPara>
        <PolicyList items={[
          'Improve browsing experience.',
          'Remember user preferences.',
          'Maintain login sessions.',
          'Analyze website traffic.',
          'Measure advertising effectiveness.',
          'Enhance website performance.',
          'Personalize product recommendations.',
        ]} />
        <PolicyPara>Most browsers allow you to manage or disable cookies through browser settings. Disabling cookies may affect the functionality of certain Website features.</PolicyPara>
      </PolicySection>

      <PolicySection id="compliance" title="Compliance with Applicable Laws">
        <PolicyPara>We endeavor to process personal information in accordance with applicable privacy and data protection laws, which may include, where relevant:</PolicyPara>
        <PolicyList items={[
          'Digital Personal Data Protection Act, 2023 (India).',
          'Information Technology Act, 2000 (India).',
          'General Data Protection Regulation (GDPR).',
          'California Consumer Privacy Act (CCPA/CPRA).',
          'Other applicable privacy regulations based on your location.',
        ]} />
        <PolicyPara>Nothing in this Privacy Policy shall limit any statutory rights available to you under applicable law.</PolicyPara>
      </PolicySection>

      <PolicySection id="changes" title="Changes to This Privacy Policy">
        <PolicyPara>We reserve the right to modify, update, or revise this Privacy Policy at any time without prior notice.</PolicyPara>
        <PolicyPara>Changes become effective immediately upon publication on the Website unless otherwise required by law.</PolicyPara>
        <PolicyPara>Your continued use of the Website after any changes constitutes your acceptance of the revised Privacy Policy.</PolicyPara>
        <PolicyPara>We encourage you to review this page periodically to remain informed about our privacy practices.</PolicyPara>
      </PolicySection>

      <PolicySection id="contact" title="Contact Us">
        <PolicyPara>If you have any questions, concerns, requests regarding your personal information, or wish to exercise your privacy rights, please contact us using the details below:</PolicyPara>
        <PolicyContact />
        <PolicyPara>
          <strong>Business Hours:</strong> Monday to Saturday: 11:00 AM – 8:00 PM (IST), Sunday: Closed
        </PolicyPara>
        <PolicyPara>We will make reasonable efforts to respond to your inquiries within 2–5 business days.</PolicyPara>
        <PolicyPara>If your request relates to access, correction, deletion, or other rights concerning your personal information, we may request additional information to verify your identity before processing your request.</PolicyPara>
      </PolicySection>

      <PolicySection id="disclaimer" title="Disclaimer">
        <PolicyPara>While we make every reasonable effort to protect your personal information and maintain accurate records, we do not warrant that our Website will always be free from interruptions, cyber threats, unauthorized access, or technical failures.</PolicyPara>
        <PolicyPara>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, consequential, or special damages arising from unauthorized access, data breaches caused by third parties, force majeure events, or circumstances beyond our reasonable control.</PolicyPara>
      </PolicySection>

      <PolicySection id="acknowledgement" title="Final Acknowledgement">
        <PolicyPara>By accessing and using this Website, you acknowledge that you have read, understood, and agreed to this Privacy Policy and consent to the collection, use, storage, and processing of your information as described herein.</PolicyPara>
      </PolicySection>
    </PolicyPage>
  );
}
