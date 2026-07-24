import { CONTACT_STATUS_LABELS, TEMPLATE_CATEGORY_LABELS, type ContactStatus, type TemplateCategory, type Tier } from "../types";

export function StatusBadge({ status }: { status: ContactStatus }) {
  return (
    <span className="crm-badge crm-status-badge" data-status={status}>
      {CONTACT_STATUS_LABELS[status]}
    </span>
  );
}

export function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span className="crm-badge crm-tier-badge" data-tier={tier}>
      Tier {tier}
    </span>
  );
}

export function CategoryBadge({ category }: { category: TemplateCategory }) {
  return (
    <span className="crm-badge crm-category-badge" data-category={category}>
      {TEMPLATE_CATEGORY_LABELS[category]}
    </span>
  );
}
