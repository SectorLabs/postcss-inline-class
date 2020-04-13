# postcss-inline-class

Inline CSS classes in other CSS classes using postcss.

## Examples

### Minimal example

```css
.a {
    color: red;
}

.b {
    @inline .a;
    font-size: 14px;
}
```
becomes
```css
.a {
    color: red;
}

.b {
    color: red;
    font-size: 14px;
}
```

### Multiple blocks

```css
.a {
    color: red;
}

.a, .b {
    font-size: 14px
}

.c {
    @inline .a;
}
```
becomes
```css
.a {
    color: red;
}

.a, .b {
    font-size: 14px
}

.c {
    color: red;
    font-size: 14px;
}
```

### Different files

```css
/* foo.css */

.a {
    color: red;
}

/* bar.css */

.b {
    @inline .a from './foo.css';
    font-size: 14px;
}
```
becomes
```css
/* foo.css */

.a {
    color: red;
}

/* bar.css */

.b {
    color: red;
    font-size: 14px;
}
```

### Nested

```css
.foo + div.a {
    color: red;
}

.b {
    @inline .a;
    font-size: 14px;
}
```
becomes 
```css
.foo + div.a {
    color: red;
}

.b {
    font-size: 14px;
}

.foo + div.b {
    color: red;
}
```

### Media queries

```css
.a {
    color: red;
}

@media (min-width: 240px) {
    .a {
        color: green;
    }
}

.b {
    @inline .a;
    font-size: 14px;
}
```
becomes
```css
.a {
    color: red;
}

@media (min-width: 240px) {
    .a {
        color: green;
    }
}

.b {
    color: red;
    font-size: 14px;
}

@media (min-width: 240px) {
    .b {
        color: green;
    }
}
```
