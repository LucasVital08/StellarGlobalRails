import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/stores';

const commands = [
  { label: 'Dashboard', path: '/dashboard', icon: 'solar:widget-5-bold-duotone', keywords: 'home metrics health' },
  { label: 'Registrar device', path: '/devices', icon: 'solar:devices-bold-duotone', keywords: 'device api key wallet' },
  { label: 'Criar pagamento', path: '/payments', icon: 'solar:wallet-money-bold-duotone', keywords: 'payment stellar usdc' },
  { label: 'MCP Console', path: '/mcp', icon: 'solar:cpu-bolt-bold-duotone', keywords: 'agent tool simulate' },
  { label: 'x402 Playground', path: '/x402', icon: 'solar:shield-keyhole-bold-duotone', keywords: 'payment required header' },
  { label: 'Workflows', path: '/workflows', icon: 'solar:flow-bold-duotone', keywords: 'redis temporal worker' },
  { label: 'Deploy readiness', path: '/deploy', icon: 'solar:rocket-bold-duotone', keywords: 'ops release env build' },
];

export default function CommandPalette() {
  const open = useUIStore((state) => state.commandOpen);
  const setOpen = useUIStore((state) => state.setCommandOpen);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(!open);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    return commands.filter((command) => `${command.label} ${command.keywords}`.toLowerCase().includes(lower));
  }, [query]);

  const run = (path: string) => {
    navigate(path);
    setOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-start justify-center p-4 pt-[16vh]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.96 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 premium-shadow"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
              <Icon icon="solar:magnifer-linear" className="text-xl text-neutral-500" />
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar comando, rota ou ação..." className="w-full bg-transparent text-white outline-none placeholder:text-neutral-600" />
              <span className="rounded bg-white/5 px-2 py-1 text-[10px] text-neutral-500">ESC</span>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.map((command) => (
                <button key={command.path} onClick={() => run(command.path)} className="flex w-full items-center justify-between rounded-xl p-3 text-left hover:bg-white/5">
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Icon icon={command.icon} className="text-xl" />
                    </span>
                    <span className="font-medium text-white">{command.label}</span>
                  </span>
                  <Icon icon="solar:arrow-right-linear" className="text-neutral-600" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
