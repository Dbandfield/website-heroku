$(document).ready(function() // Wait for document to load
{


	function init()
	{
		var worksSidebar = $(".sidebar-work");
		var worksDetails = $(".work-window");

		$(".contact").hide();
		$(".world-window").hide();

		for(var i = 0; i < worksDetails.length; i ++) // iterate through each one
		{
			/* First, show only the first one */
			var e2 = worksDetails.eq(i);
			if(i == 0)
			{
				e2.show();
			}
			else
			{
				e2.hide();
			}

			/* Next sort out the gallery */
			var gallImages = e2.find($(".gallery-img"));
			gallImages.hide();//dont show them. just utility images.
			// set default imgto first
			var focusImg = e2.find($(".focus-art-img"));
			focusImg.attr("src", gallImages.eq(0).attr("src"));

			// set some data
			focusImg.data("imageIndex", 0);

			// add behaviour to arows to switch around images
			e2.find($(".left-arrow")).click(function()
			{
				var fIm = $(this).parents(".work-window").find($(".focus-art-img"));
				var gIms = $(this).parents(".work-window").find($(".gallery-img"));

				var ndx = fIm.data("imageIndex");
				if(ndx > 0)
				{
					ndx --;
					fIm.data("imageIndex", ndx);
					fIm.attr("src", gIms.eq(ndx).attr("src"));
				}
				else
				{
					ndx = gIms.length - 1;
					fIm.data("imageIndex", ndx);
					fIm.attr("src", gIms.eq(ndx).attr("src"));
				}
			});

			e2.find($(".right-arrow")).click(function()
			{
				var fIm = $(this).parents(".work-window").find($(".focus-art-img"));
				var gIms = $(this).parents(".work-window").find($(".gallery-img"));

				var ndx = fIm.data("imageIndex");
				if(ndx < gIms.length - 1)
				{
					ndx ++;
					fIm.data("imageIndex", ndx);
					fIm.attr("src", gIms.eq(ndx).attr("src"));
				}
				else
				{
					ndx = 0;
					fIm.data("imageIndex", ndx);
					fIm.attr("src", gIms.eq(ndx).attr("src"));
				}
			});
		}

		for(var i = 0; i < worksSidebar.length; i ++) // iterate through each one
		{
			currentE = worksSidebar.eq(i); // The current element
			var name = currentE.attr('id');
			currentE.click(function()
			{
				name = $(this).attr('id');
				for(var ii = 0; ii < worksDetails.length; ii ++) // iterate through each one
				{
					e2 = worksDetails.eq(ii);
					if(e2.attr('id') == name)
					{
						e2.fadeIn(800);
					}
					else
					{
						e2.hide();
						$(".contact").hide();
						$(".world-window").hide();
					}
				}
			})
		}

		// contact
		var contactButton = $(".contact-button");
		contactButton.click(function()
		{
			$(".contact").fadeIn(800);
			$(".work-window").hide();
			$(".world-window").hide();
			window.location.href = "#contact";
		});

		// virtual world page
		var worldButton = $(".world-button");
		worldButton.click(function()
		{
			$(".world-window").fadeIn(800);
			$(".work-window").hide();
			$(".contact").hide();
			window.location.href = "#worlds";
		})

		// image arrows
		$(".arrow").hide();
		$(".focus-art-img, .arrow").hover(
			function()
			{
				$(".arrow").show();
			},
			function()
			{
				$(".arrow").hide();
			}
		);

		// click to enter world
		$("#enter-pigs").click(function()
		{
			window.open("./worlds/genetic-audio-pigs/index.html", "_blank");
		})

	nameInit();

	}

	function animate()
	{
		nameAnimate();
	}



	init();
	animate();

});
