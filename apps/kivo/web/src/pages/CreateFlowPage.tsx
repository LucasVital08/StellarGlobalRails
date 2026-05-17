import { PageHeader } from '@/components/ui/PageHeader';

export default function CreateFlowPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Create flow"
        title="O que voce quer monetizar?"
        icon="solar:add-circle-bold-duotone"
        description="Escolha um template e configure o primeiro fluxo Kivo."
      />
    </div>
  );
}
