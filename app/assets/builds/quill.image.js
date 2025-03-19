(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/fast-diff/diff.js
  var require_diff = __commonJS({
    "node_modules/fast-diff/diff.js"(exports2, module2) {
      var DIFF_DELETE = -1;
      var DIFF_INSERT = 1;
      var DIFF_EQUAL = 0;
      function diff_main(text1, text2, cursor_pos, cleanup, _fix_unicode) {
        if (text1 === text2) {
          if (text1) {
            return [[DIFF_EQUAL, text1]];
          }
          return [];
        }
        if (cursor_pos != null) {
          var editdiff = find_cursor_edit_diff(text1, text2, cursor_pos);
          if (editdiff) {
            return editdiff;
          }
        }
        var commonlength = diff_commonPrefix(text1, text2);
        var commonprefix = text1.substring(0, commonlength);
        text1 = text1.substring(commonlength);
        text2 = text2.substring(commonlength);
        commonlength = diff_commonSuffix(text1, text2);
        var commonsuffix = text1.substring(text1.length - commonlength);
        text1 = text1.substring(0, text1.length - commonlength);
        text2 = text2.substring(0, text2.length - commonlength);
        var diffs = diff_compute_(text1, text2);
        if (commonprefix) {
          diffs.unshift([DIFF_EQUAL, commonprefix]);
        }
        if (commonsuffix) {
          diffs.push([DIFF_EQUAL, commonsuffix]);
        }
        diff_cleanupMerge(diffs, _fix_unicode);
        if (cleanup) {
          diff_cleanupSemantic(diffs);
        }
        return diffs;
      }
      __name(diff_main, "diff_main");
      function diff_compute_(text1, text2) {
        var diffs;
        if (!text1) {
          return [[DIFF_INSERT, text2]];
        }
        if (!text2) {
          return [[DIFF_DELETE, text1]];
        }
        var longtext = text1.length > text2.length ? text1 : text2;
        var shorttext = text1.length > text2.length ? text2 : text1;
        var i = longtext.indexOf(shorttext);
        if (i !== -1) {
          diffs = [
            [DIFF_INSERT, longtext.substring(0, i)],
            [DIFF_EQUAL, shorttext],
            [DIFF_INSERT, longtext.substring(i + shorttext.length)]
          ];
          if (text1.length > text2.length) {
            diffs[0][0] = diffs[2][0] = DIFF_DELETE;
          }
          return diffs;
        }
        if (shorttext.length === 1) {
          return [
            [DIFF_DELETE, text1],
            [DIFF_INSERT, text2]
          ];
        }
        var hm = diff_halfMatch_(text1, text2);
        if (hm) {
          var text1_a = hm[0];
          var text1_b = hm[1];
          var text2_a = hm[2];
          var text2_b = hm[3];
          var mid_common = hm[4];
          var diffs_a = diff_main(text1_a, text2_a);
          var diffs_b = diff_main(text1_b, text2_b);
          return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
        }
        return diff_bisect_(text1, text2);
      }
      __name(diff_compute_, "diff_compute_");
      function diff_bisect_(text1, text2) {
        var text1_length = text1.length;
        var text2_length = text2.length;
        var max_d = Math.ceil((text1_length + text2_length) / 2);
        var v_offset = max_d;
        var v_length = 2 * max_d;
        var v1 = new Array(v_length);
        var v2 = new Array(v_length);
        for (var x = 0; x < v_length; x++) {
          v1[x] = -1;
          v2[x] = -1;
        }
        v1[v_offset + 1] = 0;
        v2[v_offset + 1] = 0;
        var delta = text1_length - text2_length;
        var front = delta % 2 !== 0;
        var k1start = 0;
        var k1end = 0;
        var k2start = 0;
        var k2end = 0;
        for (var d = 0; d < max_d; d++) {
          for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
            var k1_offset = v_offset + k1;
            var x1;
            if (k1 === -d || k1 !== d && v1[k1_offset - 1] < v1[k1_offset + 1]) {
              x1 = v1[k1_offset + 1];
            } else {
              x1 = v1[k1_offset - 1] + 1;
            }
            var y1 = x1 - k1;
            while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) === text2.charAt(y1)) {
              x1++;
              y1++;
            }
            v1[k1_offset] = x1;
            if (x1 > text1_length) {
              k1end += 2;
            } else if (y1 > text2_length) {
              k1start += 2;
            } else if (front) {
              var k2_offset = v_offset + delta - k1;
              if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] !== -1) {
                var x2 = text1_length - v2[k2_offset];
                if (x1 >= x2) {
                  return diff_bisectSplit_(text1, text2, x1, y1);
                }
              }
            }
          }
          for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
            var k2_offset = v_offset + k2;
            var x2;
            if (k2 === -d || k2 !== d && v2[k2_offset - 1] < v2[k2_offset + 1]) {
              x2 = v2[k2_offset + 1];
            } else {
              x2 = v2[k2_offset - 1] + 1;
            }
            var y2 = x2 - k2;
            while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) === text2.charAt(text2_length - y2 - 1)) {
              x2++;
              y2++;
            }
            v2[k2_offset] = x2;
            if (x2 > text1_length) {
              k2end += 2;
            } else if (y2 > text2_length) {
              k2start += 2;
            } else if (!front) {
              var k1_offset = v_offset + delta - k2;
              if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] !== -1) {
                var x1 = v1[k1_offset];
                var y1 = v_offset + x1 - k1_offset;
                x2 = text1_length - x2;
                if (x1 >= x2) {
                  return diff_bisectSplit_(text1, text2, x1, y1);
                }
              }
            }
          }
        }
        return [
          [DIFF_DELETE, text1],
          [DIFF_INSERT, text2]
        ];
      }
      __name(diff_bisect_, "diff_bisect_");
      function diff_bisectSplit_(text1, text2, x, y) {
        var text1a = text1.substring(0, x);
        var text2a = text2.substring(0, y);
        var text1b = text1.substring(x);
        var text2b = text2.substring(y);
        var diffs = diff_main(text1a, text2a);
        var diffsb = diff_main(text1b, text2b);
        return diffs.concat(diffsb);
      }
      __name(diff_bisectSplit_, "diff_bisectSplit_");
      function diff_commonPrefix(text1, text2) {
        if (!text1 || !text2 || text1.charAt(0) !== text2.charAt(0)) {
          return 0;
        }
        var pointermin = 0;
        var pointermax = Math.min(text1.length, text2.length);
        var pointermid = pointermax;
        var pointerstart = 0;
        while (pointermin < pointermid) {
          if (text1.substring(pointerstart, pointermid) == text2.substring(pointerstart, pointermid)) {
            pointermin = pointermid;
            pointerstart = pointermin;
          } else {
            pointermax = pointermid;
          }
          pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
        }
        if (is_surrogate_pair_start(text1.charCodeAt(pointermid - 1))) {
          pointermid--;
        }
        return pointermid;
      }
      __name(diff_commonPrefix, "diff_commonPrefix");
      function diff_commonOverlap_(text1, text2) {
        var text1_length = text1.length;
        var text2_length = text2.length;
        if (text1_length == 0 || text2_length == 0) {
          return 0;
        }
        if (text1_length > text2_length) {
          text1 = text1.substring(text1_length - text2_length);
        } else if (text1_length < text2_length) {
          text2 = text2.substring(0, text1_length);
        }
        var text_length = Math.min(text1_length, text2_length);
        if (text1 == text2) {
          return text_length;
        }
        var best = 0;
        var length = 1;
        while (true) {
          var pattern = text1.substring(text_length - length);
          var found = text2.indexOf(pattern);
          if (found == -1) {
            return best;
          }
          length += found;
          if (found == 0 || text1.substring(text_length - length) == text2.substring(0, length)) {
            best = length;
            length++;
          }
        }
      }
      __name(diff_commonOverlap_, "diff_commonOverlap_");
      function diff_commonSuffix(text1, text2) {
        if (!text1 || !text2 || text1.slice(-1) !== text2.slice(-1)) {
          return 0;
        }
        var pointermin = 0;
        var pointermax = Math.min(text1.length, text2.length);
        var pointermid = pointermax;
        var pointerend = 0;
        while (pointermin < pointermid) {
          if (text1.substring(text1.length - pointermid, text1.length - pointerend) == text2.substring(text2.length - pointermid, text2.length - pointerend)) {
            pointermin = pointermid;
            pointerend = pointermin;
          } else {
            pointermax = pointermid;
          }
          pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
        }
        if (is_surrogate_pair_end(text1.charCodeAt(text1.length - pointermid))) {
          pointermid--;
        }
        return pointermid;
      }
      __name(diff_commonSuffix, "diff_commonSuffix");
      function diff_halfMatch_(text1, text2) {
        var longtext = text1.length > text2.length ? text1 : text2;
        var shorttext = text1.length > text2.length ? text2 : text1;
        if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
          return null;
        }
        function diff_halfMatchI_(longtext2, shorttext2, i) {
          var seed = longtext2.substring(i, i + Math.floor(longtext2.length / 4));
          var j = -1;
          var best_common = "";
          var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
          while ((j = shorttext2.indexOf(seed, j + 1)) !== -1) {
            var prefixLength = diff_commonPrefix(
              longtext2.substring(i),
              shorttext2.substring(j)
            );
            var suffixLength = diff_commonSuffix(
              longtext2.substring(0, i),
              shorttext2.substring(0, j)
            );
            if (best_common.length < suffixLength + prefixLength) {
              best_common = shorttext2.substring(j - suffixLength, j) + shorttext2.substring(j, j + prefixLength);
              best_longtext_a = longtext2.substring(0, i - suffixLength);
              best_longtext_b = longtext2.substring(i + prefixLength);
              best_shorttext_a = shorttext2.substring(0, j - suffixLength);
              best_shorttext_b = shorttext2.substring(j + prefixLength);
            }
          }
          if (best_common.length * 2 >= longtext2.length) {
            return [
              best_longtext_a,
              best_longtext_b,
              best_shorttext_a,
              best_shorttext_b,
              best_common
            ];
          } else {
            return null;
          }
        }
        __name(diff_halfMatchI_, "diff_halfMatchI_");
        var hm1 = diff_halfMatchI_(
          longtext,
          shorttext,
          Math.ceil(longtext.length / 4)
        );
        var hm2 = diff_halfMatchI_(
          longtext,
          shorttext,
          Math.ceil(longtext.length / 2)
        );
        var hm;
        if (!hm1 && !hm2) {
          return null;
        } else if (!hm2) {
          hm = hm1;
        } else if (!hm1) {
          hm = hm2;
        } else {
          hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
        }
        var text1_a, text1_b, text2_a, text2_b;
        if (text1.length > text2.length) {
          text1_a = hm[0];
          text1_b = hm[1];
          text2_a = hm[2];
          text2_b = hm[3];
        } else {
          text2_a = hm[0];
          text2_b = hm[1];
          text1_a = hm[2];
          text1_b = hm[3];
        }
        var mid_common = hm[4];
        return [text1_a, text1_b, text2_a, text2_b, mid_common];
      }
      __name(diff_halfMatch_, "diff_halfMatch_");
      function diff_cleanupSemantic(diffs) {
        var changes = false;
        var equalities = [];
        var equalitiesLength = 0;
        var lastequality = null;
        var pointer = 0;
        var length_insertions1 = 0;
        var length_deletions1 = 0;
        var length_insertions2 = 0;
        var length_deletions2 = 0;
        while (pointer < diffs.length) {
          if (diffs[pointer][0] == DIFF_EQUAL) {
            equalities[equalitiesLength++] = pointer;
            length_insertions1 = length_insertions2;
            length_deletions1 = length_deletions2;
            length_insertions2 = 0;
            length_deletions2 = 0;
            lastequality = diffs[pointer][1];
          } else {
            if (diffs[pointer][0] == DIFF_INSERT) {
              length_insertions2 += diffs[pointer][1].length;
            } else {
              length_deletions2 += diffs[pointer][1].length;
            }
            if (lastequality && lastequality.length <= Math.max(length_insertions1, length_deletions1) && lastequality.length <= Math.max(length_insertions2, length_deletions2)) {
              diffs.splice(equalities[equalitiesLength - 1], 0, [
                DIFF_DELETE,
                lastequality
              ]);
              diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
              equalitiesLength--;
              equalitiesLength--;
              pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
              length_insertions1 = 0;
              length_deletions1 = 0;
              length_insertions2 = 0;
              length_deletions2 = 0;
              lastequality = null;
              changes = true;
            }
          }
          pointer++;
        }
        if (changes) {
          diff_cleanupMerge(diffs);
        }
        diff_cleanupSemanticLossless(diffs);
        pointer = 1;
        while (pointer < diffs.length) {
          if (diffs[pointer - 1][0] == DIFF_DELETE && diffs[pointer][0] == DIFF_INSERT) {
            var deletion = diffs[pointer - 1][1];
            var insertion = diffs[pointer][1];
            var overlap_length1 = diff_commonOverlap_(deletion, insertion);
            var overlap_length2 = diff_commonOverlap_(insertion, deletion);
            if (overlap_length1 >= overlap_length2) {
              if (overlap_length1 >= deletion.length / 2 || overlap_length1 >= insertion.length / 2) {
                diffs.splice(pointer, 0, [
                  DIFF_EQUAL,
                  insertion.substring(0, overlap_length1)
                ]);
                diffs[pointer - 1][1] = deletion.substring(
                  0,
                  deletion.length - overlap_length1
                );
                diffs[pointer + 1][1] = insertion.substring(overlap_length1);
                pointer++;
              }
            } else {
              if (overlap_length2 >= deletion.length / 2 || overlap_length2 >= insertion.length / 2) {
                diffs.splice(pointer, 0, [
                  DIFF_EQUAL,
                  deletion.substring(0, overlap_length2)
                ]);
                diffs[pointer - 1][0] = DIFF_INSERT;
                diffs[pointer - 1][1] = insertion.substring(
                  0,
                  insertion.length - overlap_length2
                );
                diffs[pointer + 1][0] = DIFF_DELETE;
                diffs[pointer + 1][1] = deletion.substring(overlap_length2);
                pointer++;
              }
            }
            pointer++;
          }
          pointer++;
        }
      }
      __name(diff_cleanupSemantic, "diff_cleanupSemantic");
      var nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
      var whitespaceRegex_ = /\s/;
      var linebreakRegex_ = /[\r\n]/;
      var blanklineEndRegex_ = /\n\r?\n$/;
      var blanklineStartRegex_ = /^\r?\n\r?\n/;
      function diff_cleanupSemanticLossless(diffs) {
        function diff_cleanupSemanticScore_(one, two) {
          if (!one || !two) {
            return 6;
          }
          var char1 = one.charAt(one.length - 1);
          var char2 = two.charAt(0);
          var nonAlphaNumeric1 = char1.match(nonAlphaNumericRegex_);
          var nonAlphaNumeric2 = char2.match(nonAlphaNumericRegex_);
          var whitespace1 = nonAlphaNumeric1 && char1.match(whitespaceRegex_);
          var whitespace2 = nonAlphaNumeric2 && char2.match(whitespaceRegex_);
          var lineBreak1 = whitespace1 && char1.match(linebreakRegex_);
          var lineBreak2 = whitespace2 && char2.match(linebreakRegex_);
          var blankLine1 = lineBreak1 && one.match(blanklineEndRegex_);
          var blankLine2 = lineBreak2 && two.match(blanklineStartRegex_);
          if (blankLine1 || blankLine2) {
            return 5;
          } else if (lineBreak1 || lineBreak2) {
            return 4;
          } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
            return 3;
          } else if (whitespace1 || whitespace2) {
            return 2;
          } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
            return 1;
          }
          return 0;
        }
        __name(diff_cleanupSemanticScore_, "diff_cleanupSemanticScore_");
        var pointer = 1;
        while (pointer < diffs.length - 1) {
          if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
            var equality1 = diffs[pointer - 1][1];
            var edit = diffs[pointer][1];
            var equality2 = diffs[pointer + 1][1];
            var commonOffset = diff_commonSuffix(equality1, edit);
            if (commonOffset) {
              var commonString = edit.substring(edit.length - commonOffset);
              equality1 = equality1.substring(0, equality1.length - commonOffset);
              edit = commonString + edit.substring(0, edit.length - commonOffset);
              equality2 = commonString + equality2;
            }
            var bestEquality1 = equality1;
            var bestEdit = edit;
            var bestEquality2 = equality2;
            var bestScore = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
            while (edit.charAt(0) === equality2.charAt(0)) {
              equality1 += edit.charAt(0);
              edit = edit.substring(1) + equality2.charAt(0);
              equality2 = equality2.substring(1);
              var score = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
              if (score >= bestScore) {
                bestScore = score;
                bestEquality1 = equality1;
                bestEdit = edit;
                bestEquality2 = equality2;
              }
            }
            if (diffs[pointer - 1][1] != bestEquality1) {
              if (bestEquality1) {
                diffs[pointer - 1][1] = bestEquality1;
              } else {
                diffs.splice(pointer - 1, 1);
                pointer--;
              }
              diffs[pointer][1] = bestEdit;
              if (bestEquality2) {
                diffs[pointer + 1][1] = bestEquality2;
              } else {
                diffs.splice(pointer + 1, 1);
                pointer--;
              }
            }
          }
          pointer++;
        }
      }
      __name(diff_cleanupSemanticLossless, "diff_cleanupSemanticLossless");
      function diff_cleanupMerge(diffs, fix_unicode) {
        diffs.push([DIFF_EQUAL, ""]);
        var pointer = 0;
        var count_delete = 0;
        var count_insert = 0;
        var text_delete = "";
        var text_insert = "";
        var commonlength;
        while (pointer < diffs.length) {
          if (pointer < diffs.length - 1 && !diffs[pointer][1]) {
            diffs.splice(pointer, 1);
            continue;
          }
          switch (diffs[pointer][0]) {
            case DIFF_INSERT:
              count_insert++;
              text_insert += diffs[pointer][1];
              pointer++;
              break;
            case DIFF_DELETE:
              count_delete++;
              text_delete += diffs[pointer][1];
              pointer++;
              break;
            case DIFF_EQUAL:
              var previous_equality = pointer - count_insert - count_delete - 1;
              if (fix_unicode) {
                if (previous_equality >= 0 && ends_with_pair_start(diffs[previous_equality][1])) {
                  var stray = diffs[previous_equality][1].slice(-1);
                  diffs[previous_equality][1] = diffs[previous_equality][1].slice(
                    0,
                    -1
                  );
                  text_delete = stray + text_delete;
                  text_insert = stray + text_insert;
                  if (!diffs[previous_equality][1]) {
                    diffs.splice(previous_equality, 1);
                    pointer--;
                    var k = previous_equality - 1;
                    if (diffs[k] && diffs[k][0] === DIFF_INSERT) {
                      count_insert++;
                      text_insert = diffs[k][1] + text_insert;
                      k--;
                    }
                    if (diffs[k] && diffs[k][0] === DIFF_DELETE) {
                      count_delete++;
                      text_delete = diffs[k][1] + text_delete;
                      k--;
                    }
                    previous_equality = k;
                  }
                }
                if (starts_with_pair_end(diffs[pointer][1])) {
                  var stray = diffs[pointer][1].charAt(0);
                  diffs[pointer][1] = diffs[pointer][1].slice(1);
                  text_delete += stray;
                  text_insert += stray;
                }
              }
              if (pointer < diffs.length - 1 && !diffs[pointer][1]) {
                diffs.splice(pointer, 1);
                break;
              }
              if (text_delete.length > 0 || text_insert.length > 0) {
                if (text_delete.length > 0 && text_insert.length > 0) {
                  commonlength = diff_commonPrefix(text_insert, text_delete);
                  if (commonlength !== 0) {
                    if (previous_equality >= 0) {
                      diffs[previous_equality][1] += text_insert.substring(
                        0,
                        commonlength
                      );
                    } else {
                      diffs.splice(0, 0, [
                        DIFF_EQUAL,
                        text_insert.substring(0, commonlength)
                      ]);
                      pointer++;
                    }
                    text_insert = text_insert.substring(commonlength);
                    text_delete = text_delete.substring(commonlength);
                  }
                  commonlength = diff_commonSuffix(text_insert, text_delete);
                  if (commonlength !== 0) {
                    diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
                    text_insert = text_insert.substring(
                      0,
                      text_insert.length - commonlength
                    );
                    text_delete = text_delete.substring(
                      0,
                      text_delete.length - commonlength
                    );
                  }
                }
                var n = count_insert + count_delete;
                if (text_delete.length === 0 && text_insert.length === 0) {
                  diffs.splice(pointer - n, n);
                  pointer = pointer - n;
                } else if (text_delete.length === 0) {
                  diffs.splice(pointer - n, n, [DIFF_INSERT, text_insert]);
                  pointer = pointer - n + 1;
                } else if (text_insert.length === 0) {
                  diffs.splice(pointer - n, n, [DIFF_DELETE, text_delete]);
                  pointer = pointer - n + 1;
                } else {
                  diffs.splice(
                    pointer - n,
                    n,
                    [DIFF_DELETE, text_delete],
                    [DIFF_INSERT, text_insert]
                  );
                  pointer = pointer - n + 2;
                }
              }
              if (pointer !== 0 && diffs[pointer - 1][0] === DIFF_EQUAL) {
                diffs[pointer - 1][1] += diffs[pointer][1];
                diffs.splice(pointer, 1);
              } else {
                pointer++;
              }
              count_insert = 0;
              count_delete = 0;
              text_delete = "";
              text_insert = "";
              break;
          }
        }
        if (diffs[diffs.length - 1][1] === "") {
          diffs.pop();
        }
        var changes = false;
        pointer = 1;
        while (pointer < diffs.length - 1) {
          if (diffs[pointer - 1][0] === DIFF_EQUAL && diffs[pointer + 1][0] === DIFF_EQUAL) {
            if (diffs[pointer][1].substring(
              diffs[pointer][1].length - diffs[pointer - 1][1].length
            ) === diffs[pointer - 1][1]) {
              diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(
                0,
                diffs[pointer][1].length - diffs[pointer - 1][1].length
              );
              diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
              diffs.splice(pointer - 1, 1);
              changes = true;
            } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) == diffs[pointer + 1][1]) {
              diffs[pointer - 1][1] += diffs[pointer + 1][1];
              diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
              diffs.splice(pointer + 1, 1);
              changes = true;
            }
          }
          pointer++;
        }
        if (changes) {
          diff_cleanupMerge(diffs, fix_unicode);
        }
      }
      __name(diff_cleanupMerge, "diff_cleanupMerge");
      function is_surrogate_pair_start(charCode) {
        return charCode >= 55296 && charCode <= 56319;
      }
      __name(is_surrogate_pair_start, "is_surrogate_pair_start");
      function is_surrogate_pair_end(charCode) {
        return charCode >= 56320 && charCode <= 57343;
      }
      __name(is_surrogate_pair_end, "is_surrogate_pair_end");
      function starts_with_pair_end(str) {
        return is_surrogate_pair_end(str.charCodeAt(0));
      }
      __name(starts_with_pair_end, "starts_with_pair_end");
      function ends_with_pair_start(str) {
        return is_surrogate_pair_start(str.charCodeAt(str.length - 1));
      }
      __name(ends_with_pair_start, "ends_with_pair_start");
      function remove_empty_tuples(tuples) {
        var ret = [];
        for (var i = 0; i < tuples.length; i++) {
          if (tuples[i][1].length > 0) {
            ret.push(tuples[i]);
          }
        }
        return ret;
      }
      __name(remove_empty_tuples, "remove_empty_tuples");
      function make_edit_splice(before, oldMiddle, newMiddle, after) {
        if (ends_with_pair_start(before) || starts_with_pair_end(after)) {
          return null;
        }
        return remove_empty_tuples([
          [DIFF_EQUAL, before],
          [DIFF_DELETE, oldMiddle],
          [DIFF_INSERT, newMiddle],
          [DIFF_EQUAL, after]
        ]);
      }
      __name(make_edit_splice, "make_edit_splice");
      function find_cursor_edit_diff(oldText, newText, cursor_pos) {
        var oldRange = typeof cursor_pos === "number" ? { index: cursor_pos, length: 0 } : cursor_pos.oldRange;
        var newRange = typeof cursor_pos === "number" ? null : cursor_pos.newRange;
        var oldLength = oldText.length;
        var newLength = newText.length;
        if (oldRange.length === 0 && (newRange === null || newRange.length === 0)) {
          var oldCursor = oldRange.index;
          var oldBefore = oldText.slice(0, oldCursor);
          var oldAfter = oldText.slice(oldCursor);
          var maybeNewCursor = newRange ? newRange.index : null;
          editBefore: {
            var newCursor = oldCursor + newLength - oldLength;
            if (maybeNewCursor !== null && maybeNewCursor !== newCursor) {
              break editBefore;
            }
            if (newCursor < 0 || newCursor > newLength) {
              break editBefore;
            }
            var newBefore = newText.slice(0, newCursor);
            var newAfter = newText.slice(newCursor);
            if (newAfter !== oldAfter) {
              break editBefore;
            }
            var prefixLength = Math.min(oldCursor, newCursor);
            var oldPrefix = oldBefore.slice(0, prefixLength);
            var newPrefix = newBefore.slice(0, prefixLength);
            if (oldPrefix !== newPrefix) {
              break editBefore;
            }
            var oldMiddle = oldBefore.slice(prefixLength);
            var newMiddle = newBefore.slice(prefixLength);
            return make_edit_splice(oldPrefix, oldMiddle, newMiddle, oldAfter);
          }
          editAfter: {
            if (maybeNewCursor !== null && maybeNewCursor !== oldCursor) {
              break editAfter;
            }
            var cursor = oldCursor;
            var newBefore = newText.slice(0, cursor);
            var newAfter = newText.slice(cursor);
            if (newBefore !== oldBefore) {
              break editAfter;
            }
            var suffixLength = Math.min(oldLength - cursor, newLength - cursor);
            var oldSuffix = oldAfter.slice(oldAfter.length - suffixLength);
            var newSuffix = newAfter.slice(newAfter.length - suffixLength);
            if (oldSuffix !== newSuffix) {
              break editAfter;
            }
            var oldMiddle = oldAfter.slice(0, oldAfter.length - suffixLength);
            var newMiddle = newAfter.slice(0, newAfter.length - suffixLength);
            return make_edit_splice(oldBefore, oldMiddle, newMiddle, oldSuffix);
          }
        }
        if (oldRange.length > 0 && newRange && newRange.length === 0) {
          replaceRange: {
            var oldPrefix = oldText.slice(0, oldRange.index);
            var oldSuffix = oldText.slice(oldRange.index + oldRange.length);
            var prefixLength = oldPrefix.length;
            var suffixLength = oldSuffix.length;
            if (newLength < prefixLength + suffixLength) {
              break replaceRange;
            }
            var newPrefix = newText.slice(0, prefixLength);
            var newSuffix = newText.slice(newLength - suffixLength);
            if (oldPrefix !== newPrefix || oldSuffix !== newSuffix) {
              break replaceRange;
            }
            var oldMiddle = oldText.slice(prefixLength, oldLength - suffixLength);
            var newMiddle = newText.slice(prefixLength, newLength - suffixLength);
            return make_edit_splice(oldPrefix, oldMiddle, newMiddle, oldSuffix);
          }
        }
        return null;
      }
      __name(find_cursor_edit_diff, "find_cursor_edit_diff");
      function diff(text1, text2, cursor_pos, cleanup) {
        return diff_main(text1, text2, cursor_pos, cleanup, true);
      }
      __name(diff, "diff");
      diff.INSERT = DIFF_INSERT;
      diff.DELETE = DIFF_DELETE;
      diff.EQUAL = DIFF_EQUAL;
      module2.exports = diff;
    }
  });

  // node_modules/lodash.clonedeep/index.js
  var require_lodash = __commonJS({
    "node_modules/lodash.clonedeep/index.js"(exports2, module2) {
      var LARGE_ARRAY_SIZE2 = 200;
      var HASH_UNDEFINED4 = "__lodash_hash_undefined__";
      var MAX_SAFE_INTEGER3 = 9007199254740991;
      var argsTag5 = "[object Arguments]";
      var arrayTag4 = "[object Array]";
      var boolTag5 = "[object Boolean]";
      var dateTag5 = "[object Date]";
      var errorTag4 = "[object Error]";
      var funcTag4 = "[object Function]";
      var genTag3 = "[object GeneratorFunction]";
      var mapTag7 = "[object Map]";
      var numberTag5 = "[object Number]";
      var objectTag6 = "[object Object]";
      var promiseTag2 = "[object Promise]";
      var regexpTag5 = "[object RegExp]";
      var setTag7 = "[object Set]";
      var stringTag5 = "[object String]";
      var symbolTag4 = "[object Symbol]";
      var weakMapTag4 = "[object WeakMap]";
      var arrayBufferTag5 = "[object ArrayBuffer]";
      var dataViewTag6 = "[object DataView]";
      var float32Tag4 = "[object Float32Array]";
      var float64Tag4 = "[object Float64Array]";
      var int8Tag4 = "[object Int8Array]";
      var int16Tag4 = "[object Int16Array]";
      var int32Tag4 = "[object Int32Array]";
      var uint8Tag4 = "[object Uint8Array]";
      var uint8ClampedTag4 = "[object Uint8ClampedArray]";
      var uint16Tag4 = "[object Uint16Array]";
      var uint32Tag4 = "[object Uint32Array]";
      var reRegExpChar2 = /[\\^$.*+?()[\]{}|]/g;
      var reFlags2 = /\w*$/;
      var reIsHostCtor2 = /^\[object .+?Constructor\]$/;
      var reIsUint2 = /^(?:0|[1-9]\d*)$/;
      var cloneableTags2 = {};
      cloneableTags2[argsTag5] = cloneableTags2[arrayTag4] = cloneableTags2[arrayBufferTag5] = cloneableTags2[dataViewTag6] = cloneableTags2[boolTag5] = cloneableTags2[dateTag5] = cloneableTags2[float32Tag4] = cloneableTags2[float64Tag4] = cloneableTags2[int8Tag4] = cloneableTags2[int16Tag4] = cloneableTags2[int32Tag4] = cloneableTags2[mapTag7] = cloneableTags2[numberTag5] = cloneableTags2[objectTag6] = cloneableTags2[regexpTag5] = cloneableTags2[setTag7] = cloneableTags2[stringTag5] = cloneableTags2[symbolTag4] = cloneableTags2[uint8Tag4] = cloneableTags2[uint8ClampedTag4] = cloneableTags2[uint16Tag4] = cloneableTags2[uint32Tag4] = true;
      cloneableTags2[errorTag4] = cloneableTags2[funcTag4] = cloneableTags2[weakMapTag4] = false;
      var freeGlobal2 = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf2 = typeof self == "object" && self && self.Object === Object && self;
      var root2 = freeGlobal2 || freeSelf2 || Function("return this")();
      var freeExports4 = typeof exports2 == "object" && exports2 && !exports2.nodeType && exports2;
      var freeModule4 = freeExports4 && typeof module2 == "object" && module2 && !module2.nodeType && module2;
      var moduleExports4 = freeModule4 && freeModule4.exports === freeExports4;
      function addMapEntry(map, pair) {
        map.set(pair[0], pair[1]);
        return map;
      }
      __name(addMapEntry, "addMapEntry");
      function addSetEntry(set, value) {
        set.add(value);
        return set;
      }
      __name(addSetEntry, "addSetEntry");
      function arrayEach2(array, iteratee) {
        var index = -1, length = array ? array.length : 0;
        while (++index < length) {
          if (iteratee(array[index], index, array) === false) {
            break;
          }
        }
        return array;
      }
      __name(arrayEach2, "arrayEach");
      function arrayPush2(array, values) {
        var index = -1, length = values.length, offset = array.length;
        while (++index < length) {
          array[offset + index] = values[index];
        }
        return array;
      }
      __name(arrayPush2, "arrayPush");
      function arrayReduce(array, iteratee, accumulator, initAccum) {
        var index = -1, length = array ? array.length : 0;
        if (initAccum && length) {
          accumulator = array[++index];
        }
        while (++index < length) {
          accumulator = iteratee(accumulator, array[index], index, array);
        }
        return accumulator;
      }
      __name(arrayReduce, "arrayReduce");
      function baseTimes2(n, iteratee) {
        var index = -1, result = Array(n);
        while (++index < n) {
          result[index] = iteratee(index);
        }
        return result;
      }
      __name(baseTimes2, "baseTimes");
      function getValue2(object, key) {
        return object == null ? void 0 : object[key];
      }
      __name(getValue2, "getValue");
      function isHostObject(value) {
        var result = false;
        if (value != null && typeof value.toString != "function") {
          try {
            result = !!(value + "");
          } catch (e) {
          }
        }
        return result;
      }
      __name(isHostObject, "isHostObject");
      function mapToArray2(map) {
        var index = -1, result = Array(map.size);
        map.forEach(function(value, key) {
          result[++index] = [key, value];
        });
        return result;
      }
      __name(mapToArray2, "mapToArray");
      function overArg2(func, transform) {
        return function(arg) {
          return func(transform(arg));
        };
      }
      __name(overArg2, "overArg");
      function setToArray2(set) {
        var index = -1, result = Array(set.size);
        set.forEach(function(value) {
          result[++index] = value;
        });
        return result;
      }
      __name(setToArray2, "setToArray");
      var arrayProto2 = Array.prototype;
      var funcProto4 = Function.prototype;
      var objectProto17 = Object.prototype;
      var coreJsData2 = root2["__core-js_shared__"];
      var maskSrcKey2 = function() {
        var uid = /[^.]+$/.exec(coreJsData2 && coreJsData2.keys && coreJsData2.keys.IE_PROTO || "");
        return uid ? "Symbol(src)_1." + uid : "";
      }();
      var funcToString4 = funcProto4.toString;
      var hasOwnProperty14 = objectProto17.hasOwnProperty;
      var objectToString2 = objectProto17.toString;
      var reIsNative2 = RegExp(
        "^" + funcToString4.call(hasOwnProperty14).replace(reRegExpChar2, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      );
      var Buffer4 = moduleExports4 ? root2.Buffer : void 0;
      var Symbol3 = root2.Symbol;
      var Uint8Array3 = root2.Uint8Array;
      var getPrototype2 = overArg2(Object.getPrototypeOf, Object);
      var objectCreate2 = Object.create;
      var propertyIsEnumerable3 = objectProto17.propertyIsEnumerable;
      var splice2 = arrayProto2.splice;
      var nativeGetSymbols3 = Object.getOwnPropertySymbols;
      var nativeIsBuffer2 = Buffer4 ? Buffer4.isBuffer : void 0;
      var nativeKeys2 = overArg2(Object.keys, Object);
      var DataView2 = getNative2(root2, "DataView");
      var Map2 = getNative2(root2, "Map");
      var Promise3 = getNative2(root2, "Promise");
      var Set2 = getNative2(root2, "Set");
      var WeakMap3 = getNative2(root2, "WeakMap");
      var nativeCreate2 = getNative2(Object, "create");
      var dataViewCtorString2 = toSource2(DataView2);
      var mapCtorString2 = toSource2(Map2);
      var promiseCtorString2 = toSource2(Promise3);
      var setCtorString2 = toSource2(Set2);
      var weakMapCtorString2 = toSource2(WeakMap3);
      var symbolProto3 = Symbol3 ? Symbol3.prototype : void 0;
      var symbolValueOf3 = symbolProto3 ? symbolProto3.valueOf : void 0;
      function Hash2(entries) {
        var index = -1, length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      __name(Hash2, "Hash");
      function hashClear2() {
        this.__data__ = nativeCreate2 ? nativeCreate2(null) : {};
      }
      __name(hashClear2, "hashClear");
      function hashDelete2(key) {
        return this.has(key) && delete this.__data__[key];
      }
      __name(hashDelete2, "hashDelete");
      function hashGet2(key) {
        var data = this.__data__;
        if (nativeCreate2) {
          var result = data[key];
          return result === HASH_UNDEFINED4 ? void 0 : result;
        }
        return hasOwnProperty14.call(data, key) ? data[key] : void 0;
      }
      __name(hashGet2, "hashGet");
      function hashHas2(key) {
        var data = this.__data__;
        return nativeCreate2 ? data[key] !== void 0 : hasOwnProperty14.call(data, key);
      }
      __name(hashHas2, "hashHas");
      function hashSet2(key, value) {
        var data = this.__data__;
        data[key] = nativeCreate2 && value === void 0 ? HASH_UNDEFINED4 : value;
        return this;
      }
      __name(hashSet2, "hashSet");
      Hash2.prototype.clear = hashClear2;
      Hash2.prototype["delete"] = hashDelete2;
      Hash2.prototype.get = hashGet2;
      Hash2.prototype.has = hashHas2;
      Hash2.prototype.set = hashSet2;
      function ListCache2(entries) {
        var index = -1, length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      __name(ListCache2, "ListCache");
      function listCacheClear2() {
        this.__data__ = [];
      }
      __name(listCacheClear2, "listCacheClear");
      function listCacheDelete2(key) {
        var data = this.__data__, index = assocIndexOf2(data, key);
        if (index < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index == lastIndex) {
          data.pop();
        } else {
          splice2.call(data, index, 1);
        }
        return true;
      }
      __name(listCacheDelete2, "listCacheDelete");
      function listCacheGet2(key) {
        var data = this.__data__, index = assocIndexOf2(data, key);
        return index < 0 ? void 0 : data[index][1];
      }
      __name(listCacheGet2, "listCacheGet");
      function listCacheHas2(key) {
        return assocIndexOf2(this.__data__, key) > -1;
      }
      __name(listCacheHas2, "listCacheHas");
      function listCacheSet2(key, value) {
        var data = this.__data__, index = assocIndexOf2(data, key);
        if (index < 0) {
          data.push([key, value]);
        } else {
          data[index][1] = value;
        }
        return this;
      }
      __name(listCacheSet2, "listCacheSet");
      ListCache2.prototype.clear = listCacheClear2;
      ListCache2.prototype["delete"] = listCacheDelete2;
      ListCache2.prototype.get = listCacheGet2;
      ListCache2.prototype.has = listCacheHas2;
      ListCache2.prototype.set = listCacheSet2;
      function MapCache2(entries) {
        var index = -1, length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      __name(MapCache2, "MapCache");
      function mapCacheClear2() {
        this.__data__ = {
          "hash": new Hash2(),
          "map": new (Map2 || ListCache2)(),
          "string": new Hash2()
        };
      }
      __name(mapCacheClear2, "mapCacheClear");
      function mapCacheDelete2(key) {
        return getMapData2(this, key)["delete"](key);
      }
      __name(mapCacheDelete2, "mapCacheDelete");
      function mapCacheGet2(key) {
        return getMapData2(this, key).get(key);
      }
      __name(mapCacheGet2, "mapCacheGet");
      function mapCacheHas2(key) {
        return getMapData2(this, key).has(key);
      }
      __name(mapCacheHas2, "mapCacheHas");
      function mapCacheSet2(key, value) {
        getMapData2(this, key).set(key, value);
        return this;
      }
      __name(mapCacheSet2, "mapCacheSet");
      MapCache2.prototype.clear = mapCacheClear2;
      MapCache2.prototype["delete"] = mapCacheDelete2;
      MapCache2.prototype.get = mapCacheGet2;
      MapCache2.prototype.has = mapCacheHas2;
      MapCache2.prototype.set = mapCacheSet2;
      function Stack2(entries) {
        this.__data__ = new ListCache2(entries);
      }
      __name(Stack2, "Stack");
      function stackClear2() {
        this.__data__ = new ListCache2();
      }
      __name(stackClear2, "stackClear");
      function stackDelete2(key) {
        return this.__data__["delete"](key);
      }
      __name(stackDelete2, "stackDelete");
      function stackGet2(key) {
        return this.__data__.get(key);
      }
      __name(stackGet2, "stackGet");
      function stackHas2(key) {
        return this.__data__.has(key);
      }
      __name(stackHas2, "stackHas");
      function stackSet2(key, value) {
        var cache = this.__data__;
        if (cache instanceof ListCache2) {
          var pairs = cache.__data__;
          if (!Map2 || pairs.length < LARGE_ARRAY_SIZE2 - 1) {
            pairs.push([key, value]);
            return this;
          }
          cache = this.__data__ = new MapCache2(pairs);
        }
        cache.set(key, value);
        return this;
      }
      __name(stackSet2, "stackSet");
      Stack2.prototype.clear = stackClear2;
      Stack2.prototype["delete"] = stackDelete2;
      Stack2.prototype.get = stackGet2;
      Stack2.prototype.has = stackHas2;
      Stack2.prototype.set = stackSet2;
      function arrayLikeKeys2(value, inherited) {
        var result = isArray2(value) || isArguments2(value) ? baseTimes2(value.length, String) : [];
        var length = result.length, skipIndexes = !!length;
        for (var key in value) {
          if ((inherited || hasOwnProperty14.call(value, key)) && !(skipIndexes && (key == "length" || isIndex2(key, length)))) {
            result.push(key);
          }
        }
        return result;
      }
      __name(arrayLikeKeys2, "arrayLikeKeys");
      function assignValue2(object, key, value) {
        var objValue = object[key];
        if (!(hasOwnProperty14.call(object, key) && eq2(objValue, value)) || value === void 0 && !(key in object)) {
          object[key] = value;
        }
      }
      __name(assignValue2, "assignValue");
      function assocIndexOf2(array, key) {
        var length = array.length;
        while (length--) {
          if (eq2(array[length][0], key)) {
            return length;
          }
        }
        return -1;
      }
      __name(assocIndexOf2, "assocIndexOf");
      function baseAssign2(object, source) {
        return object && copyObject2(source, keys2(source), object);
      }
      __name(baseAssign2, "baseAssign");
      function baseClone2(value, isDeep, isFull, customizer, key, object, stack) {
        var result;
        if (customizer) {
          result = object ? customizer(value, key, object, stack) : customizer(value);
        }
        if (result !== void 0) {
          return result;
        }
        if (!isObject2(value)) {
          return value;
        }
        var isArr = isArray2(value);
        if (isArr) {
          result = initCloneArray2(value);
          if (!isDeep) {
            return copyArray2(value, result);
          }
        } else {
          var tag = getTag2(value), isFunc = tag == funcTag4 || tag == genTag3;
          if (isBuffer2(value)) {
            return cloneBuffer2(value, isDeep);
          }
          if (tag == objectTag6 || tag == argsTag5 || isFunc && !object) {
            if (isHostObject(value)) {
              return object ? value : {};
            }
            result = initCloneObject2(isFunc ? {} : value);
            if (!isDeep) {
              return copySymbols2(value, baseAssign2(result, value));
            }
          } else {
            if (!cloneableTags2[tag]) {
              return object ? value : {};
            }
            result = initCloneByTag2(value, tag, baseClone2, isDeep);
          }
        }
        stack || (stack = new Stack2());
        var stacked = stack.get(value);
        if (stacked) {
          return stacked;
        }
        stack.set(value, result);
        if (!isArr) {
          var props = isFull ? getAllKeys2(value) : keys2(value);
        }
        arrayEach2(props || value, function(subValue, key2) {
          if (props) {
            key2 = subValue;
            subValue = value[key2];
          }
          assignValue2(result, key2, baseClone2(subValue, isDeep, isFull, customizer, key2, value, stack));
        });
        return result;
      }
      __name(baseClone2, "baseClone");
      function baseCreate2(proto) {
        return isObject2(proto) ? objectCreate2(proto) : {};
      }
      __name(baseCreate2, "baseCreate");
      function baseGetAllKeys2(object, keysFunc, symbolsFunc) {
        var result = keysFunc(object);
        return isArray2(object) ? result : arrayPush2(result, symbolsFunc(object));
      }
      __name(baseGetAllKeys2, "baseGetAllKeys");
      function baseGetTag2(value) {
        return objectToString2.call(value);
      }
      __name(baseGetTag2, "baseGetTag");
      function baseIsNative2(value) {
        if (!isObject2(value) || isMasked2(value)) {
          return false;
        }
        var pattern = isFunction2(value) || isHostObject(value) ? reIsNative2 : reIsHostCtor2;
        return pattern.test(toSource2(value));
      }
      __name(baseIsNative2, "baseIsNative");
      function baseKeys2(object) {
        if (!isPrototype2(object)) {
          return nativeKeys2(object);
        }
        var result = [];
        for (var key in Object(object)) {
          if (hasOwnProperty14.call(object, key) && key != "constructor") {
            result.push(key);
          }
        }
        return result;
      }
      __name(baseKeys2, "baseKeys");
      function cloneBuffer2(buffer, isDeep) {
        if (isDeep) {
          return buffer.slice();
        }
        var result = new buffer.constructor(buffer.length);
        buffer.copy(result);
        return result;
      }
      __name(cloneBuffer2, "cloneBuffer");
      function cloneArrayBuffer2(arrayBuffer) {
        var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
        new Uint8Array3(result).set(new Uint8Array3(arrayBuffer));
        return result;
      }
      __name(cloneArrayBuffer2, "cloneArrayBuffer");
      function cloneDataView2(dataView, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer2(dataView.buffer) : dataView.buffer;
        return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
      }
      __name(cloneDataView2, "cloneDataView");
      function cloneMap(map, isDeep, cloneFunc) {
        var array = isDeep ? cloneFunc(mapToArray2(map), true) : mapToArray2(map);
        return arrayReduce(array, addMapEntry, new map.constructor());
      }
      __name(cloneMap, "cloneMap");
      function cloneRegExp2(regexp) {
        var result = new regexp.constructor(regexp.source, reFlags2.exec(regexp));
        result.lastIndex = regexp.lastIndex;
        return result;
      }
      __name(cloneRegExp2, "cloneRegExp");
      function cloneSet(set, isDeep, cloneFunc) {
        var array = isDeep ? cloneFunc(setToArray2(set), true) : setToArray2(set);
        return arrayReduce(array, addSetEntry, new set.constructor());
      }
      __name(cloneSet, "cloneSet");
      function cloneSymbol2(symbol) {
        return symbolValueOf3 ? Object(symbolValueOf3.call(symbol)) : {};
      }
      __name(cloneSymbol2, "cloneSymbol");
      function cloneTypedArray2(typedArray, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer2(typedArray.buffer) : typedArray.buffer;
        return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
      }
      __name(cloneTypedArray2, "cloneTypedArray");
      function copyArray2(source, array) {
        var index = -1, length = source.length;
        array || (array = Array(length));
        while (++index < length) {
          array[index] = source[index];
        }
        return array;
      }
      __name(copyArray2, "copyArray");
      function copyObject2(source, props, object, customizer) {
        object || (object = {});
        var index = -1, length = props.length;
        while (++index < length) {
          var key = props[index];
          var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
          assignValue2(object, key, newValue === void 0 ? source[key] : newValue);
        }
        return object;
      }
      __name(copyObject2, "copyObject");
      function copySymbols2(source, object) {
        return copyObject2(source, getSymbols2(source), object);
      }
      __name(copySymbols2, "copySymbols");
      function getAllKeys2(object) {
        return baseGetAllKeys2(object, keys2, getSymbols2);
      }
      __name(getAllKeys2, "getAllKeys");
      function getMapData2(map, key) {
        var data = map.__data__;
        return isKeyable2(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
      }
      __name(getMapData2, "getMapData");
      function getNative2(object, key) {
        var value = getValue2(object, key);
        return baseIsNative2(value) ? value : void 0;
      }
      __name(getNative2, "getNative");
      var getSymbols2 = nativeGetSymbols3 ? overArg2(nativeGetSymbols3, Object) : stubArray2;
      var getTag2 = baseGetTag2;
      if (DataView2 && getTag2(new DataView2(new ArrayBuffer(1))) != dataViewTag6 || Map2 && getTag2(new Map2()) != mapTag7 || Promise3 && getTag2(Promise3.resolve()) != promiseTag2 || Set2 && getTag2(new Set2()) != setTag7 || WeakMap3 && getTag2(new WeakMap3()) != weakMapTag4) {
        getTag2 = /* @__PURE__ */ __name(function(value) {
          var result = objectToString2.call(value), Ctor = result == objectTag6 ? value.constructor : void 0, ctorString = Ctor ? toSource2(Ctor) : void 0;
          if (ctorString) {
            switch (ctorString) {
              case dataViewCtorString2:
                return dataViewTag6;
              case mapCtorString2:
                return mapTag7;
              case promiseCtorString2:
                return promiseTag2;
              case setCtorString2:
                return setTag7;
              case weakMapCtorString2:
                return weakMapTag4;
            }
          }
          return result;
        }, "getTag");
      }
      function initCloneArray2(array) {
        var length = array.length, result = array.constructor(length);
        if (length && typeof array[0] == "string" && hasOwnProperty14.call(array, "index")) {
          result.index = array.index;
          result.input = array.input;
        }
        return result;
      }
      __name(initCloneArray2, "initCloneArray");
      function initCloneObject2(object) {
        return typeof object.constructor == "function" && !isPrototype2(object) ? baseCreate2(getPrototype2(object)) : {};
      }
      __name(initCloneObject2, "initCloneObject");
      function initCloneByTag2(object, tag, cloneFunc, isDeep) {
        var Ctor = object.constructor;
        switch (tag) {
          case arrayBufferTag5:
            return cloneArrayBuffer2(object);
          case boolTag5:
          case dateTag5:
            return new Ctor(+object);
          case dataViewTag6:
            return cloneDataView2(object, isDeep);
          case float32Tag4:
          case float64Tag4:
          case int8Tag4:
          case int16Tag4:
          case int32Tag4:
          case uint8Tag4:
          case uint8ClampedTag4:
          case uint16Tag4:
          case uint32Tag4:
            return cloneTypedArray2(object, isDeep);
          case mapTag7:
            return cloneMap(object, isDeep, cloneFunc);
          case numberTag5:
          case stringTag5:
            return new Ctor(object);
          case regexpTag5:
            return cloneRegExp2(object);
          case setTag7:
            return cloneSet(object, isDeep, cloneFunc);
          case symbolTag4:
            return cloneSymbol2(object);
        }
      }
      __name(initCloneByTag2, "initCloneByTag");
      function isIndex2(value, length) {
        length = length == null ? MAX_SAFE_INTEGER3 : length;
        return !!length && (typeof value == "number" || reIsUint2.test(value)) && (value > -1 && value % 1 == 0 && value < length);
      }
      __name(isIndex2, "isIndex");
      function isKeyable2(value) {
        var type = typeof value;
        return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
      }
      __name(isKeyable2, "isKeyable");
      function isMasked2(func) {
        return !!maskSrcKey2 && maskSrcKey2 in func;
      }
      __name(isMasked2, "isMasked");
      function isPrototype2(value) {
        var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto17;
        return value === proto;
      }
      __name(isPrototype2, "isPrototype");
      function toSource2(func) {
        if (func != null) {
          try {
            return funcToString4.call(func);
          } catch (e) {
          }
          try {
            return func + "";
          } catch (e) {
          }
        }
        return "";
      }
      __name(toSource2, "toSource");
      function cloneDeep2(value) {
        return baseClone2(value, true, true);
      }
      __name(cloneDeep2, "cloneDeep");
      function eq2(value, other) {
        return value === other || value !== value && other !== other;
      }
      __name(eq2, "eq");
      function isArguments2(value) {
        return isArrayLikeObject2(value) && hasOwnProperty14.call(value, "callee") && (!propertyIsEnumerable3.call(value, "callee") || objectToString2.call(value) == argsTag5);
      }
      __name(isArguments2, "isArguments");
      var isArray2 = Array.isArray;
      function isArrayLike2(value) {
        return value != null && isLength2(value.length) && !isFunction2(value);
      }
      __name(isArrayLike2, "isArrayLike");
      function isArrayLikeObject2(value) {
        return isObjectLike2(value) && isArrayLike2(value);
      }
      __name(isArrayLikeObject2, "isArrayLikeObject");
      var isBuffer2 = nativeIsBuffer2 || stubFalse2;
      function isFunction2(value) {
        var tag = isObject2(value) ? objectToString2.call(value) : "";
        return tag == funcTag4 || tag == genTag3;
      }
      __name(isFunction2, "isFunction");
      function isLength2(value) {
        return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER3;
      }
      __name(isLength2, "isLength");
      function isObject2(value) {
        var type = typeof value;
        return !!value && (type == "object" || type == "function");
      }
      __name(isObject2, "isObject");
      function isObjectLike2(value) {
        return !!value && typeof value == "object";
      }
      __name(isObjectLike2, "isObjectLike");
      function keys2(object) {
        return isArrayLike2(object) ? arrayLikeKeys2(object) : baseKeys2(object);
      }
      __name(keys2, "keys");
      function stubArray2() {
        return [];
      }
      __name(stubArray2, "stubArray");
      function stubFalse2() {
        return false;
      }
      __name(stubFalse2, "stubFalse");
      module2.exports = cloneDeep2;
    }
  });

  // node_modules/lodash.isequal/index.js
  var require_lodash2 = __commonJS({
    "node_modules/lodash.isequal/index.js"(exports2, module2) {
      var LARGE_ARRAY_SIZE2 = 200;
      var HASH_UNDEFINED4 = "__lodash_hash_undefined__";
      var COMPARE_PARTIAL_FLAG5 = 1;
      var COMPARE_UNORDERED_FLAG3 = 2;
      var MAX_SAFE_INTEGER3 = 9007199254740991;
      var argsTag5 = "[object Arguments]";
      var arrayTag4 = "[object Array]";
      var asyncTag2 = "[object AsyncFunction]";
      var boolTag5 = "[object Boolean]";
      var dateTag5 = "[object Date]";
      var errorTag4 = "[object Error]";
      var funcTag4 = "[object Function]";
      var genTag3 = "[object GeneratorFunction]";
      var mapTag7 = "[object Map]";
      var numberTag5 = "[object Number]";
      var nullTag2 = "[object Null]";
      var objectTag6 = "[object Object]";
      var promiseTag2 = "[object Promise]";
      var proxyTag2 = "[object Proxy]";
      var regexpTag5 = "[object RegExp]";
      var setTag7 = "[object Set]";
      var stringTag5 = "[object String]";
      var symbolTag4 = "[object Symbol]";
      var undefinedTag2 = "[object Undefined]";
      var weakMapTag4 = "[object WeakMap]";
      var arrayBufferTag5 = "[object ArrayBuffer]";
      var dataViewTag6 = "[object DataView]";
      var float32Tag4 = "[object Float32Array]";
      var float64Tag4 = "[object Float64Array]";
      var int8Tag4 = "[object Int8Array]";
      var int16Tag4 = "[object Int16Array]";
      var int32Tag4 = "[object Int32Array]";
      var uint8Tag4 = "[object Uint8Array]";
      var uint8ClampedTag4 = "[object Uint8ClampedArray]";
      var uint16Tag4 = "[object Uint16Array]";
      var uint32Tag4 = "[object Uint32Array]";
      var reRegExpChar2 = /[\\^$.*+?()[\]{}|]/g;
      var reIsHostCtor2 = /^\[object .+?Constructor\]$/;
      var reIsUint2 = /^(?:0|[1-9]\d*)$/;
      var typedArrayTags2 = {};
      typedArrayTags2[float32Tag4] = typedArrayTags2[float64Tag4] = typedArrayTags2[int8Tag4] = typedArrayTags2[int16Tag4] = typedArrayTags2[int32Tag4] = typedArrayTags2[uint8Tag4] = typedArrayTags2[uint8ClampedTag4] = typedArrayTags2[uint16Tag4] = typedArrayTags2[uint32Tag4] = true;
      typedArrayTags2[argsTag5] = typedArrayTags2[arrayTag4] = typedArrayTags2[arrayBufferTag5] = typedArrayTags2[boolTag5] = typedArrayTags2[dataViewTag6] = typedArrayTags2[dateTag5] = typedArrayTags2[errorTag4] = typedArrayTags2[funcTag4] = typedArrayTags2[mapTag7] = typedArrayTags2[numberTag5] = typedArrayTags2[objectTag6] = typedArrayTags2[regexpTag5] = typedArrayTags2[setTag7] = typedArrayTags2[stringTag5] = typedArrayTags2[weakMapTag4] = false;
      var freeGlobal2 = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf2 = typeof self == "object" && self && self.Object === Object && self;
      var root2 = freeGlobal2 || freeSelf2 || Function("return this")();
      var freeExports4 = typeof exports2 == "object" && exports2 && !exports2.nodeType && exports2;
      var freeModule4 = freeExports4 && typeof module2 == "object" && module2 && !module2.nodeType && module2;
      var moduleExports4 = freeModule4 && freeModule4.exports === freeExports4;
      var freeProcess2 = moduleExports4 && freeGlobal2.process;
      var nodeUtil2 = function() {
        try {
          return freeProcess2 && freeProcess2.binding && freeProcess2.binding("util");
        } catch (e) {
        }
      }();
      var nodeIsTypedArray2 = nodeUtil2 && nodeUtil2.isTypedArray;
      function arrayFilter2(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
        while (++index < length) {
          var value = array[index];
          if (predicate(value, index, array)) {
            result[resIndex++] = value;
          }
        }
        return result;
      }
      __name(arrayFilter2, "arrayFilter");
      function arrayPush2(array, values) {
        var index = -1, length = values.length, offset = array.length;
        while (++index < length) {
          array[offset + index] = values[index];
        }
        return array;
      }
      __name(arrayPush2, "arrayPush");
      function arraySome2(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (predicate(array[index], index, array)) {
            return true;
          }
        }
        return false;
      }
      __name(arraySome2, "arraySome");
      function baseTimes2(n, iteratee) {
        var index = -1, result = Array(n);
        while (++index < n) {
          result[index] = iteratee(index);
        }
        return result;
      }
      __name(baseTimes2, "baseTimes");
      function baseUnary2(func) {
        return function(value) {
          return func(value);
        };
      }
      __name(baseUnary2, "baseUnary");
      function cacheHas2(cache, key) {
        return cache.has(key);
      }
      __name(cacheHas2, "cacheHas");
      function getValue2(object, key) {
        return object == null ? void 0 : object[key];
      }
      __name(getValue2, "getValue");
      function mapToArray2(map) {
        var index = -1, result = Array(map.size);
        map.forEach(function(value, key) {
          result[++index] = [key, value];
        });
        return result;
      }
      __name(mapToArray2, "mapToArray");
      function overArg2(func, transform) {
        return function(arg) {
          return func(transform(arg));
        };
      }
      __name(overArg2, "overArg");
      function setToArray2(set) {
        var index = -1, result = Array(set.size);
        set.forEach(function(value) {
          result[++index] = value;
        });
        return result;
      }
      __name(setToArray2, "setToArray");
      var arrayProto2 = Array.prototype;
      var funcProto4 = Function.prototype;
      var objectProto17 = Object.prototype;
      var coreJsData2 = root2["__core-js_shared__"];
      var funcToString4 = funcProto4.toString;
      var hasOwnProperty14 = objectProto17.hasOwnProperty;
      var maskSrcKey2 = function() {
        var uid = /[^.]+$/.exec(coreJsData2 && coreJsData2.keys && coreJsData2.keys.IE_PROTO || "");
        return uid ? "Symbol(src)_1." + uid : "";
      }();
      var nativeObjectToString3 = objectProto17.toString;
      var reIsNative2 = RegExp(
        "^" + funcToString4.call(hasOwnProperty14).replace(reRegExpChar2, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      );
      var Buffer4 = moduleExports4 ? root2.Buffer : void 0;
      var Symbol3 = root2.Symbol;
      var Uint8Array3 = root2.Uint8Array;
      var propertyIsEnumerable3 = objectProto17.propertyIsEnumerable;
      var splice2 = arrayProto2.splice;
      var symToStringTag3 = Symbol3 ? Symbol3.toStringTag : void 0;
      var nativeGetSymbols3 = Object.getOwnPropertySymbols;
      var nativeIsBuffer2 = Buffer4 ? Buffer4.isBuffer : void 0;
      var nativeKeys2 = overArg2(Object.keys, Object);
      var DataView2 = getNative2(root2, "DataView");
      var Map2 = getNative2(root2, "Map");
      var Promise3 = getNative2(root2, "Promise");
      var Set2 = getNative2(root2, "Set");
      var WeakMap3 = getNative2(root2, "WeakMap");
      var nativeCreate2 = getNative2(Object, "create");
      var dataViewCtorString2 = toSource2(DataView2);
      var mapCtorString2 = toSource2(Map2);
      var promiseCtorString2 = toSource2(Promise3);
      var setCtorString2 = toSource2(Set2);
      var weakMapCtorString2 = toSource2(WeakMap3);
      var symbolProto3 = Symbol3 ? Symbol3.prototype : void 0;
      var symbolValueOf3 = symbolProto3 ? symbolProto3.valueOf : void 0;
      function Hash2(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      __name(Hash2, "Hash");
      function hashClear2() {
        this.__data__ = nativeCreate2 ? nativeCreate2(null) : {};
        this.size = 0;
      }
      __name(hashClear2, "hashClear");
      function hashDelete2(key) {
        var result = this.has(key) && delete this.__data__[key];
        this.size -= result ? 1 : 0;
        return result;
      }
      __name(hashDelete2, "hashDelete");
      function hashGet2(key) {
        var data = this.__data__;
        if (nativeCreate2) {
          var result = data[key];
          return result === HASH_UNDEFINED4 ? void 0 : result;
        }
        return hasOwnProperty14.call(data, key) ? data[key] : void 0;
      }
      __name(hashGet2, "hashGet");
      function hashHas2(key) {
        var data = this.__data__;
        return nativeCreate2 ? data[key] !== void 0 : hasOwnProperty14.call(data, key);
      }
      __name(hashHas2, "hashHas");
      function hashSet2(key, value) {
        var data = this.__data__;
        this.size += this.has(key) ? 0 : 1;
        data[key] = nativeCreate2 && value === void 0 ? HASH_UNDEFINED4 : value;
        return this;
      }
      __name(hashSet2, "hashSet");
      Hash2.prototype.clear = hashClear2;
      Hash2.prototype["delete"] = hashDelete2;
      Hash2.prototype.get = hashGet2;
      Hash2.prototype.has = hashHas2;
      Hash2.prototype.set = hashSet2;
      function ListCache2(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      __name(ListCache2, "ListCache");
      function listCacheClear2() {
        this.__data__ = [];
        this.size = 0;
      }
      __name(listCacheClear2, "listCacheClear");
      function listCacheDelete2(key) {
        var data = this.__data__, index = assocIndexOf2(data, key);
        if (index < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index == lastIndex) {
          data.pop();
        } else {
          splice2.call(data, index, 1);
        }
        --this.size;
        return true;
      }
      __name(listCacheDelete2, "listCacheDelete");
      function listCacheGet2(key) {
        var data = this.__data__, index = assocIndexOf2(data, key);
        return index < 0 ? void 0 : data[index][1];
      }
      __name(listCacheGet2, "listCacheGet");
      function listCacheHas2(key) {
        return assocIndexOf2(this.__data__, key) > -1;
      }
      __name(listCacheHas2, "listCacheHas");
      function listCacheSet2(key, value) {
        var data = this.__data__, index = assocIndexOf2(data, key);
        if (index < 0) {
          ++this.size;
          data.push([key, value]);
        } else {
          data[index][1] = value;
        }
        return this;
      }
      __name(listCacheSet2, "listCacheSet");
      ListCache2.prototype.clear = listCacheClear2;
      ListCache2.prototype["delete"] = listCacheDelete2;
      ListCache2.prototype.get = listCacheGet2;
      ListCache2.prototype.has = listCacheHas2;
      ListCache2.prototype.set = listCacheSet2;
      function MapCache2(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      __name(MapCache2, "MapCache");
      function mapCacheClear2() {
        this.size = 0;
        this.__data__ = {
          "hash": new Hash2(),
          "map": new (Map2 || ListCache2)(),
          "string": new Hash2()
        };
      }
      __name(mapCacheClear2, "mapCacheClear");
      function mapCacheDelete2(key) {
        var result = getMapData2(this, key)["delete"](key);
        this.size -= result ? 1 : 0;
        return result;
      }
      __name(mapCacheDelete2, "mapCacheDelete");
      function mapCacheGet2(key) {
        return getMapData2(this, key).get(key);
      }
      __name(mapCacheGet2, "mapCacheGet");
      function mapCacheHas2(key) {
        return getMapData2(this, key).has(key);
      }
      __name(mapCacheHas2, "mapCacheHas");
      function mapCacheSet2(key, value) {
        var data = getMapData2(this, key), size = data.size;
        data.set(key, value);
        this.size += data.size == size ? 0 : 1;
        return this;
      }
      __name(mapCacheSet2, "mapCacheSet");
      MapCache2.prototype.clear = mapCacheClear2;
      MapCache2.prototype["delete"] = mapCacheDelete2;
      MapCache2.prototype.get = mapCacheGet2;
      MapCache2.prototype.has = mapCacheHas2;
      MapCache2.prototype.set = mapCacheSet2;
      function SetCache2(values) {
        var index = -1, length = values == null ? 0 : values.length;
        this.__data__ = new MapCache2();
        while (++index < length) {
          this.add(values[index]);
        }
      }
      __name(SetCache2, "SetCache");
      function setCacheAdd2(value) {
        this.__data__.set(value, HASH_UNDEFINED4);
        return this;
      }
      __name(setCacheAdd2, "setCacheAdd");
      function setCacheHas2(value) {
        return this.__data__.has(value);
      }
      __name(setCacheHas2, "setCacheHas");
      SetCache2.prototype.add = SetCache2.prototype.push = setCacheAdd2;
      SetCache2.prototype.has = setCacheHas2;
      function Stack2(entries) {
        var data = this.__data__ = new ListCache2(entries);
        this.size = data.size;
      }
      __name(Stack2, "Stack");
      function stackClear2() {
        this.__data__ = new ListCache2();
        this.size = 0;
      }
      __name(stackClear2, "stackClear");
      function stackDelete2(key) {
        var data = this.__data__, result = data["delete"](key);
        this.size = data.size;
        return result;
      }
      __name(stackDelete2, "stackDelete");
      function stackGet2(key) {
        return this.__data__.get(key);
      }
      __name(stackGet2, "stackGet");
      function stackHas2(key) {
        return this.__data__.has(key);
      }
      __name(stackHas2, "stackHas");
      function stackSet2(key, value) {
        var data = this.__data__;
        if (data instanceof ListCache2) {
          var pairs = data.__data__;
          if (!Map2 || pairs.length < LARGE_ARRAY_SIZE2 - 1) {
            pairs.push([key, value]);
            this.size = ++data.size;
            return this;
          }
          data = this.__data__ = new MapCache2(pairs);
        }
        data.set(key, value);
        this.size = data.size;
        return this;
      }
      __name(stackSet2, "stackSet");
      Stack2.prototype.clear = stackClear2;
      Stack2.prototype["delete"] = stackDelete2;
      Stack2.prototype.get = stackGet2;
      Stack2.prototype.has = stackHas2;
      Stack2.prototype.set = stackSet2;
      function arrayLikeKeys2(value, inherited) {
        var isArr = isArray2(value), isArg = !isArr && isArguments2(value), isBuff = !isArr && !isArg && isBuffer2(value), isType = !isArr && !isArg && !isBuff && isTypedArray2(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes2(value.length, String) : [], length = result.length;
        for (var key in value) {
          if ((inherited || hasOwnProperty14.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
          (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
          isIndex2(key, length)))) {
            result.push(key);
          }
        }
        return result;
      }
      __name(arrayLikeKeys2, "arrayLikeKeys");
      function assocIndexOf2(array, key) {
        var length = array.length;
        while (length--) {
          if (eq2(array[length][0], key)) {
            return length;
          }
        }
        return -1;
      }
      __name(assocIndexOf2, "assocIndexOf");
      function baseGetAllKeys2(object, keysFunc, symbolsFunc) {
        var result = keysFunc(object);
        return isArray2(object) ? result : arrayPush2(result, symbolsFunc(object));
      }
      __name(baseGetAllKeys2, "baseGetAllKeys");
      function baseGetTag2(value) {
        if (value == null) {
          return value === void 0 ? undefinedTag2 : nullTag2;
        }
        return symToStringTag3 && symToStringTag3 in Object(value) ? getRawTag2(value) : objectToString2(value);
      }
      __name(baseGetTag2, "baseGetTag");
      function baseIsArguments2(value) {
        return isObjectLike2(value) && baseGetTag2(value) == argsTag5;
      }
      __name(baseIsArguments2, "baseIsArguments");
      function baseIsEqual2(value, other, bitmask, customizer, stack) {
        if (value === other) {
          return true;
        }
        if (value == null || other == null || !isObjectLike2(value) && !isObjectLike2(other)) {
          return value !== value && other !== other;
        }
        return baseIsEqualDeep2(value, other, bitmask, customizer, baseIsEqual2, stack);
      }
      __name(baseIsEqual2, "baseIsEqual");
      function baseIsEqualDeep2(object, other, bitmask, customizer, equalFunc, stack) {
        var objIsArr = isArray2(object), othIsArr = isArray2(other), objTag = objIsArr ? arrayTag4 : getTag2(object), othTag = othIsArr ? arrayTag4 : getTag2(other);
        objTag = objTag == argsTag5 ? objectTag6 : objTag;
        othTag = othTag == argsTag5 ? objectTag6 : othTag;
        var objIsObj = objTag == objectTag6, othIsObj = othTag == objectTag6, isSameTag = objTag == othTag;
        if (isSameTag && isBuffer2(object)) {
          if (!isBuffer2(other)) {
            return false;
          }
          objIsArr = true;
          objIsObj = false;
        }
        if (isSameTag && !objIsObj) {
          stack || (stack = new Stack2());
          return objIsArr || isTypedArray2(object) ? equalArrays2(object, other, bitmask, customizer, equalFunc, stack) : equalByTag2(object, other, objTag, bitmask, customizer, equalFunc, stack);
        }
        if (!(bitmask & COMPARE_PARTIAL_FLAG5)) {
          var objIsWrapped = objIsObj && hasOwnProperty14.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty14.call(other, "__wrapped__");
          if (objIsWrapped || othIsWrapped) {
            var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
            stack || (stack = new Stack2());
            return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
          }
        }
        if (!isSameTag) {
          return false;
        }
        stack || (stack = new Stack2());
        return equalObjects2(object, other, bitmask, customizer, equalFunc, stack);
      }
      __name(baseIsEqualDeep2, "baseIsEqualDeep");
      function baseIsNative2(value) {
        if (!isObject2(value) || isMasked2(value)) {
          return false;
        }
        var pattern = isFunction2(value) ? reIsNative2 : reIsHostCtor2;
        return pattern.test(toSource2(value));
      }
      __name(baseIsNative2, "baseIsNative");
      function baseIsTypedArray2(value) {
        return isObjectLike2(value) && isLength2(value.length) && !!typedArrayTags2[baseGetTag2(value)];
      }
      __name(baseIsTypedArray2, "baseIsTypedArray");
      function baseKeys2(object) {
        if (!isPrototype2(object)) {
          return nativeKeys2(object);
        }
        var result = [];
        for (var key in Object(object)) {
          if (hasOwnProperty14.call(object, key) && key != "constructor") {
            result.push(key);
          }
        }
        return result;
      }
      __name(baseKeys2, "baseKeys");
      function equalArrays2(array, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG5, arrLength = array.length, othLength = other.length;
        if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
          return false;
        }
        var stacked = stack.get(array);
        if (stacked && stack.get(other)) {
          return stacked == other;
        }
        var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG3 ? new SetCache2() : void 0;
        stack.set(array, other);
        stack.set(other, array);
        while (++index < arrLength) {
          var arrValue = array[index], othValue = other[index];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
          }
          if (compared !== void 0) {
            if (compared) {
              continue;
            }
            result = false;
            break;
          }
          if (seen) {
            if (!arraySome2(other, function(othValue2, othIndex) {
              if (!cacheHas2(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
                return seen.push(othIndex);
              }
            })) {
              result = false;
              break;
            }
          } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
            result = false;
            break;
          }
        }
        stack["delete"](array);
        stack["delete"](other);
        return result;
      }
      __name(equalArrays2, "equalArrays");
      function equalByTag2(object, other, tag, bitmask, customizer, equalFunc, stack) {
        switch (tag) {
          case dataViewTag6:
            if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
              return false;
            }
            object = object.buffer;
            other = other.buffer;
          case arrayBufferTag5:
            if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array3(object), new Uint8Array3(other))) {
              return false;
            }
            return true;
          case boolTag5:
          case dateTag5:
          case numberTag5:
            return eq2(+object, +other);
          case errorTag4:
            return object.name == other.name && object.message == other.message;
          case regexpTag5:
          case stringTag5:
            return object == other + "";
          case mapTag7:
            var convert = mapToArray2;
          case setTag7:
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG5;
            convert || (convert = setToArray2);
            if (object.size != other.size && !isPartial) {
              return false;
            }
            var stacked = stack.get(object);
            if (stacked) {
              return stacked == other;
            }
            bitmask |= COMPARE_UNORDERED_FLAG3;
            stack.set(object, other);
            var result = equalArrays2(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
            stack["delete"](object);
            return result;
          case symbolTag4:
            if (symbolValueOf3) {
              return symbolValueOf3.call(object) == symbolValueOf3.call(other);
            }
        }
        return false;
      }
      __name(equalByTag2, "equalByTag");
      function equalObjects2(object, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG5, objProps = getAllKeys2(object), objLength = objProps.length, othProps = getAllKeys2(other), othLength = othProps.length;
        if (objLength != othLength && !isPartial) {
          return false;
        }
        var index = objLength;
        while (index--) {
          var key = objProps[index];
          if (!(isPartial ? key in other : hasOwnProperty14.call(other, key))) {
            return false;
          }
        }
        var stacked = stack.get(object);
        if (stacked && stack.get(other)) {
          return stacked == other;
        }
        var result = true;
        stack.set(object, other);
        stack.set(other, object);
        var skipCtor = isPartial;
        while (++index < objLength) {
          key = objProps[index];
          var objValue = object[key], othValue = other[key];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
          }
          if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
            result = false;
            break;
          }
          skipCtor || (skipCtor = key == "constructor");
        }
        if (result && !skipCtor) {
          var objCtor = object.constructor, othCtor = other.constructor;
          if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
            result = false;
          }
        }
        stack["delete"](object);
        stack["delete"](other);
        return result;
      }
      __name(equalObjects2, "equalObjects");
      function getAllKeys2(object) {
        return baseGetAllKeys2(object, keys2, getSymbols2);
      }
      __name(getAllKeys2, "getAllKeys");
      function getMapData2(map, key) {
        var data = map.__data__;
        return isKeyable2(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
      }
      __name(getMapData2, "getMapData");
      function getNative2(object, key) {
        var value = getValue2(object, key);
        return baseIsNative2(value) ? value : void 0;
      }
      __name(getNative2, "getNative");
      function getRawTag2(value) {
        var isOwn = hasOwnProperty14.call(value, symToStringTag3), tag = value[symToStringTag3];
        try {
          value[symToStringTag3] = void 0;
          var unmasked = true;
        } catch (e) {
        }
        var result = nativeObjectToString3.call(value);
        if (unmasked) {
          if (isOwn) {
            value[symToStringTag3] = tag;
          } else {
            delete value[symToStringTag3];
          }
        }
        return result;
      }
      __name(getRawTag2, "getRawTag");
      var getSymbols2 = !nativeGetSymbols3 ? stubArray2 : function(object) {
        if (object == null) {
          return [];
        }
        object = Object(object);
        return arrayFilter2(nativeGetSymbols3(object), function(symbol) {
          return propertyIsEnumerable3.call(object, symbol);
        });
      };
      var getTag2 = baseGetTag2;
      if (DataView2 && getTag2(new DataView2(new ArrayBuffer(1))) != dataViewTag6 || Map2 && getTag2(new Map2()) != mapTag7 || Promise3 && getTag2(Promise3.resolve()) != promiseTag2 || Set2 && getTag2(new Set2()) != setTag7 || WeakMap3 && getTag2(new WeakMap3()) != weakMapTag4) {
        getTag2 = /* @__PURE__ */ __name(function(value) {
          var result = baseGetTag2(value), Ctor = result == objectTag6 ? value.constructor : void 0, ctorString = Ctor ? toSource2(Ctor) : "";
          if (ctorString) {
            switch (ctorString) {
              case dataViewCtorString2:
                return dataViewTag6;
              case mapCtorString2:
                return mapTag7;
              case promiseCtorString2:
                return promiseTag2;
              case setCtorString2:
                return setTag7;
              case weakMapCtorString2:
                return weakMapTag4;
            }
          }
          return result;
        }, "getTag");
      }
      function isIndex2(value, length) {
        length = length == null ? MAX_SAFE_INTEGER3 : length;
        return !!length && (typeof value == "number" || reIsUint2.test(value)) && (value > -1 && value % 1 == 0 && value < length);
      }
      __name(isIndex2, "isIndex");
      function isKeyable2(value) {
        var type = typeof value;
        return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
      }
      __name(isKeyable2, "isKeyable");
      function isMasked2(func) {
        return !!maskSrcKey2 && maskSrcKey2 in func;
      }
      __name(isMasked2, "isMasked");
      function isPrototype2(value) {
        var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto17;
        return value === proto;
      }
      __name(isPrototype2, "isPrototype");
      function objectToString2(value) {
        return nativeObjectToString3.call(value);
      }
      __name(objectToString2, "objectToString");
      function toSource2(func) {
        if (func != null) {
          try {
            return funcToString4.call(func);
          } catch (e) {
          }
          try {
            return func + "";
          } catch (e) {
          }
        }
        return "";
      }
      __name(toSource2, "toSource");
      function eq2(value, other) {
        return value === other || value !== value && other !== other;
      }
      __name(eq2, "eq");
      var isArguments2 = baseIsArguments2(/* @__PURE__ */ function() {
        return arguments;
      }()) ? baseIsArguments2 : function(value) {
        return isObjectLike2(value) && hasOwnProperty14.call(value, "callee") && !propertyIsEnumerable3.call(value, "callee");
      };
      var isArray2 = Array.isArray;
      function isArrayLike2(value) {
        return value != null && isLength2(value.length) && !isFunction2(value);
      }
      __name(isArrayLike2, "isArrayLike");
      var isBuffer2 = nativeIsBuffer2 || stubFalse2;
      function isEqual3(value, other) {
        return baseIsEqual2(value, other);
      }
      __name(isEqual3, "isEqual");
      function isFunction2(value) {
        if (!isObject2(value)) {
          return false;
        }
        var tag = baseGetTag2(value);
        return tag == funcTag4 || tag == genTag3 || tag == asyncTag2 || tag == proxyTag2;
      }
      __name(isFunction2, "isFunction");
      function isLength2(value) {
        return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER3;
      }
      __name(isLength2, "isLength");
      function isObject2(value) {
        var type = typeof value;
        return value != null && (type == "object" || type == "function");
      }
      __name(isObject2, "isObject");
      function isObjectLike2(value) {
        return value != null && typeof value == "object";
      }
      __name(isObjectLike2, "isObjectLike");
      var isTypedArray2 = nodeIsTypedArray2 ? baseUnary2(nodeIsTypedArray2) : baseIsTypedArray2;
      function keys2(object) {
        return isArrayLike2(object) ? arrayLikeKeys2(object) : baseKeys2(object);
      }
      __name(keys2, "keys");
      function stubArray2() {
        return [];
      }
      __name(stubArray2, "stubArray");
      function stubFalse2() {
        return false;
      }
      __name(stubFalse2, "stubFalse");
      module2.exports = isEqual3;
    }
  });

  // node_modules/quill-delta/dist/AttributeMap.js
  var require_AttributeMap = __commonJS({
    "node_modules/quill-delta/dist/AttributeMap.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var cloneDeep2 = require_lodash();
      var isEqual3 = require_lodash2();
      var AttributeMap5;
      (function(AttributeMap6) {
        function compose(a = {}, b = {}, keepNull = false) {
          if (typeof a !== "object") {
            a = {};
          }
          if (typeof b !== "object") {
            b = {};
          }
          let attributes = cloneDeep2(b);
          if (!keepNull) {
            attributes = Object.keys(attributes).reduce((copy, key) => {
              if (attributes[key] != null) {
                copy[key] = attributes[key];
              }
              return copy;
            }, {});
          }
          for (const key in a) {
            if (a[key] !== void 0 && b[key] === void 0) {
              attributes[key] = a[key];
            }
          }
          return Object.keys(attributes).length > 0 ? attributes : void 0;
        }
        __name(compose, "compose");
        AttributeMap6.compose = compose;
        function diff(a = {}, b = {}) {
          if (typeof a !== "object") {
            a = {};
          }
          if (typeof b !== "object") {
            b = {};
          }
          const attributes = Object.keys(a).concat(Object.keys(b)).reduce((attrs, key) => {
            if (!isEqual3(a[key], b[key])) {
              attrs[key] = b[key] === void 0 ? null : b[key];
            }
            return attrs;
          }, {});
          return Object.keys(attributes).length > 0 ? attributes : void 0;
        }
        __name(diff, "diff");
        AttributeMap6.diff = diff;
        function invert(attr = {}, base = {}) {
          attr = attr || {};
          const baseInverted = Object.keys(base).reduce((memo, key) => {
            if (base[key] !== attr[key] && attr[key] !== void 0) {
              memo[key] = base[key];
            }
            return memo;
          }, {});
          return Object.keys(attr).reduce((memo, key) => {
            if (attr[key] !== base[key] && base[key] === void 0) {
              memo[key] = null;
            }
            return memo;
          }, baseInverted);
        }
        __name(invert, "invert");
        AttributeMap6.invert = invert;
        function transform(a, b, priority = false) {
          if (typeof a !== "object") {
            return b;
          }
          if (typeof b !== "object") {
            return void 0;
          }
          if (!priority) {
            return b;
          }
          const attributes = Object.keys(b).reduce((attrs, key) => {
            if (a[key] === void 0) {
              attrs[key] = b[key];
            }
            return attrs;
          }, {});
          return Object.keys(attributes).length > 0 ? attributes : void 0;
        }
        __name(transform, "transform");
        AttributeMap6.transform = transform;
      })(AttributeMap5 || (AttributeMap5 = {}));
      exports2.default = AttributeMap5;
    }
  });

  // node_modules/quill-delta/dist/Op.js
  var require_Op = __commonJS({
    "node_modules/quill-delta/dist/Op.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var Op4;
      (function(Op5) {
        function length(op) {
          if (typeof op.delete === "number") {
            return op.delete;
          } else if (typeof op.retain === "number") {
            return op.retain;
          } else if (typeof op.retain === "object" && op.retain !== null) {
            return 1;
          } else {
            return typeof op.insert === "string" ? op.insert.length : 1;
          }
        }
        __name(length, "length");
        Op5.length = length;
      })(Op4 || (Op4 = {}));
      exports2.default = Op4;
    }
  });

  // node_modules/quill-delta/dist/OpIterator.js
  var require_OpIterator = __commonJS({
    "node_modules/quill-delta/dist/OpIterator.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var Op_1 = require_Op();
      var Iterator = class {
        static {
          __name(this, "Iterator");
        }
        constructor(ops) {
          this.ops = ops;
          this.index = 0;
          this.offset = 0;
        }
        hasNext() {
          return this.peekLength() < Infinity;
        }
        next(length) {
          if (!length) {
            length = Infinity;
          }
          const nextOp = this.ops[this.index];
          if (nextOp) {
            const offset = this.offset;
            const opLength = Op_1.default.length(nextOp);
            if (length >= opLength - offset) {
              length = opLength - offset;
              this.index += 1;
              this.offset = 0;
            } else {
              this.offset += length;
            }
            if (typeof nextOp.delete === "number") {
              return { delete: length };
            } else {
              const retOp = {};
              if (nextOp.attributes) {
                retOp.attributes = nextOp.attributes;
              }
              if (typeof nextOp.retain === "number") {
                retOp.retain = length;
              } else if (typeof nextOp.retain === "object" && nextOp.retain !== null) {
                retOp.retain = nextOp.retain;
              } else if (typeof nextOp.insert === "string") {
                retOp.insert = nextOp.insert.substr(offset, length);
              } else {
                retOp.insert = nextOp.insert;
              }
              return retOp;
            }
          } else {
            return { retain: Infinity };
          }
        }
        peek() {
          return this.ops[this.index];
        }
        peekLength() {
          if (this.ops[this.index]) {
            return Op_1.default.length(this.ops[this.index]) - this.offset;
          } else {
            return Infinity;
          }
        }
        peekType() {
          const op = this.ops[this.index];
          if (op) {
            if (typeof op.delete === "number") {
              return "delete";
            } else if (typeof op.retain === "number" || typeof op.retain === "object" && op.retain !== null) {
              return "retain";
            } else {
              return "insert";
            }
          }
          return "retain";
        }
        rest() {
          if (!this.hasNext()) {
            return [];
          } else if (this.offset === 0) {
            return this.ops.slice(this.index);
          } else {
            const offset = this.offset;
            const index = this.index;
            const next = this.next();
            const rest = this.ops.slice(this.index);
            this.offset = offset;
            this.index = index;
            return [next].concat(rest);
          }
        }
      };
      exports2.default = Iterator;
    }
  });

  // node_modules/quill-delta/dist/Delta.js
  var require_Delta = __commonJS({
    "node_modules/quill-delta/dist/Delta.js"(exports2, module2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.AttributeMap = exports2.OpIterator = exports2.Op = void 0;
      var diff = require_diff();
      var cloneDeep2 = require_lodash();
      var isEqual3 = require_lodash2();
      var AttributeMap_1 = require_AttributeMap();
      exports2.AttributeMap = AttributeMap_1.default;
      var Op_1 = require_Op();
      exports2.Op = Op_1.default;
      var OpIterator_1 = require_OpIterator();
      exports2.OpIterator = OpIterator_1.default;
      var NULL_CHARACTER = String.fromCharCode(0);
      var getEmbedTypeAndData = /* @__PURE__ */ __name((a, b) => {
        if (typeof a !== "object" || a === null) {
          throw new Error(`cannot retain a ${typeof a}`);
        }
        if (typeof b !== "object" || b === null) {
          throw new Error(`cannot retain a ${typeof b}`);
        }
        const embedType = Object.keys(a)[0];
        if (!embedType || embedType !== Object.keys(b)[0]) {
          throw new Error(`embed types not matched: ${embedType} != ${Object.keys(b)[0]}`);
        }
        return [embedType, a[embedType], b[embedType]];
      }, "getEmbedTypeAndData");
      var Delta13 = class _Delta {
        static {
          __name(this, "Delta");
        }
        constructor(ops) {
          if (Array.isArray(ops)) {
            this.ops = ops;
          } else if (ops != null && Array.isArray(ops.ops)) {
            this.ops = ops.ops;
          } else {
            this.ops = [];
          }
        }
        static registerEmbed(embedType, handler) {
          this.handlers[embedType] = handler;
        }
        static unregisterEmbed(embedType) {
          delete this.handlers[embedType];
        }
        static getHandler(embedType) {
          const handler = this.handlers[embedType];
          if (!handler) {
            throw new Error(`no handlers for embed type "${embedType}"`);
          }
          return handler;
        }
        insert(arg, attributes) {
          const newOp = {};
          if (typeof arg === "string" && arg.length === 0) {
            return this;
          }
          newOp.insert = arg;
          if (attributes != null && typeof attributes === "object" && Object.keys(attributes).length > 0) {
            newOp.attributes = attributes;
          }
          return this.push(newOp);
        }
        delete(length) {
          if (length <= 0) {
            return this;
          }
          return this.push({ delete: length });
        }
        retain(length, attributes) {
          if (typeof length === "number" && length <= 0) {
            return this;
          }
          const newOp = { retain: length };
          if (attributes != null && typeof attributes === "object" && Object.keys(attributes).length > 0) {
            newOp.attributes = attributes;
          }
          return this.push(newOp);
        }
        push(newOp) {
          let index = this.ops.length;
          let lastOp = this.ops[index - 1];
          newOp = cloneDeep2(newOp);
          if (typeof lastOp === "object") {
            if (typeof newOp.delete === "number" && typeof lastOp.delete === "number") {
              this.ops[index - 1] = { delete: lastOp.delete + newOp.delete };
              return this;
            }
            if (typeof lastOp.delete === "number" && newOp.insert != null) {
              index -= 1;
              lastOp = this.ops[index - 1];
              if (typeof lastOp !== "object") {
                this.ops.unshift(newOp);
                return this;
              }
            }
            if (isEqual3(newOp.attributes, lastOp.attributes)) {
              if (typeof newOp.insert === "string" && typeof lastOp.insert === "string") {
                this.ops[index - 1] = { insert: lastOp.insert + newOp.insert };
                if (typeof newOp.attributes === "object") {
                  this.ops[index - 1].attributes = newOp.attributes;
                }
                return this;
              } else if (typeof newOp.retain === "number" && typeof lastOp.retain === "number") {
                this.ops[index - 1] = { retain: lastOp.retain + newOp.retain };
                if (typeof newOp.attributes === "object") {
                  this.ops[index - 1].attributes = newOp.attributes;
                }
                return this;
              }
            }
          }
          if (index === this.ops.length) {
            this.ops.push(newOp);
          } else {
            this.ops.splice(index, 0, newOp);
          }
          return this;
        }
        chop() {
          const lastOp = this.ops[this.ops.length - 1];
          if (lastOp && typeof lastOp.retain === "number" && !lastOp.attributes) {
            this.ops.pop();
          }
          return this;
        }
        filter(predicate) {
          return this.ops.filter(predicate);
        }
        forEach(predicate) {
          this.ops.forEach(predicate);
        }
        map(predicate) {
          return this.ops.map(predicate);
        }
        partition(predicate) {
          const passed = [];
          const failed = [];
          this.forEach((op) => {
            const target = predicate(op) ? passed : failed;
            target.push(op);
          });
          return [passed, failed];
        }
        reduce(predicate, initialValue) {
          return this.ops.reduce(predicate, initialValue);
        }
        changeLength() {
          return this.reduce((length, elem) => {
            if (elem.insert) {
              return length + Op_1.default.length(elem);
            } else if (elem.delete) {
              return length - elem.delete;
            }
            return length;
          }, 0);
        }
        length() {
          return this.reduce((length, elem) => {
            return length + Op_1.default.length(elem);
          }, 0);
        }
        slice(start = 0, end = Infinity) {
          const ops = [];
          const iter = new OpIterator_1.default(this.ops);
          let index = 0;
          while (index < end && iter.hasNext()) {
            let nextOp;
            if (index < start) {
              nextOp = iter.next(start - index);
            } else {
              nextOp = iter.next(end - index);
              ops.push(nextOp);
            }
            index += Op_1.default.length(nextOp);
          }
          return new _Delta(ops);
        }
        compose(other) {
          const thisIter = new OpIterator_1.default(this.ops);
          const otherIter = new OpIterator_1.default(other.ops);
          const ops = [];
          const firstOther = otherIter.peek();
          if (firstOther != null && typeof firstOther.retain === "number" && firstOther.attributes == null) {
            let firstLeft = firstOther.retain;
            while (thisIter.peekType() === "insert" && thisIter.peekLength() <= firstLeft) {
              firstLeft -= thisIter.peekLength();
              ops.push(thisIter.next());
            }
            if (firstOther.retain - firstLeft > 0) {
              otherIter.next(firstOther.retain - firstLeft);
            }
          }
          const delta = new _Delta(ops);
          while (thisIter.hasNext() || otherIter.hasNext()) {
            if (otherIter.peekType() === "insert") {
              delta.push(otherIter.next());
            } else if (thisIter.peekType() === "delete") {
              delta.push(thisIter.next());
            } else {
              const length = Math.min(thisIter.peekLength(), otherIter.peekLength());
              const thisOp = thisIter.next(length);
              const otherOp = otherIter.next(length);
              if (otherOp.retain) {
                const newOp = {};
                if (typeof thisOp.retain === "number") {
                  newOp.retain = typeof otherOp.retain === "number" ? length : otherOp.retain;
                } else {
                  if (typeof otherOp.retain === "number") {
                    if (thisOp.retain == null) {
                      newOp.insert = thisOp.insert;
                    } else {
                      newOp.retain = thisOp.retain;
                    }
                  } else {
                    const action = thisOp.retain == null ? "insert" : "retain";
                    const [embedType, thisData, otherData] = getEmbedTypeAndData(thisOp[action], otherOp.retain);
                    const handler = _Delta.getHandler(embedType);
                    newOp[action] = {
                      [embedType]: handler.compose(thisData, otherData, action === "retain")
                    };
                  }
                }
                const attributes = AttributeMap_1.default.compose(thisOp.attributes, otherOp.attributes, typeof thisOp.retain === "number");
                if (attributes) {
                  newOp.attributes = attributes;
                }
                delta.push(newOp);
                if (!otherIter.hasNext() && isEqual3(delta.ops[delta.ops.length - 1], newOp)) {
                  const rest = new _Delta(thisIter.rest());
                  return delta.concat(rest).chop();
                }
              } else if (typeof otherOp.delete === "number" && (typeof thisOp.retain === "number" || typeof thisOp.retain === "object" && thisOp.retain !== null)) {
                delta.push(otherOp);
              }
            }
          }
          return delta.chop();
        }
        concat(other) {
          const delta = new _Delta(this.ops.slice());
          if (other.ops.length > 0) {
            delta.push(other.ops[0]);
            delta.ops = delta.ops.concat(other.ops.slice(1));
          }
          return delta;
        }
        diff(other, cursor) {
          if (this.ops === other.ops) {
            return new _Delta();
          }
          const strings = [this, other].map((delta) => {
            return delta.map((op) => {
              if (op.insert != null) {
                return typeof op.insert === "string" ? op.insert : NULL_CHARACTER;
              }
              const prep = delta === other ? "on" : "with";
              throw new Error("diff() called " + prep + " non-document");
            }).join("");
          });
          const retDelta = new _Delta();
          const diffResult = diff(strings[0], strings[1], cursor, true);
          const thisIter = new OpIterator_1.default(this.ops);
          const otherIter = new OpIterator_1.default(other.ops);
          diffResult.forEach((component) => {
            let length = component[1].length;
            while (length > 0) {
              let opLength = 0;
              switch (component[0]) {
                case diff.INSERT:
                  opLength = Math.min(otherIter.peekLength(), length);
                  retDelta.push(otherIter.next(opLength));
                  break;
                case diff.DELETE:
                  opLength = Math.min(length, thisIter.peekLength());
                  thisIter.next(opLength);
                  retDelta.delete(opLength);
                  break;
                case diff.EQUAL:
                  opLength = Math.min(thisIter.peekLength(), otherIter.peekLength(), length);
                  const thisOp = thisIter.next(opLength);
                  const otherOp = otherIter.next(opLength);
                  if (isEqual3(thisOp.insert, otherOp.insert)) {
                    retDelta.retain(opLength, AttributeMap_1.default.diff(thisOp.attributes, otherOp.attributes));
                  } else {
                    retDelta.push(otherOp).delete(opLength);
                  }
                  break;
              }
              length -= opLength;
            }
          });
          return retDelta.chop();
        }
        eachLine(predicate, newline = "\n") {
          const iter = new OpIterator_1.default(this.ops);
          let line = new _Delta();
          let i = 0;
          while (iter.hasNext()) {
            if (iter.peekType() !== "insert") {
              return;
            }
            const thisOp = iter.peek();
            const start = Op_1.default.length(thisOp) - iter.peekLength();
            const index = typeof thisOp.insert === "string" ? thisOp.insert.indexOf(newline, start) - start : -1;
            if (index < 0) {
              line.push(iter.next());
            } else if (index > 0) {
              line.push(iter.next(index));
            } else {
              if (predicate(line, iter.next(1).attributes || {}, i) === false) {
                return;
              }
              i += 1;
              line = new _Delta();
            }
          }
          if (line.length() > 0) {
            predicate(line, {}, i);
          }
        }
        invert(base) {
          const inverted = new _Delta();
          this.reduce((baseIndex, op) => {
            if (op.insert) {
              inverted.delete(Op_1.default.length(op));
            } else if (typeof op.retain === "number" && op.attributes == null) {
              inverted.retain(op.retain);
              return baseIndex + op.retain;
            } else if (op.delete || typeof op.retain === "number") {
              const length = op.delete || op.retain;
              const slice = base.slice(baseIndex, baseIndex + length);
              slice.forEach((baseOp) => {
                if (op.delete) {
                  inverted.push(baseOp);
                } else if (op.retain && op.attributes) {
                  inverted.retain(Op_1.default.length(baseOp), AttributeMap_1.default.invert(op.attributes, baseOp.attributes));
                }
              });
              return baseIndex + length;
            } else if (typeof op.retain === "object" && op.retain !== null) {
              const slice = base.slice(baseIndex, baseIndex + 1);
              const baseOp = new OpIterator_1.default(slice.ops).next();
              const [embedType, opData, baseOpData] = getEmbedTypeAndData(op.retain, baseOp.insert);
              const handler = _Delta.getHandler(embedType);
              inverted.retain({ [embedType]: handler.invert(opData, baseOpData) }, AttributeMap_1.default.invert(op.attributes, baseOp.attributes));
              return baseIndex + 1;
            }
            return baseIndex;
          }, 0);
          return inverted.chop();
        }
        transform(arg, priority = false) {
          priority = !!priority;
          if (typeof arg === "number") {
            return this.transformPosition(arg, priority);
          }
          const other = arg;
          const thisIter = new OpIterator_1.default(this.ops);
          const otherIter = new OpIterator_1.default(other.ops);
          const delta = new _Delta();
          while (thisIter.hasNext() || otherIter.hasNext()) {
            if (thisIter.peekType() === "insert" && (priority || otherIter.peekType() !== "insert")) {
              delta.retain(Op_1.default.length(thisIter.next()));
            } else if (otherIter.peekType() === "insert") {
              delta.push(otherIter.next());
            } else {
              const length = Math.min(thisIter.peekLength(), otherIter.peekLength());
              const thisOp = thisIter.next(length);
              const otherOp = otherIter.next(length);
              if (thisOp.delete) {
                continue;
              } else if (otherOp.delete) {
                delta.push(otherOp);
              } else {
                const thisData = thisOp.retain;
                const otherData = otherOp.retain;
                let transformedData = typeof otherData === "object" && otherData !== null ? otherData : length;
                if (typeof thisData === "object" && thisData !== null && typeof otherData === "object" && otherData !== null) {
                  const embedType = Object.keys(thisData)[0];
                  if (embedType === Object.keys(otherData)[0]) {
                    const handler = _Delta.getHandler(embedType);
                    if (handler) {
                      transformedData = {
                        [embedType]: handler.transform(thisData[embedType], otherData[embedType], priority)
                      };
                    }
                  }
                }
                delta.retain(transformedData, AttributeMap_1.default.transform(thisOp.attributes, otherOp.attributes, priority));
              }
            }
          }
          return delta.chop();
        }
        transformPosition(index, priority = false) {
          priority = !!priority;
          const thisIter = new OpIterator_1.default(this.ops);
          let offset = 0;
          while (thisIter.hasNext() && offset <= index) {
            const length = thisIter.peekLength();
            const nextType = thisIter.peekType();
            thisIter.next();
            if (nextType === "delete") {
              index -= Math.min(length, index - offset);
              continue;
            } else if (nextType === "insert" && (offset < index || !priority)) {
              index += length;
            }
            offset += length;
          }
          return index;
        }
      };
      Delta13.Op = Op_1.default;
      Delta13.OpIterator = OpIterator_1.default;
      Delta13.AttributeMap = AttributeMap_1.default;
      Delta13.handlers = {};
      exports2.default = Delta13;
      if (typeof module2 === "object") {
        module2.exports = Delta13;
        module2.exports.default = Delta13;
      }
    }
  });

  // node_modules/eventemitter3/index.js
  var require_eventemitter3 = __commonJS({
    "node_modules/eventemitter3/index.js"(exports2, module2) {
      "use strict";
      var has = Object.prototype.hasOwnProperty;
      var prefix = "~";
      function Events() {
      }
      __name(Events, "Events");
      if (Object.create) {
        Events.prototype = /* @__PURE__ */ Object.create(null);
        if (!new Events().__proto__)
          prefix = false;
      }
      function EE(fn, context, once) {
        this.fn = fn;
        this.context = context;
        this.once = once || false;
      }
      __name(EE, "EE");
      function addListener(emitter, event, fn, context, once) {
        if (typeof fn !== "function") {
          throw new TypeError("The listener must be a function");
        }
        var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
        if (!emitter._events[evt])
          emitter._events[evt] = listener, emitter._eventsCount++;
        else if (!emitter._events[evt].fn)
          emitter._events[evt].push(listener);
        else
          emitter._events[evt] = [emitter._events[evt], listener];
        return emitter;
      }
      __name(addListener, "addListener");
      function clearEvent(emitter, evt) {
        if (--emitter._eventsCount === 0)
          emitter._events = new Events();
        else
          delete emitter._events[evt];
      }
      __name(clearEvent, "clearEvent");
      function EventEmitter2() {
        this._events = new Events();
        this._eventsCount = 0;
      }
      __name(EventEmitter2, "EventEmitter");
      EventEmitter2.prototype.eventNames = /* @__PURE__ */ __name(function eventNames() {
        var names = [], events, name;
        if (this._eventsCount === 0)
          return names;
        for (name in events = this._events) {
          if (has.call(events, name))
            names.push(prefix ? name.slice(1) : name);
        }
        if (Object.getOwnPropertySymbols) {
          return names.concat(Object.getOwnPropertySymbols(events));
        }
        return names;
      }, "eventNames");
      EventEmitter2.prototype.listeners = /* @__PURE__ */ __name(function listeners(event) {
        var evt = prefix ? prefix + event : event, handlers = this._events[evt];
        if (!handlers)
          return [];
        if (handlers.fn)
          return [handlers.fn];
        for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
          ee[i] = handlers[i].fn;
        }
        return ee;
      }, "listeners");
      EventEmitter2.prototype.listenerCount = /* @__PURE__ */ __name(function listenerCount(event) {
        var evt = prefix ? prefix + event : event, listeners = this._events[evt];
        if (!listeners)
          return 0;
        if (listeners.fn)
          return 1;
        return listeners.length;
      }, "listenerCount");
      EventEmitter2.prototype.emit = /* @__PURE__ */ __name(function emit(event, a1, a2, a3, a4, a5) {
        var evt = prefix ? prefix + event : event;
        if (!this._events[evt])
          return false;
        var listeners = this._events[evt], len = arguments.length, args, i;
        if (listeners.fn) {
          if (listeners.once)
            this.removeListener(event, listeners.fn, void 0, true);
          switch (len) {
            case 1:
              return listeners.fn.call(listeners.context), true;
            case 2:
              return listeners.fn.call(listeners.context, a1), true;
            case 3:
              return listeners.fn.call(listeners.context, a1, a2), true;
            case 4:
              return listeners.fn.call(listeners.context, a1, a2, a3), true;
            case 5:
              return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
            case 6:
              return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
          }
          for (i = 1, args = new Array(len - 1); i < len; i++) {
            args[i - 1] = arguments[i];
          }
          listeners.fn.apply(listeners.context, args);
        } else {
          var length = listeners.length, j;
          for (i = 0; i < length; i++) {
            if (listeners[i].once)
              this.removeListener(event, listeners[i].fn, void 0, true);
            switch (len) {
              case 1:
                listeners[i].fn.call(listeners[i].context);
                break;
              case 2:
                listeners[i].fn.call(listeners[i].context, a1);
                break;
              case 3:
                listeners[i].fn.call(listeners[i].context, a1, a2);
                break;
              case 4:
                listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                break;
              default:
                if (!args)
                  for (j = 1, args = new Array(len - 1); j < len; j++) {
                    args[j - 1] = arguments[j];
                  }
                listeners[i].fn.apply(listeners[i].context, args);
            }
          }
        }
        return true;
      }, "emit");
      EventEmitter2.prototype.on = /* @__PURE__ */ __name(function on(event, fn, context) {
        return addListener(this, event, fn, context, false);
      }, "on");
      EventEmitter2.prototype.once = /* @__PURE__ */ __name(function once(event, fn, context) {
        return addListener(this, event, fn, context, true);
      }, "once");
      EventEmitter2.prototype.removeListener = /* @__PURE__ */ __name(function removeListener(event, fn, context, once) {
        var evt = prefix ? prefix + event : event;
        if (!this._events[evt])
          return this;
        if (!fn) {
          clearEvent(this, evt);
          return this;
        }
        var listeners = this._events[evt];
        if (listeners.fn) {
          if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
            clearEvent(this, evt);
          }
        } else {
          for (var i = 0, events = [], length = listeners.length; i < length; i++) {
            if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
              events.push(listeners[i]);
            }
          }
          if (events.length)
            this._events[evt] = events.length === 1 ? events[0] : events;
          else
            clearEvent(this, evt);
        }
        return this;
      }, "removeListener");
      EventEmitter2.prototype.removeAllListeners = /* @__PURE__ */ __name(function removeAllListeners(event) {
        var evt;
        if (event) {
          evt = prefix ? prefix + event : event;
          if (this._events[evt])
            clearEvent(this, evt);
        } else {
          this._events = new Events();
          this._eventsCount = 0;
        }
        return this;
      }, "removeAllListeners");
      EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
      EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
      EventEmitter2.prefixed = prefix;
      EventEmitter2.EventEmitter = EventEmitter2;
      if ("undefined" !== typeof module2) {
        module2.exports = EventEmitter2;
      }
    }
  });

  // node_modules/lodash-es/_freeGlobal.js
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeGlobal_default = freeGlobal;

  // node_modules/lodash-es/_root.js
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal_default || freeSelf || Function("return this")();
  var root_default = root;

  // node_modules/lodash-es/_Symbol.js
  var Symbol2 = root_default.Symbol;
  var Symbol_default = Symbol2;

  // node_modules/lodash-es/_getRawTag.js
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var nativeObjectToString = objectProto.toString;
  var symToStringTag = Symbol_default ? Symbol_default.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
    try {
      value[symToStringTag] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }
  __name(getRawTag, "getRawTag");
  var getRawTag_default = getRawTag;

  // node_modules/lodash-es/_objectToString.js
  var objectProto2 = Object.prototype;
  var nativeObjectToString2 = objectProto2.toString;
  function objectToString(value) {
    return nativeObjectToString2.call(value);
  }
  __name(objectToString, "objectToString");
  var objectToString_default = objectToString;

  // node_modules/lodash-es/_baseGetTag.js
  var nullTag = "[object Null]";
  var undefinedTag = "[object Undefined]";
  var symToStringTag2 = Symbol_default ? Symbol_default.toStringTag : void 0;
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag2 && symToStringTag2 in Object(value) ? getRawTag_default(value) : objectToString_default(value);
  }
  __name(baseGetTag, "baseGetTag");
  var baseGetTag_default = baseGetTag;

  // node_modules/lodash-es/isObjectLike.js
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  __name(isObjectLike, "isObjectLike");
  var isObjectLike_default = isObjectLike;

  // node_modules/lodash-es/isArray.js
  var isArray = Array.isArray;
  var isArray_default = isArray;

  // node_modules/lodash-es/isObject.js
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  __name(isObject, "isObject");
  var isObject_default = isObject;

  // node_modules/lodash-es/identity.js
  function identity(value) {
    return value;
  }
  __name(identity, "identity");
  var identity_default = identity;

  // node_modules/lodash-es/isFunction.js
  var asyncTag = "[object AsyncFunction]";
  var funcTag = "[object Function]";
  var genTag = "[object GeneratorFunction]";
  var proxyTag = "[object Proxy]";
  function isFunction(value) {
    if (!isObject_default(value)) {
      return false;
    }
    var tag = baseGetTag_default(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  __name(isFunction, "isFunction");
  var isFunction_default = isFunction;

  // node_modules/lodash-es/_coreJsData.js
  var coreJsData = root_default["__core-js_shared__"];
  var coreJsData_default = coreJsData;

  // node_modules/lodash-es/_isMasked.js
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData_default && coreJsData_default.keys && coreJsData_default.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  __name(isMasked, "isMasked");
  var isMasked_default = isMasked;

  // node_modules/lodash-es/_toSource.js
  var funcProto = Function.prototype;
  var funcToString = funcProto.toString;
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  __name(toSource, "toSource");
  var toSource_default = toSource;

  // node_modules/lodash-es/_baseIsNative.js
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var funcProto2 = Function.prototype;
  var objectProto3 = Object.prototype;
  var funcToString2 = funcProto2.toString;
  var hasOwnProperty2 = objectProto3.hasOwnProperty;
  var reIsNative = RegExp(
    "^" + funcToString2.call(hasOwnProperty2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  function baseIsNative(value) {
    if (!isObject_default(value) || isMasked_default(value)) {
      return false;
    }
    var pattern = isFunction_default(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource_default(value));
  }
  __name(baseIsNative, "baseIsNative");
  var baseIsNative_default = baseIsNative;

  // node_modules/lodash-es/_getValue.js
  function getValue(object, key) {
    return object == null ? void 0 : object[key];
  }
  __name(getValue, "getValue");
  var getValue_default = getValue;

  // node_modules/lodash-es/_getNative.js
  function getNative(object, key) {
    var value = getValue_default(object, key);
    return baseIsNative_default(value) ? value : void 0;
  }
  __name(getNative, "getNative");
  var getNative_default = getNative;

  // node_modules/lodash-es/_WeakMap.js
  var WeakMap2 = getNative_default(root_default, "WeakMap");
  var WeakMap_default = WeakMap2;

  // node_modules/lodash-es/_baseCreate.js
  var objectCreate = Object.create;
  var baseCreate = /* @__PURE__ */ function() {
    function object() {
    }
    __name(object, "object");
    return function(proto) {
      if (!isObject_default(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object();
      object.prototype = void 0;
      return result;
    };
  }();
  var baseCreate_default = baseCreate;

  // node_modules/lodash-es/_apply.js
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0:
        return func.call(thisArg);
      case 1:
        return func.call(thisArg, args[0]);
      case 2:
        return func.call(thisArg, args[0], args[1]);
      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }
  __name(apply, "apply");
  var apply_default = apply;

  // node_modules/lodash-es/_copyArray.js
  function copyArray(source, array) {
    var index = -1, length = source.length;
    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }
  __name(copyArray, "copyArray");
  var copyArray_default = copyArray;

  // node_modules/lodash-es/_shortOut.js
  var HOT_COUNT = 800;
  var HOT_SPAN = 16;
  var nativeNow = Date.now;
  function shortOut(func) {
    var count = 0, lastCalled = 0;
    return function() {
      var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(void 0, arguments);
    };
  }
  __name(shortOut, "shortOut");
  var shortOut_default = shortOut;

  // node_modules/lodash-es/constant.js
  function constant(value) {
    return function() {
      return value;
    };
  }
  __name(constant, "constant");
  var constant_default = constant;

  // node_modules/lodash-es/_defineProperty.js
  var defineProperty = function() {
    try {
      var func = getNative_default(Object, "defineProperty");
      func({}, "", {});
      return func;
    } catch (e) {
    }
  }();
  var defineProperty_default = defineProperty;

  // node_modules/lodash-es/_baseSetToString.js
  var baseSetToString = !defineProperty_default ? identity_default : function(func, string) {
    return defineProperty_default(func, "toString", {
      "configurable": true,
      "enumerable": false,
      "value": constant_default(string),
      "writable": true
    });
  };
  var baseSetToString_default = baseSetToString;

  // node_modules/lodash-es/_setToString.js
  var setToString = shortOut_default(baseSetToString_default);
  var setToString_default = setToString;

  // node_modules/lodash-es/_arrayEach.js
  function arrayEach(array, iteratee) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }
  __name(arrayEach, "arrayEach");
  var arrayEach_default = arrayEach;

  // node_modules/lodash-es/_isIndex.js
  var MAX_SAFE_INTEGER = 9007199254740991;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  __name(isIndex, "isIndex");
  var isIndex_default = isIndex;

  // node_modules/lodash-es/_baseAssignValue.js
  function baseAssignValue(object, key, value) {
    if (key == "__proto__" && defineProperty_default) {
      defineProperty_default(object, key, {
        "configurable": true,
        "enumerable": true,
        "value": value,
        "writable": true
      });
    } else {
      object[key] = value;
    }
  }
  __name(baseAssignValue, "baseAssignValue");
  var baseAssignValue_default = baseAssignValue;

  // node_modules/lodash-es/eq.js
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  __name(eq, "eq");
  var eq_default = eq;

  // node_modules/lodash-es/_assignValue.js
  var objectProto4 = Object.prototype;
  var hasOwnProperty3 = objectProto4.hasOwnProperty;
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty3.call(object, key) && eq_default(objValue, value)) || value === void 0 && !(key in object)) {
      baseAssignValue_default(object, key, value);
    }
  }
  __name(assignValue, "assignValue");
  var assignValue_default = assignValue;

  // node_modules/lodash-es/_copyObject.js
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});
    var index = -1, length = props.length;
    while (++index < length) {
      var key = props[index];
      var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
      if (newValue === void 0) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue_default(object, key, newValue);
      } else {
        assignValue_default(object, key, newValue);
      }
    }
    return object;
  }
  __name(copyObject, "copyObject");
  var copyObject_default = copyObject;

  // node_modules/lodash-es/_overRest.js
  var nativeMax = Math.max;
  function overRest(func, start, transform) {
    start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
    return function() {
      var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply_default(func, this, otherArgs);
    };
  }
  __name(overRest, "overRest");
  var overRest_default = overRest;

  // node_modules/lodash-es/_baseRest.js
  function baseRest(func, start) {
    return setToString_default(overRest_default(func, start, identity_default), func + "");
  }
  __name(baseRest, "baseRest");
  var baseRest_default = baseRest;

  // node_modules/lodash-es/isLength.js
  var MAX_SAFE_INTEGER2 = 9007199254740991;
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER2;
  }
  __name(isLength, "isLength");
  var isLength_default = isLength;

  // node_modules/lodash-es/isArrayLike.js
  function isArrayLike(value) {
    return value != null && isLength_default(value.length) && !isFunction_default(value);
  }
  __name(isArrayLike, "isArrayLike");
  var isArrayLike_default = isArrayLike;

  // node_modules/lodash-es/_isIterateeCall.js
  function isIterateeCall(value, index, object) {
    if (!isObject_default(object)) {
      return false;
    }
    var type = typeof index;
    if (type == "number" ? isArrayLike_default(object) && isIndex_default(index, object.length) : type == "string" && index in object) {
      return eq_default(object[index], value);
    }
    return false;
  }
  __name(isIterateeCall, "isIterateeCall");
  var isIterateeCall_default = isIterateeCall;

  // node_modules/lodash-es/_createAssigner.js
  function createAssigner(assigner) {
    return baseRest_default(function(object, sources) {
      var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
      customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
      if (guard && isIterateeCall_default(sources[0], sources[1], guard)) {
        customizer = length < 3 ? void 0 : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }
  __name(createAssigner, "createAssigner");
  var createAssigner_default = createAssigner;

  // node_modules/lodash-es/_isPrototype.js
  var objectProto5 = Object.prototype;
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto5;
    return value === proto;
  }
  __name(isPrototype, "isPrototype");
  var isPrototype_default = isPrototype;

  // node_modules/lodash-es/_baseTimes.js
  function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }
  __name(baseTimes, "baseTimes");
  var baseTimes_default = baseTimes;

  // node_modules/lodash-es/_baseIsArguments.js
  var argsTag = "[object Arguments]";
  function baseIsArguments(value) {
    return isObjectLike_default(value) && baseGetTag_default(value) == argsTag;
  }
  __name(baseIsArguments, "baseIsArguments");
  var baseIsArguments_default = baseIsArguments;

  // node_modules/lodash-es/isArguments.js
  var objectProto6 = Object.prototype;
  var hasOwnProperty4 = objectProto6.hasOwnProperty;
  var propertyIsEnumerable = objectProto6.propertyIsEnumerable;
  var isArguments = baseIsArguments_default(/* @__PURE__ */ function() {
    return arguments;
  }()) ? baseIsArguments_default : function(value) {
    return isObjectLike_default(value) && hasOwnProperty4.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
  };
  var isArguments_default = isArguments;

  // node_modules/lodash-es/stubFalse.js
  function stubFalse() {
    return false;
  }
  __name(stubFalse, "stubFalse");
  var stubFalse_default = stubFalse;

  // node_modules/lodash-es/isBuffer.js
  var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer2 = moduleExports ? root_default.Buffer : void 0;
  var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
  var isBuffer = nativeIsBuffer || stubFalse_default;
  var isBuffer_default = isBuffer;

  // node_modules/lodash-es/_baseIsTypedArray.js
  var argsTag2 = "[object Arguments]";
  var arrayTag = "[object Array]";
  var boolTag = "[object Boolean]";
  var dateTag = "[object Date]";
  var errorTag = "[object Error]";
  var funcTag2 = "[object Function]";
  var mapTag = "[object Map]";
  var numberTag = "[object Number]";
  var objectTag = "[object Object]";
  var regexpTag = "[object RegExp]";
  var setTag = "[object Set]";
  var stringTag = "[object String]";
  var weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]";
  var dataViewTag = "[object DataView]";
  var float32Tag = "[object Float32Array]";
  var float64Tag = "[object Float64Array]";
  var int8Tag = "[object Int8Array]";
  var int16Tag = "[object Int16Array]";
  var int32Tag = "[object Int32Array]";
  var uint8Tag = "[object Uint8Array]";
  var uint8ClampedTag = "[object Uint8ClampedArray]";
  var uint16Tag = "[object Uint16Array]";
  var uint32Tag = "[object Uint32Array]";
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag2] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag2] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
  function baseIsTypedArray(value) {
    return isObjectLike_default(value) && isLength_default(value.length) && !!typedArrayTags[baseGetTag_default(value)];
  }
  __name(baseIsTypedArray, "baseIsTypedArray");
  var baseIsTypedArray_default = baseIsTypedArray;

  // node_modules/lodash-es/_baseUnary.js
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  __name(baseUnary, "baseUnary");
  var baseUnary_default = baseUnary;

  // node_modules/lodash-es/_nodeUtil.js
  var freeExports2 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule2 = freeExports2 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports2 = freeModule2 && freeModule2.exports === freeExports2;
  var freeProcess = moduleExports2 && freeGlobal_default.process;
  var nodeUtil = function() {
    try {
      var types = freeModule2 && freeModule2.require && freeModule2.require("util").types;
      if (types) {
        return types;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  var nodeUtil_default = nodeUtil;

  // node_modules/lodash-es/isTypedArray.js
  var nodeIsTypedArray = nodeUtil_default && nodeUtil_default.isTypedArray;
  var isTypedArray = nodeIsTypedArray ? baseUnary_default(nodeIsTypedArray) : baseIsTypedArray_default;
  var isTypedArray_default = isTypedArray;

  // node_modules/lodash-es/_arrayLikeKeys.js
  var objectProto7 = Object.prototype;
  var hasOwnProperty5 = objectProto7.hasOwnProperty;
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray_default(value), isArg = !isArr && isArguments_default(value), isBuff = !isArr && !isArg && isBuffer_default(value), isType = !isArr && !isArg && !isBuff && isTypedArray_default(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes_default(value.length, String) : [], length = result.length;
    for (var key in value) {
      if ((inherited || hasOwnProperty5.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
      (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
      isIndex_default(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  __name(arrayLikeKeys, "arrayLikeKeys");
  var arrayLikeKeys_default = arrayLikeKeys;

  // node_modules/lodash-es/_overArg.js
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  __name(overArg, "overArg");
  var overArg_default = overArg;

  // node_modules/lodash-es/_nativeKeys.js
  var nativeKeys = overArg_default(Object.keys, Object);
  var nativeKeys_default = nativeKeys;

  // node_modules/lodash-es/_baseKeys.js
  var objectProto8 = Object.prototype;
  var hasOwnProperty6 = objectProto8.hasOwnProperty;
  function baseKeys(object) {
    if (!isPrototype_default(object)) {
      return nativeKeys_default(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty6.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  __name(baseKeys, "baseKeys");
  var baseKeys_default = baseKeys;

  // node_modules/lodash-es/keys.js
  function keys(object) {
    return isArrayLike_default(object) ? arrayLikeKeys_default(object) : baseKeys_default(object);
  }
  __name(keys, "keys");
  var keys_default = keys;

  // node_modules/lodash-es/_nativeKeysIn.js
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }
  __name(nativeKeysIn, "nativeKeysIn");
  var nativeKeysIn_default = nativeKeysIn;

  // node_modules/lodash-es/_baseKeysIn.js
  var objectProto9 = Object.prototype;
  var hasOwnProperty7 = objectProto9.hasOwnProperty;
  function baseKeysIn(object) {
    if (!isObject_default(object)) {
      return nativeKeysIn_default(object);
    }
    var isProto = isPrototype_default(object), result = [];
    for (var key in object) {
      if (!(key == "constructor" && (isProto || !hasOwnProperty7.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }
  __name(baseKeysIn, "baseKeysIn");
  var baseKeysIn_default = baseKeysIn;

  // node_modules/lodash-es/keysIn.js
  function keysIn(object) {
    return isArrayLike_default(object) ? arrayLikeKeys_default(object, true) : baseKeysIn_default(object);
  }
  __name(keysIn, "keysIn");
  var keysIn_default = keysIn;

  // node_modules/lodash-es/_nativeCreate.js
  var nativeCreate = getNative_default(Object, "create");
  var nativeCreate_default = nativeCreate;

  // node_modules/lodash-es/_hashClear.js
  function hashClear() {
    this.__data__ = nativeCreate_default ? nativeCreate_default(null) : {};
    this.size = 0;
  }
  __name(hashClear, "hashClear");
  var hashClear_default = hashClear;

  // node_modules/lodash-es/_hashDelete.js
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }
  __name(hashDelete, "hashDelete");
  var hashDelete_default = hashDelete;

  // node_modules/lodash-es/_hashGet.js
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  var objectProto10 = Object.prototype;
  var hasOwnProperty8 = objectProto10.hasOwnProperty;
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate_default) {
      var result = data[key];
      return result === HASH_UNDEFINED ? void 0 : result;
    }
    return hasOwnProperty8.call(data, key) ? data[key] : void 0;
  }
  __name(hashGet, "hashGet");
  var hashGet_default = hashGet;

  // node_modules/lodash-es/_hashHas.js
  var objectProto11 = Object.prototype;
  var hasOwnProperty9 = objectProto11.hasOwnProperty;
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate_default ? data[key] !== void 0 : hasOwnProperty9.call(data, key);
  }
  __name(hashHas, "hashHas");
  var hashHas_default = hashHas;

  // node_modules/lodash-es/_hashSet.js
  var HASH_UNDEFINED2 = "__lodash_hash_undefined__";
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate_default && value === void 0 ? HASH_UNDEFINED2 : value;
    return this;
  }
  __name(hashSet, "hashSet");
  var hashSet_default = hashSet;

  // node_modules/lodash-es/_Hash.js
  function Hash(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  __name(Hash, "Hash");
  Hash.prototype.clear = hashClear_default;
  Hash.prototype["delete"] = hashDelete_default;
  Hash.prototype.get = hashGet_default;
  Hash.prototype.has = hashHas_default;
  Hash.prototype.set = hashSet_default;
  var Hash_default = Hash;

  // node_modules/lodash-es/_listCacheClear.js
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }
  __name(listCacheClear, "listCacheClear");
  var listCacheClear_default = listCacheClear;

  // node_modules/lodash-es/_assocIndexOf.js
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq_default(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  __name(assocIndexOf, "assocIndexOf");
  var assocIndexOf_default = assocIndexOf;

  // node_modules/lodash-es/_listCacheDelete.js
  var arrayProto = Array.prototype;
  var splice = arrayProto.splice;
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf_default(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }
  __name(listCacheDelete, "listCacheDelete");
  var listCacheDelete_default = listCacheDelete;

  // node_modules/lodash-es/_listCacheGet.js
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf_default(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  __name(listCacheGet, "listCacheGet");
  var listCacheGet_default = listCacheGet;

  // node_modules/lodash-es/_listCacheHas.js
  function listCacheHas(key) {
    return assocIndexOf_default(this.__data__, key) > -1;
  }
  __name(listCacheHas, "listCacheHas");
  var listCacheHas_default = listCacheHas;

  // node_modules/lodash-es/_listCacheSet.js
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf_default(data, key);
    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  __name(listCacheSet, "listCacheSet");
  var listCacheSet_default = listCacheSet;

  // node_modules/lodash-es/_ListCache.js
  function ListCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  __name(ListCache, "ListCache");
  ListCache.prototype.clear = listCacheClear_default;
  ListCache.prototype["delete"] = listCacheDelete_default;
  ListCache.prototype.get = listCacheGet_default;
  ListCache.prototype.has = listCacheHas_default;
  ListCache.prototype.set = listCacheSet_default;
  var ListCache_default = ListCache;

  // node_modules/lodash-es/_Map.js
  var Map = getNative_default(root_default, "Map");
  var Map_default = Map;

  // node_modules/lodash-es/_mapCacheClear.js
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash_default(),
      "map": new (Map_default || ListCache_default)(),
      "string": new Hash_default()
    };
  }
  __name(mapCacheClear, "mapCacheClear");
  var mapCacheClear_default = mapCacheClear;

  // node_modules/lodash-es/_isKeyable.js
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  __name(isKeyable, "isKeyable");
  var isKeyable_default = isKeyable;

  // node_modules/lodash-es/_getMapData.js
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable_default(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  __name(getMapData, "getMapData");
  var getMapData_default = getMapData;

  // node_modules/lodash-es/_mapCacheDelete.js
  function mapCacheDelete(key) {
    var result = getMapData_default(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
  }
  __name(mapCacheDelete, "mapCacheDelete");
  var mapCacheDelete_default = mapCacheDelete;

  // node_modules/lodash-es/_mapCacheGet.js
  function mapCacheGet(key) {
    return getMapData_default(this, key).get(key);
  }
  __name(mapCacheGet, "mapCacheGet");
  var mapCacheGet_default = mapCacheGet;

  // node_modules/lodash-es/_mapCacheHas.js
  function mapCacheHas(key) {
    return getMapData_default(this, key).has(key);
  }
  __name(mapCacheHas, "mapCacheHas");
  var mapCacheHas_default = mapCacheHas;

  // node_modules/lodash-es/_mapCacheSet.js
  function mapCacheSet(key, value) {
    var data = getMapData_default(this, key), size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }
  __name(mapCacheSet, "mapCacheSet");
  var mapCacheSet_default = mapCacheSet;

  // node_modules/lodash-es/_MapCache.js
  function MapCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  __name(MapCache, "MapCache");
  MapCache.prototype.clear = mapCacheClear_default;
  MapCache.prototype["delete"] = mapCacheDelete_default;
  MapCache.prototype.get = mapCacheGet_default;
  MapCache.prototype.has = mapCacheHas_default;
  MapCache.prototype.set = mapCacheSet_default;
  var MapCache_default = MapCache;

  // node_modules/lodash-es/_arrayPush.js
  function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }
  __name(arrayPush, "arrayPush");
  var arrayPush_default = arrayPush;

  // node_modules/lodash-es/_getPrototype.js
  var getPrototype = overArg_default(Object.getPrototypeOf, Object);
  var getPrototype_default = getPrototype;

  // node_modules/lodash-es/isPlainObject.js
  var objectTag2 = "[object Object]";
  var funcProto3 = Function.prototype;
  var objectProto12 = Object.prototype;
  var funcToString3 = funcProto3.toString;
  var hasOwnProperty10 = objectProto12.hasOwnProperty;
  var objectCtorString = funcToString3.call(Object);
  function isPlainObject(value) {
    if (!isObjectLike_default(value) || baseGetTag_default(value) != objectTag2) {
      return false;
    }
    var proto = getPrototype_default(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty10.call(proto, "constructor") && proto.constructor;
    return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString3.call(Ctor) == objectCtorString;
  }
  __name(isPlainObject, "isPlainObject");
  var isPlainObject_default = isPlainObject;

  // node_modules/lodash-es/_stackClear.js
  function stackClear() {
    this.__data__ = new ListCache_default();
    this.size = 0;
  }
  __name(stackClear, "stackClear");
  var stackClear_default = stackClear;

  // node_modules/lodash-es/_stackDelete.js
  function stackDelete(key) {
    var data = this.__data__, result = data["delete"](key);
    this.size = data.size;
    return result;
  }
  __name(stackDelete, "stackDelete");
  var stackDelete_default = stackDelete;

  // node_modules/lodash-es/_stackGet.js
  function stackGet(key) {
    return this.__data__.get(key);
  }
  __name(stackGet, "stackGet");
  var stackGet_default = stackGet;

  // node_modules/lodash-es/_stackHas.js
  function stackHas(key) {
    return this.__data__.has(key);
  }
  __name(stackHas, "stackHas");
  var stackHas_default = stackHas;

  // node_modules/lodash-es/_stackSet.js
  var LARGE_ARRAY_SIZE = 200;
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache_default) {
      var pairs = data.__data__;
      if (!Map_default || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache_default(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }
  __name(stackSet, "stackSet");
  var stackSet_default = stackSet;

  // node_modules/lodash-es/_Stack.js
  function Stack(entries) {
    var data = this.__data__ = new ListCache_default(entries);
    this.size = data.size;
  }
  __name(Stack, "Stack");
  Stack.prototype.clear = stackClear_default;
  Stack.prototype["delete"] = stackDelete_default;
  Stack.prototype.get = stackGet_default;
  Stack.prototype.has = stackHas_default;
  Stack.prototype.set = stackSet_default;
  var Stack_default = Stack;

  // node_modules/lodash-es/_baseAssign.js
  function baseAssign(object, source) {
    return object && copyObject_default(source, keys_default(source), object);
  }
  __name(baseAssign, "baseAssign");
  var baseAssign_default = baseAssign;

  // node_modules/lodash-es/_baseAssignIn.js
  function baseAssignIn(object, source) {
    return object && copyObject_default(source, keysIn_default(source), object);
  }
  __name(baseAssignIn, "baseAssignIn");
  var baseAssignIn_default = baseAssignIn;

  // node_modules/lodash-es/_cloneBuffer.js
  var freeExports3 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule3 = freeExports3 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports3 = freeModule3 && freeModule3.exports === freeExports3;
  var Buffer3 = moduleExports3 ? root_default.Buffer : void 0;
  var allocUnsafe = Buffer3 ? Buffer3.allocUnsafe : void 0;
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result);
    return result;
  }
  __name(cloneBuffer, "cloneBuffer");
  var cloneBuffer_default = cloneBuffer;

  // node_modules/lodash-es/_arrayFilter.js
  function arrayFilter(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  __name(arrayFilter, "arrayFilter");
  var arrayFilter_default = arrayFilter;

  // node_modules/lodash-es/stubArray.js
  function stubArray() {
    return [];
  }
  __name(stubArray, "stubArray");
  var stubArray_default = stubArray;

  // node_modules/lodash-es/_getSymbols.js
  var objectProto13 = Object.prototype;
  var propertyIsEnumerable2 = objectProto13.propertyIsEnumerable;
  var nativeGetSymbols = Object.getOwnPropertySymbols;
  var getSymbols = !nativeGetSymbols ? stubArray_default : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter_default(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable2.call(object, symbol);
    });
  };
  var getSymbols_default = getSymbols;

  // node_modules/lodash-es/_copySymbols.js
  function copySymbols(source, object) {
    return copyObject_default(source, getSymbols_default(source), object);
  }
  __name(copySymbols, "copySymbols");
  var copySymbols_default = copySymbols;

  // node_modules/lodash-es/_getSymbolsIn.js
  var nativeGetSymbols2 = Object.getOwnPropertySymbols;
  var getSymbolsIn = !nativeGetSymbols2 ? stubArray_default : function(object) {
    var result = [];
    while (object) {
      arrayPush_default(result, getSymbols_default(object));
      object = getPrototype_default(object);
    }
    return result;
  };
  var getSymbolsIn_default = getSymbolsIn;

  // node_modules/lodash-es/_copySymbolsIn.js
  function copySymbolsIn(source, object) {
    return copyObject_default(source, getSymbolsIn_default(source), object);
  }
  __name(copySymbolsIn, "copySymbolsIn");
  var copySymbolsIn_default = copySymbolsIn;

  // node_modules/lodash-es/_baseGetAllKeys.js
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray_default(object) ? result : arrayPush_default(result, symbolsFunc(object));
  }
  __name(baseGetAllKeys, "baseGetAllKeys");
  var baseGetAllKeys_default = baseGetAllKeys;

  // node_modules/lodash-es/_getAllKeys.js
  function getAllKeys(object) {
    return baseGetAllKeys_default(object, keys_default, getSymbols_default);
  }
  __name(getAllKeys, "getAllKeys");
  var getAllKeys_default = getAllKeys;

  // node_modules/lodash-es/_getAllKeysIn.js
  function getAllKeysIn(object) {
    return baseGetAllKeys_default(object, keysIn_default, getSymbolsIn_default);
  }
  __name(getAllKeysIn, "getAllKeysIn");
  var getAllKeysIn_default = getAllKeysIn;

  // node_modules/lodash-es/_DataView.js
  var DataView = getNative_default(root_default, "DataView");
  var DataView_default = DataView;

  // node_modules/lodash-es/_Promise.js
  var Promise2 = getNative_default(root_default, "Promise");
  var Promise_default = Promise2;

  // node_modules/lodash-es/_Set.js
  var Set = getNative_default(root_default, "Set");
  var Set_default = Set;

  // node_modules/lodash-es/_getTag.js
  var mapTag2 = "[object Map]";
  var objectTag3 = "[object Object]";
  var promiseTag = "[object Promise]";
  var setTag2 = "[object Set]";
  var weakMapTag2 = "[object WeakMap]";
  var dataViewTag2 = "[object DataView]";
  var dataViewCtorString = toSource_default(DataView_default);
  var mapCtorString = toSource_default(Map_default);
  var promiseCtorString = toSource_default(Promise_default);
  var setCtorString = toSource_default(Set_default);
  var weakMapCtorString = toSource_default(WeakMap_default);
  var getTag = baseGetTag_default;
  if (DataView_default && getTag(new DataView_default(new ArrayBuffer(1))) != dataViewTag2 || Map_default && getTag(new Map_default()) != mapTag2 || Promise_default && getTag(Promise_default.resolve()) != promiseTag || Set_default && getTag(new Set_default()) != setTag2 || WeakMap_default && getTag(new WeakMap_default()) != weakMapTag2) {
    getTag = /* @__PURE__ */ __name(function(value) {
      var result = baseGetTag_default(value), Ctor = result == objectTag3 ? value.constructor : void 0, ctorString = Ctor ? toSource_default(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag2;
          case mapCtorString:
            return mapTag2;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag2;
          case weakMapCtorString:
            return weakMapTag2;
        }
      }
      return result;
    }, "getTag");
  }
  var getTag_default = getTag;

  // node_modules/lodash-es/_initCloneArray.js
  var objectProto14 = Object.prototype;
  var hasOwnProperty11 = objectProto14.hasOwnProperty;
  function initCloneArray(array) {
    var length = array.length, result = new array.constructor(length);
    if (length && typeof array[0] == "string" && hasOwnProperty11.call(array, "index")) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }
  __name(initCloneArray, "initCloneArray");
  var initCloneArray_default = initCloneArray;

  // node_modules/lodash-es/_Uint8Array.js
  var Uint8Array2 = root_default.Uint8Array;
  var Uint8Array_default = Uint8Array2;

  // node_modules/lodash-es/_cloneArrayBuffer.js
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array_default(result).set(new Uint8Array_default(arrayBuffer));
    return result;
  }
  __name(cloneArrayBuffer, "cloneArrayBuffer");
  var cloneArrayBuffer_default = cloneArrayBuffer;

  // node_modules/lodash-es/_cloneDataView.js
  function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer_default(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }
  __name(cloneDataView, "cloneDataView");
  var cloneDataView_default = cloneDataView;

  // node_modules/lodash-es/_cloneRegExp.js
  var reFlags = /\w*$/;
  function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  }
  __name(cloneRegExp, "cloneRegExp");
  var cloneRegExp_default = cloneRegExp;

  // node_modules/lodash-es/_cloneSymbol.js
  var symbolProto = Symbol_default ? Symbol_default.prototype : void 0;
  var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
  function cloneSymbol(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
  }
  __name(cloneSymbol, "cloneSymbol");
  var cloneSymbol_default = cloneSymbol;

  // node_modules/lodash-es/_cloneTypedArray.js
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer_default(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }
  __name(cloneTypedArray, "cloneTypedArray");
  var cloneTypedArray_default = cloneTypedArray;

  // node_modules/lodash-es/_initCloneByTag.js
  var boolTag2 = "[object Boolean]";
  var dateTag2 = "[object Date]";
  var mapTag3 = "[object Map]";
  var numberTag2 = "[object Number]";
  var regexpTag2 = "[object RegExp]";
  var setTag3 = "[object Set]";
  var stringTag2 = "[object String]";
  var symbolTag = "[object Symbol]";
  var arrayBufferTag2 = "[object ArrayBuffer]";
  var dataViewTag3 = "[object DataView]";
  var float32Tag2 = "[object Float32Array]";
  var float64Tag2 = "[object Float64Array]";
  var int8Tag2 = "[object Int8Array]";
  var int16Tag2 = "[object Int16Array]";
  var int32Tag2 = "[object Int32Array]";
  var uint8Tag2 = "[object Uint8Array]";
  var uint8ClampedTag2 = "[object Uint8ClampedArray]";
  var uint16Tag2 = "[object Uint16Array]";
  var uint32Tag2 = "[object Uint32Array]";
  function initCloneByTag(object, tag, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag2:
        return cloneArrayBuffer_default(object);
      case boolTag2:
      case dateTag2:
        return new Ctor(+object);
      case dataViewTag3:
        return cloneDataView_default(object, isDeep);
      case float32Tag2:
      case float64Tag2:
      case int8Tag2:
      case int16Tag2:
      case int32Tag2:
      case uint8Tag2:
      case uint8ClampedTag2:
      case uint16Tag2:
      case uint32Tag2:
        return cloneTypedArray_default(object, isDeep);
      case mapTag3:
        return new Ctor();
      case numberTag2:
      case stringTag2:
        return new Ctor(object);
      case regexpTag2:
        return cloneRegExp_default(object);
      case setTag3:
        return new Ctor();
      case symbolTag:
        return cloneSymbol_default(object);
    }
  }
  __name(initCloneByTag, "initCloneByTag");
  var initCloneByTag_default = initCloneByTag;

  // node_modules/lodash-es/_initCloneObject.js
  function initCloneObject(object) {
    return typeof object.constructor == "function" && !isPrototype_default(object) ? baseCreate_default(getPrototype_default(object)) : {};
  }
  __name(initCloneObject, "initCloneObject");
  var initCloneObject_default = initCloneObject;

  // node_modules/lodash-es/_baseIsMap.js
  var mapTag4 = "[object Map]";
  function baseIsMap(value) {
    return isObjectLike_default(value) && getTag_default(value) == mapTag4;
  }
  __name(baseIsMap, "baseIsMap");
  var baseIsMap_default = baseIsMap;

  // node_modules/lodash-es/isMap.js
  var nodeIsMap = nodeUtil_default && nodeUtil_default.isMap;
  var isMap = nodeIsMap ? baseUnary_default(nodeIsMap) : baseIsMap_default;
  var isMap_default = isMap;

  // node_modules/lodash-es/_baseIsSet.js
  var setTag4 = "[object Set]";
  function baseIsSet(value) {
    return isObjectLike_default(value) && getTag_default(value) == setTag4;
  }
  __name(baseIsSet, "baseIsSet");
  var baseIsSet_default = baseIsSet;

  // node_modules/lodash-es/isSet.js
  var nodeIsSet = nodeUtil_default && nodeUtil_default.isSet;
  var isSet = nodeIsSet ? baseUnary_default(nodeIsSet) : baseIsSet_default;
  var isSet_default = isSet;

  // node_modules/lodash-es/_baseClone.js
  var CLONE_DEEP_FLAG = 1;
  var CLONE_FLAT_FLAG = 2;
  var CLONE_SYMBOLS_FLAG = 4;
  var argsTag3 = "[object Arguments]";
  var arrayTag2 = "[object Array]";
  var boolTag3 = "[object Boolean]";
  var dateTag3 = "[object Date]";
  var errorTag2 = "[object Error]";
  var funcTag3 = "[object Function]";
  var genTag2 = "[object GeneratorFunction]";
  var mapTag5 = "[object Map]";
  var numberTag3 = "[object Number]";
  var objectTag4 = "[object Object]";
  var regexpTag3 = "[object RegExp]";
  var setTag5 = "[object Set]";
  var stringTag3 = "[object String]";
  var symbolTag2 = "[object Symbol]";
  var weakMapTag3 = "[object WeakMap]";
  var arrayBufferTag3 = "[object ArrayBuffer]";
  var dataViewTag4 = "[object DataView]";
  var float32Tag3 = "[object Float32Array]";
  var float64Tag3 = "[object Float64Array]";
  var int8Tag3 = "[object Int8Array]";
  var int16Tag3 = "[object Int16Array]";
  var int32Tag3 = "[object Int32Array]";
  var uint8Tag3 = "[object Uint8Array]";
  var uint8ClampedTag3 = "[object Uint8ClampedArray]";
  var uint16Tag3 = "[object Uint16Array]";
  var uint32Tag3 = "[object Uint32Array]";
  var cloneableTags = {};
  cloneableTags[argsTag3] = cloneableTags[arrayTag2] = cloneableTags[arrayBufferTag3] = cloneableTags[dataViewTag4] = cloneableTags[boolTag3] = cloneableTags[dateTag3] = cloneableTags[float32Tag3] = cloneableTags[float64Tag3] = cloneableTags[int8Tag3] = cloneableTags[int16Tag3] = cloneableTags[int32Tag3] = cloneableTags[mapTag5] = cloneableTags[numberTag3] = cloneableTags[objectTag4] = cloneableTags[regexpTag3] = cloneableTags[setTag5] = cloneableTags[stringTag3] = cloneableTags[symbolTag2] = cloneableTags[uint8Tag3] = cloneableTags[uint8ClampedTag3] = cloneableTags[uint16Tag3] = cloneableTags[uint32Tag3] = true;
  cloneableTags[errorTag2] = cloneableTags[funcTag3] = cloneableTags[weakMapTag3] = false;
  function baseClone(value, bitmask, customizer, key, object, stack) {
    var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== void 0) {
      return result;
    }
    if (!isObject_default(value)) {
      return value;
    }
    var isArr = isArray_default(value);
    if (isArr) {
      result = initCloneArray_default(value);
      if (!isDeep) {
        return copyArray_default(value, result);
      }
    } else {
      var tag = getTag_default(value), isFunc = tag == funcTag3 || tag == genTag2;
      if (isBuffer_default(value)) {
        return cloneBuffer_default(value, isDeep);
      }
      if (tag == objectTag4 || tag == argsTag3 || isFunc && !object) {
        result = isFlat || isFunc ? {} : initCloneObject_default(value);
        if (!isDeep) {
          return isFlat ? copySymbolsIn_default(value, baseAssignIn_default(result, value)) : copySymbols_default(value, baseAssign_default(result, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object ? value : {};
        }
        result = initCloneByTag_default(value, tag, isDeep);
      }
    }
    stack || (stack = new Stack_default());
    var stacked = stack.get(value);
    if (stacked) {
      return stacked;
    }
    stack.set(value, result);
    if (isSet_default(value)) {
      value.forEach(function(subValue) {
        result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
      });
    } else if (isMap_default(value)) {
      value.forEach(function(subValue, key2) {
        result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
      });
    }
    var keysFunc = isFull ? isFlat ? getAllKeysIn_default : getAllKeys_default : isFlat ? keysIn_default : keys_default;
    var props = isArr ? void 0 : keysFunc(value);
    arrayEach_default(props || value, function(subValue, key2) {
      if (props) {
        key2 = subValue;
        subValue = value[key2];
      }
      assignValue_default(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
    });
    return result;
  }
  __name(baseClone, "baseClone");
  var baseClone_default = baseClone;

  // node_modules/lodash-es/cloneDeep.js
  var CLONE_DEEP_FLAG2 = 1;
  var CLONE_SYMBOLS_FLAG2 = 4;
  function cloneDeep(value) {
    return baseClone_default(value, CLONE_DEEP_FLAG2 | CLONE_SYMBOLS_FLAG2);
  }
  __name(cloneDeep, "cloneDeep");
  var cloneDeep_default = cloneDeep;

  // node_modules/lodash-es/_setCacheAdd.js
  var HASH_UNDEFINED3 = "__lodash_hash_undefined__";
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED3);
    return this;
  }
  __name(setCacheAdd, "setCacheAdd");
  var setCacheAdd_default = setCacheAdd;

  // node_modules/lodash-es/_setCacheHas.js
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  __name(setCacheHas, "setCacheHas");
  var setCacheHas_default = setCacheHas;

  // node_modules/lodash-es/_SetCache.js
  function SetCache(values) {
    var index = -1, length = values == null ? 0 : values.length;
    this.__data__ = new MapCache_default();
    while (++index < length) {
      this.add(values[index]);
    }
  }
  __name(SetCache, "SetCache");
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd_default;
  SetCache.prototype.has = setCacheHas_default;
  var SetCache_default = SetCache;

  // node_modules/lodash-es/_arraySome.js
  function arraySome(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
  __name(arraySome, "arraySome");
  var arraySome_default = arraySome;

  // node_modules/lodash-es/_cacheHas.js
  function cacheHas(cache, key) {
    return cache.has(key);
  }
  __name(cacheHas, "cacheHas");
  var cacheHas_default = cacheHas;

  // node_modules/lodash-es/_equalArrays.js
  var COMPARE_PARTIAL_FLAG = 1;
  var COMPARE_UNORDERED_FLAG = 2;
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var arrStacked = stack.get(array);
    var othStacked = stack.get(other);
    if (arrStacked && othStacked) {
      return arrStacked == other && othStacked == array;
    }
    var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache_default() : void 0;
    stack.set(array, other);
    stack.set(other, array);
    while (++index < arrLength) {
      var arrValue = array[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome_default(other, function(othValue2, othIndex) {
          if (!cacheHas_default(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result = false;
        break;
      }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
  }
  __name(equalArrays, "equalArrays");
  var equalArrays_default = equalArrays;

  // node_modules/lodash-es/_mapToArray.js
  function mapToArray(map) {
    var index = -1, result = Array(map.size);
    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  __name(mapToArray, "mapToArray");
  var mapToArray_default = mapToArray;

  // node_modules/lodash-es/_setToArray.js
  function setToArray(set) {
    var index = -1, result = Array(set.size);
    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  __name(setToArray, "setToArray");
  var setToArray_default = setToArray;

  // node_modules/lodash-es/_equalByTag.js
  var COMPARE_PARTIAL_FLAG2 = 1;
  var COMPARE_UNORDERED_FLAG2 = 2;
  var boolTag4 = "[object Boolean]";
  var dateTag4 = "[object Date]";
  var errorTag3 = "[object Error]";
  var mapTag6 = "[object Map]";
  var numberTag4 = "[object Number]";
  var regexpTag4 = "[object RegExp]";
  var setTag6 = "[object Set]";
  var stringTag4 = "[object String]";
  var symbolTag3 = "[object Symbol]";
  var arrayBufferTag4 = "[object ArrayBuffer]";
  var dataViewTag5 = "[object DataView]";
  var symbolProto2 = Symbol_default ? Symbol_default.prototype : void 0;
  var symbolValueOf2 = symbolProto2 ? symbolProto2.valueOf : void 0;
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag5:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag4:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array_default(object), new Uint8Array_default(other))) {
          return false;
        }
        return true;
      case boolTag4:
      case dateTag4:
      case numberTag4:
        return eq_default(+object, +other);
      case errorTag3:
        return object.name == other.name && object.message == other.message;
      case regexpTag4:
      case stringTag4:
        return object == other + "";
      case mapTag6:
        var convert = mapToArray_default;
      case setTag6:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG2;
        convert || (convert = setToArray_default);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG2;
        stack.set(object, other);
        var result = equalArrays_default(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack["delete"](object);
        return result;
      case symbolTag3:
        if (symbolValueOf2) {
          return symbolValueOf2.call(object) == symbolValueOf2.call(other);
        }
    }
    return false;
  }
  __name(equalByTag, "equalByTag");
  var equalByTag_default = equalByTag;

  // node_modules/lodash-es/_equalObjects.js
  var COMPARE_PARTIAL_FLAG3 = 1;
  var objectProto15 = Object.prototype;
  var hasOwnProperty12 = objectProto15.hasOwnProperty;
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG3, objProps = getAllKeys_default(object), objLength = objProps.length, othProps = getAllKeys_default(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty12.call(other, key))) {
        return false;
      }
    }
    var objStacked = stack.get(object);
    var othStacked = stack.get(other);
    if (objStacked && othStacked) {
      return objStacked == other && othStacked == object;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
  }
  __name(equalObjects, "equalObjects");
  var equalObjects_default = equalObjects;

  // node_modules/lodash-es/_baseIsEqualDeep.js
  var COMPARE_PARTIAL_FLAG4 = 1;
  var argsTag4 = "[object Arguments]";
  var arrayTag3 = "[object Array]";
  var objectTag5 = "[object Object]";
  var objectProto16 = Object.prototype;
  var hasOwnProperty13 = objectProto16.hasOwnProperty;
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray_default(object), othIsArr = isArray_default(other), objTag = objIsArr ? arrayTag3 : getTag_default(object), othTag = othIsArr ? arrayTag3 : getTag_default(other);
    objTag = objTag == argsTag4 ? objectTag5 : objTag;
    othTag = othTag == argsTag4 ? objectTag5 : othTag;
    var objIsObj = objTag == objectTag5, othIsObj = othTag == objectTag5, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer_default(object)) {
      if (!isBuffer_default(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack_default());
      return objIsArr || isTypedArray_default(object) ? equalArrays_default(object, other, bitmask, customizer, equalFunc, stack) : equalByTag_default(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG4)) {
      var objIsWrapped = objIsObj && hasOwnProperty13.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty13.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack_default());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack_default());
    return equalObjects_default(object, other, bitmask, customizer, equalFunc, stack);
  }
  __name(baseIsEqualDeep, "baseIsEqualDeep");
  var baseIsEqualDeep_default = baseIsEqualDeep;

  // node_modules/lodash-es/_baseIsEqual.js
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike_default(value) && !isObjectLike_default(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep_default(value, other, bitmask, customizer, baseIsEqual, stack);
  }
  __name(baseIsEqual, "baseIsEqual");
  var baseIsEqual_default = baseIsEqual;

  // node_modules/lodash-es/_createBaseFor.js
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }
  __name(createBaseFor, "createBaseFor");
  var createBaseFor_default = createBaseFor;

  // node_modules/lodash-es/_baseFor.js
  var baseFor = createBaseFor_default();
  var baseFor_default = baseFor;

  // node_modules/lodash-es/_assignMergeValue.js
  function assignMergeValue(object, key, value) {
    if (value !== void 0 && !eq_default(object[key], value) || value === void 0 && !(key in object)) {
      baseAssignValue_default(object, key, value);
    }
  }
  __name(assignMergeValue, "assignMergeValue");
  var assignMergeValue_default = assignMergeValue;

  // node_modules/lodash-es/isArrayLikeObject.js
  function isArrayLikeObject(value) {
    return isObjectLike_default(value) && isArrayLike_default(value);
  }
  __name(isArrayLikeObject, "isArrayLikeObject");
  var isArrayLikeObject_default = isArrayLikeObject;

  // node_modules/lodash-es/_safeGet.js
  function safeGet(object, key) {
    if (key === "constructor" && typeof object[key] === "function") {
      return;
    }
    if (key == "__proto__") {
      return;
    }
    return object[key];
  }
  __name(safeGet, "safeGet");
  var safeGet_default = safeGet;

  // node_modules/lodash-es/toPlainObject.js
  function toPlainObject(value) {
    return copyObject_default(value, keysIn_default(value));
  }
  __name(toPlainObject, "toPlainObject");
  var toPlainObject_default = toPlainObject;

  // node_modules/lodash-es/_baseMergeDeep.js
  function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = safeGet_default(object, key), srcValue = safeGet_default(source, key), stacked = stack.get(srcValue);
    if (stacked) {
      assignMergeValue_default(object, key, stacked);
      return;
    }
    var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
    var isCommon = newValue === void 0;
    if (isCommon) {
      var isArr = isArray_default(srcValue), isBuff = !isArr && isBuffer_default(srcValue), isTyped = !isArr && !isBuff && isTypedArray_default(srcValue);
      newValue = srcValue;
      if (isArr || isBuff || isTyped) {
        if (isArray_default(objValue)) {
          newValue = objValue;
        } else if (isArrayLikeObject_default(objValue)) {
          newValue = copyArray_default(objValue);
        } else if (isBuff) {
          isCommon = false;
          newValue = cloneBuffer_default(srcValue, true);
        } else if (isTyped) {
          isCommon = false;
          newValue = cloneTypedArray_default(srcValue, true);
        } else {
          newValue = [];
        }
      } else if (isPlainObject_default(srcValue) || isArguments_default(srcValue)) {
        newValue = objValue;
        if (isArguments_default(objValue)) {
          newValue = toPlainObject_default(objValue);
        } else if (!isObject_default(objValue) || isFunction_default(objValue)) {
          newValue = initCloneObject_default(srcValue);
        }
      } else {
        isCommon = false;
      }
    }
    if (isCommon) {
      stack.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      stack["delete"](srcValue);
    }
    assignMergeValue_default(object, key, newValue);
  }
  __name(baseMergeDeep, "baseMergeDeep");
  var baseMergeDeep_default = baseMergeDeep;

  // node_modules/lodash-es/_baseMerge.js
  function baseMerge(object, source, srcIndex, customizer, stack) {
    if (object === source) {
      return;
    }
    baseFor_default(source, function(srcValue, key) {
      stack || (stack = new Stack_default());
      if (isObject_default(srcValue)) {
        baseMergeDeep_default(object, source, key, srcIndex, baseMerge, customizer, stack);
      } else {
        var newValue = customizer ? customizer(safeGet_default(object, key), srcValue, key + "", object, source, stack) : void 0;
        if (newValue === void 0) {
          newValue = srcValue;
        }
        assignMergeValue_default(object, key, newValue);
      }
    }, keysIn_default);
  }
  __name(baseMerge, "baseMerge");
  var baseMerge_default = baseMerge;

  // node_modules/lodash-es/isEqual.js
  function isEqual(value, other) {
    return baseIsEqual_default(value, other);
  }
  __name(isEqual, "isEqual");
  var isEqual_default = isEqual;

  // node_modules/lodash-es/merge.js
  var merge = createAssigner_default(function(object, source, srcIndex) {
    baseMerge_default(object, source, srcIndex);
  });
  var merge_default = merge;

  // node_modules/parchment/dist/parchment.js
  var parchment_exports = {};
  __export(parchment_exports, {
    Attributor: () => Attributor,
    AttributorStore: () => AttributorStore$1,
    BlockBlot: () => BlockBlot$1,
    ClassAttributor: () => ClassAttributor$1,
    ContainerBlot: () => ContainerBlot$1,
    EmbedBlot: () => EmbedBlot$1,
    InlineBlot: () => InlineBlot$1,
    LeafBlot: () => LeafBlot$1,
    ParentBlot: () => ParentBlot$1,
    Registry: () => Registry,
    Scope: () => Scope,
    ScrollBlot: () => ScrollBlot$1,
    StyleAttributor: () => StyleAttributor$1,
    TextBlot: () => TextBlot$1
  });
  var Scope = /* @__PURE__ */ ((Scope2) => (Scope2[Scope2.TYPE = 3] = "TYPE", Scope2[Scope2.LEVEL = 12] = "LEVEL", Scope2[Scope2.ATTRIBUTE = 13] = "ATTRIBUTE", Scope2[Scope2.BLOT = 14] = "BLOT", Scope2[Scope2.INLINE = 7] = "INLINE", Scope2[Scope2.BLOCK = 11] = "BLOCK", Scope2[Scope2.BLOCK_BLOT = 10] = "BLOCK_BLOT", Scope2[Scope2.INLINE_BLOT = 6] = "INLINE_BLOT", Scope2[Scope2.BLOCK_ATTRIBUTE = 9] = "BLOCK_ATTRIBUTE", Scope2[Scope2.INLINE_ATTRIBUTE = 5] = "INLINE_ATTRIBUTE", Scope2[Scope2.ANY = 15] = "ANY", Scope2))(Scope || {});
  var Attributor = class {
    static {
      __name(this, "Attributor");
    }
    constructor(attrName, keyName, options = {}) {
      this.attrName = attrName, this.keyName = keyName;
      const attributeBit = Scope.TYPE & Scope.ATTRIBUTE;
      this.scope = options.scope != null ? (
        // Ignore type bits, force attribute bit
        options.scope & Scope.LEVEL | attributeBit
      ) : Scope.ATTRIBUTE, options.whitelist != null && (this.whitelist = options.whitelist);
    }
    static keys(node) {
      return Array.from(node.attributes).map((item) => item.name);
    }
    add(node, value) {
      return this.canAdd(node, value) ? (node.setAttribute(this.keyName, value), true) : false;
    }
    canAdd(_node, value) {
      return this.whitelist == null ? true : typeof value == "string" ? this.whitelist.indexOf(value.replace(/["']/g, "")) > -1 : this.whitelist.indexOf(value) > -1;
    }
    remove(node) {
      node.removeAttribute(this.keyName);
    }
    value(node) {
      const value = node.getAttribute(this.keyName);
      return this.canAdd(node, value) && value ? value : "";
    }
  };
  var ParchmentError = class extends Error {
    static {
      __name(this, "ParchmentError");
    }
    constructor(message) {
      message = "[Parchment] " + message, super(message), this.message = message, this.name = this.constructor.name;
    }
  };
  var _Registry = class _Registry2 {
    static {
      __name(this, "_Registry");
    }
    constructor() {
      this.attributes = {}, this.classes = {}, this.tags = {}, this.types = {};
    }
    static find(node, bubble = false) {
      if (node == null)
        return null;
      if (this.blots.has(node))
        return this.blots.get(node) || null;
      if (bubble) {
        let parentNode = null;
        try {
          parentNode = node.parentNode;
        } catch {
          return null;
        }
        return this.find(parentNode, bubble);
      }
      return null;
    }
    create(scroll, input, value) {
      const match2 = this.query(input);
      if (match2 == null)
        throw new ParchmentError(`Unable to create ${input} blot`);
      const blotClass = match2, node = (
        // @ts-expect-error Fix me later
        input instanceof Node || input.nodeType === Node.TEXT_NODE ? input : blotClass.create(value)
      ), blot = new blotClass(scroll, node, value);
      return _Registry2.blots.set(blot.domNode, blot), blot;
    }
    find(node, bubble = false) {
      return _Registry2.find(node, bubble);
    }
    query(query, scope = Scope.ANY) {
      let match2;
      return typeof query == "string" ? match2 = this.types[query] || this.attributes[query] : query instanceof Text || query.nodeType === Node.TEXT_NODE ? match2 = this.types.text : typeof query == "number" ? query & Scope.LEVEL & Scope.BLOCK ? match2 = this.types.block : query & Scope.LEVEL & Scope.INLINE && (match2 = this.types.inline) : query instanceof Element && ((query.getAttribute("class") || "").split(/\s+/).some((name) => (match2 = this.classes[name], !!match2)), match2 = match2 || this.tags[query.tagName]), match2 == null ? null : "scope" in match2 && scope & Scope.LEVEL & match2.scope && scope & Scope.TYPE & match2.scope ? match2 : null;
    }
    register(...definitions) {
      return definitions.map((definition) => {
        const isBlot = "blotName" in definition, isAttr = "attrName" in definition;
        if (!isBlot && !isAttr)
          throw new ParchmentError("Invalid definition");
        if (isBlot && definition.blotName === "abstract")
          throw new ParchmentError("Cannot register abstract class");
        const key = isBlot ? definition.blotName : isAttr ? definition.attrName : void 0;
        return this.types[key] = definition, isAttr ? typeof definition.keyName == "string" && (this.attributes[definition.keyName] = definition) : isBlot && (definition.className && (this.classes[definition.className] = definition), definition.tagName && (Array.isArray(definition.tagName) ? definition.tagName = definition.tagName.map((tagName) => tagName.toUpperCase()) : definition.tagName = definition.tagName.toUpperCase(), (Array.isArray(definition.tagName) ? definition.tagName : [definition.tagName]).forEach((tag) => {
          (this.tags[tag] == null || definition.className == null) && (this.tags[tag] = definition);
        }))), definition;
      });
    }
  };
  _Registry.blots = /* @__PURE__ */ new WeakMap();
  var Registry = _Registry;
  function match(node, prefix) {
    return (node.getAttribute("class") || "").split(/\s+/).filter((name) => name.indexOf(`${prefix}-`) === 0);
  }
  __name(match, "match");
  var ClassAttributor = class extends Attributor {
    static {
      __name(this, "ClassAttributor");
    }
    static keys(node) {
      return (node.getAttribute("class") || "").split(/\s+/).map((name) => name.split("-").slice(0, -1).join("-"));
    }
    add(node, value) {
      return this.canAdd(node, value) ? (this.remove(node), node.classList.add(`${this.keyName}-${value}`), true) : false;
    }
    remove(node) {
      match(node, this.keyName).forEach((name) => {
        node.classList.remove(name);
      }), node.classList.length === 0 && node.removeAttribute("class");
    }
    value(node) {
      const value = (match(node, this.keyName)[0] || "").slice(this.keyName.length + 1);
      return this.canAdd(node, value) ? value : "";
    }
  };
  var ClassAttributor$1 = ClassAttributor;
  function camelize(name) {
    const parts = name.split("-"), rest = parts.slice(1).map((part) => part[0].toUpperCase() + part.slice(1)).join("");
    return parts[0] + rest;
  }
  __name(camelize, "camelize");
  var StyleAttributor = class extends Attributor {
    static {
      __name(this, "StyleAttributor");
    }
    static keys(node) {
      return (node.getAttribute("style") || "").split(";").map((value) => value.split(":")[0].trim());
    }
    add(node, value) {
      return this.canAdd(node, value) ? (node.style[camelize(this.keyName)] = value, true) : false;
    }
    remove(node) {
      node.style[camelize(this.keyName)] = "", node.getAttribute("style") || node.removeAttribute("style");
    }
    value(node) {
      const value = node.style[camelize(this.keyName)];
      return this.canAdd(node, value) ? value : "";
    }
  };
  var StyleAttributor$1 = StyleAttributor;
  var AttributorStore = class {
    static {
      __name(this, "AttributorStore");
    }
    constructor(domNode) {
      this.attributes = {}, this.domNode = domNode, this.build();
    }
    attribute(attribute, value) {
      value ? attribute.add(this.domNode, value) && (attribute.value(this.domNode) != null ? this.attributes[attribute.attrName] = attribute : delete this.attributes[attribute.attrName]) : (attribute.remove(this.domNode), delete this.attributes[attribute.attrName]);
    }
    build() {
      this.attributes = {};
      const blot = Registry.find(this.domNode);
      if (blot == null)
        return;
      const attributes = Attributor.keys(this.domNode), classes = ClassAttributor$1.keys(this.domNode), styles = StyleAttributor$1.keys(this.domNode);
      attributes.concat(classes).concat(styles).forEach((name) => {
        const attr = blot.scroll.query(name, Scope.ATTRIBUTE);
        attr instanceof Attributor && (this.attributes[attr.attrName] = attr);
      });
    }
    copy(target) {
      Object.keys(this.attributes).forEach((key) => {
        const value = this.attributes[key].value(this.domNode);
        target.format(key, value);
      });
    }
    move(target) {
      this.copy(target), Object.keys(this.attributes).forEach((key) => {
        this.attributes[key].remove(this.domNode);
      }), this.attributes = {};
    }
    values() {
      return Object.keys(this.attributes).reduce(
        (attributes, name) => (attributes[name] = this.attributes[name].value(this.domNode), attributes),
        {}
      );
    }
  };
  var AttributorStore$1 = AttributorStore;
  var _ShadowBlot = class _ShadowBlot2 {
    static {
      __name(this, "_ShadowBlot");
    }
    constructor(scroll, domNode) {
      this.scroll = scroll, this.domNode = domNode, Registry.blots.set(domNode, this), this.prev = null, this.next = null;
    }
    static create(rawValue) {
      if (this.tagName == null)
        throw new ParchmentError("Blot definition missing tagName");
      let node, value;
      return Array.isArray(this.tagName) ? (typeof rawValue == "string" ? (value = rawValue.toUpperCase(), parseInt(value, 10).toString() === value && (value = parseInt(value, 10))) : typeof rawValue == "number" && (value = rawValue), typeof value == "number" ? node = document.createElement(this.tagName[value - 1]) : value && this.tagName.indexOf(value) > -1 ? node = document.createElement(value) : node = document.createElement(this.tagName[0])) : node = document.createElement(this.tagName), this.className && node.classList.add(this.className), node;
    }
    // Hack for accessing inherited static methods
    get statics() {
      return this.constructor;
    }
    attach() {
    }
    clone() {
      const domNode = this.domNode.cloneNode(false);
      return this.scroll.create(domNode);
    }
    detach() {
      this.parent != null && this.parent.removeChild(this), Registry.blots.delete(this.domNode);
    }
    deleteAt(index, length) {
      this.isolate(index, length).remove();
    }
    formatAt(index, length, name, value) {
      const blot = this.isolate(index, length);
      if (this.scroll.query(name, Scope.BLOT) != null && value)
        blot.wrap(name, value);
      else if (this.scroll.query(name, Scope.ATTRIBUTE) != null) {
        const parent = this.scroll.create(this.statics.scope);
        blot.wrap(parent), parent.format(name, value);
      }
    }
    insertAt(index, value, def) {
      const blot = def == null ? this.scroll.create("text", value) : this.scroll.create(value, def), ref = this.split(index);
      this.parent.insertBefore(blot, ref || void 0);
    }
    isolate(index, length) {
      const target = this.split(index);
      if (target == null)
        throw new Error("Attempt to isolate at end");
      return target.split(length), target;
    }
    length() {
      return 1;
    }
    offset(root2 = this.parent) {
      return this.parent == null || this === root2 ? 0 : this.parent.children.offset(this) + this.parent.offset(root2);
    }
    optimize(_context) {
      this.statics.requiredContainer && !(this.parent instanceof this.statics.requiredContainer) && this.wrap(this.statics.requiredContainer.blotName);
    }
    remove() {
      this.domNode.parentNode != null && this.domNode.parentNode.removeChild(this.domNode), this.detach();
    }
    replaceWith(name, value) {
      const replacement = typeof name == "string" ? this.scroll.create(name, value) : name;
      return this.parent != null && (this.parent.insertBefore(replacement, this.next || void 0), this.remove()), replacement;
    }
    split(index, _force) {
      return index === 0 ? this : this.next;
    }
    update(_mutations, _context) {
    }
    wrap(name, value) {
      const wrapper = typeof name == "string" ? this.scroll.create(name, value) : name;
      if (this.parent != null && this.parent.insertBefore(wrapper, this.next || void 0), typeof wrapper.appendChild != "function")
        throw new ParchmentError(`Cannot wrap ${name}`);
      return wrapper.appendChild(this), wrapper;
    }
  };
  _ShadowBlot.blotName = "abstract";
  var ShadowBlot = _ShadowBlot;
  var _LeafBlot = class _LeafBlot2 extends ShadowBlot {
    static {
      __name(this, "_LeafBlot");
    }
    /**
     * Returns the value represented by domNode if it is this Blot's type
     * No checking that domNode can represent this Blot type is required so
     * applications needing it should check externally before calling.
     */
    static value(_domNode) {
      return true;
    }
    /**
     * Given location represented by node and offset from DOM Selection Range,
     * return index to that location.
     */
    index(node, offset) {
      return this.domNode === node || this.domNode.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY ? Math.min(offset, 1) : -1;
    }
    /**
     * Given index to location within blot, return node and offset representing
     * that location, consumable by DOM Selection Range
     */
    position(index, _inclusive) {
      let offset = Array.from(this.parent.domNode.childNodes).indexOf(this.domNode);
      return index > 0 && (offset += 1), [this.parent.domNode, offset];
    }
    /**
     * Return value represented by this blot
     * Should not change without interaction from API or
     * user change detectable by update()
     */
    value() {
      return {
        [this.statics.blotName]: this.statics.value(this.domNode) || true
      };
    }
  };
  _LeafBlot.scope = Scope.INLINE_BLOT;
  var LeafBlot = _LeafBlot;
  var LeafBlot$1 = LeafBlot;
  var LinkedList = class {
    static {
      __name(this, "LinkedList");
    }
    constructor() {
      this.head = null, this.tail = null, this.length = 0;
    }
    append(...nodes) {
      if (this.insertBefore(nodes[0], null), nodes.length > 1) {
        const rest = nodes.slice(1);
        this.append(...rest);
      }
    }
    at(index) {
      const next = this.iterator();
      let cur = next();
      for (; cur && index > 0; )
        index -= 1, cur = next();
      return cur;
    }
    contains(node) {
      const next = this.iterator();
      let cur = next();
      for (; cur; ) {
        if (cur === node)
          return true;
        cur = next();
      }
      return false;
    }
    indexOf(node) {
      const next = this.iterator();
      let cur = next(), index = 0;
      for (; cur; ) {
        if (cur === node)
          return index;
        index += 1, cur = next();
      }
      return -1;
    }
    insertBefore(node, refNode) {
      node != null && (this.remove(node), node.next = refNode, refNode != null ? (node.prev = refNode.prev, refNode.prev != null && (refNode.prev.next = node), refNode.prev = node, refNode === this.head && (this.head = node)) : this.tail != null ? (this.tail.next = node, node.prev = this.tail, this.tail = node) : (node.prev = null, this.head = this.tail = node), this.length += 1);
    }
    offset(target) {
      let index = 0, cur = this.head;
      for (; cur != null; ) {
        if (cur === target)
          return index;
        index += cur.length(), cur = cur.next;
      }
      return -1;
    }
    remove(node) {
      this.contains(node) && (node.prev != null && (node.prev.next = node.next), node.next != null && (node.next.prev = node.prev), node === this.head && (this.head = node.next), node === this.tail && (this.tail = node.prev), this.length -= 1);
    }
    iterator(curNode = this.head) {
      return () => {
        const ret = curNode;
        return curNode != null && (curNode = curNode.next), ret;
      };
    }
    find(index, inclusive = false) {
      const next = this.iterator();
      let cur = next();
      for (; cur; ) {
        const length = cur.length();
        if (index < length || inclusive && index === length && (cur.next == null || cur.next.length() !== 0))
          return [cur, index];
        index -= length, cur = next();
      }
      return [null, 0];
    }
    forEach(callback) {
      const next = this.iterator();
      let cur = next();
      for (; cur; )
        callback(cur), cur = next();
    }
    forEachAt(index, length, callback) {
      if (length <= 0)
        return;
      const [startNode, offset] = this.find(index);
      let curIndex = index - offset;
      const next = this.iterator(startNode);
      let cur = next();
      for (; cur && curIndex < index + length; ) {
        const curLength = cur.length();
        index > curIndex ? callback(
          cur,
          index - curIndex,
          Math.min(length, curIndex + curLength - index)
        ) : callback(cur, 0, Math.min(curLength, index + length - curIndex)), curIndex += curLength, cur = next();
      }
    }
    map(callback) {
      return this.reduce((memo, cur) => (memo.push(callback(cur)), memo), []);
    }
    reduce(callback, memo) {
      const next = this.iterator();
      let cur = next();
      for (; cur; )
        memo = callback(memo, cur), cur = next();
      return memo;
    }
  };
  function makeAttachedBlot(node, scroll) {
    const found = scroll.find(node);
    if (found)
      return found;
    try {
      return scroll.create(node);
    } catch {
      const blot = scroll.create(Scope.INLINE);
      return Array.from(node.childNodes).forEach((child) => {
        blot.domNode.appendChild(child);
      }), node.parentNode && node.parentNode.replaceChild(blot.domNode, node), blot.attach(), blot;
    }
  }
  __name(makeAttachedBlot, "makeAttachedBlot");
  var _ParentBlot = class _ParentBlot2 extends ShadowBlot {
    static {
      __name(this, "_ParentBlot");
    }
    constructor(scroll, domNode) {
      super(scroll, domNode), this.uiNode = null, this.build();
    }
    appendChild(other) {
      this.insertBefore(other);
    }
    attach() {
      super.attach(), this.children.forEach((child) => {
        child.attach();
      });
    }
    attachUI(node) {
      this.uiNode != null && this.uiNode.remove(), this.uiNode = node, _ParentBlot2.uiClass && this.uiNode.classList.add(_ParentBlot2.uiClass), this.uiNode.setAttribute("contenteditable", "false"), this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
    }
    /**
     * Called during construction, should fill its own children LinkedList.
     */
    build() {
      this.children = new LinkedList(), Array.from(this.domNode.childNodes).filter((node) => node !== this.uiNode).reverse().forEach((node) => {
        try {
          const child = makeAttachedBlot(node, this.scroll);
          this.insertBefore(child, this.children.head || void 0);
        } catch (err) {
          if (err instanceof ParchmentError)
            return;
          throw err;
        }
      });
    }
    deleteAt(index, length) {
      if (index === 0 && length === this.length())
        return this.remove();
      this.children.forEachAt(index, length, (child, offset, childLength) => {
        child.deleteAt(offset, childLength);
      });
    }
    descendant(criteria, index = 0) {
      const [child, offset] = this.children.find(index);
      return criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria ? [child, offset] : child instanceof _ParentBlot2 ? child.descendant(criteria, offset) : [null, -1];
    }
    descendants(criteria, index = 0, length = Number.MAX_VALUE) {
      let descendants = [], lengthLeft = length;
      return this.children.forEachAt(
        index,
        length,
        (child, childIndex, childLength) => {
          (criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria) && descendants.push(child), child instanceof _ParentBlot2 && (descendants = descendants.concat(
            child.descendants(criteria, childIndex, lengthLeft)
          )), lengthLeft -= childLength;
        }
      ), descendants;
    }
    detach() {
      this.children.forEach((child) => {
        child.detach();
      }), super.detach();
    }
    enforceAllowedChildren() {
      let done = false;
      this.children.forEach((child) => {
        done || this.statics.allowedChildren.some(
          (def) => child instanceof def
        ) || (child.statics.scope === Scope.BLOCK_BLOT ? (child.next != null && this.splitAfter(child), child.prev != null && this.splitAfter(child.prev), child.parent.unwrap(), done = true) : child instanceof _ParentBlot2 ? child.unwrap() : child.remove());
      });
    }
    formatAt(index, length, name, value) {
      this.children.forEachAt(index, length, (child, offset, childLength) => {
        child.formatAt(offset, childLength, name, value);
      });
    }
    insertAt(index, value, def) {
      const [child, offset] = this.children.find(index);
      if (child)
        child.insertAt(offset, value, def);
      else {
        const blot = def == null ? this.scroll.create("text", value) : this.scroll.create(value, def);
        this.appendChild(blot);
      }
    }
    insertBefore(childBlot, refBlot) {
      childBlot.parent != null && childBlot.parent.children.remove(childBlot);
      let refDomNode = null;
      this.children.insertBefore(childBlot, refBlot || null), childBlot.parent = this, refBlot != null && (refDomNode = refBlot.domNode), (this.domNode.parentNode !== childBlot.domNode || this.domNode.nextSibling !== refDomNode) && this.domNode.insertBefore(childBlot.domNode, refDomNode), childBlot.attach();
    }
    length() {
      return this.children.reduce((memo, child) => memo + child.length(), 0);
    }
    moveChildren(targetParent, refNode) {
      this.children.forEach((child) => {
        targetParent.insertBefore(child, refNode);
      });
    }
    optimize(context) {
      if (super.optimize(context), this.enforceAllowedChildren(), this.uiNode != null && this.uiNode !== this.domNode.firstChild && this.domNode.insertBefore(this.uiNode, this.domNode.firstChild), this.children.length === 0)
        if (this.statics.defaultChild != null) {
          const child = this.scroll.create(this.statics.defaultChild.blotName);
          this.appendChild(child);
        } else
          this.remove();
    }
    path(index, inclusive = false) {
      const [child, offset] = this.children.find(index, inclusive), position = [[this, index]];
      return child instanceof _ParentBlot2 ? position.concat(child.path(offset, inclusive)) : (child != null && position.push([child, offset]), position);
    }
    removeChild(child) {
      this.children.remove(child);
    }
    replaceWith(name, value) {
      const replacement = typeof name == "string" ? this.scroll.create(name, value) : name;
      return replacement instanceof _ParentBlot2 && this.moveChildren(replacement), super.replaceWith(replacement);
    }
    split(index, force = false) {
      if (!force) {
        if (index === 0)
          return this;
        if (index === this.length())
          return this.next;
      }
      const after = this.clone();
      return this.parent && this.parent.insertBefore(after, this.next || void 0), this.children.forEachAt(index, this.length(), (child, offset, _length) => {
        const split = child.split(offset, force);
        split != null && after.appendChild(split);
      }), after;
    }
    splitAfter(child) {
      const after = this.clone();
      for (; child.next != null; )
        after.appendChild(child.next);
      return this.parent && this.parent.insertBefore(after, this.next || void 0), after;
    }
    unwrap() {
      this.parent && this.moveChildren(this.parent, this.next || void 0), this.remove();
    }
    update(mutations, _context) {
      const addedNodes = [], removedNodes = [];
      mutations.forEach((mutation) => {
        mutation.target === this.domNode && mutation.type === "childList" && (addedNodes.push(...mutation.addedNodes), removedNodes.push(...mutation.removedNodes));
      }), removedNodes.forEach((node) => {
        if (node.parentNode != null && // @ts-expect-error Fix me later
        node.tagName !== "IFRAME" && document.body.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY)
          return;
        const blot = this.scroll.find(node);
        blot != null && (blot.domNode.parentNode == null || blot.domNode.parentNode === this.domNode) && blot.detach();
      }), addedNodes.filter((node) => node.parentNode === this.domNode && node !== this.uiNode).sort((a, b) => a === b ? 0 : a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? 1 : -1).forEach((node) => {
        let refBlot = null;
        node.nextSibling != null && (refBlot = this.scroll.find(node.nextSibling));
        const blot = makeAttachedBlot(node, this.scroll);
        (blot.next !== refBlot || blot.next == null) && (blot.parent != null && blot.parent.removeChild(this), this.insertBefore(blot, refBlot || void 0));
      }), this.enforceAllowedChildren();
    }
  };
  _ParentBlot.uiClass = "";
  var ParentBlot = _ParentBlot;
  var ParentBlot$1 = ParentBlot;
  function isEqual2(obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length)
      return false;
    for (const prop in obj1)
      if (obj1[prop] !== obj2[prop])
        return false;
    return true;
  }
  __name(isEqual2, "isEqual");
  var _InlineBlot = class _InlineBlot2 extends ParentBlot$1 {
    static {
      __name(this, "_InlineBlot");
    }
    static create(value) {
      return super.create(value);
    }
    static formats(domNode, scroll) {
      const match2 = scroll.query(_InlineBlot2.blotName);
      if (!(match2 != null && domNode.tagName === match2.tagName)) {
        if (typeof this.tagName == "string")
          return true;
        if (Array.isArray(this.tagName))
          return domNode.tagName.toLowerCase();
      }
    }
    constructor(scroll, domNode) {
      super(scroll, domNode), this.attributes = new AttributorStore$1(this.domNode);
    }
    format(name, value) {
      if (name === this.statics.blotName && !value)
        this.children.forEach((child) => {
          child instanceof _InlineBlot2 || (child = child.wrap(_InlineBlot2.blotName, true)), this.attributes.copy(child);
        }), this.unwrap();
      else {
        const format = this.scroll.query(name, Scope.INLINE);
        if (format == null)
          return;
        format instanceof Attributor ? this.attributes.attribute(format, value) : value && (name !== this.statics.blotName || this.formats()[name] !== value) && this.replaceWith(name, value);
      }
    }
    formats() {
      const formats = this.attributes.values(), format = this.statics.formats(this.domNode, this.scroll);
      return format != null && (formats[this.statics.blotName] = format), formats;
    }
    formatAt(index, length, name, value) {
      this.formats()[name] != null || this.scroll.query(name, Scope.ATTRIBUTE) ? this.isolate(index, length).format(name, value) : super.formatAt(index, length, name, value);
    }
    optimize(context) {
      super.optimize(context);
      const formats = this.formats();
      if (Object.keys(formats).length === 0)
        return this.unwrap();
      const next = this.next;
      next instanceof _InlineBlot2 && next.prev === this && isEqual2(formats, next.formats()) && (next.moveChildren(this), next.remove());
    }
    replaceWith(name, value) {
      const replacement = super.replaceWith(name, value);
      return this.attributes.copy(replacement), replacement;
    }
    update(mutations, context) {
      super.update(mutations, context), mutations.some(
        (mutation) => mutation.target === this.domNode && mutation.type === "attributes"
      ) && this.attributes.build();
    }
    wrap(name, value) {
      const wrapper = super.wrap(name, value);
      return wrapper instanceof _InlineBlot2 && this.attributes.move(wrapper), wrapper;
    }
  };
  _InlineBlot.allowedChildren = [_InlineBlot, LeafBlot$1], _InlineBlot.blotName = "inline", _InlineBlot.scope = Scope.INLINE_BLOT, _InlineBlot.tagName = "SPAN";
  var InlineBlot = _InlineBlot;
  var InlineBlot$1 = InlineBlot;
  var _BlockBlot = class _BlockBlot2 extends ParentBlot$1 {
    static {
      __name(this, "_BlockBlot");
    }
    static create(value) {
      return super.create(value);
    }
    static formats(domNode, scroll) {
      const match2 = scroll.query(_BlockBlot2.blotName);
      if (!(match2 != null && domNode.tagName === match2.tagName)) {
        if (typeof this.tagName == "string")
          return true;
        if (Array.isArray(this.tagName))
          return domNode.tagName.toLowerCase();
      }
    }
    constructor(scroll, domNode) {
      super(scroll, domNode), this.attributes = new AttributorStore$1(this.domNode);
    }
    format(name, value) {
      const format = this.scroll.query(name, Scope.BLOCK);
      format != null && (format instanceof Attributor ? this.attributes.attribute(format, value) : name === this.statics.blotName && !value ? this.replaceWith(_BlockBlot2.blotName) : value && (name !== this.statics.blotName || this.formats()[name] !== value) && this.replaceWith(name, value));
    }
    formats() {
      const formats = this.attributes.values(), format = this.statics.formats(this.domNode, this.scroll);
      return format != null && (formats[this.statics.blotName] = format), formats;
    }
    formatAt(index, length, name, value) {
      this.scroll.query(name, Scope.BLOCK) != null ? this.format(name, value) : super.formatAt(index, length, name, value);
    }
    insertAt(index, value, def) {
      if (def == null || this.scroll.query(value, Scope.INLINE) != null)
        super.insertAt(index, value, def);
      else {
        const after = this.split(index);
        if (after != null) {
          const blot = this.scroll.create(value, def);
          after.parent.insertBefore(blot, after);
        } else
          throw new Error("Attempt to insertAt after block boundaries");
      }
    }
    replaceWith(name, value) {
      const replacement = super.replaceWith(name, value);
      return this.attributes.copy(replacement), replacement;
    }
    update(mutations, context) {
      super.update(mutations, context), mutations.some(
        (mutation) => mutation.target === this.domNode && mutation.type === "attributes"
      ) && this.attributes.build();
    }
  };
  _BlockBlot.blotName = "block", _BlockBlot.scope = Scope.BLOCK_BLOT, _BlockBlot.tagName = "P", _BlockBlot.allowedChildren = [
    InlineBlot$1,
    _BlockBlot,
    LeafBlot$1
  ];
  var BlockBlot = _BlockBlot;
  var BlockBlot$1 = BlockBlot;
  var _ContainerBlot = class _ContainerBlot2 extends ParentBlot$1 {
    static {
      __name(this, "_ContainerBlot");
    }
    checkMerge() {
      return this.next !== null && this.next.statics.blotName === this.statics.blotName;
    }
    deleteAt(index, length) {
      super.deleteAt(index, length), this.enforceAllowedChildren();
    }
    formatAt(index, length, name, value) {
      super.formatAt(index, length, name, value), this.enforceAllowedChildren();
    }
    insertAt(index, value, def) {
      super.insertAt(index, value, def), this.enforceAllowedChildren();
    }
    optimize(context) {
      super.optimize(context), this.children.length > 0 && this.next != null && this.checkMerge() && (this.next.moveChildren(this), this.next.remove());
    }
  };
  _ContainerBlot.blotName = "container", _ContainerBlot.scope = Scope.BLOCK_BLOT;
  var ContainerBlot = _ContainerBlot;
  var ContainerBlot$1 = ContainerBlot;
  var EmbedBlot = class extends LeafBlot$1 {
    static {
      __name(this, "EmbedBlot");
    }
    static formats(_domNode, _scroll) {
    }
    format(name, value) {
      super.formatAt(0, this.length(), name, value);
    }
    formatAt(index, length, name, value) {
      index === 0 && length === this.length() ? this.format(name, value) : super.formatAt(index, length, name, value);
    }
    formats() {
      return this.statics.formats(this.domNode, this.scroll);
    }
  };
  var EmbedBlot$1 = EmbedBlot;
  var OBSERVER_CONFIG = {
    attributes: true,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true
  };
  var MAX_OPTIMIZE_ITERATIONS = 100;
  var _ScrollBlot = class _ScrollBlot2 extends ParentBlot$1 {
    static {
      __name(this, "_ScrollBlot");
    }
    constructor(registry, node) {
      super(null, node), this.registry = registry, this.scroll = this, this.build(), this.observer = new MutationObserver((mutations) => {
        this.update(mutations);
      }), this.observer.observe(this.domNode, OBSERVER_CONFIG), this.attach();
    }
    create(input, value) {
      return this.registry.create(this, input, value);
    }
    find(node, bubble = false) {
      const blot = this.registry.find(node, bubble);
      return blot ? blot.scroll === this ? blot : bubble ? this.find(blot.scroll.domNode.parentNode, true) : null : null;
    }
    query(query, scope = Scope.ANY) {
      return this.registry.query(query, scope);
    }
    register(...definitions) {
      return this.registry.register(...definitions);
    }
    build() {
      this.scroll != null && super.build();
    }
    detach() {
      super.detach(), this.observer.disconnect();
    }
    deleteAt(index, length) {
      this.update(), index === 0 && length === this.length() ? this.children.forEach((child) => {
        child.remove();
      }) : super.deleteAt(index, length);
    }
    formatAt(index, length, name, value) {
      this.update(), super.formatAt(index, length, name, value);
    }
    insertAt(index, value, def) {
      this.update(), super.insertAt(index, value, def);
    }
    optimize(mutations = [], context = {}) {
      super.optimize(context);
      const mutationsMap = context.mutationsMap || /* @__PURE__ */ new WeakMap();
      let records = Array.from(this.observer.takeRecords());
      for (; records.length > 0; )
        mutations.push(records.pop());
      const mark = /* @__PURE__ */ __name((blot, markParent = true) => {
        blot == null || blot === this || blot.domNode.parentNode != null && (mutationsMap.has(blot.domNode) || mutationsMap.set(blot.domNode, []), markParent && mark(blot.parent));
      }, "mark"), optimize = /* @__PURE__ */ __name((blot) => {
        mutationsMap.has(blot.domNode) && (blot instanceof ParentBlot$1 && blot.children.forEach(optimize), mutationsMap.delete(blot.domNode), blot.optimize(context));
      }, "optimize");
      let remaining = mutations;
      for (let i = 0; remaining.length > 0; i += 1) {
        if (i >= MAX_OPTIMIZE_ITERATIONS)
          throw new Error("[Parchment] Maximum optimize iterations reached");
        for (remaining.forEach((mutation) => {
          const blot = this.find(mutation.target, true);
          blot != null && (blot.domNode === mutation.target && (mutation.type === "childList" ? (mark(this.find(mutation.previousSibling, false)), Array.from(mutation.addedNodes).forEach((node) => {
            const child = this.find(node, false);
            mark(child, false), child instanceof ParentBlot$1 && child.children.forEach((grandChild) => {
              mark(grandChild, false);
            });
          })) : mutation.type === "attributes" && mark(blot.prev)), mark(blot));
        }), this.children.forEach(optimize), remaining = Array.from(this.observer.takeRecords()), records = remaining.slice(); records.length > 0; )
          mutations.push(records.pop());
      }
    }
    update(mutations, context = {}) {
      mutations = mutations || this.observer.takeRecords();
      const mutationsMap = /* @__PURE__ */ new WeakMap();
      mutations.map((mutation) => {
        const blot = this.find(mutation.target, true);
        return blot == null ? null : mutationsMap.has(blot.domNode) ? (mutationsMap.get(blot.domNode).push(mutation), null) : (mutationsMap.set(blot.domNode, [mutation]), blot);
      }).forEach((blot) => {
        blot != null && blot !== this && mutationsMap.has(blot.domNode) && blot.update(mutationsMap.get(blot.domNode) || [], context);
      }), context.mutationsMap = mutationsMap, mutationsMap.has(this.domNode) && super.update(mutationsMap.get(this.domNode), context), this.optimize(mutations, context);
    }
  };
  _ScrollBlot.blotName = "scroll", _ScrollBlot.defaultChild = BlockBlot$1, _ScrollBlot.allowedChildren = [BlockBlot$1, ContainerBlot$1], _ScrollBlot.scope = Scope.BLOCK_BLOT, _ScrollBlot.tagName = "DIV";
  var ScrollBlot = _ScrollBlot;
  var ScrollBlot$1 = ScrollBlot;
  var _TextBlot = class _TextBlot2 extends LeafBlot$1 {
    static {
      __name(this, "_TextBlot");
    }
    static create(value) {
      return document.createTextNode(value);
    }
    static value(domNode) {
      return domNode.data;
    }
    constructor(scroll, node) {
      super(scroll, node), this.text = this.statics.value(this.domNode);
    }
    deleteAt(index, length) {
      this.domNode.data = this.text = this.text.slice(0, index) + this.text.slice(index + length);
    }
    index(node, offset) {
      return this.domNode === node ? offset : -1;
    }
    insertAt(index, value, def) {
      def == null ? (this.text = this.text.slice(0, index) + value + this.text.slice(index), this.domNode.data = this.text) : super.insertAt(index, value, def);
    }
    length() {
      return this.text.length;
    }
    optimize(context) {
      super.optimize(context), this.text = this.statics.value(this.domNode), this.text.length === 0 ? this.remove() : this.next instanceof _TextBlot2 && this.next.prev === this && (this.insertAt(this.length(), this.next.value()), this.next.remove());
    }
    position(index, _inclusive = false) {
      return [this.domNode, index];
    }
    split(index, force = false) {
      if (!force) {
        if (index === 0)
          return this;
        if (index === this.length())
          return this.next;
      }
      const after = this.scroll.create(this.domNode.splitText(index));
      return this.parent.insertBefore(after, this.next || void 0), this.text = this.statics.value(this.domNode), after;
    }
    update(mutations, _context) {
      mutations.some((mutation) => mutation.type === "characterData" && mutation.target === this.domNode) && (this.text = this.statics.value(this.domNode));
    }
    value() {
      return this.text;
    }
  };
  _TextBlot.blotName = "text", _TextBlot.scope = Scope.INLINE_BLOT;
  var TextBlot = _TextBlot;
  var TextBlot$1 = TextBlot;

  // node_modules/quill/core/quill.js
  var import_quill_delta3 = __toESM(require_Delta(), 1);

  // node_modules/quill/core/editor.js
  var import_quill_delta2 = __toESM(require_Delta(), 1);

  // node_modules/quill/blots/block.js
  var import_quill_delta = __toESM(require_Delta(), 1);

  // node_modules/quill/blots/break.js
  var Break = class extends EmbedBlot$1 {
    static {
      __name(this, "Break");
    }
    static value() {
      return void 0;
    }
    optimize() {
      if (this.prev || this.next) {
        this.remove();
      }
    }
    length() {
      return 0;
    }
    value() {
      return "";
    }
  };
  Break.blotName = "break";
  Break.tagName = "BR";
  var break_default = Break;

  // node_modules/quill/blots/text.js
  var Text2 = class extends TextBlot$1 {
    static {
      __name(this, "Text");
    }
  };
  function escapeText(text) {
    return text.replace(/[&<>"']/g, (s) => {
      const entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      return entityMap[s];
    });
  }
  __name(escapeText, "escapeText");

  // node_modules/quill/blots/inline.js
  var Inline = class _Inline extends InlineBlot$1 {
    static {
      __name(this, "Inline");
    }
    static allowedChildren = [_Inline, break_default, EmbedBlot$1, Text2];
    // Lower index means deeper in the DOM tree, since not found (-1) is for embeds
    static order = [
      "cursor",
      "inline",
      // Must be lower
      "link",
      // Chrome wants <a> to be lower
      "underline",
      "strike",
      "italic",
      "bold",
      "script",
      "code"
      // Must be higher
    ];
    static compare(self2, other) {
      const selfIndex = _Inline.order.indexOf(self2);
      const otherIndex = _Inline.order.indexOf(other);
      if (selfIndex >= 0 || otherIndex >= 0) {
        return selfIndex - otherIndex;
      }
      if (self2 === other) {
        return 0;
      }
      if (self2 < other) {
        return -1;
      }
      return 1;
    }
    formatAt(index, length, name, value) {
      if (_Inline.compare(this.statics.blotName, name) < 0 && this.scroll.query(name, Scope.BLOT)) {
        const blot = this.isolate(index, length);
        if (value) {
          blot.wrap(name, value);
        }
      } else {
        super.formatAt(index, length, name, value);
      }
    }
    optimize(context) {
      super.optimize(context);
      if (this.parent instanceof _Inline && _Inline.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
        const parent = this.parent.isolate(this.offset(), this.length());
        this.moveChildren(parent);
        parent.wrap(this);
      }
    }
  };
  var inline_default = Inline;

  // node_modules/quill/blots/block.js
  var NEWLINE_LENGTH = 1;
  var Block = class extends BlockBlot$1 {
    static {
      __name(this, "Block");
    }
    cache = {};
    delta() {
      if (this.cache.delta == null) {
        this.cache.delta = blockDelta(this);
      }
      return this.cache.delta;
    }
    deleteAt(index, length) {
      super.deleteAt(index, length);
      this.cache = {};
    }
    formatAt(index, length, name, value) {
      if (length <= 0)
        return;
      if (this.scroll.query(name, Scope.BLOCK)) {
        if (index + length === this.length()) {
          this.format(name, value);
        }
      } else {
        super.formatAt(index, Math.min(length, this.length() - index - 1), name, value);
      }
      this.cache = {};
    }
    insertAt(index, value, def) {
      if (def != null) {
        super.insertAt(index, value, def);
        this.cache = {};
        return;
      }
      if (value.length === 0)
        return;
      const lines = value.split("\n");
      const text = lines.shift();
      if (text.length > 0) {
        if (index < this.length() - 1 || this.children.tail == null) {
          super.insertAt(Math.min(index, this.length() - 1), text);
        } else {
          this.children.tail.insertAt(this.children.tail.length(), text);
        }
        this.cache = {};
      }
      let block = this;
      lines.reduce((lineIndex, line) => {
        block = block.split(lineIndex, true);
        block.insertAt(0, line);
        return line.length;
      }, index + text.length);
    }
    insertBefore(blot, ref) {
      const {
        head
      } = this.children;
      super.insertBefore(blot, ref);
      if (head instanceof break_default) {
        head.remove();
      }
      this.cache = {};
    }
    length() {
      if (this.cache.length == null) {
        this.cache.length = super.length() + NEWLINE_LENGTH;
      }
      return this.cache.length;
    }
    moveChildren(target, ref) {
      super.moveChildren(target, ref);
      this.cache = {};
    }
    optimize(context) {
      super.optimize(context);
      this.cache = {};
    }
    path(index) {
      return super.path(index, true);
    }
    removeChild(child) {
      super.removeChild(child);
      this.cache = {};
    }
    split(index) {
      let force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      if (force && (index === 0 || index >= this.length() - NEWLINE_LENGTH)) {
        const clone = this.clone();
        if (index === 0) {
          this.parent.insertBefore(clone, this);
          return this;
        }
        this.parent.insertBefore(clone, this.next);
        return clone;
      }
      const next = super.split(index, force);
      this.cache = {};
      return next;
    }
  };
  Block.blotName = "block";
  Block.tagName = "P";
  Block.defaultChild = break_default;
  Block.allowedChildren = [break_default, inline_default, EmbedBlot$1, Text2];
  var BlockEmbed = class extends EmbedBlot$1 {
    static {
      __name(this, "BlockEmbed");
    }
    attach() {
      super.attach();
      this.attributes = new AttributorStore$1(this.domNode);
    }
    delta() {
      return new import_quill_delta.default().insert(this.value(), {
        ...this.formats(),
        ...this.attributes.values()
      });
    }
    format(name, value) {
      const attribute = this.scroll.query(name, Scope.BLOCK_ATTRIBUTE);
      if (attribute != null) {
        this.attributes.attribute(attribute, value);
      }
    }
    formatAt(index, length, name, value) {
      this.format(name, value);
    }
    insertAt(index, value, def) {
      if (def != null) {
        super.insertAt(index, value, def);
        return;
      }
      const lines = value.split("\n");
      const text = lines.pop();
      const blocks = lines.map((line) => {
        const block = this.scroll.create(Block.blotName);
        block.insertAt(0, line);
        return block;
      });
      const ref = this.split(index);
      blocks.forEach((block) => {
        this.parent.insertBefore(block, ref);
      });
      if (text) {
        this.parent.insertBefore(this.scroll.create("text", text), ref);
      }
    }
  };
  BlockEmbed.scope = Scope.BLOCK_BLOT;
  function blockDelta(blot) {
    let filter = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    return blot.descendants(LeafBlot$1).reduce((delta, leaf) => {
      if (leaf.length() === 0) {
        return delta;
      }
      return delta.insert(leaf.value(), bubbleFormats(leaf, {}, filter));
    }, new import_quill_delta.default()).insert("\n", bubbleFormats(blot));
  }
  __name(blockDelta, "blockDelta");
  function bubbleFormats(blot) {
    let formats = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let filter = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
    if (blot == null)
      return formats;
    if ("formats" in blot && typeof blot.formats === "function") {
      formats = {
        ...formats,
        ...blot.formats()
      };
      if (filter) {
        delete formats["code-token"];
      }
    }
    if (blot.parent == null || blot.parent.statics.blotName === "scroll" || blot.parent.statics.scope !== blot.statics.scope) {
      return formats;
    }
    return bubbleFormats(blot.parent, formats, filter);
  }
  __name(bubbleFormats, "bubbleFormats");

  // node_modules/quill/blots/cursor.js
  var Cursor = class _Cursor extends EmbedBlot$1 {
    static {
      __name(this, "Cursor");
    }
    static blotName = "cursor";
    static className = "ql-cursor";
    static tagName = "span";
    static CONTENTS = "\uFEFF";
    // Zero width no break space
    static value() {
      return void 0;
    }
    constructor(scroll, domNode, selection) {
      super(scroll, domNode);
      this.selection = selection;
      this.textNode = document.createTextNode(_Cursor.CONTENTS);
      this.domNode.appendChild(this.textNode);
      this.savedLength = 0;
    }
    detach() {
      if (this.parent != null)
        this.parent.removeChild(this);
    }
    format(name, value) {
      if (this.savedLength !== 0) {
        super.format(name, value);
        return;
      }
      let target = this;
      let index = 0;
      while (target != null && target.statics.scope !== Scope.BLOCK_BLOT) {
        index += target.offset(target.parent);
        target = target.parent;
      }
      if (target != null) {
        this.savedLength = _Cursor.CONTENTS.length;
        target.optimize();
        target.formatAt(index, _Cursor.CONTENTS.length, name, value);
        this.savedLength = 0;
      }
    }
    index(node, offset) {
      if (node === this.textNode)
        return 0;
      return super.index(node, offset);
    }
    length() {
      return this.savedLength;
    }
    position() {
      return [this.textNode, this.textNode.data.length];
    }
    remove() {
      super.remove();
      this.parent = null;
    }
    restore() {
      if (this.selection.composing || this.parent == null)
        return null;
      const range = this.selection.getNativeRange();
      while (this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode) {
        this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
      }
      const prevTextBlot = this.prev instanceof Text2 ? this.prev : null;
      const prevTextLength = prevTextBlot ? prevTextBlot.length() : 0;
      const nextTextBlot = this.next instanceof Text2 ? this.next : null;
      const nextText = nextTextBlot ? nextTextBlot.text : "";
      const {
        textNode
      } = this;
      const newText = textNode.data.split(_Cursor.CONTENTS).join("");
      textNode.data = _Cursor.CONTENTS;
      let mergedTextBlot;
      if (prevTextBlot) {
        mergedTextBlot = prevTextBlot;
        if (newText || nextTextBlot) {
          prevTextBlot.insertAt(prevTextBlot.length(), newText + nextText);
          if (nextTextBlot) {
            nextTextBlot.remove();
          }
        }
      } else if (nextTextBlot) {
        mergedTextBlot = nextTextBlot;
        nextTextBlot.insertAt(0, newText);
      } else {
        const newTextNode = document.createTextNode(newText);
        mergedTextBlot = this.scroll.create(newTextNode);
        this.parent.insertBefore(mergedTextBlot, this);
      }
      this.remove();
      if (range) {
        const remapOffset = /* @__PURE__ */ __name((node, offset) => {
          if (prevTextBlot && node === prevTextBlot.domNode) {
            return offset;
          }
          if (node === textNode) {
            return prevTextLength + offset - 1;
          }
          if (nextTextBlot && node === nextTextBlot.domNode) {
            return prevTextLength + newText.length + offset;
          }
          return null;
        }, "remapOffset");
        const start = remapOffset(range.start.node, range.start.offset);
        const end = remapOffset(range.end.node, range.end.offset);
        if (start !== null && end !== null) {
          return {
            startNode: mergedTextBlot.domNode,
            startOffset: start,
            endNode: mergedTextBlot.domNode,
            endOffset: end
          };
        }
      }
      return null;
    }
    update(mutations, context) {
      if (mutations.some((mutation) => {
        return mutation.type === "characterData" && mutation.target === this.textNode;
      })) {
        const range = this.restore();
        if (range)
          context.range = range;
      }
    }
    // Avoid .ql-cursor being a descendant of `<a/>`.
    // The reason is Safari pushes down `<a/>` on text insertion.
    // That will cause DOM nodes not sync with the model.
    //
    // For example ({I} is the caret), given the markup:
    //    <a><span class="ql-cursor">\uFEFF{I}</span></a>
    // When typing a char "x", `<a/>` will be pushed down inside the `<span>` first:
    //    <span class="ql-cursor"><a>\uFEFF{I}</a></span>
    // And then "x" will be inserted after `<a/>`:
    //    <span class="ql-cursor"><a>\uFEFF</a>d{I}</span>
    optimize(context) {
      super.optimize(context);
      let {
        parent
      } = this;
      while (parent) {
        if (parent.domNode.tagName === "A") {
          this.savedLength = _Cursor.CONTENTS.length;
          parent.isolate(this.offset(parent), this.length()).unwrap();
          this.savedLength = 0;
          break;
        }
        parent = parent.parent;
      }
    }
    value() {
      return "";
    }
  };
  var cursor_default = Cursor;

  // node_modules/eventemitter3/index.mjs
  var import_index = __toESM(require_eventemitter3(), 1);

  // node_modules/quill/core/instances.js
  var instances_default = /* @__PURE__ */ new WeakMap();

  // node_modules/quill/core/logger.js
  var levels = ["error", "warn", "log", "info"];
  var level = "warn";
  function debug(method) {
    if (level) {
      if (levels.indexOf(method) <= levels.indexOf(level)) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        console[method](...args);
      }
    }
  }
  __name(debug, "debug");
  function namespace(ns) {
    return levels.reduce((logger, method) => {
      logger[method] = debug.bind(console, method, ns);
      return logger;
    }, {});
  }
  __name(namespace, "namespace");
  namespace.level = (newLevel) => {
    level = newLevel;
  };
  debug.level = namespace.level;
  var logger_default = namespace;

  // node_modules/quill/core/emitter.js
  var debug2 = logger_default("quill:events");
  var EVENTS = ["selectionchange", "mousedown", "mouseup", "click"];
  EVENTS.forEach((eventName) => {
    document.addEventListener(eventName, function() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      Array.from(document.querySelectorAll(".ql-container")).forEach((node) => {
        const quill = instances_default.get(node);
        if (quill && quill.emitter) {
          quill.emitter.handleDOM(...args);
        }
      });
    });
  });
  var Emitter = class extends import_index.default {
    static {
      __name(this, "Emitter");
    }
    static events = {
      EDITOR_CHANGE: "editor-change",
      SCROLL_BEFORE_UPDATE: "scroll-before-update",
      SCROLL_BLOT_MOUNT: "scroll-blot-mount",
      SCROLL_BLOT_UNMOUNT: "scroll-blot-unmount",
      SCROLL_OPTIMIZE: "scroll-optimize",
      SCROLL_UPDATE: "scroll-update",
      SCROLL_EMBED_UPDATE: "scroll-embed-update",
      SELECTION_CHANGE: "selection-change",
      TEXT_CHANGE: "text-change",
      COMPOSITION_BEFORE_START: "composition-before-start",
      COMPOSITION_START: "composition-start",
      COMPOSITION_BEFORE_END: "composition-before-end",
      COMPOSITION_END: "composition-end"
    };
    static sources = {
      API: "api",
      SILENT: "silent",
      USER: "user"
    };
    constructor() {
      super();
      this.domListeners = {};
      this.on("error", debug2.error);
    }
    emit() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      debug2.log.call(debug2, ...args);
      return super.emit(...args);
    }
    handleDOM(event) {
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }
      (this.domListeners[event.type] || []).forEach((_ref) => {
        let {
          node,
          handler
        } = _ref;
        if (event.target === node || node.contains(event.target)) {
          handler(event, ...args);
        }
      });
    }
    listenDOM(eventName, node, handler) {
      if (!this.domListeners[eventName]) {
        this.domListeners[eventName] = [];
      }
      this.domListeners[eventName].push({
        node,
        handler
      });
    }
  };
  var emitter_default = Emitter;

  // node_modules/quill/core/selection.js
  var debug3 = logger_default("quill:selection");
  var Range = class {
    static {
      __name(this, "Range");
    }
    constructor(index) {
      let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
      this.index = index;
      this.length = length;
    }
  };
  var Selection = class {
    static {
      __name(this, "Selection");
    }
    constructor(scroll, emitter) {
      this.emitter = emitter;
      this.scroll = scroll;
      this.composing = false;
      this.mouseDown = false;
      this.root = this.scroll.domNode;
      this.cursor = this.scroll.create("cursor", this);
      this.savedRange = new Range(0, 0);
      this.lastRange = this.savedRange;
      this.lastNative = null;
      this.handleComposition();
      this.handleDragging();
      this.emitter.listenDOM("selectionchange", document, () => {
        if (!this.mouseDown && !this.composing) {
          setTimeout(this.update.bind(this, emitter_default.sources.USER), 1);
        }
      });
      this.emitter.on(emitter_default.events.SCROLL_BEFORE_UPDATE, () => {
        if (!this.hasFocus())
          return;
        const native = this.getNativeRange();
        if (native == null)
          return;
        if (native.start.node === this.cursor.textNode)
          return;
        this.emitter.once(emitter_default.events.SCROLL_UPDATE, (source, mutations) => {
          try {
            if (this.root.contains(native.start.node) && this.root.contains(native.end.node)) {
              this.setNativeRange(native.start.node, native.start.offset, native.end.node, native.end.offset);
            }
            const triggeredByTyping = mutations.some((mutation) => mutation.type === "characterData" || mutation.type === "childList" || mutation.type === "attributes" && mutation.target === this.root);
            this.update(triggeredByTyping ? emitter_default.sources.SILENT : source);
          } catch (ignored) {
          }
        });
      });
      this.emitter.on(emitter_default.events.SCROLL_OPTIMIZE, (mutations, context) => {
        if (context.range) {
          const {
            startNode,
            startOffset,
            endNode,
            endOffset
          } = context.range;
          this.setNativeRange(startNode, startOffset, endNode, endOffset);
          this.update(emitter_default.sources.SILENT);
        }
      });
      this.update(emitter_default.sources.SILENT);
    }
    handleComposition() {
      this.emitter.on(emitter_default.events.COMPOSITION_BEFORE_START, () => {
        this.composing = true;
      });
      this.emitter.on(emitter_default.events.COMPOSITION_END, () => {
        this.composing = false;
        if (this.cursor.parent) {
          const range = this.cursor.restore();
          if (!range)
            return;
          setTimeout(() => {
            this.setNativeRange(range.startNode, range.startOffset, range.endNode, range.endOffset);
          }, 1);
        }
      });
    }
    handleDragging() {
      this.emitter.listenDOM("mousedown", document.body, () => {
        this.mouseDown = true;
      });
      this.emitter.listenDOM("mouseup", document.body, () => {
        this.mouseDown = false;
        this.update(emitter_default.sources.USER);
      });
    }
    focus() {
      if (this.hasFocus())
        return;
      this.root.focus({
        preventScroll: true
      });
      this.setRange(this.savedRange);
    }
    format(format, value) {
      this.scroll.update();
      const nativeRange = this.getNativeRange();
      if (nativeRange == null || !nativeRange.native.collapsed || this.scroll.query(format, Scope.BLOCK))
        return;
      if (nativeRange.start.node !== this.cursor.textNode) {
        const blot = this.scroll.find(nativeRange.start.node, false);
        if (blot == null)
          return;
        if (blot instanceof LeafBlot$1) {
          const after = blot.split(nativeRange.start.offset);
          blot.parent.insertBefore(this.cursor, after);
        } else {
          blot.insertBefore(this.cursor, nativeRange.start.node);
        }
        this.cursor.attach();
      }
      this.cursor.format(format, value);
      this.scroll.optimize();
      this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length);
      this.update();
    }
    getBounds(index) {
      let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
      const scrollLength = this.scroll.length();
      index = Math.min(index, scrollLength - 1);
      length = Math.min(index + length, scrollLength - 1) - index;
      let node;
      let [leaf, offset] = this.scroll.leaf(index);
      if (leaf == null)
        return null;
      if (length > 0 && offset === leaf.length()) {
        const [next] = this.scroll.leaf(index + 1);
        if (next) {
          const [line] = this.scroll.line(index);
          const [nextLine] = this.scroll.line(index + 1);
          if (line === nextLine) {
            leaf = next;
            offset = 0;
          }
        }
      }
      [node, offset] = leaf.position(offset, true);
      const range = document.createRange();
      if (length > 0) {
        range.setStart(node, offset);
        [leaf, offset] = this.scroll.leaf(index + length);
        if (leaf == null)
          return null;
        [node, offset] = leaf.position(offset, true);
        range.setEnd(node, offset);
        return range.getBoundingClientRect();
      }
      let side = "left";
      let rect;
      if (node instanceof Text) {
        if (!node.data.length) {
          return null;
        }
        if (offset < node.data.length) {
          range.setStart(node, offset);
          range.setEnd(node, offset + 1);
        } else {
          range.setStart(node, offset - 1);
          range.setEnd(node, offset);
          side = "right";
        }
        rect = range.getBoundingClientRect();
      } else {
        if (!(leaf.domNode instanceof Element))
          return null;
        rect = leaf.domNode.getBoundingClientRect();
        if (offset > 0)
          side = "right";
      }
      return {
        bottom: rect.top + rect.height,
        height: rect.height,
        left: rect[side],
        right: rect[side],
        top: rect.top,
        width: 0
      };
    }
    getNativeRange() {
      const selection = document.getSelection();
      if (selection == null || selection.rangeCount <= 0)
        return null;
      const nativeRange = selection.getRangeAt(0);
      if (nativeRange == null)
        return null;
      const range = this.normalizeNative(nativeRange);
      debug3.info("getNativeRange", range);
      return range;
    }
    getRange() {
      const root2 = this.scroll.domNode;
      if ("isConnected" in root2 && !root2.isConnected) {
        return [null, null];
      }
      const normalized = this.getNativeRange();
      if (normalized == null)
        return [null, null];
      const range = this.normalizedToRange(normalized);
      return [range, normalized];
    }
    hasFocus() {
      return document.activeElement === this.root || document.activeElement != null && contains(this.root, document.activeElement);
    }
    normalizedToRange(range) {
      const positions = [[range.start.node, range.start.offset]];
      if (!range.native.collapsed) {
        positions.push([range.end.node, range.end.offset]);
      }
      const indexes = positions.map((position) => {
        const [node, offset] = position;
        const blot = this.scroll.find(node, true);
        const index = blot.offset(this.scroll);
        if (offset === 0) {
          return index;
        }
        if (blot instanceof LeafBlot$1) {
          return index + blot.index(node, offset);
        }
        return index + blot.length();
      });
      const end = Math.min(Math.max(...indexes), this.scroll.length() - 1);
      const start = Math.min(end, ...indexes);
      return new Range(start, end - start);
    }
    normalizeNative(nativeRange) {
      if (!contains(this.root, nativeRange.startContainer) || !nativeRange.collapsed && !contains(this.root, nativeRange.endContainer)) {
        return null;
      }
      const range = {
        start: {
          node: nativeRange.startContainer,
          offset: nativeRange.startOffset
        },
        end: {
          node: nativeRange.endContainer,
          offset: nativeRange.endOffset
        },
        native: nativeRange
      };
      [range.start, range.end].forEach((position) => {
        let {
          node,
          offset
        } = position;
        while (!(node instanceof Text) && node.childNodes.length > 0) {
          if (node.childNodes.length > offset) {
            node = node.childNodes[offset];
            offset = 0;
          } else if (node.childNodes.length === offset) {
            node = node.lastChild;
            if (node instanceof Text) {
              offset = node.data.length;
            } else if (node.childNodes.length > 0) {
              offset = node.childNodes.length;
            } else {
              offset = node.childNodes.length + 1;
            }
          } else {
            break;
          }
        }
        position.node = node;
        position.offset = offset;
      });
      return range;
    }
    rangeToNative(range) {
      const scrollLength = this.scroll.length();
      const getPosition = /* @__PURE__ */ __name((index, inclusive) => {
        index = Math.min(scrollLength - 1, index);
        const [leaf, leafOffset] = this.scroll.leaf(index);
        return leaf ? leaf.position(leafOffset, inclusive) : [null, -1];
      }, "getPosition");
      return [...getPosition(range.index, false), ...getPosition(range.index + range.length, true)];
    }
    setNativeRange(startNode, startOffset) {
      let endNode = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : startNode;
      let endOffset = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : startOffset;
      let force = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false;
      debug3.info("setNativeRange", startNode, startOffset, endNode, endOffset);
      if (startNode != null && (this.root.parentNode == null || startNode.parentNode == null || // @ts-expect-error Fix me later
      endNode.parentNode == null)) {
        return;
      }
      const selection = document.getSelection();
      if (selection == null)
        return;
      if (startNode != null) {
        if (!this.hasFocus())
          this.root.focus({
            preventScroll: true
          });
        const {
          native
        } = this.getNativeRange() || {};
        if (native == null || force || startNode !== native.startContainer || startOffset !== native.startOffset || endNode !== native.endContainer || endOffset !== native.endOffset) {
          if (startNode instanceof Element && startNode.tagName === "BR") {
            startOffset = Array.from(startNode.parentNode.childNodes).indexOf(startNode);
            startNode = startNode.parentNode;
          }
          if (endNode instanceof Element && endNode.tagName === "BR") {
            endOffset = Array.from(endNode.parentNode.childNodes).indexOf(endNode);
            endNode = endNode.parentNode;
          }
          const range = document.createRange();
          range.setStart(startNode, startOffset);
          range.setEnd(endNode, endOffset);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else {
        selection.removeAllRanges();
        this.root.blur();
      }
    }
    setRange(range) {
      let force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      let source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : emitter_default.sources.API;
      if (typeof force === "string") {
        source = force;
        force = false;
      }
      debug3.info("setRange", range);
      if (range != null) {
        const args = this.rangeToNative(range);
        this.setNativeRange(...args, force);
      } else {
        this.setNativeRange(null);
      }
      this.update(source);
    }
    update() {
      let source = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : emitter_default.sources.USER;
      const oldRange = this.lastRange;
      const [lastRange, nativeRange] = this.getRange();
      this.lastRange = lastRange;
      this.lastNative = nativeRange;
      if (this.lastRange != null) {
        this.savedRange = this.lastRange;
      }
      if (!isEqual_default(oldRange, this.lastRange)) {
        if (!this.composing && nativeRange != null && nativeRange.native.collapsed && nativeRange.start.node !== this.cursor.textNode) {
          const range = this.cursor.restore();
          if (range) {
            this.setNativeRange(range.startNode, range.startOffset, range.endNode, range.endOffset);
          }
        }
        const args = [emitter_default.events.SELECTION_CHANGE, cloneDeep_default(this.lastRange), cloneDeep_default(oldRange), source];
        this.emitter.emit(emitter_default.events.EDITOR_CHANGE, ...args);
        if (source !== emitter_default.sources.SILENT) {
          this.emitter.emit(...args);
        }
      }
    }
  };
  function contains(parent, descendant) {
    try {
      descendant.parentNode;
    } catch (e) {
      return false;
    }
    return parent.contains(descendant);
  }
  __name(contains, "contains");
  var selection_default = Selection;

  // node_modules/quill/core/editor.js
  var ASCII = /^[ -~]*$/;
  var Editor = class {
    static {
      __name(this, "Editor");
    }
    constructor(scroll) {
      this.scroll = scroll;
      this.delta = this.getDelta();
    }
    applyDelta(delta) {
      this.scroll.update();
      let scrollLength = this.scroll.length();
      this.scroll.batchStart();
      const normalizedDelta = normalizeDelta(delta);
      const deleteDelta = new import_quill_delta2.default();
      const normalizedOps = splitOpLines(normalizedDelta.ops.slice());
      normalizedOps.reduce((index, op) => {
        const length = import_quill_delta2.Op.length(op);
        let attributes = op.attributes || {};
        let isImplicitNewlinePrepended = false;
        let isImplicitNewlineAppended = false;
        if (op.insert != null) {
          deleteDelta.retain(length);
          if (typeof op.insert === "string") {
            const text = op.insert;
            isImplicitNewlineAppended = !text.endsWith("\n") && (scrollLength <= index || !!this.scroll.descendant(BlockEmbed, index)[0]);
            this.scroll.insertAt(index, text);
            const [line, offset] = this.scroll.line(index);
            let formats = merge_default({}, bubbleFormats(line));
            if (line instanceof Block) {
              const [leaf] = line.descendant(LeafBlot$1, offset);
              if (leaf) {
                formats = merge_default(formats, bubbleFormats(leaf));
              }
            }
            attributes = import_quill_delta2.AttributeMap.diff(formats, attributes) || {};
          } else if (typeof op.insert === "object") {
            const key = Object.keys(op.insert)[0];
            if (key == null)
              return index;
            const isInlineEmbed = this.scroll.query(key, Scope.INLINE) != null;
            if (isInlineEmbed) {
              if (scrollLength <= index || !!this.scroll.descendant(BlockEmbed, index)[0]) {
                isImplicitNewlineAppended = true;
              }
            } else if (index > 0) {
              const [leaf, offset] = this.scroll.descendant(LeafBlot$1, index - 1);
              if (leaf instanceof Text2) {
                const text = leaf.value();
                if (text[offset] !== "\n") {
                  isImplicitNewlinePrepended = true;
                }
              } else if (leaf instanceof EmbedBlot$1 && leaf.statics.scope === Scope.INLINE_BLOT) {
                isImplicitNewlinePrepended = true;
              }
            }
            this.scroll.insertAt(index, key, op.insert[key]);
            if (isInlineEmbed) {
              const [leaf] = this.scroll.descendant(LeafBlot$1, index);
              if (leaf) {
                const formats = merge_default({}, bubbleFormats(leaf));
                attributes = import_quill_delta2.AttributeMap.diff(formats, attributes) || {};
              }
            }
          }
          scrollLength += length;
        } else {
          deleteDelta.push(op);
          if (op.retain !== null && typeof op.retain === "object") {
            const key = Object.keys(op.retain)[0];
            if (key == null)
              return index;
            this.scroll.updateEmbedAt(index, key, op.retain[key]);
          }
        }
        Object.keys(attributes).forEach((name) => {
          this.scroll.formatAt(index, length, name, attributes[name]);
        });
        const prependedLength = isImplicitNewlinePrepended ? 1 : 0;
        const addedLength = isImplicitNewlineAppended ? 1 : 0;
        scrollLength += prependedLength + addedLength;
        deleteDelta.retain(prependedLength);
        deleteDelta.delete(addedLength);
        return index + length + prependedLength + addedLength;
      }, 0);
      deleteDelta.reduce((index, op) => {
        if (typeof op.delete === "number") {
          this.scroll.deleteAt(index, op.delete);
          return index;
        }
        return index + import_quill_delta2.Op.length(op);
      }, 0);
      this.scroll.batchEnd();
      this.scroll.optimize();
      return this.update(normalizedDelta);
    }
    deleteText(index, length) {
      this.scroll.deleteAt(index, length);
      return this.update(new import_quill_delta2.default().retain(index).delete(length));
    }
    formatLine(index, length) {
      let formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      this.scroll.update();
      Object.keys(formats).forEach((format) => {
        this.scroll.lines(index, Math.max(length, 1)).forEach((line) => {
          line.format(format, formats[format]);
        });
      });
      this.scroll.optimize();
      const delta = new import_quill_delta2.default().retain(index).retain(length, cloneDeep_default(formats));
      return this.update(delta);
    }
    formatText(index, length) {
      let formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      Object.keys(formats).forEach((format) => {
        this.scroll.formatAt(index, length, format, formats[format]);
      });
      const delta = new import_quill_delta2.default().retain(index).retain(length, cloneDeep_default(formats));
      return this.update(delta);
    }
    getContents(index, length) {
      return this.delta.slice(index, index + length);
    }
    getDelta() {
      return this.scroll.lines().reduce((delta, line) => {
        return delta.concat(line.delta());
      }, new import_quill_delta2.default());
    }
    getFormat(index) {
      let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
      let lines = [];
      let leaves = [];
      if (length === 0) {
        this.scroll.path(index).forEach((path) => {
          const [blot] = path;
          if (blot instanceof Block) {
            lines.push(blot);
          } else if (blot instanceof LeafBlot$1) {
            leaves.push(blot);
          }
        });
      } else {
        lines = this.scroll.lines(index, length);
        leaves = this.scroll.descendants(LeafBlot$1, index, length);
      }
      const [lineFormats, leafFormats] = [lines, leaves].map((blots) => {
        const blot = blots.shift();
        if (blot == null)
          return {};
        let formats = bubbleFormats(blot);
        while (Object.keys(formats).length > 0) {
          const blot2 = blots.shift();
          if (blot2 == null)
            return formats;
          formats = combineFormats(bubbleFormats(blot2), formats);
        }
        return formats;
      });
      return {
        ...lineFormats,
        ...leafFormats
      };
    }
    getHTML(index, length) {
      const [line, lineOffset] = this.scroll.line(index);
      if (line) {
        const lineLength = line.length();
        const isWithinLine = line.length() >= lineOffset + length;
        if (isWithinLine && !(lineOffset === 0 && length === lineLength)) {
          return convertHTML(line, lineOffset, length, true);
        }
        return convertHTML(this.scroll, index, length, true);
      }
      return "";
    }
    getText(index, length) {
      return this.getContents(index, length).filter((op) => typeof op.insert === "string").map((op) => op.insert).join("");
    }
    insertContents(index, contents) {
      const normalizedDelta = normalizeDelta(contents);
      const change = new import_quill_delta2.default().retain(index).concat(normalizedDelta);
      this.scroll.insertContents(index, normalizedDelta);
      return this.update(change);
    }
    insertEmbed(index, embed, value) {
      this.scroll.insertAt(index, embed, value);
      return this.update(new import_quill_delta2.default().retain(index).insert({
        [embed]: value
      }));
    }
    insertText(index, text) {
      let formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      this.scroll.insertAt(index, text);
      Object.keys(formats).forEach((format) => {
        this.scroll.formatAt(index, text.length, format, formats[format]);
      });
      return this.update(new import_quill_delta2.default().retain(index).insert(text, cloneDeep_default(formats)));
    }
    isBlank() {
      if (this.scroll.children.length === 0)
        return true;
      if (this.scroll.children.length > 1)
        return false;
      const blot = this.scroll.children.head;
      if (blot?.statics.blotName !== Block.blotName)
        return false;
      const block = blot;
      if (block.children.length > 1)
        return false;
      return block.children.head instanceof break_default;
    }
    removeFormat(index, length) {
      const text = this.getText(index, length);
      const [line, offset] = this.scroll.line(index + length);
      let suffixLength = 0;
      let suffix = new import_quill_delta2.default();
      if (line != null) {
        suffixLength = line.length() - offset;
        suffix = line.delta().slice(offset, offset + suffixLength - 1).insert("\n");
      }
      const contents = this.getContents(index, length + suffixLength);
      const diff = contents.diff(new import_quill_delta2.default().insert(text).concat(suffix));
      const delta = new import_quill_delta2.default().retain(index).concat(diff);
      return this.applyDelta(delta);
    }
    update(change) {
      let mutations = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
      let selectionInfo = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : void 0;
      const oldDelta = this.delta;
      if (mutations.length === 1 && mutations[0].type === "characterData" && // @ts-expect-error Fix me later
      mutations[0].target.data.match(ASCII) && this.scroll.find(mutations[0].target)) {
        const textBlot = this.scroll.find(mutations[0].target);
        const formats = bubbleFormats(textBlot);
        const index = textBlot.offset(this.scroll);
        const oldValue = mutations[0].oldValue.replace(cursor_default.CONTENTS, "");
        const oldText = new import_quill_delta2.default().insert(oldValue);
        const newText = new import_quill_delta2.default().insert(textBlot.value());
        const relativeSelectionInfo = selectionInfo && {
          oldRange: shiftRange(selectionInfo.oldRange, -index),
          newRange: shiftRange(selectionInfo.newRange, -index)
        };
        const diffDelta = new import_quill_delta2.default().retain(index).concat(oldText.diff(newText, relativeSelectionInfo));
        change = diffDelta.reduce((delta, op) => {
          if (op.insert) {
            return delta.insert(op.insert, formats);
          }
          return delta.push(op);
        }, new import_quill_delta2.default());
        this.delta = oldDelta.compose(change);
      } else {
        this.delta = this.getDelta();
        if (!change || !isEqual_default(oldDelta.compose(change), this.delta)) {
          change = oldDelta.diff(this.delta, selectionInfo);
        }
      }
      return change;
    }
  };
  function convertListHTML(items, lastIndent, types) {
    if (items.length === 0) {
      const [endTag2] = getListType(types.pop());
      if (lastIndent <= 0) {
        return `</li></${endTag2}>`;
      }
      return `</li></${endTag2}>${convertListHTML([], lastIndent - 1, types)}`;
    }
    const [{
      child,
      offset,
      length,
      indent,
      type
    }, ...rest] = items;
    const [tag, attribute] = getListType(type);
    if (indent > lastIndent) {
      types.push(type);
      if (indent === lastIndent + 1) {
        return `<${tag}><li${attribute}>${convertHTML(child, offset, length)}${convertListHTML(rest, indent, types)}`;
      }
      return `<${tag}><li>${convertListHTML(items, lastIndent + 1, types)}`;
    }
    const previousType = types[types.length - 1];
    if (indent === lastIndent && type === previousType) {
      return `</li><li${attribute}>${convertHTML(child, offset, length)}${convertListHTML(rest, indent, types)}`;
    }
    const [endTag] = getListType(types.pop());
    return `</li></${endTag}>${convertListHTML(items, lastIndent - 1, types)}`;
  }
  __name(convertListHTML, "convertListHTML");
  function convertHTML(blot, index, length) {
    let isRoot = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
    if ("html" in blot && typeof blot.html === "function") {
      return blot.html(index, length);
    }
    if (blot instanceof Text2) {
      return escapeText(blot.value().slice(index, index + length));
    }
    if (blot instanceof ParentBlot$1) {
      if (blot.statics.blotName === "list-container") {
        const items = [];
        blot.children.forEachAt(index, length, (child, offset, childLength) => {
          const formats = "formats" in child && typeof child.formats === "function" ? child.formats() : {};
          items.push({
            child,
            offset,
            length: childLength,
            indent: formats.indent || 0,
            type: formats.list
          });
        });
        return convertListHTML(items, -1, []);
      }
      const parts = [];
      blot.children.forEachAt(index, length, (child, offset, childLength) => {
        parts.push(convertHTML(child, offset, childLength));
      });
      if (isRoot || blot.statics.blotName === "list") {
        return parts.join("");
      }
      const {
        outerHTML,
        innerHTML
      } = blot.domNode;
      const [start, end] = outerHTML.split(`>${innerHTML}<`);
      if (start === "<table") {
        return `<table style="border: 1px solid #000;">${parts.join("")}<${end}`;
      }
      return `${start}>${parts.join("")}<${end}`;
    }
    return blot.domNode instanceof Element ? blot.domNode.outerHTML : "";
  }
  __name(convertHTML, "convertHTML");
  function combineFormats(formats, combined) {
    return Object.keys(combined).reduce((merged, name) => {
      if (formats[name] == null)
        return merged;
      const combinedValue = combined[name];
      if (combinedValue === formats[name]) {
        merged[name] = combinedValue;
      } else if (Array.isArray(combinedValue)) {
        if (combinedValue.indexOf(formats[name]) < 0) {
          merged[name] = combinedValue.concat([formats[name]]);
        } else {
          merged[name] = combinedValue;
        }
      } else {
        merged[name] = [combinedValue, formats[name]];
      }
      return merged;
    }, {});
  }
  __name(combineFormats, "combineFormats");
  function getListType(type) {
    const tag = type === "ordered" ? "ol" : "ul";
    switch (type) {
      case "checked":
        return [tag, ' data-list="checked"'];
      case "unchecked":
        return [tag, ' data-list="unchecked"'];
      default:
        return [tag, ""];
    }
  }
  __name(getListType, "getListType");
  function normalizeDelta(delta) {
    return delta.reduce((normalizedDelta, op) => {
      if (typeof op.insert === "string") {
        const text = op.insert.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        return normalizedDelta.insert(text, op.attributes);
      }
      return normalizedDelta.push(op);
    }, new import_quill_delta2.default());
  }
  __name(normalizeDelta, "normalizeDelta");
  function shiftRange(_ref, amount) {
    let {
      index,
      length
    } = _ref;
    return new Range(index + amount, length);
  }
  __name(shiftRange, "shiftRange");
  function splitOpLines(ops) {
    const split = [];
    ops.forEach((op) => {
      if (typeof op.insert === "string") {
        const lines = op.insert.split("\n");
        lines.forEach((line, index) => {
          if (index)
            split.push({
              insert: "\n",
              attributes: op.attributes
            });
          if (line)
            split.push({
              insert: line,
              attributes: op.attributes
            });
        });
      } else {
        split.push(op);
      }
    });
    return split;
  }
  __name(splitOpLines, "splitOpLines");
  var editor_default = Editor;

  // node_modules/quill/core/module.js
  var Module = class {
    static {
      __name(this, "Module");
    }
    static DEFAULTS = {};
    constructor(quill) {
      let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      this.quill = quill;
      this.options = options;
    }
  };
  var module_default = Module;

  // node_modules/quill/blots/embed.js
  var GUARD_TEXT = "\uFEFF";
  var Embed = class extends EmbedBlot$1 {
    static {
      __name(this, "Embed");
    }
    constructor(scroll, node) {
      super(scroll, node);
      this.contentNode = document.createElement("span");
      this.contentNode.setAttribute("contenteditable", "false");
      Array.from(this.domNode.childNodes).forEach((childNode) => {
        this.contentNode.appendChild(childNode);
      });
      this.leftGuard = document.createTextNode(GUARD_TEXT);
      this.rightGuard = document.createTextNode(GUARD_TEXT);
      this.domNode.appendChild(this.leftGuard);
      this.domNode.appendChild(this.contentNode);
      this.domNode.appendChild(this.rightGuard);
    }
    index(node, offset) {
      if (node === this.leftGuard)
        return 0;
      if (node === this.rightGuard)
        return 1;
      return super.index(node, offset);
    }
    restore(node) {
      let range = null;
      let textNode;
      const text = node.data.split(GUARD_TEXT).join("");
      if (node === this.leftGuard) {
        if (this.prev instanceof Text2) {
          const prevLength = this.prev.length();
          this.prev.insertAt(prevLength, text);
          range = {
            startNode: this.prev.domNode,
            startOffset: prevLength + text.length
          };
        } else {
          textNode = document.createTextNode(text);
          this.parent.insertBefore(this.scroll.create(textNode), this);
          range = {
            startNode: textNode,
            startOffset: text.length
          };
        }
      } else if (node === this.rightGuard) {
        if (this.next instanceof Text2) {
          this.next.insertAt(0, text);
          range = {
            startNode: this.next.domNode,
            startOffset: text.length
          };
        } else {
          textNode = document.createTextNode(text);
          this.parent.insertBefore(this.scroll.create(textNode), this.next);
          range = {
            startNode: textNode,
            startOffset: text.length
          };
        }
      }
      node.data = GUARD_TEXT;
      return range;
    }
    update(mutations, context) {
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData" && (mutation.target === this.leftGuard || mutation.target === this.rightGuard)) {
          const range = this.restore(mutation.target);
          if (range)
            context.range = range;
        }
      });
    }
  };
  var embed_default = Embed;

  // node_modules/quill/core/composition.js
  var Composition = class {
    static {
      __name(this, "Composition");
    }
    isComposing = false;
    constructor(scroll, emitter) {
      this.scroll = scroll;
      this.emitter = emitter;
      this.setupListeners();
    }
    setupListeners() {
      this.scroll.domNode.addEventListener("compositionstart", (event) => {
        if (!this.isComposing) {
          this.handleCompositionStart(event);
        }
      });
      this.scroll.domNode.addEventListener("compositionend", (event) => {
        if (this.isComposing) {
          queueMicrotask(() => {
            this.handleCompositionEnd(event);
          });
        }
      });
    }
    handleCompositionStart(event) {
      const blot = event.target instanceof Node ? this.scroll.find(event.target, true) : null;
      if (blot && !(blot instanceof embed_default)) {
        this.emitter.emit(emitter_default.events.COMPOSITION_BEFORE_START, event);
        this.scroll.batchStart();
        this.emitter.emit(emitter_default.events.COMPOSITION_START, event);
        this.isComposing = true;
      }
    }
    handleCompositionEnd(event) {
      this.emitter.emit(emitter_default.events.COMPOSITION_BEFORE_END, event);
      this.scroll.batchEnd();
      this.emitter.emit(emitter_default.events.COMPOSITION_END, event);
      this.isComposing = false;
    }
  };
  var composition_default = Composition;

  // node_modules/quill/core/theme.js
  var Theme = class _Theme {
    static {
      __name(this, "Theme");
    }
    static DEFAULTS = {
      modules: {}
    };
    static themes = {
      default: _Theme
    };
    modules = {};
    constructor(quill, options) {
      this.quill = quill;
      this.options = options;
    }
    init() {
      Object.keys(this.options.modules).forEach((name) => {
        if (this.modules[name] == null) {
          this.addModule(name);
        }
      });
    }
    addModule(name) {
      const ModuleClass = this.quill.constructor.import(`modules/${name}`);
      this.modules[name] = new ModuleClass(this.quill, this.options.modules[name] || {});
      return this.modules[name];
    }
  };
  var theme_default = Theme;

  // node_modules/quill/core/utils/scrollRectIntoView.js
  var getParentElement = /* @__PURE__ */ __name((element) => element.parentElement || element.getRootNode().host || null, "getParentElement");
  var getElementRect = /* @__PURE__ */ __name((element) => {
    const rect = element.getBoundingClientRect();
    const scaleX = "offsetWidth" in element && Math.abs(rect.width) / element.offsetWidth || 1;
    const scaleY = "offsetHeight" in element && Math.abs(rect.height) / element.offsetHeight || 1;
    return {
      top: rect.top,
      right: rect.left + element.clientWidth * scaleX,
      bottom: rect.top + element.clientHeight * scaleY,
      left: rect.left
    };
  }, "getElementRect");
  var paddingValueToInt = /* @__PURE__ */ __name((value) => {
    const number = parseInt(value, 10);
    return Number.isNaN(number) ? 0 : number;
  }, "paddingValueToInt");
  var getScrollDistance = /* @__PURE__ */ __name((targetStart, targetEnd, scrollStart, scrollEnd, scrollPaddingStart, scrollPaddingEnd) => {
    if (targetStart < scrollStart && targetEnd > scrollEnd) {
      return 0;
    }
    if (targetStart < scrollStart) {
      return -(scrollStart - targetStart + scrollPaddingStart);
    }
    if (targetEnd > scrollEnd) {
      return targetEnd - targetStart > scrollEnd - scrollStart ? targetStart + scrollPaddingStart - scrollStart : targetEnd - scrollEnd + scrollPaddingEnd;
    }
    return 0;
  }, "getScrollDistance");
  var scrollRectIntoView = /* @__PURE__ */ __name((root2, targetRect) => {
    const document2 = root2.ownerDocument;
    let rect = targetRect;
    let current = root2;
    while (current) {
      const isDocumentBody = current === document2.body;
      const bounding = isDocumentBody ? {
        top: 0,
        right: window.visualViewport?.width ?? document2.documentElement.clientWidth,
        bottom: window.visualViewport?.height ?? document2.documentElement.clientHeight,
        left: 0
      } : getElementRect(current);
      const style = getComputedStyle(current);
      const scrollDistanceX = getScrollDistance(rect.left, rect.right, bounding.left, bounding.right, paddingValueToInt(style.scrollPaddingLeft), paddingValueToInt(style.scrollPaddingRight));
      const scrollDistanceY = getScrollDistance(rect.top, rect.bottom, bounding.top, bounding.bottom, paddingValueToInt(style.scrollPaddingTop), paddingValueToInt(style.scrollPaddingBottom));
      if (scrollDistanceX || scrollDistanceY) {
        if (isDocumentBody) {
          document2.defaultView?.scrollBy(scrollDistanceX, scrollDistanceY);
        } else {
          const {
            scrollLeft,
            scrollTop
          } = current;
          if (scrollDistanceY) {
            current.scrollTop += scrollDistanceY;
          }
          if (scrollDistanceX) {
            current.scrollLeft += scrollDistanceX;
          }
          const scrolledLeft = current.scrollLeft - scrollLeft;
          const scrolledTop = current.scrollTop - scrollTop;
          rect = {
            left: rect.left - scrolledLeft,
            top: rect.top - scrolledTop,
            right: rect.right - scrolledLeft,
            bottom: rect.bottom - scrolledTop
          };
        }
      }
      current = isDocumentBody || style.position === "fixed" ? null : getParentElement(current);
    }
  }, "scrollRectIntoView");
  var scrollRectIntoView_default = scrollRectIntoView;

  // node_modules/quill/core/utils/createRegistryWithFormats.js
  var MAX_REGISTER_ITERATIONS = 100;
  var CORE_FORMATS = ["block", "break", "cursor", "inline", "scroll", "text"];
  var createRegistryWithFormats = /* @__PURE__ */ __name((formats, sourceRegistry, debug8) => {
    const registry = new Registry();
    CORE_FORMATS.forEach((name) => {
      const coreBlot = sourceRegistry.query(name);
      if (coreBlot)
        registry.register(coreBlot);
    });
    formats.forEach((name) => {
      let format = sourceRegistry.query(name);
      if (!format) {
        debug8.error(`Cannot register "${name}" specified in "formats" config. Are you sure it was registered?`);
      }
      let iterations = 0;
      while (format) {
        registry.register(format);
        format = "blotName" in format ? format.requiredContainer ?? null : null;
        iterations += 1;
        if (iterations > MAX_REGISTER_ITERATIONS) {
          debug8.error(`Cycle detected in registering blot requiredContainer: "${name}"`);
          break;
        }
      }
    });
    return registry;
  }, "createRegistryWithFormats");
  var createRegistryWithFormats_default = createRegistryWithFormats;

  // node_modules/quill/core/quill.js
  var debug4 = logger_default("quill");
  var globalRegistry = new Registry();
  ParentBlot$1.uiClass = "ql-ui";
  var Quill = class _Quill {
    static {
      __name(this, "Quill");
    }
    static DEFAULTS = {
      bounds: null,
      modules: {
        clipboard: true,
        keyboard: true,
        history: true,
        uploader: true
      },
      placeholder: "",
      readOnly: false,
      registry: globalRegistry,
      theme: "default"
    };
    static events = emitter_default.events;
    static sources = emitter_default.sources;
    static version = false ? "dev" : "2.0.0";
    static imports = {
      delta: import_quill_delta3.default,
      parchment: parchment_exports,
      "core/module": module_default,
      "core/theme": theme_default
    };
    static debug(limit) {
      if (limit === true) {
        limit = "log";
      }
      logger_default.level(limit);
    }
    static find(node) {
      let bubble = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      return instances_default.get(node) || globalRegistry.find(node, bubble);
    }
    static import(name) {
      if (this.imports[name] == null) {
        debug4.error(`Cannot import ${name}. Are you sure it was registered?`);
      }
      return this.imports[name];
    }
    static register(path, target) {
      let overwrite = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      if (typeof path !== "string") {
        const name = "attrName" in path ? path.attrName : path.blotName;
        if (typeof name === "string") {
          this.register(`formats/${name}`, path, target);
        } else {
          Object.keys(path).forEach((key) => {
            this.register(key, path[key], target);
          });
        }
      } else {
        if (this.imports[path] != null && !overwrite) {
          debug4.warn(`Overwriting ${path} with`, target);
        }
        this.imports[path] = target;
        if ((path.startsWith("blots/") || path.startsWith("formats/")) && target && typeof target !== "boolean" && // @ts-expect-error
        target.blotName !== "abstract") {
          globalRegistry.register(target);
        }
        if (typeof target.register === "function") {
          target.register(globalRegistry);
        }
      }
    }
    constructor(container) {
      let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      this.options = expandConfig(container, options);
      this.container = this.options.container;
      if (this.container == null) {
        debug4.error("Invalid Quill container", container);
        return;
      }
      if (this.options.debug) {
        _Quill.debug(this.options.debug);
      }
      const html = this.container.innerHTML.trim();
      this.container.classList.add("ql-container");
      this.container.innerHTML = "";
      instances_default.set(this.container, this);
      this.root = this.addContainer("ql-editor");
      this.root.classList.add("ql-blank");
      this.emitter = new emitter_default();
      const scrollBlotName = ScrollBlot$1.blotName;
      const ScrollBlot2 = this.options.registry.query(scrollBlotName);
      if (!ScrollBlot2 || !("blotName" in ScrollBlot2)) {
        throw new Error(`Cannot initialize Quill without "${scrollBlotName}" blot`);
      }
      this.scroll = new ScrollBlot2(this.options.registry, this.root, {
        emitter: this.emitter
      });
      this.editor = new editor_default(this.scroll);
      this.selection = new selection_default(this.scroll, this.emitter);
      this.composition = new composition_default(this.scroll, this.emitter);
      this.theme = new this.options.theme(this, this.options);
      this.keyboard = this.theme.addModule("keyboard");
      this.clipboard = this.theme.addModule("clipboard");
      this.history = this.theme.addModule("history");
      this.uploader = this.theme.addModule("uploader");
      this.theme.addModule("input");
      this.theme.addModule("uiNode");
      this.theme.init();
      this.emitter.on(emitter_default.events.EDITOR_CHANGE, (type) => {
        if (type === emitter_default.events.TEXT_CHANGE) {
          this.root.classList.toggle("ql-blank", this.editor.isBlank());
        }
      });
      this.emitter.on(emitter_default.events.SCROLL_UPDATE, (source, mutations) => {
        const oldRange = this.selection.lastRange;
        const [newRange] = this.selection.getRange();
        const selectionInfo = oldRange && newRange ? {
          oldRange,
          newRange
        } : void 0;
        modify.call(this, () => this.editor.update(null, mutations, selectionInfo), source);
      });
      this.emitter.on(emitter_default.events.SCROLL_EMBED_UPDATE, (blot, delta) => {
        const oldRange = this.selection.lastRange;
        const [newRange] = this.selection.getRange();
        const selectionInfo = oldRange && newRange ? {
          oldRange,
          newRange
        } : void 0;
        modify.call(this, () => {
          const change = new import_quill_delta3.default().retain(blot.offset(this)).retain({
            [blot.statics.blotName]: delta
          });
          return this.editor.update(change, [], selectionInfo);
        }, _Quill.sources.USER);
      });
      if (html) {
        const contents = this.clipboard.convert({
          html: `${html}<p><br></p>`,
          text: "\n"
        });
        this.setContents(contents);
      }
      this.history.clear();
      if (this.options.placeholder) {
        this.root.setAttribute("data-placeholder", this.options.placeholder);
      }
      if (this.options.readOnly) {
        this.disable();
      }
      this.allowReadOnlyEdits = false;
    }
    addContainer(container) {
      let refNode = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
      if (typeof container === "string") {
        const className = container;
        container = document.createElement("div");
        container.classList.add(className);
      }
      this.container.insertBefore(container, refNode);
      return container;
    }
    blur() {
      this.selection.setRange(null);
    }
    deleteText(index, length, source) {
      [index, length, , source] = overload(index, length, source);
      return modify.call(this, () => {
        return this.editor.deleteText(index, length);
      }, source, index, -1 * length);
    }
    disable() {
      this.enable(false);
    }
    editReadOnly(modifier) {
      this.allowReadOnlyEdits = true;
      const value = modifier();
      this.allowReadOnlyEdits = false;
      return value;
    }
    enable() {
      let enabled = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
      this.scroll.enable(enabled);
      this.container.classList.toggle("ql-disabled", !enabled);
    }
    focus() {
      let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      this.selection.focus();
      if (!options.preventScroll) {
        this.scrollSelectionIntoView();
      }
    }
    format(name, value) {
      let source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : emitter_default.sources.API;
      return modify.call(this, () => {
        const range = this.getSelection(true);
        let change = new import_quill_delta3.default();
        if (range == null)
          return change;
        if (this.scroll.query(name, Scope.BLOCK)) {
          change = this.editor.formatLine(range.index, range.length, {
            [name]: value
          });
        } else if (range.length === 0) {
          this.selection.format(name, value);
          return change;
        } else {
          change = this.editor.formatText(range.index, range.length, {
            [name]: value
          });
        }
        this.setSelection(range, emitter_default.sources.SILENT);
        return change;
      }, source);
    }
    formatLine(index, length, name, value, source) {
      let formats;
      [index, length, formats, source] = overload(
        index,
        length,
        // @ts-expect-error
        name,
        value,
        source
      );
      return modify.call(this, () => {
        return this.editor.formatLine(index, length, formats);
      }, source, index, 0);
    }
    formatText(index, length, name, value, source) {
      let formats;
      [index, length, formats, source] = overload(
        // @ts-expect-error
        index,
        length,
        name,
        value,
        source
      );
      return modify.call(this, () => {
        return this.editor.formatText(index, length, formats);
      }, source, index, 0);
    }
    getBounds(index) {
      let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
      let bounds = null;
      if (typeof index === "number") {
        bounds = this.selection.getBounds(index, length);
      } else {
        bounds = this.selection.getBounds(index.index, index.length);
      }
      if (!bounds)
        return null;
      const containerBounds = this.container.getBoundingClientRect();
      return {
        bottom: bounds.bottom - containerBounds.top,
        height: bounds.height,
        left: bounds.left - containerBounds.left,
        right: bounds.right - containerBounds.left,
        top: bounds.top - containerBounds.top,
        width: bounds.width
      };
    }
    getContents() {
      let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
      let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.getLength() - index;
      [index, length] = overload(index, length);
      return this.editor.getContents(index, length);
    }
    getFormat() {
      let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.getSelection(true);
      let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
      if (typeof index === "number") {
        return this.editor.getFormat(index, length);
      }
      return this.editor.getFormat(index.index, index.length);
    }
    getIndex(blot) {
      return blot.offset(this.scroll);
    }
    getLength() {
      return this.scroll.length();
    }
    getLeaf(index) {
      return this.scroll.leaf(index);
    }
    getLine(index) {
      return this.scroll.line(index);
    }
    getLines() {
      let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
      let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
      if (typeof index !== "number") {
        return this.scroll.lines(index.index, index.length);
      }
      return this.scroll.lines(index, length);
    }
    getModule(name) {
      return this.theme.modules[name];
    }
    getSelection() {
      let focus = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      if (focus)
        this.focus();
      this.update();
      return this.selection.getRange()[0];
    }
    getSemanticHTML() {
      let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
      let length = arguments.length > 1 ? arguments[1] : void 0;
      if (typeof index === "number") {
        length = length ?? this.getLength() - index;
      }
      [index, length] = overload(index, length);
      return this.editor.getHTML(index, length);
    }
    getText() {
      let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
      let length = arguments.length > 1 ? arguments[1] : void 0;
      if (typeof index === "number") {
        length = length ?? this.getLength() - index;
      }
      [index, length] = overload(index, length);
      return this.editor.getText(index, length);
    }
    hasFocus() {
      return this.selection.hasFocus();
    }
    insertEmbed(index, embed, value) {
      let source = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : _Quill.sources.API;
      return modify.call(this, () => {
        return this.editor.insertEmbed(index, embed, value);
      }, source, index);
    }
    insertText(index, text, name, value, source) {
      let formats;
      [index, , formats, source] = overload(index, 0, name, value, source);
      return modify.call(this, () => {
        return this.editor.insertText(index, text, formats);
      }, source, index, text.length);
    }
    isEnabled() {
      return this.scroll.isEnabled();
    }
    off() {
      return this.emitter.off(...arguments);
    }
    on() {
      return this.emitter.on(...arguments);
    }
    once() {
      return this.emitter.once(...arguments);
    }
    removeFormat(index, length, source) {
      [index, length, , source] = overload(index, length, source);
      return modify.call(this, () => {
        return this.editor.removeFormat(index, length);
      }, source, index);
    }
    scrollRectIntoView(rect) {
      scrollRectIntoView_default(this.root, rect);
    }
    /**
     * @deprecated Use Quill#scrollSelectionIntoView() instead.
     */
    scrollIntoView() {
      console.warn("Quill#scrollIntoView() has been deprecated and will be removed in the near future. Please use Quill#scrollSelectionIntoView() instead.");
      this.scrollSelectionIntoView();
    }
    /**
     * Scroll the current selection into the visible area.
     * If the selection is already visible, no scrolling will occur.
     */
    scrollSelectionIntoView() {
      const range = this.selection.lastRange;
      const bounds = range && this.selection.getBounds(range.index, range.length);
      if (bounds) {
        this.scrollRectIntoView(bounds);
      }
    }
    setContents(delta) {
      let source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : emitter_default.sources.API;
      return modify.call(this, () => {
        delta = new import_quill_delta3.default(delta);
        const length = this.getLength();
        const delete1 = this.editor.deleteText(0, length);
        const applied = this.editor.insertContents(0, delta);
        const delete2 = this.editor.deleteText(this.getLength() - 1, 1);
        return delete1.compose(applied).compose(delete2);
      }, source);
    }
    setSelection(index, length, source) {
      if (index == null) {
        this.selection.setRange(null, length || _Quill.sources.API);
      } else {
        [index, length, , source] = overload(index, length, source);
        this.selection.setRange(new Range(Math.max(0, index), length), source);
        if (source !== emitter_default.sources.SILENT) {
          this.scrollSelectionIntoView();
        }
      }
    }
    setText(text) {
      let source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : emitter_default.sources.API;
      const delta = new import_quill_delta3.default().insert(text);
      return this.setContents(delta, source);
    }
    update() {
      let source = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : emitter_default.sources.USER;
      const change = this.scroll.update(source);
      this.selection.update(source);
      return change;
    }
    updateContents(delta) {
      let source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : emitter_default.sources.API;
      return modify.call(this, () => {
        delta = new import_quill_delta3.default(delta);
        return this.editor.applyDelta(delta);
      }, source, true);
    }
  };
  function resolveSelector(selector) {
    return typeof selector === "string" ? document.querySelector(selector) : selector;
  }
  __name(resolveSelector, "resolveSelector");
  function expandModuleConfig(config4) {
    return Object.entries(config4 ?? {}).reduce((expanded, _ref) => {
      let [key, value] = _ref;
      return {
        ...expanded,
        [key]: value === true ? {} : value
      };
    }, {});
  }
  __name(expandModuleConfig, "expandModuleConfig");
  function omitUndefinedValuesFromOptions(obj) {
    return Object.fromEntries(Object.entries(obj).filter((entry) => entry[1] !== void 0));
  }
  __name(omitUndefinedValuesFromOptions, "omitUndefinedValuesFromOptions");
  function expandConfig(containerOrSelector, options) {
    const container = resolveSelector(containerOrSelector);
    if (!container) {
      throw new Error("Invalid Quill container");
    }
    const shouldUseDefaultTheme = !options.theme || options.theme === Quill.DEFAULTS.theme;
    const theme = shouldUseDefaultTheme ? theme_default : Quill.import(`themes/${options.theme}`);
    if (!theme) {
      throw new Error(`Invalid theme ${options.theme}. Did you register it?`);
    }
    const {
      modules: quillModuleDefaults,
      ...quillDefaults
    } = Quill.DEFAULTS;
    const {
      modules: themeModuleDefaults,
      ...themeDefaults
    } = theme.DEFAULTS;
    const modules = merge_default({}, expandModuleConfig(quillModuleDefaults), expandModuleConfig(themeModuleDefaults), expandModuleConfig(options.modules));
    if (modules != null && modules.toolbar && modules.toolbar.constructor !== Object) {
      modules.toolbar = {
        container: modules.toolbar
      };
    }
    const config4 = {
      ...quillDefaults,
      ...omitUndefinedValuesFromOptions(themeDefaults),
      ...omitUndefinedValuesFromOptions(options)
    };
    let registry = options.registry;
    if (registry) {
      if (options.formats) {
        debug4.warn('Ignoring "formats" option because "registry" is specified');
      }
    } else {
      registry = options.formats ? createRegistryWithFormats_default(options.formats, config4.registry, debug4) : config4.registry;
    }
    return {
      ...config4,
      registry,
      container,
      theme,
      modules: Object.entries(modules).reduce((modulesWithDefaults, _ref2) => {
        let [name, value] = _ref2;
        if (!value)
          return modulesWithDefaults;
        const moduleClass = Quill.import(`modules/${name}`);
        if (moduleClass == null) {
          debug4.error(`Cannot load ${name} module. Are you sure you registered it?`);
          return modulesWithDefaults;
        }
        return {
          ...modulesWithDefaults,
          // @ts-expect-error
          [name]: merge_default({}, moduleClass.DEFAULTS || {}, value)
        };
      }, {}),
      bounds: resolveSelector(config4.bounds)
    };
  }
  __name(expandConfig, "expandConfig");
  function modify(modifier, source, index, shift) {
    if (!this.isEnabled() && source === emitter_default.sources.USER && !this.allowReadOnlyEdits) {
      return new import_quill_delta3.default();
    }
    let range = index == null ? null : this.getSelection();
    const oldDelta = this.editor.delta;
    const change = modifier();
    if (range != null) {
      if (index === true) {
        index = range.index;
      }
      if (shift == null) {
        range = shiftRange2(range, change, source);
      } else if (shift !== 0) {
        range = shiftRange2(range, index, shift, source);
      }
      this.setSelection(range, emitter_default.sources.SILENT);
    }
    if (change.length() > 0) {
      const args = [emitter_default.events.TEXT_CHANGE, change, oldDelta, source];
      this.emitter.emit(emitter_default.events.EDITOR_CHANGE, ...args);
      if (source !== emitter_default.sources.SILENT) {
        this.emitter.emit(...args);
      }
    }
    return change;
  }
  __name(modify, "modify");
  function overload(index, length, name, value, source) {
    let formats = {};
    if (typeof index.index === "number" && typeof index.length === "number") {
      if (typeof length !== "number") {
        source = value;
        value = name;
        name = length;
        length = index.length;
        index = index.index;
      } else {
        length = index.length;
        index = index.index;
      }
    } else if (typeof length !== "number") {
      source = value;
      value = name;
      name = length;
      length = 0;
    }
    if (typeof name === "object") {
      formats = name;
      source = value;
    } else if (typeof name === "string") {
      if (value != null) {
        formats[name] = value;
      } else {
        source = name;
      }
    }
    source = source || emitter_default.sources.API;
    return [index, length, formats, source];
  }
  __name(overload, "overload");
  function shiftRange2(range, index, lengthOrSource, source) {
    const length = typeof lengthOrSource === "number" ? lengthOrSource : 0;
    if (range == null)
      return null;
    let start;
    let end;
    if (index && typeof index.transformPosition === "function") {
      [start, end] = [range.index, range.index + range.length].map((pos) => (
        // @ts-expect-error -- TODO: add a better type guard around `index`
        index.transformPosition(pos, source !== emitter_default.sources.USER)
      ));
    } else {
      [start, end] = [range.index, range.index + range.length].map((pos) => {
        if (pos < index || pos === index && source === emitter_default.sources.USER)
          return pos;
        if (length >= 0) {
          return pos + length;
        }
        return Math.max(index, pos + length);
      });
    }
    return new Range(start, end - start);
  }
  __name(shiftRange2, "shiftRange");

  // node_modules/quill/blots/container.js
  var Container = class extends ContainerBlot$1 {
    static {
      __name(this, "Container");
    }
  };
  var container_default = Container;

  // node_modules/quill/blots/scroll.js
  var import_quill_delta4 = __toESM(require_Delta(), 1);
  function isLine(blot) {
    return blot instanceof Block || blot instanceof BlockEmbed;
  }
  __name(isLine, "isLine");
  function isUpdatable(blot) {
    return typeof blot.updateContent === "function";
  }
  __name(isUpdatable, "isUpdatable");
  var Scroll = class extends ScrollBlot$1 {
    static {
      __name(this, "Scroll");
    }
    static blotName = "scroll";
    static className = "ql-editor";
    static tagName = "DIV";
    static defaultChild = Block;
    static allowedChildren = [Block, BlockEmbed, container_default];
    constructor(registry, domNode, _ref) {
      let {
        emitter
      } = _ref;
      super(registry, domNode);
      this.emitter = emitter;
      this.batch = false;
      this.optimize();
      this.enable();
      this.domNode.addEventListener("dragstart", (e) => this.handleDragStart(e));
    }
    batchStart() {
      if (!Array.isArray(this.batch)) {
        this.batch = [];
      }
    }
    batchEnd() {
      if (!this.batch)
        return;
      const mutations = this.batch;
      this.batch = false;
      this.update(mutations);
    }
    emitMount(blot) {
      this.emitter.emit(emitter_default.events.SCROLL_BLOT_MOUNT, blot);
    }
    emitUnmount(blot) {
      this.emitter.emit(emitter_default.events.SCROLL_BLOT_UNMOUNT, blot);
    }
    emitEmbedUpdate(blot, change) {
      this.emitter.emit(emitter_default.events.SCROLL_EMBED_UPDATE, blot, change);
    }
    deleteAt(index, length) {
      const [first, offset] = this.line(index);
      const [last] = this.line(index + length);
      super.deleteAt(index, length);
      if (last != null && first !== last && offset > 0) {
        if (first instanceof BlockEmbed || last instanceof BlockEmbed) {
          this.optimize();
          return;
        }
        const ref = last.children.head instanceof break_default ? null : last.children.head;
        first.moveChildren(last, ref);
        first.remove();
      }
      this.optimize();
    }
    enable() {
      let enabled = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
      this.domNode.setAttribute("contenteditable", enabled ? "true" : "false");
    }
    formatAt(index, length, format, value) {
      super.formatAt(index, length, format, value);
      this.optimize();
    }
    insertAt(index, value, def) {
      if (index >= this.length()) {
        if (def == null || this.scroll.query(value, Scope.BLOCK) == null) {
          const blot = this.scroll.create(this.statics.defaultChild.blotName);
          this.appendChild(blot);
          if (def == null && value.endsWith("\n")) {
            blot.insertAt(0, value.slice(0, -1), def);
          } else {
            blot.insertAt(0, value, def);
          }
        } else {
          const embed = this.scroll.create(value, def);
          this.appendChild(embed);
        }
      } else {
        super.insertAt(index, value, def);
      }
      this.optimize();
    }
    insertBefore(blot, ref) {
      if (blot.statics.scope === Scope.INLINE_BLOT) {
        const wrapper = this.scroll.create(this.statics.defaultChild.blotName);
        wrapper.appendChild(blot);
        super.insertBefore(wrapper, ref);
      } else {
        super.insertBefore(blot, ref);
      }
    }
    insertContents(index, delta) {
      const renderBlocks = this.deltaToRenderBlocks(delta.concat(new import_quill_delta4.default().insert("\n")));
      const last = renderBlocks.pop();
      if (last == null)
        return;
      this.batchStart();
      const first = renderBlocks.shift();
      if (first) {
        const shouldInsertNewlineChar = first.type === "block" && (first.delta.length() === 0 || !this.descendant(BlockEmbed, index)[0] && index < this.length());
        const delta2 = first.type === "block" ? first.delta : new import_quill_delta4.default().insert({
          [first.key]: first.value
        });
        insertInlineContents(this, index, delta2);
        const newlineCharLength = first.type === "block" ? 1 : 0;
        const lineEndIndex = index + delta2.length() + newlineCharLength;
        if (shouldInsertNewlineChar) {
          this.insertAt(lineEndIndex - 1, "\n");
        }
        const formats = bubbleFormats(this.line(index)[0]);
        const attributes = import_quill_delta4.AttributeMap.diff(formats, first.attributes) || {};
        Object.keys(attributes).forEach((name) => {
          this.formatAt(lineEndIndex - 1, 1, name, attributes[name]);
        });
        index = lineEndIndex;
      }
      let [refBlot, refBlotOffset] = this.children.find(index);
      if (renderBlocks.length) {
        if (refBlot) {
          refBlot = refBlot.split(refBlotOffset);
          refBlotOffset = 0;
        }
        renderBlocks.forEach((renderBlock) => {
          if (renderBlock.type === "block") {
            const block = this.createBlock(renderBlock.attributes, refBlot || void 0);
            insertInlineContents(block, 0, renderBlock.delta);
          } else {
            const blockEmbed = this.create(renderBlock.key, renderBlock.value);
            this.insertBefore(blockEmbed, refBlot || void 0);
            Object.keys(renderBlock.attributes).forEach((name) => {
              blockEmbed.format(name, renderBlock.attributes[name]);
            });
          }
        });
      }
      if (last.type === "block" && last.delta.length()) {
        const offset = refBlot ? refBlot.offset(refBlot.scroll) + refBlotOffset : this.length();
        insertInlineContents(this, offset, last.delta);
      }
      this.batchEnd();
      this.optimize();
    }
    isEnabled() {
      return this.domNode.getAttribute("contenteditable") === "true";
    }
    leaf(index) {
      const last = this.path(index).pop();
      if (!last) {
        return [null, -1];
      }
      const [blot, offset] = last;
      return blot instanceof LeafBlot$1 ? [blot, offset] : [null, -1];
    }
    line(index) {
      if (index === this.length()) {
        return this.line(index - 1);
      }
      return this.descendant(isLine, index);
    }
    lines() {
      let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
      let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
      const getLines = /* @__PURE__ */ __name((blot, blotIndex, blotLength) => {
        let lines = [];
        let lengthLeft = blotLength;
        blot.children.forEachAt(blotIndex, blotLength, (child, childIndex, childLength) => {
          if (isLine(child)) {
            lines.push(child);
          } else if (child instanceof ContainerBlot$1) {
            lines = lines.concat(getLines(child, childIndex, lengthLeft));
          }
          lengthLeft -= childLength;
        });
        return lines;
      }, "getLines");
      return getLines(this, index, length);
    }
    optimize() {
      let mutations = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      let context = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      if (this.batch)
        return;
      super.optimize(mutations, context);
      if (mutations.length > 0) {
        this.emitter.emit(emitter_default.events.SCROLL_OPTIMIZE, mutations, context);
      }
    }
    path(index) {
      return super.path(index).slice(1);
    }
    remove() {
    }
    update(mutations) {
      if (this.batch) {
        if (Array.isArray(mutations)) {
          this.batch = this.batch.concat(mutations);
        }
        return;
      }
      let source = emitter_default.sources.USER;
      if (typeof mutations === "string") {
        source = mutations;
      }
      if (!Array.isArray(mutations)) {
        mutations = this.observer.takeRecords();
      }
      mutations = mutations.filter((_ref2) => {
        let {
          target
        } = _ref2;
        const blot = this.find(target, true);
        return blot && !isUpdatable(blot);
      });
      if (mutations.length > 0) {
        this.emitter.emit(emitter_default.events.SCROLL_BEFORE_UPDATE, source, mutations);
      }
      super.update(mutations.concat([]));
      if (mutations.length > 0) {
        this.emitter.emit(emitter_default.events.SCROLL_UPDATE, source, mutations);
      }
    }
    updateEmbedAt(index, key, change) {
      const [blot] = this.descendant((b) => b instanceof BlockEmbed, index);
      if (blot && blot.statics.blotName === key && isUpdatable(blot)) {
        blot.updateContent(change);
      }
    }
    handleDragStart(event) {
      event.preventDefault();
    }
    deltaToRenderBlocks(delta) {
      const renderBlocks = [];
      let currentBlockDelta = new import_quill_delta4.default();
      delta.forEach((op) => {
        const insert = op?.insert;
        if (!insert)
          return;
        if (typeof insert === "string") {
          const splitted = insert.split("\n");
          splitted.slice(0, -1).forEach((text) => {
            currentBlockDelta.insert(text, op.attributes);
            renderBlocks.push({
              type: "block",
              delta: currentBlockDelta,
              attributes: op.attributes ?? {}
            });
            currentBlockDelta = new import_quill_delta4.default();
          });
          const last = splitted[splitted.length - 1];
          if (last) {
            currentBlockDelta.insert(last, op.attributes);
          }
        } else {
          const key = Object.keys(insert)[0];
          if (!key)
            return;
          if (this.query(key, Scope.INLINE)) {
            currentBlockDelta.push(op);
          } else {
            if (currentBlockDelta.length()) {
              renderBlocks.push({
                type: "block",
                delta: currentBlockDelta,
                attributes: {}
              });
            }
            currentBlockDelta = new import_quill_delta4.default();
            renderBlocks.push({
              type: "blockEmbed",
              key,
              value: insert[key],
              attributes: op.attributes ?? {}
            });
          }
        }
      });
      if (currentBlockDelta.length()) {
        renderBlocks.push({
          type: "block",
          delta: currentBlockDelta,
          attributes: {}
        });
      }
      return renderBlocks;
    }
    createBlock(attributes, refBlot) {
      let blotName;
      const formats = {};
      Object.entries(attributes).forEach((_ref3) => {
        let [key, value] = _ref3;
        const isBlockBlot = this.query(key, Scope.BLOCK & Scope.BLOT) != null;
        if (isBlockBlot) {
          blotName = key;
        } else {
          formats[key] = value;
        }
      });
      const block = this.create(blotName || this.statics.defaultChild.blotName, blotName ? attributes[blotName] : void 0);
      this.insertBefore(block, refBlot || void 0);
      const length = block.length();
      Object.entries(formats).forEach((_ref4) => {
        let [key, value] = _ref4;
        block.formatAt(0, length, key, value);
      });
      return block;
    }
  };
  function insertInlineContents(parent, index, inlineContents) {
    inlineContents.reduce((index2, op) => {
      const length = import_quill_delta4.Op.length(op);
      let attributes = op.attributes || {};
      if (op.insert != null) {
        if (typeof op.insert === "string") {
          const text = op.insert;
          parent.insertAt(index2, text);
          const [leaf] = parent.descendant(LeafBlot$1, index2);
          const formats = bubbleFormats(leaf);
          attributes = import_quill_delta4.AttributeMap.diff(formats, attributes) || {};
        } else if (typeof op.insert === "object") {
          const key = Object.keys(op.insert)[0];
          if (key == null)
            return index2;
          parent.insertAt(index2, key, op.insert[key]);
          const isInlineEmbed = parent.scroll.query(key, Scope.INLINE) != null;
          if (isInlineEmbed) {
            const [leaf] = parent.descendant(LeafBlot$1, index2);
            const formats = bubbleFormats(leaf);
            attributes = import_quill_delta4.AttributeMap.diff(formats, attributes) || {};
          }
        }
      }
      Object.keys(attributes).forEach((key) => {
        parent.formatAt(index2, length, key, attributes[key]);
      });
      return index2 + length;
    }, index);
  }
  __name(insertInlineContents, "insertInlineContents");
  var scroll_default = Scroll;

  // node_modules/quill/modules/clipboard.js
  var import_quill_delta6 = __toESM(require_Delta(), 1);

  // node_modules/quill/formats/align.js
  var config = {
    scope: Scope.BLOCK,
    whitelist: ["right", "center", "justify"]
  };
  var AlignAttribute = new Attributor("align", "align", config);
  var AlignClass = new ClassAttributor$1("align", "ql-align", config);
  var AlignStyle = new StyleAttributor$1("align", "text-align", config);

  // node_modules/quill/formats/color.js
  var ColorAttributor = class extends StyleAttributor$1 {
    static {
      __name(this, "ColorAttributor");
    }
    value(domNode) {
      let value = super.value(domNode);
      if (!value.startsWith("rgb("))
        return value;
      value = value.replace(/^[^\d]+/, "").replace(/[^\d]+$/, "");
      const hex = value.split(",").map((component) => `00${parseInt(component, 10).toString(16)}`.slice(-2)).join("");
      return `#${hex}`;
    }
  };
  var ColorClass = new ClassAttributor$1("color", "ql-color", {
    scope: Scope.INLINE
  });
  var ColorStyle = new ColorAttributor("color", "color", {
    scope: Scope.INLINE
  });

  // node_modules/quill/formats/background.js
  var BackgroundClass = new ClassAttributor$1("background", "ql-bg", {
    scope: Scope.INLINE
  });
  var BackgroundStyle = new ColorAttributor("background", "background-color", {
    scope: Scope.INLINE
  });

  // node_modules/quill/formats/code.js
  var CodeBlockContainer = class extends container_default {
    static {
      __name(this, "CodeBlockContainer");
    }
    static create(value) {
      const domNode = super.create(value);
      domNode.setAttribute("spellcheck", "false");
      return domNode;
    }
    code(index, length) {
      return this.children.map((child) => child.length() <= 1 ? "" : child.domNode.innerText).join("\n").slice(index, index + length);
    }
    html(index, length) {
      return `<pre>
${escapeText(this.code(index, length))}
</pre>`;
    }
  };
  var CodeBlock = class extends Block {
    static {
      __name(this, "CodeBlock");
    }
    static TAB = "  ";
    static register() {
      Quill.register(CodeBlockContainer);
    }
  };
  var Code = class extends inline_default {
    static {
      __name(this, "Code");
    }
  };
  Code.blotName = "code";
  Code.tagName = "CODE";
  CodeBlock.blotName = "code-block";
  CodeBlock.className = "ql-code-block";
  CodeBlock.tagName = "DIV";
  CodeBlockContainer.blotName = "code-block-container";
  CodeBlockContainer.className = "ql-code-block-container";
  CodeBlockContainer.tagName = "DIV";
  CodeBlockContainer.allowedChildren = [CodeBlock];
  CodeBlock.allowedChildren = [Text2, break_default, cursor_default];
  CodeBlock.requiredContainer = CodeBlockContainer;

  // node_modules/quill/formats/direction.js
  var config2 = {
    scope: Scope.BLOCK,
    whitelist: ["rtl"]
  };
  var DirectionAttribute = new Attributor("direction", "dir", config2);
  var DirectionClass = new ClassAttributor$1("direction", "ql-direction", config2);
  var DirectionStyle = new StyleAttributor$1("direction", "direction", config2);

  // node_modules/quill/formats/font.js
  var config3 = {
    scope: Scope.INLINE,
    whitelist: ["serif", "monospace"]
  };
  var FontClass = new ClassAttributor$1("font", "ql-font", config3);
  var FontStyleAttributor = class extends StyleAttributor$1 {
    static {
      __name(this, "FontStyleAttributor");
    }
    value(node) {
      return super.value(node).replace(/["']/g, "");
    }
  };
  var FontStyle = new FontStyleAttributor("font", "font-family", config3);

  // node_modules/quill/formats/size.js
  var SizeClass = new ClassAttributor$1("size", "ql-size", {
    scope: Scope.INLINE,
    whitelist: ["small", "large", "huge"]
  });
  var SizeStyle = new StyleAttributor$1("size", "font-size", {
    scope: Scope.INLINE,
    whitelist: ["10px", "18px", "32px"]
  });

  // node_modules/quill/modules/keyboard.js
  var import_quill_delta5 = __toESM(require_Delta(), 1);
  var debug5 = logger_default("quill:keyboard");
  var SHORTKEY = /Mac/i.test(navigator.platform) ? "metaKey" : "ctrlKey";
  var Keyboard = class _Keyboard extends module_default {
    static {
      __name(this, "Keyboard");
    }
    static match(evt, binding) {
      if (["altKey", "ctrlKey", "metaKey", "shiftKey"].some((key) => {
        return !!binding[key] !== evt[key] && binding[key] !== null;
      })) {
        return false;
      }
      return binding.key === evt.key || binding.key === evt.which;
    }
    constructor(quill, options) {
      super(quill, options);
      this.bindings = {};
      Object.keys(this.options.bindings).forEach((name) => {
        if (this.options.bindings[name]) {
          this.addBinding(this.options.bindings[name]);
        }
      });
      this.addBinding({
        key: "Enter",
        shiftKey: null
      }, this.handleEnter);
      this.addBinding({
        key: "Enter",
        metaKey: null,
        ctrlKey: null,
        altKey: null
      }, () => {
      });
      if (/Firefox/i.test(navigator.userAgent)) {
        this.addBinding({
          key: "Backspace"
        }, {
          collapsed: true
        }, this.handleBackspace);
        this.addBinding({
          key: "Delete"
        }, {
          collapsed: true
        }, this.handleDelete);
      } else {
        this.addBinding({
          key: "Backspace"
        }, {
          collapsed: true,
          prefix: /^.?$/
        }, this.handleBackspace);
        this.addBinding({
          key: "Delete"
        }, {
          collapsed: true,
          suffix: /^.?$/
        }, this.handleDelete);
      }
      this.addBinding({
        key: "Backspace"
      }, {
        collapsed: false
      }, this.handleDeleteRange);
      this.addBinding({
        key: "Delete"
      }, {
        collapsed: false
      }, this.handleDeleteRange);
      this.addBinding({
        key: "Backspace",
        altKey: null,
        ctrlKey: null,
        metaKey: null,
        shiftKey: null
      }, {
        collapsed: true,
        offset: 0
      }, this.handleBackspace);
      this.listen();
    }
    addBinding(keyBinding) {
      let context = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let handler = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      const binding = normalize(keyBinding);
      if (binding == null) {
        debug5.warn("Attempted to add invalid keyboard binding", binding);
        return;
      }
      if (typeof context === "function") {
        context = {
          handler: context
        };
      }
      if (typeof handler === "function") {
        handler = {
          handler
        };
      }
      const keys2 = Array.isArray(binding.key) ? binding.key : [binding.key];
      keys2.forEach((key) => {
        const singleBinding = {
          ...binding,
          key,
          ...context,
          ...handler
        };
        this.bindings[singleBinding.key] = this.bindings[singleBinding.key] || [];
        this.bindings[singleBinding.key].push(singleBinding);
      });
    }
    listen() {
      this.quill.root.addEventListener("keydown", (evt) => {
        if (evt.defaultPrevented || evt.isComposing)
          return;
        const bindings = (this.bindings[evt.key] || []).concat(this.bindings[evt.which] || []);
        const matches = bindings.filter((binding) => _Keyboard.match(evt, binding));
        if (matches.length === 0)
          return;
        const blot = Quill.find(evt.target, true);
        if (blot && blot.scroll !== this.quill.scroll)
          return;
        const range = this.quill.getSelection();
        if (range == null || !this.quill.hasFocus())
          return;
        const [line, offset] = this.quill.getLine(range.index);
        const [leafStart, offsetStart] = this.quill.getLeaf(range.index);
        const [leafEnd, offsetEnd] = range.length === 0 ? [leafStart, offsetStart] : this.quill.getLeaf(range.index + range.length);
        const prefixText = leafStart instanceof TextBlot$1 ? leafStart.value().slice(0, offsetStart) : "";
        const suffixText = leafEnd instanceof TextBlot$1 ? leafEnd.value().slice(offsetEnd) : "";
        const curContext = {
          collapsed: range.length === 0,
          // @ts-expect-error Fix me later
          empty: range.length === 0 && line.length() <= 1,
          format: this.quill.getFormat(range),
          line,
          offset,
          prefix: prefixText,
          suffix: suffixText,
          event: evt
        };
        const prevented = matches.some((binding) => {
          if (binding.collapsed != null && binding.collapsed !== curContext.collapsed) {
            return false;
          }
          if (binding.empty != null && binding.empty !== curContext.empty) {
            return false;
          }
          if (binding.offset != null && binding.offset !== curContext.offset) {
            return false;
          }
          if (Array.isArray(binding.format)) {
            if (binding.format.every((name) => curContext.format[name] == null)) {
              return false;
            }
          } else if (typeof binding.format === "object") {
            if (!Object.keys(binding.format).every((name) => {
              if (binding.format[name] === true)
                return curContext.format[name] != null;
              if (binding.format[name] === false)
                return curContext.format[name] == null;
              return isEqual_default(binding.format[name], curContext.format[name]);
            })) {
              return false;
            }
          }
          if (binding.prefix != null && !binding.prefix.test(curContext.prefix)) {
            return false;
          }
          if (binding.suffix != null && !binding.suffix.test(curContext.suffix)) {
            return false;
          }
          return binding.handler.call(this, range, curContext, binding) !== true;
        });
        if (prevented) {
          evt.preventDefault();
        }
      });
    }
    handleBackspace(range, context) {
      const length = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(context.prefix) ? 2 : 1;
      if (range.index === 0 || this.quill.getLength() <= 1)
        return;
      let formats = {};
      const [line] = this.quill.getLine(range.index);
      let delta = new import_quill_delta5.default().retain(range.index - length).delete(length);
      if (context.offset === 0) {
        const [prev] = this.quill.getLine(range.index - 1);
        if (prev) {
          const isPrevLineEmpty = prev.statics.blotName === "block" && prev.length() <= 1;
          if (!isPrevLineEmpty) {
            const curFormats = line.formats();
            const prevFormats = this.quill.getFormat(range.index - 1, 1);
            formats = import_quill_delta5.AttributeMap.diff(curFormats, prevFormats) || {};
            if (Object.keys(formats).length > 0) {
              const formatDelta = new import_quill_delta5.default().retain(range.index + line.length() - 2).retain(1, formats);
              delta = delta.compose(formatDelta);
            }
          }
        }
      }
      this.quill.updateContents(delta, Quill.sources.USER);
      this.quill.focus();
    }
    handleDelete(range, context) {
      const length = /^[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(context.suffix) ? 2 : 1;
      if (range.index >= this.quill.getLength() - length)
        return;
      let formats = {};
      const [line] = this.quill.getLine(range.index);
      let delta = new import_quill_delta5.default().retain(range.index).delete(length);
      if (context.offset >= line.length() - 1) {
        const [next] = this.quill.getLine(range.index + 1);
        if (next) {
          const curFormats = line.formats();
          const nextFormats = this.quill.getFormat(range.index, 1);
          formats = import_quill_delta5.AttributeMap.diff(curFormats, nextFormats) || {};
          if (Object.keys(formats).length > 0) {
            delta = delta.retain(next.length() - 1).retain(1, formats);
          }
        }
      }
      this.quill.updateContents(delta, Quill.sources.USER);
      this.quill.focus();
    }
    handleDeleteRange(range) {
      deleteRange({
        range,
        quill: this.quill
      });
      this.quill.focus();
    }
    handleEnter(range, context) {
      const lineFormats = Object.keys(context.format).reduce((formats, format) => {
        if (this.quill.scroll.query(format, Scope.BLOCK) && !Array.isArray(context.format[format])) {
          formats[format] = context.format[format];
        }
        return formats;
      }, {});
      const delta = new import_quill_delta5.default().retain(range.index).delete(range.length).insert("\n", lineFormats);
      this.quill.updateContents(delta, Quill.sources.USER);
      this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
      this.quill.focus();
    }
  };
  var defaultOptions = {
    bindings: {
      bold: makeFormatHandler("bold"),
      italic: makeFormatHandler("italic"),
      underline: makeFormatHandler("underline"),
      indent: {
        // highlight tab or tab at beginning of list, indent or blockquote
        key: "Tab",
        format: ["blockquote", "indent", "list"],
        handler(range, context) {
          if (context.collapsed && context.offset !== 0)
            return true;
          this.quill.format("indent", "+1", Quill.sources.USER);
          return false;
        }
      },
      outdent: {
        key: "Tab",
        shiftKey: true,
        format: ["blockquote", "indent", "list"],
        // highlight tab or tab at beginning of list, indent or blockquote
        handler(range, context) {
          if (context.collapsed && context.offset !== 0)
            return true;
          this.quill.format("indent", "-1", Quill.sources.USER);
          return false;
        }
      },
      "outdent backspace": {
        key: "Backspace",
        collapsed: true,
        shiftKey: null,
        metaKey: null,
        ctrlKey: null,
        altKey: null,
        format: ["indent", "list"],
        offset: 0,
        handler(range, context) {
          if (context.format.indent != null) {
            this.quill.format("indent", "-1", Quill.sources.USER);
          } else if (context.format.list != null) {
            this.quill.format("list", false, Quill.sources.USER);
          }
        }
      },
      "indent code-block": makeCodeBlockHandler(true),
      "outdent code-block": makeCodeBlockHandler(false),
      "remove tab": {
        key: "Tab",
        shiftKey: true,
        collapsed: true,
        prefix: /\t$/,
        handler(range) {
          this.quill.deleteText(range.index - 1, 1, Quill.sources.USER);
        }
      },
      tab: {
        key: "Tab",
        handler(range, context) {
          if (context.format.table)
            return true;
          this.quill.history.cutoff();
          const delta = new import_quill_delta5.default().retain(range.index).delete(range.length).insert("	");
          this.quill.updateContents(delta, Quill.sources.USER);
          this.quill.history.cutoff();
          this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
          return false;
        }
      },
      "blockquote empty enter": {
        key: "Enter",
        collapsed: true,
        format: ["blockquote"],
        empty: true,
        handler() {
          this.quill.format("blockquote", false, Quill.sources.USER);
        }
      },
      "list empty enter": {
        key: "Enter",
        collapsed: true,
        format: ["list"],
        empty: true,
        handler(range, context) {
          const formats = {
            list: false
          };
          if (context.format.indent) {
            formats.indent = false;
          }
          this.quill.formatLine(range.index, range.length, formats, Quill.sources.USER);
        }
      },
      "checklist enter": {
        key: "Enter",
        collapsed: true,
        format: {
          list: "checked"
        },
        handler(range) {
          const [line, offset] = this.quill.getLine(range.index);
          const formats = {
            // @ts-expect-error Fix me later
            ...line.formats(),
            list: "checked"
          };
          const delta = new import_quill_delta5.default().retain(range.index).insert("\n", formats).retain(line.length() - offset - 1).retain(1, {
            list: "unchecked"
          });
          this.quill.updateContents(delta, Quill.sources.USER);
          this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
          this.quill.scrollSelectionIntoView();
        }
      },
      "header enter": {
        key: "Enter",
        collapsed: true,
        format: ["header"],
        suffix: /^$/,
        handler(range, context) {
          const [line, offset] = this.quill.getLine(range.index);
          const delta = new import_quill_delta5.default().retain(range.index).insert("\n", context.format).retain(line.length() - offset - 1).retain(1, {
            header: null
          });
          this.quill.updateContents(delta, Quill.sources.USER);
          this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
          this.quill.scrollSelectionIntoView();
        }
      },
      "table backspace": {
        key: "Backspace",
        format: ["table"],
        collapsed: true,
        offset: 0,
        handler() {
        }
      },
      "table delete": {
        key: "Delete",
        format: ["table"],
        collapsed: true,
        suffix: /^$/,
        handler() {
        }
      },
      "table enter": {
        key: "Enter",
        shiftKey: null,
        format: ["table"],
        handler(range) {
          const module2 = this.quill.getModule("table");
          if (module2) {
            const [table, row, cell, offset] = module2.getTable(range);
            const shift = tableSide(table, row, cell, offset);
            if (shift == null)
              return;
            let index = table.offset();
            if (shift < 0) {
              const delta = new import_quill_delta5.default().retain(index).insert("\n");
              this.quill.updateContents(delta, Quill.sources.USER);
              this.quill.setSelection(range.index + 1, range.length, Quill.sources.SILENT);
            } else if (shift > 0) {
              index += table.length();
              const delta = new import_quill_delta5.default().retain(index).insert("\n");
              this.quill.updateContents(delta, Quill.sources.USER);
              this.quill.setSelection(index, Quill.sources.USER);
            }
          }
        }
      },
      "table tab": {
        key: "Tab",
        shiftKey: null,
        format: ["table"],
        handler(range, context) {
          const {
            event,
            line: cell
          } = context;
          const offset = cell.offset(this.quill.scroll);
          if (event.shiftKey) {
            this.quill.setSelection(offset - 1, Quill.sources.USER);
          } else {
            this.quill.setSelection(offset + cell.length(), Quill.sources.USER);
          }
        }
      },
      "list autofill": {
        key: " ",
        shiftKey: null,
        collapsed: true,
        format: {
          "code-block": false,
          blockquote: false,
          table: false
        },
        prefix: /^\s*?(\d+\.|-|\*|\[ ?\]|\[x\])$/,
        handler(range, context) {
          if (this.quill.scroll.query("list") == null)
            return true;
          const {
            length
          } = context.prefix;
          const [line, offset] = this.quill.getLine(range.index);
          if (offset > length)
            return true;
          let value;
          switch (context.prefix.trim()) {
            case "[]":
            case "[ ]":
              value = "unchecked";
              break;
            case "[x]":
              value = "checked";
              break;
            case "-":
            case "*":
              value = "bullet";
              break;
            default:
              value = "ordered";
          }
          this.quill.insertText(range.index, " ", Quill.sources.USER);
          this.quill.history.cutoff();
          const delta = new import_quill_delta5.default().retain(range.index - offset).delete(length + 1).retain(line.length() - 2 - offset).retain(1, {
            list: value
          });
          this.quill.updateContents(delta, Quill.sources.USER);
          this.quill.history.cutoff();
          this.quill.setSelection(range.index - length, Quill.sources.SILENT);
          return false;
        }
      },
      "code exit": {
        key: "Enter",
        collapsed: true,
        format: ["code-block"],
        prefix: /^$/,
        suffix: /^\s*$/,
        handler(range) {
          const [line, offset] = this.quill.getLine(range.index);
          let numLines = 2;
          let cur = line;
          while (cur != null && cur.length() <= 1 && cur.formats()["code-block"]) {
            cur = cur.prev;
            numLines -= 1;
            if (numLines <= 0) {
              const delta = new import_quill_delta5.default().retain(range.index + line.length() - offset - 2).retain(1, {
                "code-block": null
              }).delete(1);
              this.quill.updateContents(delta, Quill.sources.USER);
              this.quill.setSelection(range.index - 1, Quill.sources.SILENT);
              return false;
            }
          }
          return true;
        }
      },
      "embed left": makeEmbedArrowHandler("ArrowLeft", false),
      "embed left shift": makeEmbedArrowHandler("ArrowLeft", true),
      "embed right": makeEmbedArrowHandler("ArrowRight", false),
      "embed right shift": makeEmbedArrowHandler("ArrowRight", true),
      "table down": makeTableArrowHandler(false),
      "table up": makeTableArrowHandler(true)
    }
  };
  Keyboard.DEFAULTS = defaultOptions;
  function makeCodeBlockHandler(indent) {
    return {
      key: "Tab",
      shiftKey: !indent,
      format: {
        "code-block": true
      },
      handler(range, _ref) {
        let {
          event
        } = _ref;
        const CodeBlock2 = this.quill.scroll.query("code-block");
        const {
          TAB
        } = CodeBlock2;
        if (range.length === 0 && !event.shiftKey) {
          this.quill.insertText(range.index, TAB, Quill.sources.USER);
          this.quill.setSelection(range.index + TAB.length, Quill.sources.SILENT);
          return;
        }
        const lines = range.length === 0 ? this.quill.getLines(range.index, 1) : this.quill.getLines(range);
        let {
          index,
          length
        } = range;
        lines.forEach((line, i) => {
          if (indent) {
            line.insertAt(0, TAB);
            if (i === 0) {
              index += TAB.length;
            } else {
              length += TAB.length;
            }
          } else if (line.domNode.textContent.startsWith(TAB)) {
            line.deleteAt(0, TAB.length);
            if (i === 0) {
              index -= TAB.length;
            } else {
              length -= TAB.length;
            }
          }
        });
        this.quill.update(Quill.sources.USER);
        this.quill.setSelection(index, length, Quill.sources.SILENT);
      }
    };
  }
  __name(makeCodeBlockHandler, "makeCodeBlockHandler");
  function makeEmbedArrowHandler(key, shiftKey) {
    const where = key === "ArrowLeft" ? "prefix" : "suffix";
    return {
      key,
      shiftKey,
      altKey: null,
      [where]: /^$/,
      handler(range) {
        let {
          index
        } = range;
        if (key === "ArrowRight") {
          index += range.length + 1;
        }
        const [leaf] = this.quill.getLeaf(index);
        if (!(leaf instanceof EmbedBlot$1))
          return true;
        if (key === "ArrowLeft") {
          if (shiftKey) {
            this.quill.setSelection(range.index - 1, range.length + 1, Quill.sources.USER);
          } else {
            this.quill.setSelection(range.index - 1, Quill.sources.USER);
          }
        } else if (shiftKey) {
          this.quill.setSelection(range.index, range.length + 1, Quill.sources.USER);
        } else {
          this.quill.setSelection(range.index + range.length + 1, Quill.sources.USER);
        }
        return false;
      }
    };
  }
  __name(makeEmbedArrowHandler, "makeEmbedArrowHandler");
  function makeFormatHandler(format) {
    return {
      key: format[0],
      shortKey: true,
      handler(range, context) {
        this.quill.format(format, !context.format[format], Quill.sources.USER);
      }
    };
  }
  __name(makeFormatHandler, "makeFormatHandler");
  function makeTableArrowHandler(up) {
    return {
      key: up ? "ArrowUp" : "ArrowDown",
      collapsed: true,
      format: ["table"],
      handler(range, context) {
        const key = up ? "prev" : "next";
        const cell = context.line;
        const targetRow = cell.parent[key];
        if (targetRow != null) {
          if (targetRow.statics.blotName === "table-row") {
            let targetCell = targetRow.children.head;
            let cur = cell;
            while (cur.prev != null) {
              cur = cur.prev;
              targetCell = targetCell.next;
            }
            const index = targetCell.offset(this.quill.scroll) + Math.min(context.offset, targetCell.length() - 1);
            this.quill.setSelection(index, 0, Quill.sources.USER);
          }
        } else {
          const targetLine = cell.table()[key];
          if (targetLine != null) {
            if (up) {
              this.quill.setSelection(targetLine.offset(this.quill.scroll) + targetLine.length() - 1, 0, Quill.sources.USER);
            } else {
              this.quill.setSelection(targetLine.offset(this.quill.scroll), 0, Quill.sources.USER);
            }
          }
        }
        return false;
      }
    };
  }
  __name(makeTableArrowHandler, "makeTableArrowHandler");
  function normalize(binding) {
    if (typeof binding === "string" || typeof binding === "number") {
      binding = {
        key: binding
      };
    } else if (typeof binding === "object") {
      binding = cloneDeep_default(binding);
    } else {
      return null;
    }
    if (binding.shortKey) {
      binding[SHORTKEY] = binding.shortKey;
      delete binding.shortKey;
    }
    return binding;
  }
  __name(normalize, "normalize");
  function deleteRange(_ref2) {
    let {
      quill,
      range
    } = _ref2;
    const lines = quill.getLines(range);
    let formats = {};
    if (lines.length > 1) {
      const firstFormats = lines[0].formats();
      const lastFormats = lines[lines.length - 1].formats();
      formats = import_quill_delta5.AttributeMap.diff(lastFormats, firstFormats) || {};
    }
    quill.deleteText(range, Quill.sources.USER);
    if (Object.keys(formats).length > 0) {
      quill.formatLine(range.index, 1, formats, Quill.sources.USER);
    }
    quill.setSelection(range.index, Quill.sources.SILENT);
  }
  __name(deleteRange, "deleteRange");
  function tableSide(_table, row, cell, offset) {
    if (row.prev == null && row.next == null) {
      if (cell.prev == null && cell.next == null) {
        return offset === 0 ? -1 : 1;
      }
      return cell.prev == null ? -1 : 1;
    }
    if (row.prev == null) {
      return -1;
    }
    if (row.next == null) {
      return 1;
    }
    return null;
  }
  __name(tableSide, "tableSide");

  // node_modules/quill/modules/normalizeExternalHTML/normalizers/googleDocs.js
  var normalWeightRegexp = /font-weight:\s*normal/;
  var blockTagNames = ["P", "OL", "UL"];
  var isBlockElement = /* @__PURE__ */ __name((element) => {
    return element && blockTagNames.includes(element.tagName);
  }, "isBlockElement");
  var normalizeEmptyLines = /* @__PURE__ */ __name((doc) => {
    Array.from(doc.querySelectorAll("br")).filter((br) => isBlockElement(br.previousElementSibling) && isBlockElement(br.nextElementSibling)).forEach((br) => {
      br.parentNode?.removeChild(br);
    });
  }, "normalizeEmptyLines");
  var normalizeFontWeight = /* @__PURE__ */ __name((doc) => {
    Array.from(doc.querySelectorAll('b[style*="font-weight"]')).filter((node) => node.getAttribute("style")?.match(normalWeightRegexp)).forEach((node) => {
      const fragment = doc.createDocumentFragment();
      fragment.append(...node.childNodes);
      node.parentNode?.replaceChild(fragment, node);
    });
  }, "normalizeFontWeight");
  function normalize2(doc) {
    if (doc.querySelector('[id^="docs-internal-guid-"]')) {
      normalizeFontWeight(doc);
      normalizeEmptyLines(doc);
    }
  }
  __name(normalize2, "normalize");

  // node_modules/quill/modules/normalizeExternalHTML/normalizers/msWord.js
  var ignoreRegexp = /\bmso-list:[^;]*ignore/i;
  var idRegexp = /\bmso-list:[^;]*\bl(\d+)/i;
  var indentRegexp = /\bmso-list:[^;]*\blevel(\d+)/i;
  var parseListItem = /* @__PURE__ */ __name((element, html) => {
    const style = element.getAttribute("style");
    const idMatch = style?.match(idRegexp);
    if (!idMatch) {
      return null;
    }
    const id = Number(idMatch[1]);
    const indentMatch = style?.match(indentRegexp);
    const indent = indentMatch ? Number(indentMatch[1]) : 1;
    const typeRegexp = new RegExp(`@list l${id}:level${indent}\\s*\\{[^\\}]*mso-level-number-format:\\s*([\\w-]+)`, "i");
    const typeMatch = html.match(typeRegexp);
    const type = typeMatch && typeMatch[1] === "bullet" ? "bullet" : "ordered";
    return {
      id,
      indent,
      type,
      element
    };
  }, "parseListItem");
  var normalizeListItem = /* @__PURE__ */ __name((doc) => {
    const msoList = Array.from(doc.querySelectorAll("[style*=mso-list]"));
    const ignored = [];
    const others = [];
    msoList.forEach((node) => {
      const shouldIgnore = (node.getAttribute("style") || "").match(ignoreRegexp);
      if (shouldIgnore) {
        ignored.push(node);
      } else {
        others.push(node);
      }
    });
    ignored.forEach((node) => node.parentNode?.removeChild(node));
    const html = doc.documentElement.innerHTML;
    const listItems = others.map((element) => parseListItem(element, html)).filter((parsed) => parsed);
    while (listItems.length) {
      const childListItems = [];
      let current = listItems.shift();
      while (current) {
        childListItems.push(current);
        current = listItems.length && listItems[0]?.element === current.element.nextElementSibling && // Different id means the next item doesn't belong to this group.
        listItems[0].id === current.id ? listItems.shift() : null;
      }
      const ul = document.createElement("ul");
      childListItems.forEach((listItem) => {
        const li = document.createElement("li");
        li.setAttribute("data-list", listItem.type);
        if (listItem.indent > 1) {
          li.setAttribute("class", `ql-indent-${listItem.indent - 1}`);
        }
        li.innerHTML = listItem.element.innerHTML;
        ul.appendChild(li);
      });
      const element = childListItems[0]?.element;
      const {
        parentNode
      } = element ?? {};
      if (element) {
        parentNode?.replaceChild(ul, element);
      }
      childListItems.slice(1).forEach((_ref) => {
        let {
          element: e
        } = _ref;
        parentNode?.removeChild(e);
      });
    }
  }, "normalizeListItem");
  function normalize3(doc) {
    if (doc.documentElement.getAttribute("xmlns:w") === "urn:schemas-microsoft-com:office:word") {
      normalizeListItem(doc);
    }
  }
  __name(normalize3, "normalize");

  // node_modules/quill/modules/normalizeExternalHTML/index.js
  var NORMALIZERS = [normalize3, normalize2];
  var normalizeExternalHTML = /* @__PURE__ */ __name((doc) => {
    if (doc.documentElement) {
      NORMALIZERS.forEach((normalize4) => {
        normalize4(doc);
      });
    }
  }, "normalizeExternalHTML");
  var normalizeExternalHTML_default = normalizeExternalHTML;

  // node_modules/quill/modules/clipboard.js
  var debug6 = logger_default("quill:clipboard");
  var CLIPBOARD_CONFIG = [[Node.TEXT_NODE, matchText], [Node.TEXT_NODE, matchNewline], ["br", matchBreak], [Node.ELEMENT_NODE, matchNewline], [Node.ELEMENT_NODE, matchBlot], [Node.ELEMENT_NODE, matchAttributor], [Node.ELEMENT_NODE, matchStyles], ["li", matchIndent], ["ol, ul", matchList], ["pre", matchCodeBlock], ["tr", matchTable], ["b", createMatchAlias("bold")], ["i", createMatchAlias("italic")], ["strike", createMatchAlias("strike")], ["style", matchIgnore]];
  var ATTRIBUTE_ATTRIBUTORS = [AlignAttribute, DirectionAttribute].reduce((memo, attr) => {
    memo[attr.keyName] = attr;
    return memo;
  }, {});
  var STYLE_ATTRIBUTORS = [AlignStyle, BackgroundStyle, ColorStyle, DirectionStyle, FontStyle, SizeStyle].reduce((memo, attr) => {
    memo[attr.keyName] = attr;
    return memo;
  }, {});
  var Clipboard = class extends module_default {
    static {
      __name(this, "Clipboard");
    }
    static DEFAULTS = {
      matchers: []
    };
    constructor(quill, options) {
      super(quill, options);
      this.quill.root.addEventListener("copy", (e) => this.onCaptureCopy(e, false));
      this.quill.root.addEventListener("cut", (e) => this.onCaptureCopy(e, true));
      this.quill.root.addEventListener("paste", this.onCapturePaste.bind(this));
      this.matchers = [];
      CLIPBOARD_CONFIG.concat(this.options.matchers ?? []).forEach((_ref) => {
        let [selector, matcher] = _ref;
        this.addMatcher(selector, matcher);
      });
    }
    addMatcher(selector, matcher) {
      this.matchers.push([selector, matcher]);
    }
    convert(_ref2) {
      let {
        html,
        text
      } = _ref2;
      let formats = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      if (formats[CodeBlock.blotName]) {
        return new import_quill_delta6.default().insert(text || "", {
          [CodeBlock.blotName]: formats[CodeBlock.blotName]
        });
      }
      if (!html) {
        return new import_quill_delta6.default().insert(text || "", formats);
      }
      const delta = this.convertHTML(html);
      if (deltaEndsWith(delta, "\n") && (delta.ops[delta.ops.length - 1].attributes == null || formats.table)) {
        return delta.compose(new import_quill_delta6.default().retain(delta.length() - 1).delete(1));
      }
      return delta;
    }
    normalizeHTML(doc) {
      normalizeExternalHTML_default(doc);
    }
    convertHTML(html) {
      const doc = new DOMParser().parseFromString(html, "text/html");
      this.normalizeHTML(doc);
      const container = doc.body;
      const nodeMatches = /* @__PURE__ */ new WeakMap();
      const [elementMatchers, textMatchers] = this.prepareMatching(container, nodeMatches);
      return traverse(this.quill.scroll, container, elementMatchers, textMatchers, nodeMatches);
    }
    dangerouslyPasteHTML(index, html) {
      let source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Quill.sources.API;
      if (typeof index === "string") {
        const delta = this.convert({
          html: index,
          text: ""
        });
        this.quill.setContents(delta, html);
        this.quill.setSelection(0, Quill.sources.SILENT);
      } else {
        const paste = this.convert({
          html,
          text: ""
        });
        this.quill.updateContents(new import_quill_delta6.default().retain(index).concat(paste), source);
        this.quill.setSelection(index + paste.length(), Quill.sources.SILENT);
      }
    }
    onCaptureCopy(e) {
      let isCut = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      if (e.defaultPrevented)
        return;
      e.preventDefault();
      const [range] = this.quill.selection.getRange();
      if (range == null)
        return;
      const {
        html,
        text
      } = this.onCopy(range, isCut);
      e.clipboardData?.setData("text/plain", text);
      e.clipboardData?.setData("text/html", html);
      if (isCut) {
        deleteRange({
          range,
          quill: this.quill
        });
      }
    }
    /*
     * https://www.iana.org/assignments/media-types/text/uri-list
     */
    normalizeURIList(urlList) {
      return urlList.split(/\r?\n/).filter((url) => url[0] !== "#").join("\n");
    }
    onCapturePaste(e) {
      if (e.defaultPrevented || !this.quill.isEnabled())
        return;
      e.preventDefault();
      const range = this.quill.getSelection(true);
      if (range == null)
        return;
      const html = e.clipboardData?.getData("text/html");
      let text = e.clipboardData?.getData("text/plain");
      if (!html && !text) {
        const urlList = e.clipboardData?.getData("text/uri-list");
        if (urlList) {
          text = this.normalizeURIList(urlList);
        }
      }
      const files = Array.from(e.clipboardData?.files || []);
      if (!html && files.length > 0) {
        this.quill.uploader.upload(range, files);
        return;
      }
      if (html && files.length > 0) {
        const doc = new DOMParser().parseFromString(html, "text/html");
        if (doc.body.childElementCount === 1 && doc.body.firstElementChild?.tagName === "IMG") {
          this.quill.uploader.upload(range, files);
          return;
        }
      }
      this.onPaste(range, {
        html,
        text
      });
    }
    onCopy(range) {
      const text = this.quill.getText(range);
      const html = this.quill.getSemanticHTML(range);
      return {
        html,
        text
      };
    }
    onPaste(range, _ref3) {
      let {
        text,
        html
      } = _ref3;
      const formats = this.quill.getFormat(range.index);
      const pastedDelta = this.convert({
        text,
        html
      }, formats);
      debug6.log("onPaste", pastedDelta, {
        text,
        html
      });
      const delta = new import_quill_delta6.default().retain(range.index).delete(range.length).concat(pastedDelta);
      this.quill.updateContents(delta, Quill.sources.USER);
      this.quill.setSelection(delta.length() - range.length, Quill.sources.SILENT);
      this.quill.scrollSelectionIntoView();
    }
    prepareMatching(container, nodeMatches) {
      const elementMatchers = [];
      const textMatchers = [];
      this.matchers.forEach((pair) => {
        const [selector, matcher] = pair;
        switch (selector) {
          case Node.TEXT_NODE:
            textMatchers.push(matcher);
            break;
          case Node.ELEMENT_NODE:
            elementMatchers.push(matcher);
            break;
          default:
            Array.from(container.querySelectorAll(selector)).forEach((node) => {
              if (nodeMatches.has(node)) {
                const matches = nodeMatches.get(node);
                matches?.push(matcher);
              } else {
                nodeMatches.set(node, [matcher]);
              }
            });
            break;
        }
      });
      return [elementMatchers, textMatchers];
    }
  };
  function applyFormat(delta, format, value, scroll) {
    if (!scroll.query(format)) {
      return delta;
    }
    return delta.reduce((newDelta, op) => {
      if (!op.insert)
        return newDelta;
      if (op.attributes && op.attributes[format]) {
        return newDelta.push(op);
      }
      const formats = value ? {
        [format]: value
      } : {};
      return newDelta.insert(op.insert, {
        ...formats,
        ...op.attributes
      });
    }, new import_quill_delta6.default());
  }
  __name(applyFormat, "applyFormat");
  function deltaEndsWith(delta, text) {
    let endText = "";
    for (let i = delta.ops.length - 1; i >= 0 && endText.length < text.length; --i) {
      const op = delta.ops[i];
      if (typeof op.insert !== "string")
        break;
      endText = op.insert + endText;
    }
    return endText.slice(-1 * text.length) === text;
  }
  __name(deltaEndsWith, "deltaEndsWith");
  function isLine2(node, scroll) {
    if (!(node instanceof Element))
      return false;
    const match2 = scroll.query(node);
    if (match2 && match2.prototype instanceof EmbedBlot$1)
      return false;
    return ["address", "article", "blockquote", "canvas", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "iframe", "li", "main", "nav", "ol", "output", "p", "pre", "section", "table", "td", "tr", "ul", "video"].includes(node.tagName.toLowerCase());
  }
  __name(isLine2, "isLine");
  function isBetweenInlineElements(node, scroll) {
    return node.previousElementSibling && node.nextElementSibling && !isLine2(node.previousElementSibling, scroll) && !isLine2(node.nextElementSibling, scroll);
  }
  __name(isBetweenInlineElements, "isBetweenInlineElements");
  var preNodes = /* @__PURE__ */ new WeakMap();
  function isPre(node) {
    if (node == null)
      return false;
    if (!preNodes.has(node)) {
      if (node.tagName === "PRE") {
        preNodes.set(node, true);
      } else {
        preNodes.set(node, isPre(node.parentNode));
      }
    }
    return preNodes.get(node);
  }
  __name(isPre, "isPre");
  function traverse(scroll, node, elementMatchers, textMatchers, nodeMatches) {
    if (node.nodeType === node.TEXT_NODE) {
      return textMatchers.reduce((delta, matcher) => {
        return matcher(node, delta, scroll);
      }, new import_quill_delta6.default());
    }
    if (node.nodeType === node.ELEMENT_NODE) {
      return Array.from(node.childNodes || []).reduce((delta, childNode) => {
        let childrenDelta = traverse(scroll, childNode, elementMatchers, textMatchers, nodeMatches);
        if (childNode.nodeType === node.ELEMENT_NODE) {
          childrenDelta = elementMatchers.reduce((reducedDelta, matcher) => {
            return matcher(childNode, reducedDelta, scroll);
          }, childrenDelta);
          childrenDelta = (nodeMatches.get(childNode) || []).reduce((reducedDelta, matcher) => {
            return matcher(childNode, reducedDelta, scroll);
          }, childrenDelta);
        }
        return delta.concat(childrenDelta);
      }, new import_quill_delta6.default());
    }
    return new import_quill_delta6.default();
  }
  __name(traverse, "traverse");
  function createMatchAlias(format) {
    return (_node, delta, scroll) => {
      return applyFormat(delta, format, true, scroll);
    };
  }
  __name(createMatchAlias, "createMatchAlias");
  function matchAttributor(node, delta, scroll) {
    const attributes = Attributor.keys(node);
    const classes = ClassAttributor$1.keys(node);
    const styles = StyleAttributor$1.keys(node);
    const formats = {};
    attributes.concat(classes).concat(styles).forEach((name) => {
      let attr = scroll.query(name, Scope.ATTRIBUTE);
      if (attr != null) {
        formats[attr.attrName] = attr.value(node);
        if (formats[attr.attrName])
          return;
      }
      attr = ATTRIBUTE_ATTRIBUTORS[name];
      if (attr != null && (attr.attrName === name || attr.keyName === name)) {
        formats[attr.attrName] = attr.value(node) || void 0;
      }
      attr = STYLE_ATTRIBUTORS[name];
      if (attr != null && (attr.attrName === name || attr.keyName === name)) {
        attr = STYLE_ATTRIBUTORS[name];
        formats[attr.attrName] = attr.value(node) || void 0;
      }
    });
    return Object.entries(formats).reduce((newDelta, _ref4) => {
      let [name, value] = _ref4;
      return applyFormat(newDelta, name, value, scroll);
    }, delta);
  }
  __name(matchAttributor, "matchAttributor");
  function matchBlot(node, delta, scroll) {
    const match2 = scroll.query(node);
    if (match2 == null)
      return delta;
    if (match2.prototype instanceof EmbedBlot$1) {
      const embed = {};
      const value = match2.value(node);
      if (value != null) {
        embed[match2.blotName] = value;
        return new import_quill_delta6.default().insert(embed, match2.formats(node, scroll));
      }
    } else {
      if (match2.prototype instanceof BlockBlot$1 && !deltaEndsWith(delta, "\n")) {
        delta.insert("\n");
      }
      if ("blotName" in match2 && "formats" in match2 && typeof match2.formats === "function") {
        return applyFormat(delta, match2.blotName, match2.formats(node, scroll), scroll);
      }
    }
    return delta;
  }
  __name(matchBlot, "matchBlot");
  function matchBreak(node, delta) {
    if (!deltaEndsWith(delta, "\n")) {
      delta.insert("\n");
    }
    return delta;
  }
  __name(matchBreak, "matchBreak");
  function matchCodeBlock(node, delta, scroll) {
    const match2 = scroll.query("code-block");
    const language = match2 && "formats" in match2 && typeof match2.formats === "function" ? match2.formats(node, scroll) : true;
    return applyFormat(delta, "code-block", language, scroll);
  }
  __name(matchCodeBlock, "matchCodeBlock");
  function matchIgnore() {
    return new import_quill_delta6.default();
  }
  __name(matchIgnore, "matchIgnore");
  function matchIndent(node, delta, scroll) {
    const match2 = scroll.query(node);
    if (match2 == null || // @ts-expect-error
    match2.blotName !== "list" || !deltaEndsWith(delta, "\n")) {
      return delta;
    }
    let indent = -1;
    let parent = node.parentNode;
    while (parent != null) {
      if (["OL", "UL"].includes(parent.tagName)) {
        indent += 1;
      }
      parent = parent.parentNode;
    }
    if (indent <= 0)
      return delta;
    return delta.reduce((composed, op) => {
      if (!op.insert)
        return composed;
      if (op.attributes && typeof op.attributes.indent === "number") {
        return composed.push(op);
      }
      return composed.insert(op.insert, {
        indent,
        ...op.attributes || {}
      });
    }, new import_quill_delta6.default());
  }
  __name(matchIndent, "matchIndent");
  function matchList(node, delta, scroll) {
    const element = node;
    let list = element.tagName === "OL" ? "ordered" : "bullet";
    const checkedAttr = element.getAttribute("data-checked");
    if (checkedAttr) {
      list = checkedAttr === "true" ? "checked" : "unchecked";
    }
    return applyFormat(delta, "list", list, scroll);
  }
  __name(matchList, "matchList");
  function matchNewline(node, delta, scroll) {
    if (!deltaEndsWith(delta, "\n")) {
      if (isLine2(node, scroll) && (node.childNodes.length > 0 || node instanceof HTMLParagraphElement)) {
        return delta.insert("\n");
      }
      if (delta.length() > 0 && node.nextSibling) {
        let nextSibling = node.nextSibling;
        while (nextSibling != null) {
          if (isLine2(nextSibling, scroll)) {
            return delta.insert("\n");
          }
          const match2 = scroll.query(nextSibling);
          if (match2 && match2.prototype instanceof BlockEmbed) {
            return delta.insert("\n");
          }
          nextSibling = nextSibling.firstChild;
        }
      }
    }
    return delta;
  }
  __name(matchNewline, "matchNewline");
  function matchStyles(node, delta, scroll) {
    const formats = {};
    const style = node.style || {};
    if (style.fontStyle === "italic") {
      formats.italic = true;
    }
    if (style.textDecoration === "underline") {
      formats.underline = true;
    }
    if (style.textDecoration === "line-through") {
      formats.strike = true;
    }
    if (style.fontWeight?.startsWith("bold") || // @ts-expect-error Fix me later
    parseInt(style.fontWeight, 10) >= 700) {
      formats.bold = true;
    }
    delta = Object.entries(formats).reduce((newDelta, _ref5) => {
      let [name, value] = _ref5;
      return applyFormat(newDelta, name, value, scroll);
    }, delta);
    if (parseFloat(style.textIndent || 0) > 0) {
      return new import_quill_delta6.default().insert("	").concat(delta);
    }
    return delta;
  }
  __name(matchStyles, "matchStyles");
  function matchTable(node, delta, scroll) {
    const table = node.parentElement?.tagName === "TABLE" ? node.parentElement : node.parentElement?.parentElement;
    if (table != null) {
      const rows = Array.from(table.querySelectorAll("tr"));
      const row = rows.indexOf(node) + 1;
      return applyFormat(delta, "table", row, scroll);
    }
    return delta;
  }
  __name(matchTable, "matchTable");
  function matchText(node, delta, scroll) {
    let text = node.data;
    if (node.parentElement?.tagName === "O:P") {
      return delta.insert(text.trim());
    }
    if (!isPre(node)) {
      if (text.trim().length === 0 && text.includes("\n") && !isBetweenInlineElements(node, scroll)) {
        return delta;
      }
      const replacer = /* @__PURE__ */ __name((collapse, match2) => {
        const replaced = match2.replace(/[^\u00a0]/g, "");
        return replaced.length < 1 && collapse ? " " : replaced;
      }, "replacer");
      text = text.replace(/\r\n/g, " ").replace(/\n/g, " ");
      text = text.replace(/\s\s+/g, replacer.bind(replacer, true));
      if (node.previousSibling == null && node.parentElement != null && isLine2(node.parentElement, scroll) || node.previousSibling instanceof Element && isLine2(node.previousSibling, scroll)) {
        text = text.replace(/^\s+/, replacer.bind(replacer, false));
      }
      if (node.nextSibling == null && node.parentElement != null && isLine2(node.parentElement, scroll) || node.nextSibling instanceof Element && isLine2(node.nextSibling, scroll)) {
        text = text.replace(/\s+$/, replacer.bind(replacer, false));
      }
    }
    return delta.insert(text);
  }
  __name(matchText, "matchText");

  // node_modules/quill/modules/history.js
  var History = class extends module_default {
    static {
      __name(this, "History");
    }
    static DEFAULTS = {
      delay: 1e3,
      maxStack: 100,
      userOnly: false
    };
    lastRecorded = 0;
    ignoreChange = false;
    stack = {
      undo: [],
      redo: []
    };
    currentRange = null;
    constructor(quill, options) {
      super(quill, options);
      this.quill.on(Quill.events.EDITOR_CHANGE, (eventName, value, oldValue, source) => {
        if (eventName === Quill.events.SELECTION_CHANGE) {
          if (value && source !== Quill.sources.SILENT) {
            this.currentRange = value;
          }
        } else if (eventName === Quill.events.TEXT_CHANGE) {
          if (!this.ignoreChange) {
            if (!this.options.userOnly || source === Quill.sources.USER) {
              this.record(value, oldValue);
            } else {
              this.transform(value);
            }
          }
          this.currentRange = transformRange(this.currentRange, value);
        }
      });
      this.quill.keyboard.addBinding({
        key: "z",
        shortKey: true
      }, this.undo.bind(this));
      this.quill.keyboard.addBinding({
        key: ["z", "Z"],
        shortKey: true,
        shiftKey: true
      }, this.redo.bind(this));
      if (/Win/i.test(navigator.platform)) {
        this.quill.keyboard.addBinding({
          key: "y",
          shortKey: true
        }, this.redo.bind(this));
      }
      this.quill.root.addEventListener("beforeinput", (event) => {
        if (event.inputType === "historyUndo") {
          this.undo();
          event.preventDefault();
        } else if (event.inputType === "historyRedo") {
          this.redo();
          event.preventDefault();
        }
      });
    }
    change(source, dest) {
      if (this.stack[source].length === 0)
        return;
      const item = this.stack[source].pop();
      if (!item)
        return;
      const base = this.quill.getContents();
      const inverseDelta = item.delta.invert(base);
      this.stack[dest].push({
        delta: inverseDelta,
        range: transformRange(item.range, inverseDelta)
      });
      this.lastRecorded = 0;
      this.ignoreChange = true;
      this.quill.updateContents(item.delta, Quill.sources.USER);
      this.ignoreChange = false;
      this.restoreSelection(item);
    }
    clear() {
      this.stack = {
        undo: [],
        redo: []
      };
    }
    cutoff() {
      this.lastRecorded = 0;
    }
    record(changeDelta, oldDelta) {
      if (changeDelta.ops.length === 0)
        return;
      this.stack.redo = [];
      let undoDelta = changeDelta.invert(oldDelta);
      let undoRange = this.currentRange;
      const timestamp = Date.now();
      if (
        // @ts-expect-error Fix me later
        this.lastRecorded + this.options.delay > timestamp && this.stack.undo.length > 0
      ) {
        const item = this.stack.undo.pop();
        if (item) {
          undoDelta = undoDelta.compose(item.delta);
          undoRange = item.range;
        }
      } else {
        this.lastRecorded = timestamp;
      }
      if (undoDelta.length() === 0)
        return;
      this.stack.undo.push({
        delta: undoDelta,
        range: undoRange
      });
      if (this.stack.undo.length > this.options.maxStack) {
        this.stack.undo.shift();
      }
    }
    redo() {
      this.change("redo", "undo");
    }
    transform(delta) {
      transformStack(this.stack.undo, delta);
      transformStack(this.stack.redo, delta);
    }
    undo() {
      this.change("undo", "redo");
    }
    restoreSelection(stackItem) {
      if (stackItem.range) {
        this.quill.setSelection(stackItem.range, Quill.sources.USER);
      } else {
        const index = getLastChangeIndex(this.quill.scroll, stackItem.delta);
        this.quill.setSelection(index, Quill.sources.USER);
      }
    }
  };
  function transformStack(stack, delta) {
    let remoteDelta = delta;
    for (let i = stack.length - 1; i >= 0; i -= 1) {
      const oldItem = stack[i];
      stack[i] = {
        delta: remoteDelta.transform(oldItem.delta, true),
        range: oldItem.range && transformRange(oldItem.range, remoteDelta)
      };
      remoteDelta = oldItem.delta.transform(remoteDelta);
      if (stack[i].delta.length() === 0) {
        stack.splice(i, 1);
      }
    }
  }
  __name(transformStack, "transformStack");
  function endsWithNewlineChange(scroll, delta) {
    const lastOp = delta.ops[delta.ops.length - 1];
    if (lastOp == null)
      return false;
    if (lastOp.insert != null) {
      return typeof lastOp.insert === "string" && lastOp.insert.endsWith("\n");
    }
    if (lastOp.attributes != null) {
      return Object.keys(lastOp.attributes).some((attr) => {
        return scroll.query(attr, Scope.BLOCK) != null;
      });
    }
    return false;
  }
  __name(endsWithNewlineChange, "endsWithNewlineChange");
  function getLastChangeIndex(scroll, delta) {
    const deleteLength = delta.reduce((length, op) => {
      return length + (op.delete || 0);
    }, 0);
    let changeIndex = delta.length() - deleteLength;
    if (endsWithNewlineChange(scroll, delta)) {
      changeIndex -= 1;
    }
    return changeIndex;
  }
  __name(getLastChangeIndex, "getLastChangeIndex");
  function transformRange(range, delta) {
    if (!range)
      return range;
    const start = delta.transformPosition(range.index);
    const end = delta.transformPosition(range.index + range.length);
    return {
      index: start,
      length: end - start
    };
  }
  __name(transformRange, "transformRange");

  // node_modules/quill/modules/uploader.js
  var import_quill_delta7 = __toESM(require_Delta(), 1);
  var Uploader = class extends module_default {
    static {
      __name(this, "Uploader");
    }
    constructor(quill, options) {
      super(quill, options);
      quill.root.addEventListener("drop", (e) => {
        e.preventDefault();
        let native = null;
        if (document.caretRangeFromPoint) {
          native = document.caretRangeFromPoint(e.clientX, e.clientY);
        } else if (document.caretPositionFromPoint) {
          const position = document.caretPositionFromPoint(e.clientX, e.clientY);
          native = document.createRange();
          native.setStart(position.offsetNode, position.offset);
          native.setEnd(position.offsetNode, position.offset);
        }
        const normalized = native && quill.selection.normalizeNative(native);
        if (normalized) {
          const range = quill.selection.normalizedToRange(normalized);
          if (e.dataTransfer?.files) {
            this.upload(range, e.dataTransfer.files);
          }
        }
      });
    }
    upload(range, files) {
      const uploads = [];
      Array.from(files).forEach((file) => {
        if (file && this.options.mimetypes?.includes(file.type)) {
          uploads.push(file);
        }
      });
      if (uploads.length > 0) {
        this.options.handler.call(this, range, uploads);
      }
    }
  };
  Uploader.DEFAULTS = {
    mimetypes: ["image/png", "image/jpeg"],
    handler(range, files) {
      const promises = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target.result);
          };
          reader.readAsDataURL(file);
        });
      });
      Promise.all(promises).then((images) => {
        const update = images.reduce((delta, image) => {
          return delta.insert({
            image
          });
        }, new import_quill_delta7.default().retain(range.index).delete(range.length));
        this.quill.updateContents(update, emitter_default.sources.USER);
        this.quill.setSelection(range.index + images.length, emitter_default.sources.SILENT);
      });
    }
  };
  var uploader_default = Uploader;

  // node_modules/quill/core.js
  var import_quill_delta9 = __toESM(require_Delta(), 1);

  // node_modules/quill/modules/input.js
  var import_quill_delta8 = __toESM(require_Delta(), 1);
  var INSERT_TYPES = ["insertText", "insertReplacementText"];
  var Input = class extends module_default {
    static {
      __name(this, "Input");
    }
    constructor(quill, options) {
      super(quill, options);
      quill.root.addEventListener("beforeinput", (event) => {
        this.handleBeforeInput(event);
      });
      if (!/Android/i.test(navigator.userAgent)) {
        quill.on(Quill.events.COMPOSITION_BEFORE_START, () => {
          this.handleCompositionStart();
        });
      }
    }
    deleteRange(range) {
      deleteRange({
        range,
        quill: this.quill
      });
    }
    replaceText(range) {
      let text = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      if (range.length === 0)
        return false;
      if (text) {
        const formats = this.quill.getFormat(range.index, 1);
        this.deleteRange(range);
        this.quill.updateContents(new import_quill_delta8.default().retain(range.index).insert(text, formats), Quill.sources.USER);
      } else {
        this.deleteRange(range);
      }
      this.quill.setSelection(range.index + text.length, 0, Quill.sources.SILENT);
      return true;
    }
    handleBeforeInput(event) {
      if (this.quill.composition.isComposing || event.defaultPrevented || !INSERT_TYPES.includes(event.inputType)) {
        return;
      }
      const staticRange = event.getTargetRanges ? event.getTargetRanges()[0] : null;
      if (!staticRange || staticRange.collapsed === true) {
        return;
      }
      const text = getPlainTextFromInputEvent(event);
      if (text == null) {
        return;
      }
      const normalized = this.quill.selection.normalizeNative(staticRange);
      const range = normalized ? this.quill.selection.normalizedToRange(normalized) : null;
      if (range && this.replaceText(range, text)) {
        event.preventDefault();
      }
    }
    handleCompositionStart() {
      const range = this.quill.getSelection();
      if (range) {
        this.replaceText(range);
      }
    }
  };
  function getPlainTextFromInputEvent(event) {
    if (typeof event.data === "string") {
      return event.data;
    }
    if (event.dataTransfer?.types.includes("text/plain")) {
      return event.dataTransfer.getData("text/plain");
    }
    return null;
  }
  __name(getPlainTextFromInputEvent, "getPlainTextFromInputEvent");
  var input_default = Input;

  // node_modules/quill/modules/uiNode.js
  var isMac = /Mac/i.test(navigator.platform);
  var TTL_FOR_VALID_SELECTION_CHANGE = 100;
  var canMoveCaretBeforeUINode = /* @__PURE__ */ __name((event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight" || // RTL scripts or moving from the end of the previous line
    event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "Home") {
      return true;
    }
    if (isMac && event.key === "a" && event.ctrlKey === true) {
      return true;
    }
    return false;
  }, "canMoveCaretBeforeUINode");
  var UINode = class extends module_default {
    static {
      __name(this, "UINode");
    }
    isListening = false;
    selectionChangeDeadline = 0;
    constructor(quill, options) {
      super(quill, options);
      this.handleArrowKeys();
      this.handleNavigationShortcuts();
    }
    handleArrowKeys() {
      this.quill.keyboard.addBinding({
        key: ["ArrowLeft", "ArrowRight"],
        offset: 0,
        shiftKey: null,
        handler(range, _ref) {
          let {
            line,
            event
          } = _ref;
          if (!(line instanceof ParentBlot$1) || !line.uiNode) {
            return true;
          }
          const isRTL = getComputedStyle(line.domNode)["direction"] === "rtl";
          if (isRTL && event.key !== "ArrowRight" || !isRTL && event.key !== "ArrowLeft") {
            return true;
          }
          this.quill.setSelection(range.index - 1, range.length + (event.shiftKey ? 1 : 0), Quill.sources.USER);
          return false;
        }
      });
    }
    handleNavigationShortcuts() {
      this.quill.root.addEventListener("keydown", (event) => {
        if (!event.defaultPrevented && canMoveCaretBeforeUINode(event)) {
          this.ensureListeningToSelectionChange();
        }
      });
    }
    /**
     * We only listen to the `selectionchange` event when
     * there is an intention of moving the caret to the beginning using shortcuts.
     * This is primarily implemented to prevent infinite loops, as we are changing
     * the selection within the handler of a `selectionchange` event.
     */
    ensureListeningToSelectionChange() {
      this.selectionChangeDeadline = Date.now() + TTL_FOR_VALID_SELECTION_CHANGE;
      if (this.isListening)
        return;
      this.isListening = true;
      const listener = /* @__PURE__ */ __name(() => {
        this.isListening = false;
        if (Date.now() <= this.selectionChangeDeadline) {
          this.handleSelectionChange();
        }
      }, "listener");
      document.addEventListener("selectionchange", listener, {
        once: true
      });
    }
    handleSelectionChange() {
      const selection = document.getSelection();
      if (!selection)
        return;
      const range = selection.getRangeAt(0);
      if (range.collapsed !== true || range.startOffset !== 0)
        return;
      const line = this.quill.scroll.find(range.startContainer);
      if (!(line instanceof ParentBlot$1) || !line.uiNode)
        return;
      const newRange = document.createRange();
      newRange.setStartAfter(line.uiNode);
      newRange.setEndAfter(line.uiNode);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  };
  var uiNode_default = UINode;

  // node_modules/quill/core.js
  Quill.register({
    "blots/block": Block,
    "blots/block/embed": BlockEmbed,
    "blots/break": break_default,
    "blots/container": container_default,
    "blots/cursor": cursor_default,
    "blots/embed": embed_default,
    "blots/inline": inline_default,
    "blots/scroll": scroll_default,
    "blots/text": Text2,
    "modules/clipboard": Clipboard,
    "modules/history": History,
    "modules/keyboard": Keyboard,
    "modules/uploader": uploader_default,
    "modules/input": input_default,
    "modules/uiNode": uiNode_default
  });
  var core_default = Quill;

  // node_modules/quill/formats/indent.js
  var IndentAttributor = class extends ClassAttributor$1 {
    static {
      __name(this, "IndentAttributor");
    }
    add(node, value) {
      let normalizedValue = 0;
      if (value === "+1" || value === "-1") {
        const indent = this.value(node) || 0;
        normalizedValue = value === "+1" ? indent + 1 : indent - 1;
      } else if (typeof value === "number") {
        normalizedValue = value;
      }
      if (normalizedValue === 0) {
        this.remove(node);
        return true;
      }
      return super.add(node, normalizedValue.toString());
    }
    canAdd(node, value) {
      return super.canAdd(node, value) || super.canAdd(node, parseInt(value, 10));
    }
    value(node) {
      return parseInt(super.value(node), 10) || void 0;
    }
  };
  var IndentClass = new IndentAttributor("indent", "ql-indent", {
    scope: Scope.BLOCK,
    // @ts-expect-error
    whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
  });
  var indent_default = IndentClass;

  // node_modules/quill/formats/blockquote.js
  var Blockquote = class extends Block {
    static {
      __name(this, "Blockquote");
    }
    static blotName = "blockquote";
    static tagName = "blockquote";
  };
  var blockquote_default = Blockquote;

  // node_modules/quill/formats/header.js
  var Header = class extends Block {
    static {
      __name(this, "Header");
    }
    static blotName = "header";
    static tagName = ["H1", "H2", "H3", "H4", "H5", "H6"];
    static formats(domNode) {
      return this.tagName.indexOf(domNode.tagName) + 1;
    }
  };
  var header_default = Header;

  // node_modules/quill/formats/list.js
  var ListContainer = class extends container_default {
    static {
      __name(this, "ListContainer");
    }
  };
  ListContainer.blotName = "list-container";
  ListContainer.tagName = "OL";
  var ListItem = class extends Block {
    static {
      __name(this, "ListItem");
    }
    static create(value) {
      const node = super.create();
      node.setAttribute("data-list", value);
      return node;
    }
    static formats(domNode) {
      return domNode.getAttribute("data-list") || void 0;
    }
    static register() {
      Quill.register(ListContainer);
    }
    constructor(scroll, domNode) {
      super(scroll, domNode);
      const ui = domNode.ownerDocument.createElement("span");
      const listEventHandler = /* @__PURE__ */ __name((e) => {
        if (!scroll.isEnabled())
          return;
        const format = this.statics.formats(domNode, scroll);
        if (format === "checked") {
          this.format("list", "unchecked");
          e.preventDefault();
        } else if (format === "unchecked") {
          this.format("list", "checked");
          e.preventDefault();
        }
      }, "listEventHandler");
      ui.addEventListener("mousedown", listEventHandler);
      ui.addEventListener("touchstart", listEventHandler);
      this.attachUI(ui);
    }
    format(name, value) {
      if (name === this.statics.blotName && value) {
        this.domNode.setAttribute("data-list", value);
      } else {
        super.format(name, value);
      }
    }
  };
  ListItem.blotName = "list";
  ListItem.tagName = "LI";
  ListContainer.allowedChildren = [ListItem];
  ListItem.requiredContainer = ListContainer;

  // node_modules/quill/formats/bold.js
  var Bold = class extends inline_default {
    static {
      __name(this, "Bold");
    }
    static blotName = "bold";
    static tagName = ["STRONG", "B"];
    static create() {
      return super.create();
    }
    static formats() {
      return true;
    }
    optimize(context) {
      super.optimize(context);
      if (this.domNode.tagName !== this.statics.tagName[0]) {
        this.replaceWith(this.statics.blotName);
      }
    }
  };
  var bold_default = Bold;

  // node_modules/quill/formats/italic.js
  var Italic = class extends bold_default {
    static {
      __name(this, "Italic");
    }
    static blotName = "italic";
    static tagName = ["EM", "I"];
  };
  var italic_default = Italic;

  // node_modules/quill/formats/link.js
  var Link = class extends inline_default {
    static {
      __name(this, "Link");
    }
    static blotName = "link";
    static tagName = "A";
    static SANITIZED_URL = "about:blank";
    static PROTOCOL_WHITELIST = ["http", "https", "mailto", "tel", "sms"];
    static create(value) {
      const node = super.create(value);
      node.setAttribute("href", this.sanitize(value));
      node.setAttribute("rel", "noopener noreferrer");
      node.setAttribute("target", "_blank");
      return node;
    }
    static formats(domNode) {
      return domNode.getAttribute("href");
    }
    static sanitize(url) {
      return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL;
    }
    format(name, value) {
      if (name !== this.statics.blotName || !value) {
        super.format(name, value);
      } else {
        this.domNode.setAttribute("href", this.constructor.sanitize(value));
      }
    }
  };
  function sanitize(url, protocols) {
    const anchor = document.createElement("a");
    anchor.href = url;
    const protocol = anchor.href.slice(0, anchor.href.indexOf(":"));
    return protocols.indexOf(protocol) > -1;
  }
  __name(sanitize, "sanitize");

  // node_modules/quill/formats/script.js
  var Script = class extends inline_default {
    static {
      __name(this, "Script");
    }
    static blotName = "script";
    static tagName = ["SUB", "SUP"];
    static create(value) {
      if (value === "super") {
        return document.createElement("sup");
      }
      if (value === "sub") {
        return document.createElement("sub");
      }
      return super.create(value);
    }
    static formats(domNode) {
      if (domNode.tagName === "SUB")
        return "sub";
      if (domNode.tagName === "SUP")
        return "super";
      return void 0;
    }
  };
  var script_default = Script;

  // node_modules/quill/formats/strike.js
  var Strike = class extends bold_default {
    static {
      __name(this, "Strike");
    }
    static blotName = "strike";
    static tagName = ["S", "STRIKE"];
  };
  var strike_default = Strike;

  // node_modules/quill/formats/underline.js
  var Underline = class extends inline_default {
    static {
      __name(this, "Underline");
    }
    static blotName = "underline";
    static tagName = "U";
  };
  var underline_default = Underline;

  // node_modules/quill/formats/formula.js
  var Formula = class extends embed_default {
    static {
      __name(this, "Formula");
    }
    static blotName = "formula";
    static className = "ql-formula";
    static tagName = "SPAN";
    static create(value) {
      if (window.katex == null) {
        throw new Error("Formula module requires KaTeX.");
      }
      const node = super.create(value);
      if (typeof value === "string") {
        window.katex.render(value, node, {
          throwOnError: false,
          errorColor: "#f00"
        });
        node.setAttribute("data-value", value);
      }
      return node;
    }
    static value(domNode) {
      return domNode.getAttribute("data-value");
    }
    html() {
      const {
        formula
      } = this.value();
      return `<span>${formula}</span>`;
    }
  };
  var formula_default = Formula;

  // node_modules/quill/formats/image.js
  var ATTRIBUTES = ["alt", "height", "width"];
  var Image = class extends EmbedBlot$1 {
    static {
      __name(this, "Image");
    }
    static blotName = "image";
    static tagName = "IMG";
    static create(value) {
      const node = super.create(value);
      if (typeof value === "string") {
        node.setAttribute("src", this.sanitize(value));
      }
      return node;
    }
    static formats(domNode) {
      return ATTRIBUTES.reduce((formats, attribute) => {
        if (domNode.hasAttribute(attribute)) {
          formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
      }, {});
    }
    static match(url) {
      return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
    }
    static sanitize(url) {
      return sanitize(url, ["http", "https", "data"]) ? url : "//:0";
    }
    static value(domNode) {
      return domNode.getAttribute("src");
    }
    format(name, value) {
      if (ATTRIBUTES.indexOf(name) > -1) {
        if (value) {
          this.domNode.setAttribute(name, value);
        } else {
          this.domNode.removeAttribute(name);
        }
      } else {
        super.format(name, value);
      }
    }
  };
  var image_default = Image;

  // node_modules/quill/formats/video.js
  var ATTRIBUTES2 = ["height", "width"];
  var Video = class extends BlockEmbed {
    static {
      __name(this, "Video");
    }
    static blotName = "video";
    static className = "ql-video";
    static tagName = "IFRAME";
    static create(value) {
      const node = super.create(value);
      node.setAttribute("frameborder", "0");
      node.setAttribute("allowfullscreen", "true");
      node.setAttribute("src", this.sanitize(value));
      return node;
    }
    static formats(domNode) {
      return ATTRIBUTES2.reduce((formats, attribute) => {
        if (domNode.hasAttribute(attribute)) {
          formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
      }, {});
    }
    static sanitize(url) {
      return Link.sanitize(url);
    }
    static value(domNode) {
      return domNode.getAttribute("src");
    }
    format(name, value) {
      if (ATTRIBUTES2.indexOf(name) > -1) {
        if (value) {
          this.domNode.setAttribute(name, value);
        } else {
          this.domNode.removeAttribute(name);
        }
      } else {
        super.format(name, value);
      }
    }
    html() {
      const {
        video
      } = this.value();
      return `<a href="${video}">${video}</a>`;
    }
  };
  var video_default = Video;

  // node_modules/quill/modules/syntax.js
  var import_quill_delta10 = __toESM(require_Delta(), 1);
  var TokenAttributor = new ClassAttributor$1("code-token", "hljs", {
    scope: Scope.INLINE
  });
  var CodeToken = class _CodeToken extends inline_default {
    static {
      __name(this, "CodeToken");
    }
    static formats(node, scroll) {
      while (node != null && node !== scroll.domNode) {
        if (node.classList && node.classList.contains(CodeBlock.className)) {
          return super.formats(node, scroll);
        }
        node = node.parentNode;
      }
      return void 0;
    }
    constructor(scroll, domNode, value) {
      super(scroll, domNode, value);
      TokenAttributor.add(this.domNode, value);
    }
    format(format, value) {
      if (format !== _CodeToken.blotName) {
        super.format(format, value);
      } else if (value) {
        TokenAttributor.add(this.domNode, value);
      } else {
        TokenAttributor.remove(this.domNode);
        this.domNode.classList.remove(this.statics.className);
      }
    }
    optimize() {
      super.optimize(...arguments);
      if (!TokenAttributor.value(this.domNode)) {
        this.unwrap();
      }
    }
  };
  CodeToken.blotName = "code-token";
  CodeToken.className = "ql-token";
  var SyntaxCodeBlock = class extends CodeBlock {
    static {
      __name(this, "SyntaxCodeBlock");
    }
    static create(value) {
      const domNode = super.create(value);
      if (typeof value === "string") {
        domNode.setAttribute("data-language", value);
      }
      return domNode;
    }
    static formats(domNode) {
      return domNode.getAttribute("data-language") || "plain";
    }
    static register() {
    }
    // Syntax module will register
    format(name, value) {
      if (name === this.statics.blotName && value) {
        this.domNode.setAttribute("data-language", value);
      } else {
        super.format(name, value);
      }
    }
    replaceWith(name, value) {
      this.formatAt(0, this.length(), CodeToken.blotName, false);
      return super.replaceWith(name, value);
    }
  };
  var SyntaxCodeBlockContainer = class extends CodeBlockContainer {
    static {
      __name(this, "SyntaxCodeBlockContainer");
    }
    attach() {
      super.attach();
      this.forceNext = false;
      this.scroll.emitMount(this);
    }
    format(name, value) {
      if (name === SyntaxCodeBlock.blotName) {
        this.forceNext = true;
        this.children.forEach((child) => {
          child.format(name, value);
        });
      }
    }
    formatAt(index, length, name, value) {
      if (name === SyntaxCodeBlock.blotName) {
        this.forceNext = true;
      }
      super.formatAt(index, length, name, value);
    }
    highlight(highlight2) {
      let forced = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      if (this.children.head == null)
        return;
      const nodes = Array.from(this.domNode.childNodes).filter((node) => node !== this.uiNode);
      const text = `${nodes.map((node) => node.textContent).join("\n")}
`;
      const language = SyntaxCodeBlock.formats(this.children.head.domNode);
      if (forced || this.forceNext || this.cachedText !== text) {
        if (text.trim().length > 0 || this.cachedText == null) {
          const oldDelta = this.children.reduce((delta2, child) => {
            return delta2.concat(blockDelta(child, false));
          }, new import_quill_delta10.default());
          const delta = highlight2(text, language);
          oldDelta.diff(delta).reduce((index, _ref) => {
            let {
              retain,
              attributes
            } = _ref;
            if (!retain)
              return index;
            if (attributes) {
              Object.keys(attributes).forEach((format) => {
                if ([SyntaxCodeBlock.blotName, CodeToken.blotName].includes(format)) {
                  this.formatAt(index, retain, format, attributes[format]);
                }
              });
            }
            return index + retain;
          }, 0);
        }
        this.cachedText = text;
        this.forceNext = false;
      }
    }
    html(index, length) {
      const [codeBlock] = this.children.find(index);
      const language = codeBlock ? SyntaxCodeBlock.formats(codeBlock.domNode) : "plain";
      return `<pre data-language="${language}">
${escapeText(this.code(index, length))}
</pre>`;
    }
    optimize(context) {
      super.optimize(context);
      if (this.parent != null && this.children.head != null && this.uiNode != null) {
        const language = SyntaxCodeBlock.formats(this.children.head.domNode);
        if (language !== this.uiNode.value) {
          this.uiNode.value = language;
        }
      }
    }
  };
  SyntaxCodeBlockContainer.allowedChildren = [SyntaxCodeBlock];
  SyntaxCodeBlock.requiredContainer = SyntaxCodeBlockContainer;
  SyntaxCodeBlock.allowedChildren = [CodeToken, cursor_default, Text2, break_default];
  var highlight = /* @__PURE__ */ __name((lib, language, text) => {
    if (typeof lib.versionString === "string") {
      const majorVersion = lib.versionString.split(".")[0];
      if (parseInt(majorVersion, 10) >= 11) {
        return lib.highlight(text, {
          language
        }).value;
      }
    }
    return lib.highlight(language, text).value;
  }, "highlight");
  var Syntax = class extends module_default {
    static {
      __name(this, "Syntax");
    }
    static register() {
      Quill.register(CodeToken, true);
      Quill.register(SyntaxCodeBlock, true);
      Quill.register(SyntaxCodeBlockContainer, true);
    }
    constructor(quill, options) {
      super(quill, options);
      if (this.options.hljs == null) {
        throw new Error("Syntax module requires highlight.js. Please include the library on the page before Quill.");
      }
      this.languages = this.options.languages.reduce((memo, _ref2) => {
        let {
          key
        } = _ref2;
        memo[key] = true;
        return memo;
      }, {});
      this.highlightBlot = this.highlightBlot.bind(this);
      this.initListener();
      this.initTimer();
    }
    initListener() {
      this.quill.on(Quill.events.SCROLL_BLOT_MOUNT, (blot) => {
        if (!(blot instanceof SyntaxCodeBlockContainer))
          return;
        const select = this.quill.root.ownerDocument.createElement("select");
        this.options.languages.forEach((_ref3) => {
          let {
            key,
            label
          } = _ref3;
          const option = select.ownerDocument.createElement("option");
          option.textContent = label;
          option.setAttribute("value", key);
          select.appendChild(option);
        });
        select.addEventListener("change", () => {
          blot.format(SyntaxCodeBlock.blotName, select.value);
          this.quill.root.focus();
          this.highlight(blot, true);
        });
        if (blot.uiNode == null) {
          blot.attachUI(select);
          if (blot.children.head) {
            select.value = SyntaxCodeBlock.formats(blot.children.head.domNode);
          }
        }
      });
    }
    initTimer() {
      let timer = null;
      this.quill.on(Quill.events.SCROLL_OPTIMIZE, () => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          this.highlight();
          timer = null;
        }, this.options.interval);
      });
    }
    highlight() {
      let blot = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
      let force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      if (this.quill.selection.composing)
        return;
      this.quill.update(Quill.sources.USER);
      const range = this.quill.getSelection();
      const blots = blot == null ? this.quill.scroll.descendants(SyntaxCodeBlockContainer) : [blot];
      blots.forEach((container) => {
        container.highlight(this.highlightBlot, force);
      });
      this.quill.update(Quill.sources.SILENT);
      if (range != null) {
        this.quill.setSelection(range, Quill.sources.SILENT);
      }
    }
    highlightBlot(text) {
      let language = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "plain";
      language = this.languages[language] ? language : "plain";
      if (language === "plain") {
        return escapeText(text).split("\n").reduce((delta, line, i) => {
          if (i !== 0) {
            delta.insert("\n", {
              [CodeBlock.blotName]: language
            });
          }
          return delta.insert(line);
        }, new import_quill_delta10.default());
      }
      const container = this.quill.root.ownerDocument.createElement("div");
      container.classList.add(CodeBlock.className);
      container.innerHTML = highlight(this.options.hljs, language, text);
      return traverse(this.quill.scroll, container, [(node, delta) => {
        const value = TokenAttributor.value(node);
        if (value) {
          return delta.compose(new import_quill_delta10.default().retain(delta.length(), {
            [CodeToken.blotName]: value
          }));
        }
        return delta;
      }], [(node, delta) => {
        return node.data.split("\n").reduce((memo, nodeText, i) => {
          if (i !== 0)
            memo.insert("\n", {
              [CodeBlock.blotName]: language
            });
          return memo.insert(nodeText);
        }, delta);
      }], /* @__PURE__ */ new WeakMap());
    }
  };
  Syntax.DEFAULTS = {
    hljs: (() => {
      return window.hljs;
    })(),
    interval: 1e3,
    languages: [{
      key: "plain",
      label: "Plain"
    }, {
      key: "bash",
      label: "Bash"
    }, {
      key: "cpp",
      label: "C++"
    }, {
      key: "cs",
      label: "C#"
    }, {
      key: "css",
      label: "CSS"
    }, {
      key: "diff",
      label: "Diff"
    }, {
      key: "xml",
      label: "HTML/XML"
    }, {
      key: "java",
      label: "Java"
    }, {
      key: "javascript",
      label: "JavaScript"
    }, {
      key: "markdown",
      label: "Markdown"
    }, {
      key: "php",
      label: "PHP"
    }, {
      key: "python",
      label: "Python"
    }, {
      key: "ruby",
      label: "Ruby"
    }, {
      key: "sql",
      label: "SQL"
    }]
  };

  // node_modules/quill/modules/table.js
  var import_quill_delta11 = __toESM(require_Delta(), 1);

  // node_modules/quill/formats/table.js
  var TableCell = class _TableCell extends Block {
    static {
      __name(this, "TableCell");
    }
    static blotName = "table";
    static tagName = "TD";
    static create(value) {
      const node = super.create();
      if (value) {
        node.setAttribute("data-row", value);
      } else {
        node.setAttribute("data-row", tableId());
      }
      return node;
    }
    static formats(domNode) {
      if (domNode.hasAttribute("data-row")) {
        return domNode.getAttribute("data-row");
      }
      return void 0;
    }
    cellOffset() {
      if (this.parent) {
        return this.parent.children.indexOf(this);
      }
      return -1;
    }
    format(name, value) {
      if (name === _TableCell.blotName && value) {
        this.domNode.setAttribute("data-row", value);
      } else {
        super.format(name, value);
      }
    }
    row() {
      return this.parent;
    }
    rowOffset() {
      if (this.row()) {
        return this.row().rowOffset();
      }
      return -1;
    }
    table() {
      return this.row() && this.row().table();
    }
  };
  var TableRow = class extends container_default {
    static {
      __name(this, "TableRow");
    }
    static blotName = "table-row";
    static tagName = "TR";
    checkMerge() {
      if (super.checkMerge() && this.next.children.head != null) {
        const thisHead = this.children.head.formats();
        const thisTail = this.children.tail.formats();
        const nextHead = this.next.children.head.formats();
        const nextTail = this.next.children.tail.formats();
        return thisHead.table === thisTail.table && thisHead.table === nextHead.table && thisHead.table === nextTail.table;
      }
      return false;
    }
    optimize(context) {
      super.optimize(context);
      this.children.forEach((child) => {
        if (child.next == null)
          return;
        const childFormats = child.formats();
        const nextFormats = child.next.formats();
        if (childFormats.table !== nextFormats.table) {
          const next = this.splitAfter(child);
          if (next) {
            next.optimize();
          }
          if (this.prev) {
            this.prev.optimize();
          }
        }
      });
    }
    rowOffset() {
      if (this.parent) {
        return this.parent.children.indexOf(this);
      }
      return -1;
    }
    table() {
      return this.parent && this.parent.parent;
    }
  };
  var TableBody = class extends container_default {
    static {
      __name(this, "TableBody");
    }
    static blotName = "table-body";
    static tagName = "TBODY";
  };
  var TableContainer = class extends container_default {
    static {
      __name(this, "TableContainer");
    }
    static blotName = "table-container";
    static tagName = "TABLE";
    balanceCells() {
      const rows = this.descendants(TableRow);
      const maxColumns = rows.reduce((max, row) => {
        return Math.max(row.children.length, max);
      }, 0);
      rows.forEach((row) => {
        new Array(maxColumns - row.children.length).fill(0).forEach(() => {
          let value;
          if (row.children.head != null) {
            value = TableCell.formats(row.children.head.domNode);
          }
          const blot = this.scroll.create(TableCell.blotName, value);
          row.appendChild(blot);
          blot.optimize();
        });
      });
    }
    cells(column) {
      return this.rows().map((row) => row.children.at(column));
    }
    deleteColumn(index) {
      const [body] = this.descendant(TableBody);
      if (body == null || body.children.head == null)
        return;
      body.children.forEach((row) => {
        const cell = row.children.at(index);
        if (cell != null) {
          cell.remove();
        }
      });
    }
    insertColumn(index) {
      const [body] = this.descendant(TableBody);
      if (body == null || body.children.head == null)
        return;
      body.children.forEach((row) => {
        const ref = row.children.at(index);
        const value = TableCell.formats(row.children.head.domNode);
        const cell = this.scroll.create(TableCell.blotName, value);
        row.insertBefore(cell, ref);
      });
    }
    insertRow(index) {
      const [body] = this.descendant(TableBody);
      if (body == null || body.children.head == null)
        return;
      const id = tableId();
      const row = this.scroll.create(TableRow.blotName);
      body.children.head.children.forEach(() => {
        const cell = this.scroll.create(TableCell.blotName, id);
        row.appendChild(cell);
      });
      const ref = body.children.at(index);
      body.insertBefore(row, ref);
    }
    rows() {
      const body = this.children.head;
      if (body == null)
        return [];
      return body.children.map((row) => row);
    }
  };
  TableContainer.allowedChildren = [TableBody];
  TableBody.requiredContainer = TableContainer;
  TableBody.allowedChildren = [TableRow];
  TableRow.requiredContainer = TableBody;
  TableRow.allowedChildren = [TableCell];
  TableCell.requiredContainer = TableRow;
  function tableId() {
    const id = Math.random().toString(36).slice(2, 6);
    return `row-${id}`;
  }
  __name(tableId, "tableId");

  // node_modules/quill/modules/table.js
  var Table = class extends module_default {
    static {
      __name(this, "Table");
    }
    static register() {
      Quill.register(TableCell);
      Quill.register(TableRow);
      Quill.register(TableBody);
      Quill.register(TableContainer);
    }
    constructor() {
      super(...arguments);
      this.listenBalanceCells();
    }
    balanceTables() {
      this.quill.scroll.descendants(TableContainer).forEach((table) => {
        table.balanceCells();
      });
    }
    deleteColumn() {
      const [table, , cell] = this.getTable();
      if (cell == null)
        return;
      table.deleteColumn(cell.cellOffset());
      this.quill.update(Quill.sources.USER);
    }
    deleteRow() {
      const [, row] = this.getTable();
      if (row == null)
        return;
      row.remove();
      this.quill.update(Quill.sources.USER);
    }
    deleteTable() {
      const [table] = this.getTable();
      if (table == null)
        return;
      const offset = table.offset();
      table.remove();
      this.quill.update(Quill.sources.USER);
      this.quill.setSelection(offset, Quill.sources.SILENT);
    }
    getTable() {
      let range = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.quill.getSelection();
      if (range == null)
        return [null, null, null, -1];
      const [cell, offset] = this.quill.getLine(range.index);
      if (cell == null || cell.statics.blotName !== TableCell.blotName) {
        return [null, null, null, -1];
      }
      const row = cell.parent;
      const table = row.parent.parent;
      return [table, row, cell, offset];
    }
    insertColumn(offset) {
      const range = this.quill.getSelection();
      if (!range)
        return;
      const [table, row, cell] = this.getTable(range);
      if (cell == null)
        return;
      const column = cell.cellOffset();
      table.insertColumn(column + offset);
      this.quill.update(Quill.sources.USER);
      let shift = row.rowOffset();
      if (offset === 0) {
        shift += 1;
      }
      this.quill.setSelection(range.index + shift, range.length, Quill.sources.SILENT);
    }
    insertColumnLeft() {
      this.insertColumn(0);
    }
    insertColumnRight() {
      this.insertColumn(1);
    }
    insertRow(offset) {
      const range = this.quill.getSelection();
      if (!range)
        return;
      const [table, row, cell] = this.getTable(range);
      if (cell == null)
        return;
      const index = row.rowOffset();
      table.insertRow(index + offset);
      this.quill.update(Quill.sources.USER);
      if (offset > 0) {
        this.quill.setSelection(range, Quill.sources.SILENT);
      } else {
        this.quill.setSelection(range.index + row.children.length, range.length, Quill.sources.SILENT);
      }
    }
    insertRowAbove() {
      this.insertRow(0);
    }
    insertRowBelow() {
      this.insertRow(1);
    }
    insertTable(rows, columns) {
      const range = this.quill.getSelection();
      if (range == null)
        return;
      const delta = new Array(rows).fill(0).reduce((memo) => {
        const text = new Array(columns).fill("\n").join("");
        return memo.insert(text, {
          table: tableId()
        });
      }, new import_quill_delta11.default().retain(range.index));
      this.quill.updateContents(delta, Quill.sources.USER);
      this.quill.setSelection(range.index, Quill.sources.SILENT);
      this.balanceTables();
    }
    listenBalanceCells() {
      this.quill.on(Quill.events.SCROLL_OPTIMIZE, (mutations) => {
        mutations.some((mutation) => {
          if (["TD", "TR", "TBODY", "TABLE"].includes(mutation.target.tagName)) {
            this.quill.once(Quill.events.TEXT_CHANGE, (delta, old, source) => {
              if (source !== Quill.sources.USER)
                return;
              this.balanceTables();
            });
            return true;
          }
          return false;
        });
      });
    }
  };
  var table_default = Table;

  // node_modules/quill/modules/toolbar.js
  var import_quill_delta12 = __toESM(require_Delta(), 1);
  var debug7 = logger_default("quill:toolbar");
  var Toolbar = class extends module_default {
    static {
      __name(this, "Toolbar");
    }
    constructor(quill, options) {
      super(quill, options);
      if (Array.isArray(this.options.container)) {
        const container = document.createElement("div");
        container.setAttribute("role", "toolbar");
        addControls(container, this.options.container);
        quill.container?.parentNode?.insertBefore(container, quill.container);
        this.container = container;
      } else if (typeof this.options.container === "string") {
        this.container = document.querySelector(this.options.container);
      } else {
        this.container = this.options.container;
      }
      if (!(this.container instanceof HTMLElement)) {
        debug7.error("Container required for toolbar", this.options);
        return;
      }
      this.container.classList.add("ql-toolbar");
      this.controls = [];
      this.handlers = {};
      if (this.options.handlers) {
        Object.keys(this.options.handlers).forEach((format) => {
          const handler = this.options.handlers?.[format];
          if (handler) {
            this.addHandler(format, handler);
          }
        });
      }
      Array.from(this.container.querySelectorAll("button, select")).forEach((input) => {
        this.attach(input);
      });
      this.quill.on(Quill.events.EDITOR_CHANGE, () => {
        const [range] = this.quill.selection.getRange();
        this.update(range);
      });
    }
    addHandler(format, handler) {
      this.handlers[format] = handler;
    }
    attach(input) {
      let format = Array.from(input.classList).find((className) => {
        return className.indexOf("ql-") === 0;
      });
      if (!format)
        return;
      format = format.slice("ql-".length);
      if (input.tagName === "BUTTON") {
        input.setAttribute("type", "button");
      }
      if (this.handlers[format] == null && this.quill.scroll.query(format) == null) {
        debug7.warn("ignoring attaching to nonexistent format", format, input);
        return;
      }
      const eventName = input.tagName === "SELECT" ? "change" : "click";
      input.addEventListener(eventName, (e) => {
        let value;
        if (input.tagName === "SELECT") {
          if (input.selectedIndex < 0)
            return;
          const selected = input.options[input.selectedIndex];
          if (selected.hasAttribute("selected")) {
            value = false;
          } else {
            value = selected.value || false;
          }
        } else {
          if (input.classList.contains("ql-active")) {
            value = false;
          } else {
            value = input.value || !input.hasAttribute("value");
          }
          e.preventDefault();
        }
        this.quill.focus();
        const [range] = this.quill.selection.getRange();
        if (this.handlers[format] != null) {
          this.handlers[format].call(this, value);
        } else if (
          // @ts-expect-error
          this.quill.scroll.query(format).prototype instanceof EmbedBlot$1
        ) {
          value = prompt(`Enter ${format}`);
          if (!value)
            return;
          this.quill.updateContents(new import_quill_delta12.default().retain(range.index).delete(range.length).insert({
            [format]: value
          }), Quill.sources.USER);
        } else {
          this.quill.format(format, value, Quill.sources.USER);
        }
        this.update(range);
      });
      this.controls.push([format, input]);
    }
    update(range) {
      const formats = range == null ? {} : this.quill.getFormat(range);
      this.controls.forEach((pair) => {
        const [format, input] = pair;
        if (input.tagName === "SELECT") {
          let option = null;
          if (range == null) {
            option = null;
          } else if (formats[format] == null) {
            option = input.querySelector("option[selected]");
          } else if (!Array.isArray(formats[format])) {
            let value = formats[format];
            if (typeof value === "string") {
              value = value.replace(/"/g, '\\"');
            }
            option = input.querySelector(`option[value="${value}"]`);
          }
          if (option == null) {
            input.value = "";
            input.selectedIndex = -1;
          } else {
            option.selected = true;
          }
        } else if (range == null) {
          input.classList.remove("ql-active");
          input.setAttribute("aria-pressed", "false");
        } else if (input.hasAttribute("value")) {
          const value = formats[format];
          const isActive = value === input.getAttribute("value") || value != null && value.toString() === input.getAttribute("value") || value == null && !input.getAttribute("value");
          input.classList.toggle("ql-active", isActive);
          input.setAttribute("aria-pressed", isActive.toString());
        } else {
          const isActive = formats[format] != null;
          input.classList.toggle("ql-active", isActive);
          input.setAttribute("aria-pressed", isActive.toString());
        }
      });
    }
  };
  Toolbar.DEFAULTS = {};
  function addButton(container, format, value) {
    const input = document.createElement("button");
    input.setAttribute("type", "button");
    input.classList.add(`ql-${format}`);
    input.setAttribute("aria-pressed", "false");
    if (value != null) {
      input.value = value;
      input.setAttribute("aria-label", `${format}: ${value}`);
    } else {
      input.setAttribute("aria-label", format);
    }
    container.appendChild(input);
  }
  __name(addButton, "addButton");
  function addControls(container, groups) {
    if (!Array.isArray(groups[0])) {
      groups = [groups];
    }
    groups.forEach((controls) => {
      const group = document.createElement("span");
      group.classList.add("ql-formats");
      controls.forEach((control) => {
        if (typeof control === "string") {
          addButton(group, control);
        } else {
          const format = Object.keys(control)[0];
          const value = control[format];
          if (Array.isArray(value)) {
            addSelect(group, format, value);
          } else {
            addButton(group, format, value);
          }
        }
      });
      container.appendChild(group);
    });
  }
  __name(addControls, "addControls");
  function addSelect(container, format, values) {
    const input = document.createElement("select");
    input.classList.add(`ql-${format}`);
    values.forEach((value) => {
      const option = document.createElement("option");
      if (value !== false) {
        option.setAttribute("value", String(value));
      } else {
        option.setAttribute("selected", "selected");
      }
      input.appendChild(option);
    });
    container.appendChild(input);
  }
  __name(addSelect, "addSelect");
  Toolbar.DEFAULTS = {
    container: null,
    handlers: {
      clean() {
        const range = this.quill.getSelection();
        if (range == null)
          return;
        if (range.length === 0) {
          const formats = this.quill.getFormat();
          Object.keys(formats).forEach((name) => {
            if (this.quill.scroll.query(name, Scope.INLINE) != null) {
              this.quill.format(name, false, Quill.sources.USER);
            }
          });
        } else {
          this.quill.removeFormat(range, Quill.sources.USER);
        }
      },
      direction(value) {
        const {
          align
        } = this.quill.getFormat();
        if (value === "rtl" && align == null) {
          this.quill.format("align", "right", Quill.sources.USER);
        } else if (!value && align === "right") {
          this.quill.format("align", false, Quill.sources.USER);
        }
        this.quill.format("direction", value, Quill.sources.USER);
      },
      indent(value) {
        const range = this.quill.getSelection();
        const formats = this.quill.getFormat(range);
        const indent = parseInt(formats.indent || 0, 10);
        if (value === "+1" || value === "-1") {
          let modifier = value === "+1" ? 1 : -1;
          if (formats.direction === "rtl")
            modifier *= -1;
          this.quill.format("indent", indent + modifier, Quill.sources.USER);
        }
      },
      link(value) {
        if (value === true) {
          value = prompt("Enter link URL:");
        }
        this.quill.format("link", value, Quill.sources.USER);
      },
      list(value) {
        const range = this.quill.getSelection();
        const formats = this.quill.getFormat(range);
        if (value === "check") {
          if (formats.list === "checked" || formats.list === "unchecked") {
            this.quill.format("list", false, Quill.sources.USER);
          } else {
            this.quill.format("list", "unchecked", Quill.sources.USER);
          }
        } else {
          this.quill.format("list", value, Quill.sources.USER);
        }
      }
    }
  };

  // node_modules/quill/ui/icons.js
  var alignLeftIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"/></svg>';
  var alignCenterIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="14" x2="4" y1="14" y2="14"/><line class="ql-stroke" x1="12" x2="6" y1="4" y2="4"/></svg>';
  var alignRightIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="15" x2="5" y1="14" y2="14"/><line class="ql-stroke" x1="15" x2="9" y1="4" y2="4"/></svg>';
  var alignJustifyIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="15" x2="3" y1="14" y2="14"/><line class="ql-stroke" x1="15" x2="3" y1="4" y2="4"/></svg>';
  var backgroundIcon = '<svg viewbox="0 0 18 18"><g class="ql-fill ql-color-label"><polygon points="6 6.868 6 6 5 6 5 7 5.942 7 6 6.868"/><rect height="1" width="1" x="4" y="4"/><polygon points="6.817 5 6 5 6 6 6.38 6 6.817 5"/><rect height="1" width="1" x="2" y="6"/><rect height="1" width="1" x="3" y="5"/><rect height="1" width="1" x="4" y="7"/><polygon points="4 11.439 4 11 3 11 3 12 3.755 12 4 11.439"/><rect height="1" width="1" x="2" y="12"/><rect height="1" width="1" x="2" y="9"/><rect height="1" width="1" x="2" y="15"/><polygon points="4.63 10 4 10 4 11 4.192 11 4.63 10"/><rect height="1" width="1" x="3" y="8"/><path d="M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z"/><path d="M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z"/><path d="M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z"/><rect height="1" width="1" x="12" y="2"/><rect height="1" width="1" x="11" y="3"/><path d="M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z"/><rect height="1" width="1" x="2" y="3"/><rect height="1" width="1" x="6" y="2"/><rect height="1" width="1" x="3" y="2"/><rect height="1" width="1" x="5" y="3"/><rect height="1" width="1" x="9" y="2"/><rect height="1" width="1" x="15" y="14"/><polygon points="13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174"/><rect height="1" width="1" x="13" y="7"/><rect height="1" width="1" x="15" y="5"/><rect height="1" width="1" x="14" y="6"/><rect height="1" width="1" x="15" y="8"/><rect height="1" width="1" x="14" y="9"/><path d="M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z"/><rect height="1" width="1" x="14" y="3"/><polygon points="12 6.868 12 6 11.62 6 12 6.868"/><rect height="1" width="1" x="15" y="2"/><rect height="1" width="1" x="12" y="5"/><rect height="1" width="1" x="13" y="4"/><polygon points="12.933 9 13 9 13 8 12.495 8 12.933 9"/><rect height="1" width="1" x="9" y="14"/><rect height="1" width="1" x="8" y="15"/><path d="M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z"/><rect height="1" width="1" x="5" y="15"/><path d="M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z"/><rect height="1" width="1" x="11" y="15"/><path d="M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z"/><rect height="1" width="1" x="14" y="15"/><rect height="1" width="1" x="15" y="11"/></g><polyline class="ql-stroke" points="5.5 13 9 5 12.5 13"/><line class="ql-stroke" x1="11.63" x2="6.38" y1="11" y2="11"/></svg>';
  var blockquoteIcon = '<svg viewbox="0 0 18 18"><rect class="ql-fill ql-stroke" height="3" width="3" x="4" y="5"/><rect class="ql-fill ql-stroke" height="3" width="3" x="11" y="5"/><path class="ql-even ql-fill ql-stroke" d="M7,8c0,4.031-3,5-3,5"/><path class="ql-even ql-fill ql-stroke" d="M14,8c0,4.031-3,5-3,5"/></svg>';
  var boldIcon = '<svg viewbox="0 0 18 18"><path class="ql-stroke" d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"/><path class="ql-stroke" d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"/></svg>';
  var cleanIcon = '<svg class="" viewbox="0 0 18 18"><line class="ql-stroke" x1="5" x2="13" y1="3" y2="3"/><line class="ql-stroke" x1="6" x2="9.35" y1="12" y2="3"/><line class="ql-stroke" x1="11" x2="15" y1="11" y2="15"/><line class="ql-stroke" x1="15" x2="11" y1="11" y2="15"/><rect class="ql-fill" height="1" rx="0.5" ry="0.5" width="7" x="2" y="14"/></svg>';
  var codeIcon = '<svg viewbox="0 0 18 18"><polyline class="ql-even ql-stroke" points="5 7 3 9 5 11"/><polyline class="ql-even ql-stroke" points="13 7 15 9 13 11"/><line class="ql-stroke" x1="10" x2="8" y1="5" y2="13"/></svg>';
  var colorIcon = '<svg viewbox="0 0 18 18"><line class="ql-color-label ql-stroke ql-transparent" x1="3" x2="15" y1="15" y2="15"/><polyline class="ql-stroke" points="5.5 11 9 3 12.5 11"/><line class="ql-stroke" x1="11.63" x2="6.38" y1="9" y2="9"/></svg>';
  var directionLeftToRightIcon = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke ql-fill" points="3 11 5 9 3 7 3 11"/><line class="ql-stroke ql-fill" x1="15" x2="11" y1="4" y2="4"/><path class="ql-fill" d="M11,3a3,3,0,0,0,0,6h1V3H11Z"/><rect class="ql-fill" height="11" width="1" x="11" y="4"/><rect class="ql-fill" height="11" width="1" x="13" y="4"/></svg>';
  var directionRightToLeftIcon = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke ql-fill" points="15 12 13 10 15 8 15 12"/><line class="ql-stroke ql-fill" x1="9" x2="5" y1="4" y2="4"/><path class="ql-fill" d="M5,3A3,3,0,0,0,5,9H6V3H5Z"/><rect class="ql-fill" height="11" width="1" x="5" y="4"/><rect class="ql-fill" height="11" width="1" x="7" y="4"/></svg>';
  var formulaIcon = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z"/><rect class="ql-fill" height="1.6" rx="0.8" ry="0.8" width="5" x="5.15" y="6.2"/><path class="ql-fill" d="M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z"/></svg>';
  var headerIcon = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm6.06787,9.209H14.98975V7.59863a.54085.54085,0,0,0-.605-.60547h-.62744a1.01119,1.01119,0,0,0-.748.29688L11.645,8.56641a.5435.5435,0,0,0-.022.8584l.28613.30762a.53861.53861,0,0,0,.84717.0332l.09912-.08789a1.2137,1.2137,0,0,0,.2417-.35254h.02246s-.01123.30859-.01123.60547V13.209H12.041a.54085.54085,0,0,0-.605.60547v.43945a.54085.54085,0,0,0,.605.60547h4.02686a.54085.54085,0,0,0,.605-.60547v-.43945A.54085.54085,0,0,0,16.06787,13.209Z"/></svg>';
  var header2Icon = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>';
  var italicIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="13" y1="4" y2="4"/><line class="ql-stroke" x1="5" x2="11" y1="14" y2="14"/><line class="ql-stroke" x1="8" x2="10" y1="14" y2="4"/></svg>';
  var imageIcon = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="10" width="12" x="3" y="4"/><circle class="ql-fill" cx="6" cy="7" r="1"/><polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"/></svg>';
  var indentIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-fill ql-stroke" points="3 7 3 11 5 9 3 7"/></svg>';
  var outdentIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-stroke" points="5 7 5 11 3 9 5 7"/></svg>';
  var linkIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="11" y1="7" y2="11"/><path class="ql-even ql-stroke" d="M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z"/><path class="ql-even ql-stroke" d="M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z"/></svg>';
  var listBulletIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="6" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="6" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="6" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="3" y1="4" y2="4"/><line class="ql-stroke" x1="3" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="3" x2="3" y1="14" y2="14"/></svg>';
  var listCheckIcon = '<svg class="" viewbox="0 0 18 18"><line class="ql-stroke" x1="9" x2="15" y1="4" y2="4"/><polyline class="ql-stroke" points="3 4 4 5 6 3"/><line class="ql-stroke" x1="9" x2="15" y1="14" y2="14"/><polyline class="ql-stroke" points="3 14 4 15 6 13"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-stroke" points="3 9 4 10 6 8"/></svg>';
  var listOrderedIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="7" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="7" x2="15" y1="14" y2="14"/><line class="ql-stroke ql-thin" x1="2.5" x2="4.5" y1="5.5" y2="5.5"/><path class="ql-fill" d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z"/><path class="ql-stroke ql-thin" d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156"/><path class="ql-stroke ql-thin" d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109"/></svg>';
  var subscriptIcon = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z"/><path class="ql-fill" d="M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z"/></svg>';
  var superscriptIcon = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z"/><path class="ql-fill" d="M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z"/></svg>';
  var strikeIcon = '<svg viewbox="0 0 18 18"><line class="ql-stroke ql-thin" x1="15.5" x2="2.5" y1="8.5" y2="9.5"/><path class="ql-fill" d="M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z"/><path class="ql-fill" d="M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z"/></svg>';
  var tableIcon = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="12" width="12" x="3" y="3"/><rect class="ql-fill" height="2" width="3" x="5" y="5"/><rect class="ql-fill" height="2" width="4" x="9" y="5"/><g class="ql-fill ql-transparent"><rect height="2" width="3" x="5" y="8"/><rect height="2" width="4" x="9" y="8"/><rect height="2" width="3" x="5" y="11"/><rect height="2" width="4" x="9" y="11"/></g></svg>';
  var underlineIcon = '<svg viewbox="0 0 18 18"><path class="ql-stroke" d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3"/><rect class="ql-fill" height="1" rx="0.5" ry="0.5" width="12" x="3" y="15"/></svg>';
  var videoIcon = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="12" width="12" x="3" y="3"/><rect class="ql-fill" height="12" width="1" x="5" y="3"/><rect class="ql-fill" height="12" width="1" x="12" y="3"/><rect class="ql-fill" height="2" width="8" x="5" y="8"/><rect class="ql-fill" height="1" width="3" x="3" y="5"/><rect class="ql-fill" height="1" width="3" x="3" y="7"/><rect class="ql-fill" height="1" width="3" x="3" y="10"/><rect class="ql-fill" height="1" width="3" x="3" y="12"/><rect class="ql-fill" height="1" width="3" x="12" y="5"/><rect class="ql-fill" height="1" width="3" x="12" y="7"/><rect class="ql-fill" height="1" width="3" x="12" y="10"/><rect class="ql-fill" height="1" width="3" x="12" y="12"/></svg>';
  var icons_default = {
    align: {
      "": alignLeftIcon,
      center: alignCenterIcon,
      right: alignRightIcon,
      justify: alignJustifyIcon
    },
    background: backgroundIcon,
    blockquote: blockquoteIcon,
    bold: boldIcon,
    clean: cleanIcon,
    code: codeIcon,
    "code-block": codeIcon,
    color: colorIcon,
    direction: {
      "": directionLeftToRightIcon,
      rtl: directionRightToLeftIcon
    },
    formula: formulaIcon,
    header: {
      "1": headerIcon,
      "2": header2Icon
    },
    italic: italicIcon,
    image: imageIcon,
    indent: {
      "+1": indentIcon,
      "-1": outdentIcon
    },
    link: linkIcon,
    list: {
      bullet: listBulletIcon,
      check: listCheckIcon,
      ordered: listOrderedIcon
    },
    script: {
      sub: subscriptIcon,
      super: superscriptIcon
    },
    strike: strikeIcon,
    table: tableIcon,
    underline: underlineIcon,
    video: videoIcon
  };

  // node_modules/quill/ui/picker.js
  var DropdownIcon = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke" points="7 11 9 13 11 11 7 11"/><polygon class="ql-stroke" points="7 7 9 5 11 7 7 7"/></svg>';
  var optionsCounter = 0;
  function toggleAriaAttribute(element, attribute) {
    element.setAttribute(attribute, `${!(element.getAttribute(attribute) === "true")}`);
  }
  __name(toggleAriaAttribute, "toggleAriaAttribute");
  var Picker = class {
    static {
      __name(this, "Picker");
    }
    constructor(select) {
      this.select = select;
      this.container = document.createElement("span");
      this.buildPicker();
      this.select.style.display = "none";
      this.select.parentNode.insertBefore(this.container, this.select);
      this.label.addEventListener("mousedown", () => {
        this.togglePicker();
      });
      this.label.addEventListener("keydown", (event) => {
        switch (event.key) {
          case "Enter":
            this.togglePicker();
            break;
          case "Escape":
            this.escape();
            event.preventDefault();
            break;
          default:
        }
      });
      this.select.addEventListener("change", this.update.bind(this));
    }
    togglePicker() {
      this.container.classList.toggle("ql-expanded");
      toggleAriaAttribute(this.label, "aria-expanded");
      toggleAriaAttribute(this.options, "aria-hidden");
    }
    buildItem(option) {
      const item = document.createElement("span");
      item.tabIndex = "0";
      item.setAttribute("role", "button");
      item.classList.add("ql-picker-item");
      const value = option.getAttribute("value");
      if (value) {
        item.setAttribute("data-value", value);
      }
      if (option.textContent) {
        item.setAttribute("data-label", option.textContent);
      }
      item.addEventListener("click", () => {
        this.selectItem(item, true);
      });
      item.addEventListener("keydown", (event) => {
        switch (event.key) {
          case "Enter":
            this.selectItem(item, true);
            event.preventDefault();
            break;
          case "Escape":
            this.escape();
            event.preventDefault();
            break;
          default:
        }
      });
      return item;
    }
    buildLabel() {
      const label = document.createElement("span");
      label.classList.add("ql-picker-label");
      label.innerHTML = DropdownIcon;
      label.tabIndex = "0";
      label.setAttribute("role", "button");
      label.setAttribute("aria-expanded", "false");
      this.container.appendChild(label);
      return label;
    }
    buildOptions() {
      const options = document.createElement("span");
      options.classList.add("ql-picker-options");
      options.setAttribute("aria-hidden", "true");
      options.tabIndex = "-1";
      options.id = `ql-picker-options-${optionsCounter}`;
      optionsCounter += 1;
      this.label.setAttribute("aria-controls", options.id);
      this.options = options;
      Array.from(this.select.options).forEach((option) => {
        const item = this.buildItem(option);
        options.appendChild(item);
        if (option.selected === true) {
          this.selectItem(item);
        }
      });
      this.container.appendChild(options);
    }
    buildPicker() {
      Array.from(this.select.attributes).forEach((item) => {
        this.container.setAttribute(item.name, item.value);
      });
      this.container.classList.add("ql-picker");
      this.label = this.buildLabel();
      this.buildOptions();
    }
    escape() {
      this.close();
      setTimeout(() => this.label.focus(), 1);
    }
    close() {
      this.container.classList.remove("ql-expanded");
      this.label.setAttribute("aria-expanded", "false");
      this.options.setAttribute("aria-hidden", "true");
    }
    selectItem(item) {
      let trigger = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      const selected = this.container.querySelector(".ql-selected");
      if (item === selected)
        return;
      if (selected != null) {
        selected.classList.remove("ql-selected");
      }
      if (item == null)
        return;
      item.classList.add("ql-selected");
      this.select.selectedIndex = Array.from(item.parentNode.children).indexOf(item);
      if (item.hasAttribute("data-value")) {
        this.label.setAttribute("data-value", item.getAttribute("data-value"));
      } else {
        this.label.removeAttribute("data-value");
      }
      if (item.hasAttribute("data-label")) {
        this.label.setAttribute("data-label", item.getAttribute("data-label"));
      } else {
        this.label.removeAttribute("data-label");
      }
      if (trigger) {
        this.select.dispatchEvent(new Event("change"));
        this.close();
      }
    }
    update() {
      let option;
      if (this.select.selectedIndex > -1) {
        const item = (
          // @ts-expect-error Fix me later
          this.container.querySelector(".ql-picker-options").children[this.select.selectedIndex]
        );
        option = this.select.options[this.select.selectedIndex];
        this.selectItem(item);
      } else {
        this.selectItem(null);
      }
      const isActive = option != null && option !== this.select.querySelector("option[selected]");
      this.label.classList.toggle("ql-active", isActive);
    }
  };
  var picker_default = Picker;

  // node_modules/quill/ui/color-picker.js
  var ColorPicker = class extends picker_default {
    static {
      __name(this, "ColorPicker");
    }
    constructor(select, label) {
      super(select);
      this.label.innerHTML = label;
      this.container.classList.add("ql-color-picker");
      Array.from(this.container.querySelectorAll(".ql-picker-item")).slice(0, 7).forEach((item) => {
        item.classList.add("ql-primary");
      });
    }
    buildItem(option) {
      const item = super.buildItem(option);
      item.style.backgroundColor = option.getAttribute("value") || "";
      return item;
    }
    selectItem(item, trigger) {
      super.selectItem(item, trigger);
      const colorLabel = this.label.querySelector(".ql-color-label");
      const value = item ? item.getAttribute("data-value") || "" : "";
      if (colorLabel) {
        if (colorLabel.tagName === "line") {
          colorLabel.style.stroke = value;
        } else {
          colorLabel.style.fill = value;
        }
      }
    }
  };
  var color_picker_default = ColorPicker;

  // node_modules/quill/ui/icon-picker.js
  var IconPicker = class extends picker_default {
    static {
      __name(this, "IconPicker");
    }
    constructor(select, icons) {
      super(select);
      this.container.classList.add("ql-icon-picker");
      Array.from(this.container.querySelectorAll(".ql-picker-item")).forEach((item) => {
        item.innerHTML = icons[item.getAttribute("data-value") || ""];
      });
      this.defaultItem = this.container.querySelector(".ql-selected");
      this.selectItem(this.defaultItem);
    }
    selectItem(target, trigger) {
      super.selectItem(target, trigger);
      const item = target || this.defaultItem;
      if (item != null) {
        if (this.label.innerHTML === item.innerHTML)
          return;
        this.label.innerHTML = item.innerHTML;
      }
    }
  };
  var icon_picker_default = IconPicker;

  // node_modules/quill/ui/tooltip.js
  var isScrollable = /* @__PURE__ */ __name((el) => {
    const {
      overflowY
    } = getComputedStyle(el, null);
    return overflowY !== "visible" && overflowY !== "clip";
  }, "isScrollable");
  var Tooltip = class {
    static {
      __name(this, "Tooltip");
    }
    constructor(quill, boundsContainer) {
      this.quill = quill;
      this.boundsContainer = boundsContainer || document.body;
      this.root = quill.addContainer("ql-tooltip");
      this.root.innerHTML = this.constructor.TEMPLATE;
      if (isScrollable(this.quill.root)) {
        this.quill.root.addEventListener("scroll", () => {
          this.root.style.marginTop = `${-1 * this.quill.root.scrollTop}px`;
        });
      }
      this.hide();
    }
    hide() {
      this.root.classList.add("ql-hidden");
    }
    position(reference) {
      const left = reference.left + reference.width / 2 - this.root.offsetWidth / 2;
      const top = reference.bottom + this.quill.root.scrollTop;
      this.root.style.left = `${left}px`;
      this.root.style.top = `${top}px`;
      this.root.classList.remove("ql-flip");
      const containerBounds = this.boundsContainer.getBoundingClientRect();
      const rootBounds = this.root.getBoundingClientRect();
      let shift = 0;
      if (rootBounds.right > containerBounds.right) {
        shift = containerBounds.right - rootBounds.right;
        this.root.style.left = `${left + shift}px`;
      }
      if (rootBounds.left < containerBounds.left) {
        shift = containerBounds.left - rootBounds.left;
        this.root.style.left = `${left + shift}px`;
      }
      if (rootBounds.bottom > containerBounds.bottom) {
        const height = rootBounds.bottom - rootBounds.top;
        const verticalShift = reference.bottom - reference.top + height;
        this.root.style.top = `${top - verticalShift}px`;
        this.root.classList.add("ql-flip");
      }
      return shift;
    }
    show() {
      this.root.classList.remove("ql-editing");
      this.root.classList.remove("ql-hidden");
    }
  };
  var tooltip_default = Tooltip;

  // node_modules/quill/themes/base.js
  var ALIGNS = [false, "center", "right", "justify"];
  var COLORS = ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"];
  var FONTS = [false, "serif", "monospace"];
  var HEADERS = ["1", "2", "3", false];
  var SIZES = ["small", false, "large", "huge"];
  var BaseTheme = class extends theme_default {
    static {
      __name(this, "BaseTheme");
    }
    constructor(quill, options) {
      super(quill, options);
      const listener = /* @__PURE__ */ __name((e) => {
        if (!document.body.contains(quill.root)) {
          document.body.removeEventListener("click", listener);
          return;
        }
        if (this.tooltip != null && // @ts-expect-error
        !this.tooltip.root.contains(e.target) && // @ts-expect-error
        document.activeElement !== this.tooltip.textbox && !this.quill.hasFocus()) {
          this.tooltip.hide();
        }
        if (this.pickers != null) {
          this.pickers.forEach((picker) => {
            if (!picker.container.contains(e.target)) {
              picker.close();
            }
          });
        }
      }, "listener");
      quill.emitter.listenDOM("click", document.body, listener);
    }
    addModule(name) {
      const module2 = super.addModule(name);
      if (name === "toolbar") {
        this.extendToolbar(module2);
      }
      return module2;
    }
    buildButtons(buttons, icons) {
      Array.from(buttons).forEach((button) => {
        const className = button.getAttribute("class") || "";
        className.split(/\s+/).forEach((name) => {
          if (!name.startsWith("ql-"))
            return;
          name = name.slice("ql-".length);
          if (icons[name] == null)
            return;
          if (name === "direction") {
            button.innerHTML = icons[name][""] + icons[name].rtl;
          } else if (typeof icons[name] === "string") {
            button.innerHTML = icons[name];
          } else {
            const value = button.value || "";
            if (value != null && icons[name][value]) {
              button.innerHTML = icons[name][value];
            }
          }
        });
      });
    }
    buildPickers(selects, icons) {
      this.pickers = Array.from(selects).map((select) => {
        if (select.classList.contains("ql-align")) {
          if (select.querySelector("option") == null) {
            fillSelect(select, ALIGNS);
          }
          if (typeof icons.align === "object") {
            return new icon_picker_default(select, icons.align);
          }
        }
        if (select.classList.contains("ql-background") || select.classList.contains("ql-color")) {
          const format = select.classList.contains("ql-background") ? "background" : "color";
          if (select.querySelector("option") == null) {
            fillSelect(select, COLORS, format === "background" ? "#ffffff" : "#000000");
          }
          return new color_picker_default(select, icons[format]);
        }
        if (select.querySelector("option") == null) {
          if (select.classList.contains("ql-font")) {
            fillSelect(select, FONTS);
          } else if (select.classList.contains("ql-header")) {
            fillSelect(select, HEADERS);
          } else if (select.classList.contains("ql-size")) {
            fillSelect(select, SIZES);
          }
        }
        return new picker_default(select);
      });
      const update = /* @__PURE__ */ __name(() => {
        this.pickers.forEach((picker) => {
          picker.update();
        });
      }, "update");
      this.quill.on(emitter_default.events.EDITOR_CHANGE, update);
    }
  };
  BaseTheme.DEFAULTS = merge_default({}, theme_default.DEFAULTS, {
    modules: {
      toolbar: {
        handlers: {
          formula() {
            this.quill.theme.tooltip.edit("formula");
          },
          image() {
            let fileInput = this.container.querySelector("input.ql-image[type=file]");
            if (fileInput == null) {
              fileInput = document.createElement("input");
              fileInput.setAttribute("type", "file");
              fileInput.setAttribute("accept", this.quill.uploader.options.mimetypes.join(", "));
              fileInput.classList.add("ql-image");
              fileInput.addEventListener("change", () => {
                const range = this.quill.getSelection(true);
                this.quill.uploader.upload(range, fileInput.files);
                fileInput.value = "";
              });
              this.container.appendChild(fileInput);
            }
            fileInput.click();
          },
          video() {
            this.quill.theme.tooltip.edit("video");
          }
        }
      }
    }
  });
  var BaseTooltip = class extends tooltip_default {
    static {
      __name(this, "BaseTooltip");
    }
    constructor(quill, boundsContainer) {
      super(quill, boundsContainer);
      this.textbox = this.root.querySelector('input[type="text"]');
      this.listen();
    }
    listen() {
      this.textbox.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          this.save();
          event.preventDefault();
        } else if (event.key === "Escape") {
          this.cancel();
          event.preventDefault();
        }
      });
    }
    cancel() {
      this.hide();
      this.restoreFocus();
    }
    edit() {
      let mode = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "link";
      let preview = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
      this.root.classList.remove("ql-hidden");
      this.root.classList.add("ql-editing");
      if (this.textbox == null)
        return;
      if (preview != null) {
        this.textbox.value = preview;
      } else if (mode !== this.root.getAttribute("data-mode")) {
        this.textbox.value = "";
      }
      const bounds = this.quill.getBounds(this.quill.selection.savedRange);
      if (bounds != null) {
        this.position(bounds);
      }
      this.textbox.select();
      this.textbox.setAttribute("placeholder", this.textbox.getAttribute(`data-${mode}`) || "");
      this.root.setAttribute("data-mode", mode);
    }
    restoreFocus() {
      this.quill.focus({
        preventScroll: true
      });
    }
    save() {
      let {
        value
      } = this.textbox;
      switch (this.root.getAttribute("data-mode")) {
        case "link": {
          const {
            scrollTop
          } = this.quill.root;
          if (this.linkRange) {
            this.quill.formatText(this.linkRange, "link", value, emitter_default.sources.USER);
            delete this.linkRange;
          } else {
            this.restoreFocus();
            this.quill.format("link", value, emitter_default.sources.USER);
          }
          this.quill.root.scrollTop = scrollTop;
          break;
        }
        case "video": {
          value = extractVideoUrl(value);
        }
        case "formula": {
          if (!value)
            break;
          const range = this.quill.getSelection(true);
          if (range != null) {
            const index = range.index + range.length;
            this.quill.insertEmbed(
              index,
              // @ts-expect-error Fix me later
              this.root.getAttribute("data-mode"),
              value,
              emitter_default.sources.USER
            );
            if (this.root.getAttribute("data-mode") === "formula") {
              this.quill.insertText(index + 1, " ", emitter_default.sources.USER);
            }
            this.quill.setSelection(index + 2, emitter_default.sources.USER);
          }
          break;
        }
        default:
      }
      this.textbox.value = "";
      this.hide();
    }
  };
  function extractVideoUrl(url) {
    let match2 = url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) || url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (match2) {
      return `${match2[1] || "https"}://www.youtube.com/embed/${match2[2]}?showinfo=0`;
    }
    if (match2 = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/)) {
      return `${match2[1] || "https"}://player.vimeo.com/video/${match2[2]}/`;
    }
    return url;
  }
  __name(extractVideoUrl, "extractVideoUrl");
  function fillSelect(select, values) {
    let defaultValue = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    values.forEach((value) => {
      const option = document.createElement("option");
      if (value === defaultValue) {
        option.setAttribute("selected", "selected");
      } else {
        option.setAttribute("value", String(value));
      }
      select.appendChild(option);
    });
  }
  __name(fillSelect, "fillSelect");

  // node_modules/quill/themes/bubble.js
  var TOOLBAR_CONFIG = [["bold", "italic", "link"], [{
    header: 1
  }, {
    header: 2
  }, "blockquote"]];
  var BubbleTooltip = class extends BaseTooltip {
    static {
      __name(this, "BubbleTooltip");
    }
    static TEMPLATE = ['<span class="ql-tooltip-arrow"></span>', '<div class="ql-tooltip-editor">', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-close"></a>', "</div>"].join("");
    constructor(quill, bounds) {
      super(quill, bounds);
      this.quill.on(emitter_default.events.EDITOR_CHANGE, (type, range, oldRange, source) => {
        if (type !== emitter_default.events.SELECTION_CHANGE)
          return;
        if (range != null && range.length > 0 && source === emitter_default.sources.USER) {
          this.show();
          this.root.style.left = "0px";
          this.root.style.width = "";
          this.root.style.width = `${this.root.offsetWidth}px`;
          const lines = this.quill.getLines(range.index, range.length);
          if (lines.length === 1) {
            const bounds2 = this.quill.getBounds(range);
            if (bounds2 != null) {
              this.position(bounds2);
            }
          } else {
            const lastLine = lines[lines.length - 1];
            const index = this.quill.getIndex(lastLine);
            const length = Math.min(lastLine.length() - 1, range.index + range.length - index);
            const indexBounds = this.quill.getBounds(new Range(index, length));
            if (indexBounds != null) {
              this.position(indexBounds);
            }
          }
        } else if (document.activeElement !== this.textbox && this.quill.hasFocus()) {
          this.hide();
        }
      });
    }
    listen() {
      super.listen();
      this.root.querySelector(".ql-close").addEventListener("click", () => {
        this.root.classList.remove("ql-editing");
      });
      this.quill.on(emitter_default.events.SCROLL_OPTIMIZE, () => {
        setTimeout(() => {
          if (this.root.classList.contains("ql-hidden"))
            return;
          const range = this.quill.getSelection();
          if (range != null) {
            const bounds = this.quill.getBounds(range);
            if (bounds != null) {
              this.position(bounds);
            }
          }
        }, 1);
      });
    }
    cancel() {
      this.show();
    }
    position(reference) {
      const shift = super.position(reference);
      const arrow = this.root.querySelector(".ql-tooltip-arrow");
      arrow.style.marginLeft = "";
      if (shift !== 0) {
        arrow.style.marginLeft = `${-1 * shift - arrow.offsetWidth / 2}px`;
      }
      return shift;
    }
  };
  var BubbleTheme = class extends BaseTheme {
    static {
      __name(this, "BubbleTheme");
    }
    constructor(quill, options) {
      if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
        options.modules.toolbar.container = TOOLBAR_CONFIG;
      }
      super(quill, options);
      this.quill.container.classList.add("ql-bubble");
    }
    extendToolbar(toolbar) {
      this.tooltip = new BubbleTooltip(this.quill, this.options.bounds);
      if (toolbar.container != null) {
        this.tooltip.root.appendChild(toolbar.container);
        this.buildButtons(toolbar.container.querySelectorAll("button"), icons_default);
        this.buildPickers(toolbar.container.querySelectorAll("select"), icons_default);
      }
    }
  };
  BubbleTheme.DEFAULTS = merge_default({}, BaseTheme.DEFAULTS, {
    modules: {
      toolbar: {
        handlers: {
          link(value) {
            if (!value) {
              this.quill.format("link", false);
            } else {
              this.quill.theme.tooltip.edit();
            }
          }
        }
      }
    }
  });

  // node_modules/quill/themes/snow.js
  var TOOLBAR_CONFIG2 = [[{
    header: ["1", "2", "3", false]
  }], ["bold", "italic", "underline", "link"], [{
    list: "ordered"
  }, {
    list: "bullet"
  }], ["clean"]];
  var SnowTooltip = class extends BaseTooltip {
    static {
      __name(this, "SnowTooltip");
    }
    static TEMPLATE = ['<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-action"></a>', '<a class="ql-remove"></a>'].join("");
    preview = this.root.querySelector("a.ql-preview");
    listen() {
      super.listen();
      this.root.querySelector("a.ql-action").addEventListener("click", (event) => {
        if (this.root.classList.contains("ql-editing")) {
          this.save();
        } else {
          this.edit("link", this.preview.textContent);
        }
        event.preventDefault();
      });
      this.root.querySelector("a.ql-remove").addEventListener("click", (event) => {
        if (this.linkRange != null) {
          const range = this.linkRange;
          this.restoreFocus();
          this.quill.formatText(range, "link", false, emitter_default.sources.USER);
          delete this.linkRange;
        }
        event.preventDefault();
        this.hide();
      });
      this.quill.on(emitter_default.events.SELECTION_CHANGE, (range, oldRange, source) => {
        if (range == null)
          return;
        if (range.length === 0 && source === emitter_default.sources.USER) {
          const [link, offset] = this.quill.scroll.descendant(Link, range.index);
          if (link != null) {
            this.linkRange = new Range(range.index - offset, link.length());
            const preview = Link.formats(link.domNode);
            this.preview.textContent = preview;
            this.preview.setAttribute("href", preview);
            this.show();
            const bounds = this.quill.getBounds(this.linkRange);
            if (bounds != null) {
              this.position(bounds);
            }
            return;
          }
        } else {
          delete this.linkRange;
        }
        this.hide();
      });
    }
    show() {
      super.show();
      this.root.removeAttribute("data-mode");
    }
  };
  var SnowTheme = class extends BaseTheme {
    static {
      __name(this, "SnowTheme");
    }
    constructor(quill, options) {
      if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
        options.modules.toolbar.container = TOOLBAR_CONFIG2;
      }
      super(quill, options);
      this.quill.container.classList.add("ql-snow");
    }
    extendToolbar(toolbar) {
      if (toolbar.container != null) {
        toolbar.container.classList.add("ql-snow");
        this.buildButtons(toolbar.container.querySelectorAll("button"), icons_default);
        this.buildPickers(toolbar.container.querySelectorAll("select"), icons_default);
        this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
        if (toolbar.container.querySelector(".ql-link")) {
          this.quill.keyboard.addBinding({
            key: "k",
            shortKey: true
          }, (_range, context) => {
            toolbar.handlers.link.call(toolbar, !context.format.link);
          });
        }
      }
    }
  };
  SnowTheme.DEFAULTS = merge_default({}, BaseTheme.DEFAULTS, {
    modules: {
      toolbar: {
        handlers: {
          link(value) {
            if (value) {
              const range = this.quill.getSelection();
              if (range == null || range.length === 0)
                return;
              let preview = this.quill.getText(range);
              if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf("mailto:") !== 0) {
                preview = `mailto:${preview}`;
              }
              const {
                tooltip
              } = this.quill.theme;
              tooltip.edit("link", preview);
            } else {
              this.quill.format("link", false);
            }
          }
        }
      }
    }
  });
  var snow_default = SnowTheme;

  // node_modules/quill/quill.js
  core_default.register({
    "attributors/attribute/direction": DirectionAttribute,
    "attributors/class/align": AlignClass,
    "attributors/class/background": BackgroundClass,
    "attributors/class/color": ColorClass,
    "attributors/class/direction": DirectionClass,
    "attributors/class/font": FontClass,
    "attributors/class/size": SizeClass,
    "attributors/style/align": AlignStyle,
    "attributors/style/background": BackgroundStyle,
    "attributors/style/color": ColorStyle,
    "attributors/style/direction": DirectionStyle,
    "attributors/style/font": FontStyle,
    "attributors/style/size": SizeStyle
  }, true);
  core_default.register({
    "formats/align": AlignClass,
    "formats/direction": DirectionClass,
    "formats/indent": indent_default,
    "formats/background": BackgroundStyle,
    "formats/color": ColorStyle,
    "formats/font": FontClass,
    "formats/size": SizeClass,
    "formats/blockquote": blockquote_default,
    "formats/code-block": CodeBlock,
    "formats/header": header_default,
    "formats/list": ListItem,
    "formats/bold": bold_default,
    "formats/code": Code,
    "formats/italic": italic_default,
    "formats/link": Link,
    "formats/script": script_default,
    "formats/strike": strike_default,
    "formats/underline": underline_default,
    "formats/formula": formula_default,
    "formats/image": image_default,
    "formats/video": video_default,
    "modules/syntax": Syntax,
    "modules/table": table_default,
    "modules/toolbar": Toolbar,
    "themes/bubble": BubbleTheme,
    "themes/snow": snow_default,
    "ui/icons": icons_default,
    "ui/picker": picker_default,
    "ui/icon-picker": icon_picker_default,
    "ui/color-picker": color_picker_default,
    "ui/tooltip": tooltip_default
  }, true);
  var quill_default = core_default;

  // app/javascript/quill.image.js
  var InlineBlot2 = quill_default.import("blots/block");
  var LoadingImage = class extends InlineBlot2 {
    static {
      __name(this, "LoadingImage");
    }
    static create(src) {
      const node = super.create(src);
      if (src === true)
        return node;
      const image = document.createElement("img");
      image.setAttribute("src", src);
      node.appendChild(image);
      return node;
    }
    deleteAt(index, length) {
      super.deleteAt(index, length);
      this.cache = {};
    }
    static value(domNode) {
      const { src, custom } = domNode.dataset;
      return { src, custom };
    }
  };
  LoadingImage.blotName = "imageBlot";
  LoadingImage.className = "image-uploading";
  LoadingImage.tagName = "span";
  quill_default.register({ "formats/imageBlot": LoadingImage });
  var quill_image_default = LoadingImage;
})();
/*! Bundled license information:

lodash-es/lodash.js:
  (**
   * @license
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="es" -o ./`
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *)
*/
//# sourceMappingURL=quill.image.js.map
