//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, g = h.trustedTypes, ee = g ? g.emptyScript : "", _ = h.reactiveElementPolyfillSupport, v = (e, t) => e, y = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ee : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, b = (e, t) => !l(e, t), x = {
	attribute: !0,
	type: String,
	converter: y,
	reflect: !1,
	useDefault: !1,
	hasChanged: b
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var S = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = x) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? x;
	}
	static _$Ei() {
		if (this.hasOwnProperty(v("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(v("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(v("properties"))) {
			let e = this.properties, t = [...f(e), ...p(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(Infinity).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? y : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? y : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? b)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[v("elementProperties")] = /* @__PURE__ */ new Map(), S[v("finalized")] = /* @__PURE__ */ new Map(), _?.({ ReactiveElement: S }), (h.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var te = globalThis, ne = (e) => e, re = te.trustedTypes, ie = re ? re.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ae = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, oe = "?" + C, se = `<${oe}>`, w = document, T = () => w.createComment(""), E = (e) => e === null || typeof e != "object" && typeof e != "function", ce = Array.isArray, le = (e) => ce(e) || typeof e?.[Symbol.iterator] == "function", ue = "[ 	\n\f\r]", D = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, de = /-->/g, fe = />/g, O = RegExp(`>|${ue}(?:([^\\s"'>=/]+)(${ue}*=${ue}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), pe = /'/g, me = /"/g, he = /^(?:script|style|textarea|title)$/i, ge = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), k = ge(1), A = ge(2), j = Symbol.for("lit-noChange"), M = Symbol.for("lit-nothing"), _e = /* @__PURE__ */ new WeakMap(), N = w.createTreeWalker(w, 129);
function ve(e, t) {
	if (!ce(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ie === void 0 ? t : ie.createHTML(t);
}
var ye = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = D;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === D ? c[1] === "!--" ? o = de : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = O) : (he.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = O) : o = fe : o === O ? c[0] === ">" ? (o = i ?? D, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? O : c[3] === "\"" ? me : pe) : o === me || o === pe ? o = O : o === de || o === fe ? o = D : (o = O, i = void 0);
		let d = o === O && e[t + 1].startsWith("/>") ? " " : "";
		a += o === D ? n + se : l >= 0 ? (r.push(s), n.slice(0, l) + ae + n.slice(l) + C + d) : n + C + (l === -2 ? t : d);
	}
	return [ve(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, be = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = ye(t, n);
		if (this.el = e.createElement(l, r), N.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = N.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ae)) {
					let t = u[o++], n = i.getAttribute(e).split(C), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Ce : r[1] === "?" ? we : r[1] === "@" ? Te : F
					}), i.removeAttribute(e);
				} else e.startsWith(C) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (he.test(i.tagName)) {
					let e = i.textContent.split(C), t = e.length - 1;
					if (t > 0) {
						i.textContent = re ? re.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], T()), N.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], T());
					}
				}
			} else if (i.nodeType === 8) if (i.data === oe) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(C, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += C.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = w.createElement("template");
		return n.innerHTML = e, n;
	}
};
function P(e, t, n = e, r) {
	if (t === j) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = E(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = P(e, i._$AS(e, t.values), i, r)), t;
}
var xe = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? w).importNode(t, !0);
		N.currentNode = r;
		let i = N.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Se(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Ee(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = N.nextNode(), a++);
		}
		return N.currentNode = w, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Se = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = M, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = P(this, e, t), E(e) ? e === M || e == null || e === "" ? (this._$AH !== M && this._$AR(), this._$AH = M) : e !== this._$AH && e !== j && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? le(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== M && E(this._$AH) ? this._$AA.nextSibling.data = e : this.T(w.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = be.createElement(ve(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new xe(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = _e.get(e.strings);
		return t === void 0 && _e.set(e.strings, t = new be(e)), t;
	}
	k(t) {
		ce(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(T()), this.O(T()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ne(e).nextSibling;
			ne(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, F = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = M, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = M;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = P(this, e, t, 0), a = !E(e) || e !== this._$AH && e !== j, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = P(this, r[n + o], t, o), s === j && (s = this._$AH[o]), a ||= !E(s) || s !== this._$AH[o], s === M ? e = M : e !== M && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === M ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Ce = class extends F {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === M ? void 0 : e;
	}
}, we = class extends F {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== M);
	}
}, Te = class extends F {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = P(this, e, t, 0) ?? M) === j) return;
		let n = this._$AH, r = e === M && n !== M || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== M && (n === M || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Ee = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		P(this, e);
	}
}, De = te.litHtmlPolyfillSupport;
De?.(be, Se), (te.litHtmlVersions ??= []).push("3.3.3");
var Oe = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Se(t.insertBefore(T(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, ke = globalThis, I = class extends S {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Oe(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return j;
	}
};
I._$litElement$ = !0, I.finalized = !0, ke.litElementHydrateSupport?.({ LitElement: I });
var Ae = ke.litElementPolyfillSupport;
Ae?.({ LitElement: I }), (ke.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
var je = {
	attribute: !0,
	type: String,
	converter: y,
	reflect: !1,
	hasChanged: b
}, Me = (e = je, t, n) => {
	let { kind: r, metadata: i } = n, a = globalThis.litPropertyMetadata.get(i);
	if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(n.name, e), r === "accessor") {
		let { name: r } = n;
		return {
			set(n) {
				let i = t.get.call(this);
				t.set.call(this, n), this.requestUpdate(r, i, e, !0, n);
			},
			init(t) {
				return t !== void 0 && this.C(r, void 0, e, t), t;
			}
		};
	}
	if (r === "setter") {
		let { name: r } = n;
		return function(n) {
			let i = this[r];
			t.call(this, n), this.requestUpdate(r, i, e, !0, n);
		};
	}
	throw Error("Unsupported decorator location: " + r);
};
function Ne(e) {
	return (t, n) => typeof n == "object" ? Me(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function Pe(e) {
	return Ne({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region src/types.ts
var Fe = "custom:wolf-heat-pump-flow-card", Ie = "wolf-heat-pump-flow-card", Le = /* @__PURE__ */ "outdoor_temperature.heat_pump_supply_temperature.heat_pump_return_temperature.system_temperature.flow_rate.system_pressure.dhw_temperature.dhw_target_temperature.heating_supply_temperature.heating_return_temperature.heating_target_temperature.heating_circuit_pump.primary_pump.compressor.fan.fan_speed.auxiliary_heater.defrost_active.fault.heating_active.dhw_active.operation_mode.three_way_valve.electrical_power.thermal_power.cop.cooling_active.heating_cooling_valve.compressor_modulation.compressor_frequency".split("."), Re = {
	active: [
		"on",
		"running",
		"active",
		"ein",
		"1",
		"true",
		"betrieb",
		"läuft"
	],
	inactive: [
		"off",
		"idle",
		"inactive",
		"aus",
		"0",
		"false",
		"standby",
		"sperrzeit",
		"vorspülen",
		"bereit_keine_ladung",
		"deaktiviert"
	]
}, ze = {
	heating: [
		"heating",
		"heat",
		"heizen",
		"heizbetrieb"
	],
	dhw: [
		"dhw",
		"hot_water",
		"hot water",
		"warmwasser",
		"ww",
		"ww-nachlauf",
		"warmwasserpriorität"
	],
	cooling: [
		"cooling",
		"cool",
		"kühlen",
		"kuehlen",
		"kühlbetrieb"
	],
	defrost: [
		"defrost",
		"defrosting",
		"abtauen",
		"abtauung"
	],
	fault: [
		"fault",
		"error",
		"alarm",
		"störung",
		"stoerung",
		"fehler"
	],
	idle: [
		"idle",
		"off",
		"standby",
		"aus",
		"sperrzeit",
		"bereit_keine_ladung"
	]
}, Be = {
	heating: [
		"heating",
		"heat",
		"heizen",
		"heizung",
		"hz"
	],
	dhw: [
		"dhw",
		"hot_water",
		"hot water",
		"warmwasser",
		"ww"
	]
}, Ve = {
	heating: [
		"heating",
		"heat",
		"heizen",
		"heizung"
	],
	cooling: [
		"cooling",
		"cool",
		"kühlen",
		"kuehlen",
		"kühlung"
	]
}, He = {
	type: Fe,
	title: "WOLF Wärmepumpe",
	entities: {},
	animations: !0,
	temperature_coloring: !1,
	show_legend: !0,
	label_mode: "both",
	layout: "auto",
	flow_rate_threshold: .1
};
function Ue(e) {
	return typeof e == "number" && Number.isFinite(e) && e >= 0 ? e : void 0;
}
function We(e, t) {
	return t.criticalLow !== void 0 && e <= t.criticalLow || t.criticalHigh !== void 0 && e >= t.criticalHigh ? "critical" : t.warningLow !== void 0 && e <= t.warningLow || t.warningHigh !== void 0 && e >= t.warningHigh ? "warning" : "normal";
}
function Ge(e, t) {
	let n = { ...e };
	for (let r of Object.keys(e)) {
		let e = t?.[r];
		Array.isArray(e) && (n[r] = [...e]);
	}
	return n;
}
function Ke(e) {
	let t = {};
	for (let n of Le) {
		let r = e?.[n];
		typeof r == "string" && r.trim().length > 0 && (t[n] = r.trim());
	}
	return t;
}
function qe(e) {
	let t = {
		...e.valve_mapping,
		...e.three_way_valve_mapping
	};
	return {
		binary: Ge(Re, e.state_mapping),
		operationMode: Ge(ze, e.operation_mode_mapping),
		threeWayValve: Ge(Be, t),
		heatingCoolingValve: Ge(Ve, e.heating_cooling_valve_mapping)
	};
}
function L(e) {
	let t = e.flow_rate_threshold;
	return {
		type: Fe,
		...typeof e.title == "string" ? { title: e.title } : {},
		entities: Ke(e.entities),
		mappings: qe(e),
		label_mode: e.label_mode ?? "both",
		layout: e.layout ?? "auto",
		animations: e.animations ?? !0,
		temperature_coloring: e.temperature_coloring ?? !1,
		show_legend: e.show_legend ?? !0,
		flow_rate_threshold: typeof t == "number" && Number.isFinite(t) && t >= 0 ? t : .1,
		system_pressure_limits: {
			criticalLow: Ue(e.system_pressure_critical_low),
			warningLow: Ue(e.system_pressure_warning_low),
			warningHigh: Ue(e.system_pressure_warning_high),
			criticalHigh: Ue(e.system_pressure_critical_high)
		}
	};
}
function Je() {
	return {
		...He,
		entities: {}
	};
}
var Ye = {
	de: {
		"card.title": "WOLF-Wärmepumpe",
		"component.heat_pump": "Wärmepumpe",
		"component.hydraulic_module": "Hydraulikmodul",
		"component.dhw_tank": "Warmwasserspeicher",
		"component.heating_circuit": "Heizkreis",
		"component.collector": "Sammler",
		"component.compressor": "Verdichter",
		"component.fan": "Ventilator",
		"component.auxiliary_heater": "Elektrischer Zusatzheizer",
		"component.heating_circuit_pump": "Heizkreispumpe",
		"component.primary_pump": "Primär-/Zubringerpumpe",
		"component.three_way_valve": "Ventil Heizung / Warmwasser",
		"component.heating_cooling_valve": "Ventil Heizung / Kühlung",
		"sensor.sf": "Speicherfühler",
		"sensor.saf": "System-/Sammlerfühler",
		"sensor.rl": "Rücklauf",
		"sensor.dfl": "Durchfluss",
		"metric.outdoor_temperature": "Außentemperatur",
		"metric.heat_pump_supply_temperature": "Wärmepumpen-Vorlauf",
		"metric.heat_pump_return_temperature": "Wärmepumpen-Rücklauf",
		"metric.system_temperature": "Systemtemperatur",
		"metric.flow_rate": "Volumenstrom",
		"metric.system_pressure": "Anlagendruck",
		"metric.dhw_temperature": "Warmwassertemperatur",
		"metric.dhw_target_temperature": "Warmwasser-Solltemperatur",
		"metric.heating_supply_temperature": "Heizkreis-Vorlauf",
		"metric.heating_return_temperature": "Heizkreis-Rücklauf",
		"metric.heating_target_temperature": "Heizungs-Solltemperatur",
		"metric.fan_speed": "Ventilatordrehzahl",
		"metric.compressor_modulation": "Verdichtermodulation",
		"metric.compressor_frequency": "Verdichterfrequenz",
		"metric.electrical_power": "Elektrische Leistung",
		"metric.thermal_power": "Thermische Leistung",
		"metric.cop": "COP",
		"metric.operation_mode": "Betriebsart",
		"mode.heating": "Heizen",
		"mode.dhw": "Warmwasser",
		"mode.cooling": "Kühlen",
		"mode.defrost": "Abtauung",
		"mode.idle": "Standby",
		"mode.fault": "Störung",
		"mode.unknown": "Unbekannt",
		"state.active": "Aktiv",
		"state.inactive": "Inaktiv",
		"state.unavailable": "Nicht verfügbar",
		"valve.heating": "Heizung",
		"valve.dhw": "Warmwasser",
		"valve.cooling": "Kühlung",
		"editor.title": "Titel",
		"editor.entities": "Entitäten",
		"editor.group.temperatures": "Temperaturen",
		"editor.group.hydraulics": "Hydraulik und Pumpen",
		"editor.group.components": "Verdichter, Ventilator und Heizstab",
		"editor.group.status": "Betriebszustände",
		"editor.group.performance": "Leistungswerte",
		"editor.display": "Darstellung",
		"editor.pressure_limits": "Grenzwerte Anlagendruck",
		"editor.system_pressure_critical_low": "Kritisch unterhalb",
		"editor.system_pressure_warning_low": "Warnung unterhalb",
		"editor.system_pressure_warning_high": "Warnung oberhalb",
		"editor.system_pressure_critical_high": "Kritisch oberhalb",
		"editor.animations": "Aktive Flüsse und Komponenten animieren",
		"editor.flow_rate_threshold": "Einschaltschwelle des Volumenstroms",
		"editor.entity.defrost_active": "Abtauung aktiv",
		"editor.entity.fault": "Störungsstatus",
		"editor.entity.heating_active": "Heizbetrieb aktiv",
		"editor.entity.dhw_active": "Warmwasserbereitung aktiv",
		"editor.entity.cooling_active": "Kühlbetrieb aktiv",
		"editor.animation": "Animation",
		"editor.animation.enabled": "Animationen aktivieren",
		"editor.animation.flow_speed": "Fließgeschwindigkeit",
		"editor.animation.show_direction": "Fließrichtung anzeigen",
		"editor.temperature_coloring": "Temperaturfärbung",
		"editor.show_legend": "Legende Vorlauf / Rücklauf anzeigen",
		"editor.temperature_coloring.enabled": "Leitungen temperaturabhängig färben",
		"editor.temperature_coloring.min": "Minimale Temperatur",
		"editor.temperature_coloring.max": "Maximale Temperatur",
		"editor.label_mode": "Beschriftungen",
		"editor.label_mode.technical": "Technisch",
		"editor.label_mode.friendly": "Verständlich",
		"editor.label_mode.both": "Beides",
		"editor.label_mode.hidden": "Ausgeblendet",
		"editor.layout": "Layout",
		"editor.layout.auto": "Automatisch",
		"editor.layout.compact": "Kompakt",
		"editor.layout.wide": "Breit",
		"editor.helper.status": "Unterstützt Sensoren, Binärsensoren und Eingabe-Schalter.",
		"editor.helper.optional": "Optionale Entität; bei Nichtverfügbarkeit leer lassen.",
		"editor.helper.pressure_limits": "Optional. Leer lassen, um den Grenzwert zu deaktivieren; Reihenfolge: kritisch unten ≤ Warnung unten ≤ Warnung oben ≤ kritisch oben."
	},
	en: {
		"card.title": "WOLF heat pump",
		"component.heat_pump": "Heat pump",
		"component.hydraulic_module": "Hydraulic module",
		"component.dhw_tank": "Hot-water tank",
		"component.heating_circuit": "Heating circuit",
		"component.collector": "System collector",
		"component.compressor": "Compressor",
		"component.fan": "Fan",
		"component.auxiliary_heater": "Auxiliary heater",
		"component.heating_circuit_pump": "Heating-circuit pump",
		"component.primary_pump": "Primary pump",
		"component.three_way_valve": "Heating / hot-water valve",
		"component.heating_cooling_valve": "Heating / cooling valve",
		"sensor.sf": "Tank sensor",
		"sensor.saf": "System / collector sensor",
		"sensor.rl": "Return",
		"sensor.dfl": "Flow rate",
		"metric.outdoor_temperature": "Outdoor temperature",
		"metric.heat_pump_supply_temperature": "Heat-pump supply temperature",
		"metric.heat_pump_return_temperature": "Heat-pump return temperature",
		"metric.system_temperature": "System temperature",
		"metric.flow_rate": "Flow rate",
		"metric.system_pressure": "System pressure",
		"metric.dhw_temperature": "Hot-water temperature",
		"metric.dhw_target_temperature": "Hot-water target",
		"metric.heating_supply_temperature": "Heating supply temperature",
		"metric.heating_return_temperature": "Heating return temperature",
		"metric.heating_target_temperature": "Heating target",
		"metric.fan_speed": "Fan speed",
		"metric.compressor_modulation": "Compressor modulation",
		"metric.compressor_frequency": "Compressor frequency",
		"metric.electrical_power": "Electrical power",
		"metric.thermal_power": "Thermal power",
		"metric.cop": "COP",
		"metric.operation_mode": "Operating mode",
		"mode.heating": "Heating",
		"mode.dhw": "Hot water",
		"mode.cooling": "Cooling",
		"mode.defrost": "Defrost",
		"mode.idle": "Standby",
		"mode.fault": "Fault",
		"mode.unknown": "Unknown",
		"state.active": "Active",
		"state.inactive": "Inactive",
		"state.unavailable": "Unavailable",
		"valve.heating": "Heating",
		"valve.dhw": "Hot water",
		"valve.cooling": "Cooling",
		"editor.title": "Title",
		"editor.entities": "Entities",
		"editor.group.temperatures": "Temperatures",
		"editor.group.hydraulics": "Hydraulics and pumps",
		"editor.group.components": "Compressor, fan and heater",
		"editor.group.status": "Operating states",
		"editor.group.performance": "Performance",
		"editor.display": "Display",
		"editor.pressure_limits": "System-pressure limits",
		"editor.system_pressure_critical_low": "Critical below",
		"editor.system_pressure_warning_low": "Warning below",
		"editor.system_pressure_warning_high": "Warning above",
		"editor.system_pressure_critical_high": "Critical above",
		"editor.animations": "Animate active flows and components",
		"editor.flow_rate_threshold": "Flow activation threshold",
		"editor.entity.defrost_active": "Defrost active",
		"editor.entity.fault": "Fault status",
		"editor.entity.heating_active": "Heating active",
		"editor.entity.dhw_active": "Hot water active",
		"editor.entity.cooling_active": "Cooling active",
		"editor.animation": "Animation",
		"editor.animation.enabled": "Enable animations",
		"editor.animation.flow_speed": "Flow speed",
		"editor.animation.show_direction": "Show flow direction",
		"editor.temperature_coloring": "Temperature coloring",
		"editor.show_legend": "Show supply / return legend",
		"editor.temperature_coloring.enabled": "Color pipes by temperature",
		"editor.temperature_coloring.min": "Minimum temperature",
		"editor.temperature_coloring.max": "Maximum temperature",
		"editor.label_mode": "Labels",
		"editor.label_mode.technical": "Technical",
		"editor.label_mode.friendly": "Friendly",
		"editor.label_mode.both": "Both",
		"editor.label_mode.hidden": "Hidden",
		"editor.layout": "Layout",
		"editor.layout.auto": "Automatic",
		"editor.layout.compact": "Compact",
		"editor.layout.wide": "Wide",
		"editor.helper.status": "Accepts sensor, binary sensor, and input boolean entities.",
		"editor.helper.optional": "Optional entity; leave empty if unavailable.",
		"editor.helper.pressure_limits": "Optional. Keep empty to disable this threshold; use critical low ≤ warning low ≤ warning high ≤ critical high."
	}
};
function Xe(e) {
	return e?.toLowerCase().startsWith("de") ? "de" : "en";
}
function R(e, t) {
	return Ye[Xe(t)][e];
}
function Ze() {
	return typeof document < "u" && document.documentElement.lang ? document.documentElement.lang : typeof navigator > "u" ? "en" : navigator.language;
}
//#endregion
//#region src/config-form.ts
var Qe = {
	outdoor_temperature: "temperatures",
	heat_pump_supply_temperature: "temperatures",
	heat_pump_return_temperature: "temperatures",
	system_temperature: "temperatures",
	flow_rate: "hydraulics",
	system_pressure: "hydraulics",
	dhw_temperature: "temperatures",
	dhw_target_temperature: "temperatures",
	heating_supply_temperature: "temperatures",
	heating_return_temperature: "temperatures",
	heating_target_temperature: "temperatures",
	heating_circuit_pump: "hydraulics",
	primary_pump: "hydraulics",
	compressor: "components",
	fan: "components",
	fan_speed: "components",
	auxiliary_heater: "components",
	defrost_active: "status",
	fault: "status",
	heating_active: "status",
	dhw_active: "status",
	operation_mode: "status",
	three_way_valve: "hydraulics",
	electrical_power: "performance",
	thermal_power: "performance",
	cop: "performance",
	cooling_active: "status",
	heating_cooling_valve: "hydraulics",
	compressor_modulation: "components",
	compressor_frequency: "components"
}, $e = /* @__PURE__ */ new Set([
	"heating_circuit_pump",
	"primary_pump",
	"compressor",
	"fan",
	"auxiliary_heater",
	"defrost_active",
	"fault",
	"heating_active",
	"dhw_active",
	"cooling_active",
	"operation_mode",
	"three_way_valve",
	"heating_cooling_valve"
]), et = {
	outdoor_temperature: "metric.outdoor_temperature",
	heat_pump_supply_temperature: "metric.heat_pump_supply_temperature",
	heat_pump_return_temperature: "metric.heat_pump_return_temperature",
	system_temperature: "metric.system_temperature",
	flow_rate: "metric.flow_rate",
	system_pressure: "metric.system_pressure",
	dhw_temperature: "metric.dhw_temperature",
	dhw_target_temperature: "metric.dhw_target_temperature",
	heating_supply_temperature: "metric.heating_supply_temperature",
	heating_return_temperature: "metric.heating_return_temperature",
	heating_target_temperature: "metric.heating_target_temperature",
	heating_circuit_pump: "component.heating_circuit_pump",
	primary_pump: "component.primary_pump",
	compressor: "component.compressor",
	fan: "component.fan",
	fan_speed: "metric.fan_speed",
	auxiliary_heater: "component.auxiliary_heater",
	defrost_active: "editor.entity.defrost_active",
	fault: "editor.entity.fault",
	heating_active: "editor.entity.heating_active",
	dhw_active: "editor.entity.dhw_active",
	operation_mode: "metric.operation_mode",
	three_way_valve: "component.three_way_valve",
	electrical_power: "metric.electrical_power",
	thermal_power: "metric.thermal_power",
	cop: "metric.cop",
	cooling_active: "editor.entity.cooling_active",
	heating_cooling_valve: "component.heating_cooling_valve",
	compressor_modulation: "metric.compressor_modulation",
	compressor_frequency: "metric.compressor_frequency"
}, tt = [
	"sensor",
	"number",
	"input_number"
], z = [
	"system_pressure_critical_low",
	"system_pressure_warning_low",
	"system_pressure_warning_high",
	"system_pressure_critical_high"
], nt = (e) => z.includes(e), rt = (e) => ({
	name: e,
	selector: { number: {
		min: 0,
		max: 10,
		step: .1,
		mode: "box",
		unit_of_measurement: "bar"
	} }
}), it = [
	"sensor",
	"binary_sensor",
	"input_boolean"
], at = (e) => Le.includes(e), ot = (e) => ({
	name: e,
	selector: { entity: {
		multiple: !1,
		filter: { domain: $e.has(e) ? it : tt }
	} }
}), B = (e, t, n) => ({
	type: "expandable",
	name: e,
	title: t,
	icon: n,
	flatten: !0,
	schema: Le.filter((t) => Qe[t] === e).map(ot)
});
function st(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) throw Error("The card configuration must be an object.");
	let t = e, n = t.entities;
	if (n !== void 0 && (typeof n != "object" || !n || Array.isArray(n))) throw Error("'entities' must be an object.");
	if (typeof n == "object" && n) {
		for (let e of Object.values(n)) if (e != null && typeof e != "string") throw Error("Entity selections must be entity ID strings.");
	}
	for (let e of [
		"animations",
		"temperature_coloring",
		"show_legend"
	]) {
		let n = t[e];
		if (n !== void 0 && typeof n != "boolean") throw Error(`'${e}' must be a boolean.`);
	}
	let r = t.flow_rate_threshold;
	if (r !== void 0 && typeof r != "number") throw Error("'flow_rate_threshold' must be a number.");
	for (let e of z) {
		let n = t[e];
		if (n !== void 0 && (typeof n != "number" || !Number.isFinite(n) || n < 0)) throw Error(`'${e}' must be a non-negative number.`);
	}
	let i = z.map((e) => t[e]), a;
	for (let e of i) if (e !== void 0) {
		if (a !== void 0 && a > e) throw Error("System-pressure limits must be ordered from critical low to critical high.");
		a = e;
	}
}
function ct(e = Ze()) {
	let t = (t) => R(t, e), n = [
		{
			name: "title",
			selector: { text: {} }
		},
		{
			type: "expandable",
			name: "entities",
			title: t("editor.entities"),
			icon: "mdi:home-thermometer-outline",
			expanded: !0,
			schema: [
				B("temperatures", t("editor.group.temperatures"), "mdi:thermometer-lines"),
				B("hydraulics", t("editor.group.hydraulics"), "mdi:pipe-valve"),
				B("components", t("editor.group.components"), "mdi:heat-pump-outline"),
				B("status", t("editor.group.status"), "mdi:list-status"),
				B("performance", t("editor.group.performance"), "mdi:chart-box-outline")
			]
		},
		{
			type: "expandable",
			name: "pressure_limits",
			title: t("editor.pressure_limits"),
			icon: "mdi:gauge",
			flatten: !0,
			schema: z.map(rt)
		},
		{
			type: "expandable",
			name: "display",
			title: t("editor.display"),
			icon: "mdi:palette-outline",
			flatten: !0,
			schema: [
				{
					name: "animations",
					default: !0,
					selector: { boolean: {} }
				},
				{
					name: "temperature_coloring",
					default: !1,
					selector: { boolean: {} }
				},
				{
					name: "show_legend",
					default: !0,
					selector: { boolean: {} }
				},
				{
					name: "label_mode",
					default: "both",
					selector: { select: {
						mode: "dropdown",
						options: [
							{
								value: "technical",
								label: t("editor.label_mode.technical")
							},
							{
								value: "friendly",
								label: t("editor.label_mode.friendly")
							},
							{
								value: "both",
								label: t("editor.label_mode.both")
							},
							{
								value: "hidden",
								label: t("editor.label_mode.hidden")
							}
						]
					} }
				},
				{
					name: "layout",
					default: "auto",
					selector: { select: {
						mode: "dropdown",
						options: [
							{
								value: "auto",
								label: t("editor.layout.auto")
							},
							{
								value: "compact",
								label: t("editor.layout.compact")
							},
							{
								value: "wide",
								label: t("editor.layout.wide")
							}
						]
					} }
				},
				{
					name: "flow_rate_threshold",
					default: .1,
					selector: { number: {
						min: 0,
						max: 100,
						step: .1,
						mode: "box",
						unit_of_measurement: "L/min"
					} }
				}
			]
		}
	], r = {
		title: "editor.title",
		animations: "editor.animations",
		temperature_coloring: "editor.temperature_coloring",
		show_legend: "editor.show_legend",
		label_mode: "editor.label_mode",
		layout: "editor.layout",
		flow_rate_threshold: "editor.flow_rate_threshold",
		system_pressure_critical_low: "editor.system_pressure_critical_low",
		system_pressure_warning_low: "editor.system_pressure_warning_low",
		system_pressure_warning_high: "editor.system_pressure_warning_high",
		system_pressure_critical_high: "editor.system_pressure_critical_high"
	};
	return {
		schema: n,
		computeLabel: (e) => {
			if (at(e.name)) return t(et[e.name]);
			let n = r[e.name];
			return n === void 0 ? void 0 : t(n);
		},
		computeHelper: (e) => {
			if (nt(e.name)) return t("editor.helper.pressure_limits");
			if (at(e.name)) return t($e.has(e.name) ? "editor.helper.status" : "editor.helper.optional");
		},
		assertConfig: st
	};
}
//#endregion
//#region src/flow-diagram.ts
var lt = {
	title: "Hydraulikschema der WOLF Wärmepumpe",
	description: "Animiertes Flussschema mit Außeneinheit, Hydraulikmodul, Warmwasserspeicher, Heizkreis und Sammler.",
	outdoorUnit: "Außeneinheit",
	outdoorTemperature: "Außen",
	boilerTemperature: "Kessel/Vorlauf",
	hydraulicModule: "Hydraulikmodul",
	hotWater: "Warmwasser",
	heatingCircuit: "Heizkreis",
	collector: "Sammler",
	fan: "Ventilator",
	compressor: "Verdichter",
	heater: "Heizstab",
	primaryPump: "Primärpumpe",
	heatingPump: "Heizkreispumpe",
	diverterValve: "Umschaltventil",
	supply: "Vorlauf",
	return: "Rücklauf",
	flowRate: "Durchfluss",
	systemPressure: "Anlagendruck",
	systemPressureShort: "Druck",
	storage: "Speicher",
	collectorTemperature: "Sammler",
	heatingPosition: "Heizung",
	hotWaterPosition: "Warmwasser",
	active: "aktiv",
	inactive: "inaktiv",
	unavailable: "nicht verfügbar",
	pressureStatus: {
		normal: "normal",
		warning: "Warnung",
		critical: "kritisch"
	},
	mode: {
		fault: "Störung",
		defrost: "Abtauung",
		heating: "Heizen",
		dhw: "Warmwasser",
		cooling: "Kühlen",
		idle: "Bereit"
	}
}, ut = {
	title: "WOLF heat pump hydraulic diagram",
	description: "Animated flow diagram with outdoor unit, hydraulic module, hot-water tank, heating circuit and collector.",
	outdoorUnit: "Outdoor unit",
	outdoorTemperature: "Outdoor",
	boilerTemperature: "Boiler/supply",
	hydraulicModule: "Hydraulic module",
	hotWater: "Hot water",
	heatingCircuit: "Heating circuit",
	collector: "Collector",
	fan: "Fan",
	compressor: "Compressor",
	heater: "Auxiliary heater",
	primaryPump: "Primary pump",
	heatingPump: "Heating circuit pump",
	diverterValve: "Diverter valve",
	supply: "Supply",
	return: "Return",
	flowRate: "Flow rate",
	systemPressure: "System pressure",
	systemPressureShort: "Pressure",
	storage: "Tank",
	collectorTemperature: "Collector",
	heatingPosition: "Heating",
	hotWaterPosition: "Hot water",
	active: "active",
	inactive: "inactive",
	unavailable: "unavailable",
	pressureStatus: {
		normal: "normal",
		warning: "warning",
		critical: "critical"
	},
	mode: {
		fault: "Fault",
		defrost: "Defrost",
		heating: "Heating",
		dhw: "Hot water",
		cooling: "Cooling",
		idle: "Ready"
	}
}, V = {
	"hp-supply": "M 430 205 V 410",
	"hp-return": "M 570 475 V 205",
	"dhw-supply": "M 430 410 H 240",
	"dhw-return": "M 240 515 H 570 V 475",
	"system-supply": "M 430 410 V 574 H 720",
	"system-return": "M 720 620 H 570 V 475",
	"heating-supply": "M 720 574 V 325",
	"heating-return": "M 830 325 V 620 H 720"
}, dt = "M 430 165 V 205", ft = "M 570 205 V 165", pt = "M 240 410 H 116 C 92 410 92 431 116 431 H 196 C 220 431 220 452 196 452 H 116 C 92 452 92 473 116 473 H 196 C 220 473 220 494 196 494 H 116 C 92 494 92 515 116 515 H 240", mt = {
	"hp-supply": {
		x: 430,
		y: 228,
		angle: 90
	},
	"hp-return": {
		x: 570,
		y: 228,
		angle: -90
	},
	"dhw-supply": {
		x: 326,
		y: 410,
		angle: 180
	},
	"dhw-return": {
		x: 326,
		y: 515,
		angle: 0
	},
	"system-supply": {
		x: 640,
		y: 574,
		angle: 0
	},
	"system-return": {
		x: 640,
		y: 620,
		angle: 180
	},
	"heating-supply": {
		x: 720,
		y: 472,
		angle: -90
	},
	"heating-return": {
		x: 830,
		y: 438,
		angle: 90
	}
}, ht = {
	"hp-supply": "heatPumpSupplyTemperature",
	"hp-return": "heatPumpReturnTemperature",
	"dhw-supply": "heatPumpSupplyTemperature",
	"dhw-return": "heatPumpReturnTemperature",
	"system-supply": "systemTemperature",
	"system-return": "heatingReturnTemperature",
	"heating-supply": "heatingSupplyTemperature",
	"heating-return": "heatingReturnTemperature"
}, gt = {
	"hp-supply": "Wärmepumpen-Vorlauf",
	"hp-return": "Wärmepumpen-Rücklauf",
	"dhw-supply": "Warmwasser-Vorlauf",
	"dhw-return": "Warmwasser-Rücklauf",
	"system-supply": "System-Vorlauf",
	"system-return": "System-Rücklauf",
	"heating-supply": "Heizkreis-Vorlauf",
	"heating-return": "Heizkreis-Rücklauf"
}, _t = {
	"hp-supply": "Heat pump supply",
	"hp-return": "Heat pump return",
	"dhw-supply": "Hot-water supply",
	"dhw-return": "Hot-water return",
	"system-supply": "System supply",
	"system-return": "System return",
	"heating-supply": "Heating supply",
	"heating-return": "Heating return"
};
function H(...e) {
	return e.filter(Boolean).join(" ");
}
function vt(e, t, n) {
	return Math.min(n, Math.max(t, e));
}
function yt(e, t, n) {
	switch (n.labelMode ?? "both") {
		case "technical": return e;
		case "friendly": return t;
		case "both": return `${e} · ${t}`;
		case "hidden": return "";
	}
}
function U(e, t, n, r, i) {
	let a = yt(n, r, i);
	return a ? A`<text class="component-title" x=${e} y=${t}>${a}</text>` : M;
}
function W(e, t, n, r, i, a = "micro-label", o = "start") {
	let s = i.labelMode ?? "both";
	return s === "hidden" ? M : s === "both" ? A`
      <text class=${a} x=${e} y=${t - 6} text-anchor=${o}>
        <tspan x=${e}>${n}</tspan>
        <tspan x=${e} dy="12">${r}</tspan>
      </text>
    ` : A`
    <text class=${a} x=${e} y=${t} text-anchor=${o}>
      ${s === "technical" ? n : r}
    </text>
  `;
}
function bt(e) {
	let t = vt((e + 10) / 75, 0, 1), n = [
		55,
		139,
		230
	], r = [
		239,
		58,
		74
	], i = (e) => Math.round(n[e] + (r[e] - n[e]) * t), a = [
		i(0),
		i(1),
		i(2)
	], o = a.map((e) => Math.round(e + (255 - e) * .58));
	return {
		color: `rgb(${a[0]} ${a[1]} ${a[2]})`,
		highlight: `rgb(${o[0]} ${o[1]} ${o[2]})`
	};
}
function xt(e) {
	return e?.toLowerCase().startsWith("de") === !1 ? ut : lt;
}
function St(e, t) {
	return e.values[t]?.display?.trim() || "—";
}
function Ct(e, t, n, r) {
	return `${n}: ${e.values[t]?.display?.trim() || r.unavailable}`;
}
function G(e, t) {
	return (n) => {
		if (n instanceof KeyboardEvent) {
			if (n.key !== "Enter" && n.key !== " ") return;
			n.preventDefault();
		}
		e.onEntityClick?.(t);
	};
}
function K(e, t) {
	return !!(e.onEntityClick && e.isEntityClickable?.(t));
}
function wt(e, t) {
	return e === void 0 ? t.unavailable : e ? t.active : t.inactive;
}
function Tt(e, t) {
	return e.valvePosition === "heating" ? t.heatingPosition : e.valvePosition === "dhw" ? t.hotWaterPosition : t.unavailable;
}
function Et(e) {
	let t = e.values.flowRate?.value;
	return typeof t != "number" || !Number.isFinite(t) ? 2.2 : vt(2.9 - Math.abs(t) * .045, .8, 2.8);
}
function Dt(e) {
	let t = e.fanSpeed ?? e.values.fanSpeed?.value;
	return typeof t != "number" || !Number.isFinite(t) ? 1.5 : vt(2.2 - t / 75, .45, 2.1);
}
function Ot(e, t, n, r) {
	let { state: i } = t, a = i.flow.segments[e], o = i.flow.visible && a.active, s = (n === lt ? gt : _t)[e], c = ht[e], l = o ? n.active : n.inactive, u = G(t, c), d = K(t, c), f = o && t.temperatureColoring && a.temperature !== void 0 && Number.isFinite(a.temperature) ? bt(a.temperature) : void 0, p = f ? `;--pipe-color:${f.color};--pipe-highlight:${f.highlight}` : "", m = mt[e], h = m.angle + (a.direction === "reverse" ? 180 : 0);
	return A`
    <g
      class=${H("pipe-segment", `pipe--${a.kind}`, `direction--${a.direction}`, o ? "is-active" : "is-muted", d && "is-clickable")}
      data-segment=${e}
      style=${`--flow-duration:${r.toFixed(2)}s${p}`}
      role=${d ? "button" : M}
      tabindex=${d ? "0" : M}
      aria-label=${`${s}: ${l}`}
      @click=${d ? u : M}
      @keydown=${d ? u : M}
    >
      <title>${s}: ${l}</title>
      <path class="pipe-base" d=${V[e]}></path>
      <path class="pipe-energy" d=${V[e]}></path>
      <path class="pipe-flow" d=${V[e]}></path>
      <path
        class="pipe-direction-arrow"
        d="M -7 -6 L 8 0 L -7 6 Z"
        transform=${`translate(${m.x} ${m.y}) rotate(${h})`}
        aria-hidden="true"
      ></path>
      <path class="pipe-hit" d=${V[e]}></path>
    </g>
  `;
}
function q(e, t, n) {
	let { x: r, y: i, code: a, label: o, key: s, compact: c = !1 } = e, l = e.align ?? "start";
	if (!t.state.values[s]) return M;
	let u = G(t, s), d = St(t.state, s), f = K(t, s), p = r + (l === "end" ? -15 : 15);
	return A`
    <g
      class=${H("diagram-component", f && "is-clickable")}
      data-value-key=${s}
      role=${f ? "button" : M}
      tabindex=${f ? "0" : M}
      aria-label=${Ct(t.state, s, o, n)}
      @click=${f ? u : M}
      @keydown=${f ? u : M}
    >
      <rect
        class="focus-ring"
        x=${r - (l === "end" ? 104 : 12)}
        y=${i - 32}
        width="116"
        height="64"
        rx="10"
      ></rect>
      <circle class="sensor-dot" cx=${r} cy=${i - 10} r="10"></circle>
      <rect class="sensor-mercury" x=${r - 1.5} y=${i - 16} width="3" height="11" rx="1.5"></rect>
      <circle class="sensor-mercury" cx=${r} cy=${i - 7} r="3.3"></circle>
      ${W(p, i - 14, a, o, t, "sensor-code", l)}
      <text
        class=${H("sensor-value", c ? "sensor-value--small" : void 0)}
        x=${p}
        y=${i + 9}
        text-anchor=${l}
      >${d}</text>
    </g>
  `;
}
function kt(e, t, n) {
	let r = e.state.fanActive ?? (n ? !0 : void 0), i = r === !0, a = G(e, "fan"), o = K(e, "fan");
	return A`
    <g
      class=${H("diagram-component", "fan", i && "is-on", r === void 0 && "is-unknown", o && "is-clickable")}
      style=${`--fan-duration:${Dt(e.state).toFixed(2)}s`}
      role=${o ? "button" : M}
      tabindex=${o ? "0" : M}
      aria-label=${`${t.fan}: ${wt(r, t)}`}
      @click=${o ? a : M}
      @keydown=${o ? a : M}
    >
      <circle class="focus-ring" cx="420" cy="122" r="49"></circle>
      <circle class="interactive-surface" cx="420" cy="122" r="42"></circle>
      <g class="fan-blades">
        <path class="fan-blade" d="M 416 114 C 409 99 412 84 423 82 C 435 80 439 93 432 106 L 425 116 Z"></path>
        <path class="fan-blade" d="M 416 114 C 409 99 412 84 423 82 C 435 80 439 93 432 106 L 425 116 Z" transform="rotate(90 420 122)"></path>
        <path class="fan-blade" d="M 416 114 C 409 99 412 84 423 82 C 435 80 439 93 432 106 L 425 116 Z" transform="rotate(180 420 122)"></path>
        <path class="fan-blade" d="M 416 114 C 409 99 412 84 423 82 C 435 80 439 93 432 106 L 425 116 Z" transform="rotate(270 420 122)"></path>
      </g>
      <circle class="fan-hub" cx="420" cy="122" r="9"></circle>
      ${W(420, 181, "FAN", t.fan, e, "micro-label", "middle")}
    </g>
  `;
}
function At(e, t) {
	let n = e.state.compressorActive, r = n === !0, i = G(e, "compressor"), a = K(e, "compressor");
	return A`
    <g
      class=${H("diagram-component", "compressor", r && "is-on", n === void 0 && "is-unknown", a && "is-clickable")}
      role=${a ? "button" : M}
      tabindex=${a ? "0" : M}
      aria-label=${`${t.compressor}: ${wt(n, t)}`}
      @click=${a ? i : M}
      @keydown=${a ? i : M}
    >
      <rect class="focus-ring" x="566" y="82" width="58" height="86" rx="16"></rect>
      <rect class="compressor-body" x="574" y="91" width="42" height="68" rx="14"></rect>
      <path class="compressor-wave" d="M 584 132 C 590 112, 600 150, 607 117"></path>
      <path class="compressor-wave" d="M 583 104 H 607"></path>
      ${W(595, 181, "COMP", t.compressor, e, "micro-label", "middle")}
    </g>
  `;
}
function jt(e, t, n, r, i, a, o, s) {
	let c = G(o, i), l = a === !0, u = K(o, i);
	return A`
    <g
      class=${H("diagram-component", "pump", l && "is-on", a === void 0 && "is-unknown", u && "is-clickable")}
      role=${u ? "button" : M}
      tabindex=${u ? "0" : M}
      aria-label=${`${r}: ${wt(a, s)}`}
      @click=${u ? c : M}
      @keydown=${u ? c : M}
    >
      <circle class="focus-ring" cx=${e} cy=${t} r="27"></circle>
      <circle class="interactive-surface" cx=${e} cy=${t} r="18"></circle>
      <g transform=${`translate(${e} ${t})`}>
        <g class="pump-impeller">
          <path class="pump-blade" d="M 0 -3 L 3 -13 Q 13 -8 11 1 Z"></path>
          <path class="pump-blade" d="M 0 -3 L 3 -13 Q 13 -8 11 1 Z" transform="rotate(120)"></path>
          <path class="pump-blade" d="M 0 -3 L 3 -13 Q 13 -8 11 1 Z" transform="rotate(240)"></path>
        </g>
      </g>
      <circle class="pump-hub" cx=${e} cy=${t} r="4"></circle>
      ${W(e + 27, t + 4, n, r, o)}
    </g>
  `;
}
function Mt(e, t) {
	let n = e.state.auxiliaryHeaterActive, r = n === !0, i = G(e, "auxiliaryHeater"), a = K(e, "auxiliaryHeater");
	return A`
    <g
      class=${H("diagram-component", "heater", r && "is-on", n === void 0 && "is-unknown", a && "is-clickable")}
      role=${a ? "button" : M}
      tabindex=${a ? "0" : M}
      aria-label=${`${t.heater}: ${wt(n, t)}`}
      @click=${a ? i : M}
      @keydown=${a ? i : M}
    >
      <rect class="focus-ring" x="405" y="268" width="50" height="52" rx="9"></rect>
      <rect class="heater-body" x="414" y="274" width="32" height="40" rx="7"></rect>
      <path class="heater-bolt" d="M 432 280 L 422 297 H 430 L 425 308 L 440 290 H 432 Z"></path>
      ${W(454, 295, "DHK", t.heater, e)}
    </g>
  `;
}
function Nt(e, t) {
	let n = e.state.valvePosition, r = G(e, "diverterValve"), i = K(e, "diverterValve"), a = n === "dhw" ? "M 430 389 V 410 H 408" : n === "heating" ? "M 430 389 V 432" : void 0, o = n === "dhw" ? "translate(407 410) rotate(180)" : "translate(430 433) rotate(90)", s = e.state.flow.visible && (n === "dhw" ? e.state.flow.segments["dhw-supply"].active : n === "heating" && e.state.flow.segments["system-supply"].active);
	return A`
    <g
      class=${H("diagram-component", "valve", `valve--${n}`, n === "unknown" && "is-unknown", i && "is-clickable")}
      role=${i ? "button" : M}
      tabindex=${i ? "0" : M}
      aria-label=${`${t.diverterValve}: ${Tt(e.state, t)}`}
      @click=${i ? r : M}
      @keydown=${i ? r : M}
    >
      <circle class="focus-ring" cx="430" cy="410" r="32"></circle>
      <circle class="valve-body" cx="430" cy="410" r="22"></circle>
      <path class="valve-route-base" d="M 430 388 V 410 H 408 M 430 410 V 432"></path>
      ${a ? A`
            <path
              class=${H("valve-route-selected", s && "is-flowing")}
              d=${a}
            ></path>
            <path
              class=${H("valve-route-arrow", s && "is-flowing")}
              d="M -5 -4 L 6 0 L -5 4 Z"
              transform=${o}
            ></path>
          ` : M}
      ${W(456, 396, "3WUV", t.diverterValve, e)}
      ${e.labelMode === "hidden" ? M : A`
            <text class="valve-port-label" x="395" y="400" text-anchor="end">WW</text>
            <text class="valve-port-label" x="442" y="443">HK</text>
          `}
    </g>
  `;
}
function Pt(e, t) {
	let n = e.state.values.systemPressure;
	if (!n) return M;
	let r = We(n.value, e.systemPressureLimits), i = G(e, "systemPressure"), a = K(e, "systemPressure"), o = t.pressureStatus[r];
	return A`
    <g
      class=${H("diagram-component", "pressure-reading", `pressure-reading--${r}`, a && "is-clickable")}
      data-value-key="systemPressure"
      data-pressure-status=${r}
      role=${a ? "button" : M}
      tabindex=${a ? "0" : M}
      aria-label=${`${t.systemPressure}: ${n.display}; ${o}`}
      @click=${a ? i : M}
      @keydown=${a ? i : M}
    >
      <rect class="focus-ring" x="438" y="454" width="124" height="60" rx="12"></rect>
      <rect class="pressure-reading-surface" x="442" y="458" width="116" height="52" rx="10"></rect>
      <path class="pressure-gauge-arc" d="M 447 487 A 11 11 0 0 1 469 487"></path>
      <path class="pressure-gauge-needle" d="M 458 486 L 465 476"></path>
      <circle class="pressure-gauge-hub" cx="458" cy="486" r="2.7"></circle>
      ${W(478, 480, "DHK", t.systemPressureShort, e)}
      <text class="sensor-value sensor-value--small" x="478" y="503">${n.display}</text>
      ${r === "normal" ? M : A`
              <circle class="pressure-alert-badge" cx="547" cy="469" r="8"></circle>
              <text class="pressure-alert-mark" x="547" y="473" text-anchor="middle">!</text>
            `}
    </g>
  `;
}
function Ft(e, t) {
	let n = !!e.state.values.flowRate, r = n && K(e, "flowRate"), i = G(e, "flowRate");
	return A`
    <g
      class=${H("diagram-component", "flow-meter", r && "is-clickable")}
      role=${r ? "button" : M}
      tabindex=${r ? "0" : M}
      aria-label=${n ? Ct(e.state, "flowRate", t.flowRate, t) : t.flowRate}
      @click=${r ? i : M}
      @keydown=${r ? i : M}
    >
      <circle class="focus-ring" cx="430" cy="338" r="24"></circle>
      <circle class="junction" cx="430" cy="338" r="13"></circle>
      <path class="flow-meter__bars" d="M 430 327 V 349 M 424 330 V 346 M 436 330 V 346"></path>
      ${W(450, 332, "DFL", t.flowRate, e)}
      ${n ? A`<text class="sensor-value sensor-value--small" x="450" y="352">${St(e.state, "flowRate")}</text>` : M}
    </g>
  `;
}
function It(e, t, n) {
	let r = e.state.flow.segments["dhw-supply"], i = e.state.flow.visible && r.active, a = G(e, "dhwTemperature"), o = K(e, "dhwTemperature");
	return A`
    <g
      class=${H("diagram-component", o && "is-clickable")}
      role=${o ? "button" : M}
      tabindex=${o ? "0" : M}
      aria-label=${Ct(e.state, "dhwTemperature", t.hotWater, t)}
      @click=${o ? a : M}
      @keydown=${o ? a : M}
    >
      <rect class="focus-ring" x="43" y="307" width="205" height="251" rx="38"></rect>
      <rect class="tank-shell" x="51" y="315" width="189" height="235" rx="32"></rect>
      <path class="tank-water-line" d="M 70 376 Q 98 368 126 376 T 183 376 T 222 376"></path>
      ${U(73, 348, "WW", t.hotWater, e)}
    </g>
    <g
      class=${H("tank-coil", i && "is-active", r.direction === "reverse" && "direction--reverse")}
      style=${`--flow-duration:${n.toFixed(2)}s`}
      aria-hidden="true"
    >
      <path
        class="tank-coil-base"
        d=${pt}
      ></path>
      <path
        class="tank-coil-flow"
        d=${pt}
      ></path>
    </g>
  `;
}
function Lt(e, t, n) {
	let r = e.state.flow.segments["heating-supply"].active, i = e.state.flow.segments["heating-return"].active, a = e.state.flow.visible && r && i, o = e.state.flow.segments["heating-supply"].direction, s = G(e, "heatingSupplyTemperature"), c = K(e, "heatingSupplyTemperature"), l = "M 720 325 V 222 H 742 V 292 H 764 V 222 H 786 V 292 H 808 V 222 H 830 V 325";
	return A`
    <g
      class=${H("diagram-component", "emitter", a && "is-active", c && "is-clickable")}
      role=${c ? "button" : M}
      tabindex=${c ? "0" : M}
      aria-label=${`${t.heatingCircuit}: ${a ? t.active : t.inactive}`}
      @click=${c ? s : M}
      @keydown=${c ? s : M}
    >
      <rect class="focus-ring" x="682" y="157" width="186" height="176" rx="22"></rect>
      <rect class="component-panel" x="690" y="165" width="170" height="160" rx="18"></rect>
      ${U(710, 194, "HK", t.heatingCircuit, e)}
      ${[
		0,
		1,
		2,
		3,
		4,
		5
	].map((e) => A`<rect
            class="emitter-fin"
            x=${713 + e * 22}
            y="211"
            width="14"
            height="86"
            rx="6"
            style=${`--fin-delay:${(e * .1).toFixed(1)}s`}
          ></rect>`)}
    </g>
    <g
      class=${H("internal-flow", "pipe--supply", a && "is-active", o === "reverse" && "direction--reverse")}
      style=${`--flow-duration:${n.toFixed(2)}s`}
      aria-hidden="true"
    >
      <path class="internal-flow__base" d=${l}></path>
      <path class="internal-flow__particles" d=${l}></path>
    </g>
  `;
}
function Rt(e, t) {
	let n = t.mode[e.mode] ?? e.rawMode ?? t.mode.idle;
	return A`
    <g class="status-pill" aria-label=${n}>
      <rect class="status-pill__surface" x="24" y="24" width="150" height="40" rx="20"></rect>
      <circle class="status-pill__dot" cx="46" cy="44" r="6"></circle>
      <text class="status-pill__text" x="62" y="49">${n}</text>
    </g>
  `;
}
function zt(e) {
	let { state: t } = e, n = xt(e.locale), r = Et(t), i = t.flow.segments["hp-supply"], a = t.flow.segments["hp-return"], o = t.flow.visible && i.active && a.active, s = t.compressorActive === !0 || t.compressorActive === void 0 && t.fanActive === void 0 && o, c = t.flow.visible && t.flow.segments["system-supply"].active;
	return A`
    <svg
      class=${H("flow-diagram", `mode--${t.mode}`, e.animationsPaused && "animations-paused")}
      viewBox="0 0 930 720"
      preserveAspectRatio="xMidYMid meet"
      role="group"
      aria-labelledby="wolf-flow-title wolf-flow-description"
    >
      <title id="wolf-flow-title">${n.title}</title>
      <desc id="wolf-flow-description">${n.description}</desc>
      <defs>
        <linearGradient id="wolf-tank-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--wolf-supply-color)" stop-opacity="0.22"></stop>
          <stop offset="48%" stop-color="var(--wolf-panel-color)" stop-opacity="0.86"></stop>
          <stop offset="100%" stop-color="var(--wolf-return-color)" stop-opacity="0.25"></stop>
        </linearGradient>
        <linearGradient id="wolf-coil-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="var(--wolf-supply-color)"></stop>
          <stop offset="53%" stop-color="#b35e9e"></stop>
          <stop offset="100%" stop-color="var(--wolf-return-color)"></stop>
        </linearGradient>
        <linearGradient id="wolf-collector-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--wolf-supply-color)" stop-opacity="0.9"></stop>
          <stop offset="46%" stop-color="#b25b9d" stop-opacity="0.78"></stop>
          <stop offset="100%" stop-color="var(--wolf-return-color)" stop-opacity="0.9"></stop>
        </linearGradient>
      </defs>

      <rect class="diagram-bg" width="930" height="720" rx="24"></rect>
      ${t.faultActive ? A`<rect class="fault-overlay" width="930" height="720" rx="24"></rect>` : M}
      ${Rt(t, n)}

      <!-- Component surfaces form the quiet background; live pipes stay legible above them. -->
      <g aria-hidden="true">
        <rect class="component-panel" x="350" y="35" width="300" height="170" rx="22"></rect>
        <rect class="component-panel" x="370" y="236" width="240" height="280" rx="22"></rect>
      </g>

      ${It(e, n, r)}
      ${Lt(e, n, r)}

      <!-- The collector sits behind both horizontal pipes so flow remains visible through it. -->
      <g class=${H("collector", c && "is-active")} aria-label=${n.collector}>
        <rect class="collector-body" x="616" y="546" width="48" height="102" rx="8"></rect>
        <path class="tank-water-line" d="M 622 596 H 658"></path>
      </g>

      <g class="hydraulic-pipes">
        ${[
		"hp-supply",
		"hp-return",
		"dhw-supply",
		"dhw-return",
		"system-supply",
		"system-return",
		"heating-supply",
		"heating-return"
	].map((t) => Ot(t, e, n, r))}
      </g>

      <!-- Outdoor unit -->
      <g class="outdoor-unit" aria-label=${n.outdoorUnit}>
        ${U(372, 65, "WP", n.outdoorUnit, e)}
        ${kt(e, n, s)}
        <g class="heat-exchanger" aria-hidden="true">
          <rect
            class="component-panel--inner"
            x="477"
            y="92"
            width="80"
            height="62"
            rx="8"
          ></rect>
          <path class="heat-exchanger-fin heat-exchanger-fin--hot" d="M 481 101 H 552"></path>
          <path class="heat-exchanger-fin heat-exchanger-fin--hot" d="M 481 114 H 552"></path>
          <path class="heat-exchanger-fin heat-exchanger-fin--cold" d="M 481 132 H 552"></path>
          <path class="heat-exchanger-fin heat-exchanger-fin--cold" d="M 481 145 H 552"></path>
        </g>
        <g
          class=${H("outdoor-water", "pipe--supply", o && "is-active", i.direction === "reverse" && "direction--reverse")}
          style=${`--flow-duration:${r.toFixed(2)}s`}
          aria-hidden="true"
        >
          <path class="outdoor-water__base" d=${dt}></path>
          <path class="outdoor-water__flow" d=${dt}></path>
        </g>
        <g
          class=${H("outdoor-water", "pipe--return", o && "is-active", a.direction === "reverse" && "direction--reverse")}
          style=${`--flow-duration:${r.toFixed(2)}s`}
          aria-hidden="true"
        >
          <path class="outdoor-water__base" d=${ft}></path>
          <path class="outdoor-water__flow" d=${ft}></path>
        </g>
        ${At(e, n)}
      </g>

      <!-- Hydraulic module -->
      <g aria-label=${n.hydraulicModule}>
        ${U(390, 263, "HM", n.hydraulicModule, e)}
        ${Mt(e, n)}
        ${Ft(e, n)}
        ${Nt(e, n)}
        ${jt(570, 430, "ZHP", n.primaryPump, "primaryPump", t.primaryPumpActive, e, n)}
      </g>

        ${jt(720, 430, "HKP", n.heatingPump, "heatingCircuitPump", t.heatingCircuitPumpActive, e, n)}

      <!-- Readings are rendered last and stay readable above animated paths. -->
      ${q({
		x: 330,
		y: 130,
		code: "AT",
		label: n.outdoorTemperature,
		key: "outdoorTemperature",
		align: "end",
		compact: !0
	}, e, n)}
      ${q({
		x: 570,
		y: 235,
		code: "RL",
		label: n.return,
		key: "heatPumpReturnTemperature",
		align: "start"
	}, e, n)}
      ${q({
		x: 430,
		y: 370,
		code: "KF",
		label: n.boilerTemperature,
		key: "heatPumpSupplyTemperature",
		align: "end",
		compact: !0
	}, e, n)}
      ${q({
		x: 204,
		y: 395,
		code: "SF",
		label: n.storage,
		key: "dhwTemperature",
		align: "end",
		compact: !0
	}, e, n)}
      ${q({
		x: 640,
		y: 535,
		code: "SAF",
		label: n.collectorTemperature,
		key: "systemTemperature",
		align: "start",
		compact: !0
	}, e, n)}
      ${Pt(e, n)}
      ${q({
		x: 720,
		y: 380,
		code: "HK-VL",
		label: n.supply,
		key: "heatingSupplyTemperature",
		align: "end",
		compact: !0
	}, e, n)}
      ${q({
		x: 830,
		y: 380,
		code: "HK-RL",
		label: n.return,
		key: "heatingReturnTemperature",
		align: "start",
		compact: !0
	}, e, n)}

      ${!e.showLegend || e.labelMode === "hidden" ? M : A`
              <g class="flow-legend" aria-hidden="true">
                <line class="pipe-base" x1="620" y1="690" x2="642" y2="690" style="--pipe-color:var(--wolf-supply-color);opacity:.75"></line>
                <text class="micro-label" x="658" y="694">${yt("VL", n.supply, e)}</text>
                <line class="pipe-base" x1="792" y1="690" x2="814" y2="690" style="--pipe-color:var(--wolf-return-color);opacity:.75"></line>
                <text class="micro-label" x="830" y="694">${yt("RL", n.return, e)}</text>
              </g>
            `}
    </svg>
  `;
}
//#endregion
//#region src/state-resolver.ts
var Bt = /* @__PURE__ */ new Set(["unknown", "unavailable"]), Vt = {
	outdoorTemperature: "outdoor_temperature",
	heatPumpSupplyTemperature: "heat_pump_supply_temperature",
	heatPumpReturnTemperature: "heat_pump_return_temperature",
	systemTemperature: "system_temperature",
	flowRate: "flow_rate",
	systemPressure: "system_pressure",
	dhwTemperature: "dhw_temperature",
	dhwTargetTemperature: "dhw_target_temperature",
	heatingSupplyTemperature: "heating_supply_temperature",
	heatingReturnTemperature: "heating_return_temperature",
	heatingTargetTemperature: "heating_target_temperature",
	fanSpeed: "fan_speed",
	electricalPower: "electrical_power",
	thermalPower: "thermal_power",
	cop: "cop",
	compressorModulation: "compressor_modulation",
	compressorFrequency: "compressor_frequency"
};
function Ht(e) {
	if (e == null) return;
	let t = String(e).trim().toLocaleLowerCase("de-DE");
	if (t) return t.replaceAll("ä", "ae").replaceAll("ö", "oe").replaceAll("ü", "ue").replaceAll("ß", "ss").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "");
}
function Ut(e) {
	let t = Ht(e);
	return t === void 0 || Bt.has(t);
}
function Wt(e, t) {
	if (!t) return;
	let n = e.states[t];
	return n && !Ut(n.state) ? n : void 0;
}
function Gt(e, t) {
	let n = Wt(e, t)?.state;
	return typeof n == "string" ? n.trim() : void 0;
}
function Kt(e) {
	if (Ut(e)) return;
	if (typeof e == "number") return Number.isFinite(e) ? e : void 0;
	if (typeof e != "string") return;
	let t = e.trim(), n = /^[+-]?\d+,\d+(?:e[+-]?\d+)?$/i.test(t) ? t.replace(",", ".") : t;
	if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(n)) return;
	let r = Number(n);
	return Number.isFinite(r) ? r : void 0;
}
function qt(e, t) {
	let n = Wt(e, t);
	if (!n || !t) return;
	let r = Kt(n.state);
	if (r === void 0) return;
	let i = n.state.trim(), a = n.attributes.unit_of_measurement, o = typeof a == "string" && a.trim() ? a.trim() : void 0;
	return {
		entityId: t,
		value: r,
		rawState: i,
		...o ? { unit: o } : {},
		display: o ? `${i} ${o}` : i
	};
}
function J(e, t) {
	let n = Ht(e);
	return n !== void 0 && t.some((e) => Ht(e) === n);
}
function Y(e, t = Re) {
	if (!Ut(e)) {
		if (J(e, t.active)) return !0;
		if (J(e, t.inactive)) return !1;
	}
}
function Jt(e, t = Re) {
	let n = Kt(e);
	return n === void 0 ? Y(e, t) : n !== 0;
}
function Yt(e, t = Re) {
	return !J(e, [
		"vorspülen",
		"vorspuelen",
		"pre-flush",
		"preflush"
	]) && Y(e, t);
}
function Xt(e, t) {
	return [
		"fault",
		"defrost",
		"heating",
		"dhw",
		"cooling",
		"idle"
	].find((n) => J(e, t[n]));
}
function Zt(e, t) {
	return J(e, t.dhw) ? "dhw" : J(e, t.heating) ? "heating" : "unknown";
}
function Qt(e, t) {
	return J(e, t.cooling) ? "cooling" : J(e, t.heating) ? "heating" : "unknown";
}
function $t(e, t) {
	let n = Xt(e.operationMode, t.operationMode);
	if (Jt(e.fault, t.binary) === !0 || n === "fault") return "fault";
	if (Y(e.defrostActive, t.binary) === !0 || n === "defrost") return "defrost";
	if (n !== void 0) return n;
	if (Y(e.dhwActive, t.binary) === !0) return "dhw";
	if (Y(e.coolingActive, t.binary) === !0) return "cooling";
	if (Y(e.heatingActive, t.binary) === !0) return "heating";
	let r = Zt(e.threeWayValve, t.threeWayValve);
	if (r === "dhw") return "dhw";
	let i = Qt(e.heatingCoolingValve, t.heatingCoolingValve);
	return i === "cooling" ? "cooling" : r === "heating" || i === "heating" ? "heating" : "idle";
}
function X(e, t, n, r) {
	return {
		active: e,
		direction: n ? "reverse" : "forward",
		kind: t,
		...r === void 0 ? {} : { temperature: r }
	};
}
function en(e) {
	let t = typeof e.flowRateThreshold == "number" && Number.isFinite(e.flowRateThreshold) && e.flowRateThreshold >= 0 ? e.flowRateThreshold : .1, n = typeof e.flowRate == "number" && Number.isFinite(e.flowRate) && Math.abs(e.flowRate) > t, r = n && e.flowRate < 0, i = [
		"heating",
		"dhw",
		"cooling",
		"defrost"
	].includes(e.mode), a = e.flowRate !== void 0 || e.primaryPumpActive !== void 0 || e.heatingCircuitPumpActive !== void 0, o = i && !a, s = n || e.primaryPumpActive === !0 || o, c = e.heatingCircuitPumpActive === !0 || e.heatingCircuitPumpActive === void 0 && (e.mode === "heating" || e.mode === "cooling") && s, l = e.mode === "dhw", u = e.mode === "heating" || e.mode === "cooling";
	(e.mode === "defrost" || e.mode === "idle" || e.mode === "fault") && (e.valvePosition === "dhw" ? l = !0 : (e.valvePosition === "heating" || e.heatingCoolingValvePosition !== "unknown" || s) && (u = !0));
	let d = s, f = s && l, p = s && u, m = e.temperatures ?? {}, h = {
		"hp-supply": X(d, "supply", r, m.heatPumpSupply),
		"hp-return": X(d, "return", r, m.heatPumpReturn),
		"dhw-supply": X(f, "supply", r, m.heatPumpSupply),
		"dhw-return": X(f, "return", r, m.heatPumpReturn),
		"system-supply": X(p, "supply", r, m.systemSupply),
		"system-return": X(p, "return", r, m.systemReturn),
		"heating-supply": X(c, "supply", r, m.heatingSupply),
		"heating-return": X(c, "return", r, m.heatingReturn)
	};
	return {
		visible: Object.values(h).some(({ active: e }) => e),
		segments: h
	};
}
function Z(e, t, n) {
	return Gt(e, t[n]);
}
function tn(e, t) {
	let n = L(t), { entities: r, mappings: i } = n, a = Z(e, r, "operation_mode"), o = Z(e, r, "fault"), s = Z(e, r, "defrost_active"), c = Z(e, r, "three_way_valve"), l = Z(e, r, "heating_cooling_valve"), u = Zt(c, i.threeWayValve), d = Qt(l, i.heatingCoolingValve), f = Xt(a, i.operationMode), p = Jt(o, i.binary), m = Y(s, i.binary), h = $t({
		operationMode: a,
		fault: o,
		defrostActive: s,
		heatingActive: Z(e, r, "heating_active"),
		dhwActive: Z(e, r, "dhw_active"),
		coolingActive: Z(e, r, "cooling_active"),
		threeWayValve: c,
		heatingCoolingValve: l
	}, i), g = {};
	for (let [t, n] of Object.entries(Vt)) {
		let i = qt(e, r[n]);
		i !== void 0 && (g[t] = i);
	}
	let ee = Yt(Z(e, r, "compressor"), i.binary), _ = g.fanSpeed?.value, v = Y(Z(e, r, "fan"), i.binary) ?? (_ === void 0 ? void 0 : _ > 0), y = Y(Z(e, r, "auxiliary_heater"), i.binary), b = Y(Z(e, r, "heating_circuit_pump"), i.binary), x = Y(Z(e, r, "primary_pump"), i.binary), S = en({
		mode: h,
		valvePosition: u,
		heatingCoolingValvePosition: d,
		flowRate: g.flowRate?.value,
		flowRateThreshold: n.flow_rate_threshold,
		primaryPumpActive: x,
		heatingCircuitPumpActive: b,
		temperatures: {
			heatPumpSupply: g.heatPumpSupplyTemperature?.value,
			heatPumpReturn: g.heatPumpReturnTemperature?.value,
			systemSupply: g.systemTemperature?.value,
			systemReturn: g.heatingReturnTemperature?.value,
			heatingSupply: g.heatingSupplyTemperature?.value,
			heatingReturn: g.heatingReturnTemperature?.value
		}
	});
	return {
		mode: h,
		...a === void 0 ? {} : { rawMode: a },
		valvePosition: u,
		heatingCoolingValvePosition: d,
		faultActive: p ?? (f === "fault" || void 0),
		defrostActive: m ?? (f === "defrost" || void 0),
		compressorActive: ee,
		fanActive: v,
		auxiliaryHeaterActive: y,
		heatingCircuitPumpActive: b,
		primaryPumpActive: x,
		..._ === void 0 ? {} : { fanSpeed: _ },
		values: g,
		flow: S
	};
}
//#endregion
//#region src/styles.ts
var nn = o`
  :host {
    --wolf-supply-color: var(--error-color, #ef4050);
    --wolf-supply-highlight: #ff8a94;
    --wolf-return-color: var(--info-color, #478ee8);
    --wolf-return-highlight: #9ac7ff;
    --wolf-cooling-supply-color: #24a8d8;
    --wolf-cooling-return-color: #7f6ce0;
    --wolf-defrost-color: #9d72e6;
    --wolf-idle-pipe-color: var(--disabled-text-color, #9aa3af);
    --wolf-panel-color: color-mix(
      in srgb,
      var(--card-background-color, #fff) 91%,
      var(--primary-text-color, #20242b)
    );
    --wolf-panel-strong: color-mix(
      in srgb,
      var(--card-background-color, #fff) 82%,
      var(--primary-text-color, #20242b)
    );
    --wolf-panel-stroke: color-mix(in srgb, var(--primary-text-color, #20242b) 24%, transparent);
    --wolf-soft-stroke: color-mix(in srgb, var(--primary-text-color, #20242b) 13%, transparent);
    --wolf-surface-shadow: color-mix(in srgb, #000 17%, transparent);
    --wolf-text-color: var(--primary-text-color, #20242b);
    --wolf-secondary-text-color: var(--secondary-text-color, #6b7280);
    --wolf-focus-color: var(--primary-color, #03a9f4);
    display: block;
    min-width: 0;
  }

  ha-card {
    display: block;
    position: relative;
    overflow: hidden;
    border-radius: var(--ha-card-border-radius, 12px);
    color: var(--wolf-text-color);
    background: var(--ha-card-background, var(--card-background-color, #fff));
  }

  .card-shell {
    position: relative;
    min-width: 0;
  }

  .card-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 18px 20px 0;
  }

  .card-title {
    min-width: 0;
    overflow: hidden;
    color: var(--wolf-text-color);
    font-size: var(--ha-card-header-font-size, 20px);
    font-weight: 500;
    line-height: 1.3;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .flow-card-content {
    padding: 8px 12px 14px;
  }

  .flow-diagram-frame {
    position: relative;
    width: 100%;
    min-width: 0;
    overflow: hidden;
    border-radius: calc(var(--ha-card-border-radius, 12px) * 0.72);
    background:
      radial-gradient(
        circle at 50% 21%,
        color-mix(in srgb, var(--primary-color, #03a9f4) 6%, transparent),
        transparent 34%
      ),
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--primary-text-color, #20242b) 2.5%, transparent),
        transparent 42%
      );
  }

  .flow-diagram {
    display: block;
    width: 100%;
    height: auto;
    min-height: 300px;
    max-height: min(76vh, 760px);
    overflow: visible;
    color: var(--wolf-text-color);
    font-family: var(--ha-card-font-family, var(--paper-font-body1_-_font-family, sans-serif));
    shape-rendering: geometricPrecision;
    text-rendering: geometricPrecision;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(108px, 1fr));
    gap: 8px;
    padding: 4px 4px 0;
  }

  .metric {
    min-width: 0;
    padding: 10px 12px;
    border: 1px solid var(--wolf-soft-stroke);
    border-radius: 12px;
    background: color-mix(in srgb, var(--wolf-panel-color) 72%, transparent);
  }

  button.metric {
    width: 100%;
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: pointer;
  }

  button.metric:hover {
    border-color: color-mix(in srgb, var(--wolf-focus-color) 42%, transparent);
    background: color-mix(in srgb, var(--wolf-panel-strong) 84%, transparent);
  }

  button.metric:focus-visible {
    outline: 2px solid var(--wolf-focus-color);
    outline-offset: 2px;
  }

  .metric-label {
    display: -webkit-box;
    min-height: 2.5em;
    overflow: hidden;
    color: var(--wolf-secondary-text-color);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.35px;
    line-height: 1.25;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .metric-value {
    margin-top: 3px;
    overflow: hidden;
    color: var(--wolf-text-color);
    font-size: 18px;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    line-height: 1.25;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .metric--warning {
    border-color: color-mix(in srgb, #f59e0b 72%, var(--wolf-soft-stroke));
    background: color-mix(in srgb, #f59e0b 12%, var(--wolf-panel-color));
  }

  .metric--critical {
    border-color: color-mix(in srgb, var(--error-color, #db4437) 76%, var(--wolf-soft-stroke));
    background: color-mix(in srgb, var(--error-color, #db4437) 14%, var(--wolf-panel-color));
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--error-color, #db4437) 16%, transparent);
  }

  .metric--warning .metric-value {
    color: #c77800;
  }

  .metric--critical .metric-value {
    color: var(--error-color, #db4437);
  }

  .configuration-hint {
    padding: 20px;
    color: var(--wolf-secondary-text-color);
  }

  .layout--compact .flow-diagram {
    min-height: 250px;
    max-height: 520px;
  }

  .layout--wide .flow-diagram {
    min-height: 360px;
    max-height: min(82vh, 820px);
  }

  .diagram-bg {
    fill: transparent;
  }

  .component-panel {
    fill: var(--wolf-panel-color);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.5;
    filter: drop-shadow(0 8px 12px var(--wolf-surface-shadow));
  }

  .component-panel--inner {
    fill: color-mix(in srgb, var(--wolf-panel-strong) 72%, transparent);
    stroke: var(--wolf-soft-stroke);
    stroke-width: 1.25;
  }

  .component-title {
    fill: var(--wolf-text-color);
    font-size: 17px;
    font-weight: 650;
    letter-spacing: 0.1px;
  }

  .component-subtitle,
  .sensor-code,
  .micro-label {
    fill: var(--wolf-secondary-text-color);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .micro-label {
    font-size: 10.5px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  .sensor-value {
    fill: var(--wolf-text-color);
    font-size: 18px;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    paint-order: stroke;
    stroke: var(--ha-card-background, var(--card-background-color, #fff));
    stroke-linejoin: round;
    stroke-width: 3px;
  }

  .sensor-value--small {
    font-size: 16px;
  }

  .status-pill__surface {
    fill: var(--wolf-panel-color);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1;
  }

  .status-pill__dot {
    fill: var(--wolf-idle-pipe-color);
  }

  .status-pill__text {
    fill: var(--wolf-text-color);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.2px;
  }

  .mode--heating .status-pill__dot,
  .mode--dhw .status-pill__dot {
    fill: var(--wolf-supply-color);
  }

  .mode--cooling .status-pill__dot {
    fill: var(--wolf-cooling-supply-color);
  }

  .mode--defrost .status-pill__dot {
    fill: var(--wolf-defrost-color);
  }

  .mode--fault .status-pill__surface {
    fill: color-mix(in srgb, var(--error-color, #db4437) 16%, var(--wolf-panel-color));
    stroke: color-mix(in srgb, var(--error-color, #db4437) 65%, transparent);
  }

  .mode--fault .status-pill__dot {
    fill: var(--error-color, #db4437);
    animation: wolf-alert-pulse 1.4s ease-in-out infinite;
  }

  .pipe-base,
  .pipe-energy,
  .pipe-flow,
  .pipe-hit {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  .pipe-direction-arrow {
    fill: var(--pipe-highlight, var(--pipe-color));
    opacity: 0;
    pointer-events: none;
    stroke: var(--pipe-color);
    stroke-linejoin: round;
    stroke-width: 1.5px;
    transition: opacity 220ms ease;
    vector-effect: non-scaling-stroke;
  }

  .pipe-base {
    stroke: var(--pipe-color, var(--wolf-idle-pipe-color));
    stroke-width: 9px;
    opacity: 0.25;
  }

  .pipe-energy {
    stroke: var(--pipe-color, var(--wolf-idle-pipe-color));
    stroke-width: 7px;
    opacity: 0;
    transition: opacity 220ms ease;
  }

  .pipe-flow {
    stroke: var(--pipe-highlight, #fff);
    stroke-width: 4px;
    stroke-dasharray: 1 17;
    stroke-dashoffset: 0;
    opacity: 0;
    filter: drop-shadow(0 0 3px var(--pipe-color, transparent));
    transition: opacity 220ms ease;
  }

  .pipe-hit {
    pointer-events: none;
    stroke: transparent;
    stroke-width: 26px;
  }

  .pipe-segment.is-clickable .pipe-hit {
    cursor: pointer;
    pointer-events: stroke;
  }

  .pipe-segment {
    --pipe-color: var(--wolf-idle-pipe-color);
    --pipe-highlight: color-mix(in srgb, var(--wolf-idle-pipe-color) 54%, white);
    outline: none;
  }

  .pipe-segment.pipe--supply {
    --pipe-color: var(--wolf-supply-color);
    --pipe-highlight: var(--wolf-supply-highlight);
  }

  .pipe-segment.pipe--return {
    --pipe-color: var(--wolf-return-color);
    --pipe-highlight: var(--wolf-return-highlight);
  }

  .mode--cooling .pipe-segment.pipe--supply {
    --pipe-color: var(--wolf-cooling-supply-color);
    --pipe-highlight: #a7efff;
  }

  .mode--cooling .pipe-segment.pipe--return {
    --pipe-color: var(--wolf-cooling-return-color);
    --pipe-highlight: #c9c1ff;
  }

  .mode--defrost .pipe-segment.is-active {
    --pipe-color: var(--wolf-defrost-color);
    --pipe-highlight: #e3d2ff;
  }

  .pipe-segment.is-active .pipe-base {
    opacity: 0.58;
  }

  .pipe-segment.is-active .pipe-energy {
    opacity: 0.46;
  }

  .pipe-segment.is-active .pipe-flow {
    opacity: 1;
    animation: wolf-flow-forward var(--flow-duration, 2.2s) linear infinite;
  }

  .pipe-segment.is-active .pipe-direction-arrow {
    opacity: 0.95;
  }

  .pipe-segment.is-active.direction--reverse .pipe-flow {
    animation-name: wolf-flow-reverse;
  }

  .pipe-segment.is-muted .pipe-base {
    opacity: 0.13;
    filter: saturate(0.4);
  }

  .pipe-segment.is-muted {
    --pipe-color: var(--wolf-idle-pipe-color);
    --pipe-highlight: color-mix(in srgb, var(--wolf-idle-pipe-color) 54%, white);
  }

  .pipe-segment.is-clickable:focus-visible .pipe-hit {
    stroke: var(--wolf-focus-color);
    stroke-width: 18px;
    opacity: 0.28;
  }

  .junction {
    fill: var(--wolf-panel-strong);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.25;
  }

  .diagram-component {
    outline: none;
  }

  .diagram-component.is-clickable {
    cursor: pointer;
  }

  .diagram-component .focus-ring {
    fill: none;
    pointer-events: none;
    stroke: transparent;
    stroke-width: 4px;
    vector-effect: non-scaling-stroke;
  }

  .diagram-component.is-clickable:hover .component-panel,
  .diagram-component.is-clickable:hover .interactive-surface {
    stroke: color-mix(in srgb, var(--primary-color, #03a9f4) 45%, var(--wolf-panel-stroke));
  }

  .diagram-component.is-clickable:focus-visible .focus-ring {
    stroke: var(--wolf-focus-color);
  }

  .interactive-surface {
    fill: var(--wolf-panel-strong);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.5;
    vector-effect: non-scaling-stroke;
  }

  .is-on .interactive-surface,
  .is-on.interactive-surface {
    stroke: color-mix(in srgb, var(--primary-color, #03a9f4) 65%, transparent);
    filter: drop-shadow(0 0 5px color-mix(in srgb, var(--primary-color, #03a9f4) 34%, transparent));
  }

  .diagram-component.is-unknown .interactive-surface,
  .compressor.is-unknown .compressor-body,
  .heater.is-unknown .heater-body {
    opacity: 0.64;
    stroke-dasharray: 4 3;
  }

  .diagram-component.is-unknown .fan-blades,
  .diagram-component.is-unknown .pump-impeller,
  .diagram-component.is-unknown .heater-bolt {
    opacity: 0.48;
  }

  .fan-hub,
  .pump-hub {
    fill: color-mix(in srgb, var(--wolf-panel-strong) 55%, var(--wolf-secondary-text-color));
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.25;
  }

  .fan-blades {
    color: var(--wolf-secondary-text-color);
    transform-box: view-box;
    transform-origin: 420px 122px;
    will-change: transform;
  }

  .pump-impeller {
    color: var(--wolf-secondary-text-color);
    transform-box: fill-box;
    transform-origin: center;
  }

  .is-on .fan-blades {
    color: var(--primary-color, #03a9f4);
    animation: wolf-spin var(--fan-duration, 1.45s) linear infinite;
  }

  .is-on .pump-impeller {
    color: var(--wolf-supply-color);
    animation: wolf-spin 1.25s linear infinite;
  }

  .mode--cooling .is-on .pump-impeller {
    color: var(--wolf-cooling-supply-color);
  }

  .fan-blade,
  .pump-blade {
    fill: currentColor;
  }

  .compressor-body {
    fill: var(--wolf-panel-strong);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.5;
  }

  .compressor-wave {
    fill: none;
    stroke: var(--wolf-secondary-text-color);
    stroke-linecap: round;
    stroke-width: 2;
  }

  .compressor.is-on .compressor-body {
    stroke: var(--wolf-supply-color);
    filter: drop-shadow(0 0 5px color-mix(in srgb, var(--wolf-supply-color) 36%, transparent));
  }

  .compressor.is-on .compressor-wave {
    stroke: var(--wolf-supply-color);
    stroke-dasharray: 5 4;
    animation: wolf-compressor 1s linear infinite;
  }

  .heater-body {
    fill: color-mix(in srgb, var(--wolf-panel-strong) 82%, transparent);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.25;
  }

  .heater-bolt {
    fill: var(--wolf-secondary-text-color);
  }

  .heater.is-on .heater-body {
    fill: color-mix(in srgb, #f59e0b 18%, var(--wolf-panel-strong));
    stroke: #f59e0b;
  }

  .heater.is-on .heater-bolt {
    fill: #f59e0b;
    animation: wolf-heater-pulse 1.2s ease-in-out infinite;
  }

  .valve-body {
    fill: var(--wolf-panel-strong);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.5;
  }

  .valve-route-base,
  .valve-route-selected {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 6px;
  }

  .valve-route-base {
    stroke: var(--wolf-secondary-text-color);
    opacity: 0.24;
  }

  .valve-route-selected {
    stroke: var(--wolf-secondary-text-color);
    opacity: 0.68;
  }

  .valve-route-selected.is-flowing {
    stroke: var(--wolf-supply-color);
    opacity: 1;
    filter: drop-shadow(0 0 3px color-mix(in srgb, var(--wolf-supply-color) 38%, transparent));
  }

  .valve-route-arrow {
    fill: var(--wolf-secondary-text-color);
    opacity: 0.68;
  }

  .valve-route-arrow.is-flowing {
    fill: var(--wolf-supply-color);
    opacity: 1;
  }

  .mode--cooling .valve-route-selected.is-flowing {
    stroke: var(--wolf-cooling-supply-color);
  }

  .mode--cooling .valve-route-arrow.is-flowing {
    fill: var(--wolf-cooling-supply-color);
  }

  .mode--defrost .valve-route-selected.is-flowing {
    stroke: var(--wolf-defrost-color);
  }

  .mode--defrost .valve-route-arrow.is-flowing {
    fill: var(--wolf-defrost-color);
  }

  .valve-port-label {
    fill: var(--wolf-secondary-text-color);
    font-size: 9px;
    font-weight: 750;
    letter-spacing: 0.3px;
  }

  .flow-meter__bars {
    fill: none;
    stroke: var(--wolf-secondary-text-color);
    stroke-linecap: round;
    stroke-width: 2;
  }

  .heat-exchanger-fin {
    fill: none;
    stroke-linecap: round;
    stroke-width: 5px;
  }

  .heat-exchanger-fin--hot {
    stroke: var(--wolf-supply-color);
  }

  .heat-exchanger-fin--cold {
    stroke: var(--wolf-return-color);
  }

  .mode--cooling .heat-exchanger-fin--hot {
    stroke: var(--wolf-cooling-return-color);
  }

  .mode--cooling .heat-exchanger-fin--cold {
    stroke: var(--wolf-cooling-supply-color);
  }

  .outdoor-water {
    --pipe-color: var(--wolf-idle-pipe-color);
    --pipe-highlight: color-mix(in srgb, var(--wolf-idle-pipe-color) 54%, white);
    pointer-events: none;
  }

  .outdoor-water.pipe--supply {
    --pipe-color: var(--wolf-supply-color);
    --pipe-highlight: var(--wolf-supply-highlight);
  }

  .outdoor-water.pipe--return {
    --pipe-color: var(--wolf-return-color);
    --pipe-highlight: var(--wolf-return-highlight);
  }

  .mode--cooling .outdoor-water.pipe--supply {
    --pipe-color: var(--wolf-cooling-supply-color);
    --pipe-highlight: #a7efff;
  }

  .mode--cooling .outdoor-water.pipe--return {
    --pipe-color: var(--wolf-cooling-return-color);
    --pipe-highlight: #c9c1ff;
  }

  .outdoor-water__base,
  .outdoor-water__flow {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  .outdoor-water__base {
    stroke: var(--pipe-color);
    stroke-width: 7px;
    opacity: 0.42;
  }

  .outdoor-water__flow {
    stroke: var(--pipe-highlight);
    stroke-width: 3px;
    stroke-dasharray: 1 14;
    opacity: 0;
  }

  .outdoor-water.is-active .outdoor-water__flow {
    opacity: 0.95;
    animation: wolf-flow-forward var(--flow-duration, 2.2s) linear infinite;
  }

  .outdoor-water.is-active.direction--reverse .outdoor-water__flow {
    animation-name: wolf-flow-reverse;
  }

  .outdoor-water:not(.is-active) {
    --pipe-color: var(--wolf-idle-pipe-color);
    --pipe-highlight: color-mix(in srgb, var(--wolf-idle-pipe-color) 54%, white);
  }

  .outdoor-water:not(.is-active) .outdoor-water__base {
    opacity: 0.18;
  }

  .tank-shell {
    fill: url(#wolf-tank-fill);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.5;
  }

  .tank-water-line {
    fill: none;
    stroke: color-mix(in srgb, var(--wolf-return-color) 55%, transparent);
    stroke-width: 1;
  }

  .tank-coil-base {
    fill: none;
    stroke: url(#wolf-coil-gradient);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 8px;
    opacity: 0.66;
  }

  .tank-coil-flow {
    fill: none;
    stroke: #fff;
    stroke-dasharray: 1 15;
    stroke-linecap: round;
    stroke-width: 3.5px;
    opacity: 0;
  }

  .tank-coil.is-active .tank-coil-flow {
    opacity: 0.9;
    animation: wolf-flow-forward var(--flow-duration, 2.2s) linear infinite;
  }

  .tank-coil.is-active.direction--reverse .tank-coil-flow {
    animation-name: wolf-flow-reverse;
  }

  .tank-coil:not(.is-active) .tank-coil-base {
    stroke: var(--wolf-idle-pipe-color);
    opacity: 0.18;
  }

  .internal-flow {
    --pipe-color: var(--wolf-supply-color);
    --pipe-highlight: var(--wolf-supply-highlight);
    pointer-events: none;
  }

  .mode--cooling .internal-flow {
    --pipe-color: var(--wolf-cooling-supply-color);
    --pipe-highlight: #a7efff;
  }

  .internal-flow__base,
  .internal-flow__particles {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  .internal-flow__base {
    stroke: var(--pipe-color);
    stroke-width: 7px;
    opacity: 0.42;
  }

  .internal-flow__particles {
    stroke: var(--pipe-highlight);
    stroke-width: 3px;
    stroke-dasharray: 1 14;
    opacity: 0;
  }

  .internal-flow.is-active .internal-flow__particles {
    opacity: 0.95;
    animation: wolf-flow-forward var(--flow-duration, 2.2s) linear infinite;
  }

  .internal-flow.is-active.direction--reverse .internal-flow__particles {
    animation-name: wolf-flow-reverse;
  }

  .internal-flow:not(.is-active) {
    --pipe-color: var(--wolf-idle-pipe-color);
    --pipe-highlight: color-mix(in srgb, var(--wolf-idle-pipe-color) 54%, white);
  }

  .internal-flow:not(.is-active) .internal-flow__base {
    opacity: 0.18;
  }

  .emitter-fin {
    fill: color-mix(in srgb, var(--wolf-panel-strong) 82%, transparent);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1;
  }

  .emitter {
    --emitter-active-color: var(--wolf-supply-color);
  }

  .mode--cooling .emitter {
    --emitter-active-color: var(--wolf-cooling-supply-color);
  }

  .emitter.is-active .emitter-fin {
    fill: color-mix(in srgb, var(--emitter-active-color) 18%, var(--wolf-panel-strong));
    stroke: color-mix(in srgb, var(--emitter-active-color) 52%, var(--wolf-panel-stroke));
    animation: wolf-emitter-pulse 2.2s ease-in-out infinite;
    animation-delay: var(--fin-delay, 0s);
  }

  .collector-body {
    fill: url(#wolf-collector-fill);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.5;
  }

  .collector:not(.is-active) .collector-body {
    fill: color-mix(in srgb, var(--wolf-panel-strong) 72%, var(--wolf-idle-pipe-color));
    opacity: 0.62;
  }

  .pressure-gauge-arc,
  .pressure-gauge-needle {
    fill: none;
    stroke: var(--wolf-secondary-text-color);
    stroke-linecap: round;
    stroke-width: 2.5px;
  }

  .pressure-gauge-hub {
    fill: var(--wolf-secondary-text-color);
  }

  .pressure-reading-surface {
    fill: color-mix(in srgb, var(--wolf-panel-strong) 86%, transparent);
    stroke: var(--wolf-soft-stroke);
    stroke-width: 1.25px;
  }

  .pressure-alert-badge {
    fill: currentColor;
  }

  .pressure-alert-mark {
    fill: #fff;
    font-size: 12px;
    font-weight: 900;
  }

  .pressure-reading--warning {
    color: #c77800;
  }

  .pressure-reading--warning .pressure-gauge-arc,
  .pressure-reading--warning .pressure-gauge-needle {
    stroke: #f59e0b;
    filter: drop-shadow(0 0 3px color-mix(in srgb, #f59e0b 38%, transparent));
  }

  .pressure-reading--warning .pressure-gauge-hub,
  .pressure-reading--warning .sensor-value {
    fill: #c77800;
  }

  .pressure-reading--warning .pressure-reading-surface {
    fill: color-mix(in srgb, #f59e0b 10%, var(--wolf-panel-strong));
    stroke: color-mix(in srgb, #f59e0b 68%, var(--wolf-soft-stroke));
  }

  .pressure-reading--critical {
    color: var(--error-color, #db4437);
  }

  .pressure-reading--critical .pressure-gauge-arc,
  .pressure-reading--critical .pressure-gauge-needle {
    stroke: var(--error-color, #db4437);
    filter: drop-shadow(0 0 4px color-mix(in srgb, var(--error-color, #db4437) 48%, transparent));
    animation: wolf-alert-pulse 1.4s ease-in-out infinite;
  }

  .pressure-reading--critical .pressure-gauge-hub,
  .pressure-reading--critical .sensor-value {
    fill: var(--error-color, #db4437);
  }

  .pressure-reading--critical .pressure-reading-surface {
    fill: color-mix(in srgb, var(--error-color, #db4437) 12%, var(--wolf-panel-strong));
    stroke: color-mix(in srgb, var(--error-color, #db4437) 76%, var(--wolf-soft-stroke));
  }

  .pressure-reading--critical .pressure-alert-badge {
    animation: wolf-alert-pulse 1.4s ease-in-out infinite;
  }

  .sensor-dot {
    fill: var(--wolf-panel-strong);
    stroke: var(--wolf-panel-stroke);
    stroke-width: 1.25;
  }

  .sensor-mercury {
    fill: var(--wolf-secondary-text-color);
  }

  .is-unavailable .sensor-value,
  .is-unavailable.sensor-value {
    fill: var(--wolf-secondary-text-color);
    font-weight: 500;
  }

  .fault-overlay {
    fill: color-mix(in srgb, var(--error-color, #db4437) 8%, transparent);
    pointer-events: none;
  }

  .mode--fault .component-panel {
    stroke: color-mix(in srgb, var(--error-color, #db4437) 52%, var(--wolf-panel-stroke));
  }

  .mode--fault .pipe-flow,
  .mode--idle .pipe-flow {
    filter: none;
  }

  .animations-paused *,
  .animations-paused *::before,
  .animations-paused *::after {
    animation-play-state: paused !important;
  }

  @keyframes wolf-flow-forward {
    to {
      stroke-dashoffset: -36;
    }
  }

  @keyframes wolf-flow-reverse {
    to {
      stroke-dashoffset: 36;
    }
  }

  @keyframes wolf-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes wolf-compressor {
    to {
      stroke-dashoffset: -18;
    }
  }

  @keyframes wolf-heater-pulse {
    50% {
      opacity: 0.52;
      transform: translateY(-1px);
    }
  }

  @keyframes wolf-alert-pulse {
    50% {
      opacity: 0.35;
    }
  }

  @keyframes wolf-emitter-pulse {
    50% {
      opacity: 0.62;
      filter: drop-shadow(0 0 3px color-mix(in srgb, var(--emitter-active-color) 34%, transparent));
    }
  }

  @media (max-width: 520px) {
    .card-header-row {
      padding: 14px 14px 0;
    }

    .flow-card-content {
      padding: 6px 4px 10px;
    }

    .metrics-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .flow-diagram {
      min-height: 260px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .flow-diagram *,
    .flow-diagram *::before,
    .flow-diagram *::after {
      animation: none !important;
      transition-duration: 0.001ms !important;
    }

    .pipe-segment.is-active .pipe-flow {
      stroke-dasharray: none;
      opacity: 0.65;
    }

    .tank-coil.is-active .tank-coil-flow {
      stroke-dasharray: none;
      opacity: 0.5;
    }

    .outdoor-water.is-active .outdoor-water__flow {
      stroke-dasharray: none;
      opacity: 0.5;
    }
  }
`;
//#endregion
//#region \0@oxc-project+runtime@0.142.0/helpers/esm/decorate.js
function Q(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/wolf-heat-pump-flow-card.ts
var rn = {
	outdoorTemperature: "outdoor_temperature",
	heatPumpSupplyTemperature: "heat_pump_supply_temperature",
	heatPumpReturnTemperature: "heat_pump_return_temperature",
	systemTemperature: "system_temperature",
	flowRate: "flow_rate",
	systemPressure: "system_pressure",
	dhwTemperature: "dhw_temperature",
	dhwTargetTemperature: "dhw_target_temperature",
	heatingSupplyTemperature: "heating_supply_temperature",
	heatingReturnTemperature: "heating_return_temperature",
	heatingTargetTemperature: "heating_target_temperature",
	fanSpeed: "fan_speed",
	electricalPower: "electrical_power",
	thermalPower: "thermal_power",
	cop: "cop",
	compressorModulation: "compressor_modulation",
	compressorFrequency: "compressor_frequency",
	operationMode: "operation_mode",
	fan: "fan",
	compressor: "compressor",
	auxiliaryHeater: "auxiliary_heater",
	primaryPump: "primary_pump",
	heatingCircuitPump: "heating_circuit_pump",
	diverterValve: "three_way_valve"
}, an = [
	{
		valueKey: "electricalPower",
		entityKey: "electrical_power",
		label: "metric.electrical_power"
	},
	{
		valueKey: "thermalPower",
		entityKey: "thermal_power",
		label: "metric.thermal_power"
	},
	{
		valueKey: "cop",
		entityKey: "cop",
		label: "metric.cop"
	},
	{
		valueKey: "flowRate",
		entityKey: "flow_rate",
		label: "metric.flow_rate"
	},
	{
		valueKey: "systemPressure",
		entityKey: "system_pressure",
		label: "metric.system_pressure"
	},
	{
		valueKey: "dhwTargetTemperature",
		entityKey: "dhw_target_temperature",
		label: "metric.dhw_target_temperature"
	},
	{
		valueKey: "heatingTargetTemperature",
		entityKey: "heating_target_temperature",
		label: "metric.heating_target_temperature"
	},
	{
		valueKey: "compressorModulation",
		entityKey: "compressor_modulation",
		label: "metric.compressor_modulation"
	},
	{
		valueKey: "compressorFrequency",
		entityKey: "compressor_frequency",
		label: "metric.compressor_frequency"
	},
	{
		valueKey: "fanSpeed",
		entityKey: "fan_speed",
		label: "metric.fan_speed"
	},
	{
		valueKey: "outdoorTemperature",
		entityKey: "outdoor_temperature",
		label: "metric.outdoor_temperature"
	}
], $ = class extends I {
	constructor(...e) {
		super(...e), this.outsideViewport = !1, this.documentHidden = typeof document > "u" ? !1 : document.hidden, this.handleVisibilityChange = () => {
			this.documentHidden = document.hidden;
		}, this.handleStatesContext = (e, t) => {
			t && t !== this.contextUnsubscribe && (this.contextUnsubscribe?.(), this.contextUnsubscribe = t), this.contextStates = e;
		}, this.moreInfoForKey = (e) => {
			if (!this.config) return;
			let t = rn[e];
			if (!t) return;
			let n = L(this.config).entities[t];
			n && this.dispatchEvent(new CustomEvent("hass-more-info", {
				bubbles: !0,
				composed: !0,
				detail: { entityId: n }
			}));
		}, this.isEntityClickable = (e) => {
			if (!this.config) return !1;
			let t = rn[e];
			return t !== void 0 && !!L(this.config).entities[t];
		};
	}
	static {
		this.styles = nn;
	}
	static getConfigForm() {
		return ct();
	}
	static getStubConfig() {
		let { type: e, ...t } = Je();
		if (e !== "custom:wolf-heat-pump-flow-card") throw Error("Invalid built-in card preset.");
		return t;
	}
	setConfig(e) {
		if (!e || typeof e != "object") throw Error("Invalid WOLF Heat Pump Flow Card configuration.");
		if (e.type !== void 0 && e.type !== "custom:wolf-heat-pump-flow-card") throw Error(`Card type must be ${Fe}.`);
		this.config = {
			...e,
			type: Fe,
			entities: { ...e.entities },
			state_mapping: e.state_mapping ? {
				active: e.state_mapping.active ? [...e.state_mapping.active] : void 0,
				inactive: e.state_mapping.inactive ? [...e.state_mapping.inactive] : void 0
			} : void 0
		};
	}
	getCardSize() {
		return 12;
	}
	getGridOptions() {
		return {
			columns: 12,
			min_columns: 6
		};
	}
	connectedCallback() {
		if (super.connectedCallback(), document.addEventListener("visibilitychange", this.handleVisibilityChange), !this.hass) {
			let e = new CustomEvent("context-request", {
				bubbles: !0,
				composed: !0,
				cancelable: !0
			});
			e.context = "states", e.subscribe = !0, e.callback = this.handleStatesContext, this.dispatchEvent(e);
		}
	}
	firstUpdated() {
		typeof IntersectionObserver > "u" || (this.visibilityObserver = new IntersectionObserver(([e]) => {
			this.outsideViewport = e ? !e.isIntersecting : !1;
		}, { rootMargin: "80px" }), this.visibilityObserver.observe(this));
	}
	disconnectedCallback() {
		document.removeEventListener("visibilitychange", this.handleVisibilityChange), this.visibilityObserver?.disconnect(), this.visibilityObserver = void 0, this.contextUnsubscribe?.(), this.contextUnsubscribe = void 0, super.disconnectedCallback();
	}
	shouldUpdate(e) {
		return !(e.has("hass") && !this.config);
	}
	get language() {
		return this.hass?.locale?.language ?? this.hass?.language ?? (typeof navigator > "u" ? "de" : navigator.language);
	}
	modeLabel(e) {
		return R(`mode.${e.mode}`, this.language);
	}
	powerInKw(e) {
		if (!e || !Number.isFinite(e.value)) return;
		let t = e.unit?.trim();
		if (!t || t === "kW" || t === "kw" || t === "KW") return e.value;
		if (t === "W" || t === "w") return e.value / 1e3;
		if (t === "MW") return e.value * 1e3;
		if (t === "mW") return e.value / 1e6;
	}
	derivedCop(e) {
		if (e.values.cop) return;
		let t = this.powerInKw(e.values.electricalPower), n = this.powerInKw(e.values.thermalPower);
		if (t === void 0 || n === void 0 || t <= 0 || n <= 0) return;
		let r = n / t;
		return Number.isFinite(r) && r >= 0 && r <= 20 ? r.toFixed(2) : void 0;
	}
	renderMetric(e, t, n, r, i) {
		let a = this.config ? L(this.config).entities[n] : void 0, o = k`
      <div class="metric-label">${e}</div>
      <div class="metric-value">${t}</div>
    `;
		return a ? k`
          <button
            class=${`metric${i ? ` metric--${i}` : ""}`}
            type="button"
            title=${r ?? `${e}: ${t}`}
            @click=${() => this.moreInfoForKey(Object.entries(rn).find(([, e]) => e === n)?.[0] ?? "")}
          >
            ${o}
          </button>
        ` : k`<div
          class=${`metric${i ? ` metric--${i}` : ""}`}
          title=${r ?? `${e}: ${t}`}
        >
          ${o}
        </div>`;
	}
	renderMetrics(e) {
		if (!this.config) return M;
		let t = L(this.config), n = [];
		t.entities.operation_mode && e.rawMode && n.push(this.renderMetric(R("metric.operation_mode", this.language), this.modeLabel(e), "operation_mode", e.rawMode));
		for (let r of an) {
			if (!t.entities[r.entityKey]) continue;
			let i = e.values[r.valueKey];
			if (!i) continue;
			let a = r.entityKey === "system_pressure" ? We(i.value, t.system_pressure_limits) : void 0;
			n.push(this.renderMetric(R(r.label, this.language), i.display, r.entityKey, void 0, a));
		}
		let r = this.derivedCop(e);
		return !t.entities.cop && r && n.splice(Math.min(3, n.length), 0, this.renderMetric(`${R("metric.cop", this.language)}*`, r, "thermal_power", this.language.toLowerCase().startsWith("de") ? "Aus thermischer und elektrischer Leistung berechnet" : "Calculated from thermal and electrical power")), n.length ? k`<div class="metrics-grid">${n}</div>` : M;
	}
	render() {
		let e = this.hass ?? (this.contextStates ? { states: this.contextStates } : void 0);
		if (!this.config || !e) return k`<ha-card
        ><div class="configuration-hint">WOLF Heat Pump Flow Card</div></ha-card
      >`;
		let t = L(this.config), n = tn(e, this.config), r = !t.animations || this.outsideViewport || this.documentHidden;
		return k`
      <ha-card>
        <article
          class=${`card-shell layout--${t.layout}`}
          aria-label=${t.title ?? R("card.title", this.language)}
        >
          ${t.title ? k`
                  <header class="card-header-row">
                    <div class="card-title">${t.title}</div>
                  </header>
                ` : M}
          <div class="flow-card-content">
            <div class="flow-diagram-frame">
              ${zt({
			state: n,
			locale: this.language,
			onEntityClick: this.moreInfoForKey,
			isEntityClickable: this.isEntityClickable,
			animationsPaused: r,
			labelMode: t.label_mode,
			temperatureColoring: t.temperature_coloring,
			systemPressureLimits: t.system_pressure_limits,
			showLegend: t.show_legend
		})}
            </div>
            ${this.renderMetrics(n)}
          </div>
        </article>
      </ha-card>
    `;
	}
};
Q([Ne({ attribute: !1 })], $.prototype, "hass", void 0), Q([Pe()], $.prototype, "config", void 0), Q([Pe()], $.prototype, "outsideViewport", void 0), Q([Pe()], $.prototype, "documentHidden", void 0), Q([Pe()], $.prototype, "contextStates", void 0), customElements.get("wolf-heat-pump-flow-card") || customElements.define(Ie, $), window.customCards = window.customCards ?? [], window.customCards.some(({ type: e }) => e === "wolf-heat-pump-flow-card") || window.customCards.push({
	type: Ie,
	name: "WOLF Heat Pump Flow Card",
	description: "Animated WOLF heat-pump hydraulic flow visualization.",
	preview: !0
}), console.info("%c WOLF-HEAT-PUMP-FLOW-CARD %c v0.1.0", "color:#fff;background:#d51f2b;font-weight:700;padding:2px 6px;border-radius:3px 0 0 3px", "color:#fff;background:#30343b;font-weight:700;padding:2px 6px;border-radius:0 3px 3px 0");
//#endregion
export { $ as WolfHeatPumpFlowCard };
