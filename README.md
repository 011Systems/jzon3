# JZON3

Simple and fast alternative to standard JSON global object. It extends
standard functionality with circular references handling and support for other JS types,
Date, Infinity, -Infinity and NaN.

## Installation

  ```
  $ npm install --save jzon3
  ```

## Usage
```
  import JZON3 from 'jzon3'; // or var JZON3 = require('jzon3').default;

  let foo = {
    name: 'foo',
    nan : NaN,
    '+inf' : Infinity,
    '-inf' : -Infinity,
    'null' : null
  };

  foo.foo=foo;

  let bar={
    name: 'bar',
    foo: foo,
    date: new Date('2016-08-01T01:02:03Z')
  };

 let barStr = JZON3.stringify(bar);
 let bar2 = JZON3.parse(barStr);
 assert.deepEqual(bar, bar2);
```
## License
### ISC
https://en.wikipedia.org/wiki/ISC_license
