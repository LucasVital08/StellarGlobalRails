import { Icon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { useNotificationStore } from '@/stores';
import type { McpTool } from '@/types/kivo';

export default function McpConsolePage() {
  const tools = useAsyncData(() => kivoClient.listMcpTools(), []);
  const config = useAsyncData(() => kivoClient.getMcpAgentConfig(), []);
  const notify = useNotificationStore((state) => state.add);
  const [selected, setSelected] = useState<McpTool | null>(null);
  const [payload, setPayload] = useState('{}');
  const [result, setResult] = useState<string>('');

  const active = selected ?? tools.data?.[0] ?? null;
  const configJson = useMemo(() => JSON.stringify(config.data?.sampleConfig ?? {}, null, 2), [config.data]);

  useEffect(() => {
    if (!selected && tools.data?.[0]) {
      setPayload(JSON.stringify(tools.data[0].exampleInput, null, 2));
    }
  }, [selected, tools.data]);

  const chooseTool = (tool: McpTool) => {
    setSelected(tool);
    setPayload(JSON.stringify(tool.exampleInput, null, 2));
    setResult('');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!active) return;
    try {
      const response = await kivoClient.simulateMcpTool(active.name, JSON.parse(payload) as Record<string, unknown>);
      setResult(JSON.stringify(response.output, null, 2));
      notify({ type: 'success', title: 'Tool call simulado', message: active.name });
    } catch (error) {
      notify({ type: 'error', title: 'Payload invalido', message: error instanceof Error ? error.message : 'Revise o JSON.' });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Agent economy" title="MCP Console" icon="solar:cpu-bolt-bold-duotone" description="Ferramentas MCP genericas para agentes autonomos, sem acoplar o v1 a um provedor especifico." />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Ferramentas</h2>
          <div className="mt-4 space-y-2">
            {(tools.data ?? []).map((tool) => (
              <button key={tool.id} type="button" onClick={() => chooseTool(tool)} className={`w-full rounded-xl border p-3 text-left transition-colors ${active?.id === tool.id ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-white/5 bg-black/20 hover:bg-white/5'}`}>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-bold text-white">{tool.name}</span>
                  <Badge tone={tool.safeForAutoUse ? 'active' : 'pending'}>{tool.safeForAutoUse ? 'auto' : 'gate'}</Badge>
                </div>
                <p className="mt-1 text-xs text-neutral-500">{tool.description}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <Icon icon="solar:terminal-bold" className="text-2xl text-emerald-400" />
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">{active?.title ?? 'Selecione uma ferramenta'}</h2>
              <p className="text-sm text-neutral-500">{active?.description}</p>
            </div>
          </div>
          <form onSubmit={submit} className="grid gap-4 lg:grid-cols-2">
            <textarea value={payload} onChange={(event) => setPayload(event.target.value)} className="min-h-80 rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-xs text-emerald-200 outline-none focus:border-emerald-500" />
            <pre className="min-h-80 overflow-auto rounded-xl border border-white/10 bg-black/50 p-4 text-xs text-blue-200">{result || '// output simulado aparece aqui'}</pre>
            <button className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black lg:col-span-2">Simular tool call</button>
          </form>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Agent config</h2>
              <p className="mt-1 text-sm text-neutral-500">{config.data?.server.name} · {config.data?.server.transport} · {config.data?.server.url}</p>
            </div>
            <CopyButton value={configJson} label="Copiar JSON" />
          </div>
          <pre className="mt-4 max-h-72 overflow-auto rounded-xl border border-white/10 bg-black/50 p-4 text-xs text-emerald-100">{configJson}</pre>
        </Card>

        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Approval gates</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-xl bg-black/25 p-3">
              <p className="text-neutral-500">Auto approve safe tools</p>
              <p className="mt-1 font-bold text-white">{config.data?.approvalPolicy.autoApproveSafeTools ? 'Ativo' : 'Manual'}</p>
            </div>
            <div className="rounded-xl bg-black/25 p-3">
              <p className="text-neutral-500">Limite automatico</p>
              <p className="mt-1 font-bold text-white">{config.data?.approvalPolicy.maxAutoPaymentAmount}</p>
            </div>
            <div className="rounded-xl bg-black/25 p-3">
              <p className="text-neutral-500">Human gate</p>
              <p className="mt-1 break-words font-mono text-xs text-amber-300">{config.data?.approvalPolicy.requireHumanFor.join(', ')}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
