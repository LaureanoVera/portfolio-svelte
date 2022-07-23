
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\Header.svelte generated by Svelte v3.48.0 */

    const file$b = "src\\components\\Header.svelte";

    function create_fragment$b(ctx) {
    	let header;
    	let nav;
    	let ul;
    	let li0;
    	let p;
    	let t1;
    	let li1;
    	let a;
    	let t2;

    	const block = {
    		c: function create() {
    			header = element("header");
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			p = element("p");
    			p.textContent = "0.00%";
    			t1 = space();
    			li1 = element("li");
    			a = element("a");
    			t2 = text("Descargar CV");
    			attr_dev(p, "class", "nav__target svelte-j2dcb9");
    			toggle_class(p, "scroll-full", /*scrolled*/ ctx[0] == 100);
    			add_location(p, file$b, 24, 8, 650);
    			add_location(li0, file$b, 23, 6, 636);
    			attr_dev(a, "href", /*cvSrc*/ ctx[2]);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "download", "laureano_vera.pdf");
    			attr_dev(a, "class", "nav__link svelte-j2dcb9");
    			add_location(a, file$b, 33, 8, 856);
    			attr_dev(li1, "class", "nav__item svelte-j2dcb9");
    			add_location(li1, file$b, 32, 6, 824);
    			attr_dev(ul, "class", "nav__list svelte-j2dcb9");
    			add_location(ul, file$b, 22, 4, 606);
    			attr_dev(nav, "class", "nav bd-grid svelte-j2dcb9");
    			add_location(nav, file$b, 21, 2, 575);
    			attr_dev(header, "class", "l-header svelte-j2dcb9");
    			add_location(header, file$b, 20, 0, 546);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, nav);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, p);
    			/*p_binding*/ ctx[3](p);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a);
    			append_dev(a, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*scrolled*/ 1) {
    				toggle_class(p, "scroll-full", /*scrolled*/ ctx[0] == 100);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			/*p_binding*/ ctx[3](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let cvSrc = "others/cv.pdf";
    	let scrolled;
    	let newText;

    	// let navTarget = document.querySelector(".nav__target");
    	window.addEventListener("scroll", () => {
    		const top = document.documentElement.scrollTop;
    		const scroll = document.documentElement.scrollHeight;
    		const client = document.documentElement.clientHeight;
    		const height = scroll - client;
    		$$invalidate(0, scrolled = top / height * 100);
    		let newInnerHTML = `${scrolled.toFixed(2)}%`;
    		$$invalidate(1, newText.innerHTML = newInnerHTML, newText);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	function p_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			newText = $$value;
    			$$invalidate(1, newText);
    		});
    	}

    	$$self.$capture_state = () => ({ cvSrc, scrolled, newText });

    	$$self.$inject_state = $$props => {
    		if ('cvSrc' in $$props) $$invalidate(2, cvSrc = $$props.cvSrc);
    		if ('scrolled' in $$props) $$invalidate(0, scrolled = $$props.scrolled);
    		if ('newText' in $$props) $$invalidate(1, newText = $$props.newText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [scrolled, newText, cvSrc, p_binding];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\Home.svelte generated by Svelte v3.48.0 */

    const file$a = "src\\components\\Home.svelte";

    function create_fragment$a(ctx) {
    	let section;
    	let div1;
    	let h1;
    	let span;
    	let t1;
    	let br;
    	let t2;
    	let t3;
    	let div0;
    	let a;
    	let i;
    	let t4;
    	let t5;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div1 = element("div");
    			h1 = element("h1");
    			span = element("span");
    			span.textContent = "HO";
    			t1 = space();
    			br = element("br");
    			t2 = text("_LA");
    			t3 = space();
    			div0 = element("div");
    			a = element("a");
    			i = element("i");
    			t4 = text(" Scroll down");
    			t5 = space();
    			img = element("img");
    			attr_dev(span, "class", "svelte-si6dxv");
    			add_location(span, file$a, 17, 6, 535);
    			add_location(br, file$a, 17, 22, 551);
    			attr_dev(h1, "class", "home__title animate__animated svelte-si6dxv");
    			attr_dev(h1, "id", "hero_text");
    			add_location(h1, file$a, 16, 4, 470);
    			attr_dev(i, "class", "fas fa-arrow-up");
    			add_location(i, file$a, 21, 9, 664);
    			attr_dev(a, "href", "#about");
    			attr_dev(a, "class", "home__scroll-link svelte-si6dxv");
    			add_location(a, file$a, 20, 6, 611);
    			attr_dev(div0, "class", "home__scroll svelte-si6dxv");
    			add_location(div0, file$a, 19, 4, 577);
    			if (!src_url_equal(img.src, img_src_value = /*imgSrc*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "home__img animate__animated svelte-si6dxv");
    			attr_dev(img, "alt", "Home");
    			attr_dev(img, "id", "hero_image");
    			add_location(img, file$a, 24, 4, 735);
    			attr_dev(div1, "class", "home__container bd-grid svelte-si6dxv");
    			add_location(div1, file$a, 15, 2, 427);
    			attr_dev(section, "class", "home svelte-si6dxv");
    			attr_dev(section, "id", "home");
    			add_location(section, file$a, 14, 0, 391);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div1);
    			append_dev(div1, h1);
    			append_dev(h1, span);
    			append_dev(h1, t1);
    			append_dev(h1, br);
    			append_dev(h1, t2);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, a);
    			append_dev(a, i);
    			append_dev(a, t4);
    			append_dev(div1, t5);
    			append_dev(div1, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let imgSrc = "images/perfil.svg";

    	const heroAnimation = () => {
    		let heroImage = document.getElementById("hero_image");
    		let heroText = document.getElementById("hero_text");
    		heroImage.classList.add("animate__zoomInRight");
    		heroText.classList.add("animate__flipInX");
    	};

    	document.addEventListener("DOMContentLoaded", heroAnimation);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ imgSrc, heroAnimation });

    	$$self.$inject_state = $$props => {
    		if ('imgSrc' in $$props) $$invalidate(0, imgSrc = $$props.imgSrc);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [imgSrc];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\ScrollAnimation.svelte generated by Svelte v3.48.0 */

    let windowSize = window.innerHeight;

    const scrollAnimation = (id, className) => {
    	let element = document.getElementById(id);
    	let position = element.getBoundingClientRect().top;

    	if (position < windowSize) {
    		element.classList.add(className);
    	}

    	if (position > windowSize || position < !windowSize) {
    		element.classList.remove(className);
    	}
    };

    /* src\components\About.svelte generated by Svelte v3.48.0 */
    const file$9 = "src\\components\\About.svelte";

    function create_fragment$9(ctx) {
    	let section;
    	let h20;
    	let i0;
    	let t0;
    	let t1;
    	let div3;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let div2;
    	let h21;
    	let t4;
    	let span3;
    	let span0;
    	let t6;
    	let span1;
    	let t8;
    	let br0;
    	let t9;
    	let span2;
    	let t11;
    	let p;
    	let t12;
    	let br1;
    	let t13;
    	let t14;
    	let h3;
    	let t16;
    	let ul;
    	let li0;
    	let t18;
    	let li1;
    	let t20;
    	let li2;
    	let t22;
    	let div1;
    	let a0;
    	let i1;
    	let t23;
    	let a1;
    	let i2;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h20 = element("h2");
    			i0 = element("i");
    			t0 = text(" Sobre Mi");
    			t1 = space();
    			div3 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			div2 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Soy Laureano Vera";
    			t4 = space();
    			span3 = element("span");
    			span0 = element("span");
    			span0.textContent = "<";
    			t6 = text("\r\n        Desarrollador Frontend\r\n        ");
    			span1 = element("span");
    			span1.textContent = "/>";
    			t8 = space();
    			br0 = element("br");
    			t9 = space();
    			span2 = element("span");
    			span2.textContent = "JavaScript - TypeScript - Svelte";
    			t11 = space();
    			p = element("p");
    			t12 = text("Hmm... constructor de tu futuro en la web y un super saiyan. Me alcanza\r\n        simplemente con conquistar el mundo, yasupiste!. ");
    			br1 = element("br");
    			t13 = text("\r\n        Una descripcion muy corta ja, probablemente programador.");
    			t14 = space();
    			h3 = element("h3");
    			h3.textContent = "Hobbies";
    			t16 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Escuchar Musica";
    			t18 = space();
    			li1 = element("li");
    			li1.textContent = "Beber Cafe";
    			t20 = space();
    			li2 = element("li");
    			li2.textContent = "Artes Marciales";
    			t22 = space();
    			div1 = element("div");
    			a0 = element("a");
    			i1 = element("i");
    			t23 = space();
    			a1 = element("a");
    			i2 = element("i");
    			attr_dev(i0, "class", "fa-solid fa-user-astronaut");
    			add_location(i0, file$9, 12, 4, 328);
    			attr_dev(h20, "class", "section-title");
    			add_location(h20, file$9, 11, 2, 296);
    			if (!src_url_equal(img.src, img_src_value = /*imgProfileSrc*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Laureano Verea");
    			attr_dev(img, "class", "svelte-11du0vd");
    			add_location(img, file$9, 16, 6, 502);
    			attr_dev(div0, "class", "about__img animate__animated svelte-11du0vd");
    			attr_dev(div0, "id", "left_animate");
    			add_location(div0, file$9, 15, 4, 434);
    			attr_dev(h21, "class", "about__subtitle svelte-11du0vd");
    			add_location(h21, file$9, 19, 6, 609);
    			attr_dev(span0, "class", "about__profesion-mod svelte-11du0vd");
    			add_location(span0, file$9, 21, 8, 709);
    			attr_dev(span1, "class", "about__profesion-mod svelte-11du0vd");
    			add_location(span1, file$9, 23, 8, 798);
    			add_location(br0, file$9, 24, 8, 856);
    			attr_dev(span2, "class", "about__profesion-plus svelte-11du0vd");
    			add_location(span2, file$9, 25, 8, 872);
    			attr_dev(span3, "class", "about__profession svelte-11du0vd");
    			add_location(span3, file$9, 20, 6, 667);
    			add_location(br1, file$9, 31, 57, 1155);
    			attr_dev(p, "class", "about__text svelte-11du0vd");
    			add_location(p, file$9, 29, 6, 992);
    			attr_dev(h3, "class", "about__hobbies svelte-11du0vd");
    			add_location(h3, file$9, 34, 6, 1247);
    			add_location(li0, file$9, 36, 8, 1308);
    			add_location(li1, file$9, 37, 8, 1342);
    			add_location(li2, file$9, 38, 8, 1371);
    			add_location(ul, file$9, 35, 6, 1294);
    			attr_dev(i1, "class", "fab fa-linkedin-in");
    			add_location(i1, file$9, 44, 37, 1592);
    			attr_dev(a0, "href", "https://www.linkedin.com/in/laureano-vera-320086204/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "about__social-icon svelte-11du0vd");
    			add_location(a0, file$9, 41, 8, 1453);
    			attr_dev(i2, "class", "fab fa-github");
    			add_location(i2, file$9, 49, 26, 1766);
    			attr_dev(a1, "href", "https://github.com/LaureanoVera");
    			attr_dev(a1, "class", "about__social-icon svelte-11du0vd");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$9, 46, 8, 1648);
    			attr_dev(div1, "class", "about__social");
    			add_location(div1, file$9, 40, 6, 1416);
    			attr_dev(div2, "class", "about__info-content");
    			add_location(div2, file$9, 18, 4, 568);
    			attr_dev(div3, "class", "about__container bd-grid svelte-11du0vd");
    			add_location(div3, file$9, 14, 2, 390);
    			attr_dev(section, "class", "about section");
    			attr_dev(section, "id", "about");
    			add_location(section, file$9, 10, 0, 250);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h20);
    			append_dev(h20, i0);
    			append_dev(h20, t0);
    			append_dev(section, t1);
    			append_dev(section, div3);
    			append_dev(div3, div0);
    			append_dev(div0, img);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, h21);
    			append_dev(div2, t4);
    			append_dev(div2, span3);
    			append_dev(span3, span0);
    			append_dev(span3, t6);
    			append_dev(span3, span1);
    			append_dev(span3, t8);
    			append_dev(span3, br0);
    			append_dev(span3, t9);
    			append_dev(span3, span2);
    			append_dev(div2, t11);
    			append_dev(div2, p);
    			append_dev(p, t12);
    			append_dev(p, br1);
    			append_dev(p, t13);
    			append_dev(div2, t14);
    			append_dev(div2, h3);
    			append_dev(div2, t16);
    			append_dev(div2, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t18);
    			append_dev(ul, li1);
    			append_dev(ul, t20);
    			append_dev(ul, li2);
    			append_dev(div2, t22);
    			append_dev(div2, div1);
    			append_dev(div1, a0);
    			append_dev(a0, i1);
    			append_dev(div1, t23);
    			append_dev(div1, a1);
    			append_dev(a1, i2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	let imgProfileSrc = "images/profile.jpg";

    	window.addEventListener("scroll", () => {
    		scrollAnimation("left_animate", "animate__bounceInLeft");
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ scrollAnimation, imgProfileSrc });

    	$$self.$inject_state = $$props => {
    		if ('imgProfileSrc' in $$props) $$invalidate(0, imgProfileSrc = $$props.imgProfileSrc);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [imgProfileSrc];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\components\Skills.svelte generated by Svelte v3.48.0 */
    const file$8 = "src\\components\\Skills.svelte";

    function create_fragment$8(ctx) {
    	let section;
    	let h2;
    	let i;
    	let t0;
    	let t1;
    	let div2;
    	let div0;
    	let h30;
    	let t3;
    	let span0;
    	let t5;
    	let span1;
    	let t7;
    	let span2;
    	let t9;
    	let span3;
    	let t11;
    	let span4;
    	let t13;
    	let span5;
    	let t15;
    	let h31;
    	let t17;
    	let span6;
    	let t19;
    	let span7;
    	let t21;
    	let span8;
    	let t23;
    	let span9;
    	let t25;
    	let h32;
    	let t27;
    	let span10;
    	let t29;
    	let span11;
    	let t31;
    	let span12;
    	let t33;
    	let br;
    	let t34;
    	let span13;
    	let t36;
    	let div1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h2 = element("h2");
    			i = element("i");
    			t0 = text(" Habilidades");
    			t1 = space();
    			div2 = element("div");
    			div0 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Desarrollo";
    			t3 = space();
    			span0 = element("span");
    			span0.textContent = "Html";
    			t5 = space();
    			span1 = element("span");
    			span1.textContent = "Css";
    			t7 = space();
    			span2 = element("span");
    			span2.textContent = "Javascript";
    			t9 = space();
    			span3 = element("span");
    			span3.textContent = "Svelte";
    			t11 = space();
    			span4 = element("span");
    			span4.textContent = "TypeScript";
    			t13 = space();
    			span5 = element("span");
    			span5.textContent = "Python";
    			t15 = space();
    			h31 = element("h3");
    			h31.textContent = "Herramientas";
    			t17 = space();
    			span6 = element("span");
    			span6.textContent = "Git";
    			t19 = space();
    			span7 = element("span");
    			span7.textContent = "Github";
    			t21 = space();
    			span8 = element("span");
    			span8.textContent = "NPM";
    			t23 = space();
    			span9 = element("span");
    			span9.textContent = "Terminal";
    			t25 = space();
    			h32 = element("h3");
    			h32.textContent = "Soft";
    			t27 = space();
    			span10 = element("span");
    			span10.textContent = "Flexibilidad";
    			t29 = space();
    			span11 = element("span");
    			span11.textContent = "Compromiso";
    			t31 = space();
    			span12 = element("span");
    			span12.textContent = "Creatividad";
    			t33 = space();
    			br = element("br");
    			t34 = space();
    			span13 = element("span");
    			span13.textContent = "Aprendizaje independiente";
    			t36 = space();
    			div1 = element("div");
    			img = element("img");
    			attr_dev(i, "class", "fas fa-code");
    			add_location(i, file$8, 12, 4, 323);
    			attr_dev(h2, "class", "section-title");
    			add_location(h2, file$8, 11, 2, 291);
    			attr_dev(h30, "class", "skills__subtitle svelte-fzwsqv");
    			add_location(h30, file$8, 16, 6, 451);
    			attr_dev(span0, "class", "skills__name svelte-fzwsqv");
    			add_location(span0, file$8, 17, 6, 503);
    			attr_dev(span1, "class", "skills__name svelte-fzwsqv");
    			add_location(span1, file$8, 18, 6, 549);
    			attr_dev(span2, "class", "skills__name svelte-fzwsqv");
    			add_location(span2, file$8, 19, 6, 594);
    			attr_dev(span3, "class", "skills__name svelte-fzwsqv");
    			add_location(span3, file$8, 20, 6, 646);
    			attr_dev(span4, "class", "skills__name svelte-fzwsqv");
    			add_location(span4, file$8, 21, 6, 694);
    			attr_dev(span5, "class", "skills__name svelte-fzwsqv");
    			add_location(span5, file$8, 22, 6, 746);
    			attr_dev(h31, "class", "skills__subtitle svelte-fzwsqv");
    			add_location(h31, file$8, 24, 6, 796);
    			attr_dev(span6, "class", "skills__name svelte-fzwsqv");
    			add_location(span6, file$8, 25, 6, 850);
    			attr_dev(span7, "class", "skills__name svelte-fzwsqv");
    			add_location(span7, file$8, 26, 6, 895);
    			attr_dev(span8, "class", "skills__name svelte-fzwsqv");
    			add_location(span8, file$8, 27, 6, 943);
    			attr_dev(span9, "class", "skills__name svelte-fzwsqv");
    			add_location(span9, file$8, 28, 6, 988);
    			attr_dev(h32, "class", "skills__subtitle svelte-fzwsqv");
    			add_location(h32, file$8, 30, 6, 1040);
    			attr_dev(span10, "class", "skills__name svelte-fzwsqv");
    			add_location(span10, file$8, 31, 6, 1086);
    			attr_dev(span11, "class", "skills__name svelte-fzwsqv");
    			add_location(span11, file$8, 32, 6, 1140);
    			attr_dev(span12, "class", "skills__name svelte-fzwsqv");
    			add_location(span12, file$8, 33, 6, 1192);
    			add_location(br, file$8, 33, 52, 1238);
    			attr_dev(span13, "class", "skills__name svelte-fzwsqv");
    			add_location(span13, file$8, 34, 6, 1252);
    			attr_dev(div0, "class", "skills__box");
    			add_location(div0, file$8, 15, 4, 418);
    			if (!src_url_equal(img.src, img_src_value = /*skillsImgSrc*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Skills");
    			add_location(img, file$8, 38, 6, 1401);
    			attr_dev(div1, "class", "skills__img animate__animated");
    			attr_dev(div1, "id", "right_animate");
    			add_location(div1, file$8, 37, 4, 1331);
    			attr_dev(div2, "class", "skills__container bd-grid svelte-fzwsqv");
    			add_location(div2, file$8, 14, 2, 373);
    			attr_dev(section, "class", "skills section");
    			attr_dev(section, "id", "skills");
    			add_location(section, file$8, 10, 0, 243);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h2);
    			append_dev(h2, i);
    			append_dev(h2, t0);
    			append_dev(section, t1);
    			append_dev(section, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h30);
    			append_dev(div0, t3);
    			append_dev(div0, span0);
    			append_dev(div0, t5);
    			append_dev(div0, span1);
    			append_dev(div0, t7);
    			append_dev(div0, span2);
    			append_dev(div0, t9);
    			append_dev(div0, span3);
    			append_dev(div0, t11);
    			append_dev(div0, span4);
    			append_dev(div0, t13);
    			append_dev(div0, span5);
    			append_dev(div0, t15);
    			append_dev(div0, h31);
    			append_dev(div0, t17);
    			append_dev(div0, span6);
    			append_dev(div0, t19);
    			append_dev(div0, span7);
    			append_dev(div0, t21);
    			append_dev(div0, span8);
    			append_dev(div0, t23);
    			append_dev(div0, span9);
    			append_dev(div0, t25);
    			append_dev(div0, h32);
    			append_dev(div0, t27);
    			append_dev(div0, span10);
    			append_dev(div0, t29);
    			append_dev(div0, span11);
    			append_dev(div0, t31);
    			append_dev(div0, span12);
    			append_dev(div0, t33);
    			append_dev(div0, br);
    			append_dev(div0, t34);
    			append_dev(div0, span13);
    			append_dev(div2, t36);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Skills', slots, []);
    	let skillsImgSrc = "images/skills.svg";

    	addEventListener("scroll", () => {
    		scrollAnimation("right_animate", "animate__bounceInRight");
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Skills> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ scrollAnimation, skillsImgSrc });

    	$$self.$inject_state = $$props => {
    		if ('skillsImgSrc' in $$props) $$invalidate(0, skillsImgSrc = $$props.skillsImgSrc);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [skillsImgSrc];
    }

    class Skills extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\TimeLineItem.svelte generated by Svelte v3.48.0 */

    const file$7 = "src\\components\\TimeLineItem.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (13:6) {#each list as item}
    function create_each_block$2(ctx) {
    	let li;
    	let t_value = /*item*/ ctx[3] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			add_location(li, file$7, 13, 8, 287);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*list*/ 4 && t_value !== (t_value = /*item*/ ctx[3] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(13:6) {#each list as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let t2;
    	let div2;
    	let h3;
    	let t3;
    	let t4;
    	let ul;
    	let each_value = /*list*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(/*date*/ ctx[0]);
    			t2 = space();
    			div2 = element("div");
    			h3 = element("h3");
    			t3 = text(/*name*/ ctx[1]);
    			t4 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "item__dot svelte-vob9hk");
    			add_location(div0, file$7, 7, 2, 122);
    			attr_dev(div1, "class", "item__date svelte-vob9hk");
    			add_location(div1, file$7, 8, 2, 151);
    			attr_dev(h3, "class", "svelte-vob9hk");
    			add_location(h3, file$7, 10, 4, 224);
    			attr_dev(ul, "class", "svelte-vob9hk");
    			add_location(ul, file$7, 11, 4, 245);
    			attr_dev(div2, "class", "item__content svelte-vob9hk");
    			add_location(div2, file$7, 9, 2, 191);
    			attr_dev(div3, "class", "item svelte-vob9hk");
    			add_location(div3, file$7, 6, 0, 100);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, h3);
    			append_dev(h3, t3);
    			append_dev(div2, t4);
    			append_dev(div2, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*date*/ 1) set_data_dev(t1, /*date*/ ctx[0]);
    			if (dirty & /*name*/ 2) set_data_dev(t3, /*name*/ ctx[1]);

    			if (dirty & /*list*/ 4) {
    				each_value = /*list*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TimeLineItem', slots, []);
    	let { date = 2022 } = $$props;
    	let { name = "" } = $$props;
    	let { list = [] } = $$props;
    	const writable_props = ['date', 'name', 'list'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TimeLineItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('date' in $$props) $$invalidate(0, date = $$props.date);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('list' in $$props) $$invalidate(2, list = $$props.list);
    	};

    	$$self.$capture_state = () => ({ date, name, list });

    	$$self.$inject_state = $$props => {
    		if ('date' in $$props) $$invalidate(0, date = $$props.date);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('list' in $$props) $$invalidate(2, list = $$props.list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [date, name, list];
    }

    class TimeLineItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { date: 0, name: 1, list: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TimeLineItem",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get date() {
    		throw new Error("<TimeLineItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set date(value) {
    		throw new Error("<TimeLineItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<TimeLineItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<TimeLineItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get list() {
    		throw new Error("<TimeLineItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set list(value) {
    		throw new Error("<TimeLineItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Education.svelte generated by Svelte v3.48.0 */
    const file$6 = "src\\components\\Education.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (56:4) {#each listInstitutions as institution}
    function create_each_block$1(ctx) {
    	let timelineitem;
    	let current;
    	const timelineitem_spread_levels = [/*institution*/ ctx[1]];
    	let timelineitem_props = {};

    	for (let i = 0; i < timelineitem_spread_levels.length; i += 1) {
    		timelineitem_props = assign(timelineitem_props, timelineitem_spread_levels[i]);
    	}

    	timelineitem = new TimeLineItem({
    			props: timelineitem_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(timelineitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(timelineitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const timelineitem_changes = (dirty & /*listInstitutions*/ 1)
    			? get_spread_update(timelineitem_spread_levels, [get_spread_object(/*institution*/ ctx[1])])
    			: {};

    			timelineitem.$set(timelineitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(timelineitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(timelineitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(timelineitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(56:4) {#each listInstitutions as institution}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let section;
    	let h2;
    	let i;
    	let t0;
    	let t1;
    	let div;
    	let current;
    	let each_value = /*listInstitutions*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");
    			h2 = element("h2");
    			i = element("i");
    			t0 = text(" Educacion");
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(i, "class", "fa-solid fa-graduation-cap");
    			add_location(i, file$6, 52, 4, 1123);
    			attr_dev(h2, "class", "section-title");
    			add_location(h2, file$6, 51, 2, 1091);
    			attr_dev(div, "class", "timeline__items svelte-gwdscf");
    			add_location(div, file$6, 54, 2, 1186);
    			attr_dev(section, "class", "timeline section svelte-gwdscf");
    			attr_dev(section, "id", "education");
    			add_location(section, file$6, 50, 0, 1038);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h2);
    			append_dev(h2, i);
    			append_dev(h2, t0);
    			append_dev(section, t1);
    			append_dev(section, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*listInstitutions*/ 1) {
    				each_value = /*listInstitutions*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Education', slots, []);

    	let listInstitutions = [
    		{
    			name: "Google",
    			date: "2020",
    			list: ["Introduccion al Desarrollo Web", "Ciberseguridad en el Teletrabajo"]
    		},
    		{
    			name: "freeCodeCamp",
    			date: "2020 - 2022",
    			list: [
    				"Frontend Basico (Html, Css)",
    				"JavaScript",
    				"Responsive Design",
    				"Desarrollo de Videojuegos con JS",
    				"Python"
    			]
    		},
    		{
    			name: "Udemy",
    			date: "2021",
    			list: ["JavaScript ES6", "React/Svelte", "Node/Esxpress", "TypeScript", "MongoDB"]
    		},
    		{
    			name: "Platzi",
    			date: "2021 - 2022",
    			list: [
    				"ECMAScript 6+",
    				"Desarrollo Frontend",
    				"JavaScript Asincrono",
    				"Manipulacion de Arrays en JS",
    				"Closures y Scope en JS",
    				"Svelte",
    				"NodeJS"
    			]
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Education> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ TimeLineItem, listInstitutions });

    	$$self.$inject_state = $$props => {
    		if ('listInstitutions' in $$props) $$invalidate(0, listInstitutions = $$props.listInstitutions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [listInstitutions];
    }

    class Education extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Education",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\Card.svelte generated by Svelte v3.48.0 */

    const file$5 = "src\\components\\Card.svelte";

    function create_fragment$5(ctx) {
    	let div2;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h3;
    	let t1;
    	let t2;
    	let div0;
    	let a0;
    	let i0;
    	let t3;
    	let t4;
    	let a1;
    	let i1;
    	let t5;
    	let t6;
    	let h6;
    	let t7;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			t1 = text(/*title*/ ctx[1]);
    			t2 = space();
    			div0 = element("div");
    			a0 = element("a");
    			i0 = element("i");
    			t3 = text(" Visit");
    			t4 = space();
    			a1 = element("a");
    			i1 = element("i");
    			t5 = text(" Code");
    			t6 = space();
    			h6 = element("h6");
    			t7 = text(/*tech*/ ctx[4]);
    			if (!src_url_equal(img.src, img_src_value = /*imgSrc*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*title*/ ctx[1]);
    			attr_dev(img, "class", "card__img svelte-m2bzns");
    			add_location(img, file$5, 9, 2, 153);
    			attr_dev(h3, "class", "card__title svelte-m2bzns");
    			add_location(h3, file$5, 11, 4, 237);
    			attr_dev(i0, "class", "fas fa-link");
    			add_location(i0, file$5, 14, 9, 379);
    			attr_dev(a0, "href", /*website*/ ctx[3]);
    			attr_dev(a0, "class", "card__button svelte-m2bzns");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$5, 13, 6, 314);
    			attr_dev(i1, "class", "fab fa-github");
    			add_location(i1, file$5, 17, 9, 494);
    			attr_dev(a1, "href", /*github*/ ctx[2]);
    			attr_dev(a1, "class", "card__button svelte-m2bzns");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$5, 16, 6, 430);
    			attr_dev(div0, "class", "card__buttons");
    			add_location(div0, file$5, 12, 4, 279);
    			attr_dev(div1, "class", "card__link svelte-m2bzns");
    			add_location(div1, file$5, 10, 2, 207);
    			attr_dev(h6, "class", "card__tech svelte-m2bzns");
    			add_location(h6, file$5, 21, 2, 564);
    			attr_dev(div2, "class", "card svelte-m2bzns");
    			add_location(div2, file$5, 8, 0, 131);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h3);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, a0);
    			append_dev(a0, i0);
    			append_dev(a0, t3);
    			append_dev(div0, t4);
    			append_dev(div0, a1);
    			append_dev(a1, i1);
    			append_dev(a1, t5);
    			append_dev(div2, t6);
    			append_dev(div2, h6);
    			append_dev(h6, t7);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*imgSrc*/ 1 && !src_url_equal(img.src, img_src_value = /*imgSrc*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*title*/ 2) {
    				attr_dev(img, "alt", /*title*/ ctx[1]);
    			}

    			if (dirty & /*title*/ 2) set_data_dev(t1, /*title*/ ctx[1]);

    			if (dirty & /*website*/ 8) {
    				attr_dev(a0, "href", /*website*/ ctx[3]);
    			}

    			if (dirty & /*github*/ 4) {
    				attr_dev(a1, "href", /*github*/ ctx[2]);
    			}

    			if (dirty & /*tech*/ 16) set_data_dev(t7, /*tech*/ ctx[4]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);
    	let { imgSrc } = $$props;
    	let { title } = $$props;
    	let { github } = $$props;
    	let { website } = $$props;
    	let { tech } = $$props;
    	const writable_props = ['imgSrc', 'title', 'github', 'website', 'tech'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('imgSrc' in $$props) $$invalidate(0, imgSrc = $$props.imgSrc);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('github' in $$props) $$invalidate(2, github = $$props.github);
    		if ('website' in $$props) $$invalidate(3, website = $$props.website);
    		if ('tech' in $$props) $$invalidate(4, tech = $$props.tech);
    	};

    	$$self.$capture_state = () => ({ imgSrc, title, github, website, tech });

    	$$self.$inject_state = $$props => {
    		if ('imgSrc' in $$props) $$invalidate(0, imgSrc = $$props.imgSrc);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('github' in $$props) $$invalidate(2, github = $$props.github);
    		if ('website' in $$props) $$invalidate(3, website = $$props.website);
    		if ('tech' in $$props) $$invalidate(4, tech = $$props.tech);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [imgSrc, title, github, website, tech];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			imgSrc: 0,
    			title: 1,
    			github: 2,
    			website: 3,
    			tech: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*imgSrc*/ ctx[0] === undefined && !('imgSrc' in props)) {
    			console.warn("<Card> was created without expected prop 'imgSrc'");
    		}

    		if (/*title*/ ctx[1] === undefined && !('title' in props)) {
    			console.warn("<Card> was created without expected prop 'title'");
    		}

    		if (/*github*/ ctx[2] === undefined && !('github' in props)) {
    			console.warn("<Card> was created without expected prop 'github'");
    		}

    		if (/*website*/ ctx[3] === undefined && !('website' in props)) {
    			console.warn("<Card> was created without expected prop 'website'");
    		}

    		if (/*tech*/ ctx[4] === undefined && !('tech' in props)) {
    			console.warn("<Card> was created without expected prop 'tech'");
    		}
    	}

    	get imgSrc() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imgSrc(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get github() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set github(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get website() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set website(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tech() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tech(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Portfolio.svelte generated by Svelte v3.48.0 */
    const file$4 = "src\\components\\Portfolio.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (38:4) {#each projects as project}
    function create_each_block(ctx) {
    	let card;
    	let current;
    	const card_spread_levels = [/*project*/ ctx[1]];
    	let card_props = {};

    	for (let i = 0; i < card_spread_levels.length; i += 1) {
    		card_props = assign(card_props, card_spread_levels[i]);
    	}

    	card = new Card({ props: card_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = (dirty & /*projects*/ 1)
    			? get_spread_update(card_spread_levels, [get_spread_object(/*project*/ ctx[1])])
    			: {};

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(38:4) {#each projects as project}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let section;
    	let h2;
    	let i;
    	let t0;
    	let t1;
    	let div;
    	let current;
    	let each_value = /*projects*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");
    			h2 = element("h2");
    			i = element("i");
    			t0 = text(" Portfolio");
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(i, "class", "fas fa-tasks");
    			add_location(i, file$4, 35, 28, 1156);
    			attr_dev(h2, "class", "section-title");
    			add_location(h2, file$4, 35, 2, 1130);
    			attr_dev(div, "class", "portfolio__container bd-grid svelte-1y4vcqn");
    			add_location(div, file$4, 36, 2, 1201);
    			attr_dev(section, "class", "portfolio section");
    			attr_dev(section, "id", "portfolio");
    			add_location(section, file$4, 34, 0, 1076);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h2);
    			append_dev(h2, i);
    			append_dev(h2, t0);
    			append_dev(section, t1);
    			append_dev(section, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*projects*/ 1) {
    				each_value = /*projects*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Portfolio', slots, []);

    	const projects = [
    		{
    			imgSrc: "images/project-01.png",
    			title: "Batatabit",
    			github: "https://github.com/LaureanoVera/todoapp-svelte",
    			website: "https://the-batabit.netlify.app/",
    			tech: "Html / Css / Js"
    		},
    		{
    			imgSrc: "images/project-02.png",
    			title: "TODOs App",
    			github: "https://github.com/LaureanoVera/landing-page-de-starbuckst",
    			website: "https://todoappglass.netlify.app/",
    			tech: "Svelte / Bootstrap / localStorage"
    		},
    		{
    			imgSrc: "images/project-03.png",
    			title: "Crypto Market",
    			github: "https://github.com/LaureanoVera/crypto-market",
    			website: "https://crypto-market-web.netlify.app/",
    			tech: "Svelte / CoinGecko API"
    		},
    		{
    			imgSrc: "images/project-04.png",
    			title: "Rockstars Michis",
    			github: "https://github.com/LaureanoVera/rockstars-michis",
    			website: "https://rockstar-michis.netlify.app/",
    			tech: "Svelte / TheCat API"
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Portfolio> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Card, projects });
    	return [projects];
    }

    class Portfolio extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Portfolio",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\Contact.svelte generated by Svelte v3.48.0 */

    const file$3 = "src\\components\\Contact.svelte";

    function create_fragment$3(ctx) {
    	let section;
    	let h2;
    	let i;
    	let t0;
    	let t1;
    	let div1;
    	let div0;
    	let h30;
    	let t3;
    	let span0;
    	let t5;
    	let h31;
    	let t7;
    	let span1;
    	let t9;
    	let h32;
    	let t11;
    	let span2;
    	let t13;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h2 = element("h2");
    			i = element("i");
    			t0 = text(" Contacto");
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			h30 = element("h3");
    			h30.textContent = "EMAIL";
    			t3 = space();
    			span0 = element("span");
    			span0.textContent = "laureanoigvera@gmail.com";
    			t5 = space();
    			h31 = element("h3");
    			h31.textContent = "PAIS";
    			t7 = space();
    			span1 = element("span");
    			span1.textContent = "Argentina, Buenos Aires";
    			t9 = space();
    			h32 = element("h3");
    			h32.textContent = "LINKEDIN";
    			t11 = space();
    			span2 = element("span");
    			span2.textContent = "Laureano Vera";
    			t13 = space();
    			img = element("img");
    			attr_dev(i, "class", "far fa-id-card");
    			add_location(i, file$3, 10, 28, 325);
    			attr_dev(h2, "class", "section-title");
    			add_location(h2, file$3, 10, 2, 299);
    			attr_dev(h30, "class", "contact__subtitle svelte-42kln6");
    			add_location(h30, file$3, 13, 6, 524);
    			attr_dev(span0, "class", "contact__text svelte-42kln6");
    			add_location(span0, file$3, 14, 6, 572);
    			attr_dev(h31, "class", "contact__subtitle svelte-42kln6");
    			add_location(h31, file$3, 15, 6, 639);
    			attr_dev(span1, "class", "contact__text svelte-42kln6");
    			add_location(span1, file$3, 16, 6, 686);
    			attr_dev(h32, "class", "contact__subtitle svelte-42kln6");
    			add_location(h32, file$3, 17, 6, 752);
    			attr_dev(span2, "class", "contact__text svelte-42kln6");
    			add_location(span2, file$3, 18, 6, 803);
    			attr_dev(div0, "class", "contact__info animate__animated");
    			attr_dev(div0, "id", "contact_info");
    			add_location(div0, file$3, 12, 4, 453);
    			attr_dev(img, "class", "animate__animated");
    			if (!src_url_equal(img.src, img_src_value = /*contactSrc*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Contact");
    			attr_dev(img, "id", "contact_img");
    			add_location(img, file$3, 20, 4, 869);
    			attr_dev(div1, "class", "contact__container bd-grid animate__animated svelte-42kln6");
    			attr_dev(div1, "id", "contact_info");
    			add_location(div1, file$3, 11, 2, 371);
    			attr_dev(section, "class", "contact section");
    			attr_dev(section, "id", "contact");
    			add_location(section, file$3, 9, 0, 249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h2);
    			append_dev(h2, i);
    			append_dev(h2, t0);
    			append_dev(section, t1);
    			append_dev(section, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h30);
    			append_dev(div0, t3);
    			append_dev(div0, span0);
    			append_dev(div0, t5);
    			append_dev(div0, h31);
    			append_dev(div0, t7);
    			append_dev(div0, span1);
    			append_dev(div0, t9);
    			append_dev(div0, h32);
    			append_dev(div0, t11);
    			append_dev(div0, span2);
    			append_dev(div1, t13);
    			append_dev(div1, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	let contactSrc = "images/contact.svg";

    	const animation = () => {
    		document.getElementById("contact_info");
    		document.getElementById("contact_img");
    		target.classList.add(animType);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ contactSrc, animation });

    	$$self.$inject_state = $$props => {
    		if ('contactSrc' in $$props) $$invalidate(0, contactSrc = $$props.contactSrc);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [contactSrc];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\Main.svelte generated by Svelte v3.48.0 */
    const file$2 = "src\\components\\Main.svelte";

    function create_fragment$2(ctx) {
    	let main;
    	let home;
    	let t0;
    	let about;
    	let t1;
    	let portfolio;
    	let t2;
    	let education;
    	let current;
    	home = new Home({ $$inline: true });
    	about = new About({ $$inline: true });
    	portfolio = new Portfolio({ $$inline: true });
    	education = new Education({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(home.$$.fragment);
    			t0 = space();
    			create_component(about.$$.fragment);
    			t1 = space();
    			create_component(portfolio.$$.fragment);
    			t2 = space();
    			create_component(education.$$.fragment);
    			attr_dev(main, "class", "l-main");
    			add_location(main, file$2, 9, 0, 277);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(home, main, null);
    			append_dev(main, t0);
    			mount_component(about, main, null);
    			append_dev(main, t1);
    			mount_component(portfolio, main, null);
    			append_dev(main, t2);
    			mount_component(education, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			transition_in(about.$$.fragment, local);
    			transition_in(portfolio.$$.fragment, local);
    			transition_in(education.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			transition_out(about.$$.fragment, local);
    			transition_out(portfolio.$$.fragment, local);
    			transition_out(education.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(home);
    			destroy_component(about);
    			destroy_component(portfolio);
    			destroy_component(education);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Home,
    		About,
    		Skills,
    		Education,
    		Portfolio,
    		Contact
    	});

    	return [];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\Footer.svelte generated by Svelte v3.48.0 */

    const file$1 = "src\\components\\Footer.svelte";

    function create_fragment$1(ctx) {
    	let footer;
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let p;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			p = element("p");
    			p.textContent = "©Laureano Vera 2022";
    			attr_dev(img, "class", "footer__image svelte-11pdk85");
    			if (!src_url_equal(img.src, img_src_value = /*footerSrc*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Laureano Vera Perfil");
    			add_location(img, file$1, 7, 6, 170);
    			attr_dev(div0, "class", "footer__data");
    			add_location(div0, file$1, 6, 4, 136);
    			attr_dev(p, "class", "svelte-11pdk85");
    			add_location(p, file$1, 10, 6, 294);
    			attr_dev(div1, "class", "footer__copy svelte-11pdk85");
    			add_location(div1, file$1, 9, 4, 260);
    			attr_dev(div2, "class", "footer__container svelte-11pdk85");
    			add_location(div2, file$1, 5, 2, 99);
    			attr_dev(footer, "class", "footer section svelte-11pdk85");
    			add_location(footer, file$1, 4, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div2);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	let footerSrc = "images/profile.jpg";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ footerSrc });

    	$$self.$inject_state = $$props => {
    		if ('footerSrc' in $$props) $$invalidate(0, footerSrc = $$props.footerSrc);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [footerSrc];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.48.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let div;
    	let header;
    	let t;
    	let main;
    	let current;
    	header = new Header({ $$inline: true });
    	main = new Main({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(header.$$.fragment);
    			t = space();
    			create_component(main.$$.fragment);
    			attr_dev(div, "class", "app");
    			add_location(div, file, 6, 0, 169);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(header, div, null);
    			append_dev(div, t);
    			mount_component(main, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(main.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(main.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(header);
    			destroy_component(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Header, Main, Footer });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
