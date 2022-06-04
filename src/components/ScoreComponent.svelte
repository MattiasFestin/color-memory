
<script lang="ts">
    export let score: number = 0;
    export let finished = false;
</script>

<style lang="scss">
    .score-bar {
        display: flex;

        width: 100%;
        height: 75px;

        border-top: 1px solid black;

        background: #cdcdcd;

        .score {
            justify-content: flex-start;
            flex: 1;
            padding: 10px;
        }

        .buttons {
            margin: 10px;
            justify-content: flex-end;
            // flex: 1;
            position: relative;
            width: 100px;

            button {
                width: 100px;
                height: 50px;
            }
        }
    }
</style>

<div class="score-bar">
    <div class="score">
        <h2>Score: {score}</h2>
    </div>
    <div class="buttons">
        {#if finished}
            <button on:click>Restart</button>
        {/if}
    </div>
</div>