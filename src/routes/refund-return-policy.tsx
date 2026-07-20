import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, PolicySection, PolicyList, PolicyPara, PolicyContact } from "@/components/site/PolicyPage";

export const Route = createFileRoute("/refund-return-policy")({
  head: () => ({
    meta: [
      { title: "Refund & Return Policy | Creative Muse" },
      { name: "description", content: "Review Creative Muse return eligibility, exchanges, refunds, cancellations and store-credit conditions." },
      { property: "og:title", content: "Refund & Return Policy | Creative Muse" },
      { property: "og:description", content: "Review Creative Muse return eligibility, exchanges, refunds, cancellations and store-credit conditions." },
      { property: "og:url", content: "https://creativemusee.com/refund-return-policy" },
    ],
  }),
  component: RefundReturnPage,
});

function RefundReturnPage() {
  return (
    <PolicyPage eyebrow="Legal" title="Refund & Return Policy" lastUpdated="14/06/2026">
      <PolicySection id="introduction" title="Overview">
        <PolicyPara>
          Welcome to Creative Muse. We strive to provide our customers with premium-quality jewellery and an exceptional shopping experience. Please read this Refund & Return Policy carefully before making a purchase from our website.
        </PolicyPara>
        <PolicyPara>
          By placing an order on https://creativemusee.com, you acknowledge and agree to the terms outlined in this policy.
        </PolicyPara>
        <PolicyList items={[
          'Our Refund & Return Policy explains the conditions under which products may be returned, exchanged, or refunded.',
          'This policy applies to all purchases made through our official website unless otherwise stated.',
          'Creative Muse reserves the right to modify this policy at any time without prior notice. Any updates will become effective immediately upon publication on the Website.',
        ]} />
      </PolicySection>

      <PolicySection id="return-eligibility" title="Return Eligibility">
        <PolicyPara>You may request a return only if all of the following conditions are met:</PolicyPara>
        <PolicyList items={[
          'The return request is submitted within 7 days from the date of delivery.',
          'The product is unused and unworn.',
          'The product is in its original condition.',
          'All original tags, labels, certificates, and packaging are intact.',
          'The original invoice or proof of purchase is provided.',
          'The product has not been altered, resized, repaired, or modified.',
          'The product is free from scratches, damage, stains, perfumes, or signs of use.',
        ]} />
        <PolicyPara>Creative Muse reserves the right to inspect returned products before approving any return.</PolicyPara>
      </PolicySection>

      <PolicySection id="non-returnable" title="Products Not Eligible for Return">
        <PolicyPara>For hygiene, customization, and business reasons, the following items are generally non-returnable and non-refundable:</PolicyPara>
        <PolicyList items={[
          'Customized jewellery.',
          'Personalized jewellery.',
          'Engraved products.',
          'Made-to-order products.',
          'Special order items.',
          'Gift cards.',
          'Digital products.',
          'Clearance sale items.',
          'Final sale products.',
          'Products marked as "Non-Returnable."',
          'Earrings (for hygiene reasons, unless defective).',
          'Products damaged due to customer misuse.',
          'Products returned without original packaging.',
        ]} />
        <PolicyPara>Any exceptions will be mentioned on the specific product page.</PolicyPara>
      </PolicySection>

      <PolicySection id="exchange-policy" title="Exchange Policy">
        <PolicyPara>If eligible, customers may request an exchange instead of a refund.</PolicyPara>
        <PolicyPara>Exchanges may be approved for:</PolicyPara>
        <PolicyList items={[
          'Wrong size (where applicable).',
          'Manufacturing defects.',
          'Wrong product received.',
          'Damaged product received.',
          'Incorrect item shipped.',
        ]} />
        <PolicyPara>Exchange requests must be submitted within 7 days of delivery.</PolicyPara>
        <PolicyPara>Replacement products are subject to stock availability.</PolicyPara>
        <PolicyPara>If the requested replacement is unavailable, Creative Muse may offer store credit, an alternative product, or a refund at its sole discretion.</PolicyPara>
      </PolicySection>

      <PolicySection id="damaged-incorrect" title="Damaged or Incorrect Products">
        <PolicyPara>If you receive:</PolicyPara>
        <PolicyList items={[
          'A damaged product.',
          'A defective product.',
          'An incorrect product.',
          'A product with missing parts.',
        ]} />
        <PolicyPara>Please contact us within 48 hours of delivery.</PolicyPara>
        <PolicyPara>To help us process your request quickly, please provide:</PolicyPara>
        <PolicyList items={[
          'Order Number.',
          'Invoice.',
          'Clear photographs of the product.',
          'Photographs of the packaging.',
          'A brief description of the issue.',
          'An unboxing video (if available).',
        ]} />
        <PolicyPara>Failure to report damaged or incorrect items within the specified timeframe may affect your eligibility for a replacement or refund.</PolicyPara>
      </PolicySection>

      <PolicySection id="return-process" title="Return Process">
        <PolicyPara>To initiate a return, please contact our Customer Support team using the details provided on our Website.</PolicyPara>
        <PolicyPara>Your request should include:</PolicyPara>
        <PolicyList items={[
          'Full Name.',
          'Order Number.',
          'Contact Number.',
          'Email Address.',
          'Reason for Return.',
          'Supporting Images (if applicable).',
        ]} />
        <PolicyPara>Once your request is reviewed and approved, we will provide instructions for returning the product.</PolicyPara>
        <PolicyPara>Products returned without prior approval may not be accepted.</PolicyPara>
      </PolicySection>

      <PolicySection id="return-shipping" title="Return Shipping">
        <PolicyPara>Unless the return is due to:</PolicyPara>
        <PolicyList items={[
          'Our error,',
          'A defective product,',
          'A damaged shipment, or',
          'An incorrect item,',
        ]} />
        <PolicyPara>the customer may be responsible for return shipping costs.</PolicyPara>
        <PolicyPara>Creative Muse recommends using a reliable courier service with tracking and insurance for all return shipments.</PolicyPara>
        <PolicyPara>We are not responsible for products lost or damaged during return transit.</PolicyPara>
      </PolicySection>

      <PolicySection id="inspection" title="Product Inspection">
        <PolicyPara>After receiving the returned product, our Quality Assurance team will inspect it to verify:</PolicyPara>
        <PolicyList items={[
          'Product condition.',
          'Original packaging.',
          'Authenticity.',
          'Signs of wear or use.',
          'Missing accessories.',
          'Compliance with this policy.',
        ]} />
        <PolicyPara>The inspection process generally takes 3–7 business days after receipt of the returned item.</PolicyPara>
        <PolicyPara>Approval of a return is subject to the outcome of this inspection.</PolicyPara>
      </PolicySection>

      <PolicySection id="cancellation" title="Cancellation Policy">
        <PolicyPara>Customers may request cancellation before the order is packed or shipped.</PolicyPara>
        <PolicyPara>Once an order has been dispatched, it generally cannot be cancelled.</PolicyPara>
        <PolicyPara>Creative Muse reserves the right to cancel any order due to:</PolicyPara>
        <PolicyList items={[
          'Product unavailability.',
          'Pricing errors.',
          'Technical issues.',
          'Payment verification failure.',
          'Fraud prevention measures.',
          'Violation of our Terms & Conditions.',
        ]} />
        <PolicyPara>If a prepaid order is cancelled by Creative Muse, any eligible refund will be processed in accordance with this policy.</PolicyPara>
      </PolicySection>

      <PolicySection id="store-credit" title="Store Credit">
        <PolicyPara>In certain situations, Creative Muse may offer store credit instead of a monetary refund.</PolicyPara>
        <PolicyPara>Store credit:</PolicyPara>
        <PolicyList items={[
          'May have an expiry period (if applicable).',
          'Cannot be exchanged for cash unless required by law.',
          'May only be used for purchases on our Website.',
          'May be subject to additional terms communicated at the time of issue.',
        ]} />
      </PolicySection>

      <PolicySection id="refund-process" title="Refund Process">
        <PolicyPara>Once your returned product has been received and successfully inspected by our Quality Assurance team, we will notify you regarding the approval or rejection of your refund request.</PolicyPara>
        <PolicyPara>If your refund is approved:</PolicyPara>
        <PolicyList items={[
          'The refund will be initiated using the original payment method wherever possible.',
          'You will receive confirmation via email or SMS (where applicable).',
          'Refund processing timelines may vary depending on your payment provider or financial institution.',
        ]} />
        <PolicyPara>If your return request is rejected, we will inform you of the reason. The product may be returned to you, and shipping charges, if applicable, may be your responsibility.</PolicyPara>
      </PolicySection>

      <PolicySection id="refund-timelines" title="Refund Timelines">
        <PolicyPara>Estimated refund processing times are as follows:</PolicyPara>
        <PolicyList items={[
          'UPI Payments: 3–7 Business Days',
          'Credit Card Payments: 5–10 Business Days',
          'Debit Card Payments: 5–10 Business Days',
          'Net Banking: 5–10 Business Days',
          'Wallet Payments: 3–7 Business Days',
          'Cash on Delivery (if applicable): Refund may be processed via bank transfer, UPI, or store credit after verification.',
        ]} />
        <PolicyPara>Please note that actual processing times depend on your bank, payment gateway, and financial institution.</PolicyPara>
      </PolicySection>

      <PolicySection id="non-refundable-charges" title="Non-Refundable Charges">
        <PolicyPara>Unless required by applicable law, the following charges are generally non-refundable:</PolicyPara>
        <PolicyList items={[
          'Shipping charges.',
          'Express delivery charges.',
          'Gift wrapping charges.',
          'Insurance fees.',
          'Cash on Delivery charges.',
          'Packaging fees.',
          'Convenience fees.',
          'Taxes or government charges already remitted where legally non-refundable.',
        ]} />
      </PolicySection>

      <PolicySection id="failed-deliveries" title="Failed Deliveries">
        <PolicyPara>Orders may be returned to Creative Muse if:</PolicyPara>
        <PolicyList items={[
          'The customer provides an incorrect address.',
          'Delivery attempts are unsuccessful.',
          'The customer refuses delivery without a valid reason.',
          'The package remains unclaimed.',
        ]} />
        <PolicyPara>In such cases:</PolicyPara>
        <PolicyList items={[
          'Re-shipping charges may apply.',
          'Original shipping charges may not be refunded.',
          'Refunds, if approved, may be processed after deducting applicable shipping, handling, and processing charges.',
        ]} />
      </PolicySection>

      <PolicySection id="customer-responsibilities" title="Customer Responsibilities">
        <PolicyPara>Customers are responsible for:</PolicyPara>
        <PolicyList items={[
          'Providing accurate billing and shipping information.',
          'Inspecting the product immediately upon delivery.',
          'Reporting damaged, defective, or incorrect products within the specified time.',
          'Returning approved products in their original condition.',
          'Ensuring secure packaging for return shipments.',
          'Following all return instructions provided by Creative Muse.',
        ]} />
        <PolicyPara>Failure to comply with these responsibilities may result in the rejection of your return or refund request.</PolicyPara>
      </PolicySection>

      <PolicySection id="fraud-prevention" title="Fraud Prevention">
        <PolicyPara>To protect both our customers and our business, Creative Muse reserves the right to:</PolicyPara>
        <PolicyList items={[
          'Verify customer identity.',
          'Request additional documentation.',
          'Investigate suspicious transactions.',
          'Reject fraudulent return or refund requests.',
          'Suspend or permanently terminate customer accounts involved in fraudulent activities.',
        ]} />
        <PolicyPara>Any misuse of our return policy may result in legal action where appropriate.</PolicyPara>
      </PolicySection>

      <PolicySection id="quality-inspection" title="Quality Inspection">
        <PolicyPara>Every returned product undergoes a quality inspection before a refund or replacement is approved.</PolicyPara>
        <PolicyPara>Our inspection may include verification of:</PolicyPara>
        <PolicyList items={[
          'Product authenticity.',
          'Physical condition.',
          'Original tags and packaging.',
          'Certificates and accessories.',
          'Signs of wear or alteration.',
          'Manufacturing defects.',
        ]} />
        <PolicyPara>Creative Muse reserves the sole discretion to determine whether a returned product satisfies the conditions of this policy.</PolicyPara>
      </PolicySection>

      <PolicySection id="limitation-liability" title="Limitation of Liability">
        <PolicyPara>To the fullest extent permitted by applicable law, Creative Muse shall not be liable for:</PolicyPara>
        <PolicyList items={[
          'Delays caused by courier partners.',
          'Lost return shipments not arranged by us.',
          'Customer packaging errors during return.',
          'Incorrect delivery information provided by the customer.',
          'Delays caused by banks or payment gateways.',
          'Events beyond our reasonable control.',
        ]} />
        <PolicyPara>Our total liability shall not exceed the amount actually paid by the customer for the product in question, except where otherwise required by law.</PolicyPara>
      </PolicySection>

      <PolicySection id="force-majeure" title="Force Majeure">
        <PolicyPara>Creative Muse shall not be responsible for delays or failures in processing returns, exchanges, or refunds resulting from circumstances beyond our reasonable control, including but not limited to:</PolicyPara>
        <PolicyList items={[
          'Natural disasters.',
          'Floods.',
          'Earthquakes.',
          'Fire.',
          'War.',
          'Civil unrest.',
          'Government restrictions.',
          'Pandemics.',
          'Transportation disruptions.',
          'Labour strikes.',
          'Internet failures.',
          'Power outages.',
          'Cybersecurity incidents.',
          'Courier service interruptions.',
        ]} />
        <PolicyPara>Any affected obligations shall be suspended for the duration of such events.</PolicyPara>
      </PolicySection>

      <PolicySection id="governing-law" title="Governing Law">
        <PolicyPara>This Refund & Return Policy shall be governed by and interpreted in accordance with the laws of India.</PolicyPara>
        <PolicyPara>Any dispute arising from or relating to this policy shall be subject to the exclusive jurisdiction of the competent courts located in Vadodara, Gujarat, India, unless otherwise required by applicable law.</PolicyPara>
      </PolicySection>

      <PolicySection id="policy-updates" title="Policy Updates">
        <PolicyPara>Creative Muse reserves the right to modify, update, or replace this Refund & Return Policy at any time without prior notice.</PolicyPara>
        <PolicyPara>The latest version of this policy will always be available on our Website.</PolicyPara>
        <PolicyPara>Your continued use of our Website after any updates constitutes your acceptance of the revised policy.</PolicyPara>
      </PolicySection>

      <PolicySection id="contact" title="Contact Us">
        <PolicyPara>If you have any questions regarding returns, exchanges, refunds, or this Refund & Return Policy, please contact us:</PolicyPara>
        <PolicyContact />
        <PolicyPara><strong>Business Hours:</strong> Monday to Saturday: 11:00 AM – 8:00 PM (IST), Sunday: Closed</PolicyPara>
        <PolicyPara>We aim to respond to all genuine return and refund inquiries within 2–5 business days.</PolicyPara>
      </PolicySection>

      <PolicySection id="acknowledgement" title="Final Acknowledgement">
        <PolicyPara>By placing an order through the Creative Muse Website, you acknowledge that you have read, understood, and agreed to this Refund & Return Policy.</PolicyPara>
        <PolicyPara>This policy should be read together with our Terms & Conditions, Privacy Policy, Shipping Policy, and any other applicable policies published on our Website.</PolicyPara>
      </PolicySection>
    </PolicyPage>
  );
}
