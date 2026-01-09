<div class="sr-leaderboard-wrap" data-message="leaderboard">
    <div class="sr-leaderboard-frame">

        <h2><?php _e( 'Shelf Runner', 'shelf-runner' ); ?></h2>

        <div class="sr-leaderboard">
			<ol>
				<?php
				for ($i = 0; $i < 10; $i++ ) {
					$ordinal = ( $i + 1 );
					if ($ordinal === 1) {
						$ordinal .= 'st';
					} elseif ($ordinal === 2) {
						$ordinal .= 'nd';
					} elseif ($ordinal === 3) {
						$ordinal .= 'rd';
					} else {
						$ordinal .= 'th';
					}
					printf(
						'<li class="sr-leaderboard-score"><span>%s</span><span></span><span></span></li>',
						$ordinal
					);
				}
				?>
			</ol>
		</div>

        <button class="sr-button-yellow" data-message-resolve>
            <?php esc_html_e( 'Continue', 'shelf-runner' ); ?>
        </button>

    </div>
</div>
