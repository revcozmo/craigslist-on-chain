<img class="icon-begin init-popin" src="/src/app/images/icon.png">
<br />
<!--img class="init-icon-title" src="/src/app/images/icons/big-logo.png"-->
<div class="init-geek-line">
	<%= i18n.__("Made with") %> <span style="color:#e74c3c;">&#10084;</span> <%= i18n.__("by a bunch of geeks from All Around The World") %>
</div>
<div class="text-begin">
	<div class="init-text"><%= i18n.__("Initializing " + App.Config.title + ". Please Wait...") %></div>
	<div class="init-progressbar">
		<div id="initbar-contents"></div>
	</div>
	<div id="init-status" class="init-status"></div>

	<p id='waiting-block' style="margin-top:20px;display:none">
			<a href='#' style='color:#fff;font-weight:bold;' class='fixApp'>Loading stuck ? Click here !</a>
	</p>

</div>
