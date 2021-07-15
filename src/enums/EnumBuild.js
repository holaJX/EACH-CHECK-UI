/**
 * 建筑类型枚举
 * @type {Readonly<{BUILDINGINSULATION: symbol, STOCKYARD: symbol}>}
 */
const EnumBuild = {
  /** 建筑保温 */
  SINGLE_BUILD: '0',
  /** 储罐 */
  STORAGE_TANK: '1',
  /** 堆场 */
  STOCK_YARD: '2',
  /** 建筑保温 */
  BUILDING_INSULATION: '3',
  /** 装饰装修 */
  DECORATION: '4',
  /** 使用性质 */
  USING_CHANGE: '5'
}

export default {
  EnumBuildType: EnumBuild
}
