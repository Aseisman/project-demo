/**
 * 封装 filter和 hdFilter两个数组
 *
 * hdFilter针对ui进行展示(因为filter有些参数需要合并，需要不展示等)
 * filter保存需要发送的请求
 *
 * hdFilter中对象参数{ key:'xxx', label:'xxx',value:xxx, valueText:xxxx, type:1, }
 * 其中 type 的类型：
 *
 * 当type是1的时候，value是数组对象
 * { key:'xxx', label:'销售价区间', value:[{key:"lowest-price"; value:1}, {key:'highest-price':value:1000}], valueText:'1至1000',type:1 }
 *
 * type == 2 时，传空值 value是对应空值列的id
 * { key:'xxx', label:'销售价区间', value:100001, valueText:'空值',type:2 }
 *
 * type == 3 时，表示排序（升序降序），全局只能唯一
 *
 * type == 4 时，表示排序的时候，还得加入其他参数（自定义属性筛选时间会用到，好麻烦） 即 4 = 1 + 3
 *
 *
 * key 中包含有 prop 时，对应的是，自定义字段进行筛选的过程，需要对其进行整合成数组
 *
 * filter中的对象参数{ key:'xxx',value:xxx },filter可以重新computed生成
 *
 * 暴露方法：
 * getFilter: 用于获取发送请求的filter
 * updatehdFilter: 可传对象 or 数组对象，用于更新
 * deletehdFilter: 传key  用于删除
 *
 *
 */

export default {
  // components: {},
  data() {
    return {
      hdFilter: [] //{key:'pd_name',label:"名称",value:'50'}
    };
  },
  methods: {
    deletehdFilter(key) {
      const index = this.hdFilter.findIndex((item) => item.key == key);
      if (~index) {
        this.hdFilter.splice(index, 1);
      }
    },
    deleteSortType() {
      for (let i = 0; i < this.hdFilter.length; i++) {
        if (this.hdFilter[i].type == 3 || this.hdFilter[i].type == 4) {
          this.hdFilter.splice(i, 1);
          i--;
        }
      }
    },
    updatehdFilter(obj) {
      const fn = (o) => {
        var index = this.hdFilter.findIndex((item) => item.key == o.key);
        if (~index) {
          this.hdFilter.splice(index, 1, {
            ...this.hdFilter[index],
            ...o
            // value: o.value,
            // valueText: o.valueText,
            // type: o.type,
            // label: o.label,
          });
        } else {
          if (o.type == 3 || o.type == 4) {
            this.deleteSortType();
          }
          this.hdFilter.push({
            ...o
          });
        }
      };
      if (Array.isArray(obj)) {
        obj.forEach((o) => {
          fn(o);
        });
      } else {
        fn(obj);
      }
      return Promise.resolve();
    },
    getValueText(minValue, maxValue) {
      if (minValue === 0) {
        minValue = '0';
      }
      if (maxValue === 0) {
        maxValue = '0';
      }
      if (minValue && !maxValue) {
        return minValue + ' 以上';
      } else if (!minValue && maxValue) {
        return maxValue + ' 以下';
      } else if (minValue && maxValue) {
        return minValue + ' 至 ' + maxValue;
      } else {
        return undefined;
      }
    }
  },
  computed: {
    filter() {
      const res = [];
      const userDefine = [];
      const empty = [];
      this.hdFilter.forEach((item) => {
        if (item.type == 1 || item.type == 4) {
          // 多选
          item.value?.forEach((v) => {
            res.push({
              key: v.key,
              value: v.value
            });
          });
        } else if (item.type == 2) {
          // 空值
          empty.push(item.value); //将空值的id，放入value中，整合成数组
        } else if (/^prop/.test(item.key)) {
          userDefine.push(item.value);
        } else {
          res.push({
            key: item.key,
            value: item.value
          });
        }
      });
      if (userDefine.length) {
        res.push({
          key: 'props',
          value: userDefine
        });
      }
      if (empty.length) {
        res.push({
          key: 'no_prop_ids',
          value: empty
        });
      }
      return res;
    }
  }
};
