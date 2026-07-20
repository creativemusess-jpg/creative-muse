import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, PolicySection, PolicyList, PolicyPara, PolicyContact } from "@/components/site/PolicyPage";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping Policy | Creative Muse" },
      { name: "description", content: "Learn about Creative Muse order processing, shipping charges, delivery timelines, tracking and shipping conditions." },
      { property: "og:title", content: "Shipping Policy | Creative Muse" },
      { property: "og:description", content: "Learn about Creative Muse order processing, shipping charges, delivery timelines, tracking and shipping conditions." },
      { property: "og:url", content: "https://creativemusee.com/shipping-policy" },
    ],
  }),
  component: ShippingPolicyPage,
});

function ShippingPolicyPage() {
  return (
    <PolicyPage eyebrow="Legal" title="Shipping Policy" lastUpdated="14/06/2026">
      <PolicySection id="introduction" title="Overview">
        <PolicyPara>
          Welcome to Creative Muse. We are committed to delivering your jewellery safely, securely, and as quickly as possible. This Shipping Policy explains how we process, dispatch, and deliver orders placed through our official website, https://creativemusee.com.
        </PolicyPara>
        <PolicyPara>By placing an order on our Website, you acknowledge that you have read, understood, and agreed to this Shipping Policy.</PolicyPara>
        <PolicyList items={[
          'This Shipping Policy applies to all products purchased through the Creative Muse Website.',
          'Delivery timelines are estimates and may vary depending on your location, product availability, courier services, public holidays, weather conditions, government restrictions, or other circumstances beyond our reasonable control.',
          'Creative Muse reserves the right to modify this Shipping Policy at any time without prior notice.',
        ]} />
      </PolicySection>

      <PolicySection id="order-processing" title="Order Processing">
        <PolicyPara>Once your order is successfully placed and payment is confirmed (where applicable), we begin processing your order.</PolicyPara>
        <PolicyPara>Order processing includes:</PolicyPara>
        <PolicyList items={[
          'Order verification',
          'Payment confirmation',
          'Product quality inspection',
          'Secure packaging',
          'Invoice generation',
          'Courier booking',
          'Dispatch preparation',
        ]} />
        <PolicyPara>Orders are generally processed within 1–3 business days.</PolicyPara>
        <PolicyPara>Orders placed on Sundays or public holidays will be processed on the next working day.</PolicyPara>
        <PolicyPara>Certain products, including customized or made-to-order jewellery, may require additional processing time.</PolicyPara>
      </PolicySection>

      <PolicySection id="shipping-coverage" title="Shipping Coverage">
        <PolicyPara>Creative Muse currently ships across most serviceable locations within India.</PolicyPara>
        <PolicyPara>International shipping may be offered in the future and will be subject to separate terms, shipping charges, customs duties, taxes, and import regulations.</PolicyPara>
        <PolicyPara>Delivery availability depends on the serviceability of the destination pin code.</PolicyPara>
      </PolicySection>

      <PolicySection id="delivery-time" title="Estimated Delivery Time">
        <PolicyPara>Estimated delivery timelines are:</PolicyPara>
        <PolicyList items={[
          'Metro Cities: 2–5 Business Days',
          'Tier-2 & Tier-3 Cities: 3–7 Business Days',
          'Remote Areas: 5–10 Business Days',
        ]} />
        <PolicyPara>These timelines are estimates only and should not be considered guaranteed delivery commitments.</PolicyPara>
        <PolicyPara>Unexpected delays may occur due to:</PolicyPara>
        <PolicyList items={[
          'Weather conditions',
          'Public holidays',
          'Courier delays',
          'Government restrictions',
          'Natural disasters',
          'High order volumes',
          'Operational issues',
        ]} />
      </PolicySection>

      <PolicySection id="shipping-charges" title="Shipping Charges">
        <PolicyPara>Shipping charges, if applicable, will be displayed during checkout before payment.</PolicyPara>
        <PolicyPara>Creative Muse may offer:</PolicyPara>
        <PolicyList items={[
          'Free Shipping on eligible orders.',
          'Promotional Free Shipping offers.',
          'Express Shipping (where available).',
          'Standard Shipping.',
          'Special shipping charges for remote locations.',
        ]} />
        <PolicyPara>Shipping charges are subject to change without prior notice.</PolicyPara>
      </PolicySection>

      <PolicySection id="order-tracking" title="Order Tracking">
        <PolicyPara>Once your order has been dispatched, you will receive:</PolicyPara>
        <PolicyList items={[
          'Order confirmation',
          'Shipping confirmation',
          'Courier partner details',
          'Tracking number',
          'Estimated delivery date',
        ]} />
        <PolicyPara>Customers can also track their orders by logging into their Creative Muse account.</PolicyPara>
        <PolicyPara>Tracking information may take up to 24 hours to become active after dispatch.</PolicyPara>
      </PolicySection>

      <PolicySection id="packaging" title="Packaging">
        <PolicyPara>Every product is carefully packed to ensure maximum protection during transit.</PolicyPara>
        <PolicyPara>Packaging may include:</PolicyPara>
        <PolicyList items={[
          'Premium jewellery box',
          'Protective wrapping',
          'Tamper-evident packaging',
          'Secure outer shipping box',
          'Invoice',
          'Product certificates (where applicable)',
          'Care instructions (if applicable)',
        ]} />
        <PolicyPara>Creative Muse reserves the right to update packaging without prior notice.</PolicyPara>
      </PolicySection>

      <PolicySection id="delivery-attempts" title="Delivery Attempts">
        <PolicyPara>Our courier partners generally make multiple delivery attempts before returning the shipment.</PolicyPara>
        <PolicyPara>If delivery cannot be completed due to:</PolicyPara>
        <PolicyList items={[
          'Incorrect address',
          'Customer unavailable',
          'Incorrect phone number',
          'Refusal to accept delivery',
        ]} />
        <PolicyPara>the shipment may be returned to Creative Muse. Additional shipping charges may apply for re-dispatch.</PolicyPara>
      </PolicySection>

      <PolicySection id="address-accuracy" title="Address Accuracy">
        <PolicyPara>Customers are responsible for providing complete and accurate shipping information.</PolicyPara>
        <PolicyPara>Please ensure that your order includes:</PolicyPara>
        <PolicyList items={[
          'Full Name',
          'Complete Address',
          'Landmark (if applicable)',
          'City',
          'State',
          'Postal Code',
          'Mobile Number',
        ]} />
        <PolicyPara>Creative Muse shall not be responsible for delivery delays or failed deliveries caused by incorrect information provided by the customer.</PolicyPara>
      </PolicySection>

      <PolicySection id="delivery-confirmation" title="Delivery Confirmation">
        <PolicyPara>Once the courier partner marks the shipment as successfully delivered, the order shall be considered completed.</PolicyPara>
        <PolicyPara>Customers are advised to inspect the package immediately upon delivery.</PolicyPara>
        <PolicyPara>If the package appears damaged, tampered with, or opened, customers should:</PolicyPara>
        <PolicyList items={[
          'Take photographs.',
          'Record an unboxing video.',
          'Contact Creative Muse within 48 hours of delivery.',
        ]} />
        <PolicyPara>Failure to report delivery issues within the specified timeframe may affect eligibility for claims.</PolicyPara>
      </PolicySection>

      <PolicySection id="delayed-deliveries" title="Delayed Deliveries">
        <PolicyPara>While Creative Muse strives to deliver all orders within the estimated delivery timelines, delays may occasionally occur due to circumstances beyond our control.</PolicyPara>
        <PolicyPara>Delivery delays may result from, but are not limited to:</PolicyPara>
        <PolicyList items={[
          'Adverse weather conditions.',
          'Public holidays.',
          'Natural disasters.',
          'Government restrictions.',
          'Transportation disruptions.',
          'Courier operational delays.',
          'Customs inspections (where applicable).',
          'High seasonal demand.',
          'Technical or logistical issues.',
        ]} />
        <PolicyPara>Estimated delivery dates are provided for convenience only and should not be considered guaranteed delivery commitments.</PolicyPara>
        <PolicyPara>Creative Muse shall not be held liable for delays caused by third-party courier services or events beyond our reasonable control.</PolicyPara>
      </PolicySection>

      <PolicySection id="lost-shipments" title="Lost, Missing or Stolen Shipments">
        <PolicyPara>If your shipment appears to be lost during transit, please contact us as soon as possible.</PolicyPara>
        <PolicyPara>Creative Muse will coordinate with the courier partner to investigate the shipment status.</PolicyPara>
        <PolicyPara>If the shipment is officially declared lost by the courier partner, we may, at our discretion:</PolicyPara>
        <PolicyList items={[
          'Ship a replacement product (subject to availability), or',
          'Issue a refund in accordance with our Refund & Return Policy.',
        ]} />
        <PolicyPara>Creative Muse is not responsible for:</PolicyPara>
        <PolicyList items={[
          'Packages marked as successfully delivered by the courier but subsequently reported as missing.',
          'Theft occurring after successful delivery.',
          'Delivery to an incorrect address provided by the customer.',
        ]} />
      </PolicySection>

      <PolicySection id="international-shipping" title="International Shipping">
        <PolicyPara>International shipping may be available for selected countries and regions.</PolicyPara>
        <PolicyPara>Customers placing international orders acknowledge that:</PolicyPara>
        <PolicyList items={[
          'Import duties, customs fees, taxes, VAT, GST, brokerage charges, or other government-imposed fees may apply.',
          'These charges are the sole responsibility of the customer unless expressly stated otherwise.',
          'Delivery timelines for international shipments are estimates and may vary due to customs clearance and local regulations.',
        ]} />
        <PolicyPara>Creative Muse is not responsible for delays caused by customs authorities or local government agencies.</PolicyPara>
      </PolicySection>

      <PolicySection id="customs-duties" title="Customs Duties and Taxes">
        <PolicyPara>For international orders:</PolicyPara>
        <PolicyList items={[
          'Import duties.',
          'Customs clearance fees.',
          'Local taxes.',
          'VAT or GST.',
          'Brokerage fees.',
          'Government levies.',
        ]} />
        <PolicyPara>are generally not included in the product price or shipping charges unless specifically stated.</PolicyPara>
        <PolicyPara>Customers are responsible for paying all applicable customs charges before delivery.</PolicyPara>
        <PolicyPara>Failure to pay applicable duties may result in the shipment being delayed, returned, abandoned, or destroyed by customs authorities, and Creative Muse shall not be liable for any resulting loss.</PolicyPara>
      </PolicySection>

      <PolicySection id="risk-of-loss" title="Risk of Loss and Ownership">
        <PolicyPara>Ownership of the purchased products transfers to the customer once the order has been successfully delivered to the shipping address provided during checkout.</PolicyPara>
        <PolicyPara>Risk of loss or damage also transfers upon successful delivery.</PolicyPara>
        <PolicyPara>Customers are advised to inspect their shipment immediately after receipt.</PolicyPara>
      </PolicySection>

      <PolicySection id="customer-responsibilities" title="Customer Responsibilities">
        <PolicyPara>Customers are responsible for:</PolicyPara>
        <PolicyList items={[
          'Providing accurate shipping information.',
          'Ensuring someone is available to receive the delivery.',
          'Tracking shipment progress.',
          'Reporting delivery issues promptly.',
          'Inspecting products immediately after delivery.',
          'Maintaining updated contact information.',
          'Cooperating with courier partners during delivery attempts.',
        ]} />
        <PolicyPara>Failure to comply with these responsibilities may result in delivery delays or additional shipping charges.</PolicyPara>
      </PolicySection>

      <PolicySection id="shipping-restrictions" title="Shipping Restrictions">
        <PolicyPara>Creative Muse reserves the right to refuse or cancel shipments to:</PolicyPara>
        <PolicyList items={[
          'Locations restricted by law.',
          'Areas not serviced by courier partners.',
          'High-risk delivery locations.',
          'Regions affected by natural disasters, political unrest, or emergencies.',
          'Addresses that cannot be verified.',
        ]} />
        <PolicyPara>We also reserve the right to limit shipping quantities or decline orders that appear fraudulent or violate our Terms & Conditions.</PolicyPara>
      </PolicySection>

      <PolicySection id="force-majeure" title="Force Majeure">
        <PolicyPara>Creative Muse shall not be liable for delays, interruptions, or failure to perform shipping obligations due to events beyond our reasonable control, including but not limited to:</PolicyPara>
        <PolicyList items={[
          'Natural disasters.',
          'Floods.',
          'Earthquakes.',
          'Fires.',
          'Storms.',
          'War.',
          'Terrorism.',
          'Civil unrest.',
          'Government actions.',
          'Pandemics.',
          'Epidemics.',
          'Labour strikes.',
          'Transportation disruptions.',
          'Internet outages.',
          'Power failures.',
          'Cybersecurity incidents.',
          'Courier service interruptions.',
        ]} />
        <PolicyPara>Performance obligations shall be suspended for the duration of such events.</PolicyPara>
      </PolicySection>

      <PolicySection id="limitation-liability" title="Limitation of Liability">
        <PolicyPara>To the fullest extent permitted by applicable law, Creative Muse shall not be liable for:</PolicyPara>
        <PolicyList items={[
          'Delivery delays caused by third-party courier services.',
          'Indirect, incidental, or consequential damages arising from shipping delays.',
          'Lost profits, business interruption, or loss of goodwill.',
          'Incorrect delivery addresses provided by customers.',
          'Delays caused by customs or government authorities.',
          'Failed deliveries due to customer unavailability.',
          'Losses resulting from circumstances beyond our reasonable control.',
        ]} />
        <PolicyPara>Our total liability relating to shipping shall not exceed the purchase price of the affected product, except where otherwise required by applicable law.</PolicyPara>
      </PolicySection>

      <PolicySection id="policy-updates" title="Policy Updates">
        <PolicyPara>Creative Muse reserves the right to amend, modify, or update this Shipping Policy at any time without prior notice.</PolicyPara>
        <PolicyPara>Any changes will become effective immediately upon publication on our Website.</PolicyPara>
        <PolicyPara>Customers are encouraged to review this Shipping Policy periodically to stay informed of any updates.</PolicyPara>
      </PolicySection>

      <PolicySection id="contact" title="Contact Us">
        <PolicyPara>If you have any questions regarding shipping, delivery, order tracking, or this Shipping Policy, please contact us:</PolicyPara>
        <PolicyContact />
        <PolicyPara><strong>Business Hours:</strong> Monday to Saturday: 11:00 AM – 8:00 PM (IST), Sunday: Closed</PolicyPara>
        <PolicyPara>We aim to respond to shipping and delivery-related inquiries within 2–5 business days.</PolicyPara>
      </PolicySection>

      <PolicySection id="acknowledgement" title="Final Acknowledgement">
        <PolicyPara>By placing an order through the Creative Muse Website, you acknowledge that you have read, understood, and agreed to this Shipping Policy.</PolicyPara>
        <PolicyPara>This Shipping Policy should be read together with our Terms & Conditions, Privacy Policy, Refund & Return Policy, and any other policies published on the Website.</PolicyPara>
      </PolicySection>
    </PolicyPage>
  );
}
