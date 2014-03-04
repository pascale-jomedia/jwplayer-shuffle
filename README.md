# JWPlayer-Shuffle

A [JWPlayer](http://www.jwplayer.com/) plugin to shuffle a playlist.

On next song, play a random index.
On previous song, play the last index in memory. If there is no more, have standard behavior.

## Documentation

Configuration options:

- `autostart`: Check if the player will auto start. Default is `false`.
- `maxindices`: The maximum of indices to remember (used by back button). Default is `100`.
- `shuffle`: Check if the player will shuffle. Default is `false`.

Function:

- `toggleShuffle()`: Toggle the shuffle mode. Empty the array related to the indices to remember.

## Using it

Make sure you have a valid JWPlayer.

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
plugins: {
  'PATH/TO/jwplayer.shuffle.min.js': {
    autostart: true,
    maxindices: 5,
    shuffle: true
  }
},
...
```

Call plugin function in your JavaScript code.

```javascript
toggleShuffle();
```

## License

Licensed under the [CC BY-NC-SA 3.0](http://creativecommons.org/licenses/by-nc-sa/3.0/), as JWPlayer.
