import type { Vote2 } from "./db.ts";

type ResultEntry = { name: string, score: number };

export function schulze(votes: Vote2[]): ResultEntry[] {
    if (votes.length===0){
        return [];
    }
    const p: Map<string, number> = new Map();
    function d(i: number, j: number): number {
        const e = votes.filter(
            (v) => v.candidates.indexOf(i) < v.candidates.indexOf(j),
        ).length;
        console.log(i, j, e);

        return e;
    }
    const c = votes[0].candidates.length;

    function key(i: number, j: number) {
        return `${i}_${j}`;
    }
    for (let i = 0; i < c; i++) {
        for (let j = 0; j < c; j++) {
            if (i != j) {
                if (d(i, j) > d(j, i)) {
                    p.set(key(i, j), d(i, j));
                } else {
                    p.set(key(i, j), 0);
                }
            }
        }
    }
    for (let i = 0; i < c; i++) {
        for (let j = 0; j < c; j++) {
            if (i != j) {
                for (let k = 0; k < c; k++) {
                    if (i != k && j != k) {
                        p.set(
                            key(j, k),
                            Math.max(
                                p.get(key(j, k)) ?? 0,
                                Math.min(
                                    p.get(key(j, i)) ?? 0,
                                    p.get(key(i, k)) ?? 0,
                                ),
                            ),
                        );
                    }
                }
            }
        }
    }
    console.log(p);
    let winners = new Map();
    for (let i=0;i< c;i++){
        let wins=0;
        for (let j = 0;j<c;j++){
            if (i==j){
                continue;
            }
            let scoreI = p.get(key(i,j))??0;
            let scoreJ = p.get(key(j,i))??0;
            if (scoreI>scoreJ){
                wins++;
            }
        }
        winners.set(wins, i);

    }
    let finalWins=[...winners.keys()].toSorted().reverse()
    console.log(finalWins.map(k=>winners.get(k)));
    /*let winners=[];
    for (let i=0;i< c;i++){
        let b=true;
        for (let j = 0;j<c;j++){
            if (i!=j){
                b =b&& (p.get(key(i,j))??0)>= (p.get(key(j,i))??0);
            }
            if (b){
                winners.push(i);
            }
        }
    }
    console.log(winners);*/
    
    return finalWins.map(k=>({name:String(winners.get(k)),score:k}));
}