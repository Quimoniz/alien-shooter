var Menu = {
    showMenu: function(whichMenu) {
      var overlayEle = Menu.createOverlay();
      if("new" == whichMenu)
      {
        var newGameButton = Menu.createButton(overlayEle, (window.innerHeight - 100) / 2, "New Game", Menu.newGameClicked);
        newGameButton.focus();
      } else if("end" == whichMenu)
      {
        Menu.createText(overlayEle, (window.innerHeight - 300) / 2, "Game Over");
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
