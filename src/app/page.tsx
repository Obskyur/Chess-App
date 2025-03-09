export default function Page({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <div>
      {children}
    </div>
  );
}
