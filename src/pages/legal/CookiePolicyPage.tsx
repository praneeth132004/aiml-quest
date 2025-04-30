import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CookiePolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Cookie Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Remembering your preferences</li>
                  <li>Keeping you signed in</li>
                  <li>Understanding how you use our website</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Types of Cookies We Use</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Essential Cookies</h3>
                    <p className="text-gray-700">Required for the website to function properly. Cannot be disabled.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Functional Cookies</h3>
                    <p className="text-gray-700">Remember your preferences and settings.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Analytics Cookies</h3>
                    <p className="text-gray-700">Help us understand how visitors use our website.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Managing Cookies</h2>
                <p className="text-gray-700 mb-4">
                  You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Some of our pages may contain content from other sites, like YouTube or Vimeo, which may set their own cookies. We do not control the setting of these cookies.
                </p>
              </section>

              <section className="pb-6">
                <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
                <p className="text-gray-700">
                  If you have any questions about our Cookie Policy, please contact us at:
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

export default CookiePolicyPage;