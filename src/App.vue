<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

@Component({
  components: {
    HelloWorld
  }
})
export default class App extends Vue {
  selectedComponent: any = null;
  value=''
  render (h: CreateElement) {
    const components = [{
      name: '容器',
      tag: 'div',
      text: '',
      kv: {
        attrs: {
          class: 'flex'
        },
      },
      children: [{
        tag: 'span',
        kv: {},
        children: []
      }]
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
            { name: '基本', value: '' },
            { name: '默认', value: '' },
            { name: '默认', value: '' },
            { name: '默认', value: '' },
          ]
        }]
      },
      children: []
    }]
    return (
      <div id="app" class="flex">
        <div id="toolbar">
          <el-form label-width="50px">
            <el-form-item label="组件: ">
              <el-select v-model={this.value} onChange={(e: any) => this.selectedComponent = clone(e)} value-key="name" placeholder="请选择">
                { components.map((comp) => <el-option key={comp.name} label={comp.name} value={comp}></el-option>) }
              </el-select>
            </el-form-item>
            { this.selectedComponent && this.selectedComponent.kv.attrs && <h2>Attrs</h2> }
            { this.selectedComponent && this.selectedComponent.kv.attrs && Object.entries(this.selectedComponent.kv.attrs).map(([k, v]) => (
              <el-form-item label={`${k}: `}>
                <el-input v-model={this.selectedComponent.kv.attrs[k]} placeholder="请输入"></el-input>
              </el-form-item>
            )) }
            { this.selectedComponent && this.selectedComponent.kv.props && <h2>Props</h2> }
            { this.selectedComponent && this.selectedComponent.kv.props && Object.entries(this.selectedComponent.kv.props).map(([k, v]) => (
              <el-form-item label={`${k}: `}>
                <el-input v-model={this.selectedComponent.kv.props[k]} placeholder="请输入"></el-input>
              </el-form-item>
            )) }
          </el-form>
        </div>
        <div id="render-area">
          { this.selectedComponent && genNode(h, this.selectedComponent) }
        </div>
      </div>
    )
  }
}

// todo rewrite
function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj))
}
function genNode (h: CreateElement, meta: any) {
  return (
    <meta.tag {...meta.kv}>
      { meta.text || meta.children.map((child: any) => genNode(h, child)) }
    </meta.tag>
  )
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
  #toolbar {
    width: 330px;
    background-color: #faf3f7;
    padding: 10px;
    color: #333;
    h2 {
      text-align: center;
      margin-bottom: 22px;
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
</style>
