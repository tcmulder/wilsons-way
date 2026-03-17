=== Shelf Runner ===

Contributors: thinkaquamarine
Tags: game
Requires at least: 6.5.4
Tested up to: 6.8.1
Stable tag: 2.2.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Adds the Shelf Runner game as a shortcode or page template.

== Description ==

This plugin adds the Shelf Runner game to your website. It can either be set up as a host, meaning game scoring data will be saved to your website, or as a client, meaning game scoring data will be saved on another website that is hosting the game.

= Level Designs =

Level designs use [Figma](https://www.figma.com/) plus the [SVG .class Export](https://www.figma.com/community/plugin/1213381201401197785/svg-class-export) extension. Classes follow the `.sr-name` naming convention, and square brackets are converted to data attributes; so, for instance, naming a Figma group `.sr-obstacle.[score:99][sound:positive]` will cause it to have a class name of `sr-obstacle` and data attributes of `data-score="99" data-sound="positive"`.

Here is a full explanation of each option you can add in figma:

* .sr-level - The main level wrapper class.
	* [speed:50] - Modifies the movement speed by this percentage (100 is default).
	* [jump:50] - Modifies the jump height by this percentage (100 is default).
	* [hangtime:50] - Modifies the jump duration by this percentage (100 is default).

* .sr-bg / .sr-props - Parallax background and prop layers.
	* [parallax:0] - Percentage of horizontal travel relative to the main level. Higher values move faster; lower values move slower (0 is fixed, 100 matches the main level).

* .sr-shelf - Platforms and sidewalk the character can stand on.
	* [floor] - Marks the main floor shelf; used to compute ground height and jump physics (ceiling/floor and jump height/hangtime).

* .sr-obstacle - Scoreable items the character can collide with.
	* [score:10] - Sets the score value for this obstacle; positive numbers add points, negative numbers subtract points.
	* [sound:positive] - Overrides the sound played when hit (`positive` or `negative`). Defaults to `positive` for scores > 0 and `negative` for scores < 0.
	* [modifier:invisible] - When collected, temporarily hides negative-scoring obstacles (that do not ignore this modifier) by zeroing their score and marking them as invisible.
	* [modifier:polarity] - When collected, temporarily flips positive-scoring obstacles (that do not ignore this modifier) to negative values.
	* [modifier-delay:3000] - Duration in milliseconds that a modifier effect (such as `invisible` or `polarity`) stays active before reverting.
	* [ignore-modifier:polarity] - Comma-separated list of modifier names this obstacle should ignore (for example `ignore-modifier:polarity` prevents polarity from flipping its score).
	* [rand:group-1] - Groups obstacles by a string key; for each `rand` group, one obstacle is shown at random and the rest are hidden for that playthrough.

* .sr-milestone - Facilitates a pause with a message popup. Each should contain a .sr-obstacle.[data:1000] which triggers the message (for 1000ms in this case, and it can have no score value), an .sr-milestone-message that will become visible upon collision, and an (optional) .sr-milestone-progress that will show an expanding progress bar.
	* [delay:500] - Attach to the .sr-obstacle. Base delay in milliseconds for how long the milestone message stays visible and freezes gameplay.

* Character sprite states (inside the character SVG, not the level SVG).
	* [state:roster] - Pose used for roster/selection screens.
	* [state:jump-up] - Pose used while jumping up.
	* [state:jump-down] - Pose  used while falling down (from a jump or via gravity).
	* [state:move-none] - Idle/resting pose when the character is not moving.
	* [state:ani-sprite] - The running/walking sprite sequence. Paired with `[sprite:150]` to set frame interval in milliseconds.
	* [sprite:150] - On any group used as a sprite strip, sets `data-sprite` to the frame interval in ms; lower numbers animate faster.

= Development =

To develop, run `npm install && npm run dev`. To build the static site, run `npm run build`. This will create a `dist/` directory containing all the static files ready for deployment. The output is optimized and minified for production. To deploy, the `dist/` folder contains the complete static site and can be deployed to any static hosting service.

== Installation ==

1. Upload "shelf-runner" to the "/wp-content/plugins/" directory.
2. Activate the plugin through the "Plugins" menu in WordPress.

== Changelog ==

= 2.2.2 =

* Simplify milestones.

= 2.2.1 =

* Enhanced gameplay and added new level.

= 2.2.0 =

* Switched to client-side loading to ensure plugin updates do not crash the game due to template page cache.

= 2.1.0 =

* Refactor code.

= 2.0.4 =

* Fix WordPress loader path.

= 2.0.3 =

* Improve updates handling.

= 2.0.2 =

* Update settings.

= 2.0.1 =

* Display version number.

= 2.0.0 =

* Rebuild in React.

= 1.4.1 = 

* Remove old dist files from build.

= 1.4.0 =

* Enhance iframe activator shortcode display.
* Add leaderboard option from initial game page.

= 1.3.7 =

* Add build files to repo.

= 1.3.6 =

* Update character name spelling.

= 1.3.5 =

* Prevent scroll up on arrow up click when playing in the iframe.

= 1.3.4 =

* Add build files to repo.

= 1.3.3 =

* Add version number to interface.

= 1.3.2 =

* Fix character bumping to next row in Safari.

= 1.3.1 =

* Fix error related to missing update script file.

= 1.3.0 =

* Game enhanced to support updates.

= 1.2.0 =

* More controls added to settings page.

= 1.1.0 =

* Game enhanced to increase performance.

= 1.0.0 =

* Initial game released.