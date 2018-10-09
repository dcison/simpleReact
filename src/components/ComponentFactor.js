import TextComponent from './TextComponent';
import DomComponent from './DomComponent';


export function initComponent(node) {
  if (typeof node === 'string' || typeof node === 'number'){
    return new TextComponent(node);
  }

  if (typeof node === 'object' && typeof node.type === 'string'){
    return new DomComponent(node);
  }

}