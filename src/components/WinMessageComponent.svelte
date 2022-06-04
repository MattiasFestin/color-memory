<script lang="ts">
    export let isWin = false;

    $: winMsg = isWin ? 'You win' : 'Looser!';
</script>
<style lang="scss">
    .win {
        position: relative;
        z-index: 1000;
        left: 140px;
        top: -400px;

        h1 {
            font-size: 90px;
        }
    }

    .blink {
        animation: blink 1s linear infinite;
    }

    @keyframes blink {
        50% {
            opacity: 0;
        }
    }
</style>

<div class="win blink">
    <h1>{winMsg}</h1>
</div>
