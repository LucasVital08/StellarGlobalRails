import { Icon } from '@iconify/react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuthStore, useUIStore } from '@/stores';

const navGroups = [
  {
    title: 'Operação',
    items: [
      { to: '/dashboard', icon: 'solar:widget-5-bold-duotone', label: 'Dashboard' },
      { to: '/devices', icon: 'solar:devices-bold-duotone', label: 'Devices' },
      { to: '/payments', icon: 'solar:wallet-money-bold-duotone', label: 'Pagamentos' },
    ],
  },
  {
    title: 'Integração',
    items: [
      { to: '/webhooks', icon: 'solar:widget-2-bold-duotone', label: 'Webhooks' },
      { to: '/api-keys', icon: 'solar:key-minimalistic-bold-duotone', label: 'API Keys' },
      { to: '/mcp', icon: 'solar:cpu-bolt-bold-duotone', label: 'MCP Console' },
      { to: '/x402', icon: 'solar:shield-keyhole-bold-duotone', label: 'x402 Playground' },
    ],
  },
  {
    title: 'Produto',
    items: [
      { to: '/templates', icon: 'solar:bolt-circle-bold-duotone', label: 'Templates' },
      { to: '/workflows', icon: 'solar:flow-bold-duotone', label: 'Workflows' },
      { to: '/deploy', icon: 'solar:rocket-bold-duotone', label: 'Deploy' },
      { to: '/settings', icon: 'solar:settings-bold-duotone', label: 'Configurações' },
    ],
  },
];

export default function Sidebar() {
  const collapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const user = useAuthStore((state) => state.user);

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 270 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-white/5 bg-neutral-950 md:flex"
    >
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 font-bricolage text-sm font-bold text-black">KV</div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="font-bricolage text-lg font-bold text-white leading-none">Kivo Pay</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-emerald-400">M2M Console</p>
          </motion.div>
        )}
      </div>

      {!collapsed && user && (
        <div className="m-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-xs font-bold text-white">{user.organization}</p>
          <p className="mt-1 text-[11px] text-neutral-500">{user.email}</p>
          <div className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Testnet ativa
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.title}>
            {!collapsed && <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600">{group.title}</p>}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                        : 'border-transparent text-neutral-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon icon={item.icon} className="text-xl shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/5 p-3">
        <button onClick={toggleSidebar} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-500 hover:bg-white/5 hover:text-white">
          <Icon icon={collapsed ? 'solar:alt-arrow-right-linear' : 'solar:alt-arrow-left-linear'} className="text-xl" />
          {!collapsed && <span>Recolher</span>}
        </button>
      </div>
    </motion.aside>
  );
}
