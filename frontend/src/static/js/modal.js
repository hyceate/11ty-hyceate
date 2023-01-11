// Get the modal link elements
var modal = document.getElementById("myModal");
var modalLinks = document.getElementsByClassName("modal-link");
var closeButton = document.querySelector(".closeButton");
function hideModal() {
  // remove the content from the section element
  modal.classList.remove("show-modal");
  modal.classList.add("hide-modal");
  var content = modal.querySelector(".inserted");
  modal.addEventListener("transitionend", function() {
    modal.style.display = "none";
    content.innerHTML="";
  });
}
// When the user clicks on a modal link, fetch the page's HTML content and show it in the modal
for (var i = 0; i < modalLinks.length; i++) {
  modalLinks[i].onclick = function(event) {
    event.preventDefault();  // prevent the default link behavior
    var url = this.href;  // get the URL to fetch
    var modalContent = modal.querySelector(".inserted");
    modalContent.innerHTML = "";
    fetch(url)
    .then(response => response.text())
    .then(html => {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, "text/html");
      var postContent = doc.getElementById("toBe");
      modalContent.insertAdjacentHTML("beforeend", postContent.innerHTML);
      modal.style.display = "flex";
      modal.classList.remove("hide-modal");
      modal.classList.add("show-modal");
    })
      .catch(error => console.log(error));  // log any errors that occur
  }
}
// When the user clicks on <span> (x), close the modal
closeButton.onclick = hideModal;
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target === modal) {
    hideModal();
  }
}
window.onpopstate = function(event) {
  if (event.state && event.state.modalOpen) {
    hideModal();
  }
};