<script lang="ts">
	import PlayfieldComponent from "../components/PlayfieldComponent.svelte";
	import ScoreComponent from "../components/ScoreComponent.svelte";
	import LoadingComponent from "./LoadingComponent.svelte";

	import { Game } from '../logic/Game';
	import WinMessageComponent from "./WinMessageComponent.svelte";
	import { CardStateEnum } from "../enums/CardStateEnum";

	let seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

	let game = new Game(seed);

	let loadPromise = game.load();

	const onReset = () => {
		seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

		game.reset(seed);

		//NOTE: Need to retrigger svelte
		game = game;
	};


	$: score = game.score;
	$: finishedStore = game.finished;
	$: finished = $finishedStore || false;

	$: isWin = finished && $score > 0
</script>

<style lang="scss">
	main {
		width: 600px !important;
		height: 500px;

		background-color: lightgray;
	}

	//TODO: DRY: refactor out
	.center {
		display: block;
		margin-left: auto;
		margin-right: auto;
	}
</style>

<main class="center">
	{#await loadPromise}
		<LoadingComponent />
	{:then}
		<PlayfieldComponent playfield={game.getPlayfield()} />
		<ScoreComponent score={$score} on:click={onReset} {finished} />
	{:catch error}
		<pre><code>ERROR: {JSON.stringify(error)}</code></pre>
	{/await}

	{#if finished}
		<WinMessageComponent {isWin} />
	{/if}
</main>