/** @fileoverview jzon3.js **/

const JZON3_PREFIX='!__',
      JZON3_OBJ  =JZON3_PREFIX+'@',
      JZON3_NUM  =JZON3_PREFIX+'#',
      JZON3_DATE =JZON3_PREFIX+'*';

export default class JZON3 {

  static stringify(obj) {
    let obj2cnt=new Map(),
        cnt=0;

    let Date_toJSON=Date.prototype.toJSON;
    Date.prototype.toJSON=undefined;

    let r=JSON.stringify(obj, function(key,val) {
      // console.log(`  > ${key} = ${val}`);
      if(val===null) return val;
      // if(val===undefined) return JZON3_UNDEF;

      if(typeof val==='object') {
        if(val instanceof Date) return JZON3_DATE+val.toISOString();

        let oid=obj2cnt.get(val);
        if(oid) return JZON3_OBJ+oid;
         obj2cnt.set(val,++cnt);
         // console.log(`    --> ${cnt}`);
         return val;
       }

       if(typeof val==='number') {
         if(!isFinite(val) || isNaN(val)) return JZON3_NUM+val;
         return val;
       }

       return val;
    });

    Date.prototype.toJSON=Date_toJSON;

    return r;
  }


  static parse(text) {
    let cnt2obj=new Map(),
        cnt=0;

    // console.log(text);
    let r=JSON.parse(text, function(key,val) {
      // console.log(`  > ${key} = ${val}`);
      if(val===null) return val;
      // if(val===JZON3_UNDEF) return undefined;  // does not work!

      if(typeof val==='string') {
        if(val.startsWith(JZON3_NUM)) return Number(val.substr(JZON3_NUM.length));
        if(val.startsWith(JZON3_DATE)) return new Date(val.substr(JZON3_DATE.length));
        return val;
      }

      return val;
    });

    function traverse(obj,level=0) {
      if(obj==null) return;
      cnt2obj.set(++cnt,obj);
      // console.log(`@${cnt}`);
      for(let key in obj) {
        let val=obj[key];
        // console.log(`--  [${level}] ${key}=${val}`);
        if(typeof val==='object') {
          if(val instanceof Date) continue;
          traverse(val,level+1);
        } else if(typeof val==='string') {
          if(val.startsWith(JZON3_OBJ)) {
            let fix=cnt2obj.get(Number(val.substr(JZON3_OBJ.length)));
            // console.log(`         ${val} => ${fix.name}`);
            obj[key]=fix;
          }
        }
      }
    }
    traverse(r);

    return r;
  }

}

// EOF
