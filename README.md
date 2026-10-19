# el-table-auto-width

Vue2 + Element UI 的 el-table 列宽自动适配指令。通过监听表格样式变化，自动计算每一列的最大内容宽度，并写回绑定对象，让表头与内容自适应不换行。

## 特性

- 列宽随内容自动撑开，表头/单元格不换行
- 兼容 el-table 固定列（`.el-table__fixed-right`）
- 通过 MutationObserver 监听，表格 resize / 数据变化时自动重算
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
      :width="colWidth[item.label]"
      align="center"
    />
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      colWidth: {}, // 指令自动填充：{ '姓名': 120, '年龄': 80, ... }
      columns: [
        { prop: "name", label: "姓名" },
        { prop: "age", label: "年龄" },
      ],
      tableData: [
        { name: "张三", age: 20 },
        { name: "李四", age: 30 },
      ],
    };
  },
};
</script>
```

### 说明

- 指令绑定值为一个**对象**，计算完成后以 `列名 -> 宽度(px)` 的形式写入
- 列宽通过 `:width="colWidth[item.label]"` 绑定到对应列
- 最小列宽 100px；内容宽度不足 100px 时按 100px 处理
- 表格样式变化（如容器 resize、列显隐、数据刷新）时会自动重新计算

## 注意事项

- 仅支持 Vue 2 与 Element UI 的 el-table
- 绑定对象必须是响应式数据（写在 `data()` 中），否则宽度写入后页面不会更新
- 若项目使用 Element Plus / Vue 3，本包不适用

## License

ISC
