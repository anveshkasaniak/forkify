import icons from 'url:../../img/icons.svg';
import View from './view';
import previewView from './previewView';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query! Please try again :)';
  _message = '';

  _generateMarkup() {
    if (!this._data) return;
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView();
