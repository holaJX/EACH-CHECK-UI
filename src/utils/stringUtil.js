/**
 * 字符串转数组
 * @param str 字符串
 * @param separator 分隔符
 * @returns {string[]|*[]}
 */
export function stringTransArr(str,separator) {
  if (typeof(str) == "string") {
    return str.split(separator);
  } else if (typeof(str) == 'number') {
    return String(str).split(separator)
  } else {
    return [];
  }
}

/**
 * 判读字符串是否为空
 * @param str
 * @returns {boolean}
 */
export function isNotNull(str) {
  if (typeof(str) == "string") {
    return str != "";
  } else if (typeof(str) == "number") {
    return String(str) != "";
  } else {
    return false;
  }
}
