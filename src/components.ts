export interface IField {
  name: string;
  key: string;
  value: any;
  options?: { name: string; value: string, disabled?: boolean }[];
  multiple?: boolean;
}
export interface IComponent {
  children: IComponent[];
  name: string;
  tag: string;
  kv: {
    attrs?: IField[];
    props?: IField[];
  };
  text?: string;
  cid?: number;
  parent?: IComponent;
}
export const components: IComponent[] = [{
  name: '通用容器',
  tag: 'div',
  text: '',
  kv: {
    attrs: [{
      name: '样式',
      key: 'class',
      value: ['flex'],
      options: [
        { name: 'Flex盒模型', value: 'flex', disabled: true },
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
  name: '表单容器',
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
    }, {
      name: '标签对齐方式',
      key: 'label-position',
      value: 'right',
    }],
  },
}, {
  name: '表单项容器',
  tag: 'el-form-item',
  children: [],
  kv: {
    props: [{
      name: '标签',
      key: 'label',
      value: '',
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
      options: [
        { name: '默认', value: '' },
        { name: '基本', value: 'primary' },
        { name: '警告', value: 'warning' },
        { name: '错误', value: 'danger' },
        { name: '成功', value: 'success' },
      ],
    }],
  },
  children: [],
}, {
  name: '输入框',
  tag: 'el-input',
  kv: {
    props: [{
      name: '占位符(输入为空时显示的文字)',
      key: 'placeholder',
      value: '请输入占位符',
    }],
    attrs: [{
      name: 'css样式',
      key: 'style',
      value: 'width: 100px',
    }]
  },
  children: [],
}, {
  name: '开关',
  tag: 'el-switch',
  children: [],
  kv: {
    props: [{
      name: '关闭时的文字',
      key: 'inactive-text',
      value: '关',
    }, {
      name: '开启时的文字',
      key: 'active-text',
      value: '开',
    }],
  },
}];
