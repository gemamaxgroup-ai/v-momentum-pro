export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-vm-bg text-vm-textMain">
      {children}
    </div>
  );
}
