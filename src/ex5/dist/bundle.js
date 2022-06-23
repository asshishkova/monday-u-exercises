(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Create an ItemClient class here.

const { builtinModules } = require("module");
axios = require("axios");

// This is what makes requests to your express server (your own custom API!)
class ItemClient {
  async getItems() {
    try {
      const response = await axios.get("/todo");
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  async deleteItem(item) {
    try {
      const response = await axios.delete(`/todo/${item.id}`);
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  async markItemAsOld(item) {
    try {
      const response = await axios.patch(
        `/todo/${item.id}`,
        {text: item.text, isNew: false, status: item.status}
      );
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  async changeItemStatus(item) {
    const doneTime = item.done === null? Date.now() : null;
    try {
      const response = await axios.patch(
        `/todo/${item.id}`,
        {
          text: item.text,
          isNew: item.isNew,
          status: !item.status,
          done: doneTime
        }
      );
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  async createItem(itemText) {
    try {
      const response = await axios.post(`/todo`, {text: itemText});
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  async clearAll() {
    try {
      const response = await axios.post(`/todo/clearall`);
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  async sortItems() {
    try {
      const response = await axios.post(`/todo/sort`);
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }
}

module.exports = ItemClient;

},{"axios":3,"module":74}],2:[function(require,module,exports){
ItemClient = require("./clients/item_client.js");
TimeAgo = require('javascript-time-ago')
en = require('javascript-time-ago/locale/en')
TimeAgo.addDefaultLocale(en)

// Create formatter (English).
const timeAgo = new TimeAgo('en-US')

const SHOW = true;
const HIDE = false;

class Main {
  constructor() {
    this.itemClient = new ItemClient();
  }

  init = async () => {
    this.todoList = document.getElementById("todos-list");
    this.todoTextBox = document.getElementById("new-todo-textbox");
    this.todoAmountInfo = document.getElementById("amount-info");

    await this.updateTodos();

    this.clearAllButton = document.getElementById("clear-all-button");
    this.addTodoForm = document.getElementById("add-todo");
    this.sortListButton = document.getElementById("sort-list-button");

    this.clearAllButton.addEventListener('click', () => this.onClearAllButtonClicked());
    this.addTodoForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.onAddTodoFormSubmitted(event);
    });
    this.sortListButton.addEventListener('click', async() => await this.onSortListButtonClicked());
    this.todoTextBox.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById('add-todo-button').click();
      }
    });
  }

  async renderTodos() {
    this.todoList.innerHTML = "";
    for (const todoItem of this.todos) {
      await this.addTodoItem(todoItem);
    }
    this.showFooterAndImage();
    for (const [i, todoItem] of this.todos.entries()) {
      if (todoItem.isNew) {
        const listElement = this.todoList.children.item(i);
        await this.showTodoWithAnimation(listElement, todoItem);
      }
    }
  }

  async addTodoItem(todoItem) {
    const listElement = await this.createTodoListElement(todoItem);
    this.addEventListenerForCheckbox(listElement);
    this.addEventListenerForDeleteButton(listElement);
    this.todoList.appendChild(listElement);
  }

  async createTodoListElement(todoItem) {
    const doneTime = todoItem.done === null? "" : `Done ${timeAgo.format(Date.now() - 2 * 60 * 60 * 1000)}`;
    // const doneTime = todoItem.done === null? "" : `Done ${timeAgo.format(Date.now() - todoItem.done)}`;
    console.log(doneTime);
    const todoListElement = document.createElement("li");
    todoListElement.className = "todo-li existing-todo";
    todoListElement.innerHTML = `<label class="todo-item">
                                    <label class="todo-item-checkbox" title="${doneTime}">
                                      <div class="todo-item-text">${todoItem.text}</div>
                                      <input type="checkbox" class="status-checkbox" ${todoItem.status? "checked" : ""}>
                                      <span class="status-checkbox-mark"></span>
                                    </label>
                                </label>
                                <button class="delete-todo-button btn"><i class="fa fa-trash"></i></button>`;
    return todoListElement;
  }

  async showTodoWithAnimation(todoListElement, todoItem) {
    todoListElement.className = "todo-li animation-add-todo";
    setTimeout (() => { todoListElement.className = "todo-li existing-todo";}, 700);
    await this.itemClient.markItemAsOld(todoItem);
  }

  addEventListenerForCheckbox(listElement) {
    const todoText = listElement.getElementsByClassName("status-checkbox")[0];
    todoText.addEventListener('click', ({currentTarget}) => {
      this.onCheckboxClicked(currentTarget);
    });
  }

  addEventListenerForDeleteButton(listElement) {
    const deleteButton = listElement.getElementsByClassName("delete-todo-button")[0];
    deleteButton.addEventListener('click', ({currentTarget}) => {
      this.onDeleteButtonClicked(currentTarget);
    });
  }

  showFooterAndImage() {
    this.showButtonsAndAmount();
    this.showNoTodosImage();
  }

  showButtonsAndAmount() {
    let tasks = "tasks";
    if (this.todos.length === 1) {
      tasks = "task";
      this.showOrHideElement('sort-list-button', HIDE)
      this.showOrHideElement('clear-all-button', HIDE)
    } else {
      this.showOrHideElement('sort-list-button', SHOW)
      this.showOrHideElement('clear-all-button', SHOW)
    }
    this.todoAmountInfo.textContent = `${this.todos.length} pending ${tasks}`;
  }

  showNoTodosImage() {
    if (this.todos.length === 0) {
      this.showOrHideElement('no-todos-placeholder', SHOW)
      this.showOrHideElement('footer', HIDE)

    } else {
      this.showOrHideElement('no-todos-placeholder', HIDE)
      this.showOrHideElement('footer', SHOW)
    }
  }

  showOrHideElement(elementId, showElement) {
    this.displayStyle = showElement ? "" : "none";
    document.getElementById(elementId).style.display = this.displayStyle;
  }

  async onCheckboxClicked(clickedCheckbox) {
    const index = Array.prototype.indexOf.call(
      this.todoList.getElementsByClassName("existing-todo"),
      clickedCheckbox.parentElement.parentElement.parentElement
    );
    const todoItem = this.todos[index];
    await this.itemClient.changeItemStatus(todoItem);
    await this.updateTodos();
  }

  async onDeleteButtonClicked(clickedButton) {
    const index = Array.prototype.indexOf.call(this.todoList.getElementsByClassName("existing-todo"), clickedButton.parentElement);
    const todoItem = this.todos[index];
    const todoLi = clickedButton.parentElement;
    await this.itemClient.deleteItem(todoItem);
    this.todos = await this.itemClient.getItems();
    await this.activateDeleteAnimation(todoLi);
  }

  async activateDeleteAnimation(todoLi) {
    todoLi.classList.remove("existing-todo");
    todoLi.classList.add("animation-delete-todo");
    todoLi.addEventListener('animationend', () => {
      this.renderTodos();
    });
  }

  async updateTodos() {
    this.todos = await this.itemClient.getItems();
    await this.renderTodos();
  }

  async onClearAllButtonClicked() {
    await this.itemClient.clearAll();
    const amount = this.todos.length;
    this.todos = await this.itemClient.getItems();
    for (let i = 0; i < amount; i++) {
      const todoLi = document.getElementById('todos-list').children.item(i);
      await this.activateDeleteAnimation(todoLi);
    }
  }

  async onAddTodoFormSubmitted(event) {
    const text = this.todoTextBox.value;
    this.todoTextBox.value = "";
    await this.itemClient.createItem(text);
    await this.updateTodos();
  }

  async onSortListButtonClicked() {
    this.sortListButton.innerHTML = `
      ${await this.itemClient.sortItems()}
      <i class="fa fa-caret-down"></i>
    `;
    await this.updateTodos();
  }
}

const main = new Main();

document.addEventListener("DOMContentLoaded", function () {
  main.init();
});

},{"./clients/item_client.js":1,"javascript-time-ago":65,"javascript-time-ago/locale/en":66}],3:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":5}],4:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var cookies = require('./../helpers/cookies');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');
var transitionalDefaults = require('../defaults/transitional');
var Cancel = require('../cancel/Cancel');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new Cancel('canceled') : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"../cancel/Cancel":6,"../core/buildFullPath":11,"../core/createError":12,"../defaults/transitional":19,"./../core/settle":16,"./../helpers/buildURL":22,"./../helpers/cookies":24,"./../helpers/isURLSameOrigin":27,"./../helpers/parseHeaders":29,"./../utils":32}],5:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');
axios.VERSION = require('./env/data').version;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":6,"./cancel/CancelToken":7,"./cancel/isCancel":8,"./core/Axios":9,"./core/mergeConfig":15,"./defaults":18,"./env/data":20,"./helpers/bind":21,"./helpers/isAxiosError":26,"./helpers/spread":30,"./utils":32}],6:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],7:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":6}],8:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],9:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');
var validator = require('../helpers/validator');

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(configOrUrl, config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"../helpers/buildURL":22,"../helpers/validator":31,"./../utils":32,"./InterceptorManager":10,"./dispatchRequest":13,"./mergeConfig":15}],10:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":32}],11:[function(require,module,exports){
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/combineURLs":23,"../helpers/isAbsoluteURL":25}],12:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":14}],13:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');
var Cancel = require('../cancel/Cancel');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new Cancel('canceled');
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/Cancel":6,"../cancel/isCancel":8,"../defaults":18,"./../utils":32,"./transformData":17}],14:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };
  return error;
};

},{}],15:[function(require,module,exports){
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};

},{"../utils":32}],16:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":12}],17:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var defaults = require('../defaults');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};

},{"../defaults":18,"./../utils":32}],18:[function(require,module,exports){
(function (process){(function (){
'use strict';

var utils = require('../utils');
var normalizeHeaderName = require('../helpers/normalizeHeaderName');
var enhanceError = require('../core/enhanceError');
var transitionalDefaults = require('./transitional');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('../adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('../adapters/http');
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: transitionalDefaults,

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this)}).call(this,require('_process'))
},{"../adapters/http":4,"../adapters/xhr":4,"../core/enhanceError":14,"../helpers/normalizeHeaderName":28,"../utils":32,"./transitional":19,"_process":75}],19:[function(require,module,exports){
'use strict';

module.exports = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

},{}],20:[function(require,module,exports){
module.exports = {
  "version": "0.26.1"
};
},{}],21:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],22:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":32}],23:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],24:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":32}],25:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};

},{}],26:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
};

},{"./../utils":32}],27:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":32}],28:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":32}],29:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":32}],30:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],31:[function(require,module,exports){
'use strict';

var VERSION = require('../env/data').version;

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};

},{"../env/data":20}],32:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return Array.isArray(val);
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return toString.call(val) === '[object FormData]';
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return toString.call(val) === '[object URLSearchParams]';
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

},{"./helpers/bind":21}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addLocaleData = addLocaleData;
exports.getLocaleData = getLocaleData;
// For all locales added
// their relative time formatter messages will be stored here.
var localesData = {};

function getLocaleData(locale) {
  return localesData[locale];
}

function addLocaleData(localeData) {
  if (!localeData) {
    throw new Error('[javascript-time-ago] No locale data passed.');
  } // This locale data is stored in a global variable
  // and later used when calling `.format(time)`.


  localesData[localeData.locale] = localeData;
}

},{}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _relativeTimeFormat = _interopRequireDefault(require("relative-time-format"));

var _cache = _interopRequireDefault(require("./cache.js"));

var _locale = _interopRequireDefault(require("./locale.js"));

var _isStyleObject = _interopRequireDefault(require("./isStyleObject.js"));

var _getStep3 = _interopRequireDefault(require("./steps/getStep.js"));

var _getStepDenominator = _interopRequireDefault(require("./steps/getStepDenominator.js"));

var _getTimeToNextUpdate = _interopRequireDefault(require("./steps/getTimeToNextUpdate.js"));

var _LocaleDataStore = require("./LocaleDataStore.js");

var _roundMinute = _interopRequireDefault(require("./style/roundMinute.js"));

var _getStyleByName = _interopRequireDefault(require("./style/getStyleByName.js"));

