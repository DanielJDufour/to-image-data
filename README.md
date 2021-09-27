# to-image-data
> Convert Nested Numerical Arrays into ImageData

# install
```bash
npm install to-image-data
```

# usage
```js
import toImageData from "to-image-data";

const bands = [
  [123, 42, 42, ... ], // red
  [44, 84, 12, ... ], // green
  [48, 72, 52, ... ], // blue
];

const imageData = toImageData(bands);
// { height: 768, width: 1024, data: Uint8ClampedArray[123, 44, 48, 255, 42, 84, 72, 255, ...] }
```