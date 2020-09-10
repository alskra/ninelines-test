import '@babel/polyfill';
import svg4everybody from 'svg4everybody';
import $ from 'jquery';
import 'focus-visible';

svg4everybody();

window.$ = $;
window.jQuery = $;

require('ninelines-ua-parser');

if (typeof NodeList.prototype.forEach === 'undefined') {
	NodeList.prototype.forEach = Array.prototype.forEach;
}
