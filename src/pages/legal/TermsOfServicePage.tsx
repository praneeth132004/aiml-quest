import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfServicePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                  Welcome to AIML Odyssey. By accessing our website, you agree to these terms of service. Please read them carefully.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>"Service" refers to the AIML Odyssey platform</li>
                  <li>"User" refers to anyone who accesses or uses our Service</li>
                  <li>"Content" refers to all materials available through our Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                <p className="text-gray-700 mb-4">
                  Users must register for an account to access certain features. You are responsible for maintaining the confidentiality of your account information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
                <p className="text-gray-700 mb-4">
                  All content on AIML Odyssey, including but not limited to text, graphics, logos, and course materials, is the property of AIML Odyssey and protected by intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. User Conduct</h2>
                <p className="text-gray-700 mb-4">
                  Users agree not to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Share account credentials with others</li>
                  <li>Upload malicious content or software</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Content Usage</h2>
                <p className="text-gray-700 mb-4">
                  Educational content provided through our platform is for personal learning purposes only. Redistribution or commercial use is prohibited without explicit permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to terminate or suspend access to our Service immediately, without prior notice, for conduct that we believe violates these Terms of Service.
                </p>
              </section>

              <section className="pb-6">
                <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
                <p className="text-gray-700">
                  For any questions about these Terms of Service, please contact us at:
                  <br />
                  Email: odysseyaiml@gmail.com
                  <br />
                  Phone: +91 86884 33423
                </p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfServicePage;