import { PageHeader } from '@/components/ui/PageHeader';

export default function AdvancedPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Advanced"
        title="Ferramentas avancadas"
        icon="solar:settings-bold-duotone"
        description="x402, Etherfuse, MCP, webhooks, deploy e diagnosticos tecnicos."
      />
    </div>
  );
}
