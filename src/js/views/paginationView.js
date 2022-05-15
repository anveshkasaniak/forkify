import icons from 'url:../../img/icons.svg'; //parcel 2
import View from './view';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultPerPage
    );

    //page 1, and there are other pages
    if (currPage === 1 && numPages > 1) {
      return `
        <button class="btn--inline pagination__btn--next" data-goto=${
          currPage + 1
        }>
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    //Last page
    if (currPage === numPages && numPages > 1) {
      return `
         <button class="btn--inline pagination__btn--prev" data-goto=${
           currPage - 1
         }>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>`;
    }

    //Other page
    if (currPage < numPages) {
      return `
        <button class="btn--inline pagination__btn--prev" data-goto=${
          currPage - 1
        }>
           <svg class="search__icon">
             <use href="${icons}#icon-arrow-left"></use>
           </svg>
           <span>Page ${currPage - 1}</span>
         </button>
         <button class="btn--inline pagination__btn--next" data-goto=${
           currPage + 1
         }>
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }

    // page 1, and there are no other pages
    return '';
  }

  addHandlerClick(handle) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      handle(gotoPage);
    });
  }
}

export default new PaginationView();
