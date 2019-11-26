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
            <button class="btn btn-primary btn-block" type="button" onclick="ingredients(${i}); this.onclick=null;">Enter</button>
          </div>
      </div>
      <div id="test${i}">

      <div>
      `;
  }
}

function ingredients(id) {
  var numIngredients = document.getElementById('numIngredients' + id);
  for (var j = 0; j < numIngredients.value; j++) {
    document.getElementById(`test${id}`).innerHTML +=
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
            <select name="pets" id="pet-select">
              <option value=""> Unit </option>
              <option value="dog">Whole Item(s)</option>
              <option value="cat">lbs</option>
              <option value="hamster">Oz</option>
              <option value="parrot">Gallons</option>
              <option value="spider">tb spoon(s)</option>
              <option value="goldfish">Fl Oz</option>
            </select>
          </div>
        `;
  }
}
