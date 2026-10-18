import { expect, it } from 'vitest';
import { CASE_STORAGE_KEY, clearCase, loadCase, saveCase } from '../../src/domain/persist';
import { answered } from './helpers';
function storage():Storage {const data=new Map<string,string>();return {get length(){return data.size;},clear:()=>data.clear(),getItem:key=>data.get(key)??null,key:index=>[...data.keys()][index]??null,removeItem:key=>{data.delete(key);},setItem:(key,value)=>{data.set(key,value);}};}
it('S1 imageless state round trips deeply, preserving provenance, spans, answers and changes',()=>{
    const s=answered('delivery','2026-10-10'),db=storage();saveCase(s,db);expect(loadCase(db)).toEqual(s);
    expect(db.getItem(CASE_STORAGE_KEY)).not.toContain('data:image');expect(db.getItem(CASE_STORAGE_KEY)).not.toContain('blob:');
});
it.each(['{bad JSON',JSON.stringify({schemaVersion:2})])('S2 corrupt JSON or schema clears the key: %s',raw=>{const db=storage();db.setItem(CASE_STORAGE_KEY,raw);expect(loadCase(db)).toBeNull();expect(db.getItem(CASE_STORAGE_KEY)).toBeNull();});
it('S2 forged span, invalid calendar date, duplicate item ids and unknown pixel field are rejected',()=>{
    for(const mutate of [(s:ReturnType<typeof answered>)=>{s.policy!.clauses[0]!.span.text='fake';},(s:ReturnType<typeof answered>)=>{Object.assign(s.receipt!.purchaseDate,{value:'2026-02-29'});},(s:ReturnType<typeof answered>)=>{s.receipt!.items[1]!.id='item-1';},(s:ReturnType<typeof answered>)=>{Object.assign(s,{receiptImage:'data:image/png;base64,AA=='});}]){
        const s=answered('purchase'),db=storage();mutate(s);db.setItem(CASE_STORAGE_KEY,JSON.stringify(s));expect(loadCase(db)).toBeNull();expect(db.length).toBe(0);
    }
});
it('S2 invalid confidence, mismatched kind/window and delivery before purchase cannot restore',()=>{
    for(const mutate of [(s:ReturnType<typeof answered>)=>{s.receipt!.store.confidence=101;},(s:ReturnType<typeof answered>)=>{s.policy!.clauses[0]!.window=null;},(s:ReturnType<typeof answered>)=>{s.deliveryDate.value=s.receipt!.purchaseDate.value!;Object.assign(s.receipt!.purchaseDate,{value:'2026-11-01'});}]){
        const s=answered('purchase'),db=storage();mutate(s);db.setItem(CASE_STORAGE_KEY,JSON.stringify(s));expect(loadCase(db)).toBeNull();expect(db.length).toBe(0);
    }
});
it('S2 deliberate clear removes state and subsequent load stays empty',()=>{const db=storage();saveCase(answered('purchase'),db);clearCase(db);expect(db.getItem(CASE_STORAGE_KEY)).toBeNull();expect(loadCase(db)).toBeNull();});
it('blocked storage never prevents manual in-memory work',()=>{const db=storage();db.getItem=()=>{throw new Error('blocked');};db.setItem=()=>{throw new Error('quota');};db.removeItem=()=>{throw new Error('blocked');};expect(()=>saveCase(answered('purchase'),db)).not.toThrow();expect(loadCase(db)).toBeNull();expect(()=>clearCase(db)).not.toThrow();});
