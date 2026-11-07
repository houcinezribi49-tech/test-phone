import { useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { BarChart3, CircleDollarSign, Coins, Wrench } from 'lucide-react';
import { auth, db } from '../firebase';
import { Repair, Sale, StoreSettings, UserProfile, REPAIR_STATUS_LABELS } from '../types';
import { handleFirestoreError, OperationType } from '../App';
import type { SaleCostLine } from '../lib/financial';
import { computeWorkshopSummary, ReportPeriod } from '../lib/workshopReports';
import { Badge, Button, Card, EmptyState, PageHeader } from './ui';

type ExpenseRecord = { id: string; date: unknown; amount: number };

const periods: Array<{ value: ReportPeriod; label: string }> = [
  { value: 'all', label: 'Tout' },
  { value: '7', label: '7 jours' },
  { value: '30', label: '30 jours' },
  { value: '90', label: '90 jours' },
  { value: 'year', label: 'Cette année' },
];

export default function Reports({ userProfile }: { userProfile: UserProfile | null }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [saleCosts, setSaleCosts] = useState<Record<string, SaleCostLine[]>>({});
  const [repairCosts, setRepairCosts] = useState<Record<string, Record<string, number>>>({});
  const [period, setPeriod] = useState<ReportPeriod>('30');
  const [currency, setCurrency] = useState('DT');
  const [loading, setLoading] = useState(true);

  const ownerId = userProfile?.uid;
  const money = (value: number) => value.toFixed(3);

  useEffect(() => {
    if (userProfile?.role !== 'admin' || userProfile.ownerId && userProfile.ownerId !== userProfile.uid || !ownerId || !auth.currentUser) {
      setLoading(false);
      return;
    }

    const completed = new Set<number>();
    let remaining = 6;
    const finishOne = (index: number) => {
      if (completed.has(index)) return;
      completed.add(index);
      remaining -= 1;
      if (remaining === 0) setLoading(false);
    };
    const onError = (error: Error, collectionName: string, index: number, operation = OperationType.LIST) => {
      handleFirestoreError(error, operation, collectionName);
      finishOne(index);
    };
    const unsubs = [
      onSnapshot(query(collection(db, 'sales'), where('ownerId', '==', ownerId)), snapshot => {
        setSales(snapshot.docs.map(item => ({ id: item.id, ...item.data() } as Sale)));
        finishOne(0);
      }, error => onError(error, 'sales', 0)),
      onSnapshot(query(collection(db, 'repairs'), where('ownerId', '==', ownerId)), snapshot => {
        setRepairs(snapshot.docs.map(item => ({ id: item.id, ...item.data() } as Repair)));
        finishOne(1);
      }, error => onError(error, 'repairs', 1)),
      onSnapshot(query(collection(db, 'expenses'), where('ownerId', '==', ownerId)), snapshot => {
        setExpenses(snapshot.docs.map(item => ({ id: item.id, ...item.data() } as ExpenseRecord)));
        finishOne(2);
      }, error => onError(error, 'expenses', 2)),
      onSnapshot(query(collection(db, 'sale_costs'), where('ownerId', '==', ownerId)), snapshot => {
        setSaleCosts(Object.fromEntries(snapshot.docs.map(item => [
          item.id,
          (item.data().items || []) as SaleCostLine[],
        ])));
        finishOne(3);
      }, error => onError(error, 'sale_costs', 3)),
      onSnapshot(query(collection(db, 'repair_costs'), where('ownerId', '==', ownerId)), snapshot => {
        setRepairCosts(Object.fromEntries(snapshot.docs.map(item => [
          item.id,
          Object.fromEntries(((item.data().parts || []) as Array<{ productId: string; unitBuyPrice: number }>)
            .map(part => [part.productId, Number(part.unitBuyPrice) || 0])),
        ])));
        finishOne(4);
      }, error => onError(error, 'repair_costs', 4)),
      onSnapshot(doc(db, 'settings', ownerId), snapshot => {
        if (snapshot.exists()) {
          const settings = snapshot.data() as StoreSettings;
          setCurrency(settings.currency || 'DT');
        }
        finishOne(5);
      }, error => onError(error, `settings/${ownerId}`, 5, OperationType.GET)),
    ];
    return () => unsubs.forEach(unsubscribe => unsubscribe());
  }, [ownerId, userProfile?.role, userProfile?.ownerId, userProfile?.uid]);

  const summary = useMemo(() => computeWorkshopSummary(
    sales, repairs, expenses, saleCosts, repairCosts, period, userProfile?.role === 'admin',
  ), [sales, repairs, expenses, saleCosts, repairCosts, period, userProfile?.role]);

  if (userProfile?.role !== 'admin' || userProfile.ownerId && userProfile.ownerId !== userProfile.uid) {
    return <Badge variant="warning" className="min-h-0 rounded-ds-md p-6 text-sm">Accès réservé à l’administrateur.</Badge>;
  }

  const cards = [
    { label: 'Réparations', value: String(summary.repairCount), unit: '', icon: Wrench, tone: 'brand' },
    { label: 'Encaissé', value: money(summary.collected), unit: currency, icon: CircleDollarSign, tone: 'success' },
    { label: 'Bénéfice brut', value: summary.grossProfit === null ? '—' : money(summary.grossProfit), unit: summary.grossProfit === null ? '' : currency, icon: Coins, tone: summary.grossProfit === null ? 'neutral' : summary.grossProfit < 0 ? 'danger' : 'success' },
    { label: 'Impayés', value: money(summary.debt), unit: currency, icon: CircleDollarSign, tone: 'warning' },
  ];

  return (
    <div className="mx-auto min-w-0 max-w-6xl space-y-6">
      <PageHeader
        title="Rapports atelier"
        description="Atelier • données de ce magasin"
        actions={<div className="flex min-w-0 flex-wrap gap-2" role="group" aria-label="Période du rapport">
          {periods.map(item => (
            <Button key={item.value} type="button" variant={period === item.value ? 'primary' : 'secondary'} size="sm" onClick={() => setPeriod(item.value)}
              aria-pressed={period === item.value}
              className="rounded-full">
              {item.label}
            </Button>
          ))}
        </div>}
      />

      {loading ? <Card className="p-0"><EmptyState title="Chargement du rapport…" /></Card> : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Indicateurs atelier">
            {cards.map(({ label, value, unit, icon: Icon, tone }) => (
              <Card key={label} className="flex min-h-36 min-w-0 items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-wider text-ds-muted">{label}</p>
                  <p className="mt-2 break-words font-mono text-3xl font-black tabular-nums text-ds-text">{value} <span className="text-base">{unit}</span></p>
                </div>
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  tone === 'brand' ? 'bg-ds-brand-soft text-ds-brand' :
                  tone === 'success' ? 'bg-ds-success-soft text-ds-success' :
                  tone === 'danger' ? 'bg-ds-danger-soft text-ds-danger' :
                  tone === 'warning' ? 'bg-ds-warning-soft text-ds-warning' :
                  'bg-ds-surface-2 text-ds-muted'
                }`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </Card>
            ))}
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <Card>
              <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-ds-text"><BarChart3 className="h-4 w-4 text-ds-brand" /> Décomposition du CA réparations</h2>
              <dl className="mt-4 divide-y divide-ds-border text-sm">
                <div className="flex justify-between gap-4 py-3"><dt className="text-ds-muted">Main d’œuvre</dt><dd className="font-mono font-bold tabular-nums text-ds-text">{money(summary.laborRevenue)} {currency}</dd></div>
                <div className="flex justify-between gap-4 py-3"><dt className="text-ds-muted">Pièces (facturées)</dt><dd className="font-mono font-bold tabular-nums text-ds-text">{money(summary.repairPartsRevenue)} {currency}</dd></div>
                <div className="flex justify-between gap-4 py-3"><dt className="text-ds-muted">Coût des pièces</dt><dd className="font-mono font-bold tabular-nums text-ds-text">{money(summary.repairPartsCost)} {currency}</dd></div>
                <div className="flex justify-between gap-4 py-3"><dt className="text-ds-muted">Ventes (TTC)</dt><dd className="font-mono font-bold tabular-nums text-ds-text">{money(summary.salesRevenue)} {currency}</dd></div>
                <div className="flex justify-between gap-4 py-3 text-ds-text"><dt className="font-black">Total facturé</dt><dd className="font-mono font-black tabular-nums">{money(summary.repairRevenue)} {currency}</dd></div>
              </dl>
              {summary.incompleteRepairs > 0 && <Badge variant="warning" className="mt-2 min-h-0 rounded-ds-md">Certains coûts historiques de pièces manquent ; le bénéfice brut n’est pas estimé.</Badge>}
            </Card>
            <Card>
              <h2 className="text-sm font-black uppercase tracking-wide text-ds-text">Répartition par statut</h2>
              <dl className="mt-4 space-y-2">
                {Object.entries(REPAIR_STATUS_LABELS).map(([status, label]) => (
                  <div key={status} className="flex min-w-0 items-center justify-between gap-3 rounded-ds-md bg-ds-surface-2 px-3 py-2 text-sm">
                    <dt className="min-w-0 text-ds-text">{label}</dt>
                    <dd className="shrink-0">
                      <Badge variant={status === 'termine' || status === 'livre' ? 'success' : status === 'en_attente_piece' ? 'warning' : status === 'annule' || status === 'irreparable' ? 'danger' : 'info'} className={`min-h-0 px-2 py-0.5 ${status === 'recu' ? 'border-ds-brand/20 bg-ds-brand-soft text-ds-brand' : ''}`}>
                        {summary.repairStatuses[status] || 0}
                      </Badge>
                    </dd>
                  </div>
                ))}
              </dl>
              {summary.incompleteSales > 0 && <Badge variant="warning" className="mt-3 min-h-0 rounded-ds-md">Les coûts historiques manquent pour {summary.incompleteSales} vente(s) ; bénéfice brut indisponible.</Badge>}
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
