
<script lang="ts">
	import type { Card } from '../logic/Card';
	import { CardStateEnum } from '../enums/CardStateEnum';
	export let card: Card;

	let isHovering = false;

	$: state = card && card.state;
	$: isDefault = $state === CardStateEnum.Default;
	$: isCorrect = $state === CardStateEnum.Correct;
	$: isSelected = $state === CardStateEnum.Selected;
	$: isLocked = $state === CardStateEnum.Locked;
	$: isRemoved = $state === CardStateEnum.Removed;

	const onMouseEnter = (e: Event) => {
		isHovering = true;
	};

	const onMouseLeave = (e: Event) => {
		if (isHovering) {
			isHovering = false;
		}
	};

	const onMouseClick = (e: Event) => {
		if (isDefault) {
			card.state.set(CardStateEnum.Selected);
		}
	};


</script>

<style lang="scss">
	.card {
		width: 100px;
		height: 100px;
		perspective: 500px;
		position: relative;
		z-index: 1;
	}

	.content {
		width: 100%;
		height: 100%;

		box-shadow: 0 0 15px rgba(0,0,0,0.1);

		transition: all .3s;
		transform-style: preserve-3d;
		transform: translateZ(0);
	}

	.card-selected .content {
		transform: rotateY( 180deg ) ;
		transition: transform 0.3s;
	}

	.card-hover {
		box-shadow: 0 0 50px rgba(0,0,0,0.1);
		transform: translateZ(100);
		z-index: 10;
		.content {
			transition: transform 0.3s ease-in-out;
			transform: translateZ(100px);
		}
	}

	.card-selected.card-hover {
		box-shadow: 0 0 50px rgba(0,0,0,0.1);
		.content {
			transition: transform 0.3s ease-in-out;
			transform: translateZ(100px) rotateY( 180deg );
		}
	}

	.card-correct {
		transition: transform 1.5s ease-in-out;
		transform: translateX(-500px) translateY(-500px) rotateZ(1800deg);
	}

	.card-locked {
		filter: brightness(50%);
	}

	.front, .back {
		position: absolute;
		height: 100%;
		width: 100%;
		background: white;
		line-height: 300px;
		color: #03446A;
		text-align: center;
		font-size: 60px;
		border-radius: 5px;
		backface-visibility: hidden;
	}

	.front {
		//Attribution: https://projects.verou.me/css3patterns/#madras
		background-color: hsl(34, 53%, 82%);
		background-image: repeating-linear-gradient(45deg, transparent 5px, hsla(197, 62%, 11%, 0.5) 5px, hsla(197, 62%, 11%, 0.5) 10px,
			hsla(5, 53%, 63%, 0) 10px, hsla(5, 53%, 63%, 0) 35px, hsla(5, 53%, 63%, 0.5) 35px, hsla(5, 53%, 63%, 0.5) 40px,
			hsla(197, 62%, 11%, 0.5) 40px, hsla(197, 62%, 11%, 0.5) 50px, hsla(197, 62%, 11%, 0) 50px, hsla(197, 62%, 11%, 0) 60px,
			hsla(5, 53%, 63%, 0.5) 60px, hsla(5, 53%, 63%, 0.5) 70px, hsla(35, 91%, 65%, 0.5) 70px, hsla(35, 91%, 65%, 0.5) 80px,
			hsla(35, 91%, 65%, 0) 80px, hsla(35, 91%, 65%, 0) 90px, hsla(5, 53%, 63%, 0.5) 90px, hsla(5, 53%, 63%, 0.5) 110px,
			hsla(5, 53%, 63%, 0) 110px, hsla(5, 53%, 63%, 0) 120px, hsla(197, 62%, 11%, 0.5) 120px, hsla(197, 62%, 11%, 0.5) 140px
			),
			repeating-linear-gradient(135deg, transparent 5px, hsla(197, 62%, 11%, 0.5) 5px, hsla(197, 62%, 11%, 0.5) 10px,
			hsla(5, 53%, 63%, 0) 10px, hsla(5, 53%, 63%, 0) 35px, hsla(5, 53%, 63%, 0.5) 35px, hsla(5, 53%, 63%, 0.5) 40px,
			hsla(197, 62%, 11%, 0.5) 40px, hsla(197, 62%, 11%, 0.5) 50px, hsla(197, 62%, 11%, 0) 50px, hsla(197, 62%, 11%, 0) 60px,
			hsla(5, 53%, 63%, 0.5) 60px, hsla(5, 53%, 63%, 0.5) 70px, hsla(35, 91%, 65%, 0.5) 70px, hsla(35, 91%, 65%, 0.5) 80px,
			hsla(35, 91%, 65%, 0) 80px, hsla(35, 91%, 65%, 0) 90px, hsla(5, 53%, 63%, 0.5) 90px, hsla(5, 53%, 63%, 0.5) 110px,
			hsla(5, 53%, 63%, 0) 110px, hsla(5, 53%, 63%, 0) 140px, hsla(197, 62%, 11%, 0.5) 140px, hsla(197, 62%, 11%, 0.5) 160px
		);
	}

	.back {
		transform: rotateY( 180deg );
	}
</style>

{#if !isRemoved}
	<div class="card"
		class:card-hover={isHovering}
		class:card-selected={isSelected}
		class:card-correct={isCorrect}
		class:card-locked={isLocked}
		on:mouseenter={onMouseEnter}
		on:mouseleave={onMouseLeave}
		on:mousedown={onMouseClick}
	>
		<div class="content">
			<div class="front" />
			<div class="back" style="background: {card.getColor()}" />
		</div>
	</div>
{:else}
	<!-- Empty card to keep layout after beeing removed -->
	<div class="card" />
{/if}