export function Loading({ isFullScreen = true }: { isFullScreen?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center bg-background ${
        isFullScreen ? 'h-screen' : ''
      }`}
    >
      <div className="text-center">
        <div className="animate-spin rounded-full size-16 border-b-[3px] border-accent mx-auto mb-4" />
        <p className="text-primary text-xl">Loading...</p>
      </div>
    </div>
  );
}
