import { IComponent } from '@/components';
export function genTag(comp: IComponent, indent = 0) {
  let tag = `${' '.repeat(indent)}<${comp.tag}`;
  if (comp.kv.attrs) {
    for (const attr of comp.kv.attrs) {
      if (attr.value === attr.default || Array.isArray(attr.value) && attr.value.join('') === '') {
        continue;
      }
      tag += ` ${attr.key}="${typeof attr.value === 'string' ? attr.value : attr.value.join(' ')}"`;
    }
  }
  if (comp.kv.props) {
    for (const prop of comp.kv.props) {
      if (prop.value === prop.default || Array.isArray(prop.value) && prop.value.join('') === '') {
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
  if (comp.children && comp.children) {
    tag += '>';
    if (comp.children.length > 0) {
      tag += '\n';
    }
    if (comp.text) {
      tag += comp.children.length > 0 ? `${' '.repeat(indent + 2)}${comp.text}\n` : `${comp.text}`;
    }
    for (const child of comp.children) {
      tag += genTag(child, indent + 2);
    }
    if (comp.children.length > 0) {
      tag += ' '.repeat(indent);
    }
    tag += `</${comp.tag}>`;
  } else if (!comp.children && comp.text !== undefined) {
    tag += `>${comp.text}</${comp.tag}>`;
  } else {
    tag += ' />';
  }
  tag += '\n'
  return tag;
}
export function genPath(comp: IComponent): IComponent[] {
  const parent = comp.parent;
  if (parent) {
    return [...genPath(parent), parent];
  } else {
    return [];
  }
}
