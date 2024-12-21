<script lang="ts">
    import { actions } from "astro:actions";
    import { toast } from "@zerodevx/svelte-toast";
    import { handleError } from "../lib/client.ts";
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

    function enter(event: KeyboardEvent, index: number) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById(INPUT_PREFIX + (index + 1))?.focus();
        }
    }

    function submit() {
        candidates = candidates.filter(Boolean);
        if (!title) {
            titleNode.setAttribute("required", "true");
            return;
        }
        loading = true;
        id = "";
        actions
            .createSurvey({ title, candidates })
            .then((res) => {
                if (res.error) {
                    return handleError(res.error);
                }
                id = res.data;
            })
            .catch((e) => handleError(e instanceof Error ? e : new Error(e)))
            .finally(() => (loading = false));
    }

    $effect(() => {
        if (candidates == null || candidates.length === 0) {
            candidates = [""];
        }
        const last = candidates[candidates.length - 1];
        if (last == null || last !== "") {
            candidates.push("");
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
            <span class="">Title *</span>
            <input
                class="input p-2.5"
                type="text"
                bind:value={title}
                bind:this={titleNode}
            />
        </label>
    </div>
    <div class="mb-2">
        {#each candidates as candidate, i}
            <div class="relative flex flex-nowrap pb-2 items-center gap-1">
                <input
                    id={INPUT_PREFIX + i}
                    class="input p-1.5"
                    type="text"
                    bind:value={candidates[i]}
                    onkeypress={(event) => enter(event, i)}
                />
                {#if i > 0 && candidate}
                    <div
                        class="i-material-symbols-cancel text-red-5 hover:text-red-8 text-xl"
                        onclick={() => candidates.splice(i, 1)}
                        tabindex="-1"
                    ></div>
                {/if}
            </div>
        {/each}
    </div>
    <div class="flex flex-nowrap items-center mb-2">
        <button class="button" disabled={!submittable} onclick={submit}
            >Submit</button
        >
        {#if loading}
            <div class="i-line-md-loading-loop text-xl"></div>
        {/if}
    </div>

    {#if id}
        <div class="flex flex-nowrap items-center gap-1">
            <div
                class="i-material-symbols-content-copy hover:bg-gray-6 text-xl cursor-pointer"
                onclick={() => {
                    toast.push("Copied URL");
                    window.navigator.clipboard.writeText(voteURL);
                }}
            ></div>
            <a
                class="text-blue-700 hover:underline"
                href={voteURL}
                target="_blank">{voteURL}</a
            >
        </div>
    {/if}
</div>

<style>
    input {
        width: clamp(50%, 500px, 90%);
    }
</style>
