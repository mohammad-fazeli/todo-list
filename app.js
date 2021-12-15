const form = document.querySelector("#add_todo");
const select = document.querySelector("#select");
const todosBox = document.querySelector(".todos");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  todo.add(form.elements["todo"].value);
  form.elements["todo"].value = "";
});

select.addEventListener("change", (e) => {
  todo.filter(e.target.value);
});

class Todo {
  constructor(todosBox) {
    this._todosBox = todosBox;
    this._list = [];
    this._filter = "all";
    this.init();
    this.render();
  }

  init() {
    const todos = JSON.parse(localStorage.getItem("todo"));
    if (todos === null) {
      localStorage.setItem("todo", JSON.stringify([]));
    } else {
      this._list = todos;
    }
  }

  filter(arg) {
    if (arg === "all") {
      this._filter = "all";
    } else if (arg === "complate") {
      this._filter = "complate";
    } else if (arg === "active") {
      this._filter = "active";
    }
    this.render();
  }

  add(text) {
    if (text !== "") {
      this._list.push({
        text: text,
        id: this._list.length + 1,
        complate: false,
      });
      this.save();
    }
  }

  remove(id) {
    this._list = this._list.filter((e) => e.id != id);
    this.save();
  }

  toggle(id) {
    this._list = this._list.map((e) => {
      if (e.id == id) {
        return { ...e, complate: !e.complate };
      }
      return e;
    });
    this.save();
  }

  clearAll() {
    this._list = [];
    this.save();
  }

  render() {
    todosBox.innerHTML = "";
    let newLIst = this._list.slice();
    if (this._filter === "complate") {
      newLIst = this._list.filter((e) => e.complate === true);
    } else if (this._filter === "active") {
      newLIst = this._list.filter((e) => e.complate === false);
    }
    newLIst.forEach((element) => {
      const todo = document.createElement("div");
      todo.classList.add(`${element.complate && "complate"}`);
      todo.classList.add("todo");
      const textTodo = document.createElement("p");
      textTodo.classList.add(`${element.complate && "complate"}`);
      textTodo.innerHTML = element.text;
      const tbnContainer = document.createElement("div");
      const btnDelete = document.createElement("button");
      btnDelete.innerHTML = `<i class="fas fa-trash delete" id=${element.id}></i>`;
      btnDelete.addEventListener("click", (e) => {
        this.remove(e.target.id);
      });
      const btnToggle = document.createElement("button");
      btnToggle.innerHTML = `<i class="fa fa-check-square ckeck" id=${element.id}></i>`;
      btnToggle.setAttribute("id", element.id);
      btnToggle.addEventListener("click", (e) => {
        this.toggle(e.target.id);
      });
      tbnContainer.appendChild(btnDelete);
      tbnContainer.appendChild(btnToggle);

      todo.appendChild(textTodo);
      todo.appendChild(tbnContainer);
      this._todosBox.appendChild(todo);
    });
  }

  save() {
    localStorage.setItem("todo", JSON.stringify(this._list));
    this.render();
  }
}

const todo = new Todo(todosBox);