var _round = require("./round.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

// Valid time units.
var UNITS = ['now', // The rest are the same as in `Intl.RelativeTimeFormat`.
'second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'];

var TimeAgo = /*#__PURE__*/function () {
  /**
   * @param {(string|string[])} locales=[] - Preferred locales (or locale).
   * @param {boolean} [polyfill] — Pass `false` to use native `Intl.RelativeTimeFormat` and `Intl.PluralRules` instead of the polyfills.
   */
  function TimeAgo() {
    var locales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        polyfill = _ref.polyfill;

    _classCallCheck(this, TimeAgo);

    // Convert `locales` to an array.
    if (typeof locales === 'string') {
      locales = [locales];
    } // Choose the most appropriate locale
    // from the list of `locales` added by the user.
    // For example, new TimeAgo("en-US") -> "en".


    this.locale = (0, _locale["default"])(locales.concat(TimeAgo.getDefaultLocale()), _LocaleDataStore.getLocaleData);

    if (typeof Intl !== 'undefined') {
      // Use `Intl.NumberFormat` for formatting numbers (when available).
      if (Intl.NumberFormat) {
        this.numberFormat = new Intl.NumberFormat(this.locale);
      }
    } // Some people have requested the ability to use native
    // `Intl.RelativeTimeFormat` and `Intl.PluralRules`
    // instead of the polyfills.
    // https://github.com/catamphetamine/javascript-time-ago/issues/21


    if (polyfill === false) {
      this.IntlRelativeTimeFormat = Intl.RelativeTimeFormat;
      this.IntlPluralRules = Intl.PluralRules;
    } else {
      this.IntlRelativeTimeFormat = _relativeTimeFormat["default"];
      this.IntlPluralRules = _relativeTimeFormat["default"].PluralRules;
    } // Cache `Intl.RelativeTimeFormat` instance.


    this.relativeTimeFormatCache = new _cache["default"](); // Cache `Intl.PluralRules` instance.

    this.pluralRulesCache = new _cache["default"]();
  }
  /**
   * Formats relative date/time.
   *
   * @param {(number|Date)} input — A `Date` or a javascript timestamp.
   *
   * @param {(string|object)} style — Date/time formatting style. Either one of the built-in style names or a "custom" style definition object having `steps: object[]` and `labels: string[]`.
   *
   * @param {number} [options.now] - Sets the current date timestamp.
   *
   * @param  {boolean} [options.future] — Tells how to format value `0`:
   *         as "future" (`true`) or "past" (`false`).
   *         Is `false` by default, but should have been `true` actually,
   *         in order to correspond to `Intl.RelativeTimeFormat`
   *         that uses `future` formatting for `0` unless `-0` is passed.
   *
   * @param {string} [options.round] — Rounding method. Overrides the style's one.
   *
   * @param {boolean} [options.getTimeToNextUpdate] — Pass `true` to return `[formattedDate, timeToNextUpdate]` instead of just `formattedDate`.
   *
   * @return {string} The formatted relative date/time. If no eligible `step` is found, then an empty string is returned.
   */


  _createClass(TimeAgo, [{
    key: "format",
    value: function format(input, style, options) {
      if (!options) {
        if (style && !isStyle(style)) {
          options = style;
          style = undefined;
        } else {
          options = {};
        }
      }

      if (!style) {
        style = _roundMinute["default"];
      }

      if (typeof style === 'string') {
        style = (0, _getStyleByName["default"])(style);
      }

      var timestamp = getTimestamp(input); // Get locale messages for this type of labels.
      // "flavour" is a legacy name for "labels".

      var _this$getLabels = this.getLabels(style.flavour || style.labels),
          labels = _this$getLabels.labels,
          labelsType = _this$getLabels.labelsType;

      var now; // Can pass a custom `now`, e.g. for testing purposes.
      //
      // Legacy way was passing `now` in `style`.
      // That way is deprecated.

      if (style.now !== undefined) {
        now = style.now;
      } // The new way is passing `now` option to `.format()`.


      if (now === undefined && options.now !== undefined) {
        now = options.now;
      }

      if (now === undefined) {
        now = Date.now();
      } // how much time has passed (in seconds)


      var secondsPassed = (now - timestamp) / 1000; // in seconds

      var future = options.future || secondsPassed < 0;
      var nowLabel = getNowLabel(labels, (0, _LocaleDataStore.getLocaleData)(this.locale).now, (0, _LocaleDataStore.getLocaleData)(this.locale)["long"], future); // `custom` – A function of `{ elapsed, time, date, now, locale }`.
      //
      // Looks like `custom` function is deprecated and will be removed
      // in the next major version.
      //
      // If this function returns a value, then the `.format()` call will return that value.
      // Otherwise the relative date/time is formatted as usual.
      // This feature is currently not used anywhere and is here
      // just for providing the ultimate customization point
      // in case anyone would ever need that. Prefer using
      // `steps[step].format(value, locale)` instead.
      //

      if (style.custom) {
        var custom = style.custom({
          now: now,
          date: new Date(timestamp),
          time: timestamp,
          elapsed: secondsPassed,
          locale: this.locale
        });

        if (custom !== undefined) {
          // Won't return `timeToNextUpdate` here
          // because `custom()` seems deprecated.
          return custom;
        }
      } // Get the list of available time interval units.


      var units = getTimeIntervalMeasurementUnits( // Controlling `style.steps` through `style.units` seems to be deprecated:
      // create a new custom `style` instead.
      style.units, labels, nowLabel); // // If no available time unit is suitable, just output an empty string.
      // if (units.length === 0) {
      // 	console.error(`None of the "${units.join(', ')}" time units have been found in "${labelsType}" labels for "${this.locale}" locale.`)
      // 	return ''
      // }

      var round = options.round || style.round; // Choose the appropriate time measurement unit
      // and get the corresponding rounded time amount.

      var _getStep = (0, _getStep3["default"])( // "gradation" is a legacy name for "steps".
      // For historical reasons, "approximate" steps are used by default.
      // In the next major version, there'll be no default for `steps`.
      style.gradation || style.steps || _roundMinute["default"].steps, secondsPassed, {
        now: now,
        units: units,
        round: round,
        future: future,
        getNextStep: true
      }),
          _getStep2 = _slicedToArray(_getStep, 3),
          prevStep = _getStep2[0],
          step = _getStep2[1],
          nextStep = _getStep2[2];

      var formattedDate = this.formatDateForStep(timestamp, step, secondsPassed, {
        labels: labels,
        labelsType: labelsType,
        nowLabel: nowLabel,
        now: now,
        future: future,
        round: round
      }) || '';

      if (options.getTimeToNextUpdate) {
        var timeToNextUpdate = (0, _getTimeToNextUpdate["default"])(timestamp, step, {
          nextStep: nextStep,
          prevStep: prevStep,
          now: now,
          future: future,
          round: round
        });
        return [formattedDate, timeToNextUpdate];
      }

      return formattedDate;
    }
  }, {
    key: "formatDateForStep",
    value: function formatDateForStep(timestamp, step, secondsPassed, _ref2) {
      var _this = this;

      var labels = _ref2.labels,
          labelsType = _ref2.labelsType,
          nowLabel = _ref2.nowLabel,
          now = _ref2.now,
          future = _ref2.future,
          round = _ref2.round;

      // If no step matches, then output an empty string.
      if (!step) {
        return;
      }

      if (step.format) {
        return step.format(timestamp, this.locale, {
          formatAs: function formatAs(unit, value) {
            // Mimicks `Intl.RelativeTimeFormat.format()`.
            return _this.formatValue(value, unit, {
              labels: labels,
              future: future
            });
          },
          now: now,
          future: future
        });
      } // "unit" is now called "formatAs".


      var unit = step.unit || step.formatAs;

      if (!unit) {
        throw new Error("[javascript-time-ago] Each step must define either `formatAs` or `format()`. Step: ".concat(JSON.stringify(step)));
      } // `Intl.RelativeTimeFormat` doesn't operate in "now" units.
      // Therefore, threat "now" as a special case.


      if (unit === 'now') {
        return nowLabel;
      } // Amount in units.


      var amount = Math.abs(secondsPassed) / (0, _getStepDenominator["default"])(step); // Apply granularity to the time amount
      // (and fallback to the previous step
      //  if the first level of granularity
      //  isn't met by this amount)
      //
      // `granularity` — (advanced) Time interval value "granularity".
      // For example, it could be set to `5` for minutes to allow only 5-minute increments
      // when formatting time intervals: `0 minutes`, `5 minutes`, `10 minutes`, etc.
      // Perhaps this feature will be removed because there seem to be no use cases
      // of it in the real world.
      //

      if (step.granularity) {
        // Recalculate the amount of seconds passed based on granularity
        amount = (0, _round.getRoundFunction)(round)(amount / step.granularity) * step.granularity;
      }

      var valueForFormatting = -1 * Math.sign(secondsPassed) * (0, _round.getRoundFunction)(round)(amount); // By default, this library formats a `0` in "past" mode,
      // unless `future: true` option is passed.
      // This is different to `relative-time-format`'s behavior
      // which formats a `0` in "future" mode by default, unless it's a `-0`.
      // So, convert `0` to `-0` if `future: true` option wasn't passed.
      // `=== 0` matches both `0` and `-0`.

      if (valueForFormatting === 0) {
        if (future) {
          valueForFormatting = 0;
        } else {
          valueForFormatting = -0;
        }
      }

      switch (labelsType) {
        case 'long':
        case 'short':
        case 'narrow':
          // Format the amount using `Intl.RelativeTimeFormat`.
          return this.getFormatter(labelsType).format(valueForFormatting, unit);

        default:
          // Format the amount.
          // (mimicks `Intl.RelativeTimeFormat` behavior for other time label styles)
          return this.formatValue(valueForFormatting, unit, {
            labels: labels,
            future: future
          });
      }
    }
    /**
     * Mimicks what `Intl.RelativeTimeFormat` does for additional locale styles.
     * @param  {number} value
     * @param  {string} unit
     * @param  {object} options.labels — Relative time labels.
     * @param  {boolean} [options.future] — Tells how to format value `0`: as "future" (`true`) or "past" (`false`). Is `false` by default, but should have been `true` actually.
     * @return {string}
     */

  }, {
    key: "formatValue",
    value: function formatValue(value, unit, _ref3) {
      var labels = _ref3.labels,
          future = _ref3.future;
      return this.getFormattingRule(labels, unit, value, {
        future: future
      }).replace('{0}', this.formatNumber(Math.abs(value)));
    }
    /**
     * Returns formatting rule for `value` in `units` (either in past or in future).
     * @param {object} formattingRules — Relative time labels for different units.
     * @param {string} unit - Time interval measurement unit.
     * @param {number} value - Time interval value.
     * @param  {boolean} [options.future] — Tells how to format value `0`: as "future" (`true`) or "past" (`false`). Is `false` by default.
     * @return {string}
     * @example
     * // Returns "{0} days ago"
     * getFormattingRule(en.long, "day", -2, 'en')
     */

  }, {
    key: "getFormattingRule",
    value: function getFormattingRule(formattingRules, unit, value, _ref4) {
      var future = _ref4.future;
      // Passing the language is required in order to
      // be able to correctly classify the `value` as a number.
      var locale = this.locale;
      formattingRules = formattingRules[unit]; // Check for a special "compacted" rules case:
      // if formatting rules are the same for "past" and "future",
      // and also for all possible `value`s, then those rules are
      // stored as a single string.

      if (typeof formattingRules === 'string') {
        return formattingRules;
      } // Choose either "past" or "future" based on time `value` sign.
      // If "past" is same as "future" then they're stored as "other".
      // If there's only "other" then it's being collapsed.


      var pastOrFuture = value === 0 ? future ? 'future' : 'past' : value < 0 ? 'past' : 'future';
      var quantifierRules = formattingRules[pastOrFuture] || formattingRules; // Bundle size optimization technique.

      if (typeof quantifierRules === 'string') {
        return quantifierRules;
      } // Quantify `value`.


      var quantifier = this.getPluralRules().select(Math.abs(value)); // "other" rule is supposed to always be present.
      // If only "other" rule is present then "rules" is not an object and is a string.

      return quantifierRules[quantifier] || quantifierRules.other;
    }
    /**
     * Formats a number into a string.
     * Uses `Intl.NumberFormat` when available.
     * @param  {number} number
     * @return {string}
     */

  }, {
    key: "formatNumber",
    value: function formatNumber(number) {
      return this.numberFormat ? this.numberFormat.format(number) : String(number);
    }
    /**
     * Returns an `Intl.RelativeTimeFormat` for a given `labelsType`.
     * @param {string} labelsType
     * @return {object} `Intl.RelativeTimeFormat` instance
     */

  }, {
    key: "getFormatter",
    value: function getFormatter(labelsType) {
      // `Intl.RelativeTimeFormat` instance creation is (hypothetically) assumed
      // a lengthy operation so the instances are cached and reused.
      return this.relativeTimeFormatCache.get(this.locale, labelsType) || this.relativeTimeFormatCache.put(this.locale, labelsType, new this.IntlRelativeTimeFormat(this.locale, {
        style: labelsType
      }));
    }
    /**
     * Returns an `Intl.PluralRules` instance.
     * @return {object} `Intl.PluralRules` instance
     */

  }, {
    key: "getPluralRules",
    value: function getPluralRules() {
      // `Intl.PluralRules` instance creation is (hypothetically) assumed
      // a lengthy operation so the instances are cached and reused.
      return this.pluralRulesCache.get(this.locale) || this.pluralRulesCache.put(this.locale, new this.IntlPluralRules(this.locale));
    }
    /**
     * Gets localized labels for this type of labels.
     *
     * @param {(string|string[])} labelsType - Relative date/time labels type.
     *                                     If it's an array then all label types are tried
     *                                     until a suitable one is found.
     *
     * @returns {Object} Returns an object of shape { labelsType, labels }
     */

  }, {
    key: "getLabels",
    value: function getLabels() {
      var labelsType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      // Convert `labels` to an array.
      if (typeof labelsType === 'string') {
        labelsType = [labelsType];
      } // Supports legacy "tiny" and "mini-time" label styles.


      labelsType = labelsType.map(function (labelsType) {
        switch (labelsType) {
          case 'tiny':
          case 'mini-time':
            return 'mini';

          default:
            return labelsType;
        }
      }); // "long" labels type is the default one.
      // (it's always present for all languages)

      labelsType = labelsType.concat('long'); // Find a suitable labels type.

      var localeData = (0, _LocaleDataStore.getLocaleData)(this.locale);

      for (var _iterator = _createForOfIteratorHelperLoose(labelsType), _step; !(_step = _iterator()).done;) {
        var _labelsType = _step.value;

        if (localeData[_labelsType]) {
          return {
            labelsType: _labelsType,
            labels: localeData[_labelsType]
          };
        }
      }
    }
  }]);

  return TimeAgo;
}();
/**
 * Default locale global variable.
 */


exports["default"] = TimeAgo;
var defaultLocale = 'en';
/**
 * Gets default locale.
 * @return  {string} locale
 */

TimeAgo.getDefaultLocale = function () {
  return defaultLocale;
};
/**
 * Sets default locale.
 * @param  {string} locale
 */


TimeAgo.setDefaultLocale = function (locale) {
  return defaultLocale = locale;
};
/**
 * Adds locale data for a specific locale and marks the locale as default.
 * @param {Object} localeData
 */


TimeAgo.addDefaultLocale = function (localeData) {
  if (defaultLocaleHasBeenSpecified) {
    return console.error('[javascript-time-ago] `TimeAgo.addDefaultLocale()` can only be called once. To add other locales, use `TimeAgo.addLocale()`.');
  }

  defaultLocaleHasBeenSpecified = true;
  TimeAgo.setDefaultLocale(localeData.locale);
  TimeAgo.addLocale(localeData);
};

var defaultLocaleHasBeenSpecified;
/**
 * Adds locale data for a specific locale.
 * @param {Object} localeData
 */

TimeAgo.addLocale = function (localeData) {
  (0, _LocaleDataStore.addLocaleData)(localeData);

  _relativeTimeFormat["default"].addLocale(localeData);
};
/**
 * (legacy alias)
 * Adds locale data for a specific locale.
 * @param {Object} localeData
 * @deprecated
 */


TimeAgo.locale = TimeAgo.addLocale;
/**
 * Adds custom labels to locale data.
 * @param {string} locale
 * @param {string} name
 * @param {object} labels
 */

TimeAgo.addLabels = function (locale, name, labels) {
  var localeData = (0, _LocaleDataStore.getLocaleData)(locale);

  if (!localeData) {
    (0, _LocaleDataStore.addLocaleData)({
      locale: locale
    });
    localeData = (0, _LocaleDataStore.getLocaleData)(locale); // throw new Error(`[javascript-time-ago] No data for locale "${locale}"`)
  }

  localeData[name] = labels;
}; // Normalizes `.format()` `time` argument.


function getTimestamp(input) {
  if (input.constructor === Date || isMockedDate(input)) {
    return input.getTime();
  }

  if (typeof input === 'number') {
    return input;
  } // For some weird reason istanbul doesn't see this `throw` covered.

  /* istanbul ignore next */


  throw new Error("Unsupported relative time formatter input: ".concat(_typeof(input), ", ").concat(input));
} // During testing via some testing libraries `Date`s aren't actually `Date`s.
// https://github.com/catamphetamine/javascript-time-ago/issues/22


function isMockedDate(object) {
  return _typeof(object) === 'object' && typeof object.getTime === 'function';
} // Get available time interval measurement units.


function getTimeIntervalMeasurementUnits(allowedUnits, labels, nowLabel) {
  // Get all time interval measurement units that're available
  // in locale data for a given time labels style.
  var units = Object.keys(labels); // `now` unit is handled separately and is shipped in its own `now.json` file.
  // `now.json` isn't present for all locales, so it could be substituted with
  // ".second.current".
  // Add `now` unit if it's available in locale data.

  if (nowLabel) {
    units.push('now');
  } // If only a specific set of available time measurement units can be used
  // then only those units are allowed (if they're present in locale data).


  if (allowedUnits) {
    units = allowedUnits.filter(function (unit) {
      return unit === 'now' || units.indexOf(unit) >= 0;
    });
  }

  return units;
}

function getNowLabel(labels, nowLabels, longLabels, future) {
  var nowLabel = labels.now || nowLabels && nowLabels.now; // Specific "now" message form extended locale data (if present).

  if (nowLabel) {
    // Bundle size optimization technique.
    if (typeof nowLabel === 'string') {
      return nowLabel;
    } // Not handling `value === 0` as `localeData.now.current` here
    // because it wouldn't make sense: "now" is a moment,
    // so one can't possibly differentiate between a
    // "previous" moment, a "current" moment and a "next moment".
    // It can only be differentiated between "past" and "future".


    if (future) {
      return nowLabel.future;
    } else {
      return nowLabel.past;
    }
  } // Use ".second.current" as "now" message.


  if (longLabels && longLabels.second && longLabels.second.current) {
    return longLabels.second.current;
  }
}

function isStyle(variable) {
  return typeof variable === 'string' || (0, _isStyleObject["default"])(variable);
}

},{"./LocaleDataStore.js":33,"./cache.js":35,"./isStyleObject.js":36,"./locale.js":37,"./round.js":38,"./steps/getStep.js":40,"./steps/getStepDenominator.js":41,"./steps/getTimeToNextUpdate.js":43,"./style/getStyleByName.js":52,"./style/roundMinute.js":59,"relative-time-format":73}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * A basic in-memory cache.
 *
 * import Cache from 'javascript-time-ago/Cache'
 * const cache = new Cache()
 * const object = cache.get('key1', 'key2', ...) || cache.put('key1', 'key2', ..., createObject())
 */
