(function (App) {
	'use strict';
	var clipboard = gui.Clipboard.get();

	App.View.FilterBar = Backbone.Marionette.ItemView.extend({
		className: 'filter-bar',
		ui: {
			searchForm: '.search form',
			searchInput: '.search input',
			search: '.search',
			searchClear: '.search .clear',
			sorterValue: '.sorters .value',
			typeValue: '.types .value',
			cityValue: '.cities .value',
			// categoryValue: '.categories .value',
			genreValue: '.genres  .value'
		},
		events: {
			'hover  @ui.searchInput': 'focus',
			'submit @ui.searchForm': 'search',
			'contextmenu @ui.searchInput': 'rightclick_search',
			'click  @ui.searchClear': 'clearSearch',
			'click  @ui.search': 'focusSearch',
			'click .sorters .dropdown-menu a': 'sortBy',
			'click .genres .dropdown-menu a': 'changeGenre',
			'click .cities .dropdown-menu a': 'changeCity',
			// 'click .categories .dropdown-menu a': 'changeCategory',
			'click .types .dropdown-menu a': 'changeType',
			'click #filterbar-settings': 'settings',
			'click #filterbar-about': 'about',
			'click .showTickets': 'showTickets',
			'click .showIdentities': 'showIdentities',
			'click .showMovies': 'showMovies',
			'click .showShows': 'showShows',
			'click .showAnime': 'showAnime',
			'click #filterbar-favorites': 'showFavorites',
			'click #filterbar-watchlist': 'showWatchlist',
			'click .triggerUpdate': 'updateDB'
		},

		focus: function (e) {
			e.focus();
		},
		setactive: function (set) {
			if (AdvSettings.get('startScreen') === 'Last Open') {
				AdvSettings.set('lastTab', set);
			}

			$('.filter-bar').find('.active').removeClass('active');
			switch (set) {
			case 'Tickets':
			case 'tickets':
				$('.source.showTickets').addClass('active');
				break;
			case 'Identities':
			case 'identities':
				$('.source.showIdentities').addClass('active');
				break;
			case 'TV Series':
			case 'shows':
				$('.source.showShows').addClass('active');
				break;
			case 'Movies':
			case 'movies':
				$('.source.showMovies').addClass('active');
				break;
			case 'Anime':
			case 'anime':
				$('.source.showAnime').addClass('active');
				break;
			case 'Favorites':
			case 'favorites':
				$('#filterbar-favorites').addClass('active');
				break;
			case 'Watchlist':
			case 'watchlist':
				$('#filterbar-watchlist').addClass('active');
				break;
			}
			$('.sorters .dropdown-menu a:nth(0)').addClass('active');
			$('.genres .dropdown-menu a:nth(0)').addClass('active');
			$('.types .dropdown-menu a:nth(0)').addClass('active');
		},
		rightclick_search: function (e) {
			e.stopPropagation();
			var search_menu = new this.context_Menu(i18n.__('Cut'), i18n.__('Copy'), i18n.__('Paste'));
			search_menu.popup(e.originalEvent.x, e.originalEvent.y);
		},

		context_Menu: function (cutLabel, copyLabel, pasteLabel) {
			var gui = require('nw.gui'),
				menu = new gui.Menu(),

				cut = new gui.MenuItem({
					label: cutLabel || 'Cut',
					click: function () {
						document.execCommand('cut');
					}
				}),

				copy = new gui.MenuItem({
					label: copyLabel || 'Copy',
					click: function () {
						document.execCommand('copy');
					}
				}),

				paste = new gui.MenuItem({
					label: pasteLabel || 'Paste',
					click: function () {
						var text = clipboard.get('text');
						$('#searchbox').val(text);
					}
				});

			menu.append(cut);
			menu.append(copy);
			menu.append(paste);

			return menu;
		},
		onShow: function () {

			var activetab;

			if (AdvSettings.get('startScreen') === 'Last Open') {
				activetab = AdvSettings.get('lastTab');
			} else {
				activetab = AdvSettings.get('startScreen');
			}

			if (typeof App.currentview === 'undefined') {

				switch (activetab) {
				case 'Identities':
					App.currentview = 'identities';
					break;
				case 'Tickets':
					App.currentview = 'tickets';
					break;
				case 'TV Series':
					App.currentview = 'shows';
					break;
				case 'Movies':
					App.currentview = 'movies';
					break;
				case 'Anime':
					App.currentview = 'anime';
					break;
				case 'Favorites':
					App.currentview = 'Favorites';
					App.previousview = 'movies';
					break;
				case 'Watchlist':
					App.currentview = 'Watchlist';
					App.previousview = 'movies';
					break;
				default:
					App.currentview = 'movies';
				}
				this.setactive(App.currentview);
			}

			this.$('.tooltipped').tooltip({
				delay: {
					'show': 800,
					'hide': 100
				}
			});

		},

		focusSearch: function () {
			this.$('.search input').focus();
		},

		search: function (e) {
			App.vent.trigger('about:close');
			App.vent.trigger('movie:closeDetail');
			e.preventDefault();
			var searchvalue = this.ui.searchInput.val();
			this.model.set({
				keywords: this.ui.searchInput.val(),
				genre: ''
			});

			this.ui.searchInput.blur();

			if (searchvalue === '') {
				this.ui.searchForm.removeClass('edited');
			} else {
				this.ui.searchForm.addClass('edited');
			}
		},

		clearSearch: function (e) {
			this.ui.searchInput.focus();

			App.vent.trigger('about:close');
			App.vent.trigger('movie:closeDetail');

			e.preventDefault();
			this.model.set({
				keywords: '',
				genre: ''
			});

			this.ui.searchInput.val('');
			this.ui.searchForm.removeClass('edited');

		},

		sortBy: function (e) {
			App.vent.trigger('about:close');
			this.$('.sorters .active').removeClass('active');
			$(e.target).addClass('active');

			var sorter = $(e.target).attr('data-value');

			if (this.previousSort === sorter) {
				this.model.set('order', this.model.get('order') * -1);
			} else if (this.previousSort !== sorter && sorter === 'alphabet') {
				this.model.set('order', this.model.get('order') * -1);
			} else {
				this.model.set('order', -1);
			}
			this.ui.sorterValue.text(i18n.__(sorter.capitalizeEach()));

			this.model.set({
				keyword: '',
				sorter: sorter
			});
			this.previousSort = sorter;
		},

		changeType: function (e) {
			App.vent.trigger('about:close');
			this.$('.types .active').removeClass('active');
			$(e.target).addClass('active');

			var type = $(e.target).attr('data-value');
			this.ui.typeValue.text(i18n.__(type));

			this.model.set({
				keyword: '',
				type: type
			});
		},

		changeGenre: function (e) {
			App.vent.trigger('about:close');
			this.$('.genres .active').removeClass('active');
			$(e.target).addClass('active');

			var genre = $(e.target).attr('data-value');
			this.ui.genreValue.text(i18n.__(genre));

			this.model.set({
				keyword: '',
				genre: genre
			});
		},

		changeCity: function (e) {
			App.vent.trigger('about:close');
			this.$('.cities .active').removeClass('active');
			$(e.target).addClass('active');

			var city = $(e.target).attr('data-value');
			this.ui.cityValue.text(i18n.__(city));

			this.model.set({
				keyword: '',
				city: city
			});
		},

		changeCategory: function (e) {
			App.vent.trigger('about:close');
			this.$('.categories .active').removeClass('active');
			$(e.target).addClass('active');

			var category = $(e.target).attr('data-value');
			this.ui.categoryValue.text(i18n.__(category));

			this.model.set({
				keyword: '',
				category: category
			});
		},

		settings: function (e) {
			App.vent.trigger('about:close');
			App.vent.trigger('settings:show');
			App.currentview = 'settings';
		},

		about: function (e) {
			App.vent.trigger('about:show');
		},

		showTickets: function (e) {
			e.preventDefault();

			App.currentview = 'tickets';
			App.vent.trigger('about:close');
			App.vent.trigger('tickets:list', []);
			this.setactive('Tickets');
		},

		showIdentities: function (e) {
			e.preventDefault();

			App.currentview = 'identities';
			App.vent.trigger('about:close');
			App.vent.trigger('identities:list', []);
			this.setactive('Identities');
		},

		showShows: function (e) {
			e.preventDefault();
			App.currentview = 'shows';
			App.vent.trigger('about:close');
			App.vent.trigger('shows:list', []);
			this.setactive('TV Series');
		},

		showAnime: function (e) {
			e.preventDefault();
			App.currentview = 'anime';
			App.vent.trigger('about:close');
			App.vent.trigger('anime:list', []);
			this.setactive('Anime');
		},

		showMovies: function (e) {
			e.preventDefault();

			App.currentview = 'movies';
			App.vent.trigger('about:close');
			App.vent.trigger('movies:list', []);
			this.setactive('Movies');
		},

		showFavorites: function (e) {
			e.preventDefault();

			if (App.currentview !== 'Favorites') {
				App.previousview = App.currentview;
				App.currentview = 'Favorites';
				App.vent.trigger('about:close');
				App.vent.trigger('favorites:list', []);
				this.setactive('Favorites');
			} else {

				if ($('#movie-detail').html().length === 0 && $('#about-container').html().length === 0) {
					App.currentview = App.previousview;
					App.vent.trigger(App.previousview.toLowerCase() + ':list', []);
					this.setactive(App.currentview);

				} else {
					App.vent.trigger('about:close');
					App.vent.trigger('favorites:list', []);
					this.setactive('Favorites');
				}

			}

		},

		showWatchlist: function (e) {
			e.preventDefault();

			if (App.currentview !== 'Watchlist') {
				App.previousview = App.currentview;
				App.currentview = 'Watchlist';
				App.vent.trigger('about:close');
				App.vent.trigger('watchlist:list', []);
				this.setactive('Watchlist');
			} else {
				if ($('#movie-detail').html().length === 0 && $('#about-container').html().length === 0) {
					App.currentview = App.previousview;
					App.vent.trigger(App.previousview.toLowerCase() + ':list', []);
					this.setactive(App.currentview);

				} else {
					App.vent.trigger('about:close');
					App.vent.trigger('watchlist:list', []);
					this.setactive('Watchlist');
				}

			}
			return false;
		},

		updateDB: function (e) {
			e.preventDefault();
			App.vent.trigger(this.type + ':update', []);
		}
	});

	App.View.FilterBar = App.View.FilterBar.extend({
		template: '#filter-bar-tpl'
	});

})(window.App);
