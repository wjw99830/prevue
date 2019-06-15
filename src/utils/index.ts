import { IComponent } from '@/components';
export function genTag(comp: IComponent, indent = 0) {
  let tag = `${' '.repeat(indent)}<${comp.tag}`;
  if (comp.kv.attrs) {
    for (const attr of comp.kv.attrs) {
      tag += ` ${attr.key}="${typeof attr.value === 'string' ? attr.value : attr.value.join(' ')}"`;
    }
  }
  if (comp.kv.props) {
    for (const prop of comp.kv.props) {
      if (prop.value === prop.default) {
        continue;
      }
      tag += typeof prop.value === 'boolean' ?
        prop.value ? ` ${prop.key}` : ` :${prop.key}="false"`
        :
        prop.dynamic ?
          ` :${prop.key}="${prop.value}"`
          :
          ` ${prop.key}="${prop.value}"`;
    }
  }
  tag += '>';
  if (comp.children.length > 0) {
    tag += '\n';
    for (const child of comp.children) {
      tag += genTag(child, indent + 2);
    }
    tag += ' '.repeat(indent);
  }
  tag += `</${comp.tag}>\n`;
  return tag;
}
