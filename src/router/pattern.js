/**
 * Modified version of:
 * https://github.com/snd/url-pattern
 */

var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define("pattern", function () {
  return {
    PatternPrototype: {
      match: function(url) {
        var bound, captured, i, match, name, value, _i, _len;
        match = this.regex.exec(url);
        if (match == null) {
          return null;
        }
        captured = match.slice(1);
        if (this.isRegex) {
          return captured;
        }
        bound = {};
        for (i = _i = 0, _len = captured.length; _i < _len; i = ++_i) {
          value = captured[i];
          name = this.names[i];
          if (value == null) {
            continue;
          }
          if (name === '_') {
            if (bound._ == null) {
              bound._ = [];
            }
            bound._.push(value);
          } else {
            bound[name] = value;
          }
        }
        return bound;
      }
    },
    newPattern: function(arg, separator) {
      var isRegex, pattern, regexString;
      if (separator == null) {
        separator = '/';
      }
      isRegex = arg instanceof RegExp;
      if (!(('string' === typeof arg) || isRegex)) {
        throw new TypeError('argument must be a regex or a string');
      }
      [':', '*'].forEach(function(forbidden) {
        if (separator === forbidden) {
          throw new Error("separator can't be " + forbidden);
        }
      });
      pattern = Object.create(module.exports.PatternPrototype);
      pattern.isRegex = isRegex;
      pattern.regex = isRegex ? arg : (regexString = module.exports.toRegexString(arg, separator), new RegExp(regexString));
      if (!isRegex) {
        pattern.names = module.exports.getNames(arg, separator);
      }
      return pattern;
    },
    escapeForRegex: function(string) {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    },
    getNames: function(arg, separator) {
      var escapedSeparator, name, names, regex, results;
      if (separator == null) {
        separator = '/';
      }
      if (arg instanceof RegExp) {
        return [];
      }
      escapedSeparator = module.exports.escapeForRegex(separator);
      regex = new RegExp("((:?:[^" + escapedSeparator + "\(\)]+)|(?:[\*]))", 'g');
      names = [];
      results = regex.exec(arg);
      while (results != null) {
        name = results[1].slice(1);
        if (name === '_') {
          throw new TypeError(":_ can't be used as a pattern name in pattern " + arg);
        }
        if (__indexOf.call(names, name) >= 0) {
          throw new TypeError("duplicate pattern name :" + name + " in pattern " + arg);
        }
        names.push(name || '_');
        results = regex.exec(arg);
      }
      return names;
    },
    escapeSeparators: function(string, separator) {
      var escapedSeparator, regex;
      if (separator == null) {
        separator = '/';
      }
      escapedSeparator = module.exports.escapeForRegex(separator);
      regex = new RegExp(escapedSeparator, 'g');
      return string.replace(regex, escapedSeparator);
    },
    toRegexString: function(string, separator) {
      var escapedSeparator, stringWithEscapedSeparators;
      if (separator == null) {
        separator = '/';
      }
      stringWithEscapedSeparators = module.exports.escapeSeparators(string, separator);
      stringWithEscapedSeparators = stringWithEscapedSeparators.replace(/\((.*?)\)/g, '(?:$1)?').replace(/\*/g, '(.*?)');
      escapedSeparator = module.exports.escapeForRegex(separator);
      module.exports.getNames(string, separator).forEach(function(name) {
        return stringWithEscapedSeparators = stringWithEscapedSeparators.replace(':' + name, "([^\\" + separator + "]+)");
      });
      return "^" + stringWithEscapedSeparators + "$";
    }
  }
});