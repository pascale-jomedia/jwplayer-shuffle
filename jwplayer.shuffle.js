/**
 * JWPlayer Shuffle plugin: shuffle the playlist.
 *
 * @license http://creativecommons.org/licenses/by-nc-sa/3.0/ CC BY-NC-SA 3.0
 *
 * @version 0.1
 */

var shuffle_playlistItem, shuffle_setRepeatElement, shuffle_setRepeatPlaylist, shuffle_setShuffle;
(function(jwplayer) {

    var template = function(player, config) {

        // Check if the player will auto start. Default is `false`.
        var autoStart = config.autostart || false;

        // Check if the player will repeat the element (song / video). Default is `false`.
        var repeatElement = config.repeatelement || false;

        // Check if the player will repeat the playlist. Default is `false`.
        var repeatPlaylist = config.repeatplaylist || false;

        // Check if the player will shuffle. Default is `false`.
        var shuffle = config.shuffle || false;

        var forceStandardBehavior = false,
            lastIndex = -1,
            lastIndices = [],
            playlistLength;

        player.onPlaylist(
            function() {
                playlistLength = player.getPlaylist().length;
            }
        );

        player.onPlaylistItem(
            function(evt) {

                if (forceStandardBehavior) {
                    // Force the one-time standard behavior.
                    lastIndex = evt.index;
                    forceStandardBehavior = false;

                } else if (!shuffle) {
                    // If it isn't shuffle mode, have standard behavior.
                    lastIndex = evt.index;

                } else if (!autoStart) {
                    // Don't auto start on page load.
                    lastIndex = evt.index;
                    if (shuffle) {
                        lastIndices.push(lastIndex);
                    }
                    autoStart = true;

                } else if ((lastIndex - evt.index) == -1 || (lastIndex - evt.index + 1) >= playlistLength) {
                    // Next button and complete event.

                    if (lastIndices.length >= playlistLength) {
                        // Playlist is completed.
                        lastIndices.length = 0;
                    }

                    // Play a random index, not played before.
                    do {
                        lastIndex = Math.floor(Math.random() * playlistLength);
                    } while (lastIndices.indexOf(lastIndex) > -1);
                    lastIndices.push(lastIndex);
                    player.playlistItem(lastIndex);

                    // console.log('Next button. lastIndices: ' + lastIndices);

                } else if ((lastIndex - evt.index) == 1 || (evt.index - lastIndex + 1) >= playlistLength) {
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

        player.onComplete(
            function() {
                if (repeatElement) {
                    player.seek(0);
                } else if (lastIndices.length >= playlistLength && shuffle) {
                    // Playlist is completed under shuffle mode.
                    lastIndices.length = 0;
                    if (!repeatPlaylist) {
                        lastIndices.push(lastIndex);
                        player.stop();
                    } else if (player.getPlaylistIndex() >= (playlistLength - 1)) {
                        player.playlistItem(0);
                    }
                } else if (player.getPlaylistIndex() >= (playlistLength - 1) && (!shuffle && repeatPlaylist || shuffle)) {
                    player.playlistItem(0);
                }
            }
        );

        /**
         * Start playback of the playlist item at the specified index.
         *
         * @param index int the index
         */
        shuffle_playlistItem = function(index) {

            lastIndices.length = 0; // Empty the array.
            forceStandardBehavior = true;

            lastIndex = index;
            if (shuffle) {
                lastIndices.push(lastIndex);
            }

            player.playlistItem(index);

            // console.log('playlistItem: ' + index);

        };

        /**
         * If no argument, toggle the repeat element mode; otherwise set it at the specified value.
         *
         * @param newRepeatElement boolean the new repeat element value
         */
        shuffle_setRepeatElement = function(newRepeatElement) {
            if (newRepeatElement && newRepeatElement == repeatElement) {
                return;
            }
            repeatElement = !repeatElement;
            // console.log('repeatElement: ' + repeatElement);
        };

        /**
         * If no argument, toggle the repeat playlist mode; otherwise set it at the specified value.
         *
         * @param newRepeatPlaylist boolean the new repeat playlist value
         */
        shuffle_setRepeatPlaylist = function(newRepeatPlaylist) {
            if (newRepeatPlaylist && newRepeatPlaylist == repeatPlaylist) {
                return;
            }
            repeatPlaylist = !repeatPlaylist;
            // console.log('repeatPlaylist: ' + repeatPlaylist);
        };

        /**
         * If no argument, toggle the shuffle mode; otherwise set it at the specified value.
         * Empty the array related to the indices to remember.
         *
         * @param newShuffle boolean the new shuffle value
         */
        shuffle_setShuffle = function(newShuffle) {
            if (newShuffle && newShuffle == shuffle) {
                return;
            }
            shuffle = !shuffle;
            lastIndices.length = 0; // Empty the array.
            // console.log('shuffle: ' + shuffle);
        };

    };

    jwplayer().registerPlugin('jwplayer.shuffle', '6.0', template);

})(jwplayer);
