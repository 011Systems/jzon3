/** @fileoverview test_JZON.js
*/

import test from 'tape';
import JZON from '../src/index.js';

test('stringify', (t) => {
  let foo={
    'name': 'foo',
    'mt'  : {},
    'bar' : 'baz',
    'abc' : 123.45,
    'nan' : NaN,
    '+inf' : Infinity,
    '-inf' : -Infinity,
    'null' : null,
    'undef': undefined,
    'undefInArr': [1, undefined, 3]
  };
  foo.foo=foo;

  let bar={
    'name': 'bar',
    'foo' : foo,
    'date' : new Date('2016-08-01T01:02:03Z'),
  };
  foo.bar=bar;
  bar.bar=bar;

  let r=JZON.stringify(foo);
  // console.log(r);
  t.equal(r,'{"name":"foo","mt":{},"bar":{"name":"bar","foo":"!__@1","date":"!__*2016-08-01T01:02:03.000Z","bar":"!__@3"},"abc":123.45,"nan":"!__#NaN","+inf":"!__#Infinity","-inf":"!__#-Infinity","null":null,"undefInArr":[1,null,3],"foo":"!__@1"}','stringify');

  t.end();
});


test('parse', (t) => {
  let text='{"name":"foo","mt":{},"bar":{"name":"bar","foo":"!__@1","date":"!__*2016-08-01T01:02:03.000Z","bar":"!__@3"},"abc":123.45,"nan":"!__#NaN","+inf":"!__#Infinity","-inf":"!__#-Infinity","null":null,"foo":"!__@1"}';

  let r=JZON.parse(text);
  // console.log(r);
  t.equal(r.name,'foo','foo');
  t.equal(r.bar.name,'bar','bar');
  t.ok(isNaN(r.nan),'nan');
  t.ok(r.bar.date instanceof Date,'date');
  t.equal(r['+inf'],Infinity,'+inf');
  t.equal(r['-inf'],-Infinity,'-inf');
  t.ok(r.null===null,'null');
  t.ok(r.bar.foo===r,'circ');
  t.ok(r.bar.bar===r.bar,'circ2');

  t.end();
});

// EOF
