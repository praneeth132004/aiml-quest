
import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  return (
    <PageLayout>
      <HeroSection />
      <FeatureSection />
      <TestimonialSection />
      <CallToAction />
    </PageLayout>
  );
};

export default Index;
