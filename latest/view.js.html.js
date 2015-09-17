ne.util.defineNamespace("fedoc.content", {});
fedoc.content["view.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Pagination view manage all of draw elements\n * (from pug.Pagination)\n * @author NHN entertainment FE dev team Jein Yi(jein.yi@nhnent.com)\n * @dependency pagination.js\n */\n/**\n * @constructor PaginationView\n * @param {Object} options Option object\n * @param {Object} $element Container element\n *\n */\nvar View = ne.util.defineClass(/** @lends PaginationView.prototype */{\n    init: function(options, $element) {\n        /**\n         * Pagination root element\n         * @type {jQueryObject}\n         * @private\n         */\n        this._element = $element;\n\n        /**\n         * Pagination options\n         * @type {Object}\n         * @private\n         */\n        this._options = options;\n\n        /**\n         * Selectors\n         * @type {Object}\n         * @private\n         */\n        this._elementSelector = {};\n\n        /**\n         * Page item list\n         * @type {Array}\n         * @private\n         */\n        this._pageItemList = [];\n\n        ne.util.extend(options, {\n            $pre_endOn: options['$pre_endOn'] || $('a.' + this._wrapPrefix('pre_end'), this._element),\n            $preOn: options['$preOn'] || $('a.' + this._wrapPrefix('pre'), this._element),\n            $nextOn: options['$nextOn'] || $('a.' + this._wrapPrefix('next'), this._element),\n            $lastOn: options['$lastOn'] || $('a.' + this._wrapPrefix('next_end'), this._element),\n            $pre_endOff: options['$pre_endOff'] || $('span.' + this._wrapPrefix('pre_end'), this._element),\n            $preOff: options['$preOff'] || $('span.' + this._wrapPrefix('pre'), this._element),\n            $nextOff: options['$nextOff'] || $('span.' + this._wrapPrefix('next'), this._element),\n            $lastOff: options['$lastOff'] || $('span.' + this._wrapPrefix('next_end'), this._element)\n        });\n        this._element.addClass(this._wrapPrefix('loaded'));\n    },\n\n    /**\n     * Update view\n     * @param {Object} viewSet Values of each pagination view components\n     */\n    update: function(viewSet) {\n        this._addTextNode();\n        this._setPageResult(viewSet.lastPage);\n\n        var options = this._options,\n            edges = this._getEdge(viewSet),\n            leftPageNumber = edges.left,\n            rightPageNumber = edges.right;\n\n        viewSet.leftPageNumber = leftPageNumber;\n        viewSet.rightPageNumber = rightPageNumber;\n\n        if (options.moveUnit === 'page') {\n            viewSet.currentPageIndex = viewSet.page;\n            viewSet.lastPageListIndex = viewSet.lastPage;\n        }\n\n        this._setFirst(viewSet);\n        this._setPrev(viewSet);\n        this._setPageNumbers(viewSet);\n        this._setNext(viewSet);\n        this._setLast(viewSet);\n    },\n\n    /**\n     * Check include\n     * @param {JQueryObject} $find Target element\n     * @param {JQueryObject} $parent Wrapper element\n     * @returns {boolean}\n     */\n    isIn: function($find, $parent) {\n        if (!$parent) {\n            return false;\n        }\n        return ($find[0] === $parent[0]) ? true : $.contains($parent, $find);\n    },\n\n    /**\n     * Get base(root) element\n     * @returns {JQueryObject}\n     */\n    getBaseElement: function() {\n        return this.getElement();\n    },\n\n    /**\n     * Reset base element\n     */\n    empty: function(){\n\n        var options = this._options,\n            $pre_endOn = options.$pre_endOn,\n            $preOn = options.$preOn,\n            $nextOn = options.$nextOn,\n            $lastOn = options.$lastOn,\n            $pre_endOff = options.$pre_endOff,\n            $preOff = options.$preOff,\n            $nextOff = options.$nextOff,\n            $lastOff = options.$lastOff;\n\n        options.$pre_endOn = this._clone($pre_endOn);\n        options.$preOn = this._clone($preOn);\n        options.$lastOn = this._clone($lastOn);\n        options.$nextOn = this._clone($nextOn);\n        options.$pre_endOff = this._clone($pre_endOff);\n        options.$preOff = this._clone($preOff);\n        options.$lastOff = this._clone($lastOff);\n        options.$nextOff = this._clone($nextOff);\n\n        this._pageItemList = [];\n\n        this._element.empty();\n    },\n\n    /**\n     * Find target element from page elements\n     * @param {jQueryObject|HTMLElement} el Target element\n     * @return {jQueryObject}\n     */\n    getPageElement: function(el) {\n\n        var i,\n            length,\n            pickedItem;\n\n        for (i = 0, length = this._pageItemList.length; i &lt; length; i++) {\n            pickedItem = this._pageItemList[i];\n            if (this.isIn(el, pickedItem)) {\n                return pickedItem;\n            }\n        }\n        return null;\n    },\n\n    /**\n     * Attach Events\n     * @param {String} eventType Event name to attach\n     * @param {Function} callback Callback function\n     */\n    attachEvent: function(eventType, callback) {\n\n        var targetElement = this._element,\n            isSavedElement = ne.util.isString(targetElement) &amp;&amp; this._elementSelector[targetElement];\n\n        if (isSavedElement) {\n            targetElement = this._getElement(targetElement, true);\n        }\n\n        if (targetElement &amp;&amp; eventType &amp;&amp; callback) {\n            $(targetElement).bind(eventType, null, callback);\n        }\n    },\n\n    /**\n     * Get root element\n     * @returns {jQueryObject}\n     */\n    getElement: function() {\n        return this._element;\n    },\n\n    /**\n     * Return className added prefix\n     * @param {String} className Class name to be wrapping\n     * @returns {*}\n     * @private\n     */\n    _wrapPrefix: function(className) {\n        var classPrefix = this._options['classPrefix'];\n        return classPrefix ? classPrefix + className.replace(/_/g, '-') : className;\n    },\n\n    /**\n     * Put insertTextNode between page items\n     * @private\n     */\n    _addTextNode: function() {\n        var textNode = this._options['insertTextNode'];\n        this._element.append(document.createTextNode(textNode));\n    },\n\n    /**\n     * Clone element\n     * @returns {*}\n     * @private\n     */\n    _clone: function($link) {\n\n        if ($link &amp;&amp; $link.length &amp;&amp; $link.get(0).cloneNode) {\n            return $($link.get(0).cloneNode(true));\n        }\n        return $link;\n\n    },\n\n    /**\n     * Wrapping class by page result\n     * @param {Number} lastNum Last page number\n     * @private\n     */\n    _setPageResult: function(lastNum) {\n\n        if (lastNum === 0) {\n            this._element.addClass(this._wrapPrefix('no-result'));\n        } else if (lastNum === 1) {\n            this._element.addClass(this._wrapPrefix('only-one')).removeClass(this._wrapPrefix('no-result'));\n        } else {\n            this._element.removeClass(this._wrapPrefix('only-one')).removeClass(this._wrapPrefix('no-result'));\n        }\n\n    },\n\n    /**\n     * Get each edge page\n     * @param {object} viewSet Pagination view elements set\n     * @returns {{left: *, right: *}}\n     * @private\n     */\n    _getEdge: function(viewSet) {\n\n        var options = this._options,\n            leftPageNumber,\n            rightPageNumber,\n            left;\n\n        if (options.isCenterAlign) {\n\n            left = Math.floor(options.pagePerPageList / 2);\n            leftPageNumber = viewSet.page - left;\n            leftPageNumber = Math.max(leftPageNumber, 1);\n            rightPageNumber = leftPageNumber + options.pagePerPageList - 1;\n\n            if (rightPageNumber > viewSet.lastPage) {\n                leftPageNumber = viewSet.lastPage - options.pagePerPageList + 1;\n                leftPageNumber = Math.max(leftPageNumber, 1);\n                rightPageNumber = viewSet.lastPage;\n            }\n\n        } else {\n\n            leftPageNumber = (viewSet.currentPageIndex - 1) * options.pagePerPageList + 1;\n            rightPageNumber = (viewSet.currentPageIndex) * options.pagePerPageList;\n            rightPageNumber = Math.min(rightPageNumber, viewSet.lastPage);\n\n        }\n\n        return {\n            left: leftPageNumber,\n            right: rightPageNumber\n        };\n    },\n\n    /**\n     * Decide to show first page link by whether first page or not\n     * @param {object} viewSet Pagination view elements set\n     * @private\n     */\n    _setFirst: function(viewSet) {\n        var options = this._options;\n        if (viewSet.page > 1) {\n            if (options.$pre_endOn) {\n                this._element.append(options.$pre_endOn);\n                this._addTextNode();\n            }\n        } else {\n            if (options.$pre_endOff) {\n                this._element.append(options.$pre_endOff);\n                this._addTextNode();\n            }\n        }\n\n    },\n\n    /**\n     * Decide to show previous page link by whether first page or not\n     * @param {object} viewSet Pagination view elements set\n     * @private\n     */\n    _setPrev: function(viewSet) {\n        var options = this._options;\n\n        if (viewSet.currentPageIndex > 1) {\n            if (options.$preOn) {\n                this._element.append(options.$preOn);\n                this._addTextNode();\n            }\n        } else {\n            if (options.$preOff) {\n                this._element.append(options.$preOff);\n                this._addTextNode();\n            }\n        }\n    },\n    /**\n     * Decide to show next page link by whether first page or not\n     * @param {object} viewSet Pagination view elements set\n     * @private\n     */\n    _setNext: function(viewSet) {\n        var options = this._options;\n\n        if (viewSet.currentPageIndex &lt; viewSet.lastPageListIndex) {\n            if (options.$nextOn) {\n                this._element.append(options.$nextOn);\n                this._addTextNode();\n            }\n        } else {\n            if (options.$nextOff) {\n                this._element.append(options.$nextOff);\n                this._addTextNode();\n            }\n        }\n\n    },\n    /**\n     * Decide to show last page link by whether first page or not\n     * @param {object} viewSet Pagination view elements set\n     * @private\n     */\n    _setLast: function(viewSet) {\n\n        var options = this._options;\n\n        if (viewSet.page &lt; viewSet.lastPage) {\n            if (options.$lastOn) {\n                this._element.append(options.$lastOn);\n                this._addTextNode();\n            }\n        } else {\n            if (options.$lastOff) {\n                this._element.append(options.$lastOff);\n                this._addTextNode();\n            }\n        }\n\n    },\n    /**\n     * Set page number that will be drawn\n     * @param {object} viewSet Pagination view elements set\n     * @private\n     */\n    _setPageNumbers: function(viewSet) {\n        var $pageItem,\n            firstPage = viewSet.leftPageNumber,\n            lastPage = viewSet.rightPageNumber,\n            options = this._options,\n            i;\n\n        for (i = firstPage; i &lt;= lastPage; i++) {\n            if (i === viewSet.page) {\n                $pageItem = $(options.currentPageTemplate.replace('{=page}', i.toString()));\n            } else {\n                $pageItem = $(options.pageTemplate.replace('{=page}', i.toString()));\n                this._pageItemList.push($pageItem);\n            }\n\n            if (i === firstPage) {\n                $pageItem.addClass(this._wrapPrefix(options['firstItemClassName']));\n            }\n            if (i === lastPage) {\n                $pageItem.addClass(this._wrapPrefix(options['lastItemClassName']));\n            }\n            this._element.append($pageItem);\n            this._addTextNode();\n        }\n    }\n});\n\nmodule.exports = View;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"