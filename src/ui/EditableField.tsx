import { useState } from 'react';
export function EditableField({ label, value, check, note, onSave }: {
    label: string;
    value: string;
    check?: boolean;
    note?: string | null;
    onSave: (value: string) => string | null;
}) {
    const [editing, setEditing] = useState(false), [draft, setDraft] = useState(value), [error, setError] = useState('');
    if (!editing)
        return <div className="field"><span>{label}: <strong>{value || 'Not provided'}</strong></span><button className="subtle" aria-label={`Edit ${label}`} onClick={() => { setDraft(value); setError(''); setEditing(true); }}>Edit</button>{check && <p className="check">Check this · {note}</p>}</div>;
    return <form className="field" onSubmit={e => { e.preventDefault(); const error = onSave(draft); if (error)
        setError(error);
    else
        setEditing(false); }}><label>{label}<input autoFocus value={draft} onChange={e => setDraft(e.target.value)} aria-invalid={!!error} placeholder={label.includes('date') ? 'DD/MM/YYYY' : undefined}/></label><button type="submit">Save {label}</button><button type="button" className="subtle" onClick={() => setEditing(false)}>Cancel</button>{error && <p role="alert" className="refusal">{error}</p>}</form>;
}
