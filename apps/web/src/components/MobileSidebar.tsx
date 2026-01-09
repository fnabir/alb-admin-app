import { SidebarContent } from './SidebarContent';

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-64 bg-card transform transition-transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <SidebarContent onNavigate={onClose} />
      </aside>
    </>
  );
}
