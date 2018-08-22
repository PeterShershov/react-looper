STILL IN DEVELOPMENT. NOT WORKING YET :)

# React-Looper

Web Audio API based looper for React.js

[DEMO](looper-shmooper.com)

# Installation and usage

```
yarn add react-looper
```

```ts
import React from "react";
import Looper from "react-looper";

// TO DO: WRITE EXAPMLE
```

## Available Props

| Name        | Type          | Default   | Description                          |
| :---------- | :------------ | :-------- | :----------------------------------- |
| `looping`   | `boolean`     | false     | Starts or stops your loop            |
| `source`    | `AudioBuffer` | undefined | Audio buffer to play each iteration  |
| `bpm`       | `number`      | 100       | Sets the tempo of your loop          |
| `frequency` | `number`      | 500       | Sets the frequency of the oscillator |
| `onTick`    | `function`    | () => {}  | Function to invoke each iteration    |

If `source` is not provided, Looper will play a short sine that can be used as a metronome.

## License

MIT Licensed. Copyright (c) Peter Sherhsov 2018.
