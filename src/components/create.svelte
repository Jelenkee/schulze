<script lang="ts">
    let title: string = $state("");
    let candidates: string[] = $state([""]);
    import { actions } from "astro:actions";

    function change() {
        const last = candidates[candidates.length - 1];
        if (last == null) {
            candidates.push("");
        } else {
            if (last !== "") {
                candidates.push("");
            }
        }
    }

    $effect(() => {
        if (candidates == null || candidates.length === 0) {
            candidates = [""];
        }
    });
</script>

<div>
    <div>title</div>
    <input type="text" bind:value={title} />
    <div>
        {#each candidates as _candidate, i}
            <div>
                {i + 1}:
                <input
                    type="text"
                    bind:value={candidates[i]}
                    oninput={change}
                />
                {#if i > 0}
                    <button onclick={() => candidates.splice(i, 1)}>x</button>
                {/if}
            </div>
        {/each}
    </div>
    <button
        onclick={() =>
            actions
                .createVote({ title, candidates })
                .then((e) => console.log(e))}>Submit</button
    >
    {JSON.stringify(candidates)}
</div>

<style>
</style>
