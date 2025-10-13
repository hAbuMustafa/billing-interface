<script lang="ts">
  import debounce from 'lodash.debounce';
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import Loader from '../Loader.svelte';

  type iSelectT = HTMLInputAttributes & {
    selectedValue?: any;
    done?: boolean;
    endpoint: string;
    minlength?: number;
    optionSnippet?: Snippet<[any]>;
    onclear?: Function;
  };

  let {
    value: inputText = $bindable(''),
    selectedValue = $bindable(null),
    done = $bindable(false),
    endpoint,
    minlength = 4,
    optionSnippet,
    onclear,
    ...props
  }: iSelectT = $props();

  let selectList: any[] = $state([]);

  let shouldFetch = $derived(!done && inputText.length >= minlength);

  let fetching = $state(false);

  $effect(() => {
    if (shouldFetch) {
      fetching = true;
      const debouncedFetch = debounce(async () => {
        const response = await fetch(`${endpoint}?q=${inputText}`);
        const data = await response.json();
        selectList = data;
        fetching = false;
      }, 1500);

      debouncedFetch();
      return () => {
        debouncedFetch.cancel();
      };
    }
  });
</script>

<div class="wrapper">
  <div class="interaction-wrapper">
    <input bind:value={inputText} {...props} />
    {#if done}
      <button
        onclick={() => {
          inputText = '';
          done = false;
          if (onclear) onclear();
        }}>إلغاء</button
      >
    {/if}
  </div>

  {#if shouldFetch}
    {#if optionSnippet}
      {@render list(optionSnippet)}
    {:else}
      {@render list(fallback)}
    {/if}
  {/if}

  {#snippet list(snippet: Snippet<[any]>)}
    {#if fetching}
      <div class="results loading">
        <Loader />
      </div>
    {:else if selectList.length}
      <div class="results">
        <!-- todo: should be able to dismiss on `Esc` key down -->
        {#each selectList as item, i (i)}
          {@render snippet(item)}
        {/each}
      </div>
    {:else if inputText !== '' && inputText.length >= minlength}
      <div class="results no-results">لا توجد نتائج</div>
    {/if}
  {/snippet}

  {#snippet fallback(item: any)}
    <button
      onclick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        selectedValue = item;
      }}
    >
      {item}
    </button>
  {/snippet}
</div>

<style>
  .wrapper {
    position: relative;
  }

  .wrapper:not(:focus-within) > .results {
    display: none;
  }

  .results {
    display: flex;
    flex-direction: column;

    width: 100%;

    position: absolute;
    inset-block-start: 100%;

    z-index: 1;

    border: var(--main-border);
    border-radius: 0.25rem;
    box-shadow: 10px 10px 10px black;

    &.no-results {
      text-align: center;
    }

    &.loading {
      background-color: var(--main-bg-color);
      align-items: center;
    }
  }

  .interaction-wrapper {
    display: flex;

    input {
      flex: 12;
    }

    .cancel {
      flex: 1;
    }
  }
</style>
