// 用word方式计算正文字数
// https://blog.csdn.net/Gavid0124/article/details/38117381
export function getWordLength (str: string) {
  let sLen = 0;
  try {
    //先将回车换行符做特殊处理
    str = str.replace(/(\r\n+|\s+|　+)/g, "龘");
    //处理英文字符数字，连续字母、数字、英文符号视为一个单词
    str = str.replace(/[\x00-\xff]/g, "m");
    //合并字符m，连续字母、数字、英文符号视为一个单词
    str = str.replace(/m+/g, "*");
    //去掉回车换行符
    str = str.replace(/龘+/g, "");
    //返回字数
    sLen = str.length;
  } catch (e) {

  }
  return sLen;
}
