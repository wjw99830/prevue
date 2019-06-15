<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator'
import { CreateElement, VNode, VNodeChildren } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { Message } from 'element-ui';
import { genTag } from '@/utils';
import { components, IComponent } from './components';
let cid = 0;
@Component
export default class App extends Vue {
  value='';
  selectedComponent: IComponent | null = null;
  focusedComponent: IComponent | null = null;
  renderTree: IComponent = {
    name: '页面容器',
    tag: 'div',
    kv: {},
    children: [],
    cid: cid++,
  };
  created() {
    this.focusedComponent = this.renderTree;
    document.addEventListener('keydown', ({ key }) => {
      if (key === 'Delete' && this.focusedComponent && this.focusedComponent.parent) {
        const parent = this.focusedComponent.parent;
        parent.children.splice(parent.children.indexOf(this.focusedComponent), 1);
        this.focusedComponent = null;
      }
    })
  }
  render (h: CreateElement) {
    return (
      <div id="app" class="flex">
        <div id="menubar">
          <el-form label-width="80px">
            <h1>增加子元素</h1>
            <el-form-item label="组件: ">
              <el-select v-model={this.value} onChange={(e: any) => {
                  this.selectedComponent = clone(e);
                  this.selectedComponent!.cid = cid++;
                }} value-key="name" placeholder="请选择">
                { components.map((comp) => <el-option key={comp.name} label={comp.name} value={comp}></el-option>) }
              </el-select>
            </el-form-item>
            { this.selectedComponent && this.selectedComponent.kv.attrs && <h2>Attrs</h2> }
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
            { this.selectedComponent && this.selectedComponent.kv.props && <h2>Props</h2> }
            { this.selectedComponent && this.selectedComponent.kv.props && this.selectedComponent.kv.props.map(prop => (
              <el-form-item label={`${prop.name}: `}>
                {
                  prop.options ? 
                    <el-select v-model={prop.value} multiple={!!prop.multiple} placeholder="请选择">
                      { prop.options.map(option => <el-option key={option.name} label={option.name} value={option.value}></el-option>) }
                    </el-select>
                    :
                    <el-input v-model={prop.value} placeholder="请输入"></el-input>
                }
              </el-form-item>
            )) }
            <el-button type="success" onClick={() => {
              if (this.selectedComponent && this.focusedComponent) {
                this.selectedComponent.parent = this.focusedComponent;
                this.focusedComponent.children.push(this.selectedComponent);
                if (this.selectedComponent.name.includes('容器')) {
                  this.focusedComponent = this.selectedComponent;
                }
              } else {
                Message.warning('请选择组件');
              }
              console.log(genTag(this.renderTree));
              this.selectedComponent = null;
              this.value = '';
            }}>确定</el-button>
          </el-form>
          <el-form label-width="80px">
            <h1>修改焦点元素</h1>
            { this.focusedComponent && this.focusedComponent.text !== undefined &&
              <el-form-item label="文本: ">
                <el-input v-model={this.focusedComponent.text} placeholder="请输入文本"></el-input>
              </el-form-item>
            }
            { this.focusedComponent && this.focusedComponent.kv.attrs && <h2>Attrs</h2> }
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
            { this.focusedComponent && this.focusedComponent.kv.props && <h2>Props</h2> }
            { this.focusedComponent && this.focusedComponent.kv.props && this.focusedComponent.kv.props.map(prop => (
              <el-form-item label={`${prop.name}: `}>
                {
                  prop.options ? 
                    <el-select v-model={prop.value} multiple={!!prop.multiple} placeholder="请选择">
                      { prop.options.map(option => <el-option key={option.name} label={option.name} value={option.value}></el-option>) }
                    </el-select>
                    :
                    <el-input v-model={prop.value} placeholder="请输入"></el-input>
                }
              </el-form-item>
            )) }
          </el-form>
        </div>
        <div id="render-area">
          { genNode.call(this, h, this.renderTree) }
        </div>
      </div>
    )
  }
}

// todo rewrite
function clone (obj: any) {
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
  const focusClass = this.focusedComponent && this.focusedComponent.cid === meta!.cid ? 'focus' : '';
  const vnode: VNode = h(meta.tag, {
    props: { ...props, value: '' },
    attrs: { ...attrs, id: meta.cid && meta.cid.toString() },
    class: attrs.class ? attrs.class.concat([focusClass]) : focusClass,
    style: {
      padding: '5px',
    },
    nativeOn: {
      click: (e: MouseEvent) => {
        for (const target of e.composedPath()) {
          const elm = target as HTMLElement;
          const cid = meta.cid === undefined ? -1 : 0;
          if (elm.id === cid.toString()) {
            this.focusedComponent = meta;
            continue;
          }
        }
        e.stopPropagation();
      },
    },
    ...(meta.tag.startsWith('el') ? {
      nativeOn: {
        click: (e: MouseEvent) => {
          for (const target of e.composedPath()) {
            const elm = target as HTMLElement;
            const cid = meta.cid === undefined ? -1 : 0;
            if (elm.id === cid.toString()) {
              this.focusedComponent = meta;
              continue;
            }
          }
          e.stopPropagation();
        },
      },
    } : {
      on: {
        click: (e: MouseEvent) => {
          for (const target of e.composedPath()) {
            const elm = target as HTMLElement;
            const cid = meta.cid === undefined ? -1 : 0;
            if (elm.id === cid.toString()) {
              this.focusedComponent = meta;
              continue;
            }
          }
          e.stopPropagation();
        },
      },
    })
  }, [meta.text, ...meta.children.map(child => genNode.call(this, h, child))]);
  if (meta.tag === 'el-form')
    console.log(vnode)
  return vnode;
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
    width: 330px;
    background-color: #faf3f7;
    padding: 10px;
    color: #333;
    h1 {
      text-align: center;
      margin-bottom: 22px;
      font-size: 1.5rem;
    }
    h2 {
      text-align: center;
      margin-bottom: 22px;
      font-size: 1.1rem;
    }
  }
  #render-area {
    width: calc(100% - 330px);
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
  &:not(#app) {
    background-color: #eee;
  }
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
</style>
