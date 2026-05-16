import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { formatDateTime, statusLabel } from '@/utils/format';

export default function WorkflowsPage() {
  const workflows = useAsyncData(() => kivoClient.listWorkflows(), []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Orquestração"
        title="Workflows e workers"
        icon="solar:flow-bold-duotone"
        description="Observabilidade dos workers Redis atuais e visão futura de Temporal para retries duráveis, signals e long-running sessions."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {(workflows.data ?? []).map((workflow) => (
          <Card key={workflow.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-bricolage text-xl font-bold text-white">{workflow.name}</h2>
                <p className="mt-1 text-sm text-neutral-500">{workflow.trigger}</p>
              </div>
              <Badge tone={workflow.status}>{statusLabel(workflow.status)}</Badge>
            </div>
            <div className="mt-5 space-y-3">
              {workflow.steps.map((step) => (
                <div key={step.id} className="rounded-xl border border-white/5 bg-black/25 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white">{step.label}</p>
                    <Badge tone={step.status === 'running' ? 'processing' : step.status === 'future' ? 'future' : step.status}>{statusLabel(step.status)}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">{step.description}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-neutral-600">{workflow.engine} · atualizado em {formatDateTime(workflow.updatedAt)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