var Cache = /*#__PURE__*/function () {
  function Cache() {
    _classCallCheck(this, Cache);

    this.cache = {};
  }

  _createClass(Cache, [{
    key: "get",
    value: function get() {
      var cache = this.cache;

      for (var _len = arguments.length, keys = new Array(_len), _key = 0; _key < _len; _key++) {
        keys[_key] = arguments[_key];
      }

      for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
        var key = _keys[_i];

        if (_typeof(cache) !== 'object') {
          return;
        }

        cache = cache[key];
      }

      return cache;
    }
  }, {
    key: "put",
    value: function put() {
      for (var _len2 = arguments.length, keys = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        keys[_key2] = arguments[_key2];
      }

      var value = keys.pop();
      var lastKey = keys.pop();
      var cache = this.cache;

      for (var _i2 = 0, _keys2 = keys; _i2 < _keys2.length; _i2++) {
        var key = _keys2[_i2];

        if (_typeof(cache[key]) !== 'object') {
          cache[key] = {};
        }

        cache = cache[key];
      }

      return cache[lastKey] = value;
    }
  }]);

  return Cache;
}();

exports["default"] = Cache;

},{}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isStyleObject;

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function isStyleObject(object) {
  return isObject(object) && (Array.isArray(object.steps) || // `gradation` property is deprecated: it has been renamed to `steps`.
  Array.isArray(object.gradation) || // `flavour` property is deprecated: it has been renamed to `labels`.
  Array.isArray(object.flavour) || typeof object.flavour === 'string' || Array.isArray(object.labels) || typeof object.labels === 'string' || // `units` property is deprecated.
  Array.isArray(object.units) || // `custom` property is deprecated.
  typeof object.custom === 'function');
}

var OBJECT_CONSTRUCTOR = {}.constructor;

function isObject(object) {
  return _typeof(object) !== undefined && object !== null && object.constructor === OBJECT_CONSTRUCTOR;
}

},{}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = chooseLocale;
exports.intlDateTimeFormatSupported = intlDateTimeFormatSupported;
exports.intlDateTimeFormatSupportedLocale = intlDateTimeFormatSupportedLocale;

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * Chooses the most appropriate locale
 * (one of the registered ones)
 * based on the list of preferred `locales` supplied by the user.
 *
 * @param {string[]} locales - the list of preferable locales (in [IETF format](https://en.wikipedia.org/wiki/IETF_language_tag)).
 * @param {Function} isLocaleDataAvailable - tests if a locale is available.
 *
 * @returns {string} The most suitable locale.
 *
 * @example
 * // Returns 'en'
 * chooseLocale(['en-US'], undefined, (locale) => locale === 'ru' || locale === 'en')
 */
function chooseLocale(locales, isLocaleDataAvailable) {
  // This is not an intelligent algorithm,
  // but it will do for this library's case.
  // `sr-Cyrl-BA` -> `sr-Cyrl` -> `sr`.
  for (var _iterator = _createForOfIteratorHelperLoose(locales), _step; !(_step = _iterator()).done;) {
    var locale = _step.value;

    if (isLocaleDataAvailable(locale)) {
      return locale;
    }

    var parts = locale.split('-');

    while (parts.length > 1) {
      parts.pop();
      locale = parts.join('-');

      if (isLocaleDataAvailable(locale)) {
        return locale;
      }
    }
  }

  throw new Error("No locale data has been registered for any of the locales: ".concat(locales.join(', ')));
}
/**
 * Whether can use `Intl.DateTimeFormat` for these `locales`.
 * Returns the first suitable one.
 * @param  {(string|string[])} locales
 * @return {?string} The first locale that can be used.
 */


function intlDateTimeFormatSupportedLocale(locales) {
  /* istanbul ignore else */
  if (intlDateTimeFormatSupported()) {
    return Intl.DateTimeFormat.supportedLocalesOf(locales)[0];
  }
}
/**
 * Whether can use `Intl.DateTimeFormat`.
 * @return {boolean}
 */


function intlDateTimeFormatSupported() {
  // Babel transforms `typeof` into some "branches"
  // so istanbul will show this as "branch not covered".

  /* istanbul ignore next */
  var isIntlAvailable = (typeof Intl === "undefined" ? "undefined" : _typeof(Intl)) === 'object';
  return isIntlAvailable && typeof Intl.DateTimeFormat === 'function';
}

},{}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDiffRatioToNextRoundedNumber = getDiffRatioToNextRoundedNumber;
exports.getRoundFunction = getRoundFunction;

function getRoundFunction(round) {
  switch (round) {
    case 'floor':
      return Math.floor;

    default:
      return Math.round;
  }
} // For non-negative numbers.


function getDiffRatioToNextRoundedNumber(round) {
  switch (round) {
    case 'floor':
      // Math.floor(x) = x
      // Math.floor(x + 1) = x + 1
      return 1;

    default:
      // Math.round(x) = x
      // Math.round(x + 0.5) = x + 1
      return 0.5;
  }
}

},{}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _units = require("./units.js");

// "factor" is a legacy property.
// Developers shouldn't need to use it in their custom steps.
// "threshold" is a legacy name of "min".
// Developers should use "min" property name instead of "threshold".
// "threshold_for_idOrUnit: value" is a legacy way of specifying "min: { id: value }".
// Developers should use "min" property instead of "threshold".
// just now
// 1 minute ago
// 2 minutes ago
// 5 minutes ago
// 10 minutes ago
// 15 minutes ago
// 20 minutes ago
// …
// 50 minutes ago
// an hour ago
// 2 hours ago
// …
// 20 hours ago
// a day ago
// 2 days ago
// 5 days ago
// a week ago
// 2 weeks ago
// 3 weeks ago
// a month ago
// 2 months ago
// 4 months ago
// a year ago
// 2 years ago
// …
var _default = [{
  // This step returns the amount of seconds
  // by dividing the amount of seconds by `1`.
  factor: 1,
  // "now" labels are used for formatting the output.
  unit: 'now'
}, {
  // When the language doesn't support `now` unit,
  // the first step is ignored, and it uses this `second` unit.
  threshold: 1,
  // `threshold_for_now` should be the same as `threshold` on minutes.
  threshold_for_now: 45.5,
  // This step returns the amount of seconds
  // by dividing the amount of seconds by `1`.
  factor: 1,
  // "second" labels are used for formatting the output.
  unit: 'second'
}, {
  // `threshold` should be the same as `threshold_for_now` on seconds.
  threshold: 45.5,
  // Return the amount of minutes by dividing the amount
  // of seconds by the amount of seconds in a minute.
  factor: _units.minute,
  // "minute" labels are used for formatting the output.
  unit: 'minute'
}, {
  // This step is effective starting from 2.5 minutes.
  threshold: 2.5 * _units.minute,
  // Allow only 5-minute increments of minutes starting from 2.5 minutes.
  // `granularity` — (advanced) Time interval value "granularity".
  // For example, it could be set to `5` for minutes to allow only 5-minute increments
  // when formatting time intervals: `0 minutes`, `5 minutes`, `10 minutes`, etc.
  // Perhaps this feature will be removed because there seem to be no use cases
  // of it in the real world.
  granularity: 5,
  // Return the amount of minutes by dividing the amount
  // of seconds by the amount of seconds in a minute.
  factor: _units.minute,
  // "minute" labels are used for formatting the output.
  unit: 'minute'
}, {
  // This step is effective starting from 22.5 minutes.
  threshold: 22.5 * _units.minute,
  // Return the amount of minutes by dividing the amount
  // of seconds by the amount of seconds in  half-an-hour.
  factor: 0.5 * _units.hour,
  // "half-hour" labels are used for formatting the output.
  // (if available, which is no longer the case)
  unit: 'half-hour'
}, {
  // This step is effective starting from 42.5 minutes.
  threshold: 42.5 * _units.minute,
  threshold_for_minute: 52.5 * _units.minute,
  // Return the amount of minutes by dividing the amount
  // of seconds by the amount of seconds in an hour.
  factor: _units.hour,
  // "hour" labels are used for formatting the output.
  unit: 'hour'
}, {
  // This step is effective starting from 20.5 hours.
  threshold: 20.5 / 24 * _units.day,
  // Return the amount of minutes by dividing the amount
  // of seconds by the amount of seconds in a day.
  factor: _units.day,
  // "day" labels are used for formatting the output.
  unit: 'day'
}, {
  // This step is effective starting from 5.5 days.
  threshold: 5.5 * _units.day,
  // Return the amount of minutes by dividing the amount
  // of seconds by the amount of seconds in a week.
  factor: _units.week,
  // "week" labels are used for formatting the output.
  unit: 'week'
}, {
  // This step is effective starting from 3.5 weeks.
  threshold: 3.5 * _units.week,
  // Return the amount of minutes by dividing the amount
  // of seconds by the amount of seconds in a month.
  factor: _units.month,
  // "month" labels are used for formatting the output.
  unit: 'month'
}, {
  // This step is effective starting from 10.5 months.
  threshold: 10.5 * _units.month,
  // Return the amount of minutes by dividing the amount
  // of seconds by the amount of seconds in a year.
  factor: _units.year,
  // "year" labels are used for formatting the output.
  unit: 'year'
}];
exports["default"] = _default;

},{"./units.js":49}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getStep;

var _getStepDenominator = _interopRequireDefault(require("./getStepDenominator.js"));

var _getStepMinTime = _interopRequireDefault(require("./getStepMinTime.js"));

