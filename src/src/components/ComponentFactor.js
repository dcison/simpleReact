import TextComponent from './TextComponent';
import DomComponent from './DomComponent';
import CompositeComponent from './CompositeComponent';

export function initComponent(node) {
  if (typeof node === 'string' || typeof node === 'number'){
    return new TextComponent(node);
  }

  if (typeof node === 'object' && typeof node.type === 'string'){
    return new DomComponent(node);
  }


  if (typeof node === 'object' && typeof node.type === 'function') {
    return new CompositeComponent(node);
  }

}

export function judgeUpdateReactComponent(prev,next) {
  if (!prev || !next) return;
  const prevType = typeof prev;
  const nextType = typeof next;
  if (prevType === "string" || prevType === "number"){
    return nextType === "string" || nextType === "number"
  }else{
    return nextType === 'object' && prev.type === next.type && prev.key === next.key;
  }
}