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
            self.shopList = [];
        };

        /**
         * Check if there data in local storage and load it
         */
        self.loadData = function() {
            const localData = localStorage.getItem('shopList');

            if (localData) {

                self.shopList = JSON.parse(localData);

            }
        };

        /**
         * Add events listeners
         */
        self.setupListener = () => {
            self.openFooterBtn.addEventListener('click', self.openFooter);
            self.footer.addEventListener('click', self.closeFooter);
            self.input.addEventListener('keyup', self.handleKeyUp);
        };

        /**
         * Show footer with input field
         * @param {Object} event
         */
        self.openFooter = event => {
            event.preventDefault();

            self.container.classList.add('shopList_state_add');
        };

        /**
         * Close footer if click outside of footer input
         * @param {Object} event
         */
        self.closeFooter = event => {
            if (event.target === self.footer && self.input.value.length === 0) {

                self.container.classList.remove('shopList_state_add');

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
         * Render shop list
         */
        self.render = function() {
            const contentList = document.createElement('ul');

            contentList.classList.add('shopListMain__list');

            self.shopList.forEach(function(item) {
                const element = document.createElement('li');

                element.classList.add('shopListMain__item');
                element.innerHTML = self.template;

                element.querySelector('.shopListItem').id = item.id;
                element.querySelector('.shopListItem__content').innerHTML = item.title;

                if (item.isOpen) {

                    element.classList.add('shopListItem_state_open');

                }

                contentList.appendChild(element);
            });

            self.content.innerHTML = '';

            self.content.appendChild(contentList);
        };

        /**
         * Update local storage
         */
        self.updateLocalStorage = function() {
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
        };
    };

    const shopList = new ShopList();

    window.addEventListener('load', () => shopList.init());
    document.addEventListener('deviceready', () => shopList.init());
})();
