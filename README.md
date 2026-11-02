# el-table-auto-width

Vue2 + Element UI 的 el-table 列宽自动适配指令。自动计算每一列的最大内容宽度，并写回绑定对象，让表头与内容自适应不换行；同时支持配置列宽的下限与上限。

## 特性

- 列宽随内容自动撑开，表头 / 单元格不换行
- 支持按列宽下限 `_min`、上限 `_max` 进行收放
- 内容超过 `_max` 时自动恢复换行，长文本在限定宽度内折行显示
- 兼容 el-table 固定列（`.el-table__fixed-right`），固定列与主表一同计算
- 通过 MutationObserver 监听表格化，在 resize / 列显隐 / 数据刷新时自动重算
- 纯源码发布，无构建依赖，轻量易用

## 安装

```bash
npm install el-table-auto-width
```

## 使用

### 一、全局注册（推荐）

在 `main.js` 中引入并注册，全项目所有组件均可直接使用指令：

```js
import Vue from "vue";
import ElTableAutoWidth from "el-table-auto-width";

Vue.directive("tab-auto-width", ElTableAutoWidth);
```

### 二、局部注册（按需引入）

只在某个组件中使用时，通过 `directives` 选项注册：

```js
import ElTableAutoWidth from "el-table-auto-width";

export default {
  directives: {
    "tab-auto-width": ElTableAutoWidth,
  },
};
```

## 模板中使用

给 `el-table` 绑定一个响应式对象，指令会把计算出的列宽写入该对象：

```vue
<template>
  <el-table v-tab-auto-width="colWidth" :data="tableData">
    <el-table-column
      v-for="item in columns"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
      :min-width="colWidth[item.label]"
      align="center"
    />
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      // 指令自动填充：{ _min: 100, _max: 400, '姓名': 120, '地址': 400 }
      colWidth: {
        _min: 100, // 列宽下限，可省略
        _max: 400, // 列宽上限，可省略
      },
      columns: [
        { prop: "name", label: "姓名" },
        { prop: "address", label: "地址" },
      ],
      tableData: [
        { name: "张三", address: "北京市朝阳区建国路 88 号" },
        { name: "李四", address: "上海市浦东新区世纪大道 100 号" },
      ],
    };
  },
};
</script>
```

## 配置列宽上下限

`_min` / `_max` 与列宽结果放在**同一个绑定对象**上，指令每次重算时读取：

| 键     | 类型   | 默认值 | 说明                                                                                                    |
| ------ | ------ | ------ | ------------------------------------------------------------------------------------------------------- |
| `_min` | Number | 无     | 最小列宽（px）。内容宽度不足该值时按该值处理；不配置则不限制最小宽度                                    |
| `_max` | Number | 无     | 最大列宽（px）。内容宽度超过该值时按该值处理，并恢复单元格换行（`white-space: normal`），长文本自动折行 |

不配置 `_min` / `_max` 时，列宽完全由内容决定，`_min` / `_max` 的修改会在下一次重算时生效。

## 说明

- 指令绑定值为一个**对象**，计算完成后以 `列名 -> 宽度(px)` 的形式写入（列名取表头文本 `th.textContent`）
- 列宽通过 `:min-width="colWidth[item.label]"` 绑定到对应列，不建议绑定 `:width`，否则列宽会完全固定，总长度不足会导致表格留白
- 每列宽度取「表头 + 该列所有单元格」内容宽度（`scrollWidth`）的最大值，再经 `_min` / `_max` 修正
- 计算时内部的 `.gutter` 列会被跳过；若存在固定列（`.el-table__fixed-right`），其表头也会一并参与计算
- 表格样式变化（如容器 resize、列显隐、数据刷新）时会自动重新计算，无需手动调用
- 指令在 `inserted` 时启动 MutationObserver 监听（监听表格内部 `style` 属性变化）；在 `unbind` 时断开观察器

## 注意事项

- 仅支持 Vue 2 与 Element UI 的 el-table
- 绑定对象必须是响应式数据（写在 `data()` 中），否则宽度写入后页面不会更新，宽度通过 `$set` 写入
- 宽度以列名作为 key，请尽量保证各列 label 唯一并避开上下限配置项；label 重复时多列共用同一个宽度值
- 若表头使用自定义插槽并包含图标等元素，key 取的是这些元素的 textContent 内容

## License

ISC
