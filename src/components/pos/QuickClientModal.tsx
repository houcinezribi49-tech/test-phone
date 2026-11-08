import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import type { Client } from '../../types';
import { handleFirestoreError, OperationType } from '../../App';
import { createClient } from '../../lib/clients';
import { Button, Card, Input } from '../ui';

interface QuickClientModalProps {
  clients: Client[];
  ownerId?: string;
  userId?: string;
  onCreated: (client: Client) => void;
  onClose: () => void;
}

function normalizedPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export default function QuickClientModal({
  clients,
  ownerId,
  userId,
  onCreated,
  onClose,
}: QuickClientModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = name.trim();
    const normalizedPhoneValue = normalizedPhone(phone);
    if (!normalizedName) {
      setError('Le nom du client est obligatoire.');
      return;
    }
    if (phone.trim() && (
      !/^\+?[\d\s().-]+$/.test(phone.trim()) ||
      normalizedPhoneValue.length < 7 ||
      normalizedPhoneValue.length > 15
    )) {
      setError('Saisissez un numéro de téléphone valide.');
      return;
    }
    if (normalizedPhoneValue && clients.some(client =>
      normalizedPhone(client.phone || '') === normalizedPhoneValue,
    )) {
      setError('Un client avec ce numéro de téléphone existe déjà.');
      return;
    }
    if (!ownerId) {
      setError('Impossible de déterminer la boutique pour enregistrer ce client.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const client = await createClient({
        name: normalizedName,
        code: '',
        phone: phone.trim(),
        address: address.trim(),
        debt: 0,
      }, ownerId, userId || ownerId);
      onCreated(client);
    } catch (createError) {
      handleFirestoreError(createError, OperationType.CREATE, 'clients');
      setError('Le client n’a pas pu être enregistré. Vérifiez votre connexion et réessayez.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onMouseDown={event => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-client-title"
        className="w-full max-w-md overflow-hidden p-0 shadow-ds-md"
      >
        <div className="flex items-center justify-between border-b border-ds-border bg-ds-surface-2 px-5 py-4">
          <h2 id="quick-client-title" className="text-lg font-bold text-ds-text">Nouveau client</h2>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={saving} aria-label="Fermer">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <Input
            label="Nom complet"
            autoFocus
            required
            maxLength={120}
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="Nom du client"
          />
          <Input
            label="Téléphone"
            type="tel"
            maxLength={30}
            value={phone}
            onChange={event => setPhone(event.target.value)}
            placeholder="Ex. +216 21 000 000"
          />
          <label className="grid gap-1.5 text-sm font-medium text-ds-text">
            Adresse / notes
            <textarea
              rows={2}
              maxLength={500}
              value={address}
              onChange={event => setAddress(event.target.value)}
              className="w-full rounded-ds-md border border-ds-border bg-ds-surface px-3 py-2 text-base text-ds-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-ds-brand"
            />
          </label>
          {error && <p role="alert" className="text-sm font-medium text-ds-danger">{error}</p>}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={saving}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? 'Enregistrement…' : 'Créer le client'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
