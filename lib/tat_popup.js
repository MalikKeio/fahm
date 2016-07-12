(function() {
  var PopupProto = Object.create(HTMLElement.prototype);

  PopupProto.q = function(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  PopupProto.createdCallback = function() {
    var t = document.querySelector('#transover-tat-popup-template').content.cloneNode(true);
    this.createShadowRoot().appendChild(t);

    var sendTranslate = function() {
      window.postMessage({
        type: 'transoverTranslate',
        text: this.q('#tat_input').value
      }, '*');
    }.bind(this);

    this.q('main').onkeydown = function(e) {
      if (e.keyCode == 13) {
        sendTranslate();
      }
      // let 'escape' be handled in the host context (by content script)
      if (e.keyCode == 27) {
        return;
      }
      e.stopPropagation();
    }

    this.q('#tat_submit').onclick = sendTranslate;
  };

  PopupProto.attachedCallback = function() {
    this.q('#tat_input').focus();
  }

  document.registerElement('transover-type-and-translate-popup', { prototype: PopupProto });
})();
