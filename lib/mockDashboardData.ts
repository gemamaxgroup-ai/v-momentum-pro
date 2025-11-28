export type Trend = 'up' | 'down' | 'flat';

export interface Kpi {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: Trend;
}

export interface TrafficPoint {
  day: string;       // 'Mon', 'Tue', ...
  users: number;
  sessions: number;
}

export interface TopPageRow {
  site: 'FilamentRank' | 'CamPrices';
  path: string;      // '/guide/pla-silk'
  views: number;
  ctr: string;       // '3.1%'
  avgTime: string;   // '3m 24s'
}

export interface Suggestion {
  id: string;
  site: 'FilamentRank' | 'CamPrices';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
}

export const mockDashboardData = {
  kpis: [
    { id: 'users', label: 'Users (24h)', value: '12.4K', delta: '+12.5%', trend: 'up' },
    { id: 'sessions', label: 'Sessions (24h)', value: '18.7K', delta: '+8.3%', trend: 'up' },
    { id: 'top-page', label: 'Top page', value: '/guide/pla-silk', delta: '2.1K views', trend: 'up' },
    { id: 'revenue', label: 'Estimated revenue', value: '$4.2K', delta: '+15.2%', trend: 'up' },
  ] as Kpi[],

  traffic: [
    { day: 'Mon', users: 1200, sessions: 1800 },
    { day: 'Tue', users: 1350, sessions: 1950 },
    { day: 'Wed', users: 1400, sessions: 2000 },
    { day: 'Thu', users: 1600, sessions: 2300 },
    { day: 'Fri', users: 2000, sessions: 2600 },
    { day: 'Sat', users: 2300, sessions: 2900 },
    { day: 'Sun', users: 2100, sessions: 2700 },
  ] as TrafficPoint[],

  topPages: [
    { site: 'FilamentRank', path: '/guide/pla-silk', views: 2100, ctr: '3.2%', avgTime: '3m 12s' },
    { site: 'FilamentRank', path: '/webcam-4k-guide', views: 1800, ctr: '2.7%', avgTime: '2m 48s' },
    { site: 'CamPrices', path: '/best-1080p-webcams', views: 1500, ctr: '3.9%', avgTime: '3m 05s' },
  ] as TopPageRow[],

  suggestions: [
    {
      id: 's1',
      site: 'FilamentRank',
      title: 'PLA silk is trending',
      description: 'Traffic to PLA silk guides grew 32% vs last week. Test a new comparison article and highlight best sellers.',
      impact: 'high',
    },
    {
      id: 's2',
      site: 'CamPrices',
      title: 'Webcam 4K guide is a winner',
      description: 'Your 4K webcam guide ranks among the top 3 pages. Consider adding an FAQ section and an updated "Top 5" list.',
      impact: 'medium',
    },
  ] as Suggestion[],
};
