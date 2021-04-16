<template>
  <a-form
    :model="form"
    layout="inline"
    label-align="left"
    style="margin: 12px 0"
  >
    <a-form-item label="名称">
      <a-input v-model:value="form.name" style="width: 120px"></a-input>
    </a-form-item>
    <a-form-item label="等级">
      <a-input v-model:value="form.level" style="width: 120px"></a-input>
    </a-form-item>
    <a-form-item label="物等">
      <a-input v-model:value="form.grade" style="width: 120px"></a-input>
    </a-form-item>
    <a-form-item label="是否能制作">
      <a-select v-model:value="form.canMade" allowClear style="width: 120px">
        <a-select-option  value="是">
          是
        </a-select-option>
        <a-select-option  value="否">
          否
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="材质">
      <a-select v-model:value="form.material" allowClear style="width: 120px">
        <a-select-option v-for="(i, index) in material" :key="index" :value="i">
          {{ i }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="search()">
        <template #icon><SearchOutlined /></template>
        搜索
      </a-button>
    </a-form-item>
  </a-form>
  <a-table
    :dataSource="source"
    :columns="columns"
    :scroll="scroll"
    :pagination="pagination"
    @change="handleTableChanged"
  >
    <template #operation="{ record }">
      <template v-if="record.canMade === '是'">
        <a style="margin-right: 1.5rem;">查看制作图</a>
        <a>加入愿望单</a>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { TableStateFilters } from "ant-design-vue/lib/table/interface";
export default defineComponent({
  components: { SearchOutlined },
  setup() {
    return {
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          key: "name",
          sorter: false,
          fixed: "left",
        },
        {
          title: "等级",
          dataIndex: "level",
          key: "level",
          sorter: true,
          fixed: "left",
        },
        {
          title: "物等",
          dataIndex: "grid",
          key: "grid",
          sorter: false,
          fixed: "left",
        },
        {
          title: "属性",
          dataIndex: "material",
          key: "material",
          sorter: false,
          fixed: "left",
        },
        { title: "能否制作", dataIndex: "canMade", key: "ATK" },
        { title: "攻击力", dataIndex: "ATK", key: "ATK", sorter: true },
        { title: "防御力", dataIndex: "DEF", key: "DEF", sorter: true },
        { title: "魔法攻击力", dataIndex: "MATK", key: "MATK", sorter: true },
        { title: "魔法防御力", dataIndex: "MDEF", key: "MDEF", sorter: true },
        { title: "速度", dataIndex: "SPD", key: "SPD", sorter: true },
        { title: "最大生命值", dataIndex: "MAXHP", key: "MAXHP", sorter: true },
        { title: "最大魔法值", dataIndex: "MAXSP", key: "MAXSP", sorter: true },
        {
          title: "抗封印(%)",
          dataIndex: "ANTISEAL",
          key: "ANTISEAL",
          sorter: true,
        },
        {
          title: "操作",
          dataIndex: "operation",
          fixed: "right",
          slots: { customRender: "operation" },
          width: 196,
        },
      ].map((t) => ({ width: 140, ...t })),
      scroll: { x: 1084, y: document.body.offsetHeight - 260 },
    };
  },
  created() {
    window.api.getAllMaterial().then(({ data }) => {
      this.material = data.map((t) => t.material) as string[];
    });
    window.windowChange = () => {
      this.scroll.y = document.body.offsetHeight - 260;
    };
  },
  data() {
    return {
      form: {
        name: "",
        level: "",
        grade: "",
        material: "",
        canMade: "是",
      },
      material: [] as string[],
      source: [] as any[],
      order: {
        orderBy: "level",
        sort: "DESC",
      },
      pagination: {
        total: 0,
        current: 0,
        pageSize: 10,
      },
    };
  },
  methods: {
    search(page = 1) {
      this.pagination.current = page;
      const query = new URLSearchParams(this.order);
      query.append("page", page.toString());
      const { name, level, grade, material, canMade } = this.form;
      if (name) {
        query.append("name", name);
      }
      if (level) {
        query.append("level", level);
      }
      if (grade) {
        query.append("grade", grade);
      }
      if (material) {
        query.append("material", material);
      }
      if (canMade) {
        query.append("canMade", canMade);
      }
      window.api.queryAll(query.toString()).then(({ count, data }) => {
        this.source = data;
        this.pagination.total = count;
      });
    },
    handleTableChanged(page: any, filters: TableStateFilters, sort: any) {
      if (sort && sort.order) {
        this.order.orderBy = sort.field;
        this.order.sort = sort.order === "ascend" ? "asc" : "desc";
      } else {
        this.order.orderBy = "level";
        this.order.sort = "DESC";
      }
      this.search(page.current);
    },
  },
});
</script>
