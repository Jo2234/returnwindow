import { useState } from 'react';
import type { Question } from '../domain/types';
export function QuestionCard({ question, count, onAnswer }: {
    question: Question;
    count: number;
    onAnswer: (choice: 'purchase' | 'delivery' | 'unsure', delivery?: string) => string | null;
}) {
    const [delivery, setDelivery] = useState(question.kind === 'delivery_date'), [date, setDate] = useState(''), [error, setError] = useState('');
    function answer(choice: 'purchase' | 'delivery' | 'unsure', date?: string) { setError(onAnswer(choice, date) ?? ''); }
    return <section className="panel question" aria-label="Question"><h3>One question <span className="chip">1 of {count}</span></h3><p>{question.prompt}</p>{question.kind === 'clock_start' && <><button onClick={() => answer('purchase')}>Purchase date</button><button onClick={() => setDelivery(true)}>Delivery date</button><button onClick={() => answer('unsure')}>Not sure</button></>}{delivery && <form onSubmit={e => { e.preventDefault(); answer('delivery', date); }}><label>Delivery date (DD/MM/YYYY)<input autoFocus value={date} placeholder="10/10/2026" onChange={e => setDate(e.target.value)} aria-invalid={!!error}/></label><button type="submit">Confirm delivery date</button></form>}{error && <p role="alert" className="refusal">{error}</p>}</section>;
}
