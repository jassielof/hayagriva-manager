<script lang="ts">
  import type { AffiliatedPeople } from '$lib/types/hayagriva';
  import { Plus, X } from '@lucide/svelte';
  import PeopleInput from './PeopleInput.svelte';
  import { AFFILIATED_ROLES } from '$lib/validators/affiliated-roles';

  // TODO: Implement Affiliated List input component

  let { value = $bindable() }: { value?: AffiliatedPeople } = $props();

  function addAffiliated() {
    const newAffiliated = { role: 'translator' as const, names: '' };
    if (value) {
      value = [...value, newAffiliated];
    } else {
      value = [newAffiliated];
    }
  }

  function removeAffiliated(index: number) {
    if (value) {
      const newValue = value.filter((_, i) => i !== index);
      value = newValue.length > 0 ? newValue : undefined;
    }
  }
</script>

<!-- FIXME: Improve UI -->
<div>
  <label class="label">Affiliated People</label>
  {#if value && value.length > 0}
    <div class="space-y-4">
      {#each value as _, i (i)}
        <div class="rounded-box border-base-content/20 border p-4">
          <div class="flex items-center justify-between">
            <h4 class="text-lg font-semibold">Affiliated Person #{i + 1}</h4>
            <button
              type="button"
              class="btn btn-error btn-sm btn-circle btn-outline"
              onclick={() => removeAffiliated(i)}
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <label for={`role-${i}`} class="label">Role</label>
          <select
            id={`role-${i}`}
            class="select w-full"
            bind:value={value[i].role}
          >
            {#each AFFILIATED_ROLES as role}
              <option {value}>{role}</option>
            {/each}
          </select>

          <PeopleInput label="Names" bind:value={value[i].names} />
        </div>
      {/each}
    </div>
  {/if}

  <button
    type="button"
    class="btn btn-outline mt-4 w-full"
    onclick={addAffiliated}
  >
    <Plus class="h-4 w-4" /> Add Affiliated Person
  </button>
</div>