var _round = require("../round.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Finds an appropriate `step` of `steps` for the time interval (in seconds).
 *
 * @param {Object[]} steps - Time formatting steps.
 *
 * @param {number} secondsPassed - Time interval (in seconds).
 *                                 `< 0` for past dates and `> 0` for future dates.
 *
 * @param {number} options.now - Current timestamp.
 *
 * @param {boolean} [options.future] - Whether the date should be formatted as a future one
 *                                     instead of a past one.
 *
 * @param {string} [options.round] - (undocumented) Rounding mechanism.
 *
 * @param {string[]} [options.units] - A list of allowed time units.
 *                                     (Example: ['second', 'minute', 'hour', …])
 *
 * @param {boolean} [options.getNextStep] - Pass true to return `[step, nextStep]` instead of just `step`.
 *
 * @return {Object|Object[]} [step] — Either a `step` or `[prevStep, step, nextStep]`.
 */
function getStep(steps, secondsPassed, _ref) {
  var now = _ref.now,
      future = _ref.future,
      round = _ref.round,
      units = _ref.units,
      getNextStep = _ref.getNextStep;
  // Ignore steps having not-supported time units in `formatAs`.
  steps = filterStepsByUnits(steps, units);

  var step = _getStep(steps, secondsPassed, {
    now: now,
    future: future,
    round: round
  });

  if (getNextStep) {
    if (step) {
      var prevStep = steps[steps.indexOf(step) - 1];
      var nextStep = steps[steps.indexOf(step) + 1];
      return [prevStep, step, nextStep];
    }

    return [undefined, undefined, steps[0]];
  }

  return step;
}

function _getStep(steps, secondsPassed, _ref2) {
  var now = _ref2.now,
      future = _ref2.future,
      round = _ref2.round;

  // If no steps fit the conditions then return nothing.
  if (steps.length === 0) {
    return;
  } // Find the most appropriate step.


  var i = getStepIndex(steps, secondsPassed, {
    now: now,
    future: future || secondsPassed < 0,
    round: round
  }); // If no step is applicable the return nothing.

  if (i === -1) {
    return;
  }

  var step = steps[i]; // Apply granularity to the time amount
  // (and fall back to the previous step
  //  if the first level of granularity
  //  isn't met by this amount)

  if (step.granularity) {
    // Recalculate the amount of seconds passed based on `granularity`.
    var secondsPassedGranular = (0, _round.getRoundFunction)(round)(Math.abs(secondsPassed) / (0, _getStepDenominator["default"])(step) / step.granularity) * step.granularity; // If the granularity for this step is too high,
    // then fall back to the previous step.
    // (if there is any previous step)

    if (secondsPassedGranular === 0 && i > 0) {
      return steps[i - 1];
    }
  }

  return step;
}
/**
 * Iterates through steps until it finds the maximum one satisfying the `minTime` threshold.
 * @param  {Object} steps - Steps.
 * @param  {number} secondsPassed - How much seconds have passed since the date till `now`.
 * @param  {number} options.now - Current timestamp.
 * @param  {boolean} options.future - Whether the time interval should be formatted as a future one.
 * @param  {number} [i] - Gradation step currently being tested.
 * @return {number} Gradation step index.
 */


function getStepIndex(steps, secondsPassed, options) {
  var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var minTime = (0, _getStepMinTime["default"])(steps[i], _objectSpread({
    prevStep: steps[i - 1],
    timestamp: options.now - secondsPassed * 1000
  }, options)); // If `minTime` isn't defined or deduceable for this step, then stop.

  if (minTime === undefined) {
    return i - 1;
  } // If the `minTime` threshold for moving from previous step
  // to this step is too high then return the previous step.


  if (Math.abs(secondsPassed) < minTime) {
    return i - 1;
  } // If it's the last step then return it.


  if (i === steps.length - 1) {
    return i;
  } // Move to the next step.


  return getStepIndex(steps, secondsPassed, options, i + 1);
}
/**
 * Leaves only allowed steps.
 * @param  {Object[]} steps
 * @param  {string[]} units - Allowed time units.
 * @return {Object[]}
 */


function filterStepsByUnits(steps, units) {
  return steps.filter(function (_ref3) {
    var unit = _ref3.unit,
        formatAs = _ref3.formatAs;
    // "unit" is now called "formatAs".
    unit = unit || formatAs; // If this step has a `unit` defined
    // then this `unit` must be in the list of allowed `units`.

    if (unit) {
      return units.indexOf(unit) >= 0;
    } // A step is not required to specify a `unit`:
    // alternatively, it could specify `format()`.
    // (see "twitter" style for an example)


    return true;
  });
}

},{"../round.js":38,"./getStepDenominator.js":41,"./getStepMinTime.js":42}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getStepDenominator;

var _units = require("./units.js");

function getStepDenominator(step) {
  // `factor` is a legacy property.
  if (step.factor !== undefined) {
    return step.factor;
  } // "unit" is now called "formatAs".


  return (0, _units.getSecondsInUnit)(step.unit || step.formatAs) || 1;
}

},{"./units.js":49}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getStepMinTime;

var _units = require("./units.js");

var _round = require("../round.js");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function getStepMinTime(step, _ref) {
  var prevStep = _ref.prevStep,
      timestamp = _ref.timestamp,
      now = _ref.now,
      future = _ref.future,
      round = _ref.round;
  var minTime; // "threshold_for_xxx" is a legacy property.

  if (prevStep) {
    if (prevStep.id || prevStep.unit) {
      minTime = step["threshold_for_".concat(prevStep.id || prevStep.unit)];
    }
  }

  if (minTime === undefined) {
    // "threshold" is a legacy property.
    if (step.threshold !== undefined) {
      // "threshold" is a legacy name for "minTime".
      minTime = step.threshold; // "threshold" function is deprecated.

      if (typeof minTime === 'function') {
        minTime = minTime(now, future);
      }
    }
  }

  if (minTime === undefined) {
    minTime = step.minTime;
  } // A deprecated way of specifying a different threshold
  // depending on the previous step's unit.


  if (_typeof(minTime) === 'object') {
    if (prevStep && prevStep.id && minTime[prevStep.id] !== undefined) {
      minTime = minTime[prevStep.id];
    } else {
      minTime = minTime["default"];
    }
  }

  if (typeof minTime === 'function') {
    minTime = minTime(timestamp, {
      future: future,
      getMinTimeForUnit: function getMinTimeForUnit(toUnit, fromUnit) {
        return _getMinTimeForUnit(toUnit, fromUnit || prevStep && prevStep.formatAs, {
          round: round
        });
      }
    });
  } // Evaluate the `test()` function.
  // `test()` function is deprecated.


  if (minTime === undefined) {
    if (step.test) {
      if (step.test(timestamp, {
        now: now,
        future: future
      })) {
        // `0` threshold always passes.
        minTime = 0;
      } else {
        // `MAX_SAFE_INTEGER` threshold won't ever pass in real life.
        minTime = 9007199254740991; // Number.MAX_SAFE_INTEGER
      }
    }
  }

  if (minTime === undefined) {
    if (prevStep) {
      if (step.formatAs && prevStep.formatAs) {
        minTime = _getMinTimeForUnit(step.formatAs, prevStep.formatAs, {
          round: round
        });
      }
    } else {
      // The first step's `minTime` is `0` by default.
      minTime = 0;
    }
  } // Warn if no `minTime` was defined or could be deduced.


  if (minTime === undefined) {
    console.warn('[javascript-time-ago] A step should specify `minTime`:\n' + JSON.stringify(step, null, 2));
  }

  return minTime;
}

function _getMinTimeForUnit(toUnit, fromUnit, _ref2) {
  var round = _ref2.round;
  var toUnitAmount = (0, _units.getSecondsInUnit)(toUnit); // if (!fromUnit) {
  // 	return toUnitAmount;
  // }
  // if (!fromUnit) {
  // 	fromUnit = getPreviousUnitFor(toUnit)
  // }

  var fromUnitAmount;

  if (fromUnit === 'now') {
    fromUnitAmount = (0, _units.getSecondsInUnit)(toUnit);
  } else {
    fromUnitAmount = (0, _units.getSecondsInUnit)(fromUnit);
  }

  if (toUnitAmount !== undefined && fromUnitAmount !== undefined) {
    return toUnitAmount - fromUnitAmount * (1 - (0, _round.getDiffRatioToNextRoundedNumber)(round));
  }
}

},{"../round.js":38,"./units.js":49}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INFINITY = void 0;
exports["default"] = getTimeToNextUpdate;
exports.getStepChangesAt = getStepChangesAt;
exports.getTimeToStepChange = getTimeToStepChange;

var _getTimeToNextUpdateForUnit2 = _interopRequireDefault(require("./getTimeToNextUpdateForUnit.js"));

var _getStepMinTime = _interopRequireDefault(require("./getStepMinTime.js"));

var _round = require("../round.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// A thousand years is practically a metaphor for "infinity".
var YEAR = 365 * 24 * 60 * 60 * 1000;
var INFINITY = 1000 * YEAR;
/**
 * Gets the time to next update for a date and a step.
 * @param  {number} date — The date passed to `.format()`, converted to a timestamp.
 * @param  {object} step
 * @param  {object} [options.previousStep]
 * @param  {object} [options.nextStep]
 * @param  {number} options.now
 * @param  {boolean} options.future
 * @param  {string} [options.round] - (undocumented) Rounding mechanism.
 * @return {number} [timeToNextUpdate]
 */

exports.INFINITY = INFINITY;

function getTimeToNextUpdate(date, step, _ref) {
  var prevStep = _ref.prevStep,
      nextStep = _ref.nextStep,
      now = _ref.now,
      future = _ref.future,
      round = _ref.round;
  var timestamp = date.getTime ? date.getTime() : date;

  var getTimeToNextUpdateForUnit = function getTimeToNextUpdateForUnit(unit) {
    return (0, _getTimeToNextUpdateForUnit2["default"])(unit, timestamp, {
      now: now,
      round: round
    });
  }; // For future dates, steps move from the last one to the first one,
  // while for past dates, steps move from the first one to the last one,
  // due to the fact that time flows in one direction,
  // and future dates' interval naturally becomes smaller
  // while past dates' interval naturally grows larger.
  //
  // For future dates, it's the transition
  // from the current step to the previous step,
  // therefore check the `minTime` of the current step.
  //
  // For past dates, it's the transition
  // from the current step to the next step,
  // therefore check the `minTime` of the next step.
  //


  var timeToStepChange = getTimeToStepChange(future ? step : nextStep, timestamp, {
    future: future,
    now: now,
    round: round,
    prevStep: future ? prevStep : step // isFirstStep: future && isFirstStep

  });

  if (timeToStepChange === undefined) {
    // Can't reliably determine "time to next update"
    // if not all of the steps provide `minTime`.
    return;
  }

  var timeToNextUpdate;

  if (step) {
    if (step.getTimeToNextUpdate) {
      timeToNextUpdate = step.getTimeToNextUpdate(timestamp, {
        getTimeToNextUpdateForUnit: getTimeToNextUpdateForUnit,
        getRoundFunction: _round.getRoundFunction,
        now: now,
        future: future,
        round: round
      });
    }

    if (timeToNextUpdate === undefined) {
      // "unit" is now called "formatAs".
      var unit = step.unit || step.formatAs;

      if (unit) {
        // For some units, like "now", there's no defined amount of seconds in them.
        // In such cases, `getTimeToNextUpdateForUnit()` returns `undefined`,
        // and the next step's `minTime` could be used to calculate the update interval:
        // it will just assume that the label never changes for this step.
        timeToNextUpdate = getTimeToNextUpdateForUnit(unit);
      }
    }
  }

  if (timeToNextUpdate === undefined) {
    return timeToStepChange;
  }

  return Math.min(timeToNextUpdate, timeToStepChange);
}

function getStepChangesAt(currentOrNextStep, timestamp, _ref2) {
  var now = _ref2.now,
      future = _ref2.future,
      round = _ref2.round,
      prevStep = _ref2.prevStep;
  // The first step's `minTime` is `0` by default.
  // It doesn't "change" steps at zero point
  // but it does change the wording when switching
  // from "future" to "past": "in ..." -> "... ago".
  // Therefore, the label should be updated at zero-point too.
  var minTime = (0, _getStepMinTime["default"])(currentOrNextStep, {
    timestamp: timestamp,
    now: now,
    future: future,
    round: round,
    prevStep: prevStep
  });

  if (minTime === undefined) {
    return;
  }

  if (future) {
    // The step changes to the previous step
    // as soon as `timestamp - now` becomes
    // less than the `minTime` of the current step:
    // `timestamp - now === minTime - 1`
    // => `now === timestamp - minTime + 1`.
    return timestamp - minTime * 1000 + 1;
  } else {
    // The step changes to the next step
    // as soon as `now - timestamp` becomes
    // equal to `minTime` of the next step:
    // `now - timestamp === minTime`
    // => `now === timestamp + minTime`.
    // This is a special case when double-update could be skipped.
    if (minTime === 0 && timestamp === now) {
      return INFINITY;
    }

    return timestamp + minTime * 1000;
  }
}

function getTimeToStepChange(step, timestamp, _ref3) {
  var now = _ref3.now,
      future = _ref3.future,
      round = _ref3.round,
      prevStep = _ref3.prevStep;

  if (step) {
    var stepChangesAt = getStepChangesAt(step, timestamp, {
      now: now,
      future: future,
      round: round,
      prevStep: prevStep
    });

    if (stepChangesAt === undefined) {
      return;
    }

    return stepChangesAt - now;
  } else {
    if (future) {
      // No step.
      // Update right after zero point, when it changes from "future" to "past".
      return timestamp - now + 1;
    } else {
      // The last step doesn't ever change when `date` is in the past.
      return INFINITY;
    }
  }
}

},{"../round.js":38,"./getStepMinTime.js":42,"./getTimeToNextUpdateForUnit.js":44}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getTimeToNextUpdateForUnit;

var _units = require("./units.js");

var _round = require("../round.js");

/**
 * Gets the time to next update for a step with a time unit defined.
 * @param  {string} unit
 * @param  {number} date — The date passed to `.format()`, converted to a timestamp.
 * @param  {number} options.now
 * @param  {string} [options.round] — (undocumented) Rounding mechanism.
 * @return {number} [timeToNextUpdate]
 */
function getTimeToNextUpdateForUnit(unit, timestamp, _ref) {
  var now = _ref.now,
      round = _ref.round;

  // For some units, like "now", there's no defined amount of seconds in them.
  if (!(0, _units.getSecondsInUnit)(unit)) {
    // If there's no amount of seconds defined for this unit
    // then the update interval can't be determined reliably.
    return;
  }

  var unitDenominator = (0, _units.getSecondsInUnit)(unit) * 1000;
  var future = timestamp > now;
  var preciseAmount = Math.abs(timestamp - now);
  var roundedAmount = (0, _round.getRoundFunction)(round)(preciseAmount / unitDenominator) * unitDenominator;

  if (future) {
    if (roundedAmount > 0) {
      // Amount decreases with time.
      return preciseAmount - roundedAmount + getDiffToPreviousRoundedNumber(round, unitDenominator);
    } else {
      // Refresh right after the zero point,
      // when "future" changes to "past".
      return preciseAmount - roundedAmount + 1;
    }
  } // Amount increases with time.


  return -(preciseAmount - roundedAmount) + getDiffToNextRoundedNumber(round, unitDenominator);
}

function getDiffToNextRoundedNumber(round, unitDenominator) {
  return (0, _round.getDiffRatioToNextRoundedNumber)(round) * unitDenominator;
}

function getDiffToPreviousRoundedNumber(round, unitDenominator) {
  return (1 - (0, _round.getDiffRatioToNextRoundedNumber)(round)) * unitDenominator + 1;
}

},{"../round.js":38,"./units.js":49}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDate = getDate;

// Looks like this one's deprecated.
// /**
//  * Returns a step corresponding to the unit.
//  * @param  {Object[]} steps
//  * @param  {string} unit
//  * @return {?Object}
//  */
// export function getStepForUnit(steps, unit) {
// 	for (const step of steps) {
// 		if (step.unit === unit) {
// 			return step
// 		}
// 	}
// }
// Looks like this one won't be used in the next major version.

