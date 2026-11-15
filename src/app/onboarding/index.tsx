import { router } from "expo-router";
import OnboardingScreen from "@/features/onboarding/onboarding-screen";
import { useIsFirstTime } from "@/lib/hooks/use-is-first-time";

export default function OnBoardingRoute() {
  const [, setIsFirstTime] = useIsFirstTime();

  const finishOnboarding = () => {
    setIsFirstTime(false);
    router.replace("/(app)");
  };

  return (
      <OnboardingScreen
        onNext={finishOnboarding}
      />
  );
}