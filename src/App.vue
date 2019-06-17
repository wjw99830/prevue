<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator'
import { CreateElement, VNode, VNodeChildren } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { Message } from 'element-ui';
import { genTag, genPath, genVueCode } from '@/utils';
import { components, IComponent, ComponentName } from './components';
import { EChartOption } from 'echarts';
let cid = 0;
@Component
export default class App extends Vue {
  value='';
  previewDialog = false;
  previewCode = '';
  fileName = '';
  hoverComponent: IComponent | null = null;
  selectedComponent: IComponent | null = null;
  focusedComponent: IComponent | null = null;
  renderTree: IComponent = { ...clone(components[0]), cid: cid++ };
  created() {
    this.focusedComponent = this.renderTree;
    document.addEventListener('keydown', ({ key }) => {
      if (key === 'Delete' && this.focusedComponent && this.focusedComponent.parent) {
        const parent = this.focusedComponent.parent;
        parent.children!.splice(parent.children!.indexOf(this.focusedComponent), 1);
        this.focusedComponent = null;
      }
    })
  }
  save() {
    localStorage.setItem('latest-render-tree', JSON.stringify(this.renderTree));
  }
  append() {
    if (this.selectedComponent && this.focusedComponent && this.focusedComponent.children !== undefined) {
      this.selectedComponent.parent = this.focusedComponent;
      this.selectedComponent.path = genPath(this.selectedComponent);
      this.focusedComponent.children.push(this.selectedComponent);
      Message.success(`组件【${this.selectedComponent.name}】添加成功`);
      if (this.selectedComponent.children) {
        this.focusedComponent = this.selectedComponent;
      }
      if (
        this.selectedComponent.name === ComponentName.table ||
        this.focusedComponent.name === ComponentName.form ||
        this.selectedComponent.name === ComponentName.select
      ) {
        this.clearSelect();
      } else if (this.focusedComponent.name === ComponentName.formItem && (this.focusedComponent.children!.length > 0 || this.focusedComponent.text)) {
        this.focusedComponent = this.focusedComponent.parent!;
        this.selectedComponent = clone({ ...this.selectedComponent, parent: undefined, children: this.selectedComponent.children ? [] : undefined, path: undefined });
        this.selectedComponent.cid = cid++;
      } else {
        this.selectedComponent = clone({ ...this.selectedComponent, parent: undefined, children: this.selectedComponent.children ? [] : undefined, path: undefined });
        this.selectedComponent.cid = cid++;
      }
    } else if (this.focusedComponent && !this.focusedComponent.children) {
      Message.warning(`【${this.focusedComponent.name}】不允许添加子元素`);
    } else if (!this.selectedComponent) {
      Message.warning('请选择组件');
    } else if (!this.focusedComponent) {
      Message.warning('请选择焦点组件');
    }
  }
  clearSelect() {
    this.selectedComponent = null;
    this.value = '';
  }
  preview() {
    const code = genTag(this.renderTree);
    this.previewCode = code;
    this.previewDialog = true;
  }
  render (h: CreateElement) {
    return (
      <div id="app" class="flex">
        <power-scrollbar style="width: 330px">
          <div id="menubar">
            <div class="flex center between">
              <el-input style="width: 210px" v-model={this.fileName} placeholder="组件名字 (单词之间用-分隔)" nativeOn={{
                keydown: (e: KeyboardEvent) => {
                  e.key === 'Enter' && this.preview()
                }
              }}></el-input>
              <el-button type="primary" onClick={this.preview.bind(this)}>预览</el-button>
            </div>
            <el-form label-width="120px" label-position="left" nativeOn={{
                keydown: (e: KeyboardEvent) => {
                  e.key === 'Enter' && this.append()
                }
              }}>
              <h1>增加子元素</h1>
              <el-form-item label="组件：">
                <el-select v-model={this.value} onChange={(e: IComponent) => {
                    this.selectedComponent = clone(e);
                    this.selectedComponent.cid = cid++;
                  }} value-key="name" placeholder="请选择">
                  { components.filter(comp => {
                    if (this.focusedComponent) {
                      if (this.focusedComponent.name === ComponentName.table) {
                        const flag = comp.name === ComponentName.tableColumn;
                        // 当前的焦点组件是table但选择器中的组件不是table-column时，清空选择器
                        if (flag && this.selectedComponent && this.selectedComponent.name !== ComponentName.tableColumn) {
                          this.clearSelect();
                        }
                        // 当焦点组件是table时，仅供选择table-column
                        return flag;
                      } else if (this.focusedComponent.name === ComponentName.form) {
                        const flag = comp.name === ComponentName.formItem;
                        // 当前的焦点组件是form但选择器中的组件不是form-item时，清空选择器
                        if (flag && this.selectedComponent && this.selectedComponent.name !== ComponentName.formItem) {
                          this.clearSelect();
                        }
                        // 当焦点组件是form时，仅供选择form-item
                        return flag;
                      } else if (this.focusedComponent.name === ComponentName.select) {
                        const flag = comp.name === ComponentName.option;
                        // 当前的焦点组件是select但选择器中的组件不是option时，清空选择器
                        if (flag && this.selectedComponent && this.selectedComponent.name !== ComponentName.option) {
                          this.clearSelect();
                        }
                        // 当焦点组件是select时，仅供选择option
                        return flag;
                      } else if (
                        // 当选择的组件不是form时，不允许选择form-item，下2同理
                        this.focusedComponent.name !== ComponentName.form && comp.name === ComponentName.formItem ||
                        this.focusedComponent.name !== ComponentName.table && comp.name === ComponentName.tableColumn ||
                        this.focusedComponent.name !== ComponentName.select && comp.name === ComponentName.option
                      ) {
                        return false;
                      }
                    }
                    return true;
                  }).map((comp) => <el-option key={comp.name} label={comp.name} value={comp}></el-option>) }
                </el-select>
              </el-form-item>
              { this.selectedComponent && typeof this.selectedComponent.text !== 'undefined' &&
                <el-form-item label="文本">
                  <el-input v-model={this.selectedComponent.text} placeholder="请输入文本"></el-input>
                </el-form-item>
              }
              { this.selectedComponent && this.selectedComponent.kv.attrs && this.selectedComponent.kv.attrs.map(attr => (
                <el-form-item label={`${attr.name}: `}>
                  {
                    attr.options ? 
                      <el-select v-model={attr.value} multiple={!!attr.multiple} placeholder="请选择">
                        { attr.options.map(option => <el-option key={option.name} label={option.name} value={option.value} disabled={option.disabled}></el-option>) }
                      </el-select>
                      :
                      <el-input v-model={attr.value} placeholder="请输入"></el-input>
                  }
                </el-form-item>
              )) }
              { this.selectedComponent && this.selectedComponent.kv.props && this.selectedComponent.kv.props.map(prop => (
                <el-form-item label={`${prop.name}: `}>
                  {
                    prop.options ?
                      <el-select v-model={prop.value} multiple={!!prop.multiple} placeholder="请选择">
                        { prop.options.map(option => <el-option key={option.name} label={option.name} value={option.value}></el-option>) }
                      </el-select>
                      :
                      typeof prop.value === 'boolean' ?
                        <el-switch v-model={prop.value}>{prop.name}</el-switch>
                        :
                        <el-input v-model={prop.value} placeholder="请输入"></el-input>
                  }
                </el-form-item>
              )) }
              <div class="flex center end">
                <el-button type="success" onClick={this.append.bind(this)}>确定</el-button>
              </div>
            </el-form>
            <el-form label-width="120px" label-position="left">
              <h1 class="flex center between"><span>修改焦点元素</span>{ this.focusedComponent && this.focusedComponent.parent && <el-button type="primary" onClick={() => {
                if (this.focusedComponent && this.focusedComponent.parent) {
                  this.focusedComponent = this.focusedComponent.parent
                }
              }}>聚焦父容器</el-button> }</h1>
              { this.focusedComponent &&
                <el-form-item label="路径：">
                  { this.focusedComponent.path && this.focusedComponent.path.map((comp, index) => <span class="path" onMouseenter={() => this.hoverComponent = comp} onMouseleave={() => this.hoverComponent = null} onClick={() => this.focusedComponent = comp}>{index === 0 ? '' : '>'} {comp.name}</span>) }
                  { this.focusedComponent.path && <span class="path" onMouseenter={() => this.hoverComponent = this.focusedComponent} onMouseleave={() => this.hoverComponent = null}> {this.focusedComponent.path.length > 0 ? '>' : ''} {this.focusedComponent.name}</span> }
                </el-form-item>
              }
              { this.focusedComponent && <el-form-item label="组件名称：">{this.focusedComponent.name}</el-form-item> }
              { this.focusedComponent && this.focusedComponent.text !== undefined &&
                <el-form-item label="文本：">
                  <el-input v-model={this.focusedComponent.text} placeholder="请输入文本"></el-input>
                </el-form-item>
              }
              { this.focusedComponent && this.focusedComponent.kv.attrs && this.focusedComponent.kv.attrs.map(attr => {
                return <el-form-item label={`${attr.name}: `}>
                  {
                    attr.options ?
                      <el-select v-model={attr.value} multiple={!!attr.multiple} placeholder="请选择">
                        { attr.options.map(option => {
                            return <el-option key={option.name} label={option.name} value={option.value} disabled={option.disabled}></el-option>
                          }) }
                      </el-select>
                      :
                      <el-input v-model={attr.value} placeholder="请输入"></el-input>
                  }
                </el-form-item>
              }) }
              { this.focusedComponent && this.focusedComponent.kv.props && this.focusedComponent.kv.props.map(prop => (
                <el-form-item label={`${prop.name}: `}>
                  {
                    prop.options ? 
                      <el-select v-model={prop.value} multiple={!!prop.multiple} placeholder="请选择">
                        { prop.options.map(option => <el-option key={option.name} label={option.name} value={option.value}></el-option>) }
                      </el-select>
                      :
                      typeof prop.value === 'boolean' ?
                        <el-switch v-model={prop.value}>{prop.name}</el-switch>
                        :
                        <el-input v-model={prop.value} placeholder="请输入"></el-input>
                  }
                </el-form-item>
              )) }
            </el-form>
          </div>
        </power-scrollbar>
        <div id="render-area">
          { genNode.call(this, h, this.renderTree) }
        </div>
        <el-dialog visible={this.previewDialog} on={{ 'update:visible': (e: boolean) => this.previewDialog = e }}>
          <power-scrollbar style="height: 50vh;">
            <pre class="code">{genVueCode(this.previewCode, this.fileName, this.renderTree)}</pre>
          </power-scrollbar>
        </el-dialog>
      </div>
    )
  }
}

