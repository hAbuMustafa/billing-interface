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
  <!-- TODO: make these navigable by 'tab' -->
  {#if !dividerList || !dividerKey}
    {#each options as opt, i (opt.id)}
      <input
        id="{name}_{i}"
        type="radio"
        value={opt.id}
        bind:group={value}
        disabled={locked}
        required
      />
      <label for="{name}_{i}">{opt.name}</label>
    {/each}
  {:else}
    {#each dividerList as div (div.id)}
      <fieldset class={div.title}>
        {#each options.filter((d: any) => d[dividerKey] === div.id) as opt (opt.id)}
          <input
            id="{name}_{opt.id}"
            type="radio"
            {name}
            value={opt.id}
            bind:group={value}
            disabled={locked}
            required
          />
          <label for="{name}_{opt.id}">{opt.name}</label>
        {/each}
      </fieldset>
    {/each}
  {/if}
  <input type="hidden" {name} bind:value />
</fieldset>

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
        border-block-end: 1px solid;
      }
    }
  }

  input[type='radio']:not(:first-of-type) {
    margin-inline-start: 1.5rem;
  }
</style>
