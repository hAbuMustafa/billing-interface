<script lang="ts">
  import { scale } from 'svelte/transition';

  let { name, label, list, value = $bindable(''), datalist } = $props();
</script>

<!-- todo: handle + separated entries  -->
<!-- todo: handle filled input -->
<fieldset class="list_maker">
  <legend>{label}</legend>
  <input
    type="text"
    bind:value
    onkeydown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (value.length > 2) {
          list.push(value.trim());
          value = '';
        }
      }
    }}
    required={list.length === 0 ? true : null}
    aria-label={label}
    list="{name}_list_suggestions"
  />

  <datalist id="{name}_list_suggestions">
    {#each datalist as d, i (i)}
      <option value={d}></option>
    {/each}
  </datalist>

  {#if list.length}
    <div class="{name}_list" transition:scale>
      {#each list as item, i (item)}
        <input
          type="checkbox"
          {name}
          id="{name}_{i}"
          value={item}
          checked
          required
          onchange={() => {
            list = list.filter((lItem: string) => item !== lItem);
          }}
        />
        <label for="{name}_{i}" transition:scale>{item}</label>
      {/each}
    </div>
  {/if}
</fieldset>

<style>
  fieldset.list_maker {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    & > .diagnoses_list {
      display: flex;
      gap: 1rem;

      & :checked + label {
        background-color: orange;
        color: var(--main-bg-color);

        &:hover,
        &:focus {
          background-color: salmon;
          text-decoration: line-through;
        }
      }
    }
  }
</style>
