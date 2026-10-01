export function Avatar({ initials, className = '' }: { initials: string; className?: string }) { return <span className={`avatar ${className}`}>{initials}</span>; }
