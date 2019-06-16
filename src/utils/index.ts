import { IComponent, IField } from '@/components';
export function genTag(comp: IComponent, indent = 2) {
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
    if (comp.tag === 'el-option') {
      console.log(comp);
    }
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
export function genVueCode(
  templateCode: string, 
  fileName: string,
  renderTree: IComponent,
) {
  const pascal = fileName.split('-').map(word => {
    if (!word) {
      return '';
    }
    const firstLetter = word[0].toUpperCase();
    return firstLetter + word.slice(1);
  }).join('');
  const directiveProps = filter(renderTree, (prop) => prop.key.startsWith('v-') && prop.value);
  const existingFields: string[] = [];
  const valueMap: Record<string, string> = {
    string: `''`,
    boolean: 'false',
    array: '[]',
  };
  const fields = directiveProps.map(prop => {
    if (existingFields.includes(prop.value)) {
      return '';
    }
    existingFields.push(prop.value);
    return `  ${prop.value} = ${valueMap[String(prop.valueType)] || 'null'};`;
  }).filter(str => str).join('\n');
  return `<template>
${templateCode}</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({
  name: '${fileName || 'preview-component'}',
})
export default class ${pascal || 'PreviewComponent'} extends Vue {
${fields}
}
</script>
<style lang="scss">

</style>
`;
}
export function filter(tree: IComponent, fn: (value: IField, index: number) => boolean): IField[] {
  let out: IField[] = [];
  if (tree.kv.props) {
    out = tree.kv.props.filter(fn);
  }
  return [...out, ...(tree.children ? tree.children.map(child => filter(child, fn)).flat() : [])];
}
