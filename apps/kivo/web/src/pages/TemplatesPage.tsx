import { Icon } from '@iconify/react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';

const templates = [
  {
    name: 'EV Charging Network',
    icon: 'solar:bolt-circle-bold-duotone',
    description: 'Carro cria pagamento condicionado a kWh entregue; charger submete proof e recebe USDC.',
    endpoints: ['POST /v1/payments', 'POST /v1/payments/:id/condition', 'GET /v1/payments/:id/status'],
  },
  {
    name: 'P2P Energy Trading',
    icon: 'solar:sun-bold-duotone',
    description: 'Medidores solares vendem excedente em micropagamentos com settlement em segundos.',
    endpoints: ['POST /v1/devices', 'POST /v1/payments', 'POST /v1/webhooks'],
  },
  {
    name: 'AI Agent Economy',
    icon: 'solar:cpu-bolt-bold-duotone',
    description: 'Agente encontra API paga, usa MCP, paga via x402 e continua a tarefa autonomamente.',
    endpoints: ['kivo_create_payment', 'kivo_check_status', 'GET /api/x402/data'],
  },
  {
    name: 'IoT Data Marketplace',
    icon: 'solar:database-bold-duotone',
    description: 'Sensores monetizam dados premium por request, com proof de pagamento como credencial.',
    endpoints: ['X-PAYMENT-REQUIRED', 'X-PAYMENT', 'Webhook payment.confirmed'],
  },
  {
    name: 'Edge Compute',
    icon: 'solar:server-square-cloud-bold-duotone',
    description: 'Cliente paga GPU seconds ou compute units sem conta humana ou faturamento mensal.',
    endpoints: ['POST /v1/payments', 'payment channels', 'webhooks'],
  },
];

export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Use cases" title="Templates operacionais" icon="solar:bolt-circle-bold-duotone" description="Modelos prontos para montar fluxos reais de M2M sem virar material de marketing." />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.name} className="relative overflow-hidden">
            <Icon icon={template.icon} className="absolute -bottom-6 -right-5 text-[8rem] text-white/[0.03]" />
            <div className="relative z-10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Icon icon={template.icon} className="text-2xl" />
              </div>
              <h2 className="font-bricolage text-xl font-bold text-white">{template.name}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-400">{template.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {template.endpoints.map((endpoint) => (
                  <code key={endpoint} className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-[10px] text-emerald-300">{endpoint}</code>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
