<script lang="ts">
  type PropsT = {
    label: string;
    options: any[];
    value: any;
    locked?: boolean;
    name: string;
    dividerList?: any[];
    dividerKey?: string;
  };

  let {
    label = '',
    options = [],
    value = $bindable(),
    locked = $bindable(false),
    name = '',
    dividerList,
    dividerKey,
    ...otherProps
  }: PropsT = $props();
</script>

<fieldset class={locked ? 'locked' : ''} {...otherProps}>
  <legend>{label}</legend>
  {#if !dividerList || !dividerKey}
    {#each options as opt, i (opt.id)}
      {@render optionPick(opt)}
    {/each}
  {:else}
    {#each dividerList as div (div.id)}
      <fieldset class={div.title}>
        {#each options.filter((d: any) => d[dividerKey] === div.id) as opt (opt.id)}
          {@render optionPick(opt)}
        {/each}
      </fieldset>
    {/each}
  {/if}
  <input type="hidden" {name} bind:value />
</fieldset>

{#snippet optionPick(opt: Record<string, any>)}
  <input
    id="{name}_{opt.id}"
    type="radio"
    {name}
    value={opt.id}
    bind:group={value}
    disabled={locked}
    required
  />
  <label for="{name}_{opt.id}">
    <button
      onclick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        value = opt.id;
      }}
    >
      {opt.name}
    </button>
  </label>
{/snippet}

<style>
  fieldset {
    margin-block-start: 1rem;

    &:has(> [type='radio'] + label) {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;

      justify-content: center;
    }

    & > fieldset {
      margin-block-start: unset;

      border: none;
      border-radius: unset;

      &:first-of-type {
        padding-block-start: unset;
      }

      &:not(:last-of-type) {
        border-block-end: var(--main-border);
      }
    }

    label {
      &:is(:focus-within, :focus, :active, :hover) {
        outline: var(--main-border);
        outline-offset: 0.25rem;
      }

      & > button {
        all: unset;
      }
    }
  }

  input[type='radio']:not(:first-of-type) {
    margin-inline-start: 1.5rem;
  }
</style>
