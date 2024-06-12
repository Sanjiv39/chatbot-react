import Color from "color";

export const ColorData = (input = "", factor = 1) => {
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
      darker: color.darken(factor).hex(),
      lighter: color.lighten(factor).hex(),
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
