import { PageHeader } from '@/components/ui/PageHeader';

export default function FlowsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Flows"
        title="Recursos monetizados"
        icon="solar:bolt-circle-bold-duotone"
        description="Acompanhe devices, APIs e data feeds que cobram via Kivo."
      />
    </div>
  );
}
