const urlParams = new URLSearchParams(window.location.search);
const d = urlParams.get('d');

console.log(JSON.stringify(JSON.parse(atob(d)), null, 2));