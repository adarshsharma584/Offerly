import { Gift } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
        {icon || <Gift size={28} className="text-green-700" />}
      </div>
      <h3 className="font-display font-bold text-lg text-app-text mb-2">{title}</h3>
      {description && <p className="text-app-muted text-sm mb-6">{description}</p>}
      {action && (
        <div
          onClick={action.onClick}
          className="bg-green-700 text-white font-display font-bold text-sm px-6 py-3 rounded-full cursor-pointer hover:bg-green-600 transition-colors"
        >
          {action.label}
        </div>
      )}
    </div>
  );
}
