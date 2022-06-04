<style lang="scss">
	.logo {
		font-size: 48px;
		padding: 100px 0;
	}

	//TODO: DRY: refactor out
	.center {
		display: block;
		margin-left: auto;
		margin-right: auto;
		width: 50%;
	}

	.center-loading {
		position: relative;
		top: -50px;
		left: 120px;
	}

	// From: https://loading.io/css/
	.lds-ellipsis {
		display: inline-block;
		position: relative;
		width: 100px;
		height: 80px;

		transform: scale(200%);
	}
	.lds-ellipsis div {
		position: absolute;
		top: 33px;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: #000;
		animation-timing-function: cubic-bezier(0, 1, 1, 0);
	}
	.lds-ellipsis div:nth-child(1) {
		left: 8px;
		animation: lds-ellipsis1 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(2) {
		left: 8px;
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(3) {
		left: 32px;
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(4) {
		left: 56px;
		animation: lds-ellipsis3 0.6s infinite;
	}
	@keyframes lds-ellipsis1 {
		0% {
			transform: scale(0);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes lds-ellipsis3 {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0);
		}
	}
	@keyframes lds-ellipsis2 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(24px, 0);
		}
	}
</style>
<div class="center">
	<h1 class="logo">Color memory</h1>

	<div class="center-loading">
		<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
	</div>
</div>