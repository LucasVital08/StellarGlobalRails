import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';

export default function FlowDetailPage() {
  const { id } = useParams();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Flow"
        title={id ?? 'Flow'}
        icon="solar:bolt-circle-bold-duotone"
        description="Detalhe operacional do recurso monetizado."
      />
    </div>
  );
}
