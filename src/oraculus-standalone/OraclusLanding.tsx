import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Shield,
  Brain,
  Eye,
  ArrowRight,
  Loader2,
  Globe,
  CheckCircle,
  Mail,
  Phone,
  Sparkles,
  FileText,
  Upload,
  BarChart3,
  Zap,
  Check,
} from "lucide-react";
import { landingTranslations } from "./oraculus-translations";

/* Dark emerald theme scoped to this landing page */
const oraclusThemeVars: React.CSSProperties & Record<string, string> = {
  "--background": "220 15% 5%",
  "--foreground": "160 10% 92%",
  "--card": "220 15% 8%",
  "--card-foreground": "160 10% 92%",
  "--popover": "220 15% 8%",
  "--popover-foreground": "160 10% 92%",
  "--primary": "160 60% 45%",
  "--primary-foreground": "220 15% 5%",
  "--primary-dark": "160 60% 38%",
  "--primary-light": "160 50% 55%",
  "--secondary": "220 15% 12%",
  "--secondary-foreground": "160 10% 92%",
  "--muted": "220 10% 15%",
  "--muted-foreground": "160 10% 60%",
  "--accent": "160 40% 20%",
  "--accent-foreground": "160 10% 92%",
  "--border": "220 10% 18%",
  "--input": "220 10% 18%",
  "--ring": "160 60% 45%",
  "--shadow-glow": "0 4px 30px hsl(160 60% 45% / 0.15)",
  "--shadow-card":
    "0 4px 6px -1px hsl(0 0% 0% / 0.3), 0 2px 4px -1px hsl(0 0% 0% / 0.2)",
};

