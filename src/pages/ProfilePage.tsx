import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfilePage = () => {
  return (
    <PageLayout requireAuth={true}>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">User Profile</h1>
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Profile content will go here */}
            <p>Profile information will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
