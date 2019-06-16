export interface IField {
  name: string;
  key: string;
  value: any;
  options?: { name: string; value: string, disabled?: boolean }[];
  multiple?: boolean;
  dynamic?: boolean;
  default?: any;
}
export interface IComponent {
  name: string;
  tag: string;
  kv: {
    attrs?: IField[];
    props?: IField[];
  };
  children?: IComponent[];
  text?: string;
  cid?: number;
  parent?: IComponent;
  path?: Array<{
    label: string;
    component: IComponent;
  }>;
}
export const components: IComponent[] = [{
  name: '通用 (容器)',
  tag: 'div',
  kv: {
    attrs: [{
      name: '样式',
      key: 'class',
      value: [],
      options: [
        { name: 'Flex盒模型', value: 'flex' },
        { name: '垂直水平居中', value: 'center' },
        { name: '水平正排', value: 'start' },
        { name: '水平倒排', value: 'end' },
        { name: '水平均分空格(两边留空)', value: 'around' },
        { name: '水平均分空格(两边不留空)', value: 'between' },
        { name: '交换垂直和水平方向', value: 'column' },
        { name: '内容超出时换行', value: 'wrap' },
        { name: '为子元素设置5px的外边距', value: 'little-space' },
      ],
      multiple: true,
    }],
  },
  children: [],
}, {
  name: '表单 (容器)',
  tag: 'el-form',
  children: [],
  kv: {
    attrs: [{
      name: '样式',
      key: 'class',
      value: [],
      options: [
        { name: 'Flex盒模型', value: 'flex' },
        { name: '垂直水平居中', value: 'center' },
        { name: '水平正排', value: 'start' },
        { name: '水平倒排', value: 'end' },
        { name: '水平均分空格(两边留空)', value: 'around' },
        { name: '水平均分空格(两边不留空)', value: 'between' },
        { name: '交换垂直和水平方向', value: 'column' },
        { name: '内容超出时换行', value: 'wrap' },
        { name: '为子元素设置5px的外边距', value: 'little-space' },
      ],
      multiple: true,
    }],
    props: [{
      name: '标签宽度',
      key: 'label-width',
      value: '50px',
      default: '',
    }, {
      name: '标签对齐方式',
      key: 'label-position',
      value: 'right',
      default: '',
    }],
  },
}, {
  name: '表单项 (容器)',
  tag: 'el-form-item',
  text: '',
  children: [],
  kv: {
    props: [{
      name: '标签',
      key: 'label',
      value: '',
      default: '',
    }],
  },
}, {
  name: '按钮',
  tag: 'el-button',
  text: '按钮',
  kv: {
    props: [{
      name: '类型',
      key: 'type',
      value: 'primary',
      default: '',
      options: [
        { name: '默认', value: '' },
        { name: '基本', value: 'primary' },
        { name: '警告', value: 'warning' },
        { name: '错误', value: 'danger' },
        { name: '成功', value: 'success' },
      ],
    }, {
      name: '尺寸',
      key: 'size',
      value: '',
      default: '',
      options: [
        { name: '默认', value: '' },
        { name: '中等', value: 'medium' },
        { name: '较小', value: 'small' },
        { name: '最小', value: 'mini' },
      ],
    }, {
      name: '圆角',
      key: 'round',
      value: false,
      default: false,
    }, {
      name: '圆形',
      key: 'circle',
      value: false,
      default: false,
    }, {
      name: '图标',
      key: 'icon',
      value: '',
      default: '',
    }],
  },
}, {
  name: '输入框',
  tag: 'el-input',
  kv: {
    props: [],
    attrs: [{
      name: 'css样式',
      key: 'style',
      value: 'width: 100px',
      default: '',
    }, {
      name: '占位符',
      key: 'placeholder',
      value: '请输入',
      default: '',
    }]
  },
}, {
  name: '开关',
  tag: 'el-switch',
  kv: {
    props: [{
      name: '关闭时的文字',
      key: 'inactive-text',
      value: '关',
      default: '',
    }, {
      name: '开启时的文字',
      key: 'active-text',
      value: '开',
      default: '',
    }],
  },
}, {
  name: '表格 (容器)',
  tag: 'el-table',
  children: [],
  kv: {
    props: [{
      name: '斑马纹',
      key: 'stripe',
      value: false,
      default: false,
    }],
  },
}, {
  name: '表格列',
  tag: 'el-table-column',
  kv: {
    props: [{
      name: '列名',
      key: 'label',
      value: '',
    }, {
      name: '对齐方式',
      key: 'align',
      value: '',
      default: '',
      options: [
        { name: '居中', value: 'center' },
        { name: '左对齐', value: 'left' },
        { name: '右对齐', value: 'right' },
      ],
    }],
  }
}, {
  name: '选择器',
  tag: 'el-select',
  children: [{
    name: '选项',
    children: [],
    tag: 'el-option',
    kv: {
      props: [{
        name: '选项标签',
        key: 'label',
        value: `'选项1'`,
        dynamic: true,
      }, {
        name: '选项值',
        key: 'value',
        value: '',
        dynamic: true,
      }],
    },
  }],
  kv: {
    attrs: [{
      name: '占位符',
      key: 'placeholder',
      value: '请选择',
      default: '',
    }],
  },
}, {
  name: '多选框',
  tag: 'el-checkbox',
  text: '',
  kv: {},
}, {
  name: '单选框',
  tag: 'el-radio',
  text: '',
  kv: {},
}];
