export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function calculateDuration(startDateString: string, endDateString?: string): number {
  if (!startDateString) return 0;
  
  const startDate = new Date(startDateString);
  const endDate = endDateString ? new Date(endDateString) : new Date();
  
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
  
  return durationHours > 0 ? durationHours : 1; // Minimum 1 hour
}