
<script lang="ts">
    import type { PlayField } from '../logic/PlayField';
    import CardComponent from './CardComponent.svelte';

    export let playfield: PlayField | null;
</script>

<style lang="scss">
    //TODO: DRY: refactor out
	.center {
		display: block;
		margin-left: auto;
		margin-right: auto;
		width: 410px;
        padding-top: 50px;
	}
</style>

{#if playfield}
    <table class="center">
        {#each playfield.getCards() as row}
            <tr>
                {#each row as card}
                    <td>
                        <CardComponent {card} />
                    </td>
                {/each}
            </tr>
        {/each}
    </table>
{/if}