# JWPlayer-Shuffle

A [JWPlayer](http://www.jwplayer.com/) plugin to shuffle a playlist.

On next song, play a random index, not played before.
On previous song, play the last index in memory. If there is no more, have standard behavior.

## Documentation

Configuration options:

- `autostart`: Check if the player will auto start. Default is `false`.
- `repeatplaylist`: Check if the player will repeat the playlist. Default is `false`.
- `shuffle`: Check if the player will shuffle. Default is `false`.

Functions (they all start with `shuffle_` to avoid conflict with your code):

- `shuffle_playlistItem(index)`: Start playback of the playlist item at the specified index.
- `shuffle_setRepeatPlaylist(newRepeatPlaylist)`: If no argument, toggle the repeat playlist mode; otherwise set it at the specified value.
- `shuffle_setShuffle(newShuffle)`: If no argument, toggle the shuffle mode; otherwise set it at the specified value. Empty the array related to the indices to remember.

## Using it

Make sure you have a valid JWPlayer.

In your player configuration options, I highly recommend you to set `repeat: true`.
Please use the `repeatplaylist` in the plugin configuration options.
If you don't, you will have unexpected behavior of the plugin.

To start playback of the playlist item at the specified index, please use `shuffle_playlistItem`.
If you don't, you will have unexpected behavior of the plugin.

Declare the plugin in your setup.

```javascript
...
plugins: {
  'PATH/TO/jwplayer.shuffle.min.js': {}
},
...
```

Declare the configuration options.

```javascript
'PATH/TO/jwplayer.shuffle.min.js': {
  autostart: true,
  repeatplaylist: true,
  shuffle: true
}
```

Call plugin function in your JavaScript code.

```javascript
shuffle_setShuffle();
```

## License

Licensed under the [CC BY-NC-SA 3.0](http://creativecommons.org/licenses/by-nc-sa/3.0/), as JWPlayer.