const OraclusLanding = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { isAuthenticated, isLoading, signInWithMagicLink } = useAuth();

  const t = landingTranslations[language];

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );

  const featuresRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/oraculus-app/analyze");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Intersection Observer for scroll-reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section-id");
            if (id) setVisibleSections((prev) => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const refs = [featuresRef.current, howRef.current, ctaRef.current];
    refs.forEach((el) => el && observer.observe(el));
    return () => refs.forEach((el) => el && observer.unobserve(el));
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) =>
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setError(
        language === "es" ? "Introduce un email válido" : "Enter a valid email"
      );
      return;
    }
    if (!acceptedTerms) {
      setError(
        language === "es"
          ? "Debes aceptar la Política de Privacidad"
          : "You must accept the Privacy Policy"
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const metadata: { phone?: string } = {};
    if (phone.trim()) metadata.phone = phone.trim();

    const { error: authError } = await signInWithMagicLink(email, metadata);
    setIsSubmitting(false);

    if (authError) setError(authError.message);
    else setIsSent(true);
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "hsl(220 15% 5%)" }}
      >
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const SectionCTA = () => (
    <div className="text-center mt-10 md:mt-14">
      <Button
        onClick={() => scrollTo(ctaRef)}
        className="bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_-5px_hsl(160_60%_45%/0.4)] h-11 px-8 text-base font-medium"
      >
        {t.hero.cta}
        <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-background text-foreground relative font-sans selection:bg-primary/20"
      style={oraclusThemeVars}
    >
      {/* Ambient gradients */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_hsl(160_60%_45%/0.12),_transparent)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,_hsl(220_60%_50%/0.06),_transparent)] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/15 rounded-lg border border-primary/20">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight text-white">
              Oraculus
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => scrollTo(featuresRef)}
              className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden md:block"
            >
              {t.nav.features}
            </button>
            <button
              onClick={() => scrollTo(howRef)}
              className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden md:block"
            >
              {t.nav.howItWorks}
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-1 text-muted-foreground hover:text-white hover:bg-white/5 px-2"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs">{language === "es" ? "EN" : "ES"}</span>
            </Button>
            <Button
              onClick={() => scrollTo(ctaRef)}
              className="bg-primary text-primary-foreground hover:brightness-110 transition-all shadow-lg shadow-primary/20 text-sm px-4 h-9"
            >
              {t.nav.tryFree}
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative pt-32 md:pt-48 pb-20 md:pb-36 px-4 overflow-hidden">
        <div className="container mx-auto max-w-5xl text-center space-y-6 md:space-y-8 z-10 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide border border-primary/20 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-3.5 h-3.5" />
            {t.hero.badge}
          </div>

          <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white leading-[0.95] animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-100">
            {t.hero.title}
          </h1>

          <p className="text-xl md:text-3xl text-primary/80 font-light max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-200">
            {t.hero.subtitle}
          </p>

          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-300 px-4">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-6 md:pt-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-[400ms]">
            <Button
              size="lg"
              onClick={() => scrollTo(ctaRef)}
              className="h-13 md:h-14 px-8 md:px-10 text-base md:text-lg bg-primary text-primary-foreground hover:brightness-110 transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40 w-full sm:w-auto"
            >
              {t.hero.cta}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollTo(featuresRef)}
              className="h-13 md:h-14 px-8 md:px-10 text-base md:text-lg border-white/10 hover:bg-white/5 text-white/80 w-full sm:w-auto"
            >
              {t.hero.ctaSecondary}
            </Button>
          </div>
        </div>

        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* ─── Problem / Stats ─── */}
      <section className="py-16 md:py-28 px-4 relative border-y border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              {t.problem.title}
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.problem.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                stat: t.problem.stat1,
                label: t.problem.stat1Label,
                icon: <BarChart3 className="w-6 h-6" />,
              },
              {
                stat: t.problem.stat2,
                label: t.problem.stat2Label,
                icon: <Eye className="w-6 h-6" />,
              },
              {
                stat: t.problem.stat3,
                label: t.problem.stat3Label,
                icon: <Zap className="w-6 h-6" />,
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="p-6 md:p-8 bg-white/[0.03] border-white/5 hover:border-primary/20 transition-all duration-500 text-center group"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                  {item.icon}
                </div>
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2 tracking-tighter">
                  {item.stat}
                </p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section
        ref={featuresRef}
        data-section-id="features"
        className="py-16 md:py-32 px-4"
      >
        <div
          className={`container mx-auto max-w-6xl transition-all duration-1000 ${
            visibleSections.has("features")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-12 md:mb-20 space-y-3">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              {t.features.title}
            </h2>
            <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {t.features.items.map((item, i) => (
              <Card
                key={i}
                className="p-6 md:p-8 bg-white/[0.03] border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  {item.icon === "Shield" && (
                    <Shield className="w-6 h-6" />
                  )}
                  {item.icon === "Brain" && <Brain className="w-6 h-6" />}
                  {item.icon === "Eye" && <Eye className="w-6 h-6" />}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
          <SectionCTA />
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section
        ref={howRef}
        data-section-id="how"
        className="py-16 md:py-32 px-4 border-y border-white/5 bg-white/[0.01]"
      >
        <div
          className={`container mx-auto max-w-5xl transition-all duration-1000 ${
            visibleSections.has("how")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-12 md:mb-20 space-y-3">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              {t.howItWorks.title}
            </h2>
            <p className="text-sm md:text-xl text-muted-foreground">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
            {t.howItWorks.steps.map((step, i) => (
              <div key={i} className="relative group">
                <Card className="p-6 md:p-8 bg-white/[0.03] border-white/5 hover:border-primary/20 transition-all duration-500 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {i === 0 && (
                          <Upload className="w-4 h-4 text-primary/60" />
                        )}
                        {i === 1 && (
                          <Brain className="w-4 h-4 text-primary/60" />
                        )}
                        {i === 2 && (
                          <FileText className="w-4 h-4 text-primary/60" />
                        )}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>
          <SectionCTA />
        </div>
      </section>

      {/* ─── Capabilities Checklist ─── */}
      <section className="py-16 md:py-28 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              {t.capabilities.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {t.capabilities.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group"
              >
                <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/30 transition-colors">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">
                  {item}
                </span>
              </div>
            ))}
          </div>
          <SectionCTA />
        </div>
      </section>

      {/* ─── CTA / Registration ─── */}
      <section
        ref={ctaRef}
        data-section-id="cta"
        className="py-16 md:py-32 px-4 relative"
      >
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto max-w-2xl relative z-10">
          <div className="bg-white/[0.03] p-8 md:p-12 rounded-2xl border border-white/10 backdrop-blur-xl text-center space-y-6 md:space-y-8 shadow-2xl">
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-primary/15 rounded-2xl flex items-center justify-center border border-primary/20 mb-2">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white">
                {t.cta.title}
              </h2>
              <p className="text-sm md:text-lg text-muted-foreground">
                {t.cta.description}
              </p>
            </div>

            {!isSent ? (
              <form
                onSubmit={handleSubmit}
                className="space-y-3 md:space-y-4 max-w-md mx-auto"
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-10 pr-4 h-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={
                      language === "es"
                        ? "Teléfono (opcional)"
                        : "Phone (optional)"
                    }
                    className="w-full pl-10 pr-4 h-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                    disabled={isSubmitting}
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-xs text-left">{error}</p>
                )}

                <div className="flex items-start space-x-2 text-left">
                  <Checkbox
                    id="terms-oraculus"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) =>
                      setAcceptedTerms(checked as boolean)
                    }
                    className="mt-0.5 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label
                    htmlFor="terms-oraculus"
                    className="text-xs text-muted-foreground leading-tight cursor-pointer select-none"
                  >
                    {language === "es" ? (
                      <>
                        He leído y acepto la{" "}
                        <a
                          href="/privacidad"
                          target="_blank"
                          className="text-primary hover:underline"
                        >
                          Política de Privacidad
                        </a>{" "}
                        y el{" "}
                        <a
                          href="/aviso-legal"
                          target="_blank"
                          className="text-primary hover:underline"
                        >
                          Aviso Legal
                        </a>
                        .
                      </>
                    ) : (
                      <>
                        I have read and accept the{" "}
                        <a
                          href="/privacidad"
                          target="_blank"
                          className="text-primary hover:underline"
                        >
                          Privacy Policy
                        </a>{" "}
                        and{" "}
                        <a
                          href="/aviso-legal"
                          target="_blank"
                          className="text-primary hover:underline"
                        >
                          Legal Notice
                        </a>
                        .
                      </>
                    )}
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 text-sm md:text-base font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {language === "es" ? "Registrando..." : "Signing up..."}
                    </>
                  ) : (
                    <>
                      {t.hero.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>

                <p className="text-muted-foreground/50 text-xs">{t.cta.free}</p>
              </form>
            ) : (
              <div className="bg-primary/5 p-6 md:p-8 rounded-xl text-center border border-primary/20 max-w-md mx-auto">
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {language === "es" ? "¡Revisa tu email!" : "Check your email!"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "es"
                    ? "Hemos enviado un enlace mágico a"
                    : "We've sent a magic link to"}
                  <br />
                  <span className="font-medium text-primary">{email}</span>
                </p>
                <p className="text-muted-foreground/50 text-xs mt-4">
                  {language === "es"
                    ? "¿No lo ves? Revisa spam"
                    : "Don't see it? Check spam"}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-8 border-t border-white/5 text-muted-foreground text-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs">{t.footer.copyright}</p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-muted-foreground/50">
            <a
              href="/privacidad"
              className="hover:text-primary transition-colors"
            >
              {t.footer.privacy}
            </a>
            <a
              href="/terminos"
              className="hover:text-primary transition-colors"
            >
              {t.footer.terms}
            </a>
            <a
              href="/aviso-legal"
              className="hover:text-primary transition-colors"
            >
              {t.footer.legal}
            </a>
            <a
              href="mailto:contact@veridian.news"
              className="hover:text-primary transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OraclusLanding;
