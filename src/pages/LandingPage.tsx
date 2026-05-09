import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import {
  ArrowRight,
  FileText,
  Palette,
  Download,
  Sparkles,
  Shield,
  Zap,
  CheckCircle2,
  Star,
  Layout,
  Globe,
  Layers,
} from 'lucide-react';

const TEMPLATE_PREVIEWS = [
  { name: 'Moderne', accent: 'from-blue-600 to-blue-800', tag: 'Populaire' },
  { name: 'Créatif', accent: 'from-indigo-600 to-pink-600', tag: null },
  { name: 'Executive', accent: 'from-slate-800 to-slate-900', tag: 'Pro' },
  { name: 'Élégant', accent: 'from-slate-700 to-amber-600', tag: null },
  { name: 'Minimaliste', accent: 'from-gray-800 to-gray-900', tag: null },
  { name: 'Swiss Grid', accent: 'from-red-700 to-zinc-900', tag: 'Design' },
];

const FEATURES = [
  {
    icon: <Palette className="w-6 h-6" />,
    title: '22 templates premium',
    description: 'Des designs soignés et professionnels, du classique au créatif, pour tous les secteurs.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Aperçu en temps réel',
    description: 'Voyez votre CV se construire à mesure que vous tapez. Aucune surprise à l\'export.',
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: 'Export PDF & DOCX',
    description: 'Exportez en un clic dans le format qui vous convient. PDF visuel ou ATS-compatible.',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Versions multiples',
    description: 'Gérez plusieurs variantes de votre CV pour différents postes ou secteurs.',
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: 'Sections réorganisables',
    description: 'Glissez-déposez vos sections pour adapter la structure à chaque candidature.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: '100% gratuit & privé',
    description: 'Aucun compte requis. Vos données restent dans votre navigateur, jamais sur nos serveurs.',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Remplissez vos informations',
    description: 'Un formulaire guidé étape par étape : profil, expériences, formation, compétences.',
  },
  {
    number: '02',
    title: 'Choisissez votre design',
    description: 'Parcourez 22 templates professionnels et trouvez celui qui correspond à votre secteur.',
  },
  {
    number: '03',
    title: 'Exportez & postulez',
    description: 'Téléchargez votre CV en PDF haute qualité, prêt à envoyer aux recruteurs.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              CV <span className="gradient-text">Pro</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/create">
              <Button size="sm" className="gap-2 font-semibold">
                Créer mon CV
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="container relative py-20 md:py-32 lg:py-40">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
              <Sparkles className="w-4 h-4" />
              Gratuit • Sans inscription • 22 templates
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Créez un CV{' '}
              <span className="gradient-text">professionnel</span>
              <br />
              en quelques minutes
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Un générateur intuitif avec aperçu en temps réel, 22 designs premium et export PDF gratuit.
              Décrochez votre prochain entretien avec un CV qui fait la différence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/create">
                <Button size="lg" className="gap-2 text-base px-8 py-6 font-semibold shadow-lg hover:shadow-xl transition-all">
                  <FileText className="w-5 h-5" />
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#templates">
                <Button variant="outline" size="lg" className="gap-2 text-base px-8 py-6 font-medium">
                  <Palette className="w-5 h-5" />
                  Voir les templates
                </Button>
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                100% gratuit
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" />
                Données privées
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-primary" />
                En français
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Preview Section */}
      <section id="templates" className="py-20 md:py-28">
        <div className="container">
          <div className="text-center space-y-4 mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Des designs qui <span className="gradient-text">impressionnent</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              22 templates soigneusement conçus pour mettre en valeur votre parcours, quel que soit votre secteur.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {TEMPLATE_PREVIEWS.map((tpl) => (
              <div key={tpl.name} className="group relative">
                <div className="aspect-[3/4] rounded-xl overflow-hidden border border-border/50 bg-card shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  {/* Simulated CV header */}
                  <div className={`h-1/4 bg-gradient-to-r ${tpl.accent} relative`}>
                    <div className="absolute bottom-3 left-4">
                      <div className="w-8 h-8 rounded-full bg-white/20 mb-1" />
                      <div className="h-2 w-20 bg-white/40 rounded mb-1" />
                      <div className="h-1.5 w-14 bg-white/25 rounded" />
                    </div>
                  </div>
                  {/* Simulated CV body */}
                  <div className="p-4 space-y-3">
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-16 bg-primary/15 rounded" />
                      <div className="h-1 w-full bg-muted rounded" />
                      <div className="h-1 w-4/5 bg-muted rounded" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-20 bg-primary/15 rounded" />
                      <div className="h-1 w-full bg-muted rounded" />
                      <div className="h-1 w-3/4 bg-muted rounded" />
                      <div className="h-1 w-5/6 bg-muted rounded" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-14 bg-primary/15 rounded" />
                      <div className="flex gap-1.5 flex-wrap">
                        <div className="h-3 w-10 bg-muted rounded-sm" />
                        <div className="h-3 w-12 bg-muted rounded-sm" />
                        <div className="h-3 w-8 bg-muted rounded-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template label */}
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold">{tpl.name}</p>
                  {tpl.tag && (
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {tpl.tag}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/create">
              <Button variant="outline" size="lg" className="gap-2 font-medium">
                Voir les 22 templates
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Simple comme <span className="gradient-text">1, 2, 3</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Pas besoin de compétences en design. Suivez les étapes et obtenez un CV professionnel.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {STEPS.map((step) => (
              <div key={step.number} className="relative text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-xl font-extrabold gradient-text">{step.number}</span>
                </div>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="text-center space-y-4 mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Tout ce qu'il faut pour un CV <span className="gradient-text">parfait</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="feature-card space-y-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center glass-card p-10 md:p-14 space-y-6">
            <div className="flex justify-center gap-1 text-primary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Prêt à décrocher votre prochain poste ?
            </h2>
            <p className="text-muted-foreground text-lg">
              Rejoignez les candidats qui font la différence avec un CV professionnel et soigné.
            </p>
            <Link to="/create">
              <Button size="lg" className="gap-2 text-base px-10 py-6 font-semibold shadow-lg mt-2">
                <FileText className="w-5 h-5" />
                Créer mon CV maintenant
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">CV Pro</span>
          </div>
          <p>© {new Date().getFullYear()} CV Pro. Gratuit et open source.</p>
        </div>
      </footer>
    </div>
  );
}
