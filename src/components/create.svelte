<script lang="ts">
    import { actions } from "astro:actions";
    const INPUT_PREFIX = "ii_";
    let title: string = $state("");
    let candidates: string[] = $state([""]);

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

    function enter(event: KeyboardEvent, index: number) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById(INPUT_PREFIX + (index + 1))?.focus();
        }
    }

    $effect(() => {
        if (candidates == null || candidates.length === 0) {
            candidates = [""];
        }
    });
</script>

<div>
    <input type="text" bind:value={title} />
    <div>
        {#each candidates as _candidate, i}
            <div>
                {i + 1}:
                <input
                    id={INPUT_PREFIX + i}
                    type="text"
                    bind:value={candidates[i]}
                    oninput={change}
                    onkeypress={(event) => enter(event, i)}
                />
                {#if i > 0}
                    <button
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onclick={() => candidates.splice(i, 1)}
                        tabindex="-1">x</button
                    >
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
