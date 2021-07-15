/**
 * 数组去重
 * @param {*} arr 接收的原数组
 * @param {*} key 如果是对象数组[{id: 1}, {id: 2}, {id: 3}]，则需要以什么key作为重复的标准，普通数组[1,2,3,2]不需要
 */
import el from "element-ui/src/locale/lang/el";

export function arrUnique(arr, key) {
  let returnArr = [];
  if (key) {
    // 对象数组去重
    const obj = {};
    returnArr = arr.reduce((cur, next) => {
      obj[next[key]] ? '' : obj[next[key]] = true && cur.push(next);
      return cur;
    }, []);
    return returnArr;
  }
  // 普通数组去重
  returnArr = arr.reduce((cur, next) => {
    !cur.includes(next) && cur.push(next);
    return cur;
  }, []);
  return returnArr;
}
export function arrTransStr(arr,separator) {
  if (arr.constructor.name=='Array') {
    return arr.join(separator);
  } else {
    return '';
  }
}