// todo rewrite
function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
type KeyValue = Record<string, any>;
function genNode (this: App, h: CreateElement, meta: IComponent) {
  const props: KeyValue = {};
  const attrs: KeyValue = {};
  if (meta.kv.props) {
    for (const prop of meta.kv.props) {
      props[prop.key] = prop.value;
    }
  }
  if (meta.kv.attrs) {
    for (const attr of meta.kv.attrs) {
      attrs[attr.key] = attr.value;
    }
  }
  if (meta.name === ComponentName.chart) {
    props.options = {
      title: {
        text: 'Example',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      },
      yAxis: {},
      series: [{
        name: 'Example',
        type: 'line',
        data: new Array(9).fill(0).map(() => Math.random() * 100),
      }],
    } as EChartOption;
  }
  const classList = attrs.class;
  const styleStr = attrs.style || '';
  delete attrs.class;
  delete attrs.style;
  const focusClass = this.focusedComponent && this.focusedComponent.cid === meta!.cid ? 'focus' : '';
  const focusClick = (e: MouseEvent) => {
    for (const target of e.composedPath()) {
      const elm = target as HTMLElement;
      const cid = meta.cid === undefined ? -1 : 0;
      if (elm.classList && elm.classList.item(elm.classList.length - 1) === `id-${cid}`) {
        this.focusedComponent = meta;
        continue;
      }
    }
    e.stopPropagation();
  };
  const vnode: VNode = h(meta.tag, {
    props: { ...props, ...(props.value ? {} : { value: '' }) },
    attrs: { ...attrs },
    class: classList ? classList.concat([focusClass, `id-${meta.cid}`]) : [focusClass, `id-${meta.cid}`],
    style: { ...parseStyle(styleStr), minHeight: '40px' },
    ...({ [meta.tag.includes('-') ? 'nativeOn' : 'on']: { click: focusClick } }),
  }, [
    meta.text,
    ...(meta.children ? meta.children.map(child => genNode.call(this, h, child)) : []),
  ]);
  const el = document.querySelector(`.id-${meta.cid}`);
  if (el) {
    if (this.hoverComponent === meta) {
      const overlay = document.createElement('div');
      overlay.classList.add('overlay', 'flex', 'center');
      overlay.textContent = meta.name;
      el.appendChild(overlay);
    } else {
      const children = el.children;
      for (const child of children) {
        if (child.classList.contains('overlay')) {
          child.remove();
        }
      }
    }
  }
  return vnode;
}
function parseStyle(str: string) {
  const properties = str.split(';');
  const style: Record<string, string> = {};
  for (const prop of properties) {
    const [key, value] = prop.split(':').map(item => item.trim());
    style[key] = value;
  }
  return style;
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
  #menubar {
    background-color: #faf3f7;
    padding: 10px;
    padding-right: 27px;
    color: #333;
    h1 {
      padding: 11px 0;
      margin: 11px 0;
      font-size: 1.5rem;
      border-bottom: 1px solid #ddd;
    }
    h2 {
      padding-bottom: 11px;
      margin-bottom: 11px;
      font-size: 1.1rem;
      border-bottom: 1px solid #ddd;
    }
  }
  #render-area {
    width: calc(100% - 330px);
    *[class*=id-] {
      position: relative;
    }
  }
}
</style>
<style lang="less">
* {
  margin: 0;
  padding: 0;
  outline: none;
  box-sizing: border-box;
}
.flex {
  display: flex;
  &.center {
    align-items: center;
    justify-content: center;
  }
  &.around {
    justify-content: space-around;
  }
  &.between {
    justify-content: space-between;
  }
  &.start {
    justify-content: flex-start;
  }
  &.end {
    justify-content: flex-end;
  }
  &.column {
    flex-direction: column;
  }
  &.wrap {
    flex-wrap: wrap;
  }
  &.align-center{
    align-items:center;
  }
  &.little-space {
    > * {
      margin: 5px;
    }
  }
}
.focus {
  border: 2px solid #0ae!important;
}
.overlay {
  position: absolute!important;
  z-index: 2;
  background-color: rgba(109, 195, 252, 0.801);
  color: #fff;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
}
.code {
  padding: 20px 10px;
  padding-right: 27px;
  font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace;
  color: #333;
}
.path {
  color: #0ae;
  cursor: pointer;
  transition: all .3s;
  border-radius: 5px;
  padding: 2px 7px;
  &:hover {
    background-color: #3cf;
    color: #fff;
  }
}
label.el-form-item__label {
  font-size: 1rem;
  font-weight: 600;
  color: slategray;
}
</style>
