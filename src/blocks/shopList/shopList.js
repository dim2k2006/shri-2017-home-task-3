(() => {
    /**
     * Creates a new ShopList class.
     * @class
     */
    const ShopList = function() {
        const self = this;

        /**
         * Get options for module
         */
        self.getOptions = () => {
            self.container = document.querySelector('.shopList');
            self.content = document.querySelector('.shopListMain__content');
            self.template = document.querySelector('#shopListItem').innerHTML;
            self.openFooterBtn = document.querySelector('.shopListMain__open');
            self.footer = document.querySelector('.shopListFooter');
            self.input = document.querySelector('.shopListFooter__input');
            self.hidden = document.querySelector('.shopListFooter__hidden');
            self.form = document.querySelector('.shopListFooter__form');
            self.submitBtn = document.querySelector('.shopListFooter__btn.shopListFooter__btn_type_submit');
            self.shopList = [];
        };

        /**
         * Check if there data in local storage and load it
         */
        self.loadData = () => {
            const localData = localStorage.getItem('shopList');

            if (localData) {

                self.shopList = JSON.parse(localData);

            }
        };

        /**
         * Add events listeners
         */
        self.setupListener = () => {
            self.openFooterBtn.addEventListener('pointerdown', event => {
                event.preventDefault();

                self.openFooter();
            });

            self.footer.addEventListener('click', event => {
                if (event.target === self.footer && self.input.value.length === 0) {

                    self.closeFooter();

                }
            });
            self.input.addEventListener('keyup', self.handleKeyUp);
            self.form.addEventListener('submit', self.submit);
            self.submitBtn.addEventListener('pointerdown', self.handleSubmitBtn);
            self.container.addEventListener('click', self.routeClick);
        };

        /**
         * Routes click event
         * @param {Object} event
         */
        self.routeClick = event => {
            const target = event.target;
            let method = '';

            if (target.classList.contains('shopListItem__content')) {

                method = 'toggleItemPanel';

            } else if (target.classList.contains('shopListItem__btn_type_complete')) {

                method = 'complete';

            } else if (target.classList.contains('shopListItem__btn_type_edit')) {

                method = 'edit';

            }

            if (method) {

                self[method](event);

            }
        };

        /**
         * Toggle shop item panel
         * @param event
         */
        self.toggleItemPanel = event => {
            const target = event.target;

            if (target.classList.contains('shopListItem__content')) {

                const id = target.getAttribute('data-id');

                if (id) {

                    self.shopList = self.shopList.map(shopItem => {
                        if (shopItem.id == id) {

                            shopItem.isOpen = !shopItem.isOpen;

                        }

                        return shopItem;
                    });

                    self.render();
                    self.updateLocalStorage();

                }

            }
        };

        /**
         * Remove shop item from list
         * @param {Object} event
         */
        self.complete = event => {
            const target = event.target;
            const id = target.getAttribute('data-id');

            if (id) {

                self.shopList = self.shopList.filter(shopItem => {
                    return shopItem.id != id;
                });


                self.render();
                self.updateLocalStorage();

            }
        };

        /**
         * Edit shop item content
         * @param {Object} event
         */
        self.edit = event => {
            const target = event.target;
            const id = target.getAttribute('data-id');
            const value = self.shopList.find(shopItem => shopItem.id == id);

            if (id && value) {

                self.input.id = '';
                self.input.value = value.title;
                self.hidden.value = id;

                self.container.classList.add('shopList_state_valid');
                self.openFooter();

            }
        };

        /**
         * Show footer with input field
         */
        self.openFooter = () => {
            self.container.classList.add('shopList_state_add');

            setTimeout(() => {
                self.initFocus();
            }, 300);
        };

        /**
         * Close footer if click outside of footer input
         */
        self.closeFooter = () => {
            self.hideKeyboard();

            setTimeout(() => {
                self.container.classList.remove('shopList_state_add');
            }, 800);
        };

        /**
         * Hide keyboard
         */
        self.hideKeyboard = () => {
            if (Keyboard) {

                Keyboard.hide();

            }
        };

        /**
         * Check if input value length > 0 and change container state
         */
        self.handleKeyUp = () => {
            const value = self.input.value;
            const length = value.length;
            const method = length > 0 ? 'add' : 'remove';

            self.container.classList[method]('shopList_state_valid');
        };

        /**
         * Keep input focus
         * @param {Object} event
         */
        self.handleSubmitBtn = event => {
            event.preventDefault();

            self.submit();
        };

        /**
         * Set focus on input
         */
        self.initFocus = () => {
            self.input.focus();
        };

        /**
         * Handle form submission. Add new item to shop list
         * @param {Object} event
         */
        self.submit = event => {
            if (event) {

                event.preventDefault();

            }

            const value = self.input.value;
            const hiddenValue = self.hidden.value;
            const length = value.length;

            if (length === 0) {

                return false;

            }

            const shopListLength = self.shopList.length;
            const id = hiddenValue ? hiddenValue : self.shopList.length >= 1 ? self.shopList[self.shopList.length - 1].id + 1 : 0;
            const isOpen = false;
            const item = self.shopList.find(shopItem => shopItem.id == id);

            if (item) {

                item.title = value;
                self.closeFooter();

            } else {

                self.shopList.push({
                    id: id,
                    title: value,
                    isOpen: isOpen
                });

            }

            self.reset();
            self.render();
            self.updateLocalStorage();
        };

        /**
         * Reset form
         */
        self.reset = () => {
            self.form.reset();
            self.input.id = 'shopValue';
            self.hidden.value = '';
            self.container.classList.remove('shopList_state_valid');
        };

        /**
         * Render shop list
         */
        self.render = () => {
            const contentList = document.createElement('ul');

            contentList.classList.add('shopListMain__list');

            console.log(self.shopList);

            self.shopList.forEach(function(item) {
                const element = document.createElement('li');

                element.classList.add('shopListMain__item');
                element.innerHTML = self.template;

                element.querySelector('.shopListItem__content').setAttribute('data-id', item.id);
                element.querySelector('.shopListItem__content').innerHTML = item.title;
                element.querySelector('.shopListItem__btn_type_complete').setAttribute('data-id', item.id);
                element.querySelector('.shopListItem__btn_type_edit').setAttribute('data-id', item.id);

                if (item.isOpen) {

                    element.querySelector('.shopListItem').classList.add('shopListItem_state_open');

                }

                contentList.appendChild(element);
            });

            self.content.innerHTML = '';

            self.content.appendChild(contentList);
        };

        /**
         * Update local storage
         */
        self.updateLocalStorage = () => {
            const data = JSON.stringify(self.shopList);

            localStorage.setItem('shopList', data);
        };

        /**
         * Init module
         */
        self.init = () => {
            self.getOptions();
            self.setupListener();
            self.loadData();
            self.render();
            self.hideKeyboard();
        };
    };

    const shopList = new ShopList();

    document.addEventListener('deviceready', () => shopList.init());
})();