/**
 * Converts value to a `Date`
 * @param {(number|Date)} value
 * @return {Date}
 */
function getDate(value) {
  return value instanceof Date ? value : new Date(value);
}

},{}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "approximate", {
  enumerable: true,
  get: function get() {
    return _approximate["default"];
  }
});
Object.defineProperty(exports, "canonical", {
  enumerable: true,
  get: function get() {
    return _round["default"];
  }
});
Object.defineProperty(exports, "convenient", {
  enumerable: true,
  get: function get() {
    return _approximate["default"];
  }
});
Object.defineProperty(exports, "day", {
  enumerable: true,
  get: function get() {
    return _units.day;
  }
});
Object.defineProperty(exports, "getDate", {
  enumerable: true,
  get: function get() {
    return _helpers.getDate;
  }
});
Object.defineProperty(exports, "hour", {
  enumerable: true,
  get: function get() {
    return _units.hour;
  }
});
Object.defineProperty(exports, "minute", {
  enumerable: true,
  get: function get() {
    return _units.minute;
  }
});
Object.defineProperty(exports, "month", {
  enumerable: true,
  get: function get() {
    return _units.month;
  }
});
Object.defineProperty(exports, "round", {
  enumerable: true,
  get: function get() {
    return _round["default"];
  }
});
Object.defineProperty(exports, "week", {
  enumerable: true,
  get: function get() {
    return _units.week;
  }
});
Object.defineProperty(exports, "year", {
  enumerable: true,
  get: function get() {
    return _units.year;
  }
});

var _approximate = _interopRequireDefault(require("./approximate.js"));

var _round = _interopRequireDefault(require("./round.js"));

var _units = require("./units.js");

var _helpers = require("./helpers.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

},{"./approximate.js":39,"./helpers.js":45,"./round.js":48,"./units.js":49}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// This function is only used for backwards compatibility
// with legacy code that uses the older versions of this library.
function _default(step_) {
  var step = _objectSpread({}, step_);

  if (step.minTime !== undefined) {
    if (_typeof(step.minTime) === 'object') {
      for (var _i = 0, _Object$keys = Object.keys(step.minTime); _i < _Object$keys.length; _i++) {
        var key = _Object$keys[_i];

        if (key === 'default') {
          step.threshold = step.minTime["default"];
        } else {
          step["threshold_for_".concat(key)] = step.minTime[key];
        }
      }
    } else {
      step.threshold = step.minTime;
    }

    delete step.minTime;
  }

  if (step.formatAs) {
    step.unit = step.formatAs;
    delete step.formatAs;
  }

  return step;
}

},{}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// just now
// 1 second ago
// 2 seconds ago
// …
// 59 seconds ago
// 1 minute ago
// 2 minutes ago
// …
// 59 minutes ago
// 1 hour ago
// 2 hours ago
// …
// 24 hours ago
// 1 day ago
// 2 days ago
// …
// 6 days ago
// 1 week ago
// 2 weeks ago
// …
// 3 weeks ago
// 1 month ago
// 2 months ago
// …
// 11 months ago
// 1 year ago
// 2 years ago
// …
var _default = [{
  formatAs: 'now'
}, {
  formatAs: 'second'
}, {
  formatAs: 'minute'
}, {
  formatAs: 'hour'
}, {
  formatAs: 'day'
}, {
  formatAs: 'week'
}, {
  formatAs: 'month'
}, {
  formatAs: 'year'
}];
exports["default"] = _default;

},{}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.day = void 0;
exports.getSecondsInUnit = getSecondsInUnit;
exports.year = exports.week = exports.month = exports.minute = exports.hour = void 0;
var minute = 60; // in seconds

exports.minute = minute;
var hour = 60 * minute; // in seconds

exports.hour = hour;
var day = 24 * hour; // in seconds

exports.day = day;
var week = 7 * day; // in seconds
// https://www.quora.com/What-is-the-average-number-of-days-in-a-month

exports.week = week;
var month = 30.44 * day; // in seconds
// "400 years have 146097 days (taking into account leap year rules)"

exports.month = month;
var year = 146097 / 400 * day; // in seconds

exports.year = year;

function getSecondsInUnit(unit) {
  switch (unit) {
    case 'second':
      return 1;

    case 'minute':
      return minute;

    case 'hour':
      return hour;

    case 'day':
      return day;

    case 'week':
      return week;

    case 'month':
      return month;

    case 'year':
      return year;
  }
} // export function getPreviousUnitFor(unit) {
// 	switch (unit) {
// 		case 'second':
// 			return 'now'
// 		case 'minute':
// 			return 'second'
// 		case 'hour':
// 			return 'minute'
// 		case 'day':
// 			return 'hour'
// 		case 'week':
// 			return 'day'
// 		case 'month':
// 			return 'week'
// 		case 'year':
// 			return 'month'
// 	}
// }

},{}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _approximate = _interopRequireDefault(require("../steps/approximate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// "gradation" is a legacy name for "steps".
// It's here just for legacy compatibility.
// Use "steps" name instead.
// "flavour" is a legacy name for "labels".
// It's here just for legacy compatibility.
// Use "labels" name instead.
// "units" is a legacy property.
// It's here just for legacy compatibility.
// Developers shouldn't need to use it in their custom styles.
var _default = {
  gradation: _approximate["default"],
  flavour: 'long',
  units: ['now', 'minute', 'hour', 'day', 'week', 'month', 'year']
};
exports["default"] = _default;

},{"../steps/approximate.js":39}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _approximate = _interopRequireDefault(require("../steps/approximate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// "gradation" is a legacy name for "steps".
// It's here just for legacy compatibility.
// Use "steps" name instead.
// "flavour" is a legacy name for "labels".
// It's here just for legacy compatibility.
// Use "labels" name instead.
// "units" is a legacy property.
// It's here just for legacy compatibility.
// Developers shouldn't need to use it in their custom styles.
// Similar to the default style but with "ago" omitted.
//
// just now
// 5 minutes
// 10 minutes
// 15 minutes
// 20 minutes
// an hour
// 2 hours
// …
// 20 hours
// 1 day
// 2 days
// a week
// 2 weeks
// 3 weeks
// a month
// 2 months
// 3 months
// 4 months
// a year
// 2 years
//
var _default = {
  gradation: _approximate["default"],
  flavour: 'long-time',
  units: ['now', 'minute', 'hour', 'day', 'week', 'month', 'year']
};
exports["default"] = _default;

},{"../steps/approximate.js":39}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getStyleByName;

var _round = _interopRequireDefault(require("./round.js"));

var _roundMinute = _interopRequireDefault(require("./roundMinute.js"));

var _approximate = _interopRequireDefault(require("./approximate.js"));

var _approximateTime = _interopRequireDefault(require("./approximateTime.js"));

var _twitter = _interopRequireDefault(require("./twitter.js"));

var _twitterNow = _interopRequireDefault(require("./twitterNow.js"));

var _twitterMinute = _interopRequireDefault(require("./twitterMinute.js"));

var _twitterMinuteNow = _interopRequireDefault(require("./twitterMinuteNow.js"));

var _twitterFirstMinute = _interopRequireDefault(require("./twitterFirstMinute.js"));

var _mini = _interopRequireDefault(require("./mini.js"));

var _miniNow = _interopRequireDefault(require("./miniNow.js"));

var _miniMinute = _interopRequireDefault(require("./miniMinute.js"));

var _miniMinuteNow = _interopRequireDefault(require("./miniMinuteNow.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// `approximate` style is deprecated.
// `approximateTime` style is deprecated.
function getStyleByName(style) {
  switch (style) {
    // "default" style name is deprecated.
    case 'default':
    case 'round':
      return _round["default"];

    case 'round-minute':
      return _roundMinute["default"];

    case 'approximate':
      return _approximate["default"];
    // "time" style name is deprecated.

    case 'time':
    case 'approximate-time':
      return _approximateTime["default"];

    case 'mini':
      return _mini["default"];

    case 'mini-now':
      return _miniNow["default"];

    case 'mini-minute':
      return _miniMinute["default"];

    case 'mini-minute-now':
      return _miniMinuteNow["default"];

    case 'twitter':
      return _twitter["default"];

    case 'twitter-now':
      return _twitterNow["default"];

    case 'twitter-minute':
      return _twitterMinute["default"];

    case 'twitter-minute-now':
      return _twitterMinuteNow["default"];

    case 'twitter-first-minute':
      return _twitterFirstMinute["default"];

    default:
      // For historical reasons, the default style is "approximate".
      return _approximate["default"];
  }
}

},{"./approximate.js":50,"./approximateTime.js":51,"./mini.js":53,"./miniMinute.js":54,"./miniMinuteNow.js":55,"./miniNow.js":56,"./round.js":58,"./roundMinute.js":59,"./twitter.js":60,"./twitterFirstMinute.js":61,"./twitterMinute.js":62,"./twitterMinuteNow.js":63,"./twitterNow.js":64}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  steps: [{
    formatAs: 'second'
  }, {
    formatAs: 'minute'
  }, {
    formatAs: 'hour'
  }, {
    formatAs: 'day'
  }, {
    formatAs: 'month'
  }, {
    formatAs: 'year'
  }],
  labels: [// "mini" labels are only defined for a few languages.
  'mini', // "short-time" labels are only defined for a few languages.
  'short-time', // "narrow" and "short" labels are defined for all languages.
  // "narrow" labels can sometimes be weird (like "+5d."),
  // but "short" labels have the " ago" part, so "narrow" seem
  // more appropriate.
  // "short" labels would have been more appropriate if they
  // didn't have the " ago" part, hence the "short-time" above.
  'narrow', // Since "narrow" labels are always present, "short" element
  // of this array can be removed.
  'short']
};
exports["default"] = _default;

},{}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mini = _interopRequireDefault(require("./mini.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = _objectSpread(_objectSpread({}, _mini["default"]), {}, {
  // Skip "seconds".
  steps: _mini["default"].steps.filter(function (step) {
    return step.formatAs !== 'second';
  })
});

exports["default"] = _default;

},{"./mini.js":53}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _miniMinute = _interopRequireDefault(require("./miniMinute.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = _objectSpread(_objectSpread({}, _miniMinute["default"]), {}, {
  // Add "now".
  steps: [{
    formatAs: 'now'
  }].concat(_miniMinute["default"].steps)
});

exports["default"] = _default;

},{"./miniMinute.js":54}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mini = _interopRequireDefault(require("./mini.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = _objectSpread(_objectSpread({}, _mini["default"]), {}, {
  // Add "now".
  steps: [{
    formatAs: 'now'
  }].concat(_mini["default"].steps)
});

exports["default"] = _default;

},{"./mini.js":53}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _renameLegacyProperties = _interopRequireDefault(require("../steps/renameLegacyProperties.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// This function is only used for backwards compatibility
// with legacy code that uses the older versions of this library.
function _default(style_) {
  var style = _objectSpread({}, style_);

  if (style.steps) {
    style.gradation = style.steps.map(_renameLegacyProperties["default"]);
    delete style.steps;
  }

  if (style.labels) {
    style.flavour = style.labels;
    delete style.labels;
  }

  return style;
}

},{"../steps/renameLegacyProperties.js":47}],58:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _round = _interopRequireDefault(require("../steps/round.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// just now
// 1 second ago
// 2 seconds ago
// …
// 59 seconds ago
// 1 minute ago
// 2 minutes ago
// …
// 59 minutes ago
// 1 minute ago
// 2 minutes ago
// …
// 59 minutes ago
// 1 hour ago
// 2 hours ago
// …
// 24 hours ago
// 1 day ago
// 2 days ago
// …
// 6 days ago
// 1 week ago
// 2 weeks ago
// 3 weeks ago
// 4 weeks ago
// 1 month ago
// 2 months ago
// …
// 11 months ago
// 1 year ago
// 2 years ago
// …
//
var _default = {
  steps: _round["default"],
  labels: 'long'
};
exports["default"] = _default;

},{"../steps/round.js":48}],59:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _round = _interopRequireDefault(require("./round.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// just now
// 1 minute ago
// 2 minutes ago
// …
// 59 minutes ago
// 1 minute ago
// 2 minutes ago
// …
// 59 minutes ago
// 1 hour ago
// 2 hours ago
// …
// 24 hours ago
// 1 day ago
// 2 days ago
// …
// 6 days ago
// 1 week ago
// 2 weeks ago
// 3 weeks ago
// 4 weeks ago
// 1 month ago
// 2 months ago
// …
// 11 months ago
// 1 year ago
// 2 years ago
// …
//
var _default = _objectSpread(_objectSpread({}, _round["default"]), {}, {
  // Skip "seconds".
  steps: _round["default"].steps.filter(function (step) {
    return step.formatAs !== 'second';
  })
});

exports["default"] = _default;

},{"./round.js":58}],60:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = require("../steps/index.js");

var _locale = require("../locale.js");

var _renameLegacyProperties = _interopRequireDefault(require("./renameLegacyProperties.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// For compatibility with the old versions of this library.
// Twitter-style relative date/time formatting.
// ("1m", "2h", "Mar 3", "Apr 4, 2012").
//
// Seconds, minutes or hours are shown for shorter intervals,
// and longer intervals are formatted using full date format.
var steps = [{
  formatAs: 'second'
}, {
  formatAs: 'minute'
}, {
  formatAs: 'hour'
}]; // A cache for `Intl.DateTimeFormat` formatters
// for various locales (is a global variable).

var formatters = {}; // Starting from day intervals, output month and day.

var monthAndDay = {
  minTime: function minTime(timestamp, _ref) {
    var future = _ref.future,
        getMinTimeForUnit = _ref.getMinTimeForUnit;
    // Returns `23.5 * 60 * 60` when `round` is "round",
    // and `24 * 60 * 60` when `round` is "floor".
    return getMinTimeForUnit('day');
  },
  format: function format(value, locale) {
    /* istanbul ignore else */
    if (!formatters[locale]) {
      formatters[locale] = {};
    }
    /* istanbul ignore else */


    if (!formatters[locale].dayMonth) {
      // "Apr 11" (MMMd)
      formatters[locale].dayMonth = new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric'
      });
    } // Output month and day.


    return formatters[locale].dayMonth.format((0, _index.getDate)(value));
  }
}; // If the `date` happened/happens outside of current year,
// then output day, month and year.
// The interval should be such that the `date` lies outside of the current year.

