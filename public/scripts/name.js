var nameTextOriginal1 = "";
var nameTextEdited1 = "";
var nameTextArray1 = [];
var nameTextOriginal2 = "";
var nameTextEdited2 = "";
var nameTextArray2 = [];
var timeoutID;



	function nameInit()
	{
		nameTextOriginal1 = $(".name > .firstName").html();
		nameTextOriginal2 = $(".name > .secondName").html();

		$(".menu_item").mouseenter(function(){
			$(".menu_item").css("color", "#ffff00")
		});

		$(".menu_item").mouseleave(function(){
			$(".menu_item").css("color", "#ffcccc")
		});


	}

	function animHelper()
	{
		requestAnimationFrame(nameAnimate);
	}

	function nameAnimate()
	{
			timeoutID = window.setTimeout(animHelper, 100);
			$(".name > .firstName").html(nameTextOriginal1);
			//nameTextOriginal = $(".name > h1").html();
			nameTextEdited1 = nameTextOriginal1;
			nameTextArray1 = nameTextEdited1.split("");
			var randomChar = Math.floor(Math.random() * nameTextArray1.length);
			if(nameTextArray1[randomChar] != " ")
			{
				nameTextArray1[randomChar] = randomUnicode();
			}
			nameTextEdited1 = arrayToString(nameTextArray1);

			$(".name > .firstName").html(nameTextEdited1);

			$(".name > .secondName").html(nameTextOriginal2);
			//nameTextOriginal = $(".name > h1").html();
			nameTextEdited2 = nameTextOriginal2;
			nameTextArray2 = nameTextEdited2.split("");
			var randomChar = Math.floor(Math.random() * nameTextArray2.length);
			if(nameTextArray2[randomChar] != " ")
			{
				nameTextArray2[randomChar] = randomUnicode();
			}
			nameTextEdited2 = arrayToString(nameTextArray2);

			$(".name > .secondName").html(nameTextEdited2);
	}

	function randomUnicode()
	{
		var r = 32 + Math.floor(Math.random() * (126 - 32));
		return String.fromCharCode(r);
	}

	function arrayToString(arr)
	{
		var rtnS = "";
		for(var i = 0; i < arr.length; i ++)
		{
			rtnS = rtnS.concat(arr[i]);
		}

		return rtnS;
	}



