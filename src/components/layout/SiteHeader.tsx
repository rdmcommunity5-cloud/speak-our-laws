import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";

export const SiteHeader = () => {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const [lang, setLang] = useState(i18n.language);

  const changeLang = (value: string) => {
    i18n.changeLanguage(value);
    setLang(value);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out", description: "You have been successfully signed out." });
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
          <NavLink to="/ledger" className={({isActive}) => isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>Ledger</NavLink>
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
          
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md">
                <User className="h-4 w-4" />
                <span className="text-sm truncate max-w-[100px]">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
