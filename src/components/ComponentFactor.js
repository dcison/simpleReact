import TextComponent from './TextComponent';

export function initComponent(node) {
  if (typeof node === 'string' || typeof node === 'number'){
    return new TextComponent(node);
  }
}