<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<section>
  <h1>{data.content}</h1>
</section>
