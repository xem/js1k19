// Introduction
// ============

// This demo is the geek sequel of Mini Unicode Toys (js1k.com/4104).
// Type any text, and it will be transformed in 21 different forms
// (HTML, JS, URL, hex + base64 for many encodings, and UTF-8 vs W1252 Mojibake)
// A more complete demo is available here: http://xem.github.io/escape/
// NB: The first "Windows-1252" field shows the input's chars that actually exist in the Windows-1252 encoding, and hides all the others.
// NB 2: the last two "Mojibake" fields show what happens when the Windows-1252 bytes are interpreted as UTF-8, and vice-versa, typically what you see when you open a file or a webpage with the wrong encoding.
// NB 3: the frontier between Latin-1 and Windows-1252 is quite complex, according to who you ask (Wikipedia, WHATWG or browsers). This was discussed here during the making of this demo: https://twitter.com/MaximeEuziere/status/1093493559737663488


// Margin
b.style.margin = "1em";

// Input
b.innerHTML = "<font face=arial><b><textarea id=a>H€llo 💻</textarea><p id=O>";

// On load and on input:
(oninput = _ => {

// Redraw all the fields
O.innerHTML = "<p>Code points<p><input size=99 id=c><p>HTML<p><input size=99 id=d><p><input size=99 id=e><p>JS / ES6<p><input size=99 id=f><p><input size=99 id=g><p>URI<p><input size=99 id=h><p>UTF-8<p><input size=99 id=j><p><input size=99 id=k><p>UTF-16 BE <p><input size=99 id=l><p><input size=99 id=m><p>UTF-16 LE<p><input size=99 id=n><p><input size=99 id=o><p>UTF-32 BE<p><input size=99 id=q><p><input size=99 id=r><p>UTF-32 LE<p><input size=99 id=s><p><input size=99 id=u><p>Latin-1<p><input size=99 id=w><p><input size=99 id=x><p><input size=99 id=B><p>Latin-1 > UTF-8<p><iframe width=600 height=50 id=C></iframe><p>UTF-8 > Latin-1<p><iframe width=600 height=50 id=D></iframe>"

// Save input text in "v", separate the glyphs in an array "t" and loop on them using "i".
for(i of t = [...v = a.value]){
  
  // Remember the current code point "p". 
  p = i.codePointAt();
  
  // URL-encode the current glyph "z".
  z = encodeURIComponent(i);
  if(z.length < 2){
    z = "%"+p.toString(16).padStart(2, 0)
  }
  
  // Code points ("U+....").
  c.value += "U+"+p.toString(16).padStart(p > 0xFFFF ? -5 : -4, 0)+" ";
  
  // HTML entities ("&#...;" / "&#x...;").
  d.value += "&#"+p+";";
  e.value += "&#x"+p.toString(16)+";";
  
  // ES6 escape ("\u{....}").
  g.value += "\\u{"+p.toString(16)+"}";
  
  // EncodeURI.
  h.value += z;
  
  // UTF-8 bytes (code point in base 16 for url-safe chars / same as url-encoded without "%" for the other chars).
  j.value += z.replace(/%(..)/g, "$1 ");
  
  // UTF-32 BE hex (same as code point but zero-padded up to 8 chars).
  q.value += p.toString(16).padStart(8, 0) + " ";
  
  // Windows-1252:
  // all ASCII chars (U+00 to U+7F) and chars U+A0 to U+FF, are similar to Unicode.
  // chars U+80 to U+9F use these glyphs: "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œž".
  // chars > U+FF are ignored
  W = "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ";
  
  // Compatible text 
  w.value += W.includes(i) ? i : p < 0x100 ? i : "";
  
  // Hex
  x.value += W.includes(i) ? (W.indexOf(i) + 128).toString(16).padStart(2,0) + " " : p < 0x100 ? p.toString(16).padStart(2,0) + " " : "";
  
  // Latin-1 char (for base64 conversion)
  B.value += W.includes(i) ? String.fromCodePoint(W.indexOf(i) + 128) : p < 0x100 ? String.fromCodePoint(p) : "";
}

// Encode the latin-1 string in base64.
B.value = btoa(B.value);

// Encode each byte of the UTF-8 string in latin-1 and convert the whole latin-1 string in base64 to see UTF-8 as base64.
k.value = btoa(j.value.replace(/.. /g, (a,b,c,d,e) => String.fromCodePoint(parseInt(a, 16))));

// Similarly, encode each byte of UTF-32 BE in latin-1 and base64 it to see UTF-32 BE as base64. 
r.value = btoa(q.value.replace(/(..)(..)(..)(..) /g, (a,b,c,d,e) => String.fromCodePoint(parseInt(b, 16)) + String.fromCodePoint(parseInt(c, 16)) + String.fromCodePoint(parseInt(d, 16)) + String.fromCodePoint(parseInt(e, 16))));

// Rearrange the bytes of UTF-32 BE to make UTF-32 LE.
s.value = q.value.replace(/(..)(..)(..)(..) /g, "$4$3$2$1 ");

// UTF-32 LE in base64.
u.value = btoa(s.value.replace(/(..)(..)(..)(..) /g, (a,b,c,d,e) => String.fromCodePoint(parseInt(b, 16)) + String.fromCodePoint(parseInt(c, 16)) + String.fromCodePoint(parseInt(d, 16)) + String.fromCodePoint(parseInt(e, 16))));

// Loop on UTF-16 BE char codes (a for-in loop in JS does that).
for(i in v){

  // Save the current code point "p".
  p = v[i].codePointAt();
  
  // JS escape ("\u....;").
  f.value += "\\u" + p.toString(16).padStart(4, 0);
  
  // UTF-16 BE hex.
  l.value += p.toString(16).padStart(4, 0) + " ";
}

// Encode the UTF-16 BE bytes in base64. 
m.value = btoa(l.value.replace(/(..)(..) /g, (a,b,c,d,e) => String.fromCodePoint(parseInt(b,16)) + String.fromCodePoint(parseInt(c, 16))));

// Convert UTF-16 BE bytes in UF-16 LE.
n.value = l.value.replace(/(..)(..) /g, "$2$1 ");

// Convert UTF-16 LE bytes to base64
o.value = btoa(n.value.replace(/(..)(..) /g, (a,b,c,d,e) => String.fromCodePoint(parseInt(b,16)) + String.fromCodePoint(parseInt(c, 16))));

// Mojibake:

// The following method (using XHR) didn't work on JS1K's shim (blocked by CSP)

// with(new XMLHttpRequest){open("GET","data:;charset=utf-8;base64," + B.value, !1), send(), C.value = responseText};

// with(new XMLHttpRequest){open("GET", "data:;base64," + k.value, !1), send(), D.value = responseText};

// The following method worked but took too many bytes and didn't allow Latin-1 to UTF-8 mojibake:

/*
D.value = j.value.replace(/.. /g, (a,b,c,d,e) => {
  b = parseInt(a, 16);
  console.log(b.toString(16));
  if(b > 0x7F && b < 0xA0){
    return W[b - 0x80];
  }
  return String.fromCodePoint(b);
})
*/

// So finally, I replaced the last two fields with iframes and forced them to display some base64 text with the wrong encoding:

// Show the Latin-1 base64 text as UTF-8
C.src = "data:;charset=utf-8;base64," + B.value;

// Show the UTF-8 base64 as Latin-1 (the default encoding for a webpage or an iframe)
D.src = "data:;base64," + k.value;

})()