import { LayoutDashboard } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
export function PlaceholderPage({ title, kicker }: { title: string; kicker: string }) { return <main className="content"><div className="page-heading"><div><p className="eyebrow">{kicker}</p><h1>{title}</h1><p className="heading-copy">A typed route surface ready for the next feature slice.</p></div></div><Card className="empty-view"><div className="empty-icon"><LayoutDashboard size={24} /></div><h2>{title} workspace</h2><p>This page is connected to the production route hierarchy and mock service layer. Its domain components can be added without changing the application shell.</p><Button>Explore workspace</Button></Card></main>; }
