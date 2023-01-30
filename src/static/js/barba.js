// MODAL
function modal() {
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
            if (!modal.classList.contains("show-modal")) {
                modal.classList.add("remove-content");
                setTimeout(function () {
                    content.innerHTML = "";
                    modal.classList.remove("remove-content");
                }, 250);
            }
        }
        // When the user clicks on a modal link, fetch the page's HTML content and show it in the modal
        for (var i = 0; i < modalLinks.length; i++) {
            modalLinks[i].onclick = function (event) {
                event.preventDefault(); // prevent the default link behavior
                var url = this.href; // get the URL to fetch
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
                    .catch(error => console.log(error)); // log any errors that occur
            };
        }
        function windowOnClick(event) {
            if (event.target === modal) {
                toggleModal();
            }
        }
        closeButton.addEventListener("click", toggleModal);
        window.addEventListener("click", windowOnClick);
}
//BARBA
const loadingScreen = document.querySelector('.loading-screen')
const mainNavigation = document.querySelector('#header')
// Function to add and remove the page transition screen
function pageTransitionIn() {
    // loading screen to 1 opacity
  return gsap
    // .timeline()
    .to(loadingScreen, { duration: .25, opacity: 1})
}
// Function to add and remove the page transition screen
function pageTransitionOut(container) {
  // GSAP methods can be chained and return directly a promise
  return gsap
    .timeline({ delay: .2 }) // More readable to put it here
    .add('start') // Use a label to sync screen and content animation
    .to(loadingScreen, {
      duration: 0.25,
      opacity: 0,
      ease: 'power1.out'
    }, 'start')
    .call(contentAnimation, [container], 'start')
}
// Function to animate the content of each page
function contentAnimation(container) {
  // Query from container
  $(container.querySelector('#header')).addClass('show')
  // GSAP methods can be chained and return directly a promise
  return gsap
    .timeline()
    .from(container.querySelector('.is-animated'), {
      duration: 0.25,
      opacity: 1,
      stagger: 0.4
    })
    .from(mainNavigation, { duration: .2, opacity: 1})
}

barba.init({
  preventRunning: true,
    transitions: [{
      name: 'opacity-transition',
        async leave(data) {
        // code to update the menu
        const menuItems = document.querySelectorAll('.nav-link');
        menuItems.forEach(item => {
            item.classList.remove('current');
            item.removeAttribute('data-current');
        });
        const currentItem = document.querySelector(`.nav-link[href='${data.next.url.path}']`);
        currentItem.classList.add('current');
        currentItem.setAttribute('data-current', 'current item');

        await pageTransitionIn()
        data.current.container.remove()
      },
       async enter(data) {
        await pageTransitionOut(data.next.container)
      },
       async once(data){
        await contentAnimation(data.next.container);
      }
    }],
    views: [{
        namespace: 'Projects',
        async beforeEnter(){
            modal();
        }
    }],
     beforeEnter(){
    },
     afterEnter(){
    },
     onEnter({ current, next, trigger }) {
        console.log(data.next.namespace);
      }
  });

  