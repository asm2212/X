export default function Layout({children}) {
  return (
    <div className="max-w-lg mx-auto border-l border-r border-xborder min-h-screen">
      {children}
    </div>
  );
}