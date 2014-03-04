/**
 * JWPlayer Shuffle plugin: shuffle the playlist.
 *
 * @license http://creativecommons.org/licenses/by-nc-sa/3.0/ CC BY-NC-SA 3.0
 *
 * @version 0.1
 */
(function(jwplayer) {

    var template = function(player, config, div) {

        // Default auto start is false.
        var autoStart = config.autostart || false;

        // Default maximum of indices is 100.
        var maxIndices = config.maxindices || 100;

        // Default shuffle mode is false.
        var shuffle = config.shuffle || false;

        var lastIndex = -1,
            lastIndices = new Array();

        player.onPlaylistItem(
            function(evt) {

                if (!shuffle) {
                    // If it isn't shuffle mode, have standard behavior.

                } else if (!autoStart) {
                    // Don't auto start on page load.
                    autoStart = true;

                } else if ((lastIndex - evt.index) == -1 || (lastIndex - evt.index + 1) == player.getPlaylist().length) {
                    // Next button and complete event.

                    // Play a random index.
                    lastIndex = Math.floor(Math.random() * player.getPlaylist().length);
                    lastIndices.push(lastIndex);
                    player.playlistItem(lastIndex);

                    if (lastIndices.length > maxIndices) {
                        // Splice the array if too long.
                        lastIndices.splice(0, 1);
                    }

                    // console.log('Next button. lastIndices: ' + lastIndices);

                } else if ((lastIndex - evt.index) == 1 || (evt.index - lastIndex + 1) == player.getPlaylist().length) {
                    // Previous button.

                    lastIndex = lastIndices.pop();
                    if (lastIndex) {
                        // If there is an index in memory, play it.
                        player.playlistItem(lastIndex);
                    } else {
                        // Otherwise, have standard behavior.
                        lastIndex = evt.index;
                    }
                    // console.log('Previous button. lastIndices: ' + lastIndices);

                }

            }
        );

        /**
         * Toggle the shuffle mode.
         */
        toggleShuffle = function() {
            shuffle = !shuffle;
            lastIndices.length = 0; // Empty the array.
            // console.log('shuffle: ' + shuffle);
        }

    };

    jwplayer().registerPlugin('jwplayer.shuffle', '6.0', template);

})(jwplayer);
