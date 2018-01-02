const parseStringToJSX = (codeStr) => {
  // inner helpers
  const reverseString = str => str.split('').reverse().join('');

  // logic code

  const reactTree = [];

  function parseTag(elem) {
  
    if (!elem.includes('<')) {
      elem = elem.trim();
      
      // if elem is not empty after trimmed, it must be a text node
      if (elem !== '') {
        reactTree.push({ textNode: elem });
      }

      return elem;
    }

    // init flag variables
    let isSingleTag = false;
    let openTag = '';

    let isEvalOpenTag = false;
    let isOpenTagDone = false;
    
    let endTag = '';
    let isEvalEndTag = false;
    let isEndTagDone = false;
        
    // iterate the stringified elem to get the open tag
    let prevEl = '';
    for(let el of elem) {
      if (!isOpenTagDone){
        if (el === '<') {
          isEvalOpenTag = true;
        }
        
        if(el === '>') {
          // there are two possibilities. if / is found before >, then it is a single tag!
          if(prevEl === '/') {
            endTag = reverseString(openTag);
            isEvalOpenTag = false;
            isOpenTagDone = true;
            isEndTagDone = true;
            isSingleTag = true;
          }
          
          if(prevEl !== '/') {
            isEvalOpenTag = false;
            isOpenTagDone = true; 
          }
        }
        
        if(el !== '<' && el !== '>') {
          if(isEvalOpenTag) {
            openTag += el;
          } 
        }
      }
      
      if(isOpenTagDone) {
        break;
      }
      
      // store current el character to prevEl for later comparison
      prevEl = el;
    }
    
    openTag = openTag.trim();
    
    // remove the open tag from the rest of the elem
    elem = elem.replace(`<${openTag}>`, '');
    
    // iterate the stringified elem from behind to get the closing tag
    let elemRev = reverseString(elem);
    
    for(let el of elemRev) {
      if(isEndTagDone) {
        break;
      }

      if(el === '>') {
        isEvalEndTag = true;
      }
      
      if(el === '/') {
        isEvalEndTag = false;
        isEndTagDone = true;
      }
      
      if(el === '<') {
        throw Error('Whoops! Looks like you forgot to close the closing tag!');
      }
      
      if(el !== '>' && el !== '/' && el !== '<') {
        endTag += el;
      }
    }
    
    endTag = reverseString(endTag.trim());
    
    // we've obtained both openTag and endTag. but openTag might have some props, so we need to handle that!
    
    // HANDLE PROPS HERE
    let props = {};
    let tagProps = openTag.split(' ').slice(1);
    for(let tagProp of tagProps) {
      let localProp = tagProp.split('=');
      
      // handle props with propName = {val} style
      let val;
      if(localProp[1][0] === '{' && localProp[1][localProp[1].length - 1] === '}') {
        val = eval('(' + localProp[1].slice(1, localProp[1].length - 1) + ')');
      } else {
        val = eval(localProp[1]);
      }
      props[localProp[0]] = val;
    }
    
    if(openTag.indexOf(' ') !== -1) {
      openTag = openTag.slice(0, openTag.indexOf(' '));
    }
    
    if(openTag !== endTag && !isSingleTag) {
      throw Error(`open and closing tag are not matched: ${openTag} and ${endTag}`);
    }
    
    // remove the open tag from the rest of the elem
    elem = elem.replace(`</${endTag}>`, '');
    
    
    let tagObj = { tag: openTag, props };
    
    reactTree.push(tagObj);
    return parseTag(elem);
    
  }

  const sampleCode = `
  <div className="yeah" test="wow">
    <p num={5}><span><em>Hello world</em></span></p>
  </div>`;

  parseTag(codeStr);

  return reactTree;
};

export {
  parseStringToJSX,
};
