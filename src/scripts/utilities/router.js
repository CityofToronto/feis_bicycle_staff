/* global Backbone */

/* exported Router */
const Router = Backbone.Router.extend({
  defaultFragment: 'home',

  routes: {
    ['home']() { },
    '*default': 'routeDefault'
  },

  execute(callback, args, name) {
    const nextCleanup = (cleanupFunction) => {
      if (typeof cleanupFunction === 'function') {
        this.cleanupFunction = cleanupFunction;
      }
    };

    const afterCleanup = (cleanupFunctionReturnValue) => {
      if (cleanupFunctionReturnValue !== false) {
        this.cleanupFunction = null;

        if (typeof callback === 'function') {
          const cleanupFunction = callback.call(this, ...args);
          if (cleanupFunction instanceof Promise) {
            cleanupFunction.then((finalCleanupFunction) => {
              nextCleanup(finalCleanupFunction);
            });
          } else {
            nextCleanup(cleanupFunction);
          }
        }
      } else {
        if (this.routeDefault) {
          this.routeDefault();
        }
      }
    };

    let cleanupFunctionReturnValue;
    if (this.cleanupFunction) {
      cleanupFunctionReturnValue = this.cleanupFunction.call(this, name);
    }

    if (cleanupFunctionReturnValue instanceof Promise) {
      cleanupFunctionReturnValue.then((finalCleanupFunctionReturnValue) => {
        afterCleanup(finalCleanupFunctionReturnValue);
      });
    } else {
      afterCleanup(cleanupFunctionReturnValue);
    }
  },

  route(route, name, callback) {
    let oldCallback;
    if (callback) {
      oldCallback = callback;
    } else if (name) {
      if (typeof name === 'function') {
        oldCallback = name;
      } else if (typeof name === 'string') {
        oldCallback = this[name];
      }
    }

    if (oldCallback && (!this.routeDefault || oldCallback !== this.routeDefault)) {
      const newCallback = function (...args) {
        this.lastFragment = Backbone.history.getFragment();
        return oldCallback.call(this, ...args);
      };

      if (callback) {
        callback = newCallback;
      } else if (name) {
        if (typeof name === 'function') {
          name = newCallback;
        } else if (typeof name === 'string') {
          this[name] = newCallback;
        }
      }
    }

    return Backbone.Router.prototype.route.call(this, route, name, callback);
  },

  routeDefault() {
    if (this.lastFragment != null) {
      this.navigate(this.lastFragment, { trigger: false, replace: true });
    } else if (this.defaultFragment != null) {
      this.navigate(this.defaultFragment, { trigger: true });
    }
  }
});
