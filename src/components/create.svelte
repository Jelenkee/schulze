<script lang="ts">
    import { actions } from "astro:actions";
    const INPUT_PREFIX = "ii_";
    let title: string = $state("");
    let candidates: string[] = $state(["", ""]);
    let titleNode: HTMLElement;
    let loading: boolean = $state(false);
    let id: string = $state("");
    let voteURL: string = $derived(`${window.location.origin}/vote/${id}`);
    let submittable: boolean = $derived.by(() => {
        return candidates.filter((c) => c).length > 1 && Boolean(title);
    });

    function change() {
        const last = candidates[candidates.length - 1];
        if (last == null || last !== "") {
            candidates.push("");
        }
    }

    function enter(event: KeyboardEvent, index: number) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById(INPUT_PREFIX + (index + 1))?.focus();
        }
    }

    function submit() {
        if (!submittable) {
            //toast?
            return;
        }
        candidates=[...candidates.filter(Boolean),""];
        if (!title) {
            titleNode.setAttribute("required", "true");
            return;
        }
        loading = true;
        actions.createVote({ title, candidates }).then((res) => {
            loading = false;
            if (res.error) {
                return console.error(res.error);
            }
            id = res.data;
        });
    }

    $effect(() => {
        if (candidates == null || candidates.length === 0) {
            candidates = [""];
        }
    });

    $effect(() => {
        if (title) {
            titleNode.removeAttribute("required");
        }
    });
</script>

<div class="p-2 bg-#00000011">
    <div class="mb-5">
        <label>
            <span class="text-xl">Title *</span>
            <input
                class="input required:border-red required:focus:ring-red"
                type="text"
                bind:value={title}
                bind:this={titleNode}
            />
        </label>
    </div>
    <div>
        {#each candidates as candidate, i}
            <div>
                {i + 1}:
                <input
                    id={INPUT_PREFIX + i}
                    class="input"
                    type="text"
                    bind:value={candidates[i]}
                    oninput={change}
                    onkeypress={(event) => enter(event, i)}
                />
                {#if i > 0 && candidate}
                    <button
                        class="button"
                        onclick={() => candidates.splice(i, 1)}
                        tabindex="-1">x</button
                    >
                {/if}
            </div>
        {/each}
    </div>
    <button class="button" disabled={!submittable} onclick={submit}
        >Submit</button
    >
    {#if loading}
        <svg
            aria-hidden="true"
            class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            ><path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
            /><path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
            /></svg
        >
    {/if}
    {#if id}
        {voteURL}
    {/if}
    {JSON.stringify(candidates)}
</div>

<style>
</style>
