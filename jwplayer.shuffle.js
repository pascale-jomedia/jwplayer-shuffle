/**
 * JWPlayer Shuffle plugin: shuffle the playlist.
 *
 * @license http://creativecommons.org/licenses/by-nc-sa/3.0/ CC BY-NC-SA 3.0
 *
 * @version 0.2
 */

var shuffle_playlistItem, shuffle_setRepeatItem, shuffle_setRepeatPlaylist, shuffle_setShuffle;
(function(jwplayer) {

    var template = function(player, config) {

        // Check if the player will auto start. Default is `false`.
        var autoStart = config.autostart || false;

        // Check if the player will repeat the item. Default is `false`.
        var repeatItem = config.repeatitem || false;

        // Check if the player will repeat the playlist. Default is `false`.
        var repeatPlaylist = config.repeatplaylist || false;

        // Check if the player will shuffle. Default is `false`.
        var shuffle = config.shuffle || false;

        var forceStandardBehavior = false,
            lastIndex = -1,
            lastIndices = [],
            playlistLength,
            repeatOnPlaylistComplete = false;

        player.onPlaylist(
            /*
             * Fired when a new playlist has been loaded into the player.
             * Note this event is not fired as part of the initial playlist load (playlist is loaded when onReady is called).
             *
             * Reset playlist variables.
             */
            function() {
                playlistLength = player.getPlaylist().length;
                lastIndices.length = 0;
            }
        );

        player.onPlaylistItem(
            /*
             * Fired when the playlist index changes to a new playlist item.
             * This event occurs before the player begins playing the new playlist item.
             *
             * Check if the shuffle mode is on.
             * If yes,
             * - on next button or on complete event, play a random index, not played before;
             * - on previous button, if there is an index in memory, play it, otherwise have standard behavior.
             * Otherwise, do nothing.
             */
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

        player.onTime(
            // While the player is playing, this event is fired as the playback position gets updated.
            // This may occur as frequently as 10 times per second.
            function(evt) {
                if (repeatItem && (evt.position + 0.1) >= evt.duration) {
                    // Repeat the item before on complete is thrown.
                    player.seek(0);
                }
            }
        );

        player.onComplete(
            // Fired when an item completes playback.
            function() {
                if (lastIndices.length >= playlistLength && shuffle) {
                    // Playlist is completed under shuffle mode.
                    lastIndices.length = 0;
                    if (!repeatPlaylist) {
                        lastIndices.push(lastIndex);
                        player.stop();
                    } else if (player.getPlaylistIndex() >= (playlistLength - 1)) {
                        repeatOnPlaylistComplete = true;
                    }
                } else if (player.getPlaylistIndex() >= (playlistLength - 1) && (!shuffle && repeatPlaylist || shuffle)) {
                    // Playlist is completed, repeat it.
                    repeatOnPlaylistComplete = true;
                }
            }
        );

        player.onPlaylistComplete(
            // Fired when the player is done playing all items in the playlist.
            // However, if the repeat option is set true, this is never fired.
            function() {
                if (repeatOnPlaylistComplete) {
                    player.play(true);
                    repeatOnPlaylistComplete = false;
                }
            }
        );

        /**
         * Start playback of the playlist item at the specified index.
         *
         * @param index {number} The index.
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
         * If no argument, toggle the repeat item mode; otherwise set it at the specified value.
         *
         * @param newRepeatItem {boolean} The new repeat item value.
         */
        shuffle_setRepeatItem = function(newRepeatItem) {
            if (newRepeatItem && newRepeatItem == repeatItem) {
                return;
            }
            repeatItem = !repeatItem;
            // console.log('repeatItem: ' + repeatItem);
        };

        /**
         * If no argument, toggle the repeat playlist mode; otherwise set it at the specified value.
         *
         * @param newRepeatPlaylist {boolean} The new repeat playlist value.
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
         * @param newShuffle {boolean} The new shuffle value.
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