var yearMonthAndDay = {
  minTime: function minTime(timestamp, _ref2) {
    var future = _ref2.future;

    if (future) {
      // January 1, 00:00, of the `date`'s year is right after
      // the maximum `now` for formatting a future date:
      // When `now` is before that date, the `date` is formatted as "day/month/year" (this step),
      // When `now` is equal to or after that date, the `date` is formatted as "day/month" (another step).
      // After that, it's hours, minutes, seconds, and after that it's no longer `future`.
      // The date is right after the maximum `now` for formatting a future date,
      // so subtract 1 millisecond from it.
      var maxFittingNow = new Date(new Date(timestamp).getFullYear(), 0).getTime() - 1; // Return `minTime` (in seconds).

      return (timestamp - maxFittingNow) / 1000;
    } else {
      // January 1, 00:00, of the year following the `date`'s year
      // is the minimum `now` for formatting a past date:
      // When `now` is before that date, the `date` is formatted as "day/month" (another step),
      // When `now` is equal to or after that date, the `date` is formatted as "day/month/year" (this step).
      // After that, it's hours, minutes, seconds, and after that it's no longer `future`.
      var minFittingNow = new Date(new Date(timestamp).getFullYear() + 1, 0).getTime(); // Return `minTime` (in seconds).

      return (minFittingNow - timestamp) / 1000;
    }
  },
  format: function format(value, locale) {
    /* istanbul ignore if */
    if (!formatters[locale]) {
      formatters[locale] = {};
    }
    /* istanbul ignore else */


    if (!formatters[locale].dayMonthYear) {
      // "Apr 11, 2017" (yMMMd)
      formatters[locale].dayMonthYear = new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } // Output day, month and year.


    return formatters[locale].dayMonthYear.format((0, _index.getDate)(value));
  }
}; // If `Intl.DateTimeFormat` is supported,
// then longer time intervals will be formatted as dates.

/* istanbul ignore else */

if ((0, _locale.intlDateTimeFormatSupported)()) {
  steps.push(monthAndDay, yearMonthAndDay);
} // Otherwise, if `Intl.DateTimeFormat` is not supported,
// which could be the case when using Internet Explorer,
// then simply mimick "round" steps.
else {
  steps.push({
    formatAs: 'day'
  }, {
    formatAs: 'week'
  }, {
    formatAs: 'month'
  }, {
    formatAs: 'year'
  });
}

var _default = {
  steps: steps,
  labels: [// "mini" labels are only defined for a few languages.
  'mini', // "short-time" labels are only defined for a few languages.
  'short-time', // "narrow" and "short" labels are defined for all languages.
  // "narrow" labels can sometimes be weird (like "+5d."),
  // but "short" labels have the " ago" part, so "narrow" seem
  // more appropriate.
  // "short" labels would have been more appropriate if they
  // didn't have the " ago" part, hence the "short-time" above.
  'narrow', // Since "narrow" labels are always present, "short" element
  // of this array can be removed.
  'short']
};
exports["default"] = _default;

},{"../locale.js":37,"../steps/index.js":46,"./renameLegacyProperties.js":57}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _units = require("../steps/units.js");

var _twitter = _interopRequireDefault(require("./twitter.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = _objectSpread(_objectSpread({}, _twitter["default"]), {}, {
  // Skip "seconds".
  steps: _twitter["default"].steps.filter(function (step) {
    return step.formatAs !== 'second';
  }) // Start showing `1m` from the first minute.
  .map(function (step) {
    return step.formatAs === 'minute' ? _objectSpread(_objectSpread({}, step), {}, {
      minTime: _units.minute
    }) : step;
  })
});

exports["default"] = _default;

},{"../steps/units.js":49,"./twitter.js":60}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _twitter = _interopRequireDefault(require("./twitter.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = _objectSpread(_objectSpread({}, _twitter["default"]), {}, {
  // Skip "seconds".
  steps: _twitter["default"].steps.filter(function (step) {
    return step.formatAs !== 'second';
  })
});

exports["default"] = _default;

},{"./twitter.js":60}],63:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _twitterMinute = _interopRequireDefault(require("./twitterMinute.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = _objectSpread(_objectSpread({}, _twitterMinute["default"]), {}, {
  // Add "now".
  steps: [{
    formatAs: 'now'
  }].concat(_twitterMinute["default"].steps)
});

exports["default"] = _default;

},{"./twitterMinute.js":62}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _twitter = _interopRequireDefault(require("./twitter.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = _objectSpread(_objectSpread({}, _twitter["default"]), {}, {
  // Add "now".
  steps: [{
    formatAs: 'now'
  }].concat(_twitter["default"].steps)
});

exports["default"] = _default;

},{"./twitter.js":60}],65:[function(require,module,exports){
'use strict'

exports = module.exports = require('./commonjs/TimeAgo.js').default
exports['default'] = require('./commonjs/TimeAgo.js').default

var locale = require('./commonjs/locale.js')

exports.intlDateTimeFormatSupported = locale.intlDateTimeFormatSupported
exports.intlDateTimeFormatSupportedLocale = locale.intlDateTimeFormatSupportedLocale
},{"./commonjs/TimeAgo.js":34,"./commonjs/locale.js":37}],66:[function(require,module,exports){
module.exports={
	"locale": "en",
	"long": {
		"year": {
			"previous": "last year",
			"current": "this year",
			"next": "next year",
			"past": {
				"one": "{0} year ago",
				"other": "{0} years ago"
			},
			"future": {
				"one": "in {0} year",
				"other": "in {0} years"
			}
		},
		"quarter": {
			"previous": "last quarter",
			"current": "this quarter",
			"next": "next quarter",
			"past": {
				"one": "{0} quarter ago",
				"other": "{0} quarters ago"
			},
			"future": {
				"one": "in {0} quarter",
				"other": "in {0} quarters"
			}
		},
		"month": {
			"previous": "last month",
			"current": "this month",
			"next": "next month",
			"past": {
				"one": "{0} month ago",
				"other": "{0} months ago"
			},
			"future": {
				"one": "in {0} month",
				"other": "in {0} months"
			}
		},
		"week": {
			"previous": "last week",
			"current": "this week",
			"next": "next week",
			"past": {
				"one": "{0} week ago",
				"other": "{0} weeks ago"
			},
			"future": {
				"one": "in {0} week",
				"other": "in {0} weeks"
			}
		},
		"day": {
			"previous": "yesterday",
			"current": "today",
			"next": "tomorrow",
			"past": {
				"one": "{0} day ago",
				"other": "{0} days ago"
			},
			"future": {
				"one": "in {0} day",
				"other": "in {0} days"
			}
		},
		"hour": {
			"current": "this hour",
			"past": {
				"one": "{0} hour ago",
				"other": "{0} hours ago"
			},
			"future": {
				"one": "in {0} hour",
				"other": "in {0} hours"
			}
		},
		"minute": {
			"current": "this minute",
			"past": {
				"one": "{0} minute ago",
				"other": "{0} minutes ago"
			},
			"future": {
				"one": "in {0} minute",
				"other": "in {0} minutes"
			}
		},
		"second": {
			"current": "now",
			"past": {
				"one": "{0} second ago",
				"other": "{0} seconds ago"
			},
			"future": {
				"one": "in {0} second",
				"other": "in {0} seconds"
			}
		}
	},
	"short": {
		"year": {
			"previous": "last yr.",
			"current": "this yr.",
			"next": "next yr.",
			"past": "{0} yr. ago",
			"future": "in {0} yr."
		},
		"quarter": {
			"previous": "last qtr.",
			"current": "this qtr.",
			"next": "next qtr.",
			"past": {
				"one": "{0} qtr. ago",
				"other": "{0} qtrs. ago"
			},
			"future": {
				"one": "in {0} qtr.",
				"other": "in {0} qtrs."
			}
		},
		"month": {
			"previous": "last mo.",
			"current": "this mo.",
			"next": "next mo.",
			"past": "{0} mo. ago",
			"future": "in {0} mo."
		},
		"week": {
			"previous": "last wk.",
			"current": "this wk.",
			"next": "next wk.",
			"past": "{0} wk. ago",
			"future": "in {0} wk."
		},
		"day": {
			"previous": "yesterday",
			"current": "today",
			"next": "tomorrow",
			"past": {
				"one": "{0} day ago",
				"other": "{0} days ago"
			},
			"future": {
				"one": "in {0} day",
				"other": "in {0} days"
			}
		},
		"hour": {
			"current": "this hour",
			"past": "{0} hr. ago",
			"future": "in {0} hr."
		},
		"minute": {
			"current": "this minute",
			"past": "{0} min. ago",
			"future": "in {0} min."
		},
		"second": {
			"current": "now",
			"past": "{0} sec. ago",
			"future": "in {0} sec."
		}
	},
	"narrow": {
		"year": {
			"previous": "last yr.",
			"current": "this yr.",
			"next": "next yr.",
			"past": "{0} yr. ago",
			"future": "in {0} yr."
		},
		"quarter": {
			"previous": "last qtr.",
			"current": "this qtr.",
			"next": "next qtr.",
			"past": {
				"one": "{0} qtr. ago",
				"other": "{0} qtrs. ago"
			},
			"future": {
				"one": "in {0} qtr.",
				"other": "in {0} qtrs."
			}
		},
		"month": {
			"previous": "last mo.",
			"current": "this mo.",
			"next": "next mo.",
			"past": "{0} mo. ago",
			"future": "in {0} mo."
		},
		"week": {
			"previous": "last wk.",
			"current": "this wk.",
			"next": "next wk.",
			"past": "{0} wk. ago",
			"future": "in {0} wk."
		},
		"day": {
			"previous": "yesterday",
			"current": "today",
			"next": "tomorrow",
			"past": {
				"one": "{0} day ago",
				"other": "{0} days ago"
			},
			"future": {
				"one": "in {0} day",
				"other": "in {0} days"
			}
		},
		"hour": {
			"current": "this hour",
			"past": "{0} hr. ago",
			"future": "in {0} hr."
		},
		"minute": {
			"current": "this minute",
			"past": "{0} min. ago",
			"future": "in {0} min."
		},
		"second": {
			"current": "now",
			"past": "{0} sec. ago",
			"future": "in {0} sec."
		}
	},
	"now": {
		"now": {
			"current": "now",
			"future": "in a moment",
			"past": "just now"
		}
	},
	"mini": {
		"year": "{0}yr",
		"month": "{0}mo",
		"week": "{0}wk",
		"day": "{0}d",
		"hour": "{0}h",
		"minute": "{0}m",
		"second": "{0}s",
		"now": "now"
	},
	"short-time": {
		"year": "{0} yr.",
		"month": "{0} mo.",
		"week": "{0} wk.",
		"day": {
			"one": "{0} day",
			"other": "{0} days"
		},
		"hour": "{0} hr.",
		"minute": "{0} min.",
		"second": "{0} sec."
	},
	"long-time": {
		"year": {
			"one": "{0} year",
			"other": "{0} years"
		},
		"month": {
			"one": "{0} month",
			"other": "{0} months"
		},
		"week": {
			"one": "{0} week",
			"other": "{0} weeks"
		},
		"day": {
			"one": "{0} day",
			"other": "{0} days"
		},
		"hour": {
			"one": "{0} hour",
			"other": "{0} hours"
		},
		"minute": {
			"one": "{0} minute",
			"other": "{0} minutes"
		},
		"second": {
			"one": "{0} second",
			"other": "{0} seconds"
		}
	}
}
},{}],67:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addLocaleData = addLocaleData;
exports.getDefaultLocale = getDefaultLocale;
exports.getLocaleData = getLocaleData;
exports.resolveLocale = resolveLocale;
exports.setDefaultLocale = setDefaultLocale;
// Fallback locale.
// (when not a single one of the supplied "preferred" locales is available)
var defaultLocale = 'en'; // For all locales added
// their relative time formatter messages will be stored here.

var localesData = {}; // According to the spec BCP 47 language tags are case-insensitive.
// https://tools.ietf.org/html/rfc5646

var lowercaseLocaleLookup = {};

function getDefaultLocale() {
  return defaultLocale;
}

function setDefaultLocale(locale) {
  defaultLocale = locale;
}
/**
 * Gets locale data previously added by `addLocaleData()`.
 * @return  {object} [localeData]
 */


function getLocaleData(locale) {
  return localesData[locale];
}
/**
 * Adds locale data.
 * Is called by `RelativeTimeFormat.addLocale(...)`.
 * @param  {object} localeData
 */


function addLocaleData(localeData) {
  if (!localeData) {
    throw new Error('No locale data passed');
  } // This locale data is stored in a global variable
  // and later used when calling `.format(time)`.


  localesData[localeData.locale] = localeData;
  lowercaseLocaleLookup[localeData.locale.toLowerCase()] = localeData.locale;
}
/**
 * Returns a locale for which locale data has been added
 * via `RelativeTimeFormat.addLocale(...)`.
 * @param  {string} locale
 * @return {string} [locale]
 */


