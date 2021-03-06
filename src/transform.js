import { 
  isUnitRatio,
  getUnit,
  getRoundNum,
  getMinFromRatio,
  getMaxFromRatio,
  getArray } from './math';

export default (opts, theme, e) => {
  const store = {
    /*
    className: String,
    valueDefault: String,
    */
  }

  return Object.freeze({
    /**
     * addClassName
     * 
     * @description check for negative classes and add ops.prefix
     * 
     * @param {String} className
     * @param {String} valueKey
     *
     * @return {object}
     */
    addClassName(className, valueKey) {
      // look for . or :(not), etc
      const classNameArr = className.split('&');
      const valueKeySupportDefault = valueKey === 'default' ? '' : valueKey;
      const valueKeySeparator = valueKey === 'default' ? '' : '-';
      const classNameSupportNegative = valueKey < 0 ?
        `-${classNameArr[0]}${e(valueKeySupportDefault)}${classNameArr[1]}` : 
        `${classNameArr[0]}${valueKeySeparator}${e(valueKeySupportDefault)}${classNameArr[1]}`;

      store.className = `.${e(`${opts.prefix}${opts.separator}`)}${classNameSupportNegative}`;

      return this;
    },

    /**
     * addDefaultValue
     * 
     * @description
     * 
     * @param {String} themeKey
     * @param {String} valueKey
     * 
     * @return {object}
     */
    addDefaultValue(themeKey, valueKey) {
      store.valueDefault = theme(`${themeKey}.${valueKey}`);

      return this;
    },

    /**
     * get
     * 
     * @description
     * 
     * @param {array} props
     * @param {array|number} value
     * 
     * @return {object}
     */
    get(props, value) {
      const [
        min = store.valueDefault, 
        max = store.valueDefault, 
        screenMin = opts.screenMin, 
        screenMax = opts.screenMax] = getArray(value);

      const get = (x, y, fn) => {
        const v = x === '*' ? store.valueDefault : x;
        return isUnitRatio(x) ? `${getRoundNum(fn(v, y), opts.ratioDecimalRounding)}${getUnit(y)}` : x;
      }

      return { 
        className: store.className,
        props,
        value: { 
          min: get(min, max, getMinFromRatio),
          max: get(max, min, getMaxFromRatio),
          screenMin: theme(screenMin) || screenMin,
          screenMax: theme(screenMax) || screenMax,
        },
      };
    },
  });
};
