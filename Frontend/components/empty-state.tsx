interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = "No data to show" }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  )
}
