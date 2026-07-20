import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, PolicySection, PolicySubsection, PolicyList, PolicyPara, PolicyDivider, PolicyContact } from "@/components/site/PolicyPage";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Creative Muse" },
      { name: "description", content: "Read the terms governing use of the Creative Muse website, customer accounts, orders, payments and purchases." },
      { property: "og:title", content: "Terms & Conditions | Creative Muse" },
      { property: "og:description", content: "Read the terms governing use of the Creative Muse website, customer accounts, orders, payments and purchases." },
      { property: "og:url", content: "https://creativemusee.com/terms-and-conditions" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PolicyPage eyebrow="Legal" title="Terms & Conditions" lastUpdated="14/06/2026">
      <PolicySection id="introduction" title="Introduction">
        <PolicyPara>
          Welcome to Creative Muse ("Company," "we," "our," or "us"). These Terms and Conditions ("Terms") govern your access to and use of the Creative Muse website, including all webpages, mobile versions, customer accounts, online shopping services, and any related services (collectively referred to as the "Website").
        </PolicyPara>
        <PolicyPara>
          By accessing, browsing, creating an account, purchasing products, or otherwise using this Website, you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions, our Privacy Policy, Shipping Policy, Return & Refund Policy, and any additional policies published on the Website.
        </PolicyPara>
        <PolicyPara>
          If you do not agree with these Terms, please discontinue the use of our Website immediately.
        </PolicyPara>
      </PolicySection>

      <PolicySection id="definitions" title="Definitions">
        <PolicyPara>For the purposes of these Terms:</PolicyPara>
        <PolicyList items={[
          'Company, We, Us, or Our refers to Creative Muse.',
          'Website refers to https://creativemusee.com and all related webpages, mobile applications (if launched), APIs, customer portals, and associated online services.',
          'Customer, User, You, or Your refers to any individual or entity accessing or using the Website.',
          'Products refers to jewellery, accessories, gift items, and any other merchandise offered through our Website.',
          'Order means a purchase request submitted by a customer.',
          'Services include product sales, customer support, account management, order processing, and other services provided by Creative Muse.',
        ]} />
      </PolicySection>

      <PolicySection id="eligibility" title="Eligibility">
        <PolicyPara>By using this Website, you represent and warrant that:</PolicyPara>
        <PolicyList items={[
          'You are at least 18 years of age or the age of majority in your jurisdiction.',
          'You have the legal capacity to enter into binding contracts.',
          'All information provided by you is true, complete, and accurate.',
          'You will use the Website only for lawful purposes.',
          'You will comply with all applicable laws and regulations while using our Website.',
        ]} />
        <PolicyPara>If we discover that false or misleading information has been provided, we reserve the right to suspend or terminate your account.</PolicyPara>
      </PolicySection>

      <PolicySection id="acceptance" title="Acceptance of Terms">
        <PolicyPara>By accessing or using our Website, you agree to be bound by these Terms and all applicable laws and regulations.</PolicyPara>
        <PolicyPara>If you create an account, place an order, or interact with our services, you further acknowledge that these Terms constitute a legally binding agreement between you and Creative Muse.</PolicyPara>
      </PolicySection>

      <PolicySection id="changes" title="Changes to These Terms">
        <PolicyPara>Creative Muse reserves the right to modify, update, replace, or revise these Terms at any time without prior notice.</PolicyPara>
        <PolicyPara>Changes become effective immediately upon publication on the Website unless otherwise required by law.</PolicyPara>
        <PolicyPara>Your continued use of the Website following any updates constitutes acceptance of the revised Terms.</PolicyPara>
        <PolicyPara>We encourage users to review these Terms periodically.</PolicyPara>
      </PolicySection>

      <PolicySection id="website-availability" title="Website Availability">
        <PolicyPara>While we strive to ensure uninterrupted access to our Website, we do not guarantee continuous availability.</PolicyPara>
        <PolicyPara>The Website may occasionally become unavailable due to:</PolicyPara>
        <PolicyList items={[
          'Scheduled maintenance',
          'Software updates',
          'Hardware failures',
          'Internet disruptions',
          'Cybersecurity incidents',
          'Third-party service interruptions',
          'Force majeure events',
          'Technical issues beyond our control',
        ]} />
        <PolicyPara>We shall not be liable for any losses arising from temporary Website downtime.</PolicyPara>
      </PolicySection>

      <PolicySection id="customer-accounts" title="Customer Accounts">
        <PolicyPara>Customers may create an account to access additional features, including:</PolicyPara>
        <PolicyList items={[
          'Order History',
          'Wishlist',
          'Saved Addresses',
          'Faster Checkout',
          'Order Tracking',
          'Account Preferences',
        ]} />
        <PolicyPara>You are responsible for maintaining the confidentiality of your login credentials. You agree to:</PolicyPara>
        <PolicyList items={[
          'Keep your password secure.',
          'Notify us immediately of any unauthorized access.',
          'Not share your account with others.',
          'Log out after using shared devices.',
        ]} />
        <PolicyPara>Creative Muse reserves the right to suspend or terminate accounts involved in fraudulent, abusive, or unauthorized activities.</PolicyPara>
      </PolicySection>

      <PolicySection id="accuracy" title="Accuracy of Information">
        <PolicyPara>You agree that all information provided during registration or checkout is accurate and complete.</PolicyPara>
        <PolicyPara>You are responsible for updating your information whenever changes occur.</PolicyPara>
        <PolicyPara>We shall not be responsible for delivery failures, delays, or other issues arising from incorrect customer information.</PolicyPara>
      </PolicySection>

      <PolicySection id="product-info" title="Product Information">
        <PolicyPara>We make reasonable efforts to ensure that all product descriptions, specifications, dimensions, pricing, and images are accurate.</PolicyPara>
        <PolicyPara>However:</PolicyPara>
        <PolicyList items={[
          'Product colours may vary depending on your device or screen settings.',
          'Handmade or artisan jewellery may have slight variations in colour, texture, or finish.',
          'Product dimensions may have minor manufacturing tolerances.',
          'Packaging may vary from displayed images.',
        ]} />
        <PolicyPara>Such variations shall not be considered defects.</PolicyPara>
      </PolicySection>

      <PolicySection id="pricing" title="Pricing">
        <PolicyPara>All prices displayed on the Website are in Indian Rupees (INR) unless otherwise specified.</PolicyPara>
        <PolicyPara>Prices may change without prior notice.</PolicyPara>
        <PolicyPara>Creative Muse reserves the right to:</PolicyPara>
        <PolicyList items={[
          'Correct pricing errors.',
          'Modify product prices.',
          'Discontinue promotional offers.',
          'Cancel orders affected by pricing mistakes.',
        ]} />
        <PolicyPara>Taxes, shipping charges, and applicable fees will be displayed during checkout.</PolicyPara>
      </PolicySection>

      <PolicySection id="availability" title="Product Availability">
        <PolicyPara>Product availability displayed on the Website is subject to change without notice.</PolicyPara>
        <PolicyPara>Certain products may:</PolicyPara>
        <PolicyList items={[
          'Become temporarily unavailable.',
          'Be discontinued.',
          'Be available in limited quantities.',
          'Sell out before order confirmation.',
        ]} />
        <PolicyPara>We reserve the right to refuse or cancel orders when inventory becomes unavailable.</PolicyPara>
      </PolicySection>

      <PolicySection id="orders" title="Orders">
        <PolicyPara>Submitting an order does not guarantee acceptance.</PolicyPara>
        <PolicyPara>Creative Muse reserves the right to:</PolicyPara>
        <PolicyList items={[
          'Accept or reject any order.',
          'Cancel suspicious orders.',
          'Request additional verification.',
          'Limit product quantities.',
          'Refuse bulk purchases.',
          'Cancel duplicate or fraudulent transactions.',
        ]} />
        <PolicyPara>An order shall be considered accepted only after confirmation by Creative Muse.</PolicyPara>
      </PolicySection>

      <PolicySection id="payments" title="Payments">
        <PolicyPara>Customers agree to pay all applicable charges associated with their orders.</PolicyPara>
        <PolicyPara>Accepted payment methods may include:</PolicyPara>
        <PolicyList items={[
          'UPI',
          'Credit Cards',
          'Debit Cards',
          'Net Banking',
          'Wallets',
          'EMI (where available)',
          'Cash on Delivery (if offered)',
        ]} />
        <PolicyPara>Payments are securely processed through authorized third-party payment gateways.</PolicyPara>
        <PolicyPara>Creative Muse does not store complete card details or sensitive payment credentials.</PolicyPara>
      </PolicySection>

      <PolicySection id="promotions" title="Promotional Offers">
        <PolicyPara>From time to time, Creative Muse may offer:</PolicyPara>
        <PolicyList items={[
          'Discount Coupons',
          'Festival Offers',
          'Promotional Campaigns',
          'Referral Benefits',
          'Gift Cards',
          'Loyalty Rewards',
        ]} />
        <PolicyPara>These offers are subject to their respective terms and may be withdrawn, modified, or cancelled without prior notice.</PolicyPara>
      </PolicySection>

      <PolicySection id="customer-responsibilities" title="Customer Responsibilities">
        <PolicyPara>By using the Website, you agree that you will not:</PolicyPara>
        <PolicyList items={[
          'Use the Website for unlawful purposes.',
          'Attempt unauthorized access.',
          'Upload viruses or malicious software.',
          'Copy Website content without permission.',
          'Interfere with Website functionality.',
          'Misrepresent your identity.',
          'Submit false orders.',
          'Engage in fraudulent payment activities.',
          'Abuse promotional offers.',
          'Violate intellectual property rights.',
          'Harass or threaten our employees or customers.',
          'Reverse engineer or attempt to exploit Website systems.',
        ]} />
        <PolicyPara>Violation of these Terms may result in immediate suspension or permanent termination of your account.</PolicyPara>
      </PolicySection>

      <PolicySection id="intellectual-property" title="Intellectual Property">
        <PolicyPara>All content available on the Website, including but not limited to:</PolicyPara>
        <PolicyList items={[
          'Logos',
          'Product photographs',
          'Product descriptions',
          'Graphics',
          'Videos',
          'Icons',
          'Website design',
          'Layout',
          'Source code',
          'Text',
          'Branding',
          'Trademarks',
        ]} />
        <PolicyPara>is the exclusive property of Creative Muse or its licensors and is protected under applicable intellectual property laws.</PolicyPara>
        <PolicyPara>No content may be copied, reproduced, distributed, modified, republished, or used without prior written permission from Creative Muse.</PolicyPara>
      </PolicySection>

      <PolicySection id="shipping-delivery" title="Shipping and Delivery">
        <PolicyPara>Creative Muse strives to process and dispatch all confirmed orders within the estimated timelines displayed on the Website. However, delivery timelines are estimates only and may vary depending on product availability, location, courier services, weather conditions, public holidays, government restrictions, or other unforeseen circumstances.</PolicyPara>
        <PolicyPara>Customers are responsible for providing accurate shipping details. Creative Muse shall not be responsible for delays, failed deliveries, or additional charges arising from incorrect or incomplete shipping information provided by the customer.</PolicyPara>
        <PolicyPara>Risk of loss and ownership of products shall pass to the customer upon successful delivery to the shipping address provided during checkout.</PolicyPara>
      </PolicySection>

      <PolicySection id="cancellations" title="Order Cancellation">
        <PolicyPara>Customers may request cancellation of an order before it has been dispatched.</PolicyPara>
        <PolicyPara>Once an order has been packed, processed, or shipped, cancellation requests may not be accepted.</PolicyPara>
        <PolicyPara>Creative Muse reserves the right to cancel any order due to:</PolicyPara>
        <PolicyList items={[
          'Product unavailability.',
          'Pricing or technical errors.',
          'Suspected fraudulent activity.',
          'Payment verification failure.',
          'Violation of these Terms.',
          'Government or legal restrictions.',
        ]} />
        <PolicyPara>If an order is cancelled after payment has been successfully received, the eligible refund amount will be processed according to our Refund Policy.</PolicyPara>
      </PolicySection>

      <PolicySection id="returns-refunds" title="Returns, Exchanges and Refunds">
        <PolicyPara>Returns, exchanges, and refunds shall be governed by the separate Return & Refund Policy published on our Website.</PolicyPara>
        <PolicyPara>Eligibility for returns depends on various factors including product condition, return request timeline, and product category. Returned products must generally be:</PolicyPara>
        <PolicyList items={[
          'Unused.',
          'Undamaged.',
          'In original packaging.',
          'Accompanied by proof of purchase.',
        ]} />
        <PolicyPara>Customized, personalized, engraved, made-to-order, clearance, or final sale products may not be eligible for return or exchange unless required by applicable law.</PolicyPara>
        <PolicyPara>Approved refunds will be processed using the original payment method wherever possible.</PolicyPara>
      </PolicySection>

      <PolicySection id="warranty" title="Product Warranty">
        <PolicyPara>Unless expressly stated, Creative Muse does not provide any additional commercial warranty beyond the protections available under applicable consumer laws.</PolicyPara>
        <PolicyPara>Where a manufacturer or product-specific warranty applies, such warranty shall be governed by the terms provided with the product.</PolicyPara>
        <PolicyPara>Normal wear and tear, accidental damage, improper handling, misuse, unauthorized repairs, negligence, or exposure to chemicals or harsh environments are generally not covered.</PolicyPara>
      </PolicySection>

      <PolicySection id="user-content" title="User Reviews and User Generated Content">
        <PolicyPara>Customers may voluntarily submit reviews, ratings, photographs, testimonials, comments, or other content through the Website.</PolicyPara>
        <PolicyPara>By submitting such content, you represent that:</PolicyPara>
        <PolicyList items={[
          'The content is truthful and accurate.',
          'You own or have permission to share the content.',
          'The content does not infringe any third-party rights.',
          'The content does not contain unlawful, defamatory, abusive, obscene, fraudulent, or misleading material.',
        ]} />
        <PolicyPara>By submitting content, you grant Creative Muse a non-exclusive, worldwide, royalty-free, perpetual license to use, reproduce, modify, publish, display, distribute, and promote such content in connection with our business, marketing, and Website operations.</PolicyPara>
        <PolicyPara>Creative Muse reserves the right to remove or refuse any user-generated content at its sole discretion.</PolicyPara>
      </PolicySection>

      <PolicySection id="prohibited" title="Prohibited Activities">
        <PolicyPara>Users shall not:</PolicyPara>
        <PolicyList items={[
          'Violate any applicable law.',
          'Attempt unauthorized access to our systems.',
          'Interfere with Website functionality.',
          'Upload malicious software.',
          'Circumvent Website security.',
          'Harvest customer information.',
          'Use automated bots without authorization.',
          'Submit false reviews.',
          'Engage in fraudulent purchases.',
          'Copy or reproduce Website content.',
          'Misuse promotional offers.',
          'Impersonate another individual or organization.',
          'Engage in activities that negatively affect other users or Creative Muse.',
        ]} />
        <PolicyPara>Violation of these Terms may result in suspension or permanent termination of Website access.</PolicyPara>
      </PolicySection>

      <PolicySection id="ip-rights" title="Intellectual Property Rights">
        <PolicyPara>All intellectual property rights relating to the Website remain the exclusive property of Creative Muse or its respective licensors.</PolicyPara>
        <PolicyPara>This includes, without limitation:</PolicyPara>
        <PolicyList items={[
          'Company name.',
          'Brand identity.',
          'Logos.',
          'Product photography.',
          'Product descriptions.',
          'Website design.',
          'Graphics.',
          'Videos.',
          'Icons.',
          'Source code.',
          'Databases.',
          'Software.',
          'User interface.',
          'Marketing materials.',
          'Documents.',
          'Digital assets.',
        ]} />
        <PolicyPara>No part of the Website may be copied, reproduced, modified, distributed, republished, transmitted, sold, or otherwise exploited without prior written permission from Creative Muse.</PolicyPara>
      </PolicySection>

      <PolicySection id="limitation-liability" title="Limitation of Liability">
        <PolicyPara>To the fullest extent permitted by applicable law, Creative Muse, its directors, employees, affiliates, suppliers, and service providers shall not be liable for any indirect, incidental, consequential, exemplary, punitive, or special damages arising from or related to:</PolicyPara>
        <PolicyList items={[
          'Use or inability to use the Website.',
          'Website interruptions.',
          'Technical failures.',
          'Product delays.',
          'Third-party service failures.',
          'Loss of business.',
          'Loss of profits.',
          'Loss of goodwill.',
          'Data loss.',
          'Unauthorized access.',
          'Cybersecurity incidents beyond our reasonable control.',
        ]} />
        <PolicyPara>Our total liability, if any, shall not exceed the amount actually paid by the customer for the specific product giving rise to the claim, except where otherwise required by applicable law.</PolicyPara>
      </PolicySection>

      <PolicySection id="indemnification" title="Indemnification">
        <PolicyPara>You agree to indemnify, defend, and hold harmless Creative Muse, its directors, employees, affiliates, partners, licensors, service providers, and representatives from and against any claims, liabilities, damages, losses, expenses, legal costs, or demands arising from:</PolicyPara>
        <PolicyList items={[
          'Your use of the Website.',
          'Violation of these Terms.',
          'Violation of applicable laws.',
          'Infringement of third-party rights.',
          'Fraudulent or unlawful conduct.',
          'Submission of false information.',
        ]} />
      </PolicySection>

      <PolicySection id="force-majeure" title="Force Majeure">
        <PolicyPara>Creative Muse shall not be liable for any delay or failure in performance resulting from events beyond our reasonable control, including but not limited to:</PolicyPara>
        <PolicyList items={[
          'Natural disasters.',
          'Floods.',
          'Earthquakes.',
          'Fire.',
          'War.',
          'Terrorism.',
          'Civil unrest.',
          'Government actions.',
          'Pandemics.',
          'Epidemics.',
          'Power failures.',
          'Internet outages.',
          'Transportation disruptions.',
          'Labour disputes.',
          'Cyber attacks.',
          'Supplier failures.',
        ]} />
        <PolicyPara>Performance obligations shall be suspended for the duration of such events.</PolicyPara>
      </PolicySection>

      <PolicySection id="governing-law" title="Governing Law and Jurisdiction">
        <PolicyPara>These Terms and Conditions shall be governed by and construed in accordance with the laws of India.</PolicyPara>
        <PolicyPara>Subject to applicable law, any disputes arising out of or relating to these Terms, the Website, or any transaction with Creative Muse shall be subject to the exclusive jurisdiction of the competent courts located in Vadodara, Gujarat, India.</PolicyPara>
      </PolicySection>

      <PolicySection id="severability" title="Severability">
        <PolicyPara>If any provision of these Terms is determined by a court or competent authority to be unlawful, invalid, or unenforceable, the remaining provisions shall continue in full force and effect.</PolicyPara>
      </PolicySection>

      <PolicySection id="waiver" title="Waiver">
        <PolicyPara>Failure by Creative Muse to enforce any provision of these Terms shall not constitute a waiver of that provision or any other rights available under applicable law.</PolicyPara>
      </PolicySection>

      <PolicySection id="entire-agreement" title="Entire Agreement">
        <PolicyPara>These Terms and Conditions, together with our Privacy Policy, Shipping Policy, Return & Refund Policy, Cookie Policy, and any additional legal notices published on the Website, constitute the entire agreement between you and Creative Muse regarding your use of the Website.</PolicyPara>
      </PolicySection>

      <PolicySection id="changes-to-terms" title="Changes to These Terms">
        <PolicyPara>Creative Muse reserves the right to update, modify, or replace these Terms at any time without prior notice.</PolicyPara>
        <PolicyPara>Updated versions shall become effective immediately upon publication on the Website unless otherwise required by law.</PolicyPara>
        <PolicyPara>Your continued use of the Website following such updates constitutes acceptance of the revised Terms.</PolicyPara>
      </PolicySection>

      <PolicySection id="contact" title="Contact Information">
        <PolicyPara>If you have any questions regarding these Terms and Conditions, please contact us:</PolicyPara>
        <PolicyContact />
        <PolicyPara>
          <strong>Business Hours:</strong> Monday to Saturday, 11:00 AM – 8:00 PM (IST)
        </PolicyPara>
        <PolicyPara>By accessing or using the Creative Muse Website, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions, together with our Privacy Policy and all other policies published on the Website.</PolicyPara>
      </PolicySection>
    </PolicyPage>
  );
}
