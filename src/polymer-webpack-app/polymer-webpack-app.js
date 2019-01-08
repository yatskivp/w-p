import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import req from './req.js'
/**
 * @customElement
 * @polymer
 */

console.log('req', req);

class RequireApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'require-app'
      }
    };
  }
}

window.customElements.define('polymer-webpack-app', RequireApp);
