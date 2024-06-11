export const LightenOrDarkenColor = (col = "#ffffff", amt = -20) => {
  try {
    col = col.toLowerCase().trim();
    if (!col.match(/^([#]|)[0-9a-f]{6,8}$/)) {
      throw new Error("Color invalid");
    }
    let usePound = false;

    if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
    }

    let num = parseInt(col, 16);

    let r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    let b = ((num >> 8) & 0x00ff) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    let g = (num & 0x0000ff) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  } catch (err) {
    return null;
  }
};

// console.log(LightenOrDarkenColor("#1f1f72", 20));
