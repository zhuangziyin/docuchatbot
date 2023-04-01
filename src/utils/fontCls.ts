import fontStyle from "@/styles/font.module.css";

export const enUs = "en-US";
export const zhCn = "zh-CN";

export function localeToFontCls(locale: string, weight: string): string {
  if (locale == enUs) {
    switch (weight) {
      case "heavy":
        return fontStyle.enHeavy;
      case "bold":
        return fontStyle.enBold;
      case "medium":
        return fontStyle.enMedium;
      case "light":
        return fontStyle.enLight;
      default:
        return fontStyle.enRegular;
    }
  } else {
    switch (weight) {
      case "heavy":
        return fontStyle.cnHeavy;
      case "bold":
        return fontStyle.cnBold;
      case "medium":
        return fontStyle.cnMedium;
      case "light":
        return fontStyle.cnLight;
      default:
        return fontStyle.cnRegular;
    }
  }
}
