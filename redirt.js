(function () {

  var is = (function() {
    var _ = {};

    _.number = function isNumber(input) {
      return typeof input === 'number';
    };

    _.string = function isString(input) {
      return typeof input === 'string';
    };

    _.DOMElement = function isDOMElement(input) {
      return input.ELEMENT_NODE === 1
    }

    _.array = function isArray(input) {
      return Array.isArray(input);
    }

    _.customEl = function isCustomEl(input) {
      return el.CUSTOM_EL === 1;
    }

    _.func = function isFunc(input) {
      return typeof input === 'function';
    }

    _.webComp = function isWebComp(input) {
      return input && input.match && input.match(/-/) !== null;
    }

    _.equalI = function isEqual(a, b) {
      return (a && b && a.toUpperCase && b.toUpperCase
        && a.toUpperCase() === b.toUpperCase()
      );
    }

    _.node = function isNode(node, name) {
      return node && _.equalI(node.nodeName, name);
    }

    return _;
  })();

  function buildId() {
    var counter = 0;
    return function id() {
      counter += 1;
      return counter;
    }
  }
  var id = buildId();

  function tagCustomElement(el) {
    el.CUSTOM_EL = 1;
    return el;
  }

  function Render(node, state) {
    var oldApp;
    return function RenderFn(fn) {
      console.log('');
      console.log('....Renering...');
      var activeElement = document.activeElement;
      var posCare = 0;
      if (is.node(activeElement, 'INPUT')) {
        posCare = activeElement.selectionStart;
      }
      var res = fn(state);
      var app = res[0];
      var newState = res[1];
      node.innerHTML = '';
      var newApp = node.appendChild(app(newState, RenderFn))
      if (activeElement.id){
        var focusEl = newApp.querySelector('#'+activeElement.id);
        if (is.node(activeElement,'INPUT')) {
          focusEl.focus();
          focusEl.setSelectionRange(posCare, posCare);
        } else {
          focusEl.focus();
        }
      } else {
          if (is.node(activeElement, 'INPUT')) {
            console.warn('Input element must contain an id attribute');
          }
      }
      console.log('app', oldApp);
      console.log('app state', state);
      console.log('newapp ', newApp);
      console.log('newapp state', newState);
      oldApp = newApp;
      state = newState;
      return newApp;
    };
  }

  function setShadowRootCSS($el, css) {
    var styles = $el.shadowRoot.querySelector('style');
    if (styles === null) {
      $el.shadowRoot.append(El('style', css))
    }else {
      styles.innerHTML = El('style', css);
    }
    return $el;
  }

  function resolveTemplateLiteral() {
    var strArr = arguments[0][0];
    var arrVariables = [];
    var str = '';
    for (var i = 0, x = 1; i < strArr.length - 1; i++, x++) {
      str = str + strArr[i] + arguments[0][x];
    }
    str += strArr[strArr.length - 1];
    return str;
  }

  function cssWrapper($el) {
    return function () {
      return tagCustomElement(
        setShadowRootCSS($el, resolveTemplateLiteral(arguments))
      );
    }
  }

  function attachAttributes($el, attributes) {
    $el._props_ = attributes;
    return $el;
  }

  function El() {
    var tagName = arguments[0];
    var attributes = arguments[1];
    attributes = attributes === undefined ? {} : attributes;
    var $el;
    if (is.func(tagName)) {
      $el = tagName();
    }else if (is.webComp(tagName)) {
      try {
        customElements.define(tagName, class extends HTMLElement { });
        $el = document.createElement(tagName);
      } catch (e) {
        $el = document.createElement(tagName);
      }
      var shadowOptions;
      if (attributes.shadow && attributes.shadow.options) {
        ssshadowOptions = attributes.shadow.options;
      }else {
        shadowOptions = {mode: 'open'};
      }
      $el.attachShadow(shadowOptions);
    } else {
      $el = document.createElement(tagName);
    }

    var innerAttr = {
      children: []
    };

    if (is.string(attributes) || is.number(attributes)) {
      innerAttr.children.push(attributes);
      $el._props_ = innerAttr;
      if (is.webComp(tagName)) {
        return cssWrapper($el);
      }
      $el.textContent = attributes;
      return tagCustomElement($el);
    } else if (is.DOMElement(attributes) || is.func(attributes)) {
      for (var x = 1; x < arguments.length; x++) {
        var sibling = arguments[x];
        var childNode;
        if (is.webComp(tagName)) {
          childNode = is.func(sibling) ? sibling() : sibling;
          $el.shadowRoot.append(childNode);
        }else {
          childNode = is.func(sibling) ? sibling() : sibling;
          $el.append(childNode);
        }
        innerAttr['children'].push(childNode._props_);
      }
      if (is.webComp(tagName)) {
        return cssWrapper($el); 
      }
      return tagCustomElement($el);
    }
    
    for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        var value = attributes[key];
        innerAttr[key] = value;
        } if (is.equalI(key, 'shadow') && is.webComp(tagName)) {
          var styles = value.styles;
          $el = setShadowRootCSS($el, styles);
        } else if (is.webComp(tagName) && is.equalI('CSS', key)) {
          $el = setShadowRootCSS($el, value);
        } else if (is.func(value)) {
          $el.addEventListener(key, value);
        } else if (is.equalI(key, 'children')) {
          if (is.array(value)) {
            for (var x = 0; x < value.length; x++) {
              var child = value[x]; 
              if (is.webComp(tagName)) {
                $el.shadowRoot.append(is.func(child) ? El(child) : child);
              }else {
                $el.append(is.func(child) ? El(child) : child);
              }
            }
          } else {
            $el.append(value);
          }
      } else {
        if (is.equalI(key, 'CUSTOM_EL') === false 
          && is.equalI(key,'shadow') === false && 
          is.equalI(key, 'CSS') === false
        ) {
          $el.setAttribute(key, value);
        }
      }
    }


    if (is.webComp(tagName) && attributes['css'] === undefined) {
      return cssWrapper($el);
    }
    return tagCustomElement($el);
  }

  var exp = {
    Render,
    El,
  };

  try {
    module.exports = exp;
  } catch (e) {
    document.Redirt = exp;
    window.Redirt = exp;
  }

})();
