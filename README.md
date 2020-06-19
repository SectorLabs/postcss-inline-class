[![CircleCI](https://circleci.com/gh/SectorLabs/postcss-inline-class/tree/master.svg?style=svg)](https://circleci.com/gh/SectorLabs/postcss-inline-class/tree/master)

# postcss-inline-class

A webpack plugin to inline CSS classes in other CSS classes using postcss.

## Installation

```
yarn add -D @sector-labs/postcss-inline-class
```

## Usage

Just add `postcss-inline-class` in the list of the webpack plugins

```js
plugins: [
    require('@sector-labs/postcss-inline-class')(),
]
```

## Resolving files

`postcss-inline-class` uses [resolve](https://github.com/browserify/resolve) under the hood to support file resolving.

```js
plugins: [
    require('@sector-labs/postcss-inline-class')({
        paths: [
            path.join(process.cwd(), '/theme/dark'),
            path.join(process.cwd(), '/theme/default'),
        ],
    }),
],
```

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
