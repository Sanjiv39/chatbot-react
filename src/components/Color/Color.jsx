import Color from "color";

export const ColorData = (input = "", factor = 0.8) => {
  try {
    input = input.trim().toLowerCase();
    const reg = /^([#]|)[0-9a-f]{6,8}$/;
    if (!input.match(reg)) {
      throw new Error("Invalid color input");
    }
    input = input[0] === "#" ? input : `#${input}`;
    const color = Color(input);
    const obj = {
      isDark: color.isDark(),
      isLight: color.isLight(),
      darker: color.darken(0.5).hex(),
      lighter: color.lighten(0.5).hex(),
      alpha: color.alpha(factor).hexa(),
      color: input,
    };
    if (obj.isDark === obj.isLight) {
      throw new Error("Invalid color response");
    }
    return obj;
  } catch (err) {
    return null;
  }
};
