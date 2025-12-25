<script lang="ts">
  import type { Person } from '$lib/types/hayagriva';

  let { value = $bindable(), remove }: { value: Person; remove: any } =
    $props();

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
  class="fieldset bg-base-200/40 border-base-300 gap-4 rounded-lg border p-5"
>
  <legend class="fieldset-legend px-2">
    <label class="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        class="checkbox checkbox-sm checkbox-primary"
        bind:checked={isDetailed}
        onchange={updateParent}
      />
      <span class="text-sm font-semibold">Detailed Entry</span>
    </label>
  </legend>

  {#if !isDetailed}
    <div class="form-control w-full">
      <label class="label" for="full-name">
        <span class="label-text font-medium">Full Name</span>
      </label>
      <input
        id="full-name"
        type="text"
        class="input input-bordered w-full"
        placeholder="Rowling, J. K."
        bind:value={simpleName}
        oninput={updateParent}
      />
      <label class="label">
        <span class="label-text-alt text-base-content/60"
          >Enter the person's name in citation format</span
        >
      </label>
    </div>
  {:else}
    <div class="space-y-4">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="form-control">
          <label for="prefix" class="label">
            <span class="label-text font-medium">Prefix</span>
            <span class="label-text-alt text-base-content/60">Optional</span>
          </label>
          <input
            id="prefix"
            type="text"
            placeholder="Dr."
            class="input input-bordered w-full"
            bind:value={prefix}
            oninput={updateParent}
          />
        </div>
        <div class="form-control">
          <label for="suffix" class="label">
            <span class="label-text font-medium">Suffix</span>
            <span class="label-text-alt text-base-content/60">Optional</span>
          </label>
          <input
            id="suffix"
            type="text"
            placeholder="Jr."
            class="input input-bordered w-full"
            bind:value={suffix}
            oninput={updateParent}
          />
        </div>
        <div class="form-control">
          <label for="given-name" class="label">
            <span class="label-text font-medium">Given Name</span>
            <span class="label-text-alt text-base-content/60">Optional</span>
          </label>
          <input
            id="given-name"
            type="text"
            placeholder="Jane"
            class="input input-bordered w-full"
            bind:value={givenName}
            oninput={updateParent}
          />
        </div>
        <div class="form-control">
          <label for="name" class="label">
            <span class="label-text font-medium"
              >Family Name<span class="text-error ml-1">*</span></span
            >
          </label>
          <input
            id="name"
            type="text"
            required
            placeholder="Doe"
            class="input input-bordered w-full"
            bind:value={name}
            oninput={updateParent}
            aria-required="true"
          />
        </div>
      </div>
      <div class="form-control">
        <label for="alias" class="label">
          <span class="label-text font-medium">Alias</span>
          <span class="label-text-alt text-base-content/60">Optional</span>
        </label>
        <input
          id="alias"
          type="text"
          placeholder="bell hooks"
          class="input input-bordered w-full"
          bind:value={alias}
          oninput={updateParent}
        />
        <label class="label">
          <span class="label-text-alt text-base-content/60"
            >Alternative name or pen name</span
          >
        </label>
      </div>
    </div>
  {/if}
  <button
    class="btn btn-error btn-sm btn-outline mt-2"
    type="button"
    onclick={() => remove()}>Remove</button
  >
</fieldset>
