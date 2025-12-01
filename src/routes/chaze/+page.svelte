<script lang="ts">
	import * as LJS from 'littlejsengine';
	import * as Game from '$lib/chaze/chaze';
	import tiles from '$lib/assets/chaze/tiles.png';
	LJS.engineInit(
		Game.gameInit,
		Game.gameUpdate,
		Game.gameUpdatePost,
		Game.gameRender,
		Game.gameRenderPost,
		[tiles]
	);
</script>