function resolveLocale(locale) {
  if (localesData[locale]) {
    return locale;
  }

  if (lowercaseLocaleLookup[locale.toLowerCase()]) {
    return lowercaseLocaleLookup[locale.toLowerCase()];
  }
}

},{}],68:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// (this file was autogenerated by `generate-locales`)
// "plural rules" functions are not stored in locale JSON files because they're not strings.
// This file isn't big — it's about 5 kilobytes in size (minified).
// Alternatively, the pluralization rules for each locale could be stored
// in their JSON files in a non-parsed form and later parsed via `make-plural` library.
// But `make-plural` library itself is relatively big in size:
// `make-plural.min.js` is about 6 kilobytes (https://unpkg.com/make-plural/).
// So, it's more practical to bypass runtime `make-plural` pluralization rules compilation
// and just include the already compiled pluarlization rules for all locales in the library code.
var $ = {
  af: function af(n) {
    return n == 1 ? 'one' : 'other';
  },
  am: function am(n) {
    return n >= 0 && n <= 1 ? 'one' : 'other';
  },
  ar: function ar(n) {
    var s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2);
    return n == 0 ? 'zero' : n == 1 ? 'one' : n == 2 ? 'two' : n100 >= 3 && n100 <= 10 ? 'few' : n100 >= 11 && n100 <= 99 ? 'many' : 'other';
  },
  ast: function ast(n) {
    var s = String(n).split('.'),
        v0 = !s[1];
    return n == 1 && v0 ? 'one' : 'other';
  },
  be: function be(n) {
    var s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);
    return n10 == 1 && n100 != 11 ? 'one' : n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14) ? 'few' : t0 && n10 == 0 || n10 >= 5 && n10 <= 9 || n100 >= 11 && n100 <= 14 ? 'many' : 'other';
  },
  br: function br(n) {
    var s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2),
        n1000000 = t0 && s[0].slice(-6);
    return n10 == 1 && n100 != 11 && n100 != 71 && n100 != 91 ? 'one' : n10 == 2 && n100 != 12 && n100 != 72 && n100 != 92 ? 'two' : (n10 == 3 || n10 == 4 || n10 == 9) && (n100 < 10 || n100 > 19) && (n100 < 70 || n100 > 79) && (n100 < 90 || n100 > 99) ? 'few' : n != 0 && t0 && n1000000 == 0 ? 'many' : 'other';
  },
  bs: function bs(n) {
    var s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        f10 = f.slice(-1),
        f100 = f.slice(-2);
    return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one' : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? 'few' : 'other';
  },
  ceb: function ceb(n) {
    var s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        f10 = f.slice(-1);
    return v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? 'one' : 'other';
  },
  cs: function cs(n) {
    var s = String(n).split('.'),
        i = s[0],
        v0 = !s[1];
    return n == 1 && v0 ? 'one' : i >= 2 && i <= 4 && v0 ? 'few' : !v0 ? 'many' : 'other';
  },
  cy: function cy(n) {
    return n == 0 ? 'zero' : n == 1 ? 'one' : n == 2 ? 'two' : n == 3 ? 'few' : n == 6 ? 'many' : 'other';
  },
  da: function da(n) {
    var s = String(n).split('.'),
        i = s[0],
        t0 = Number(s[0]) == n;
    return n == 1 || !t0 && (i == 0 || i == 1) ? 'one' : 'other';
  },
  dsb: function dsb(n) {
    var s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i100 = i.slice(-2),
        f100 = f.slice(-2);
    return v0 && i100 == 1 || f100 == 1 ? 'one' : v0 && i100 == 2 || f100 == 2 ? 'two' : v0 && (i100 == 3 || i100 == 4) || f100 == 3 || f100 == 4 ? 'few' : 'other';
  },
  dz: function dz(n) {
    return 'other';
  },
  es: function es(n) {
    var s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
    return n == 1 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
  },
  ff: function ff(n) {
    return n >= 0 && n < 2 ? 'one' : 'other';
  },
  fr: function fr(n) {
    var s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
    return n >= 0 && n < 2 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
  },
  ga: function ga(n) {
    var s = String(n).split('.'),
        t0 = Number(s[0]) == n;
    return n == 1 ? 'one' : n == 2 ? 'two' : t0 && n >= 3 && n <= 6 ? 'few' : t0 && n >= 7 && n <= 10 ? 'many' : 'other';
  },
  gd: function gd(n) {
    var s = String(n).split('.'),
        t0 = Number(s[0]) == n;
    return n == 1 || n == 11 ? 'one' : n == 2 || n == 12 ? 'two' : t0 && n >= 3 && n <= 10 || t0 && n >= 13 && n <= 19 ? 'few' : 'other';
  },
  he: function he(n) {
    var s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1);
    return n == 1 && v0 ? 'one' : i == 2 && v0 ? 'two' : v0 && (n < 0 || n > 10) && t0 && n10 == 0 ? 'many' : 'other';
  },
  is: function is(n) {
    var s = String(n).split('.'),
        i = s[0],
        t0 = Number(s[0]) == n,
        i10 = i.slice(-1),
        i100 = i.slice(-2);
    return t0 && i10 == 1 && i100 != 11 || !t0 ? 'one' : 'other';
  },
  it: function it(n) {
    var s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
    return n == 1 && v0 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
  },
  ksh: function ksh(n) {
    return n == 0 ? 'zero' : n == 1 ? 'one' : 'other';
  },
  lt: function lt(n) {
    var s = String(n).split('.'),
        f = s[1] || '',
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);
    return n10 == 1 && (n100 < 11 || n100 > 19) ? 'one' : n10 >= 2 && n10 <= 9 && (n100 < 11 || n100 > 19) ? 'few' : f != 0 ? 'many' : 'other';
  },
  lv: function lv(n) {
    var s = String(n).split('.'),
        f = s[1] || '',
        v = f.length,
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2),
        f100 = f.slice(-2),
        f10 = f.slice(-1);
    return t0 && n10 == 0 || n100 >= 11 && n100 <= 19 || v == 2 && f100 >= 11 && f100 <= 19 ? 'zero' : n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11 || v != 2 && f10 == 1 ? 'one' : 'other';
  },
  mk: function mk(n) {
    var s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        f10 = f.slice(-1),
        f100 = f.slice(-2);
    return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one' : 'other';
  },
  mt: function mt(n) {
    var s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2);
    return n == 1 ? 'one' : n == 0 || n100 >= 2 && n100 <= 10 ? 'few' : n100 >= 11 && n100 <= 19 ? 'many' : 'other';
  },
  pa: function pa(n) {
    return n == 0 || n == 1 ? 'one' : 'other';
  },
  pl: function pl(n) {
    var s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2);
    return n == 1 && v0 ? 'one' : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) ? 'few' : v0 && i != 1 && (i10 == 0 || i10 == 1) || v0 && i10 >= 5 && i10 <= 9 || v0 && i100 >= 12 && i100 <= 14 ? 'many' : 'other';
  },
  pt: function pt(n) {
    var s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
    return i == 0 || i == 1 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
  },
  ro: function ro(n) {
    var s = String(n).split('.'),
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2);
    return n == 1 && v0 ? 'one' : !v0 || n == 0 || n100 >= 2 && n100 <= 19 ? 'few' : 'other';
  },
  ru: function ru(n) {
    var s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2);
    return v0 && i10 == 1 && i100 != 11 ? 'one' : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) ? 'few' : v0 && i10 == 0 || v0 && i10 >= 5 && i10 <= 9 || v0 && i100 >= 11 && i100 <= 14 ? 'many' : 'other';
  },
  se: function se(n) {
    return n == 1 ? 'one' : n == 2 ? 'two' : 'other';
  },
  si: function si(n) {
    var s = String(n).split('.'),
        i = s[0],
        f = s[1] || '';
    return n == 0 || n == 1 || i == 0 && f == 1 ? 'one' : 'other';
  },
  sl: function sl(n) {
    var s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i100 = i.slice(-2);
    return v0 && i100 == 1 ? 'one' : v0 && i100 == 2 ? 'two' : v0 && (i100 == 3 || i100 == 4) || !v0 ? 'few' : 'other';
  }
};
$.as = $.am;
$.az = $.af;
$.bg = $.af;
$.bn = $.am;
$.brx = $.af;
$.ca = $.ast;
$.ce = $.af;
$.chr = $.af;
$.de = $.ast;
$.ee = $.af;
$.el = $.af;
$.en = $.ast;
$.et = $.ast;
$.eu = $.af;
$.fa = $.am;
$.fi = $.ast;
$.fil = $.ceb;
$.fo = $.af;
$.fur = $.af;
$.fy = $.ast;
$.gl = $.ast;
$.gu = $.am;
$.ha = $.af;
$.hi = $.am;
$.hr = $.bs;
$.hsb = $.dsb;
$.hu = $.af;
$.hy = $.ff;
$.ia = $.ast;
$.id = $.dz;
$.ig = $.dz;
$.ja = $.dz;
$.jgo = $.af;
$.jv = $.dz;
$.ka = $.af;
$.kea = $.dz;
$.kk = $.af;
$.kl = $.af;
$.km = $.dz;
$.kn = $.am;
$.ko = $.dz;
$.ku = $.af;
$.ky = $.af;
$.lb = $.af;
$.lkt = $.dz;
$.lo = $.dz;
$.ml = $.af;
$.mn = $.af;
$.mr = $.af;
$.ms = $.dz;
$.my = $.dz;
$.nb = $.af;
$.ne = $.af;
$.nl = $.ast;
$.nn = $.af;
$.no = $.af;
$.or = $.af;
$.pcm = $.am;
$.ps = $.af;
$.rm = $.af;
$.sah = $.dz;
$.sc = $.ast;
$.sd = $.af;
$.sk = $.cs;
$.so = $.af;
$.sq = $.af;
$.sr = $.bs;
$.su = $.dz;
$.sv = $.ast;
$.sw = $.ast;
$.ta = $.af;
$.te = $.af;
$.th = $.dz;
$.ti = $.pa;
$.tk = $.af;
$.to = $.dz;
$.tr = $.af;
$.ug = $.af;
$.uk = $.ru;
$.ur = $.ast;
$.uz = $.af;
$.vi = $.dz;
$.wae = $.af;
$.wo = $.dz;
$.yi = $.ast;
$.yo = $.dz;
$.yue = $.dz;
$.zh = $.dz;
$.zu = $.am;
var _default = $;
exports["default"] = _default;

},{}],69:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _PluralRuleFunctions = _interopRequireDefault(require("./PluralRuleFunctions.js"));

