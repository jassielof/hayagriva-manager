<script lang="ts">
  let {
    value = $bindable(),
    label
  }: {
    value?: string;
    label?: string;
  } = $props();

  let timestampDay: undefined | string = $state();
  let timestampHour: undefined | string = $state();
  let timestampMinute: undefined | string = $state();
  let timestampSecond: undefined | string = $state();
  let timestampMillisecond: undefined | string = $state();

  let timestamp = $derived.by(() => {
    if (!value) {
      return {};
    }

    const [
      timestampDay,
      timestampHour,
      timestampMinute,
      timestampSecond,
      timestampMillisecond
    ] = value.split(/[:,]/);

    return {
      day: timestampDay,
      hour: timestampHour,
      minute: timestampMinute,
      second: timestampSecond,
      millisecond: timestampMillisecond
    };
  });

  $effect(() => {
    $inspect(timestamp, value, !!timestamp.day);
    // parse the timestamp as dd:hh:mm:ss:ms
    // if there are more than minute and second, then dd:hh:mm:ss,ms accordingly their existence
    // if for example all exist but not ms, then it's dd:hh:mm:ss
    // if not dd but yes to all the rest, then it's hh:mm:ss,ms
    const parts: string[] = [];
    if (!!timestamp.day) parts.push(String(timestamp.day).padStart(2, '0'));
    if (!!timestamp.hour) parts.push(String(timestamp.hour).padStart(2, '0'));
    if (!!timestamp.minute)
      parts.push(String(timestamp.minute).padStart(2, '0'));
    if (!!timestamp.second)
      parts.push(String(timestamp.second).padStart(2, '0'));
    if (!!timestamp.millisecond)
      parts.push(String(timestamp.millisecond).padStart(2, '0'));

    if (parts.length === 0) {
      if (timestamp.millisecond && parts.length > 1) {
        const mainParts = parts.slice(0, -1);
        value = mainParts.join(':') + ',' + parts[parts.length - 1];
      } else {
        value = parts.join(':');
      }
    } else value = undefined;
  });
</script>

{#if label}
  <label for={label} class="label">
    {label}
  </label>
{/if}
<div class="join w-full">
  <input
    type="number"
    min="0"
    placeholder="DD"
    class="input join-item validator w-1/5"
    bind:value={timestamp.day}
  />
  <input
    type="number"
    min="0"
    max={!!timestamp.day ? 23 : undefined}
    placeholder="HH"
    class="input join-item validator w-1/5"
    required={!!timestamp.day}
    bind:value={timestamp.hour}
  />
  <input
    type="number"
    min="0"
    max={!!timestamp.hour ? 59 : undefined}
    placeholder="MM"
    class="input join-item validator w-1/5"
    required={!!timestamp.second || !!timestamp.hour}
    bind:value={timestamp.minute}
  />
  <input
    type="number"
    min="0"
    max={!!timestamp.minute ? 59 : undefined}
    placeholder="SS"
    required={!!timestamp.minute || !!timestamp.millisecond}
    class="input join-item validator w-1/5"
    bind:value={timestamp.second}
  />
  <input
    type="number"
    min="0"
    placeholder="ms"
    class="input join-item validator w-1/5"
    bind:value={timestamp.millisecond}
  />
</div>
