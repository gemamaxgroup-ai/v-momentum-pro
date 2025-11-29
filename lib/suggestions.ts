import { Ga4OverviewData, Ga4Site } from './ga4/overview';

export type SuggestionSeverity = 'low' | 'medium' | 'high';

export interface Suggestion {
  id: string;
  site: Ga4Site;
  title: string;
  severity: SuggestionSeverity;
  description: string;
}

/**
 * Genera sugerencias basadas en los datos de overview de GA4
 * 
 * Por ahora usa reglas simples basadas en los datos disponibles.
 * En el futuro, esta función puede conectarse con análisis más avanzados.
 */
export function getSuggestionsForSite(
  site: Ga4Site,
  overviewData: Ga4OverviewData | null
): Suggestion[] {
  if (!overviewData) {
    return getDefaultSuggestions(site);
  }

  const suggestions: Suggestion[] = [];

  // Analizar KPIs para generar sugerencias
  const bounceRateKpi = overviewData.kpis.find((k) => k.id === 'bounce-rate');
  const topPages = overviewData.topPages;

  // Sugerencia basada en bounce rate alto
  if (bounceRateKpi) {
    const bounceRate = parseFloat(bounceRateKpi.value.replace('%', ''));
    if (bounceRate > 60) {
      suggestions.push({
        id: `${site}-bounce-high`,
        site,
        title: 'High bounce rate detected',
        severity: 'medium',
        description: `Bounce rate is ${bounceRate.toFixed(1)}%. Consider improving page content, loading speed, or user experience to reduce bounce rate.`,
      });
    }
  }

  // Sugerencia basada en top pages con alto tráfico
  if (topPages.length > 0) {
    const topPage = topPages[0];
    if (topPage.views > 1000) {
      suggestions.push({
        id: `${site}-top-page-opportunity`,
        site,
        title: `${topPage.path} is performing well`,
        severity: 'high',
        description: `Your top page "${topPage.path}" has ${topPage.views.toFixed(0)} views. Consider creating related content or optimizing this page further to maximize traffic.`,
      });
    }
  }

  // Si no hay sugerencias generadas, usar defaults
  if (suggestions.length === 0) {
    return getDefaultSuggestions(site);
  }

  return suggestions;
}

/**
 * Retorna sugerencias por defecto cuando no hay datos o no se generan sugerencias
 */
function getDefaultSuggestions(site: Ga4Site): Suggestion[] {
  if (site === 'filamentrank') {
    return [
      {
        id: 'filamentrank-default-1',
        site: 'filamentrank',
        title: 'PLA silk is trending',
        severity: 'high',
        description: 'Traffic to PLA silk guides grew 32% vs last week. Test a new comparison article and highlight best sellers.',
      },
      {
        id: 'filamentrank-default-2',
        site: 'filamentrank',
        title: 'Consider A/B testing product pages',
        severity: 'medium',
        description: 'Your product comparison pages show good engagement. Test different layouts or CTAs to improve conversion rates.',
      },
    ];
  }

  return [
    {
      id: 'camprices-default-1',
      site: 'camprices',
      title: 'Webcam 4K guide is a winner',
      severity: 'high',
      description: 'Your 4K webcam guide ranks among the top 3 pages. Consider adding an FAQ section and an updated "Top 5" list.',
    },
    {
      id: 'camprices-default-2',
      site: 'camprices',
      title: 'Monitor budget webcam category',
      severity: 'medium',
      description: 'Budget webcam pages show steady traffic. Consider creating more budget-focused content or comparison guides.',
    },
  ];
}

