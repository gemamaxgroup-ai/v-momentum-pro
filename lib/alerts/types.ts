/**
 * Tipos TypeScript para el sistema de alertas v2
 */

export type AlertRuleType = 'TRAFFIC_DROP_30' | 'CONVERSION_DROP_20' | 'PAGEVIEWS_SPIKE_2X';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface AlertRule {
  id: string;
  siteId: string; // 'filamentrank' | 'camprices'
  type: AlertRuleType;
  name: string;
  description: string;
  isEnabled: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface AlertEvent {
  id: string;
  alertRuleId: string;
  siteId: string;
  triggeredAt: string; // ISO date string
  severity: AlertSeverity;
  payload: {
    previousValue: number;
    currentValue: number;
    changePercent: number;
    metric: string;
    [key: string]: unknown; // Para datos adicionales
  };
  sentToEmails: string[];
  emailSent: boolean;
  emailError?: string;
}

