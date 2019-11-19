function menus() {
  for (var i = 0; i < numItems.value; i++) {
    document.getElementById('menuItem').innerHTML +=
      `
      <div class="form-group row">
        <label class="col-sm-2 col-form-label" >Dish Name ${i+1}: </label>
        <div class="col-sm-5">
          <input type="text" class="form-control" name="dishName${i}" id="dishName${i}" placeholder="e.g Chocolate Lava cake">
        </div>
        <label class=" col-form-label" >Dish Price: </label>
        <div class="col-sm-2">
          <input type="text" class="form-control" name="dishPrice${i}" id="dishPrice$${i}" placeholder="e.g $8.99">
        </div>
      </div>
      <div class="form-group row textcenter" >
        <label class="col-sm-2 col-form-label" for="menu"># of Ingredients: </label>
        <div class="col-sm-2">
          <input type="number" class="form-control" name="numIngredients" id="numIngredients${i}" placeholder="e.g 4">
        </div>
          <div class="col-sm-1">
            <button class="btn btn-primary btn-block" type="button" onclick="ingredients(${i})">Enter</button>
          </div>
      </div>
      <div id="test${i}">

      <div>
      `;
  }
}

function ingredients(id) {
  var numIngredients = document.getElementById('numIngredients' + id);
  for (var k = 0; k < numItems.value; k++) {
    for (var j = 0; j < numIngredients.value; j++) {
      document.getElementById(`test${k}`).innerHTML +=
        `
          <div class="form-group row">
            <label class="col-sm-2 col-form-label"> Ingredient Name ${j+1}: </label>
            <div class="col-sm-2">
              <input type="text" class="form-control" name="ingName${j}" id="ingName${j}" placeholder="e.g Nutella">
            </div>
            <label class="col-sm-1"> Amount: </label>
            <div class="col-sm-2">
              <input type="number" class="form-control" name="ingAmnt${j}" id="ingAmnt${j}" placeholder="e.g 3.5">
            </div>
            <label class="col-sm-1"> Cost: </label>
            <div class="col-sm-2">
              <input type="number" class="form-control" name="ingCost${j}" id="ingCost${j}" placeholder="e.g $0.9">
            </div>
            <div class="dropdown">
              <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Unit
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" href="#">Whole Item</a>
                <a class="dropdown-item" href="#">lbs</a>
                <a class="dropdown-item" href="#">Gallons</a>
                <a class="dropdown-item" href="#">Oz</a>
                <a class="dropdown-item" href="#">grams</a>
                <a class="dropdown-item" href="#">tb spoons</a>
                <a class="dropdown-item" href="#">fl Oz</a>
              </div>
            </div>
          </div>
        `;
    }
  }
}
