var Menu = {
    showMenu: function() {
      var overlayEle = Menu.createOverlay();
      var newGameButton = Menu.createButton(overlayEle, (window.innerHeight - 100) / 2, "New Game", Menu.newGameClicked);
      newGameButton.focus();
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
    newGameClicked: function () 
    {
      Menu.clearMenu();
      ProgramExecuter.initGame();
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
