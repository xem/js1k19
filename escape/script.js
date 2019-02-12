b.innerHTML = `<font face=arial><b><textarea id=a>a©€💩</textarea><p id=O>`;

(oninput = _ => {

O.innerHTML = `<p>Code points<p><input size=99 id=c><p>HTML<p><input size=99 id=d><p><input size=99 id=e><p>JS/ES6<p><input size=99 id=f><p><input size=99 id=g><p>URI<p><input size=99 id=h><p>UTF8<p><input size=99 id=j><p><input size=99 id=k><p>UTF16BE <p><input size=99 id=l><p><input size=99 id=m><p>UTF16LE<p><input size=99 id=n><p><input size=99 id=o><p>UTF32BE<p><input size=99 id=q><p><input size=99 id=r><p>UTF32LE<p><input size=99 id=s><p><input size=99 id=u><p>Windows1252<p><input size=99 id=w><p><input size=99 id=x><p><input size=99 id=B><p>Windows1252 > UTF8<p><input size=99 id=C><p>UTF8 > Windows1252<p><input size=99 id=D>`


// Save input text in `v`, separate the glyphs in an array `t` and loop on them using `i`.
for(i of t = [...v = a.value]){
  
  // Remember the current code point `p`. 
  p = i.codePointAt();
  
  // URL-encode the current glyph `z`.
  z = encodeURIComponent(i);
  if(z.length < 2){
    z = `%`+p.toString(16).padStart(2, 0)
  }
  
  // Code points (`U+....`).
  c.value += `U+${p.toString(16).padStart(p > 0xFFFF ? -5 : -4, 0)} `;
  
  // HTML entities (`&#...;` / `&#x...;`).
  d.value += `&#${p};`;
  e.value += `&#x${p.toString(16)};`;
  
  // ES6 escape (`\u{....}`).
  g.value += `\\u{${p.toString(16)}}`;
  
  // EncodeURI.
  h.value += z;
  
  // UTF-8 bytes (code point in base 16 for url-safe chars / same as url-encoded without `%` for the other chars).
  j.value += z.replace(/%(..)/g, `$1 `);
  
  // UTF-32 BE hex (same as code point but zero-padded up to 8 chars).
  q.value += p.toString(16).padStart(8, 0) + ` `;
  
  // Windows-1252:
  // all ASCII chars (U+00 to U+7F) and chars U+A0 to U+FF, are similar to Unicode.
  // chars U+80 to U+9F use these glyphs: `€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œž`.
  // chars > U+FF are ignored
  
  W = `€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œž`;
  
  // Compatible text 
  w.value += W.includes(i) ? i : p < 0x100 ? i : ``;
  
  // Hex
  x.value += W.includes(i) ? (W.indexOf(i) + 128).toString(16).padStart(2,0) + ` ` : p < 0x100 ? p.toString(16).padStart(2,0) + ` ` : ``;
  
  // Latin-1 char (for base64 conversion)
  B.value += W.includes(i) ? String.fromCodePoint(W.indexOf(i) + 128) : p < 0x100 ? String.fromCodePoint(p) : ``;

    
}

// Encode the latin-1 string in base64.
B.value = btoa(B.value);

// XHR the Windws-1252 string encoded in base64, with a UTF-8 charset to see how it is interpreted as UTF-8. 
with(new XMLHttpRequest){open(`GET`,`data:;charset=utf-8;base64,` + B.value, !1), send(), C.value = responseText};

// Encode each byte of the UTF-8 string in latin-1 and convert the whole latin-1 string in base64 to see UTF-8 as base64.
k.value = btoa(j.value.replace(/.. /g, (a,b,c,d,e) => String.fromCodePoint(parseInt(a, 16))));

// Similarly, encode each byte of UTF-32 BE in latin-1 and base64 it to see UTF-32 BE as base64. 
r.value = btoa(q.value.replace(/(..)(..)(..)(..) /g, (a,b,c,d,e) => String.fromCodePoint(parseInt(b, 16)) + String.fromCodePoint(parseInt(c, 16)) + String.fromCodePoint(parseInt(d, 16)) + String.fromCodePoint(parseInt(e, 16))));

// Rearrange the bytes of UTF-32 BE to make UTF-32 LE.
s.value = q.value.replace(/(..)(..)(..)(..) /g, `$4$3$2$1 `);

// UTF-32 LE in base64.
u.value = btoa(s.value.replace(/(..)(..)(..)(..) /g, (a,b,c,d,e) => String.fromCodePoint(parseInt(b, 16)) + String.fromCodePoint(parseInt(c, 16)) + String.fromCodePoint(parseInt(d, 16)) + String.fromCodePoint(parseInt(e, 16))));

// Loop on UTF-16 BE char codes (a for-in loop in JS does that).
for(i in v){

  // Save the current code point `p`.
  p = v[i].codePointAt();
  
  // JS escape (`\u....;`).
  f.value += `\\u` + p.toString(16).padStart(4, 0);
  
  // UTF-16 BE hex.
  l.value += p.toString(16).padStart(4, 0) + ` `;
}

// Encode the UTF-16 BE bytes in base64. 
m.value = btoa(l.value.replace(/(..)(..) /g, (a,b,c,d,e) => String.fromCodePoint(parseInt(b,16)) + String.fromCodePoint(parseInt(c, 16))));

// Convert UTF-16 BE bytes in UF-16 LE.
n.value = l.value.replace(/(..)(..) /g, `$2$1 `);

// Convert UTF-16 LE bytes to base64
o.value = btoa(n.value.replace(/(..)(..) /g, (a,b,c,d,e) => String.fromCodePoint(parseInt(b,16)) + String.fromCodePoint(parseInt(c, 16))));

// XHR the UTF-8 string encoded in base64, with a Windows-1252 charset to see how it is interpreted as Windows-1252. 
with(new XMLHttpRequest){open(`GET`, `data:;base64,` + k.value, !1), send(), D.value = responseText};

})()