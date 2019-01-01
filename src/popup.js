var form = document.getElementById("form");

var fqdn = document.getElementById("fqdn");
var light = document.getElementById("light");

var options = document.getElementById("options");
var toggle = document.getElementById("toggle");

var pass = document.getElementById("pass");
var copy = document.getElementById("copy");

var numbers = document.getElementById("numbers");
var lower = document.getElementById("lower");
var upper = document.getElementById("upper");
var symbols = document.getElementById("symbols");

// Set the default value of the FQDN using the tabs API
chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  fqdn.value = tabs[0].url.split("/")[2];
});

// Update the password
function updatePassword() {
  var charset = "";
  if(numbers.checked)
    charset += "0123456789";
  if(lower.checked)
    charset += "abcdefghijklmnopqrstuvwxyz";
  if(upper.checked)
    charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if(symbols.checked)
    charset += "!\"#$%&'()*+,./:;<=>?@[\\]^_`{|}~";
  
  var length = document.querySelector('input[name="length"]:checked').value;
  
  var time = Date.now();
  
  if(charset.length != 0) {
    argon2.hash({
      pass: fqdn.value + light.value,
      salt: charset + length,
      time: 4,
      mem: 1024,
      parallelism: 1,
      type: argon2.ArgonType.Argon2d
    }).then(h => {
      pass.value = convert(h.hashHex, "0123456789abcdef", charset).substring(0, length);
      console.log(Date.now() - time);
      copy.disabled = false;
    })
    .catch(e => console.error(e.message, e.code))
  } else {
    pass.value = "Please select a character set!";
	copy.disabled = true;
  }
  copy.innerHTML = "Copy";
}
updatePassword();

// Update the display on input change
form.addEventListener('input', updatePassword);

// Copy the password
function copyPassword() {
  pass.select();
  document.execCommand("copy");
  copy.disabled = true;
  copy.innerHTML = "Copied!"
}

// Copy password to clipboard on pressing enter or the copy button
document.addEventListener('keypress', function(e) {
  if(e.keyCode === 13 && !copy.disabled) {
    copyPassword();
  }
});
copy.onclick = copyPassword;

// Toggle visibility of options
function toggleOptions() {
  if(options.style.display === "none") {
    options.style.display = "block";
    toggle.innerHTML = "Hide Options";
  } else {
    options.style.display = "none";
    toggle.innerHTML = "Show Options";
  }
}

// Toggle visibility when button pressed
toggle.onclick = toggleOptions;