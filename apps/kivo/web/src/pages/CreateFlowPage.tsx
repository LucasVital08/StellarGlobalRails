import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  buildIntegrationSnippet,
  createDefaultFlowDraft,
  getTemplateById,
  soloMvpTemplates,
} from '@/data/soloMvp';
import type { CreateFlowDraft, KivoTemplateId } from '@/types/kivo';

const steps = ['Template', 'Pricing', 'Integrate', 'Test', 'Publish'];

const inputClass =
  'mt-2 w-full rounded-xl border border-white/10 bg-neutral-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10';

export default function CreateFlowPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<KivoTemplateId>('device-pay-ev-charging');
  const [draft, setDraft] = useState<CreateFlowDraft>(() => createDefaultFlowDraft('device-pay-ev-charging'));

  const selectedTemplate = useMemo(() => getTemplateById(selectedTemplateId), [selectedTemplateId]);
  const integrationSnippet = useMemo(
    () =>
      buildIntegrationSnippet({
        templateId: draft.templateId,
        resource: draft.resource,
        price: draft.price,
        unit: draft.unit,
      }),
    [draft],
  );

  const selectTemplate = (templateId: KivoTemplateId) => {
    setSelectedTemplateId(templateId);
    setDraft(createDefaultFlowDraft(templateId));
  };

  const updateDraft = (field: keyof CreateFlowDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Create Flow"
        title="O que voce quer monetizar?"
        icon="solar:add-circle-bold-duotone"
        description="Comece com um template pronto, configure preco e teste o pagamento antes de publicar."
        action={
          <Link
            to="/flows"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-neutral-200 transition hover:border-emerald-400/40 hover:text-white"
          >
            <Icon icon="solar:arrow-left-linear" />
            Voltar aos flows
          </Link>
        }
      />

      <div className="grid gap-3 md:grid-cols-5">
        {steps.map((step, index) => (
          <Card key={step} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10 text-xs font-bold text-emerald-300">
                {index + 1}
              </span>
              <Icon
                icon={index < 3 ? 'solar:check-circle-bold' : 'solar:round-arrow-right-up-bold'}
                className={index < 3 ? 'text-lg text-emerald-400' : 'text-lg text-neutral-600'}
              />
            </div>
            <p className="mt-3 text-sm font-bold text-white">{step}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {soloMvpTemplates.map((template) => {
          const selected = template.id === selectedTemplateId;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => selectTemplate(template.id)}
              className={`rounded-2xl border p-5 text-left premium-shadow transition ${
                selected
                  ? 'border-emerald-400/50 bg-emerald-500/10'
                  : 'border-white/5 bg-neutral-900/80 hover:border-white/15'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-emerald-300">
                  <Icon icon={template.icon} className="text-2xl" />
                </div>
                <Badge tone={selected ? 'active' : 'neutral'}>{template.category}</Badge>
              </div>
              <h2 className="mt-4 text-lg font-bold text-white">{template.shortName}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-400">{template.description}</p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">{template.bestFor}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Card className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Badge tone="active">{selectedTemplate.name}</Badge>
              <h2 className="mt-3 text-xl font-bold text-white">Configurar flow</h2>
              <p className="mt-1 text-sm leading-6 text-neutral-400">{selectedTemplate.primaryActionLabel}</p>
            </div>
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm font-bold text-emerald-300">
              USDC
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-neutral-300">
              Nome
              <input
                value={draft.name}
                onChange={(event) => updateDraft('name', event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="text-sm font-semibold text-neutral-300">
              Preco
              <input
                value={draft.price}
                onChange={(event) => updateDraft('price', event.target.value)}
                className={inputClass}
                inputMode="decimal"
              />
            </label>
            <label className="text-sm font-semibold text-neutral-300">
              Unidade
              <input
                value={draft.unit}
                onChange={(event) => updateDraft('unit', event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="text-sm font-semibold text-neutral-300">
              Asset
              <input value="USDC" className={`${inputClass} text-neutral-400`} readOnly />
            </label>
          </div>

          <label className="block text-sm font-semibold text-neutral-300">
            Resource path
            <input
              value={draft.resource}
              onChange={(event) => updateDraft('resource', event.target.value)}
              className={inputClass}
            />
          </label>
        </Card>

        <Card className="flex min-h-[420px] flex-col">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Badge tone="future">Integrate</Badge>
              <h2 className="mt-3 text-xl font-bold text-white">Snippet SDK</h2>
              <p className="mt-1 text-sm leading-6 text-neutral-400">Use este bloco no gateway, API ou feed selecionado.</p>
            </div>
            <Icon icon={selectedTemplate.icon} className="text-3xl text-emerald-300" />
          </div>

          <pre className="mt-5 flex-1 overflow-auto rounded-xl border border-white/10 bg-neutral-950/80 p-4 text-xs leading-6 text-neutral-200">
            <code>{integrationSnippet}</code>
          </pre>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link
          to="/checkout"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-3 text-sm font-bold text-emerald-300 transition hover:border-emerald-300/60 hover:bg-emerald-500/15"
        >
          <Icon icon="solar:card-bold" />
          Testar pagamento
        </Link>
        <Link
          to="/flows"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-neutral-950 transition hover:bg-emerald-300"
        >
          <Icon icon="solar:rocket-bold" />
          Publicar flow
        </Link>
      </div>
    </div>
  );
}
