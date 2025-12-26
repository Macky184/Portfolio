document.addEventListener("DOMContentLoaded", () => {
    console.log("LOADED");
    const track = document.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    let index = 0;

    function update(){
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    document.querySelector(".next").addEventListener("click", () => {
        index = (index + 1) % slides.length;
        update();
    });

    document.querySelector(".prev").addEventListener("click", () => {
        index = (index - 1 + slides.length) % slides.length;
        update();
    });

});

