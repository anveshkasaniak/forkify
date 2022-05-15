import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultView from './views/resultView';
import bookmarksView from './views/bookmarksView';
import paginationView from './views/paginationView';

import addRecipeView from './views/addRecipeView';

import { MODEL_CLOSE_SEC } from './config';

//Parcel will do this, this is not a javascript
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //0 update resutls view to mark selected search results
    resultView.update(model.getSearchResultPage());
    bookmarksView.update(model.state.bookmarks);

    //1. Loading recipe
    await model.loadRecipe(id);

    //2. Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    //1 get search query
    const query = searchView.getQuery();
    if (!query) {
      resultView.renderError();
      return;
    }
    //2 load search result
    await model.loadSearchResults(query);

    //3 render results
    resultView.render(model.getSearchResultPage());

    //4 render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotoPage) {
  //3 render NEW results
  resultView.render(model.getSearchResultPage(gotoPage));

  //4 render NEW pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add are remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // Update recipe view
  recipeView.update(model.state.recipe);

  // render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinnder
    addRecipeView.renderSpinner();
    //upload new recepie
    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //render sucess message
    addRecipeView.renderMessage();

    //render the bookmark view

    bookmarksView.render(model.state.bookmarks);

    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err, '💥');
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
