<script lang="ts">
  import type { Person } from '$lib/types/hayagriva';
  import { X } from '@lucide/svelte';

  let { value = $bindable() }: { value: Person } = $props();

  let isDetailed = $state(false);

  // State for all form fields
  let simpleName = $state('');
  let name = $state('');
  let givenName = $state('');
  let prefix = $state('');
  let suffix = $state('');
  let alias = $state('');

  // When the 'value' from the parent changes, populate the form fields
  $effect(() => {
    if (typeof value === 'string') {
      isDetailed = false;
      simpleName = value;
    } else if (value && typeof value === 'object') {
      isDetailed = true;
      simpleName = ''; // Clear simple name
      name = value.name || '';
      givenName = value['given-name'] || '';
      prefix = value.prefix || '';
      suffix = value.suffix || '';
      alias = value.alias || '';
    } else {
      // Handle null or undefined, reset all
      isDetailed = false;
      simpleName = '';
      name = '';
      givenName = '';
      prefix = '';
      suffix = '';
      alias = '';
    }
  });

  // Called on any input change to update the parent component's state
  function updateParent() {
    if (isDetailed) {
      // Build the object, only including fields that have values
      const personObject: any = { name };
      if (givenName) personObject['given-name'] = givenName;
      if (prefix) personObject.prefix = prefix;
      if (suffix) personObject.suffix = suffix;
      if (alias) personObject.alias = alias;

      // Only update if name is present and the object has changed
      if (name && JSON.stringify(value) !== JSON.stringify(personObject)) {
        value = personObject;
      }
    } else {
      if (value !== simpleName) {
        value = simpleName;
      }
    }
  }
</script>

<fieldset
  class="fieldset bg-base-300/50 border-base-content/20 rounded-box gap-2 border p-4"
>
  <legend class="fieldset-legend">
    <label class="cursor-pointer">
      <input
        type="checkbox"
        class="checkbox checkbox-sm"
        bind:checked={isDetailed}
        onchange={updateParent}
      />
      Detailed
    </label>
  </legend>

  {#if !isDetailed}
    <label class="label" for="full-name"> Full Name </label>
    <input
      id="full-name"
      type="text"
      class="input w-full"
      placeholder="Rowling, J. K."
      bind:value={simpleName}
      oninput={updateParent}
    />
  {:else}
    <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div>
        <label for="prefix" class="label pb-1">Prefix</label>
        <input
          id="prefix"
          type="text"
          placeholder="Dr."
          class="input input-sm w-full"
          bind:value={prefix}
          oninput={updateParent}
        />
      </div>
      <div>
        <label for="suffix" class="label pb-1">Suffix</label>
        <input
          id="suffix"
          type="text"
          placeholder="Jr."
          class="input input-sm w-full"
          bind:value={suffix}
          oninput={updateParent}
        />
      </div>
      <div>
        <label for="given-name" class="label pb-1">Given Name</label>
        <input
          id="given-name"
          type="text"
          placeholder="Jane"
          class="input input-sm w-full"
          bind:value={givenName}
          oninput={updateParent}
        />
      </div>
      <div>
        <label for="name" class="label pb-1">Family Name</label>
        <input
          id="name"
          type="text"
          required
          placeholder="Doe"
          class="input input-sm w-full"
          bind:value={name}
          oninput={updateParent}
        />
      </div>
      <div class="md:col-span-2">
        <label for="alias" class="label pb-1">Alias</label>
        <input
          id="alias"
          type="text"
          placeholder="bell hooks"
          class="input input-sm w-full"
          bind:value={alias}
          oninput={updateParent}
        />
      </div>
    </div>
  {/if}
</fieldset>
