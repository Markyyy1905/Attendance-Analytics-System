import type { ReactNode } from 'react';
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) { return <section className={`panel ${className}`}>{children}</section>; }
export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) { return <div className="section-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</div>; }
