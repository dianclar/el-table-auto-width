# el-table-auto-width

el-table 组件列宽自动适配指令，自动计算每一列的最大内容宽度并写回绑定对象，表头与内容自适应不换行，支持配置列宽上下限。

Auto column width for el-table (Vue 2 / Vue 3, Element UI / Element Plus).

## 特性

- 列宽随内容自动撑开，表头 / 单元格不换行
- 支持配置列宽上下限，超上限时恢复换行，长文本自动折行
- 支持 Vue 2 + Element UI、Vue 3 + Element Plus
- 纯源码发布，无构建依赖

## 安装

```bash
npm install el-table-auto-width
```

## 注册指令

### Vue 2

```js
// main.js 全局注册
import Vue from "vue";
import ElTableAutoWidth from "el-table-auto-width";

Vue.directive("tab-auto-width", ElTableAutoWidth);
```

```js
// 组件内局部注册
import ElTableAutoWidth from "el-table-auto-width";

export default {
  directives: {
    "tab-auto-width": ElTableAutoWidth,
  },
};
```

### Vue 3

```js
// main.js 全局注册
import { createApp } from "vue";
import ElTableAutoWidth from "el-table-auto-width";
import App from "./App.vue";

const app = createApp(App);
app.directive("tab-auto-width", ElTableAutoWidth);
app.mount("#app");
```

```vue
<!-- 组件内局部注册：<script setup> 中变量名以 v 开头即为局部指令 -->
<script setup>
import ElTableAutoWidth from "el-table-auto-width";

const vTabAutoWidth = ElTableAutoWidth; // 模板中用 v-tab-auto-width
</script>
```

## 模板中使用

给 `el-table` 绑定一个响应式对象，指令把计算出的列宽写回该对象，再用 `:min-width` 绑定到列上：

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
      // 指令自动填充：{ _min: 100, _max: 400, 姓名: 120, 地址: 400 }
      colWidth: {
        _min: 100, // 列宽下限，可省略
        _max: 500, // 列宽上限，可省略
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

Vue 3 中绑定对象必须是 `ref` / `reactive`，指令才能触发视图更新：

```vue
<script setup>
import { ref } from "vue";

const colWidth = ref({ _min: 100, _max: 500 });
</script>
```

### label 重复的列

宽度默认以表头文本作为 key，label 相同的多列会互相覆盖。给这些列加一个包含 `_width_` 的类名（`:class-name`），指令会改用该类名作为 key：

```vue
<template>
  <el-table v-tab-auto-width="colWidth" :data="tableData">
    <el-table-column
      v-for="item in columns"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
      :min-width="colWidth[item.key]"
      :class-name="item.key"
    />
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { prop: "name", label: "姓名", key: "_width_姓名1" },
        { prop: "name2", label: "姓名", key: "_width_姓名2" }, // 同 label，不同 key
        { prop: "address", label: "地址" },
      ],
    };
  },
};
</script>
```

此时绑定的对象形如 `{ _min: 100, _max: 500, _width_姓名1: 120, _width_姓名2: 160, 地址: 400 }`。

## 配置列宽上下限

`_min` / `_max` 与列宽结果放在**同一个绑定对象**上，指令每次重算时读取：

| 键     | 类型   | 默认值 | 说明                                                                                                |
| ------ | ------ | ------ | --------------------------------------------------------------------------------------------------- |
| `_min` | Number | 无     | 最小列宽（px）。内容宽度不足该值时按该值处理；不配置则不限制最小宽度                                |
| `_max` | Number | 无     | 最大列宽（px）。内容宽度超过该值时按该值处理，并恢复单元格换行（`white-space: normal`），长文本折行 |

不配置 `_min` / `_max` 时列宽完全由内容决定。修改 `_min` / `_max` 会在下一次重算时生效。

## 注意事项

- 绑定对象必须是响应式数据：Vue 2 写在 `data()` 中（宽度经 `$set` 写入）；Vue 3 必须是 `ref` / `reactive`，否则不会有任何效果。
- 所有配置项绑定一个对象，请注意不要覆盖该对象的已有属性，比如 `_min` / `_max` / `_width_` 及其他 label 等
- 不建议使用 `:width`，所有列宽之和不足时表格右侧留白，此时 `:min-width` 不会留白。
- 以表头文本作 key 时，若表头使用自定义插槽并含图标等元素，key 会变成这些元素的 `textContent`；这类场景建议用 `_width_` 类名方式
- 每次重算都会遍历全表单元格并读取 `scrollWidth`（触发强制同步布局），行数较多时会有性能开销，建议配合分页或虚拟滚动方案单独处理

## License

ISC
