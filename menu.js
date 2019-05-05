var Menu = {
    showMenu: function(whichMenu) {
      var overlayEle = Menu.createOverlay();
      if("new" == whichMenu)
      {
        var newGameButton = Menu.createButton(overlayEle, (window.innerHeight - 100) / 2, "New Game", Menu.newGameClicked);
        newGameButton.focus();
        var hintText = Menu.createHintText(overlayEle, (window.innerHeight - 200) / 2, "Now with mouse support");
      } else if("end" == whichMenu)
      {
        var gameOverText = Menu.createText(overlayEle, (window.innerHeight) / 2 - 200, "Game Over");
        gameOverText.style.color = "#ffffff";
        gameOverText.style.fontFamily = "Open Sans, Sans, Georgia";
        gameOverText.style.fontSize = "64pt";
        gameOverText.style.fontWeight = "bold";
        gameOverText.style.letterSpacing = "3px";
        gameOverText.style.wordSpacing = "5px";
        gameOverText.style.textShadow = "#d0d0d0 0px 2px 5px";
        Menu.createButton(overlayEle, 100, "Reload", Menu.reloadClicked);
      }
    },
    createOverlay: function ()
    {
      var BODY = document.getElementsByTagName("body")[0];
      var overlays = [ undefined, undefined ];
      for (var i = 0; i < 2; i++)
      {
          overlays[i] = document.createElement("div");
          overlays[i].setAttribute("class", "overlay");
          overlays[i].style.zIndex = "99" + i;
          overlays[i].style.width  = window.innerWidth + "px";
          overlays[i].style.height = window.innerHeight + "px";
          overlays[i].style.position= "absolute";
          overlays[i].style.left = "0px";
          overlays[i].style.top  = "0px";
          if(0 == i)
          {
              overlays[i].style.backgroundColor = "#606060";
              overlays[i].style.opacity = "0.5";
          } else if (1 == i)
          {
              overlays[i].style.textAlign = "center";
          }
          BODY.appendChild(overlays[i]);
      }

      return overlays[1];
    },
    createButton: function (parentNode, marginTop, buttonText, buttonCallback)
    {
      var buttonEle = document.createElement("button");
      buttonEle.setAttribute("class", "menu_button");
      buttonEle.style.zIndex = "992";
      buttonEle.style.margin = marginTop + "px auto 0px auto";
      parentNode.appendChild(buttonEle);
      buttonEle.appendChild(document.createTextNode(buttonText));
      buttonEle.addEventListener("click", buttonCallback);

      return buttonEle;
    },
    createText: function(parentNode, marginTop, text)
    {
      var textEle = document.createElement("div");
      textEle.setAttribute("class", "menu_text");
      textEle.style.zIndex = "991";
      textEle.style.margin = marginTop + "px auto 0px auto";
      parentNode.appendChild(textEle);
      textEle.appendChild(document.createTextNode(text));

      return textEle;
    },
    createHintText: function(parentNode, marginTop, text)
    {
      var textEle = document.createElement("div");
      textEle.setAttribute("class", "menu_text");
      textEle.style.zIndex = "991";
      textEle.style.position = "absolute";
      textEle.style.left = window.innerWidth / 2 + "px";
      textEle.style.top = marginTop + "px";
      textEle.style.transform = "rotate(10deg)";
      textEle.style.fontSize = "16pt";
      parentNode.appendChild(textEle);
      textEle.appendChild(document.createTextNode(text));

      return textEle;
    },
    newGameClicked: function () 
    {
      Menu.clearMenu();
      ProgramExecuter.initGame();
    },
    reloadClicked: function ()
    {
      location.reload();
    },
    clearMenu: function ()
    {
      var BODY = document.getElementsByTagName("body")[0];
      var overlays = document.querySelectorAll(".overlay");
      for (var i = 0; i < overlays.length; i++)
      {
        BODY.removeChild(overlays[i]);
      }
    }
};
