import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const SiteHeader = () => {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  const changeLang = (value: string) => {
    i18n.changeLanguage(value);
    setLang(value);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-16 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">
          <span className="gradient-text">{t("appName")}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>{t("nav.dashboard")}</NavLink>
          <NavLink to="/forum" className={({isActive}) => isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>{t("nav.forum")}</NavLink>
          <NavLink to="/visualizer" className={({isActive}) => isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>{t("nav.visualizer")}</NavLink>
          <NavLink to="/feedback" className={({isActive}) => isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>{t("nav.feedback")}</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <Select value={lang} onValueChange={changeLang}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="EN" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => toast({ title: "Notifications", description: "Connect Supabase to enable push notifications." })}>Notify me</Button>
          <Button onClick={() => toast({ title: "Authentication", description: "Connect Supabase to enable secure sign-in." })}>{t("nav.signIn")}</Button>
        </div>
      </div>
    </header>
  );
};
