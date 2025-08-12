import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      appName: "Thuma Mina Voice",
      nav: { dashboard: "Dashboard", forum: "Forum", visualizer: "Impact", feedback: "Feedback", signIn: "Sign in" },
      hero: {
        title: "Understand and influence laws",
        subtitle: "Ask questions, read plain-language summaries, discuss with others, and see how bills affect you.",
        ctaPrimary: "Explore Bills",
        ctaSecondary: "Join the Discussion",
      },
    },
  },
  es: {
    translation: {
      appName: "Thuma Mina Voice",
      nav: { dashboard: "Panel", forum: "Foro", visualizer: "Impacto", feedback: "Opinión", signIn: "Iniciar sesión" },
      hero: {
        title: "Comprende e influye en las leyes",
        subtitle: "Haz preguntas, lee resúmenes sencillos, debate y ve cómo te afectan los proyectos.",
        ctaPrimary: "Explorar proyectos",
        ctaSecondary: "Unirse al debate",
      },
    },
  },
  fr: {
    translation: {
      appName: "Thuma Mina Voice",
      nav: { dashboard: "Tableau", forum: "Forum", visualizer: "Impact", feedback: "Retour", signIn: "Se connecter" },
      hero: {
        title: "Comprendre et influencer les lois",
        subtitle: "Posez des questions, lisez des résumés clairs, discutez et voyez l'impact sur vous.",
        ctaPrimary: "Explorer les projets",
        ctaSecondary: "Rejoindre le débat",
      },
    },
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
