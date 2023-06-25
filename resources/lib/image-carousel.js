window.onload = function() 
{
    let carousels = document.querySelectorAll(".carousel");
    if (carousels.length > 0)
    {
        carousels.forEach(carousel => newCarousel(carousel));
        
        function newCarousel(carousel) 
        {
            let speed = carousel.dataset.speed;
            let carouselContent = carousel.querySelector(`.carousel-content`);

            const carouselLength = carouselContent.children.length;

            let width = $(".slideshow-container-showcase").width();
            console.log( "showcase width = " + width);

            let position = width;
            let positionIncrement = width;
            let int = setInterval(timer, speed);
        
            // initial transform
            carouselContent.style.transform = `translateX(-${width}px)`;
        
            function timer() 
            {
                if (position >= (positionIncrement - 2) * (carouselLength - 2)) 
                {
                    position = 0;
                    carouselContent.style.transform = `translateX(-${position}px)`;
                }
                position += positionIncrement;
                carouselContent.style.transform = `translateX(-${position}px)`;
            }

            function carouselClick() 
            {
                // left click
                carousel.children[0].addEventListener("click", function() 
                {
                    position -= width;
                    carouselContent.style.transform = `translateX(-${position}px)`;
                    if (position < positionIncrement) 
                    {
                        position = positionIncrement * (carouselLength - 2);
                        carouselContent.style.transform = `translateX(-${position}px)`;
                    }
                });
                // right click
                carousel.children[1].addEventListener("click", function() 
                {
                    position += width;
                    carouselContent.style.transform = `translateX(-${position}px)`;
                    if (position >= positionIncrement * (carouselLength - 1)) 
                    {
                        position = positionIncrement;
                        carouselContent.style.transform = `translateX(-${position}px)`;
                    }
                });
            }
        
            function carouselHoverEffect() 
            {
                // left hover effect events
                carousel.children[0].addEventListener("mouseenter", function() 
                {
                    carouselContent.style.transform = `translateX(-${position - 100}px)`;
                    clearInterval(int);
                }
                );
                carousel.children[0].addEventListener("mouseleave", function() 
                {
                    carouselContent.style.transform = `translateX(-${position}px)`;
                    int = setInterval(timer, speed);
                });
            
                // right hover effect events
                carousel.children[1].addEventListener("mouseenter", function() 
                {
                    carouselContent.style.transform = `translateX(-${position + 100}px)`;
                    clearInterval(int);
                });
                carousel.children[1].addEventListener("mouseleave", function() 
                {
                    carouselContent.style.transform = `translateX(-${position}px)`;
                    int = setInterval(timer, speed);
                });
            }
        
            carouselHoverEffect();
            carouselClick();
            
            //thos code recalculates the img elemet when the screen is resized
            window.addEventListener("resize", function() 
            {
                width = $(".slideshow-container-showcase").width();
                position = width;
                positionIncrement = width;

                carouselContent.style.transform = `translateX(-${width}px)`;
            });
        }
    }
}