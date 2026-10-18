import type { Category, ItemResult, LineItem } from '../domain/types';
import { CATEGORIES } from '../domain/types';
import { formatLong } from '../domain/civil-date';
import { outcomeText, passageNumber } from './outcomes';
export function ItemCard({ item, result, previous, refused, onCategory, onPassage }: {
    item: LineItem;
    result: ItemResult;
    previous?: ItemResult;
    refused: boolean;
    onCategory: (category: Category) => void;
    onPassage: (id: string) => void;
}) {
    const outcome = result.outcome, changed = previous && JSON.stringify(previous.outcome) !== JSON.stringify(outcome);
    const ids = 'clauseId' in outcome ? [outcome.clauseId] : outcome.status === 'conflict' ? outcome.clauseIds : [];
    return <article data-item={item.id} className={`panel item ${outcome.status} ${result.urgency ?? ''}`}><h3>{item.description.value}</h3><label className="category">Category for {item.description.value}<select aria-label={`Category for ${item.description.value}`} value={item.category.value} onChange={e => onCategory(e.target.value as Category)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
  <p className="date">{refused ? 'No deadline computed.' : outcomeText(outcome)}</p>{result.daysLeft !== null && <p>{result.daysLeft < 0 ? `Closed on ${outcome.status === 'computed' ? formatLong(outcome.deadline) : ''} · Closed ${-result.daysLeft} days ago` : result.daysLeft === 0 ? 'Last day today' : `in ${result.daysLeft} days`}</p>}
  {outcome.status === 'computed' && <p>{outcome.window.amount} {outcome.window.unit.replace('_', ' ')} from {outcome.start.basis} ({formatLong(outcome.start.date)}) · passage {passageNumber(outcome.clauseId)}</p>}
  {changed && <p className="change">was {outcomeText(previous.outcome)} → now {outcomeText(outcome)}</p>}
  {!refused && ids.map(id => <button key={id} onClick={() => onPassage(id)}>Show passage {passageNumber(id)}</button>)}</article>;
}