var _getPluralRulesLocale = _interopRequireDefault(require("./getPluralRulesLocale.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * `Intl.PluralRules` polyfill.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/PluralRules
 */
var PluralRules = /*#__PURE__*/function () {
  function PluralRules(locale, options) {
    _classCallCheck(this, PluralRules);

    var locales = PluralRules.supportedLocalesOf(locale);

    if (locales.length === 0) {
      throw new RangeError("Unsupported locale: " + locale);
    }

    if (options && options.type !== "cardinal") {
      throw new RangeError("Only \"cardinal\" \"type\" is supported");
    }

    this.$ = _PluralRuleFunctions["default"][(0, _getPluralRulesLocale["default"])(locales[0])];
  }

  _createClass(PluralRules, [{
    key: "select",
    value: function select(number) {
      return this.$(number);
    }
  }], [{
    key: "supportedLocalesOf",
    value: function supportedLocalesOf(locales) {
      if (typeof locales === "string") {
        locales = [locales];
      }

      return locales.filter(function (locale) {
        return _PluralRuleFunctions["default"][(0, _getPluralRulesLocale["default"])(locale)];
      });
    }
  }]);

  return PluralRules;
}();

exports["default"] = PluralRules;

},{"./PluralRuleFunctions.js":68,"./getPluralRulesLocale.js":71}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.UNITS = void 0;

var _LocaleDataStore = require("./LocaleDataStore.js");

var _resolveLocale = _interopRequireDefault(require("./resolveLocale.js"));

var _PluralRules = _interopRequireDefault(require("./PluralRules.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

// Importing `PluralRule` polyfill from a separate package
// results in a bundle that is larger by 1kB for some reason.
// import PluralRules from 'intl-plural-rules-polyfill/cardinal'
// Valid time units.
var UNITS = ["second", "minute", "hour", "day", "week", "month", "quarter", "year"]; // Valid values for the `numeric` option.

exports.UNITS = UNITS;
var NUMERIC_VALUES = ["auto", "always"]; // Valid values for the `style` option.

var STYLE_VALUES = ["long", "short", "narrow"]; // Valid values for the `localeMatcher` option.

var LOCALE_MATCHER_VALUES = ["lookup", "best fit"];
/**
 * Polyfill for `Intl.RelativeTimeFormat` proposal.
 * https://github.com/tc39/proposal-intl-relative-time
 * https://github.com/tc39/proposal-intl-relative-time/issues/55
 */

var RelativeTimeFormat = /*#__PURE__*/function () {
  /**
   * @param {(string|string[])} [locales] - Preferred locales (or locale).
   * @param {Object} [options] - Formatting options.
   * @param {string} [options.style="long"] - One of: "long", "short", "narrow".
   * @param {string} [options.numeric="always"] - (Version >= 2) One of: "always", "auto".
   * @param {string} [options.localeMatcher="lookup"] - One of: "lookup", "best fit". Currently only "lookup" is supported.
   */
  function RelativeTimeFormat() {
    var locales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, RelativeTimeFormat);

    var numeric = options.numeric,
        style = options.style,
        localeMatcher = options.localeMatcher;
    this.numeric = "always";
    this.style = "long";
    this.localeMatcher = "lookup"; // Set `numeric` option.

    if (numeric !== undefined) {
      if (NUMERIC_VALUES.indexOf(numeric) < 0) {
        throw new RangeError("Invalid \"numeric\" option: ".concat(numeric));
      }

      this.numeric = numeric;
    } // Set `style` option.


    if (style !== undefined) {
      if (STYLE_VALUES.indexOf(style) < 0) {
        throw new RangeError("Invalid \"style\" option: ".concat(style));
      }

      this.style = style;
    } // Set `localeMatcher` option.


    if (localeMatcher !== undefined) {
      if (LOCALE_MATCHER_VALUES.indexOf(localeMatcher) < 0) {
        throw new RangeError("Invalid \"localeMatcher\" option: ".concat(localeMatcher));
      }

      this.localeMatcher = localeMatcher;
    } // Set `locale`.
    // Convert `locales` to an array.


    if (typeof locales === 'string') {
      locales = [locales];
    } // Add default locale.


    locales.push((0, _LocaleDataStore.getDefaultLocale)()); // Choose the most appropriate locale.

    this.locale = RelativeTimeFormat.supportedLocalesOf(locales, {
      localeMatcher: this.localeMatcher
    })[0];

    if (!this.locale) {
      throw new Error("No supported locale was found");
    } // Construct an `Intl.PluralRules` instance (polyfill).


    if (_PluralRules["default"].supportedLocalesOf(this.locale).length > 0) {
      this.pluralRules = new _PluralRules["default"](this.locale);
    } else {
      console.warn("\"".concat(this.locale, "\" locale is not supported"));
    } // Use `Intl.NumberFormat` for formatting numbers (when available).


    if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
      this.numberFormat = new Intl.NumberFormat(this.locale);
      this.numberingSystem = this.numberFormat.resolvedOptions().numberingSystem;
    } else {
      this.numberingSystem = 'latn';
    }

    this.locale = (0, _resolveLocale["default"])(this.locale, {
      localeMatcher: this.localeMatcher
    });
  }
  /**
   * Formats time `number` in `units` (either in past or in future).
   * @param {number} number - Time interval value.
   * @param {string} unit - Time interval measurement unit.
   * @return {string}
   * @throws {RangeError} If unit is not one of "second", "minute", "hour", "day", "week", "month", "quarter".
   * @example
   * // Returns "2 days ago"
   * rtf.format(-2, "day")
   * // Returns "in 5 minutes"
   * rtf.format(5, "minute")
   */


  _createClass(RelativeTimeFormat, [{
    key: "format",
    value: function format() {
      var _parseFormatArgs = parseFormatArgs(arguments),
          _parseFormatArgs2 = _slicedToArray(_parseFormatArgs, 2),
          number = _parseFormatArgs2[0],
          unit = _parseFormatArgs2[1];

      return this.getRule(number, unit).replace('{0}', this.formatNumber(Math.abs(number)));
    }
    /**
     * Formats time `number` in `units` (either in past or in future).
     * @param {number} number - Time interval value.
     * @param {string} unit - Time interval measurement unit.
     * @return {Object[]} The parts (`{ type, value, unit? }`).
     * @throws {RangeError} If unit is not one of "second", "minute", "hour", "day", "week", "month", "quarter".
     * @example
     * // Version 1 (deprecated).
     * // Returns [
     * //   { type: "literal", value: "in " },
     * //   { type: "day", value: "100" },
     * //   { type: "literal", value: " days" }
     * // ]
     * rtf.formatToParts(100, "day")
     * //
     * // Version 2.
     * // Returns [
     * //   { type: "literal", value: "in " },
     * //   { type: "integer", value: "100", unit: "day" },
     * //   { type: "literal", value: " days" }
     * // ]
     * rtf.formatToParts(100, "day")
     */

  }, {
    key: "formatToParts",
    value: function formatToParts() {
      var _parseFormatArgs3 = parseFormatArgs(arguments),
          _parseFormatArgs4 = _slicedToArray(_parseFormatArgs3, 2),
          number = _parseFormatArgs4[0],
          unit = _parseFormatArgs4[1];

      var rule = this.getRule(number, unit);
      var valueIndex = rule.indexOf("{0}"); // "yesterday"/"today"/"tomorrow".

      if (valueIndex < 0) {
        return [{
          type: "literal",
          value: rule
        }];
      }

      var parts = [];

      if (valueIndex > 0) {
        parts.push({
          type: "literal",
          value: rule.slice(0, valueIndex)
        });
      }

      parts = parts.concat(this.formatNumberToParts(Math.abs(number)).map(function (part) {
        return _objectSpread(_objectSpread({}, part), {}, {
          unit: unit
        });
      }));

      if (valueIndex + "{0}".length < rule.length - 1) {
        parts.push({
          type: "literal",
          value: rule.slice(valueIndex + "{0}".length)
        });
      }

      return parts;
    }
    /**
     * Returns formatting rule for `value` in `units` (either in past or in future).
     * @param {number} value - Time interval value.
     * @param {string} unit - Time interval measurement unit.
     * @return {string}
     * @throws {RangeError} If unit is not one of "second", "minute", "hour", "day", "week", "month", "quarter".
     * @example
     * // Returns "{0} days ago"
     * getRule(-2, "day")
     */

  }, {
    key: "getRule",
    value: function getRule(value, unit) {
      // Get locale-specific time interval formatting rules
      // of a given `style` for the given value of measurement `unit`.
      //
      // E.g.:
      //
      // ```json
      // {
      //  "past": {
      //    "one": "a second ago",
      //    "other": "{0} seconds ago"
      //  },
      //  "future": {
      //    "one": "in a second",
      //    "other": "in {0} seconds"
      //  }
      // }
      // ```
      //
      var unitMessages = (0, _LocaleDataStore.getLocaleData)(this.locale)[this.style][unit]; // Bundle size optimization technique for styles like
      // "tiny" in `javascript-time-ago`: "1m", "2h", "3d"...

      if (typeof unitMessages === 'string') {
        return unitMessages;
      } // Special case for "yesterday"/"today"/"tomorrow".


      if (this.numeric === "auto") {
        // "yesterday", "the day before yesterday", etc.
        if (value === -2 || value === -1) {
          var message = unitMessages["previous".concat(value === -1 ? '' : '-' + Math.abs(value))];

          if (message) {
            return message;
          }
        } // "tomorrow", "the day after tomorrow", etc.
        else if (value === 1 || value === 2) {
          var _message = unitMessages["next".concat(value === 1 ? '' : '-' + Math.abs(value))];

          if (_message) {
            return _message;
          }
        } // "today"
        else if (value === 0) {
          if (unitMessages.current) {
            return unitMessages.current;
          }
        }
      } // Choose either "past" or "future" based on time `value` sign.
      // If there's only "other" then it's being collapsed.
      // (the resulting bundle size optimization technique)


      var pluralizedMessages = unitMessages[isNegative(value) ? "past" : "future"]; // Bundle size optimization technique for styles like "narrow"
      // having messages like "in {0} d." or "{0} d. ago".

      if (typeof pluralizedMessages === "string") {
        return pluralizedMessages;
      } // Quantify `value`.
      // There seems to be no such locale in CLDR
      // for which "plural rules" function is missing.


      var quantifier = this.pluralRules && this.pluralRules.select(Math.abs(value)) || 'other'; // "other" rule is supposed to be always present.
      // If only "other" rule is present then "rules" is not an object and is a string.

      return pluralizedMessages[quantifier] || pluralizedMessages.other;
    }
    /**
     * Formats a number into a string.
     * Uses `Intl.NumberFormat` when available.
     * @param  {number} number
     * @return {string}
     */

  }, {
    key: "formatNumber",
    value: function formatNumber(number) {
      return this.numberFormat ? this.numberFormat.format(number) : String(number);
    }
    /**
     * Formats a number into a list of parts.
     * Uses `Intl.NumberFormat` when available.
     * @param  {number} number
     * @return {object[]}
     */

  }, {
    key: "formatNumberToParts",
    value: function formatNumberToParts(number) {
      // `Intl.NumberFormat.formatToParts()` is not present, for example,
      // in Node.js 8.x while `Intl.NumberFormat` itself is present.
      return this.numberFormat && this.numberFormat.formatToParts ? this.numberFormat.formatToParts(number) : [{
        type: "integer",
        value: this.formatNumber(number)
      }];
    }
    /**
     * Returns a new object with properties reflecting the locale and date and time formatting options computed during initialization of this DateTimeFormat object.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/resolvedOptions
     * @return {Object}
     */

  }, {
    key: "resolvedOptions",
    value: function resolvedOptions() {
      return {
        locale: this.locale,
        style: this.style,
        numeric: this.numeric,
        numberingSystem: this.numberingSystem
      };
    }
  }]);

  return RelativeTimeFormat;
}();
/**
 * Returns an array containing those of the provided locales
 * that are supported in collation without having to fall back
 * to the runtime's default locale.
 * @param {(string|string[])} locale - A string with a BCP 47 language tag, or an array of such strings. For the general form of the locales argument, see the Intl page.
 * @param {Object} [options] - An object that may have the following property:
 * @param {string} [options.localeMatcher="lookup"] - The locale matching algorithm to use. Possible values are "lookup" and "best fit". Currently only "lookup" is supported.
 * @return {string[]} An array of strings representing a subset of the given locale tags that are supported in collation without having to fall back to the runtime's default locale.
 * @example
 * var locales = ['ban', 'id-u-co-pinyin', 'es-PY']
 * var options = { localeMatcher: 'lookup' }
 * // Returns ["id", "es-PY"]
 * Intl.RelativeTimeFormat.supportedLocalesOf(locales, options)
 */


exports["default"] = RelativeTimeFormat;

RelativeTimeFormat.supportedLocalesOf = function (locales) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // Convert `locales` to an array.
  if (typeof locales === 'string') {
    locales = [locales];
  } else if (!Array.isArray(locales)) {
    throw new TypeError('Invalid "locales" argument');
  }

  return locales.filter(function (locale) {
    return (0, _resolveLocale["default"])(locale, options);
  });
};
/**
 * Adds locale data for a specific locale.
 * @param {Object} localeData
 */


RelativeTimeFormat.addLocale = _LocaleDataStore.addLocaleData;
/**
 * Sets default locale.
 * @param  {string} locale
 */

RelativeTimeFormat.setDefaultLocale = _LocaleDataStore.setDefaultLocale;
/**
 * Gets default locale.
 * @return  {string} locale
 */

RelativeTimeFormat.getDefaultLocale = _LocaleDataStore.getDefaultLocale;
/**
 * Export `Intl.PluralRules` just in case it's used somewhere else.
 */

RelativeTimeFormat.PluralRules = _PluralRules["default"]; // The specification allows units to be in plural form.
// Convert plural to singular.
// Example: "seconds" -> "second".

var UNIT_ERROR = 'Invalid "unit" argument';

function parseUnit(unit) {
  if (_typeof(unit) === 'symbol') {
    throw new TypeError(UNIT_ERROR);
  }

  if (typeof unit !== 'string') {
    throw new RangeError("".concat(UNIT_ERROR, ": ").concat(unit));
  }

  if (unit[unit.length - 1] === 's') {
    unit = unit.slice(0, unit.length - 1);
  }

  if (UNITS.indexOf(unit) < 0) {
    throw new RangeError("".concat(UNIT_ERROR, ": ").concat(unit));
  }

  return unit;
} // Converts `value` to a `Number`.
// The specification allows value to be a non-number.
// For example, "-0" is supposed to be treated as `-0`.
// Also checks if `value` is a finite number.


var NUMBER_ERROR = 'Invalid "number" argument';

function parseNumber(value) {
  value = Number(value);

  if (Number.isFinite) {
    if (!Number.isFinite(value)) {
      throw new RangeError("".concat(NUMBER_ERROR, ": ").concat(value));
    }
  }

  return value;
}
/**
 * Tells `0` from `-0`.
 * https://stackoverflow.com/questions/7223359/are-0-and-0-the-same
 * @param  {number} number
 * @return {Boolean}
 * @example
 * isNegativeZero(0); // false
 * isNegativeZero(-0); // true
 */


function isNegativeZero(number) {
  return 1 / number === -Infinity;
}

function isNegative(number) {
  return number < 0 || number === 0 && isNegativeZero(number);
}

function parseFormatArgs(args) {
  if (args.length < 2) {
    throw new TypeError("\"unit\" argument is required");
  }

  return [parseNumber(args[0]), parseUnit(args[1])];
}

},{"./LocaleDataStore.js":67,"./PluralRules.js":69,"./resolveLocale.js":72}],71:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getPluralRulesLocale;

/**
 * Returns a `locale` for which a function exists in `./PluralRuleFunctions.js`.
 * @param  {string} locale
 * @return {string}
 * @example
 * getPluralRulesLocale("ru-RU-Cyrl") // Returns "ru".
 */
function getPluralRulesLocale(locale) {
  // "pt" language is the only one having different pluralization rules
  // for the one ("pt") (Portuguese) locale and the other ("pt-PT") (European Portuguese).
  // http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
  // (see the entries for "pt" and "pt_PT" there)
  if (locale === 'pt-PT') {
    return locale;
  }

  return getLanguageFromLanguageTag(locale);
}
/**
 * Extracts language from an IETF BCP 47 language tag.
 * @param {string} languageTag - IETF BCP 47 language tag.
 * @return {string}
 * @example
 * // Returns "he"
 * getLanguageFromLanguageTag("he-IL-u-ca-hebrew-tz-jeruslm")
 * // Returns "ar"
 * getLanguageFromLanguageTag("ar-u-nu-latn")
 */


var LANGUAGE_REG_EXP = /^([a-z0-9]+)/i;

function getLanguageFromLanguageTag(languageTag) {
  var match = languageTag.match(LANGUAGE_REG_EXP);

  if (!match) {
    throw new TypeError("Invalid locale: ".concat(languageTag));
  }

  return match[1];
}

},{}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = resolveLocale;
exports.resolveLocaleLookup = resolveLocaleLookup;

var _LocaleDataStore = require("./LocaleDataStore.js");

/**
 * Resolves a locale to a supported one (if any).
 * @param  {string} locale
 * @param {Object} [options] - An object that may have the following property:
 * @param {string} [options.localeMatcher="lookup"] - The locale matching algorithm to use. Possible values are "lookup" and "best fit". Currently only "lookup" is supported.
 * @return {string} [locale]
 * @example
 * // Returns "sr"
 * resolveLocale("sr-Cyrl-BA")
 * // Returns `undefined`
 * resolveLocale("xx-Latn")
 */
function resolveLocale(locale) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var localeMatcher = options.localeMatcher || 'lookup';

  switch (localeMatcher) {
    case 'lookup':
      return resolveLocaleLookup(locale);
    // "best fit" locale matching is not supported.
    // https://github.com/catamphetamine/relative-time-format/issues/2

    case 'best fit':
      // return resolveLocaleBestFit(locale)
      return resolveLocaleLookup(locale);

    default:
      throw new RangeError("Invalid \"localeMatcher\" option: ".concat(localeMatcher));
  }
}
/**
 * Resolves a locale to a supported one (if any).
 * Starts from the most specific locale and gradually
 * falls back to less specific ones.
 * This is a basic implementation of the "lookup" algorithm.
 * https://tools.ietf.org/html/rfc4647#section-3.4
 * @param  {string} locale
 * @return {string} [locale]
 * @example
 * // Returns "sr"
 * resolveLocaleLookup("sr-Cyrl-BA")
 * // Returns `undefined`
 * resolveLocaleLookup("xx-Latn")
 */


function resolveLocaleLookup(locale) {
  var resolvedLocale = (0, _LocaleDataStore.resolveLocale)(locale);

  if (resolvedLocale) {
    return resolvedLocale;
  } // `sr-Cyrl-BA` -> `sr-Cyrl` -> `sr`.


  var parts = locale.split('-');

  while (locale.length > 1) {
    parts.pop();
    locale = parts.join('-');

    var _resolvedLocale = (0, _LocaleDataStore.resolveLocale)(locale);

    if (_resolvedLocale) {
      return _resolvedLocale;
    }
  }
}

},{"./LocaleDataStore.js":67}],73:[function(require,module,exports){
'use strict'

exports = module.exports = require('./commonjs/RelativeTimeFormat.js').default
exports['default'] = require('./commonjs/RelativeTimeFormat.js').default
},{"./commonjs/RelativeTimeFormat.js":70}],74:[function(require,module,exports){

},{}],75:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[2]);
