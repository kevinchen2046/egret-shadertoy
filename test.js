
console.log(('0000'.replace(Array.from({length:'453'.length},i=>"0").join(""),'453')));

console.log('453'.split('').map((v,i,array)=>(i+1)==array.length?v+Array.from({length:5-array.length},i=>"0").join(""):v).join(""))