# Bluejay CSS3 Framework

Bluejay is an opinionated mobile-first CSS3 framework that I use to design websites quickly and easily. It is yours free of charge to do with whatever you want. Tweak it by importing a `_variables.scss` and _Bluejay_ into your project. 

Bluejay is built on top of
[Normalize.css](https://necolas.github.io/normalize.css/). Normalize is a
great start for HTML5-based web design. Bluejay are simply my opionated, repeatable styles for [Grids](src/_grids.scss), [Forms](src/_forms.scss), [Buttons](src/_buttons.scss), [Tables](src/_tables.scss), and [Menus](src/_menus.scss) built on top of normalize. Use them at your own risk. 

[View a demo](#) of a clean Bluejay site. 

## Installation

Install via Bower (Recommended). You can also install it via NPM or Git. 

```bash
bower install bluejay
```

```bash
npm install bluejay
```

```bash
git clone git@github.com:kalebheitzman/bluejay.git ./sass/bluejay
```

Include Bluejay in the top of your main sass file. _Bower example:_

```sass
@import 'bower_components/bluejay/src/scss/bluejay.scss';
```

## Variables

Bluejay was created to be easily tweaked. I wanted something I could drop into my css to easily adjust and produce a different look for any sites I created. I've bundled all of my own personal styles into Bluejay with the ability to easily override the most common UI elements I use on websites. 

Here is an example of altering the max row width using ```$wrapper``` and the column gutter width using ```$gutter```. 

```sass
/* defined in a _variables.scss file thats in the same
   directory as your styles.scss file. */
$wrapper: 95rem; // max-width of your grid
$gutter: 0.5rem; // gutter for columns

// your main styles file
@import 'variables';
@import 'bluejay';
```

Be sure to look at [src/_variables.scss](src/_variables.scss) for details on each variable.

## Inspiration

* [Do you really need another grid
system](https://pawelgrzybek.com/do-you-really-need-another-grid-system/)
Original source of inspiration for bluejay
* [Pure CSS](http://purecss.io/) Size inspiration for breakpoints and mixins to include.
* [Sassy Button Mixin](http://codepen.io/jason-kinney/pen/AqbCi) Consistent global hovers and active states
* [Useful SASS Mixins](http://sachagreif.com/useful-sass-mixins/) Ideas for Extras
* [8 Sass mixins you must have](http://zerosixthree.se/8-sass-mixins-you-must-have-in-your-toolbox/) Ideas for Extras
* [Hamburger Codepen by Luiz](http://codepen.io/luizomf/pen/IwBom) Mobile Hamburger menu icon
* [Pure CSS Off Canvas Menu](http://codepen.io/rbardtke/pen/nfkdb) Responsive
Menu