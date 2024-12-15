<script lang="ts">
    import { actions } from "astro:actions";
    import { dragHandle, dragHandleZone } from "svelte-dnd-action";
    import { flip } from "svelte/animate";
    import { handleError } from "../lib/client.ts";
    const duration = 200;
    const USERNAME_KEY = "username";
    let { id, candidates, defaultUserName } = $props();
    let pairList: { id: number; candy: string }[] = $state(
        (candidates as string[]).map((e, i) => ({ id: i, candy: e })),
    );
    let ids = $derived(pairList.map((e) => e.id));
    let loading: boolean = $state(false);
    let userName: string = $state(
        window.localStorage.getItem(USERNAME_KEY) ?? defaultUserName,
    );

    function handle(e) {
        pairList = e.detail.items;
    }

    function submit() {
        loading = true;
        actions
            .submitVote({ surveyId: id, candidates: ids, userName })
            .then((res) => {
                loading = false;
                if (res.error) {
                    return handleError(res.error);
                }
            });
    }

    $effect(() => {
        userName && window.localStorage.setItem(USERNAME_KEY, userName);
    });
</script>

<div>
    <div class="flex flex-nowrap items-center gap-1 mb-2">
        <div>Name:</div>
        <input class="input p-1" type="text" bind:value={userName} />
    </div>
    <div
        use:dragHandleZone={{ items: pairList, flipDurationMs: duration }}
        onconsider={handle}
        onfinalize={handle}
    >
        {#each pairList as pair (pair.id)}
            <div
                animate:flip={{ duration: duration }}
                class="flex flex-nowrap gap-2 items-center bg-white p-1 mb-1"
            >
                <div
                    use:dragHandle
                    class="i-material-symbols-drag-indicator text-xl"
                ></div>
                <div>{pair.candy}</div>
            </div>
        {/each}
    </div>
    <div class="flex flex-nowrap items-center mb-2">
        <button class="button" onclick={submit}>Submit</button>
        {#if loading}
            <div class="i-line-md-loading-loop text-xl"></div>
        {/if}
    </div>
</div>

<style>
    input {
        width: clamp(20%, 300px, 90%);
    }
</style>
