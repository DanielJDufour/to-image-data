const fs = require("fs");
const test = require("flug");
const findAndRead = require("find-and-read");
const readim = require("readim");
const xdim = require("xdim");
const toImageData = require("./to-image-data");

const buffer = findAndRead("flower.jpg");

test("error catching", async ({ eq }) => {
  const { pixels } = await readim({ data: buffer });
  let msg;
  try {
    toImageData(pixels);
  } catch (error) {
    msg = error.message;
  }
  eq(msg.startsWith("[to-image-data]"), true);
});

test("interleaved", async ({ eq }) => {
  const { height, pixels, width } = await readim({ data: buffer });
  const id = toImageData({ height, width, pixels });
  eq(id.data.toString().startsWith("45,68,26,255,64,81,63,255,40,53"), true);
  eq(id.height, height);
  eq(id.width, width);
});

test("to various layouts", async ({ eq }) => {
  const { height, pixels, width } = await readim({ data: buffer });

  ["[band][row][column]", "[row,column][band]", "[band][row,column]"].forEach(to => {
    const { data } = xdim.transform({
      data: pixels,
      from: "[row,column,band]",
      to,
      sizes: {
        band: 4,
        row: height,
        column: width
      }
    });
    const id = toImageData({ height, width, data });
    eq(id.data.toString().startsWith("45,68,26,255,64,81,63,255,40,53"), true);
    eq(id.height, height);
    eq(id.width, width);
  });
});

test("no alpha band", async ({ eq }) => {
  const { height, pixels, width } = await readim({ data: buffer });
  const { data } = xdim.transform({
    data: pixels,
    from: "[row,column,band]",
    to: "[band][row,column]",
    sizes: {
      band: 4,
      row: height,
      column: width
    }
  });

  // remove alpha band
  data.pop();

  const id = toImageData({ height, width, data });
  eq(id.data.toString().startsWith("45,68,26,255,64,81,63,255,40,53"), true);
  eq(id.height, height);
  eq(id.width, width);
});
