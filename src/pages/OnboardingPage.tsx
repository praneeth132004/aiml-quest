
import PageLayout from "@/components/layout/PageLayout";
import PreferenceForm from "@/components/onboarding/PreferenceForm";

const OnboardingPage = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Create Your Learning Path</h1>
          <p className="text-gray-600">
            Tell us a bit about yourself so we can create a personalized AI/ML learning roadmap that matches your goals and learning style.
          </p>
        </div>
        <PreferenceForm />
      </div>
    </PageLayout>
  );
};

export default OnboardingPage;
