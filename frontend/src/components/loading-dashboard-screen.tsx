import { Loader2 } from "lucide-react";

export function LoadingDashboardScreen({ message = "Carregando..." }: { message?: string }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner animado */}
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        
        {/* Mensagem de texto */}
        {message && (
          <p className="text-sm font-medium text-gray-600 animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}