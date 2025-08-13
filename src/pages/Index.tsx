import hero from "@/assets/voice-of-the-people-hero.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-hero">
      <section className="container py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            {t("hero.title")} – {t("appName")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4">
            {user ? (
              <>
                <Link to="/dashboard"><Button variant="hero" size="lg">{t("hero.ctaPrimary")}</Button></Link>
                <Link to="/forum"><Button variant="secondary" size="lg">{t("hero.ctaSecondary")}</Button></Link>
              </>
            ) : (
              <>
                <Link to="/auth"><Button variant="hero" size="lg">Get Started</Button></Link>
                <Link to="/forum"><Button variant="secondary" size="lg">Explore Forum</Button></Link>
              </>
            )}
          </div>
        </div>
        <div className="relative">
          <img src={hero} alt="Thuma Mina Voice hero illustration showing AI avatar helping citizens understand laws" className="w-full h-auto rounded-lg shadow-xl" loading="lazy" />
        </div>
      </section>
    </main>
  );
};

export default Index;
