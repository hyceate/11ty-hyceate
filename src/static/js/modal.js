document.addEventListener("DOMContentLoaded",function(){
  // Get the modal link elements
  var modal = document.getElementById("myModal");
  var modalContentContainer = document.querySelector(".modal-content");
  var modalLinks = document.getElementsByClassName("modal-link");
  var closeButton = document.querySelector(".closeButton");

  function toggleModal() {
    // remove the content from the section element
    modal.classList.toggle("show-modal");
    modalContentContainer.classList.remove("show-modal");
    var content = modal.querySelector(".inserted");
        if(!modal.classList.contains("show-modal")) {
        modal.classList.add("remove-content");
        setTimeout(function() {
            content.innerHTML="";
            modal.classList.remove("remove-content");
        }, 250);
  }
}
  // When the user clicks on a modal link, fetch the page's HTML content and show it in the modal
  for (var i = 0; i < modalLinks.length; i++) {
    modalLinks[i].onclick = function(event) {
      event.preventDefault();  // prevent the default link behavior
      var url = this.href;  // get the URL to fetch
      var modalContent = modal.querySelector(".inserted");
      var modalContentContainer = modal.querySelector(".modal-content");
      modalContent.innerHTML = "";
      fetch(url)
      .then(response => response.text())
      .then(html => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        var postContent = doc.getElementById("toBe");
        modalContent.insertAdjacentHTML("beforeend", postContent.innerHTML);
        modal.classList.toggle("show-modal");
        modalContentContainer.classList.toggle("show-modal");
      })
        .catch(error => console.log(error));  // log any errors that occur
    }
  }
  function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}
  closeButton.addEventListener("click", toggleModal);
  window.addEventListener("click", windowOnClick);
});