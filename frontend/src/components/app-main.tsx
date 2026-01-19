export interface AppMainProps {
    children: React.ReactNode;
}

export default function AppMain({ children }: AppMainProps) {
    return (
        <main className="bg-slate-50/50 h-full w-full p-2">
            {children}
        </main>
    );
}